# Calculador de Esforço

Aplicativo desktop (Windows) para cálculo de esforços em postes, com visualização de resultados e diagrama. Construído com Electron + Vite + React + Tailwind CSS e empacotado com electron-builder.

## Tecnologias

- Electron 38 (processo principal: `main.cjs`)
- React 19 + Vite 6 (frontend)
- Tailwind CSS 4
- electron-builder (geração de instalador)

## Requisitos

- Node.js 18+ (recomendado 18 LTS ou 20 LTS)
- npm 9+
- Windows 10/11 para executar o instalador gerado

## Scripts (npm)

- `npm run dev` – roda somente o frontend Vite em modo desenvolvimento (útil para mexer no layout). Não integra com Electron.
- `npm run build` – compila TypeScript e gera os arquivos estáticos do frontend.
- `npm run electron` – inicia o Electron apontando para os arquivos locais (ver detalhes abaixo).
- `npm run preview` – serve o build com um servidor HTTP simples (útil para testar no navegador, não para o app desktop).
- `npm run generate` – empacota o app com o electron-builder e gera instalador em `release/`.

## Como desenvolver

Esta base carrega o HTML estático do diretório `renderer/` dentro do Electron. Durante o desenvolvimento do app desktop, use:

```powershell
# 1) Instale dependências
npm install

# 2) Gere o build do frontend
npm run build

# 3) Rode o Electron usando os arquivos locais
npm run electron
```

Observações:
- O processo principal está configurado para abrir ferramentas de desenvolvedor (DevTools) automaticamente; isso facilita debugar telas em branco e erros de runtime.
- Em dev puro do frontend (sem Electron), você pode usar:

```powershell
npm run dev
```

mas esse comando serve a UI no navegador. Para testar o desktop, use a sequência build + electron acima.

## Gerando o instalador (Windows)

```powershell
# Gera os artefatos de distribuição em .\release\
npm run generate
```

Saída esperada:
- `release/Calculador de Esforço Setup <versão>.exe` – instalador
- `release/win-unpacked/` – pasta com o app desembrulhado para testes

Após instalar, você pode abrir o app pelo atalho do menu Iniciar. Para capturar logs do processo principal, abra o app a partir de uma janela do PowerShell; o console mostrará mensagens do Electron.

## Estrutura do projeto (simplificada)

```
.
├─ main.cjs                     # Processo principal do Electron
├─ vite.config.ts               # Config do Vite (base './' para caminhos relativos)
├─ src/                         # Código-fonte React/TypeScript
│  ├─ App.tsx
│  ├─ components/
│  │  ├─ ui/
│  │  │  └─ toast.tsx          # Provider e API de toast (showToast)
│  │  └─ ...
│  ├─ data/
│  └─ ...
├─ renderer/                    # HTML/CSS/JS prontos para o Electron carregar
│  └─ index.html                # Entrada renderizada
└─ release/                     # Artefatos gerados pelo electron-builder
```

## Como a janela do Electron carrega a UI

O `main.cjs` tenta localizar o `index.html` no seguinte fluxo:

- Em produção (instalado): busca em `process.resourcesPath` por `renderer/index.html`.
- Em desenvolvimento: usa `renderer/index.html` do repositório.

O arquivo `vite.config.ts` define `base: './'`, garantindo que os caminhos para assets (`<link>`/`<script>`) sejam relativos e funcionem em `file://` dentro do Electron.

## Toasts (substituição dos alerts)

Alerts nativos foram substituídos por toasts não-bloqueantes.

Uso no código:

```tsx
import { showToast, ToastProvider } from "./components/ui/toast";

// Em algum handler
showToast("Mensagem para o usuário", 4000); // 4s

// Garanta que o App esteja dentro de <ToastProvider> (já feito em App.tsx)
```

Benefícios:
- Evita travamentos de foco/teclado que podem ocorrer com `alert()` em ambientes desktop.
- Melhor UX e consistência visual.

## Dúvidas comuns e solução de problemas

1) Abri o `index.html` direto no navegador e deu CORS
- Navegadores bloqueiam `file://` por CORS. Use um servidor HTTP local (`npm run preview`) ou rode via Electron. Em Electron não há esse bloqueio para os assets locais.

2) Tela branca ao abrir o app instalado
- O app abre DevTools automaticamente. Verifique o Console e a aba Network.
- O `main.cjs` escreve um log simples em: `%APPDATA%/Calculador de Esforço/electron-debug.log` (caminho exato aparece no console). O log lista os caminhos candidatos para `index.html` e qual foi escolhido.
- Confirme que `renderer/index.html` e sua pasta `assets/` foram incluídos no pacote. O builder gera tudo em `release/`.

3) Inputs "bugam" após mensagens
- Foi removido o uso de `alert()`; agora usamos toasts, que não bloqueiam a thread principal e preservam o foco dos inputs.

## Segurança

No momento `nodeIntegration: true` e `contextIsolation: false` estão habilitados no `BrowserWindow`. Isso simplifica o desenvolvimento, mas não é a configuração mais segura. Não carregue conteúdo remoto. Caso futuramente seja necessário endurecer o app, considere:

- `contextIsolation: true` + preload script
- `nodeIntegration: false`
- Política de Conteúdo Segura (CSP)

## Licença

Consulte o repositório para detalhes de licenciamento.

