# Deploying to cloud1 (DigitalOcean)

Target: **https://thewalkthroughai.com/v2/**, on the droplet `cloud1` (`root@applogic.ca`,
167.71.181.143). The existing site at `/home/sites/thewalkthroughai.com/web` stays at the root URL
and is not touched.

```
browser ──► nginx (thewalkthroughai.com, 443)
              ├─ /           → /home/sites/thewalkthroughai.com/web/dist      (existing site)
              ├─ /v2/        → /home/sites/thewalkthroughai.com/web2/dist/v2  (this repo, static)
              └─ /api/submit → 127.0.0.1:3005  form-gateway (pm2) ──► sendmail ──► sam@thewalkthroughai.com
```

Nothing new runs as a process: the site is static, and form submissions go to the shared
form-gateway that already serves the other sites.

## Prerequisites (already on cloud1 — verify, don't reinstall)

| Need | Check |
|---|---|
| Node ≥ 20.19 (Vite 7) | `node -v` → v20.19.6 |
| nginx + certbot cert for thewalkthroughai.com | `ls /etc/letsencrypt/live/thewalkthroughai.com/` |
| `form_limit` rate-limit zone | `grep form_limit /etc/nginx/nginx.conf` |
| form-gateway online on 3005 | `pm2 describe form-gateway \| grep status` · `curl -s 127.0.0.1:3005/health` |
| GitHub access to `applogic/thewalkthroughai` | `git ls-remote git@github.com:applogic/thewalkthroughai.git HEAD` |
| SPF allows cloud1 to send as @thewalkthroughai.com | `dig +short TXT thewalkthroughai.com` → contains `ip4:167.71.181.143` |

On a **fresh** droplet you would first install Node 20 LTS, nginx, certbot (`certbot --nginx -d
thewalkthroughai.com -d www.thewalkthroughai.com`), postfix (loopback-only), pm2 +
`pm2 install pm2-logrotate`, and deploy form-gateway — out of scope here.

## ⚠ Blocker before going live: recipient mailbox

`sam@thewalkthroughai.com` currently **bounces**. thewalkthroughai.com mail is hosted at
ProtonMail (MX `mail.protonmail.ch`), so the address/alias must exist in ProtonMail before briefs
can be delivered. Until then every brief the gateway accepts will bounce and be lost — the site
will tell the visitor "on its way" because the gateway only reports a failure if sendmail rejects
locally. Fix the mailbox first, then run step 2's test.

## 1. One-time: check out and build the site

```bash
ssh root@applogic.ca
cd /home/sites/thewalkthroughai.com
git clone git@github.com:applogic/thewalkthroughai.git web2
cd web2
npm ci
npm run build
ls dist/v2/index.html dist/v2/assets/   # must exist
```

The build runs `sharp` over ~20 MB of PNGs (one at a time, cached in
`node_modules/.cache/asset-optimizer`). If the droplet is short on RAM and the build is killed,
build locally and `rsync -a dist/ root@applogic.ca:/home/sites/thewalkthroughai.com/web2/dist/`.

## 2. One-time: register the site with form-gateway

The gateway picks the site config by `Host` header, so one config covers every page on
thewalkthroughai.com.

```bash
cd /home/sites/form-gateway
cp -a configs configs.bak.$(date +%s)

cat > configs/thewalkthroughai.com.env <<'EOF'
SITE_NAME=The Walkthrough AI
FORM_NAME=Project Brief

ALLOWED_ORIGINS=https://thewalkthroughai.com,https://www.thewalkthroughai.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=5

MIN_FORM_TIME_MS=3000
MAX_FORM_TIME_MS=21600000

SMTP_FROM_EMAIL=noreply@thewalkthroughai.com
RECIPIENT_EMAIL=sam@thewalkthroughai.com

REQUIRED_FIELDS=name,email,sector,squareFeet,estimate
OPTIONAL_FIELDS=company,features,notes

FIELD_LABELS={"company":"Company","email":"Email","estimate":"Indicative estimate","features":"Requested features","name":"Name","notes":"About the space","sector":"Property type","squareFeet":"Square footage"}

EMAIL_SUBJECT_TEMPLATE=New Project Brief (The Walkthrough AI): ${formFields.name}
EOF
```

The field names must match what `src/web/components/sections/contact.tsx` posts. The form sends
every value as a string, plus `honeypot`, `sliderVerified` and `timestamp`, which the gateway
requires.

Restart the gateway to load the config (a ~1 s blip for the other sites' forms):

```bash
pm2 restart form-gateway
pm2 logs form-gateway --lines 20 --nostream   # expect: [The Walkthrough AI] Loaded thewalkthroughai.com.env ...
curl -s -H "Host: thewalkthroughai.com" 127.0.0.1:3005/health   # expect "site":"The Walkthrough AI"
```

If the log shows `Host thewalkthroughai.com is already served by ...`, another config claims the
domain — fix that before continuing.

## 3. One-time: nginx

```bash
cp /etc/nginx/sites-available/thewalkthroughai.com /root/thewalkthroughai.com.nginx.bak.$(date +%s)
nano /etc/nginx/sites-available/thewalkthroughai.com
```

Inside the `server { server_name thewalkthroughai.com; ... listen 443 ssl; }` block, add these
three locations next to the existing `location / { ... }`:

```nginx
    location = /v2 {
        return 301 /v2/;
    }

    location /v2/ {
        root /home/sites/thewalkthroughai.com/web2/dist;
        index index.html;
        try_files $uri $uri/ /v2/index.html;
    }

    location /api/submit {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        limit_req zone=form_limit burst=3 nodelay;
    }
```

Use `root`, not `alias`: the build writes to `dist/v2/`, so the URL maps 1:1 onto disk and
`try_files` resolves correctly (`alias` + `try_files` 404s).

```bash
nginx -t && systemctl reload nginx
```

## 4. Verify

```bash
curl -sI https://thewalkthroughai.com/v2            # 301 → /v2/
curl -sI https://thewalkthroughai.com/v2/           # 200 text/html
curl -sI https://thewalkthroughai.com/v2/images/hero-aerial.png   # 200 image/png
curl -sI https://thewalkthroughai.com/v2/anything   # 200 (SPA fallback)
curl -sI https://thewalkthroughai.com/              # 200 — existing site unchanged
curl -s https://thewalkthroughai.com/v2/ | grep -ci runable   # 0
```

Then submit a real brief from the page (complete the slider, wait >3 s) and confirm the email
arrives at sam@thewalkthroughai.com. Check delivery on the server:

```bash
pm2 logs form-gateway --lines 20 --nostream   # "[The Walkthrough AI] Form submission from ... sent successfully"
tail -20 /var/log/mail.log                     # status=sent (not bounced / deferred)
```

## Routine deploys

Push to `main`, then:

```bash
sh /home/sites/thewalkthroughai.com/web2/deploy.sh
```

It pulls, runs `npm ci`, and rebuilds `dist/v2/` in place. No reload needed — nginx serves the new
files immediately.

## Rollback

- Site: `cd /home/sites/thewalkthroughai.com/web2 && git checkout <previous-sha> && npm ci && npm run build`
- nginx: restore `/root/thewalkthroughai.com.nginx.bak.<ts>` over the site file, `nginx -t && systemctl reload nginx`
- Gateway: `rm configs/thewalkthroughai.com.env && pm2 restart form-gateway`

## What changed vs the Runable version

- Removed: Runable badge and agent-feedback widget, the Runable analytics beacon
  (`runable.js` → r.lilstts.com), `.runable/` metadata, runkit lint, the unused Expo (mobile) and
  Electron (desktop) packages, the Bun/Hono/oRPC server and the Runable-managed Turso database.
- Briefs are **emailed**, not stored. Any briefs already sitting in Runable's Turso database stay
  there — export them from Runable before closing that account if you need them.
- Mobile responsiveness comes from the web build's Tailwind layout; verified with no horizontal
  overflow at 390 px.
