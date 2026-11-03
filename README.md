# Visualize Studio

Site acadêmico da Visualize Studio, criado a partir da identidade e das mídias fornecidas.

## Executar

Node.js 22.x.

No Windows, depois de instalar o Node.js, dê dois cliques em `ABRIR_SITE.bat`. Na primeira execução, o instalador baixa as dependências e abre o site em `http://localhost:5173`.

Também é possível iniciar pelo terminal:

```sh
npm install
npm run dev
```

A prévia usa http://localhost:5173. Para gerar a versão de produção: `npm run build`.

## Publicar na Vercel

Importe este repositório com o preset Next.js e a raiz nesta pasta. O arquivo `vercel.json` configura `npm run build` e a saída `.next`. O build usa Next.js nativo; os scripts antigos de Vinext/Cloudflare não fazem parte da publicação na Vercel. Use `npm start` para testar a versão de produção após o build.

Páginas disponíveis: `/`, `/fotografia` e `/antes-e-depois`.

## Experiência

- Abertura e vídeo do Universo preparados para busca por quadro e sincronizados ao scroll com GSAP.
- Cards em Three.js no desktop, com materiais, profundidade, interação e vídeos originais.
- Alternativa em HTML e imagens no celular, com movimento reduzido ou sem WebGL.
- Seções Estúdio, Soluções, Universo Visualize, Processo e Contato.
- Contato demonstra uma conversa de WhatsApp sem enviar mensagens ou usar telefone real.
- Navegação por âncoras, diálogo acessível, pausa de movimento e pausa de vídeos fora da tela.

## Tipografia

O logo é o SVG oficial fornecido. Os textos usam temporariamente Archivo hospedada localmente. A variável `--font-body` em `app/globals.css` já prioriza Akzidenz-Grotesk; para usá-la é necessário fornecer os arquivos web autorizados e declarar seu `@font-face`. Nenhum arquivo de Akzidenz-Grotesk foi encontrado na pasta original.

## Arquivos principais

- `app/page.tsx`: conteúdo, navegação e coreografia geral.
- `app/globals.css` e `app/experience.css`: identidade e versões responsivas.
- `components/service-stage.tsx`: cena tridimensional e alternativas de renderização.
- `components/motion-video.tsx`: carregamento, pausa e busca por tempo nos vídeos.
- `public/media`: cópias das mídias fornecidas, fontes e imagens WebP otimizadas.

## Verificação

Verificação TypeScript, prévia no navegador em 1440 × 900 e 390 × 844, navegação, seleção de serviços, abertura e fechamento do diálogo, ausência de rolagem horizontal e pausa das animações. Desempenho em celulares físicos ainda depende do dispositivo.
