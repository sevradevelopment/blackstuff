# Black Stuff Eesti – premium veebileht ja e-pood

Uus Next.js veebilahendus Black Stuff Eesti jaoks. Disain ja UX on ehitatud nullist; sisu ja tooteandmed põhinevad blackstuff.ee avaldatud materjalil.

## Käivitamine

```bash
npm install
npm run dev
```

Ava [http://localhost:3000](http://localhost:3000).

## Admin

- URL: `/admin/login`
- Kasutajanimi: `admin`
- Parool: `ChangeMe123!` (muuda enne tootmist)

Andmed salvestatakse faili `data/db.json`.

Adminis: tooted, kategooriad, tellimused, blogi, lehed (CMS), avalehe sisu, kontaktivormi sõnumid.

## Montonio

Lisa `.env.local` faili:

```
NEXT_PUBLIC_SITE_URL=https://sinu-domeen.ee
MONTONIO_ACCESS_KEY=...
MONTONIO_SECRET_KEY=...
MONTONIO_SANDBOX=true
```

Võtmed: [Montonio Partner System](https://partner.montonio.com) → API keys. Sandbox testimiseks, live-ks `MONTONIO_SANDBOX=false`.

## Oluline

- Õiguslikud lehed (tingimused, privaatsus, küpsised, tarne) on **kinnitamist vajavad** – muuda adminis `/admin/lehed`.
- Mõned tootekirjeldused ja blogitekstid võivad vajada täiendamist.

## Tehnoloogia

Next.js 15, TypeScript, Tailwind CSS 4, Zustand (ostukorv), jose + bcryptjs (admin).
