# The Walkthrough AI — v2 brochure

Marketing brochure for The Walkthrough AI, served at https://thewalkthroughai.com/v2/.

Static single-page app built with **Vite + React + Tailwind CSS v4**. There is no backend: the
brief form posts to the shared **form-gateway** on cloud1 (`/api/submit`), which emails each
submission. No third-party platform dependency.

## Develop

```bash
npm install
npm run dev       # http://localhost:4200/v2/
```

The form calls `/api/submit` on the same origin, so it only works behind the production nginx
(or a local proxy to the gateway).

## Build

```bash
npm run build     # typecheck, then outputs the site to dist/v2/
npm run lint      # oxlint
npm run typecheck
```

The build output lives in `dist/v2/` so nginx can serve it with `root .../dist` and a 1:1 URL to
disk mapping. The Vite `base` is `/v2/`; reference public assets through
`import.meta.env.BASE_URL`, never a hardcoded `/images/...` path.

## Deploy

See [DEPLOY.md](DEPLOY.md). After the one-time setup, push to `main` and run on the server:

```bash
sh /home/sites/thewalkthroughai.com/web2/deploy.sh
```
