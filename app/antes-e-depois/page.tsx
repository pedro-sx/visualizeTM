import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Antes e depois — Visualize', description: 'Explore o processo de edição da Visualize: 60 fotografias originais e finais em um comparador interativo.' };
export default function BeforeAfterPage() {
  return <iframe src="/comparador/index.html" title="Antes e depois — processo fotográfico Visualize" allow="fullscreen" style={{position:'fixed',inset:0,width:'100%',height:'100dvh',border:0,background:'#11191f'}} />;
}
