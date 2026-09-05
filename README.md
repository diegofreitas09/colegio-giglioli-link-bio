# Colégio Giglioli — Estação de Aprendizagem

Site institucional/PWA do Colégio Giglioli, com identidade espacial própria: constelações, astronauta Gigi, segmentos como planetas, mural moderado, depoimentos aprovados, formulário de matrícula, localização e painel administrativo.

## Stack
- Next.js 16 / React 19
- Tailwind CSS 4
- Motion for React
- GSAP + ScrollTrigger
- Supabase (Postgres, Auth, Storage e RLS)
- Netlify
- Google Search Console + Google Analytics 4 preparados por variáveis de ambiente

## Desenvolvimento
```bash
cp .env.example .env.local
npm install
npm run dev
```

## Supabase de produção
Projeto exclusivo: **Colégio Giglioli**

- Project ref: `tjfyuhumpuafejxdxkft`
- Região: `sa-east-1` (São Paulo)
- Tabelas principais: `mural_posts`, `comentarios`, `matricula_leads`, `school_admins`, `admin_invites`
- Storage: bucket público `mural-public`
- RLS habilitado em todas as tabelas públicas do site

As migrations em `supabase/migrations/` usam os mesmos números de versão registrados no projeto de produção.

## Painel administrativo
Rota: `/admin`

O painel permite:
- publicar e despublicar registros no mural;
- enviar imagens para o Storage;
- destacar publicações;
- aprovar, ocultar, destacar e excluir depoimentos;
- acompanhar leads de matrícula;
- alterar o status do atendimento e abrir o WhatsApp do responsável.

O login usa Supabase Auth. Um usuário só recebe acesso administrativo se seu UUID existir em `school_admins`. O projeto também possui `admin_invites`: quando um e-mail previamente autorizado cria conta no Supabase Auth, um trigger o adiciona automaticamente como administrador e consome o convite.

## SEO e Google
O projeto já possui:
- `robots.txt` via `app/robots.ts`;
- `sitemap.xml` via `app/sitemap.ts`;
- canonical URL;
- Open Graph e Twitter cards;
- JSON-LD `School` com endereço, telefone e Instagram;
- suporte à verificação do Google Search Console;
- carregamento condicional do Google Analytics 4.

Variáveis:
```env
NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO.com.br
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=token-do-search-console
```

## Domínio
Depois de registrar o domínio no Registro.br, adicione-o ao projeto Netlify e use os registros DNS fornecidos pelo Netlify. Após a propagação, atualize `NEXT_PUBLIC_SITE_URL` para o domínio final e faça um novo deploy.

## Contato oficial usado no site
- WhatsApp / Secretaria / Matrícula: (85) 99972-5279
- Instagram: @colegio.giglioli
- Localização: R. Umarizeiras, 940 — Canindezinho, Fortaleza/CE
