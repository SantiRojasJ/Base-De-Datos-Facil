# Plan de mejora de BDD Fácil — AdSense, contenido y SEO

- **Sitio**: https://bdd-facil.netlify.app/
- **Documento base**: `AUDITORIA_ADSENSE_SEO.md`
- **Objetivo**: corregir los problemas que probablemente provocaron el rechazo por «contenido de bajo valor» y sentar una base sólida de contenido y SEO antes de solicitar una nueva revisión de Google AdSense.
- **Principio rector**: mejorar la **calidad, utilidad y originalidad** del contenido. **No se persigue un número arbitrario de artículos** ni se busca aprobación por cantidad. Cada tarea define un **criterio verificable de finalización**.

> Alcance de este documento: planificación. No implica cambios aplicados al sitio. Las tareas se ordenan por etapas; dentro de cada etapa, por prioridad. Ninguna tarea de la Etapa 6 debe iniciarse hasta cerrar las anteriores.

---

## Etapa 1 — Problemas técnicos y de indexación

El objetivo es que Google solo pueda rastrear, indexar y mostrar contenido válido, sin errores 404 ni señales contradictorias.

### T1.1 — Decidir el destino de las 7 páginas vacías
- **Qué**: `ddl/alter-table.html`, `ddl/create-table.html`, `ddl/truncate-table.html`, `dml/insert.html`, `dml/select.html`, `dml/update.html`, `dml/delete.html`.
- **Opciones (elegir por página y documentar)**: (a) completar con contenido real siguiendo la plantilla de las páginas completas; o (b) aplicar `noindex` + retirar del `sitemap.xml` + retirar de la navegación hasta que tengan contenido; o (c) redirigir 301 a su artículo padre.
- **Criterio de finalización**: ninguna URL publicada devuelve una página con menos de ~400 palabras de contenido real o comentarios `<!-- Contenido pendiente -->`. Toda página retirada está fuera de `sitemap.xml` y con `noindex`.
- **Prioridad**: Crítica.

### T1.2 — Corregir los 9 breadcrumbs 404
- **Qué**: en los 9 archivos de `ddl/` y `dml/`, cambiar `href="../../sentencias-ddl-tipos-datos.html"` por `href="../sentencias-ddl-tipos-datos.html"`. En los archivos de `dml/`, corregir además el texto del breadcrumb «DML» para que el destino coincida semánticamente.
- **Criterio de finalización**: las 9 URLs de breadcrumb responden HTTP 200; verificado con un chequeo de enlaces local y en el sitio publicado.
- **Prioridad**: Alta.

### T1.3 — Corregir `lang="en"` en `sql-server.html`
- **Qué**: cambiar `<html lang="en">` por `<html lang="es">`.
- **Criterio de finalización**: el atributo `lang` del documento es `es` en las 27 páginas.
- **Prioridad**: Alta.

### T1.4 — Corregir la imagen de `que-es-tsql.html`
- **Qué**: arreglar el `<img>` malformado y agregar `alt` descriptivo real.
- **Criterio de finalización**: la imagen tiene un atributo `alt` no vacío y el HTML valida sin atributos sueltos.
- **Prioridad**: Alta.

### T1.5 — Reparar o retirar recursos rotos
- **Qué**: audios inexistentes en `create-database.html` y `drop-table.html`; MP3 inexistente y MIME incorrecto en `seccion-podcast/que-es-tsql.html`; `href="#"` en `ejercicios-fundamentos.html` e `index.html` (Nivel 2, que existe).
- **Criterio de finalización**: un crawl local no reporta `href`/`src` que apunten a archivos inexistentes; los enlaces a Nivel 2 apuntan a `ejercicios-consultas.html`.
- **Prioridad**: Alta.

### T1.6 — Alinear `sitemap.xml` con la realidad
- **Qué**: retirar las páginas que queden vacías o con `noindex`; corregir `lastmod` futuros; revisar `priority`/`changefreq`.
- **Criterio de finalización**: cada URL del sitemap responde 200, es indexable y tiene contenido real; no hay `lastmod` en el futuro.
- **Prioridad**: Alta.

### T1.7 — Canonical, description y viewport en los 3 podcasts
- **Qué**: añadir `<meta name="description">`, `<link rel="canonical">` y `<meta name="viewport">` a `seccion-podcast/*.html`.
- **Criterio de finalización**: las 3 páginas tienen description única, canonical correcta y viewport.
- **Prioridad**: Alta.

### T1.8 — Resolver la duplicación temática con los podcasts
- **Qué**: elegir entre (a) fusionar cada podcast con su artículo, (b) mantener el podcast como recurso complementario diferenciando intención y con canonical/enlace claro, o (c) completar el podcast con transcripción/resumen de valor. Evitar que compitan por la misma keyword.
- **Criterio de finalización**: no hay dos URLs indexables orientadas a la misma keyword principal sin diferenciación; cada podcast declara su intención de forma distinta al artículo.
- **Prioridad**: Alta.

### T1.9 — Eliminar los placeholders de anuncio ficticios
- **Qué**: quitar los `div.ad-in-content` con el texto «📢 Google AdSense - Anuncio en Contenido 336x280» y cualquier caja simulada, hasta contar con unidades `<ins class="adsbygoogle">` reales.
- **Criterio de finalización**: cero apariciones de texto de anuncio simulado en el HTML publicado.
- **Prioridad**: Alta (es un riesgo directo de política).

---

## Etapa 2 — Mejoras de contenido existente

El objetivo es elevar la calidad de lo que ya está publicado para que cada página aporte valor propio.

### T2.1 — Reescribir `redis-bdd-clave-valor.html`
- **Qué**: eliminar **todos** los marcadores `[cite: N]`; reescribir con voz propia, añadir comandos reales de Redis (`SET`, `GET`, `EXPIRE`, `TTL`, `LPUSH`, `HSET`), casos de uso y errores comunes.
- **Criterio de finalización**: cero coincidencias de `[cite:` en el texto renderizado; el artículo incluye al menos 4 bloques de comandos y una sección de cuándo **no** usar Redis.
- **Prioridad**: Crítica.

### T2.2 — Ampliar `neo4j.html`
- **Qué**: pasar de ~460 a un artículo comparable a sus hermanos (~1000+ palabras): casos de uso, Cypher con más ejemplos, ventajas/desventajas, cuándo no usarlo, conclusión. Corregir «Lectura: 9 min» para que sea veraz o retirarlo.
- **Criterio de finalización**: profundidad y estructura equivalentes a `cassandra.html`/`mongodb.html`; sin metaetiquetas engañosas.
- **Prioridad**: Alta.

### T2.3 — Páginas vacías que se decida conservar (enlaza con T1.1)
- **Qué**: redactar con la plantilla de `create-database.html`/`drop-table.html` (introducción, sintaxis, explicación, ejemplo, caso real, buenas prácticas, errores comunes, ejercicios, resumen).
- **Criterio de finalización**: cada página conservada tiene ≥600 palabras, ≥3 ejemplos SQL y su sección de errores comunes.
- **Prioridad**: Crítica.

### T2.4 — Enriquecer artículos raíz sin ejemplos
- **Qué**: `que-es-sql.html` y `sql-server.html` no tienen bloques de código. Añadir ejemplos mínimos donde aporten; corregir typos («Definicion», «¿Que»).
- **Criterio de finalización**: cada artículo incluye al menos 2 ejemplos SQL/T-SQL y no quedan errores ortográficos en encabezados.
- **Prioridad**: Media.

### T2.5 — Unificar marca y datos institucionales
- **Qué**: unificar «BDD Facil» / «BasesDeDatosFacil» / «BDD Fácil» en un nombre único; corregir el logo inconsistente de las páginas legales; añadir datos de titular/contacto en las páginas legales.
- **Criterio de finalización**: un único nombre de marca coherente en todo el sitio; Legal incluye responsable y forma de contacto.
- **Prioridad**: Media.

### T2.6 — Coherencia de fechas
- **Qué**: corregir la incoherencia de `base-de-datos-nosql.html` (meta `2026-02-15` vs «Marzo 2026»). Añadir fechas de publicación/actualización reales y visibles.
- **Criterio de finalización**: fechas de metadatos y visible coinciden en todas las páginas.
- **Prioridad**: Baja.

### T2.7 — Corregir la solución del ejercicio 10
- **Qué**: en `ejercicios-consultas.html`, la solución usa `HAVING` sin `GROUP BY` y con alias (inválido en SQL Server). Reescribirla de forma válida.
- **Criterio de finalización**: la solución propuesta se ejecuta correctamente en SQL Server (verificado manualmente).
- **Prioridad**: Media.

---

## Etapa 3 — Creación de artículos prioritarios

Solo los temas con demanda real y que hoy faltan o están vacíos. Ver matriz completa en `AUDITORIA_ADSENSE_SEO.md` (sección 5).

### Orden recomendado
1. **A1 — Fundamentos de bases de datos** (tablas, registros, campos, claves). Prioridad Crítica.
2. **A2 — Modelo relacional y diagramas E-R**. Prioridad Crítica.
3. **A3 — Claves primarias y foráneas**. Prioridad Alta.
4. **A4 — SELECT completo**. Prioridad Alta.
5. **A5 — WHERE, ORDER BY, BETWEEN, LIKE, IN**. Prioridad Alta.
6. **A6 — INSERT, UPDATE, DELETE** (cubre 3 vacías). Prioridad Alta.
7. **A7 — JOIN (INNER/LEFT/RIGHT/FULL)**. Prioridad Alta.
8. **A8 — Agregación y GROUP BY/HAVING**. Prioridad Alta.
9. **A10 — Normalización (1FN/2FN/3FN)**. Prioridad Alta.
10. **A16 — Proyecto práctico integrador**. Prioridad Alta.
11. **A9 — Subconsultas**. Prioridad Media.
12. **A11 — Índices y optimización**. Prioridad Media.
13. **A12 — Transacciones y ACID**. Prioridad Media.
14. **A13 — Vistas, procedimientos, funciones y triggers**. Prioridad Media.
15. **A14 — Comparativa SQL Server/MySQL/PostgreSQL/SQLite**. Prioridad Media.
16. **A15 — Errores frecuentes en SQL**. Prioridad Media.

### Criterio de finalización (por artículo)
- Cubre los H2/H3 del esquema aprobado.
- Incluye ejemplos SQL ejecutables y al menos un ejercicio o caso práctico.
- Cita como mínimo una **fuente oficial** cuando haga afirmaciones técnicas (docs de Microsoft/PostgreSQL/MongoDB/Redis/Neo4j/W3C).
- Enlaza a al menos 2 artículos existentes y recibe al menos 2 enlaces internos.
- No contiene texto de relleno ni repeticiones para inflar palabras.
- **Prioridad**: según terna (Alta/Media) indicada arriba.

> Nota: no se crea ningún artículo «por completar la lista». Si al redactar un tema se comprueba que ya está cubierto con calidad suficiente, se descarta.

---

## Etapa 4 — Enlazado interno y estructura temática

El objetivo es eliminar páginas aisladas y evitar canibalización.

### T4.1 — Interconectar los artículos NoSQL
- **Qué**: hoy `cassandra`, `neo4j` y `redis` solo enlazan «Volver». Añadir enlaces cruzados entre hermanos y desde `base-de-datos-nosql.html`.
- **Criterio de finalización**: cada artículo NoSQL enlaza a ≥2 hermanos dentro del texto (no solo en el menú).
- **Prioridad**: Media.

### T4.2 — Definir y enlazar los clústeres temáticos
- **Qué**: crear bloques «Seguí aprendiendo» acordes al clúster (Fundamentos, DML, Diseño, SQL Server/T-SQL, NoSQL, Práctica). Ver sección 5 del informe.
- **Criterio de finalización**: cada artículo pertenece a un clúster y enlaza a su anterior/siguiente temático coherente.
- **Prioridad**: Media.

### T4.3 — Resolver la canibalización artículo vs podcast
- **Qué**: decidir por cada par (`que-es-sql`, `sql-server`, `que-es-tsql`) cuál es la URL canónica y asegurar enlaces y `canonical`.
- **Criterio de finalización**: no quedan dos URLs compitiendo por la misma keyword sin jerarquía definida.
- **Prioridad**: Alta (enlaza con T1.8).

### T4.4 — Navegación coherente
- **Qué**: que la sidebar y el footer no enlacen a páginas vacías o `noindex`.
- **Criterio de finalización**: todos los enlaces de navegación apuntan a páginas 200, indexables y con contenido.
- **Prioridad**: Media.

---

## Etapa 5 — Experiencia de usuario, rendimiento y confianza

### T5.1 — Reducir peso de `imagenes/logo.png`
- **Qué**: el logo pesa ~1,5 MB. Optimizarlo (PNG comprimido/WebP/SVG) y generar un favicon pequeño aparte.
- **Criterio de finalización**: el recurso de logo/favicon pesa < 100 KB y las páginas cargan el favicon correcto.
- **Prioridad**: Media.

### T5.2 — Optimizar carga de fuentes
- **Qué**: migrar `@import` de Google Fonts a `<link rel="preconnect">` + `<link rel="stylesheet">`, o self-host. Añadir `loading="lazy"` a imágenes.
- **Criterio de finalización**: no hay `@import` bloqueante de fuentes; las imágenes usan carga diferida.
- **Prioridad**: Media.

### T5.3 — Accesibilidad básica
- **Qué**: `alt` en todas las imágenes (T1.4), texto alternativo en iconos decorativos/`aria-hidden`, enlaces con texto descriptivo, foco visible, contraste suficiente.
- **Criterio de finalización**: auditoría con axe/Lighthouse sin errores críticos de accesibilidad.
- **Prioridad**: Media.

### T5.4 — Un solo H1 por página
- **Qué**: `index.html` tiene 2 H1. Dejar un único H1 y usar H2 en el resto.
- **Criterio de finalización**: todas las páginas tienen exactamente un H1.
- **Prioridad**: Media.

### T5.5 — Datos estructurados y metadatos sociales
- **Qué**: añadir JSON-LD a los artículos raíz, NoSQL, ejercicios y podcasts; añadir `og:image` (imagen propia) en todas las páginas.
- **Criterio de finalización**: 100 % de páginas con `og:image`; artículos con JSON-LD `Article`/`BreadcrumbList` válido (probar en Rich Results Test).
- **Prioridad**: Media.

### T5.6 — Señales de confianza (E-E-A-T)
- **Qué**: crear página «Sobre mí/Proyecto» y «Contacto»; mostrar autoría real y fecha de actualización; citar documentación oficial en los artículos técnicos.
- **Criterio de finalización**: existen páginas Sobre y Contacto accesibles desde el footer; los artículos técnicos citan al menos una fuente oficial.
- **Prioridad**: Alta.

### T5.7 — Consentimiento de cookies compatible con AdSense
- **Qué**: revisar el orden de carga del script de AdSense respecto al consentimiento; evaluar un CMP certificado; actualizar la Política de Privacidad con detalle de terceros y forma de revocar consentimiento.
- **Criterio de finalización**: el script de anuncios no se carga sin consentimiento donde la normativa lo exija; la Política de Privacidad describe el uso real de cookies y terceros. *(Requiere criterio legal.)*
- **Prioridad**: Alta.

---

## Etapa 6 — Lista de comprobación previa a solicitar una nueva revisión de AdSense

No solicitar la revisión hasta que **todos** los puntos estén verificados:

- [ ] **Sin páginas vacías**: ninguna URL publicada tiene contenido pendiente o thin content (< ~400 palabras sin utilidad).
- [ ] **Sin `[cite:]`** ni restos de generación automática en ningún artículo.
- [ ] **Sin placeholders de anuncio** ficticios en el HTML.
- [ ] **Sin enlaces/en recursos rotos**: 0 errores 404 internos (breadcrumbs y audios corregidos).
- [ ] **Indexación correcta**: `sitemap.xml` coincide con páginas 200 e indexables; sin `lastmod` futuros.
- [ ] **Señales SEO base**: `lang="es"`, un H1 por página, `og:image`, JSON-LD en artículos, favicon.
- [ ] **Sin canibalización** artículo/podcast sin jerarquía definida.
- [ ] **Contenido de calidad**: cada artículo publicado aporta valor propio, tiene ejemplos y, cuando aplica, fuentes oficiales.
- [ ] **Confianza y transparencia**: existen «Sobre» y «Contacto»; autoría y fechas reales; marca unificada.
- [ ] **Legal y cookies**: Privacidad/Términos actualizados; consentimiento compatible con AdSense.
- [ ] **Experiencia**: diseño móvil correcto en todas las páginas (viewport), accesibilidad y rendimiento razonables.
- [ ] **Revisión manual de políticas** de AdSense vigentes (contenido, anuncios, consentimiento) por parte del responsable del sitio.

> Recordatorio: superar esta lista **no garantiza la aprobación** de AdSense. Es la base mínima de calidad, originalidad y estructura para una solicitud razonable.

---

## Orden de ejecución sugerido (resumen)

1. **Etapa 1** completa (técnico e indexación) — desbloquea todo lo demás.
2. **Etapa 2** (calidad de lo existente), empezando por `redis` y las páginas vacías.
3. **Etapa 3** (artículos pilares: A1, A2, A3, A4, A6, A7, A8).
4. **Etapa 4** (enlazado y clústeres).
5. **Etapa 5** (UX, rendimiento, confianza, cookies).
6. **Etapa 6** (verificación y eventual solicitud).

*Fin del plan de mejora.*
