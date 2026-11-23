#!/usr/bin/env node
// scripts/coletor-snapshots.mjs
//
// Coletor de "fotos" dos totais por instituição do portal.
//
// Por que existe: o ETL registra `antes`/`depois` apenas em totais globais.
// Para responder "a UESC estava com 1.100 pesquisadores antes da carga e ficou
// com 1.124 depois" precisamos guardar o resultado de `GET /simcc/api/institution`
// periodicamente e comparar a foto anterior com a posterior de cada carga.
//
// Como funciona:
//   1. Lê `GET /simcc/api/institution` (totais por instituição);
//   2. Lê `GET /etl/consistencia/export?apenas_ultimos=true` para saber se há
//      rotina EM_ANDAMENTO e qual foi a última execução (opcional: só acontece
//      se ETL_API_KEY estiver definida);
//   3. Grava um arquivo JSON em `snapshots/` e atualiza `snapshots/index.json`.
//
// Cadência: o workflow checa a cada 6 horas, mas uma foto só é gravada quando
// os números mudam ou quando uma rotina do ETL termina. Na prática isso dá
// ~1 foto por carga (mensal), em vez de 1460 fotos idênticas por mês.
// A comparação não depende de estar rodando no momento da carga: o front usa o
// `coletado_em` de cada foto contra `iniciado_em` e `finalizado_em` do ETL.
//
// Uso:
//   node scripts/coletor-snapshots.mjs                    # grava em ./snapshots
//   node scripts/coletor-snapshots.mjs --saida ./public/snapshots
//   node scripts/coletor-snapshots.mjs --reter 240        # ~2 anos de fotos
//   node scripts/coletor-snapshots.mjs --forcar           # grava mesmo sem mudança
//
// Variáveis de ambiente:
//   API_URL         base da API do portal (padrão: produção)
//   ETL_URL         base do SimCC ETL
//   ETL_API_KEY     chave do endpoint de exportação (opcional)
//   SNAPSHOTS_DIR   pasta de saída (equivalente a --saida)
//   SNAPSHOTS_RETER quantas fotos manter (equivalente a --reter)

import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API_PADRAO = 'https://observatoriocti.secti.ba.gov.br/simcc/api';
const ETL_PADRAO = 'https://simcc.uesc.br/etl';
const RETENCAO_PADRAO = 240;

/** Campos numéricos que interessam do endpoint de instituições */
const CAMPOS_METRICAS = [
  'count_r',
  'count_gp',
  'count_gpr',
  'count_gps',
  'count_foment',
  'count_rg',
  'count_d',
  'count_t',
];

function lerArgumentos(argv) {
  const opcoes = {};
  for (let i = 0; i < argv.length; i += 1) {
    const atual = argv[i];
    if (atual === '--saida') opcoes.saida = argv[i + 1];
    if (atual === '--reter') opcoes.reter = Number(argv[i + 1]);
    if (atual === '--forcar') opcoes.forcar = true;
    if (atual === '--ajuda' || atual === '-h') opcoes.ajuda = true;
  }
  return opcoes;
}

async function buscarJson(url, cabecalhos = {}) {
  const resposta = await fetch(url, {
    headers: { Accept: 'application/json', ...cabecalhos },
    signal: AbortSignal.timeout(30000),
  });
  if (!resposta.ok) {
    throw new Error(`HTTP ${resposta.status} em ${url}`);
  }
  return resposta.json();
}

/** Totais por instituição, sem a lista de currículos (não interessa e pesa) */
async function coletarInstituicoes(apiUrl) {
  const dados = await buscarJson(`${apiUrl}/institution`);
  if (!Array.isArray(dados)) {
    throw new Error('O endpoint /institution não devolveu uma lista.');
  }

  return dados
    .filter((item) => item?.acronym)
    .map((item) => {
      const instituicao = {
        id: item.id,
        sigla: item.acronym,
        nome: item.name,
      };
      CAMPOS_METRICAS.forEach((campo) => {
        instituicao[campo] = Number(item[campo] ?? 0);
      });
      return instituicao;
    })
    .sort((a, b) => b.count_r - a.count_r || a.sigla.localeCompare(b.sigla));
}

/**
 * Situação do ETL no momento da foto.
 * Falha aqui não impede a coleta — só deixa a marcação vazia.
 */
async function coletarEtl(etlUrl, chave) {
  if (!chave) return null;

  try {
    const registros = await buscarJson(
      `${etlUrl}/consistencia/export?apenas_ultimos=true&limit=200`,
      { 'X-ETL-API-Key': chave },
    );
    if (!Array.isArray(registros)) return null;

    const emAndamento = registros.filter((registro) => registro.estado === 'EM_ANDAMENTO');
    const concluidas = registros
      .filter((registro) => registro.finalizado_em)
      .sort((a, b) => new Date(a.finalizado_em) - new Date(b.finalizado_em));
    const ultima = concluidas[concluidas.length - 1];

    return {
      em_andamento: emAndamento
        .map((registro) => registro.resultado?.tipo || registro.tipo)
        .filter(Boolean),
      ultima_execucao: ultima
        ? {
            tipo: ultima.resultado?.tipo || ultima.tipo,
            estado: ultima.estado,
            iniciado_em: ultima.iniciado_em || null,
            finalizado_em: ultima.finalizado_em || null,
          }
        : null,
      // Quando a rotina mais recente terminou. Serve para gravar a foto
      // "depois" da carga mesmo quando ela não mudou nenhum número.
      concluida_em: ultima?.finalizado_em || null,
    };
  } catch (erro) {
    console.warn(`Aviso: não foi possível ler o ETL (${erro.message}).`);
    return null;
  }
}

function nomeArquivo(coletadoEm) {
  return `${coletadoEm.replace(/[:.]/g, '-')}.json`;
}

async function lerIndice(pasta) {
  try {
    const conteudo = await readFile(path.join(pasta, 'index.json'), 'utf8');
    const indice = JSON.parse(conteudo);
    return Array.isArray(indice.snapshots) ? indice.snapshots : [];
  } catch {
    return [];
  }
}

/** Apaga as fotos mais antigas acima da retenção */
async function aplicarRetencao(pasta, entradas, reter) {
  const excedentes = entradas.slice(0, Math.max(0, entradas.length - reter));
  for (const entrada of excedentes) {
    try {
      await unlink(path.join(pasta, entrada.arquivo));
    } catch {
      // arquivo já removido — segue o baile
    }
  }
  return entradas.slice(-reter);
}

/** Conteúdo da foto mais recente, para comparar antes de gravar outra */
async function lerUltimaFoto(pasta, entradas) {
  const ultima = entradas[entradas.length - 1];
  if (!ultima?.arquivo) return null;
  try {
    return JSON.parse(await readFile(path.join(pasta, ultima.arquivo), 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Assinatura dos números que interessam.
 * Muda apenas quando alguma contagem de instituição muda — que é justamente o
 * efeito de uma carga. Nome e sigla ficam de fora para uma correção de texto
 * não gerar foto.
 */
const assinatura = (instituicoes) =>
  (instituicoes || [])
    .map((instituicao) => `${instituicao.id}:${CAMPOS_METRICAS.map((campo) => instituicao[campo] ?? 0).join(',')}`)
    .join('|');

async function principal() {
  const opcoes = lerArgumentos(process.argv.slice(2));
  if (opcoes.ajuda) {
    console.log(
      'Uso: node scripts/coletor-snapshots.mjs [--saida pasta] [--reter N] [--forcar]',
    );
    return;
  }

  const apiUrl = (process.env.API_URL || API_PADRAO).replace(/\/$/, '');
  const etlUrl = (process.env.ETL_URL || ETL_PADRAO).replace(/\/$/, '');
  const pasta = path.resolve(opcoes.saida || process.env.SNAPSHOTS_DIR || 'snapshots');
  const reter = opcoes.reter || Number(process.env.SNAPSHOTS_RETER || RETENCAO_PADRAO);

  await mkdir(pasta, { recursive: true });

  const coletadoEm = new Date().toISOString();
  const [instituicoes, etl] = await Promise.all([
    coletarInstituicoes(apiUrl),
    coletarEtl(etlUrl, process.env.ETL_API_KEY || ''),
  ]);

  const anteriores = await lerIndice(pasta);
  const ultimaFoto = await lerUltimaFoto(pasta, anteriores);

  // A foto é a régua da carga: só vale gravar quando algo mudou ou quando uma
  // rotina do ETL terminou depois da última foto. Rodar a cada 6 horas e não
  // gravar nada quando o banco está parado mantém ~1 foto por carga.
  const numerosMudaram = !ultimaFoto || assinatura(ultimaFoto.instituicoes) !== assinatura(instituicoes);
  const cargaConcluidaDepois =
    Boolean(etl?.concluida_em && ultimaFoto) &&
    new Date(etl.concluida_em) > new Date(ultimaFoto.coletado_em);

  if (!opcoes.forcar && ultimaFoto && !numerosMudaram && !cargaConcluidaDepois) {
    const total = instituicoes.reduce((soma, item) => soma + item.count_r, 0);
    console.log(
      `Sem mudança desde ${ultimaFoto.coletado_em} (${instituicoes.length} instituições, ` +
        `${total} pesquisadores) — foto não gravada.`,
    );
    return;
  }

  const fotografia = {
    coletado_em: coletadoEm,
    fonte: `${apiUrl}/institution`,
    etl,
    instituicoes,
  };

  const arquivo = nomeArquivo(coletadoEm);
  await writeFile(path.join(pasta, arquivo), `${JSON.stringify(fotografia)}\n`, 'utf8');

  const entradas = [
    ...anteriores.filter((entrada) => entrada.arquivo !== arquivo),
    {
      arquivo,
      coletado_em: coletadoEm,
      em_andamento: etl?.em_andamento || [],
      instituicoes: instituicoes.length,
    },
  ].sort((a, b) => new Date(a.coletado_em) - new Date(b.coletado_em));

  const mantidas = await aplicarRetencao(pasta, entradas, reter);

  await writeFile(
    path.join(pasta, 'index.json'),
    `${JSON.stringify({ atualizado_em: coletadoEm, snapshots: mantidas }, null, 2)}\n`,
    'utf8',
  );

  const totalPesquisadores = instituicoes.reduce((soma, item) => soma + item.count_r, 0);
  console.log(
    `Foto ${arquivo}: ${instituicoes.length} instituições, ${totalPesquisadores} pesquisadores` +
      (numerosMudaram ? ' (números mudaram)' : ' (carga concluída)') +
      (etl?.em_andamento?.length ? `, ETL em andamento (${etl.em_andamento.join(', ')})` : '') +
      ` — ${mantidas.length} fotos guardadas.`,
  );
}

/** Remove arquivos órfãos (fora do índice) para não crescer sem controle */
async function limparOrfaos(pasta, mantidas) {
  const permitidos = new Set([...mantidas.map((entrada) => entrada.arquivo), 'index.json']);
  const arquivos = await readdir(pasta);
  for (const arquivo of arquivos) {
    if (!permitidos.has(arquivo) && arquivo.endsWith('.json')) {
      await unlink(path.join(pasta, arquivo)).catch(() => {});
    }
  }
}

principal()
  .then(async () => {
    const pasta = path.resolve(
      lerArgumentos(process.argv.slice(2)).saida || process.env.SNAPSHOTS_DIR || 'snapshots',
    );
    await limparOrfaos(pasta, await lerIndice(pasta));
  })
  .catch((erro) => {
    console.error(`Falha ao coletar snapshots: ${erro.message}`);
    process.exitCode = 1;
  });
