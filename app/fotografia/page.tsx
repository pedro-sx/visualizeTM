import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Fotografia — Visualize', description: 'Explore os álbuns fotográficos da Visualize: retratos, direção criativa e novas perspectivas.' };
export default function PhotographyPage() {
  return <iframe src="/fotografia/index.html" title="Portfólio de fotografia Visualize" allow="autoplay; fullscreen" style={{position:'fixed',inset:0,width:'100%',height:'100dvh',border:0,background:'#08111f'}} />;
}
