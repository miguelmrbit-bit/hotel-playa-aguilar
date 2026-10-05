# Hotel Playa de Aguilar — web autogestionable (Eleventy + Decap CMS)

Esta es la versión **autogestionable** del sitio: mismo diseño, pero el contenido
(habitaciones, servicios, entorno, **cartas**, datos del hotel, portada) se edita
desde un **panel web** sin tocar código. Cumple el requisito de Kit Digital de
"web autogestionable".

## Cómo funciona
- **Eleventy** genera las páginas HTML a partir de los datos en `src/_data/*.json`.
- **Decap CMS** (en `/admin/`) es el panel donde el hotel edita esos datos.
- Al guardar en el panel, se publica solo (se reconstruye la web).

Es un sitio **estático** una vez generado → tan seguro como la versión anterior
(sin WordPress, sin base de datos, sin PHP).

---

## Estructura
```
src/
  _data/        → contenido editable (site, home, rooms, services, surroundings, menus)
  _includes/    → base.njk (cabecera, pie, SEO, accesibilidad)
  *.njk         → páginas ES   ·   en/*.njk → páginas EN
  admin/        → panel Decap (index.html + config.yml)
  assets/       → css, js, imágenes
.eleventy.js, package.json, netlify.toml
```

## Publicar (recomendado: Netlify — es lo más sencillo con Decap)

1. **Sube el proyecto a GitHub** (repositorio privado):
   crea un repo y sube todo el contenido de esta carpeta `hotel-cms/`.

2. **Conéctalo a Netlify** (gratis):
   - New site → Import from Git → elige el repo.
   - Build command: `npm run build`  ·  Publish directory: `_site`
   - Deploy. Netlify construye y publica la web.

3. **Activa el panel autogestionable (Decap)** en Netlify:
   - Site settings → **Identity** → *Enable Identity*.
   - Identity → *Registration*: ponlo en **Invite only**.
   - Identity → Services → **Enable Git Gateway**.
   - Pestaña Identity → **Invite users** → invita el email del hotel.
   - El hotel acepta la invitación y ya entra en **https://TU-SITIO/admin/** a editar.

4. **Dominio**: en Netlify → Domain settings, añade `hotelplayadeaguilar.es`
   y apunta el DNS según sus instrucciones (o se queda en el subdominio `.netlify.app` para probar).

> Alternativa: **Cloudflare Pages** también vale (mismo build), pero Decap necesitaría
> un proveedor OAuth de GitHub (algo más de configuración). Netlify es el camino corto.

## Editar en local (opcional, para el desarrollador)
```
npm install
npm run build        # genera la web en /_site
npm start            # servidor local con recarga
npm run cms          # (en otra terminal) backend local de Decap para probar /admin
```

---

## Para la subvención (Kit Digital)
- **Captura de hosting**: el panel de Netlify (o Cloudflare) con el sitio desplegado.
- **Captura "web autogestionable"**: el panel **/admin/** de Decap mostrando las secciones
  (Habitaciones, Servicios, Cartas, Datos del hotel…) → sustituye a la captura de WordPress.
- **Logos Kit Digital**: deja `kit-digital-logos.png` en `src/assets/img/` (ya salen en el footer).
- **Accesibilidad**: construido conforme a **WCAG 2.1 AA**.
- **SEO**: metadatos, Open Graph, hreflang ES/EN, datos estructurados y `sitemap.xml` incluidos.

> ⚠️ Confirma con tu **Agente Digitalizador** que acepta un CMS que no sea WordPress (Decap).
> Si exige WordPress literalmente, habría que justificar con el WordPress ya limpio.

## Pendiente de completar (contenido)
- **Dirección correcta** del hotel → edítala en *Datos del hotel* (o en `src/_data/site.json`).
- **Cartas** (desayunos y restaurante): ahora llevan contenido de ejemplo → edítalas en *Cartas*.
- **Logos oficiales** Kit Digital (`kit-digital-logos.png`).
