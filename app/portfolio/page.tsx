import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfólio Executivo | Colégio Giglioli",
  description: "Estrutura digital entregue ao Colégio Giglioli pela PDF Solução Educacional Empresarial.",
  alternates: { canonical: "https://colegiogiglioli.com.br/portfolio" },
  robots: { index: false, follow: true }
};

const entregas = [
  ["01", "Site personalizado", "Vitrine digital própria, responsiva e disponível para as famílias todos os dias."],
  ["02", "Painel administrativo", "Mais autonomia para atualizar conteúdos, contatos e informações da escola."],
  ["03", "Link da bio inteligente", "Uma página exclusiva para organizar matrícula, WhatsApp, visita, depoimentos e os principais caminhos da escola."],
  ["04", "Domínio próprio", "Endereço oficial da escola, fortalecendo marca, confiança e divulgação."],
  ["05", "Google Search Console", "Acompanhamento de indexação, pesquisas, cliques e oportunidades de descoberta no Google."],
  ["06", "Google Analytics 4", "Leitura do comportamento dos visitantes e dos caminhos que geram mais interesse."],
  ["07", "Banco de dados", "Base organizada para preservar informações e preparar a evolução da operação digital."],
  ["08", "Suporte contínuo", "Canal para dúvidas, sugestões, ajustes e evolução da solução depois da publicação."]
];

const links = [
  ["Site oficial", "https://colegiogiglioli.com.br/", "colegiogiglioli.com.br"],
  ["Painel administrativo", "https://colegiogiglioli.com.br/admin", "colegiogiglioli.com.br/admin"],
  ["Link da Bio do Instagram", "https://colegiogiglioli.com.br/bio", "colegiogiglioli.com.br/bio"],
  ["Mural de fotos", "https://colegiogiglioli.com.br/mural", "colegiogiglioli.com.br/mural"],
  ["Depoimentos", "https://colegiogiglioli.com.br/depoimentos", "colegiogiglioli.com.br/depoimentos"],
  ["Google Search Console", "https://search.google.com/search-console", "search.google.com/search-console"],
  ["Google Analytics", "https://analytics.google.com/", "analytics.google.com"],
  ["Suporte PDF", "https://wa.me/5585984161882", "WhatsApp (85) 98416-1882"]
];

export default function PortfolioPage() {
  return (
    <main style={{background:"#0b0b0d",color:"#fff",minHeight:"100vh",fontFamily:"Arial, Helvetica, sans-serif"}}>
      <section style={{maxWidth:1120,margin:"0 auto",padding:"72px 22px 48px"}}>
        <div style={{display:"inline-flex",gap:10,alignItems:"center",fontWeight:800,fontSize:13,letterSpacing:1.2,color:"#ffca45"}}>
          <span style={{background:"#ef1b24",color:"#fff",padding:"9px 11px",borderRadius:10}}>PDF</span>
          SOLUÇÃO EDUCACIONAL EMPRESARIAL
        </div>
        <p style={{marginTop:58,color:"#ffca45",fontWeight:800,fontSize:13}}>PORTFÓLIO EXECUTIVO · COLÉGIO GIGLIOLI</p>
        <h1 style={{fontSize:"clamp(42px,7vw,82px)",lineHeight:.98,margin:"16px 0 24px",maxWidth:900}}>O Colégio Giglioli não adquiriu apenas um site.</h1>
        <h2 style={{fontSize:"clamp(30px,5vw,58px)",lineHeight:1.02,color:"#ffca45",margin:"0 0 28px",maxWidth:850}}>Adquiriu uma estrutura digital.</h2>
        <p style={{fontSize:"clamp(17px,2vw,22px)",lineHeight:1.55,color:"#c9c9ce",maxWidth:820}}>Uma base conectada para fortalecer a marca, facilitar o contato com as famílias, medir resultados e criar mais oportunidades de matrícula.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,marginTop:34}}>
          <a href="#acessos" style={{background:"#ffca45",color:"#121214",fontWeight:900,padding:"16px 22px",borderRadius:12,textDecoration:"none"}}>VER ACESSOS ATIVOS</a>
          <a href="https://wa.me/5585984161882" target="_blank" rel="noreferrer" style={{background:"#ef1b24",color:"#fff",fontWeight:900,padding:"16px 22px",borderRadius:12,textDecoration:"none"}}>FALAR COM A PDF</a>
        </div>
      </section>

      <section style={{background:"#f5f5f6",color:"#111",padding:"64px 22px"}}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <p style={{color:"#ef1b24",fontWeight:900,letterSpacing:1.2}}>01 / ENTREGAS</p>
          <h2 style={{fontSize:"clamp(34px,5vw,56px)",margin:"8px 0 12px"}}>Uma estrutura completa para a presença digital do Giglioli.</h2>
          <p style={{color:"#666",fontSize:18,lineHeight:1.6,maxWidth:820}}>Cada entrega tem uma função clara: fortalecer a marca, facilitar o contato com as famílias e criar uma base para a escola continuar crescendo.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginTop:32}}>
            {entregas.map(([n,t,d],i)=><article key={n} style={{background:"#fff",border:"1px solid #ddd",borderRadius:18,padding:22,boxShadow:"0 6px 18px rgba(0,0,0,.04)"}}>
              <span style={{display:"inline-flex",width:38,height:38,borderRadius:99,alignItems:"center",justifyContent:"center",background:i%2?"#ef1b24":"#ffca45",color:i%2?"#fff":"#111",fontWeight:900,fontSize:12}}>{n}</span>
              <h3 style={{fontSize:22,margin:"18px 0 8px"}}>{t}</h3><p style={{color:"#666",lineHeight:1.55,margin:0}}>{d}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="acessos" style={{maxWidth:1120,margin:"0 auto",padding:"64px 22px 86px"}}>
        <p style={{color:"#ffca45",fontWeight:900,letterSpacing:1.2}}>02 / ACESSOS</p>
        <h2 style={{fontSize:"clamp(34px,5vw,56px)",margin:"8px 0 12px"}}>Tudo conectado por links ativos.</h2>
        <p style={{color:"#c9c9ce",fontSize:18,lineHeight:1.6,maxWidth:820}}>Use os botões abaixo. Todos apontam para os endereços públicos corretos da estrutura adquirida.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginTop:30}}>
          {links.map(([label,href,display])=><a key={label} href={href} target="_blank" rel="noreferrer" style={{display:"block",background:"#1b1b20",border:"1px solid #34343a",borderRadius:16,padding:20,textDecoration:"none",color:"#fff"}}>
            <strong style={{fontSize:18}}>{label}</strong><span style={{display:"block",marginTop:8,color:"#ffca45",fontSize:14,wordBreak:"break-word"}}>{display}</span>
          </a>)}
        </div>
        <div style={{marginTop:34,background:"#ef1b24",borderRadius:18,padding:24}}>
          <strong style={{fontSize:22}}>Suporte que acompanha</strong>
          <p style={{margin:"8px 0 18px",color:"#fff",lineHeight:1.55}}>Dúvidas, sugestões e melhorias: PDF Solução Educacional Empresarial.</p>
          <a href="https://wa.me/5585984161882" target="_blank" rel="noreferrer" style={{display:"inline-block",background:"#ffca45",color:"#111",fontWeight:900,padding:"14px 18px",borderRadius:10,textDecoration:"none"}}>ABRIR WHATSAPP</a>
        </div>
      </section>
    </main>
  );
}
