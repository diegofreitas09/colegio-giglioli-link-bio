# Arquitetura

- `app/`: App Router, SEO e manifest PWA.
- `components/SpaceBackground.tsx`: campo de estrelas em Canvas com conexões e parallax leve.
- `components/Mural.tsx`: feed público e depoimentos moderados via Supabase.
- `components/LeadForm.tsx`: captação de interesse com fallback para WhatsApp.
- `components/FloatingMascot.tsx`: Gigi global e clicável para WhatsApp.
- `components/ScrollEffects.tsx`: GSAP/ScrollTrigger para parallax suave.
- `lib/supabase.ts`: client Supabase browser-side protegido por RLS.
- `supabase/migrations/`: DDL, políticas RLS e bucket Storage.
- `public/sw.js`: service worker simples para comportamento PWA.
