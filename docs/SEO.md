# SEO — Global Skin Metrics

## Qué está implementado en el código

- **`index.html`**: meta base, Open Graph, Twitter Card, `og:image` global.
- **`Seo.jsx`**: título, descripción, canonical, OG/Twitter por ruta; `og:image` por ficha (imagen del ítem).
- **Home**: búsqueda sincronizada con `?q=` en la URL (compatible con `SearchAction` en JSON-LD).
- **`/arma/:id`**: SEO desde el loading (título desde slug) + JSON-LD `Product` con `AggregateOffer` cuando hay precios.
- **`robots.txt`**: indexa el sitio; bloquea `/admin`, `/cuenta`, `/profile`.
- **Sitemap dinámico** (`GET /sitemap.xml` en el backend): home, legales, contacto, suscripciones y **todas** las fichas `/arma/{id}` del catálogo, con `<lastmod>`.
- Nginx y Vite proxy redirigen `/sitemap*.xml` al backend.

## Comprobar en local

```bash
# Sitemap (backend en :5000)
curl -s http://127.0.0.1:5000/sitemap.xml | head -30

# Búsqueda en URL
# Abre http://localhost:5173/?q=ak-47
```

## Pasos recomendados (fuera del código)

1. **Google Search Console**
   - Propiedad `https://globalskinmetrics.com`
   - Enviar sitemap: `https://globalskinmetrics.com/sitemap.xml`
   - Inspeccionar URLs de fichas importantes

2. **Imagen OG**: sustituir `/public/og-global-skin-metrics.png` por un banner 1200×630 si quieres mejor aspecto en redes (ahora usa el logo horizontal).

3. **Contenido y enlaces**: guías, landings por categoría, backlinks — ver auditoría SEO del proyecto.

## Mejoras futuras (opcional)

- Pre-render o HTML para bots en `/arma/*`
- Landings `/cuchillos`, `/rifles`, etc.
- Blog / guías informativas
- `noindex` en páginas legales (opcional)

## Herramientas

- Rich Results Test: https://search.google.com/test/rich-results
- Inspección de URL en Search Console
