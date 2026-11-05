# AGENTS.md — Portal Observatório CT&I (`observatorio-front`)

Este repositório faz parte do **Ecossistema Observatório CT&I Bahia**. Ele é versionado de forma independente e contém a SPA React do **Portal Principal do Observatório**, que integra indicadores estratégicos, destaques científicos, eixos temáticos e pontos de entrada para os módulos satélites (SimCC, Fomento, VIP, Maria).

> Consulte também as skills locais em `.agents/skills/` (`frontend-arquitetura`, `frontend-performance`, `diretrizes-dados-frontend`), o sistema de design em [`DESIGN.md`](DESIGN.md) e, quando no workspace raiz, `../AGENTS.md`.

---

## 1. Princípios Arquiteturais e de Design

1. **Identidade Visual (*Simcc Intelligence*)**:
   - Toda construção ou alteração de componentes visuais deve respeitar rigorosamente os tokens de superfície, cores institucionais (`primary: #07677e`, `navy-deep: #024A60`), espaçamento e tipografia (`Lexend` para display/títulos, `Inter` para corpo, `JetBrains Mono` para dados/código) documentados em [`DESIGN.md`](DESIGN.md).
   - A filosofia de layout evita divisórias rígidas (`1px solid`) em favor de transições de tom de superfície (`surface-container-low` sobre `surface`) e hierarquia tipográfica.
2. **Arquitetura de Dados e Camada de Serviços**:
   - Chamadas HTTP ficam isoladas em `src/services/` (`api.js`, `simccService.js`, `researcherService.js`, `homeService.js`) usando Axios configurável via `VITE_API_URL`.
   - O gerenciamento de estado assíncrono e cache no cliente utiliza `@tanstack/react-query` através de hooks dedicados em `src/hooks/`.
3. **Idioma e Convenções**:
   - Textos de interface, comentários, documentação e mensagens de commit em **Português do Brasil (pt-BR)**.

---

## 2. Comandos Padrão de Desenvolvimento

- **Instalar dependências**: `npm install`
- **Iniciar servidor de desenvolvimento**: `npm run dev`
- **Executar linter (ESLint)**: `npm run lint`
- **Gerar build de produção**: `npm run build`
- **Pré-visualizar build**: `npm run preview`

---

## 3. Padrão de Documentação e Gatilhos Obrigatórios (Definition of Done)

A documentação deste repositório é composta por:
- [`README.md`](README.md): Visão geral, stack, árvore de diretórios (`src/`), variáveis de ambiente (`VITE_*`) e instruções de execução/build.
- [`DESIGN.md`](DESIGN.md): Especificação completa do Design System compartilhado com `Simcc/simcc-front`.

### Tabela de Atualização Obrigatória

**Nenhuma alteração de código está pronta sem atualizar a documentação correspondente na mesma tarefa:**

| Se você alterar... | Atualize obrigatoriamente: |
| :--- | :--- |
| Variáveis `import.meta.env.VITE_*` em `src/` | Seção **⚙️ Configuração (`.env`)** no `README.md` |
| Estrutura de pastas em `src/` (`components/`, `hooks/`, `services/`, `data/`) | Árvore **📁 Estrutura de Diretórios** no `README.md` |
| Paleta de cores, fontes ou tokens de design no Tailwind/CSS | [`DESIGN.md`](DESIGN.md) (e manter alinhado com `Simcc/simcc-front/DESIGN.md`) |
| Scripts em `package.json` ou configuração de Docker/Nginx | Seções **🚀 Como Executar** e **🧪 Qualidade e Build** no `README.md` |
