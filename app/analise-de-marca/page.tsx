import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Análise de marca — Visualize',
  description: 'Diagnóstico experimental de alinhamento entre o posicionamento da sua marca e a percepção dos clientes.'
};
export default function BrandAnalysisPage() {
  return <iframe src="/analise-de-marca/index.html" title="Análise de marca Visualize" style={{position:'fixed',inset:0,width:'100%',height:'100dvh',border:0,background:'#11191f'}} />;
}
