# Observatório CT&I Bahia · Portal Frontend (`observatorio-front`)

Aplicação web principal (SPA) do **Observatório de Ciência, Tecnologia e Inovação do Estado da Bahia (SECTI)**. Apresenta indicadores agregados de produção científica, pesquisadores em destaque, nuvens de palavras temáticas, infográficos, eixos estratégicos (como Mulheres na Ciência) e integração com os demais módulos do ecossistema (**SimCC**, **Fomento**, **VIP** e **Maria**).

> 🎨 **Design System**: As diretrizes visuais, paleta de cores (*Simcc Intelligence*), tipografia (`Lexend`) e regras de superfície estão documentadas em [`DESIGN.md`](DESIGN.md).

---

## 🧱 Stack e Arquitetura

- **React 19** + **Vite 8** + **React Router DOM 7**
- **Tailwind CSS 3** para estilização baseada nos tokens do [`DESIGN.md`](DESIGN.md)
- **TanStack React Query 5** + **Axios** para consumo de APIs, cache e sincronização de estado assíncrono
- **Highcharts** (`highcharts-react-official`) e **React Wordcloud** para visualizações de dados e indicadores científicos
- **Lucide React** para iconografia

---

## 📁 Estrutura de Diretórios

```text
observatorio-front/
├── public/                        # Brasões, logos institucionais (SECTI, SIMCC, VIP, Universidades) e infográficos
├── src/
│   ├── assets/                    # Imagens estáticas da aplicação
│   ├── components/
│   │   ├── layout/                # Cabeçalho (com SSO), rodapé e estrutura de navegação
│   │   ├── sections/              # Seções temáticas da página inicial e painéis
│   │   ├── ui/                    # Componentes visuais reutilizáveis
│   │   ├── DadosDestaqueSection.jsx
│   │   ├── FeaturedResearchers.jsx
│   │   ├── HeroMetricCards.jsx
│   │   └── InitialHome.jsx
│   ├── constants/                 # Links institucionais, constantes de busca do SimCC e metadados do módulo de consistência
│   ├── context/                   # Contexto global de autenticação SSO (AuthContext.jsx)
│   ├── data/                      # Metadados de instituições parceiras e módulos do ecossistema
│   ├── hooks/                     # Hooks React Query (useAuth, pesquisadores destaque, métricas home, consistência)
│   ├── lib/                       # Utilitários gerais (utils.js, auth-storage.js, consistencia.js)
│   ├── pages/                     # Páginas da aplicação (AuthCallback.jsx, VerificacaoConsistencia/)
│   ├── services/                  # Clientes HTTP (api.js, authService.js, consistenciaService.js, homeService.js, researcherService.js)
│   ├── App.jsx                    # Componente raiz, provedores e roteamento
│   └── main.jsx                   # Ponto de montagem React e QueryClientProvider
├── DESIGN.md                      # Especificação do Design System
├── Dockerfile                     # Build multi-stage para distribuição estática
├── compose.yaml                   # Serviço Docker para execução containerizada
└── package.json
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+ e `npm`

### 1. Instalação
```bash
npm install
```

### 2. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
A aplicação ficará disponível em `http://localhost:5173`.

### 3. Build de Produção e Docker
```bash
# Gerar bundle estático em dist/
npm run build

# Ou exportar via Docker
docker build --output dist .
```

---

## ⚙️ Configuração (`.env`)

As variáveis de ambiente configuram o acesso às APIs do ecossistema e ao provedor central de identidade (SSO):

| Variável | Descrição | Padrão |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API do SimCC/Observatório para busca de métricas e pesquisadores | `https://observatoriocti.secti.ba.gov.br/simcc/api` |
| `VITE_IDP_URL` | URL base do Observatório IdP para autenticação SSO via OAuth 2.0 PKCE | `https://observatoriocti.secti.ba.gov.br/idp/` |
| `VITE_ETL_URL` | URL base do SimCC ETL, que expõe os relatórios de consistência das cargas | `https://simcc.uesc.br/etl` |
| `VITE_ETL_API_KEY` | Chave enviada em `X-ETL-API-Key` para o endpoint de exportação do ETL | *(obrigatória)* |
| `VITE_SNAPSHOTS_URL` | Onde estão as fotos mensais por instituição (`index.json` + arquivos JSON) | branch `dados-snapshots` via raw.githubusercontent |

### Fotos por instituição (`/verificacao-consistencia`)

O ETL registra `antes`/`depois` apenas em totais globais. Para mostrar a variação
por instituição ("a UESC estava com 1.100 pesquisadores e ficou com 1.124"), o
portal fotografa `GET /simcc/api/institution` **uma vez por mês** e compara as fotos.

- **Coletor:** `scripts/coletor-snapshots.mjs` (`npm run snapshots`), agendado em
  `.github/workflows/snapshots.yaml` (cron `7 4 1 * *` — todo dia 1º).
- **Destino:** branch `dados-snapshots` do próprio repositório — não entra no
  build do site e é lido por `raw.githubusercontent.com` (CORS livre).
- **Comparação com carga:** `antes` = última foto anterior ao `iniciado_em`;
  `depois` = primeira foto posterior ao `finalizado_em`.
- **Janela larga:** com cadência mensal o par de fotos costuma ficar distante da
  carga. Quando passa de 12 horas de folga, a linha mostra as datas das fotos e
  marca **"fotos mensais"**, porque a diferença inclui outras mudanças do período
  e não pode ser atribuída a uma carga só.
- **Sem carga registrada:** `hop_index` e `foment_scholars` não aparecem no
  export do ETL; para essas métricas o portal compara as duas últimas fotos.
- **Retenção:** 60 fotos (5 anos) por padrão; ajuste com `--reter N`.
- **Limites:** −5% / +10% calculados no front, com exceções por métrica salvas
  no navegador.

Para gerar as fotos localmente: `npm run snapshots -- --saida public/snapshots` e
defina `VITE_SNAPSHOTS_URL=/snapshots` (a pasta é ignorada pelo git).

---

## 🧪 Qualidade e Scripts (`package.json`)

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor Vite com Hot Module Replacement (HMR) |
| `npm run build` | Compila e otimiza os ativos de produção na pasta `dist/` |
| `npm run lint` | Executa a verificação estática com ESLint |
| `npm run preview` | Serve localmente o pacote compilado em `dist/` |
