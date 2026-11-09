# Auditoría final para re-solicitud de AdSense — BDD Fácil

- **Sitio:** https://bdd-facil.netlify.app/
- **Repositorio:** https://github.com/SantiRojasJ/Base-De-Datos-Facil
- **Fecha de auditoría:** 2026-11-09
- **Motivo de rechazo previo:** «Contenido de bajo valor»
- **Alcance:** revisión estática completa de HTML, CSS, JS, sitemap, robots y assets. Sin modificaciones al sitio.
- **ID de AdSense detectado:** `ca-pub-1323641111499660`

---

## 1. Veredicto

**NO re-solicitar AdSense todavía.** El sitio tiene contenido técnico sólido en varias páginas, pero mantiene exactamente los patrones que Google asocia a «contenido de bajo valor»:

1. **5 páginas completamente vacías**, indexables, con canonical, incluidas en `sitemap.xml` y enlazadas desde la navegación principal (12 bloques «Contenido pendiente» cada una).
2. **17 archivos con placeholders visibles de anuncios** («BANNER ADSENSE», «ANUNCIO EN CONTENIDO»), incluida la home.
3. **Páginas delgadas** (podcast y `que-es-sql.html`) con una sola frase y un reproductor.
4. **Errores funcionales en ejercicios** que impiden ejecutarlos o validan solo una respuesta literal.

Resolver los puntos críticos y altos es condición necesaria antes de una nueva solicitud.

---

## 2. Metodología

Se revisaron los 30 archivos HTML (27 páginas de contenido + 3 archivos de verificación de Google), 4 hojas de estilo, 4 archivos JS propios, `sitemap.xml`, `robots.txt`, enlaces internos, recursos multimedia y metadatos SEO. Se verificó: contenido real, metadatos, canonical, robots, datos estructurados, enlaces rotos, responsive, consentimiento de cookies y coherencia de los ejemplos SQL.

---

## 3. Hallazgos críticos

### C1. Cinco páginas vacías e indexables (riesgo máximo)

| Página | Líneas | `<p>` | `<pre>` | «Contenido pendiente» |
|---|---|---|---|---|
| `articulos/base-de-datos-relacionales/ddl/truncate-table.html` | 147 | 0 | 0 | 12 |
| `articulos/base-de-datos-relacionales/dml/insert.html` | 147 | 0 | 0 | 12 |
| `articulos/base-de-datos-relacionales/dml/select.html` | 147 | 0 | 0 | 12 |
| `articulos/base-de-datos-relacionales/dml/update.html` | 147 | 0 | 0 | 12 |
| `articulos/base-de-datos-relacionales/dml/delete.html` | 145 | 0 | 0 | 12 |

Todas tienen `<meta name="robots" content="index, follow">`, canonical propio, bloque AdSense, figura en el menú de `index.html` y entrada en `sitemap.xml` con `priority 0.8`.

- **Gravedad:** Crítica
- **Motivo:** Google rastrea 5 URLs sin contenido útil y con anuncios: es la señal más directa de «bajo valor».
- **Solución:** redactar contenido real (explicación, sintaxis, ejemplos ejecutables, errores comunes, buenas prácticas, ejercicios) **antes** de re-solicitar. Mientras no exista contenido: retirarlas del sitemap y de la navegación, o aplicar `noindex` temporal. No sirve solo rellenar con texto genérico.
- **Prioridad:** 1

### C2. Placeholders de anuncios visibles en 17 archivos

Bloques «BANNER ADSENSE» / «ANUNCIO EN CONTENIDO» en 17 páginas, incluida `index.html` (2 bloques visibles: 728x90 y 336x280). No son anuncios reales, son cajas de ejemplo.

- **Gravedad:** Crítica
- **Motivo:** una home con cajas de anuncio de ejemplo comunica sitio en construcción; además ocupa espacio publicitario sin contenido que lo respalde.
- **Solución:** eliminar los placeholders y dejar solo unidades reales de AdSense, o ninguna hasta tener contenido completo.
- **Prioridad:** 1

### C3. Ejercicio 10 de consultas con SQL inválido en SQL Server

`articulos/base-de-datos-relacionales/ejercicios/ejercicios-consultas.html:628` y `js/ejercicios-consultas.js:39`:

```sql
SELECT C.nombre_carrera,
       (SELECT COUNT(*) FROM Alumnos A WHERE A.id_carrera = C.id_carrera) AS cantidad_alumnos,
       (SELECT COUNT(*) FROM Materias M WHERE M.id_carrera = C.id_carrera) AS cantidad_materias
FROM Carreras C
HAVING cantidad_alumnos > 2
ORDER BY cantidad_alumnos DESC;
```

- `HAVING` sin `GROUP BY` trata todo el resultado como un único grupo, no filtra por carrera.
- En SQL Server no se puede usar el alias `cantidad_alumnos` dentro de `HAVING`.
- **Gravedad:** Crítica (el sitio enseña SQL y publica una solución incorrecta)
- **Solución:** usar `WHERE` con subconsulta, o una tabla derivada / CTE:

```sql
SELECT C.nombre_carrera, X.cantidad_alumnos, X.cantidad_materias
FROM Carreras C
CROSS APPLY (
    SELECT COUNT(*) AS cantidad_alumnos FROM Alumnos A WHERE A.id_carrera = C.id_carrera
) X
CROSS APPLY (
    SELECT COUNT(*) AS cantidad_materias FROM Materias M WHERE M.id_carrera = C.id_carrera
) Y
WHERE X.cantidad_alumnos > 2
ORDER BY X.cantidad_alumnos DESC;
```

- **Prioridad:** 1

### C4. Ejercicios de consultas no ejecutables (faltan tablas)

`ejercicios-consultas.html` usa `Alumnos`, `Carreras` y `Materias`, pero **no incluye ningún script `CREATE TABLE` / `INSERT`**. El Nivel 1 crea `Biblioteca.Libros` y `Universidad.Alumnos` sin `id_carrera`, y no crea `Carreras` ni `Materias`. El alumno no puede reproducir los ejercicios.

- **Gravedad:** Crítica
- **Solución:** añadir al inicio del Nivel 2 un bloque «Preparación del entorno» con `CREATE DATABASE`, `CREATE TABLE` e `INSERT` de las tres tablas, o un script descargable.
- **Prioridad:** 1

---

## 4. Hallazgos altos

### A1. Enlaces internos rotos en breadcrumbs (9 páginas)

Las 5 páginas DDL y las 4 DML enlazan `../../sentencias-ddl-tipos-datos.html`, que resuelve a `articulos/sentencias-ddl-tipos-datos.html` (inexistente). La ruta correcta es `../sentencias-ddl-tipos-datos.html`.

- Páginas: `ddl/{create-database,create-table,alter-table,drop-table,truncate-table}.html` y `dml/{insert,select,update,delete}.html`.
- **Gravedad:** Alta
- **Solución:** corregir a `../sentencias-ddl-tipos-datos.html`.
- **Prioridad:** 2

### A2. Marcadores de copia `[cite:` en Redis (26 ocurrencias)

`articulos/base-de-datos-no-relacionales/redis-bdd-clave-valor.html` conserva 26 marcas `[cite:` provenientes de una fuente externa.

- **Gravedad:** Alta
- **Motivo:** señal de contenido copiado/pegado sin edición; además rompe la lectura.
- **Solución:** eliminar los marcadores y reescribir/atribuir el contenido con redacción propia.
- **Prioridad:** 2

### A3. Validación de ejercicios por coincidencia exacta

`js/ejercicios.js:74-126` y `js/ejercicios-consultas.js:74-126` normalizan (minúsculas, sin corchetes, sin `;`, espacios colapsados) y comparan **igualdad exacta** contra una única solución.

- Una respuesta correcta pero distinta (orden de columnas, `INSERT` con lista de columnas, `JOIN` alternativo, comillas, alias) se marca incorrecta.
- **Gravedad:** Alta (experiencia y credibilidad educativa)
- **Solución:** validar por palabras clave/estructura, aceptar variantes documentadas o mostrar la solución como referencia en lugar de corregir con igualdad estricta.
- **Prioridad:** 2

### A4. Páginas de podcast sin SEO ni viewport

`seccion-podcast/{que-es-sql,que-es-tsql,sql-server}.html` no tienen `<meta name="viewport">`, `description`, `canonical`, `robots` ni datos estructurados. Tienen ~1 párrafo y un reproductor. Aun así están en `sitemap.xml` con `priority 0.8` y cargan AdSense.

- **Gravedad:** Alta
- **Motivo:** contenido delgado + sin adaptación móvil + indexable.
- **Solución:** añadir transcripción/resumen real, metadatos completos y viewport; o `noindex` hasta enriquecerlas.
- **Prioridad:** 2

### A5. Audio inexistente en 3 páginas

- `ddl/create-database.html` → `../../../seccion-podcast/CREATE DATABASE — Podcast.m4a`
- `ddl/drop-table.html` → `../../../seccion-podcast/DROP TABLE — Podcast.m4a`
- `seccion-podcast/que-es-tsql.html` → `T-SQL_lógica_procedimental_y_transacciones_seguras.mp3`

- **Gravedad:** Alta (reproductor roto)
- **Solución:** subir los archivos o quitar los reproductores.
- **Prioridad:** 2

### A6. `lang="en"` en página en español

`articulos/base-de-datos-relacionales/sql-server.html` declara `<html lang="en">` con contenido íntegramente en español.

- **Gravedad:** Alta (SEO/accesibilidad)
- **Solución:** `lang="es"`.
- **Prioridad:** 2

---

## 5. Hallazgos medios

| # | Problema | Página(s) | Solución | Prioridad |
|---|---|---|---|---|
| M1 | `lastmod` con fechas futuras (2026-09-17, 2026-07-28, etc.) y dos URLs con `priority 1.0` (`/` y `/bienvenida.html`) | `sitemap.xml` | Fechas reales; una sola home prioritaria | 3 |
| M2 | Páginas `noindex` incluidas en el sitemap | `legal/privacidad.html`, `legal/terminos.html` | Quitarlas del sitemap | 3 |
| M3 | Páginas legales cargan AdSense pese a `noindex` | `legal/*.html` | Quitar script o dejarlo solo si aplica | 3 |
| M4 | `bienvenida.html` es una splash mínima (marca + CTA) con canonical propio y `priority 1.0`; compite con `index.html` | `bienvenida.html` | Consolidar en `index.html` (301) o darle contenido real y `noindex` | 3 |
| M5 | La home declara 3 niveles / 30 ejercicios (`TOTAL_NIVELES = 3`) pero solo existen 2 niveles / 20 ejercicios | `index.html:537-539` | Ajustar a 2 niveles o publicar el Nivel 3 | 3 |
| M6 | Contenido delgado: `que-es-sql.html` (~83 líneas, 4 `<p>`, 2 `<h2>`); `neo4j.html` (5 `<p>`); `redis` (8 `<p>`) | Relacionales / No relacionales | Ampliar con ejemplos, comparativas y casos de uso reales | 3 |
| M7 | Marca y tono inconsistentes: «BDD Facil» vs «BasesDeDatosFacil»; voseo argentino («Aprendé», «Descubrí») mezclado con español neutro | `neo4j.html` y resto | Unificar nombre y registro lingüístico | 3 |
| M8 | ``` `` ``` literal al final del documento | `ddl/alter-table.html`, `ddl/create-table.html` | Eliminar | 3 |
| M9 | Datos estructurados solo en home + DDL/DML; ausentes en no relacionales, podcast y ejercicios | 16 páginas | Añadir `Article`/`Course`/`BreadcrumbList` coherentes | 4 |
| M10 | El botón «Rechazar» de cookies solo guarda `localStorage`; AdSense se carga igual | `cookies/index.js` + todas las páginas | Bloquear scripts no esenciales hasta consentimiento | 3 |

---

## 6. Clasificación por página

| Página | Clasificación | Acción principal |
|---|---|---|
| `index.html` | MEJORAR | Quitar placeholders, corregir 2→3 niveles |
| `bienvenida.html` | ELIMINAR (consolidar) | Redirigir a `index.html`; si se conserva, dar contenido y `noindex` |
| `ddl/truncate-table.html` | REHACER | Contenido completo desde cero |
| `dml/insert.html` | REHACER | Contenido completo desde cero |
| `dml/select.html` | REHACER | Contenido completo desde cero |
| `dml/update.html` | REHACER | Contenido completo desde cero |
| `dml/delete.html` | REHACER | Contenido completo desde cero |
| `ddl/create-database.html` | MEJORAR | Breadcrumb, audio, placeholders |
| `ddl/create-table.html` | MEJORAR | Breadcrumb, backticks |
| `ddl/alter-table.html` | MEJORAR | Breadcrumb, backticks |
| `ddl/drop-table.html` | MEJORAR | Breadcrumb, audio, placeholders |
| `sentencias-ddl-tipos-datos.html` | CONSERVAR | Revisión menor |
| `que-es-sql.html` | MEJORAR | Ampliar contenido |
| `que-es-tsql.html` | MEJORAR | Breadcrumb, ampliar |
| `sql-server.html` | MEJORAR | `lang="es"` |
| `ejercicios-fundamentos.html` | MEJORAR | Validación flexible |
| `ejercicios-consultas.html` | REHACER | Script de tablas + corregir ejercicio 10 + validación |
| `base-de-datos-nosql.html` | CONSERVAR | Revisión menor |
| `base-de-datos-documentales/mongodb.html` | CONSERVAR | Revisión menor |
| `cassandra.html` | CONSERVAR | Revisión menor |
| `neo4j.html` | MEJORAR | Marca/tono, ampliar |
| `redis-bdd-clave-valor.html` | REHACER | Quitar `[cite:`, reescribir, ampliar |
| `seccion-podcast/que-es-sql.html` | REHACER | Transcripción, metadatos, viewport |
| `seccion-podcast/que-es-tsql.html` | REHACER | Transcripción, metadatos, audio |
| `seccion-podcast/sql-server.html` | REHACER | Transcripción, metadatos, viewport |
| `legal/privacidad.html` | CONSERVAR | Quitar del sitemap |
| `legal/terminos.html` | CONSERVAR | Quitar del sitemap |

---

## 7. Plan de acción priorizado

### Fase 1 — Bloqueantes para AdSense (obligatorio)
1. Redactar contenido real en `truncate-table.html` y los 4 artículos DML.
2. Eliminar los placeholders de anuncios de los 17 archivos.
3. Corregir el ejercicio 10 de consultas y añadir el script de creación de `Alumnos`, `Carreras` y `Materias`.
4. Corregir los 9 breadcrumbs rotos.
5. Quitar los 26 marcadores `[cite:` de Redis.
6. Reparar o retirar los 3 reproductores con audio inexistente.

### Fase 2 — Calidad y confianza
7. Ampliar `que-es-sql.html`, `neo4j.html` y `redis`.
8. Añadir transcripción y metadatos a las 3 páginas de podcast (o `noindex`).
9. Flexibilizar la validación de ejercicios.
10. Unificar marca y tono; corregir `lang="en"`.
11. Ajustar la home a 2 niveles (o publicar el Nivel 3).

### Fase 3 — Limpieza técnica
12. Sanear `sitemap.xml` (fechas reales, sin páginas vacías ni legales, una sola prioridad 1.0).
13. Resolver `bienvenida.html`.
14. Bloquear AdSense hasta consentimiento de cookies.
15. Eliminar backticks sueltos y scripts basura del repo (`chk.py`, `do_patch.py`, `fill_create.py`, `fix_create.py`, `page*.txt`).

---

## 8. Checklist antes de re-solicitar

- [ ] Ninguna página con «Contenido pendiente» publicada ni en sitemap.
- [ ] Cero placeholders de anuncios.
- [ ] Todos los enlaces internos y reproductores funcionan.
- [ ] Cada artículo tiene explicación, sintaxis, al menos un ejemplo completo y errores comunes.
- [ ] Los ejercicios son ejecutables y sus soluciones son SQL válido en SQL Server.
- [ ] `sitemap.xml` solo contiene URLs indexables, con fechas reales.
- [ ] Home sin promesas de contenido inexistente.
- [ ] Consentimiento de cookies coherente con la carga de AdSense.
- [ ] Revisión manual de 5 páginas al azar en móvil.

---

## 9. Anexos

### Anexo A — Inventario de enlaces rotos
- 9 × `../../sentencias-ddl-tipos-datos.html` (5 DDL + 4 DML).
- 1 × audio `CREATE DATABASE — Podcast.m4a`.
- 1 × audio `DROP TABLE — Podcast.m4a`.
- 1 × audio `T-SQL_lógica_procedimental_y_transacciones_seguras.mp3`.

### Anexo B — Páginas con bloque placeholder de AdSense (17)
`bienvenida.html`, `index.html`, `base-de-datos-nosql.html`, `cassandra.html`, `neo4j.html`, `redis-bdd-clave-valor.html`, `mongodb.html`, `que-es-sql.html`, `que-es-tsql.html`, `sentencias-ddl-tipos-datos.html`, `sql-server.html`, `ddl/truncate-table.html`, `ddl/create-database.html`, `ddl/drop-table.html`, `dml/delete.html`, `dml/insert.html`, `dml/select.html`, `dml/update.html`.

### Anexo C — Fortalezas a conservar
- Artículos DDL con ejemplos abundantes (`create-database.html`, `drop-table.html`, `sentencias-ddl-tipos-datos.html`).
- Ejercicios interactivos con progreso persistente en `localStorage`.
- Diseño consistente y con media queries en las 4 hojas de estilo.
- `robots.txt` correcto y canonical presente en las páginas principales.
- Datos estructurados en home y artículos DDL/DML.

---

**Conclusión:** el sitio tiene una base real y contenido de valor en varias páginas, pero hoy convive con 5 páginas vacías indexadas, placeholders publicitarios y ejercicios con errores. Publicar AdSense en este estado reproduce el motivo del rechazo. Completar la Fase 1 es el mínimo para volver a solicitar.
