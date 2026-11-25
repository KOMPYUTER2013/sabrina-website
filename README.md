# Sabrina Umurzoqova — portfolio

React va Vite asosidagi oʻzbekcha portfolio. Statik sayt Netlify’da, matn va
tashrif maʼlumotlari Netlify Blobs’da saqlanadi. Telegram admin bot Python’da
yozilgan va faqat belgilangan Telegram ID uchun ishlaydi.

## Saytni build qilish

1. Node.js 20.19 yoki undan yangisini oʻrnating.
2. `npm install` va `npm run build` buyrugʻini bajaring.
3. Tayyor sayt `out` papkasiga yoziladi.

## Netlify’ga joylash

1. GitHub repository’ni Netlify’ga ulang.
2. Build command: `npm run build`; publish directory: `out`; functions
   directory: `netlify/functions`.
3. Netlify **Site configuration → Environment variables** boʻlimiga quyidagilarni
   kiriting:
   - `BOT_TOKEN` — `@sabrina_xabar_bot` uchun BotFather bergan token.
   - `CHAT_ID` — murojaatlar boradigan Telegram shaxsiy chat yoki guruh ID’si.
   - `ADMIN_API_TOKEN` — uzun, tasodifiy maxfiy qiymat. Shu qiymat Python bot
     hostingida ham aynan bir xil boʻlishi kerak.
4. Saytni deploy qiling. Netlify Blobs Function ichida avtomatik ishlaydi.

Sayt kodi, GitHub yoki ommaviy URL ichiga token/maxfiy kalit yozmang.
`CHAT_ID` guruh boʻlsa, bot guruhga qoʻshilgan va xabar yuborish huquqiga ega
boʻlishi kerak.

## Python Telegram bot

Bot doimiy ishlashi uchun uni **Render Background Worker** kabi alohida Python
worker hostingiga joylang. Netlify statik saytni va maʼlumotlar API’larini
ishlatadi; Python bot esa Telegram bilan polling orqali ishlaydi.

1. Render’da repository’dan **Background Worker** yarating.
2. Build command: `pip install -r bot/requirements.txt`.
3. Start command: `python bot/bot.py`.
4. Worker’ning **Environment Variables** boʻlimiga quyidagilarni kiriting:
   - `BOT_TOKEN` — `@sabrina_xabar_bot` botining tokeni.
   - `CHAT_ID` — yangi murojaatlar yuboriladigan chat ID.
   - `ADMIN_TELEGRAM_ID` — admin boʻladigan yagona Telegram foydalanuvchisining
     raqamli ID’si. Boshqa ID’lar admin menyusini ocholmaydi.
   - `SITE_API_URL` — Netlify saytining asosiy URL’i, masalan
     `https://sayt-nomi.netlify.app` (oxirida `/` qoʻymang).
   - `ADMIN_API_TOKEN` — Netlify’da kiritilgan ayni maxfiy qiymat.

`BOT_TOKEN`ni Python kodiga yozmang. Lokal sinovda repository ildizidagi `.env`
faylga kiriting; `.env.example` namuna sifatida berilgan va `.env` Git’ga
qoʻshilmaydi. Hostingda tokenni faqat **Environment Variables / Secrets**
boʻlimiga kiriting. Bot ishga tushganda eski Telegram webhook’ni olib tashlab,
polling rejimiga oʻtadi. Sayt formasi uchun Netlify’dagi `BOT_TOKEN` ham yangi
bot tokeni boʻlishi kerak.

Telegram’da botni ochib `/admin` yuboring. Boʻlimni tanlab, matnni bitta xabar
qilib yuborsangiz, saqlangan oʻzgarish saytga yuklanadi. `/stats` yoki admin
menyusidagi statistika tugmasi onlayn tashrifchilar, jami noyob brauzerlar va
oxirgi 30 kunlik kunlik diagrammani koʻrsatadi. Onlayn soni oxirgi 5 daqiqada
faol boʻlgan anonim brauzer ID’lari boʻyicha taxmin qilinadi; brauzer maʼlumotlari
oʻchirilsa, tashrifchi qayta sanalishi mumkin.

## Telegram bot havolasi va murojaatlar

Saytdagi Telegram tugmasi `https://t.me/sabrina_xabar_bot` manziliga olib boradi.
Forma yuborilganda Netlify Function xabarni `CHAT_ID` ga yetkazadi. Botga
kelgan oddiy xabarlar ham `CHAT_ID` ga uzatiladi.

## Lokal ishga tushirish

```text
npm install
npm run dev
```

Python botni sinash uchun `pip install -r bot/requirements.txt` buyrugʻini
bajaring, `.env` sozlang va repository ildizidan `python bot/bot.py` ni ishga
tushiring. Bot hamda Netlify admin API’da `ADMIN_API_TOKEN` bir xil boʻlishi
kerak.

Ish rejaning toʻliq nusxasi [`public/ish-reja.pdf`](./public/ish-reja.pdf)
faylida.
