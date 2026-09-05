# Colégio Giglioli — Estação de Aprendizagem

Site institucional/PWA do Colégio Giglioli, com identidade espacial própria: constelações, astronauta Gigi, segmentos como planetas, mural moderado, depoimentos aprovados, formulário de matrícula e localização.

## Stack
- Next.js 16 / React 19
- Tailwind CSS 4
- Motion for React (Framer Motion)
- GSAP + ScrollTrigger
- Supabase (Postgres, Auth, Storage e RLS)
- Netlify (OpenNext)

## Desenvolvimento
```bash
cp .env.example .env.local
npm install
npm run dev
```

## Supabase
1. Crie um projeto exclusivo para o Colégio Giglioli.
2. Execute `supabase/migrations/20260905_site_giglioli.sql`.
3. Cadastre o primeiro usuário da escola no Supabase Auth.
4. Insira o UUID desse usuário em `public.site_admins`.
5. Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no Netlify.

O mural exibe somente `mural_posts.publicado = true`. Comentários enviados por famílias entram com `aprovado = false` e só aparecem após moderação.

## Domínio
Depois de registrar `colegiogiglioli.com.br` no Registro.br, adicione o domínio ao projeto Netlify e use os registros DNS fornecidos pelo Netlify. O HTTPS é provisionado automaticamente após a propagação.

## Contato oficial usado no site
- WhatsApp / Secretaria / Matrícula: (85) 99972-5279
- Instagram: @colegio.giglioli
- Localização utilizada: R. Umarizeiras, 940 — Canindezinho, Fortaleza/CE
