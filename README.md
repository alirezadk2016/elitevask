# Elite Vask – Next.js

Componentized Next.js 15 App Router conversion of the single-file landing page.

## Structure
```
src/
 ├─ app/            # Next.js App Router (layout, page, globals)
 ├─ components/     # UI sections
 │   ├─ TrustBar.jsx
 │   ├─ Nav.jsx
 │   ├─ Hero.jsx
 │   ├─ Pricing.jsx          (car selector + price calculator)
 │   ├─ Stats.jsx
 │   ├─ Steps.jsx
 │   ├─ Work.jsx             (before/after + gallery)
 │   ├─ Extras.jsx
 │   ├─ Why.jsx
 │   ├─ Info.jsx
 │   ├─ Reviews.jsx
 │   ├─ FAQ.jsx
 │   ├─ LocalSEO.jsx
 │   ├─ Contact.jsx
 │   ├─ Footer.jsx
 │   ├─ MobileCTA.jsx
 │   ├─ Lightbox.jsx
 │   ├─ BookingWizard.jsx
 │   └─ SiteScripts.jsx      (client-side init: i18n, calc, wizard, slider)
 ├─ lib/
 │   └─ siteInit.js          (legacy DOM init script — preserved 1:1)
 └─ data/
     └─ site.js              (CARS, PKGS, REVIEWS, FAQ, I18N)
```

## Run
```bash
npm install
npm run dev
```
