# Aura Fev — sitio web

Tienda insignia digital de **Aura Fev**. Sitio estático (HTML + CSS + JS,
sin frameworks) construido para sentirse como una boutique de lujo,
listo para desplegarse en [Render](https://render.com) y preparado para
crecer hacia una tienda completa sin rehacer la arquitectura.

- **Producción:** https://www.aurafev.com
- **Stack:** HTML5, CSS3 (variables nativas, sin preprocesador), JavaScript
  moderno (ES Modules, sin framework, sin bundler)
- **Dependencias en tiempo de ejecución:** ninguna
- **Backend:** no existe todavía — ver [Backend futuro](#backend-futuro)

---

## Tabla de contenidos

1. [Estructura del proyecto](#estructura-del-proyecto)
2. [Desarrollo local](#desarrollo-local)
3. [Variables de entorno](#variables-de-entorno)
4. [Despliegue en Render](#despliegue-en-render)
5. [Conectar el dominio www.aurafev.com](#conectar-el-dominio-wwwaurafevcom)
6. [Arquitectura y decisiones](#arquitectura-y-decisiones)
7. [Pasarela de pagos](#pasarela-de-pagos)
8. [WhatsApp Business API](#whatsapp-business-api)
9. [Backend futuro](#backend-futuro)
10. [Módulos futuros previstos](#módulos-futuros-previstos)
11. [Por qué no hay requirements.txt](#por-qué-no-hay-requirementstxt)
12. [Checklist antes de lanzar a producción](#checklist-antes-de-lanzar-a-producción)

---

## Estructura del proyecto

```
AURA-FEV/
├── index.html                  # Página de inicio (única página del MVP)
├── robots.txt
├── sitemap.xml
├── render.yaml                 # Blueprint de despliegue en Render
├── package.json                # Sin dependencias — solo el script de build
├── .env.example                # Documentación de TODAS las variables (públicas y secretas)
├── .gitignore
├── README.md
│
├── scripts/
│   └── generate-config.js      # Genera js/config/config.js desde variables de entorno
│
├── css/
│   ├── main.css                 # Punto de entrada — importa todo lo demás
│   ├── base/
│   │   ├── variables.css        # Tokens de diseño (colores, radios, sombras, tipografía)
│   │   ├── reset.css
│   │   └── typography.css
│   ├── components/               # Piezas reutilizables (botones, nav, cards, footer, faq, forms, texturas)
│   ├── layout/
│   │   └── sections.css          # Ritmo de secciones + animaciones de scroll-reveal
│   └── pages/
│       └── home.css              # Estilos exclusivos del hero de la home
│
├── js/
│   ├── main.js                   # Entry point de la home
│   ├── config/
│   │   ├── config.js              # GENERADO en build — no editar a mano
│   │   └── index.js                # Wrapper ES module sobre window.__AURA_CONFIG__
│   ├── data/                      # Contenido en JSON (ocasiones, FAQ, testimonios, footer, métodos de pago...)
│   ├── render/                    # Funciones que pintan el DOM a partir de js/data/*.json
│   ├── components/                # Nav, scroll-reveal, parallax del hero, formulario de newsletter
│   ├── utils/                     # Helpers de DOM, librería de íconos, formato de moneda
│   └── services/
│       ├── api/apiClient.js        # Cliente fetch compartido para el futuro backend
│       ├── cart/cartService.js     # Carrito MVP (localStorage), interfaz lista para backend
│       ├── payment/                # Capa de pagos modular — ver sección dedicada
│       ├── whatsapp/whatsappService.js
│       └── analytics/analyticsService.js
│
├── images/                       # Fotografía de producto/lifestyle (vacío por ahora, ver nota de diseño)
│   └── og-image.jpg               # Imagen para previews de redes sociales
│
├── assets/
│   ├── brand/                     # Isotipo y wordmark en SVG
│   └── icons/
│       ├── payments/README.md     # Cómo añadir los logos oficiales de cada método de pago
│       └── social/README.md
│
└── favicon/                      # favicon.svg, PNGs generados, favicon.ico, site.webmanifest
```

### Nota de diseño: por qué no hay fotografías de stock

La home usa el motivo de "aura" (los anillos concéntricos del logo) y la
textura de líneas topográficas del packaging como lenguaje visual
principal, en vez de fotografía de stock genérica. Es una decisión de
marca, no una limitación técnica: mantiene el sitio coherente con los
assets reales de Aura Fev y evita el aspecto "banco de imágenes" que
contradice el brief de lujo. Cuando haya fotografía de producto real,
va en `images/` (hay carpetas lógicas ya previstas: hero, colecciones,
empaque, productos) y se referencia con `<img>` en `index.html` o en las
páginas de producto futuras.

---

## Desarrollo local

No hay build tool ni servidor requerido para editar el sitio. Basta con
generar el archivo de configuración una vez y servir la carpeta con
cualquier servidor estático:

```bash
npm install          # no-op: no hay dependencias, pero deja package-lock.json listo
npm run build         # genera js/config/config.js a partir de tus variables de entorno
npm start             # sirve el sitio en http://localhost:3000 (usa `serve`, vía npx, solo para previsualizar)
```

`npm start` descarga temporalmente el paquete `serve` con `npx` solo
para desarrollo local — no se añade como dependencia del proyecto ni se
usa en producción (Render sirve los archivos directamente).

---

## Variables de entorno

Todas las variables están documentadas con comentarios en
[`.env.example`](./.env.example), separadas en dos grupos:

- **Públicas** — se compilan a `js/config/config.js` por
  `scripts/generate-config.js` y son visibles en el navegador. Nunca
  deben incluir secretos.
- **Solo servidor** — para el backend futuro (tokens de API, claves
  secretas de pasarelas, credenciales de WhatsApp). Nunca se añaden a
  `PUBLIC_KEYS` en `scripts/generate-config.js`.

En Render, cada variable se configura en **Settings → Environment** del
servicio (o directamente en `render.yaml`, usando `sync: false` para las
secretas — Render te las pedirá al crear el Blueprint y no las guarda en
el archivo).

---

## Despliegue en Render

1. **Sube el proyecto a GitHub.**
   ```bash
   git init
   git add .
   git commit -m "Aura Fev — sitio inicial"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/aura-fev.git
   git push -u origin main
   ```

2. **Crea el Blueprint en Render.**
   En el [Dashboard de Render](https://dashboard.render.com), click en
   **New → Blueprint**, conecta tu cuenta de GitHub y selecciona el
   repositorio. Render detecta `render.yaml` automáticamente.

3. **Completa las variables marcadas como secretas.**
   Durante la creación del Blueprint, Render te pedirá un valor para
   cada variable con `sync: false` (número de WhatsApp, llaves públicas
   de las pasarelas, Analytics). Puedes dejarlas vacías por ahora y
   completarlas después desde **Settings → Environment**.

4. **Despliega.** Render ejecuta `npm install && npm run build` y
   publica el contenido de la raíz del repo (`staticPublishPath: .`).

5. **Cada push a `main` vuelve a desplegar automáticamente.**

---

## Conectar el dominio www.aurafev.com

1. En el servicio ya creado en Render, ve a **Settings → Custom Domains**
   y añade `www.aurafev.com` y `aurafev.com` (ambos ya están declarados
   en `render.yaml`, así que Render los propone automáticamente al
   sincronizar el Blueprint).
2. Render te muestra los registros DNS exactos a crear (normalmente un
   registro `CNAME` para `www` apuntando a tu subdominio `.onrender.com`,
   y un registro `A`/`ALIAS` para el dominio raíz).
3. Entra al panel donde compraste el dominio y crea esos registros.
4. Espera la propagación (minutos a un par de horas). Render emite el
   certificado SSL automáticamente en cuanto detecta el DNS correcto —
   no se necesita configuración adicional para HTTPS.
5. Define en Render cuál de los dos (`www` o el dominio raíz) es el
   canónico y redirige el otro, desde la misma pantalla de Custom
   Domains.

---

## Arquitectura y decisiones

- **Sin build tool ni framework.** El sitio de hoy es una landing con
  contenido dinámico ligero (JSON → DOM). Un framework habría sido peso
  muerto para este alcance; añadir uno más adelante (para el carrito o
  checkout, por ejemplo) es una decisión que conviene tomar cuando haya
  interactividad real que lo justifique, no antes.
- **Contenido como datos.** Ocasiones, tarjetas de "por qué Aura Fev",
  empaque, testimonios, FAQ, navegación del footer y métodos de pago
  viven en `js/data/*.json` y se pintan en tiempo de carga
  (`js/render/*.js`). Editar el JSON es suficiente para actualizar
  contenido — no hace falta tocar HTML ni JS. El mismo patrón es el que
  se reemplazará por llamadas a `apiClient` cuando exista backend, sin
  cambiar cómo el resto del código consume esos datos.
- **`js/services/` ya define las interfaces que usará el resto del
  sitio** (carrito, pagos, WhatsApp, analítica), aunque hoy varias
  operaciones lancen errores "no implementado". Esto es intencional:
  el checkout, las cuentas de cliente, etc. se construirán *contra estas
  interfaces*, así que conectarlas a APIs reales más adelante no debería
  requerir refactorizar quién las llama.
- **Sistema de íconos centralizado** (`js/utils/icons.js`) en vez de una
  librería de íconos externa o SVGs duplicados en cada archivo.

---

## Pasarela de pagos

El checkout (cuando exista) mostrará los métodos de pago siempre en este
orden, definido en `js/data/payment-methods.json`:

1. Visa
2. Mastercard
3. Yape
4. Plin
5. PayPal
6. Izipay
7. Niubiz

**Importante:** Visa y Mastercard son marcas de tarjeta, no pasarelas en
sí mismas — se procesan a través de la pasarela activa
(`PAYMENT_CARD_GATEWAY`, configurable entre `izipay` y `niubiz`). Esa
distinción está modelada en `js/services/payment/paymentService.js`.

Cada proveedor vive en su propio archivo bajo
`js/services/payment/providers/` con la misma forma (`isConfigured`,
`isEnabled`, `createCheckoutSession`), documentada en
`js/services/payment/PaymentProvider.js`. Hoy todos son *placeholders*
que lanzan `PaymentProviderNotImplementedError` — están listos para que
alguien conecte la API real de cada uno sin tocar el resto del sitio.

**Ninguna credencial está hardcodeada.** Las llaves públicas
(`IZIPAY_PUBLIC_KEY`, `PAYPAL_CLIENT_ID`, etc.) se leen desde
`js/config`. Las llaves secretas (`IZIPAY_SECRET_KEY`,
`PAYPAL_CLIENT_SECRET`, ...) están documentadas en `.env.example` pero
deliberadamente **no** se compilan al cliente — pertenecen al backend
futuro, que es quien debe hablar con cada pasarela usando esas secretas.

Los badges de métodos de pago (footer hoy; checkout más adelante) son
insignias de texto, no los logotipos oficiales — ver
`assets/icons/payments/README.md` para el paso a paso de reemplazarlos
por el arte de marca real antes de lanzar.

---

## WhatsApp Business API

El número de contacto (**+51 938 700 925**) se configura vía la variable
`WHATSAPP_NUMBER` — nunca está escrito en el código. Con solo esa
variable, `js/services/whatsapp/whatsappService.js` ya genera enlaces
`wa.me` funcionales (botón de WhatsApp en el footer) sin backend.

El resto del archivo son *placeholders* para la API oficial de Meta
(WhatsApp Cloud API): confirmaciones de pedido, confirmaciones de pago,
notificaciones de envío, mensajes de regalo personalizados, recordatorio
de carrito abandonado, campañas promocionales y un gancho para un futuro
asistente con IA. Cada función ya apunta al endpoint de backend que
debería existir (`/whatsapp/order-confirmation`, etc.) — ver
`js/services/api/apiClient.js`.

**Por qué esto no puede vivir en el navegador:** enviar plantillas por la
Cloud API requiere un *access token* permanente y el *phone number ID*
de Meta, que son secretos. Si viajaran al cliente, cualquier visitante
del sitio podría leerlos e impersonar el número de negocio. Por eso
`WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
`WHATSAPP_BUSINESS_ACCOUNT_ID` y `WHATSAPP_VERIFY_TOKEN` están
documentados en `.env.example` bajo la sección "solo servidor" y
deliberadamente excluidos de `scripts/generate-config.js`.

---

## Backend futuro

Este repositorio es **solo el frontend**. Varias piezas (checkout real,
cuentas de cliente, historial de pedidos, reseñas, cupones, tarjetas de
regalo, dashboard de administración, inventario, envío de WhatsApp/email)
necesitan un servidor que guarde datos y hable con APIs de terceros
usando credenciales secretas.

El frontend ya está preparado para ese momento:

- `js/services/api/apiClient.js` es el único punto por donde el resto
  del código llamaría a ese backend (`API_BASE_URL`).
- `js/services/cart/cartService.js` expone una interfaz
  (`getCart/addItem/removeItem/setQuantity/clearCart`) que hoy usa
  `localStorage` y mañana puede usar `apiClient` sin cambiar quién la
  llama.
- Cada `send*()` de `whatsappService.js` y cada `createCheckoutSession()`
  de los proveedores de pago ya asumen que existe un endpoint de backend
  correspondiente.

Cuando se construya ese backend (Node/Express, un runtime serverless, lo
que se decida), puede vivir en un repositorio/servicio de Render aparte
— un `type: web` con `runtime: node` adicional en un `render.yaml`
propio — sin tocar este sitio estático más que apuntar `API_BASE_URL` a
su URL.

---

## Módulos futuros previstos

La arquitectura actual no requiere refactor mayor para incorporar:

Carrito de compras · Checkout seguro · Cuentas de cliente · Historial de
pedidos · Lista de deseos · Reseñas de producto · Panel de
administración · Gestión de inventario · Promociones y cupones ·
Tarjetas de regalo · Mensajes de regalo personalizados · Analítica · SEO
· Blog · Notificaciones por email

Convenciones a seguir al añadir cada uno:
- Páginas nuevas van en la raíz (`producto.html`, `carrito.html`,
  `cuenta.html`...), cada una con su propio `<script type="module"
  src="/js/pages/nombre.js">` de entrada — igual que `js/main.js` para
  la home.
- Contenido que cambie con frecuencia va como JSON en `js/data/` y se
  pinta con una función en `js/render/`.
- Cualquier llamada a un servicio externo pasa por `js/services/`, nunca
  directo desde un componente de UI.

---

## Por qué no hay requirements.txt

Este proyecto no tiene ningún componente en Python — es HTML, CSS y
JavaScript puro, sin build tool que lo requiera. `requirements.txt` se
omite a propósito en vez de crearlo vacío. Si en el futuro el backend
descrito arriba se construye en Python (en vez de Node), su
`requirements.txt` debería vivir junto a ese servicio, no en la raíz de
este repositorio de frontend.

---

## Checklist antes de lanzar a producción

- [ ] Reemplazar los badges de texto de pago por los logotipos oficiales
      (`assets/icons/payments/README.md`)
- [ ] Cargar fotografía real de producto/lifestyle en `images/`
- [ ] Completar `WHATSAPP_NUMBER` y las llaves públicas de pago en Render
- [ ] Construir el backend y apuntar `API_BASE_URL`
- [ ] Ampliar `sitemap.xml` a medida que se añadan páginas
- [ ] Configurar `GA_MEASUREMENT_ID` si se usará Google Analytics
- [ ] Revisar `render.yaml` → Custom Domains una vez el DNS esté propagado
