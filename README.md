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
│   ├── constants/                 # Links institucionais e constantes de busca do SimCC
│   ├── context/                   # Contexto global de autenticação SSO (AuthContext.jsx)
│   ├── data/                      # Metadados de instituições parceiras e módulos do ecossistema
│   ├── hooks/                     # Hooks React Query (useAuth, pesquisadores destaque, métricas home)
│   ├── lib/                       # Utilitários gerais (utils.js, auth-storage.js)
│   ├── pages/                     # Páginas da aplicação (AuthCallback.jsx)
│   ├── services/                  # Clientes HTTP (api.js, authService.js, homeService.js, researcherService.js)
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

---

## 🧪 Qualidade e Scripts (`package.json`)

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor Vite com Hot Module Replacement (HMR) |
| `npm run build` | Compila e otimiza os ativos de produção na pasta `dist/` |
| `npm run lint` | Executa a verificação estática com ESLint |
| `npm run preview` | Serve localmente o pacote compilado em `dist/` |
