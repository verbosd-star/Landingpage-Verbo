# Guía: Montar el nuevo sitio de Verbo Taller en WordPress (Hostinger)

Esta guía va en orden. Cada fase termina con una lista de comprobación. Los nombres de los menús pueden variar un poco según la versión de Hostinger y de WordPress.

**Resumen del plan:**
1. Construir el sitio nuevo en un **subdominio de prueba** (la landing actual sigue funcionando).
2. Dejar todo editable con **Kadence** + el editor de bloques.
3. Cuando esté listo, **pasarlo al dominio principal** y redirigir lo viejo.

---

## Fase 0 · Antes de empezar

- [ ] Entrar a **hPanel** de Hostinger y revisar el plan: en **Sitios web** comprueba cuántos sitios permite. El plan "Single" permite 1; "Premium" y "Business" permiten más. Si solo permite 1, ver la nota al final de la Fase 1.
- [ ] **Descargar una copia de la landing actual:** hPanel → Archivos → Administrador de archivos → carpeta `public_html` → seleccionar todo → Comprimir → descargar el `.zip`. Guárdalo; es tu respaldo.
- [ ] Tener a mano: logo en PNG/SVG, colores de marca (están en `css/styles.css` de este repositorio), fotos del equipo y de los proyectos.

---

## Fase 1 · Instalar WordPress en un subdominio de prueba

1. hPanel → **Dominios** → **Subdominios** → crear `nuevo` (quedará `nuevo.tudominio.com`).
2. hPanel → **Sitios web** → **Agregar sitio web** (o **Auto Installer**) → **WordPress** → elegir el subdominio `nuevo.tudominio.com`.
   - Idioma: **Español**.
   - Usuario administrador: **no uses "admin"**; usa un nombre propio y una contraseña larga. Guárdala en un gestor de contraseñas.
   - Si el instalador ofrece temas o plugins extra (por ejemplo, plantillas de IA), puedes omitirlos.
3. hPanel → **Seguridad** → **SSL**: comprobar que el subdominio tenga el certificado activo (candado / `https`).
4. Entrar a `https://nuevo.tudominio.com/wp-admin`.
5. **Muy importante:** Ajustes → Lectura → marcar **"Disuadir a los motores de búsqueda de indexar este sitio"**. Así Google no indexa la versión de prueba.

> **Si tu plan solo permite 1 sitio:** algunos planes de Hostinger incluyen la herramienta **Staging** para WordPress (en el panel del sitio WordPress). Otra opción es instalar WordPress en una carpeta (`tudominio.com/nuevo`). Escríbeme qué ves en tu panel y te digo la mejor opción.

**Comprobación:**
- [ ] El sitio abre en `https://nuevo.tudominio.com`
- [ ] "Disuadir a los motores de búsqueda" está marcado

---

## Fase 2 · Ajustes básicos de WordPress

1. **Ajustes → Generales:** título "Verbo Taller", descripción corta "Agencia de Marketing Creativo en Santo Domingo", zona horaria **Santo Domingo**, formato de fecha "j \d\e F \d\e Y".
2. **Ajustes → Enlaces permanentes:** elegir **Estructura personalizada** y escribir `/blog/%postname%/`. Así los artículos quedan como `/blog/titulo-del-articulo/`.
3. **Ajustes → Comentarios** (Ajustes → Comentarios): desmarcar "Permitir que se publiquen comentarios" si no quieres comentarios en el blog (evita spam).
4. Borrar el contenido de ejemplo: la entrada "¡Hola, mundo!", la "Página de ejemplo" y los plugins que no vayas a usar.

---

## Fase 3 · Tema Kadence

1. Apariencia → Temas → Añadir nuevo → buscar **Kadence** → Instalar → Activar.
2. Plugins → Añadir nuevo → **Kadence Blocks** → Instalar → Activar (añade bloques de filas, columnas, botones, pestañas, preguntas frecuentes, etc.).
3. Apariencia → **Personalizar** (todo esto queda editable después desde aquí):
   - **Colores → Paleta global:** poner los colores de la marca. Al cambiar un color aquí, cambia en todo el sitio.
   - **Tipografía:** elegir la fuente de títulos y la de textos (las mismas de la landing).
   - **Cabecera (Header):** constructor visual de arrastrar y soltar. Poner logo a la izquierda, menú en el centro o a la derecha, y un botón "Cotizar" que enlace a WhatsApp.
   - **Pie de página (Footer):** columnas con logo, servicios, contacto (dirección, teléfono, correo), redes sociales y enlace a la política de privacidad.
   - **Identidad del sitio:** logo e icono del sitio (favicon).

**Comprobación:**
- [ ] Colores y tipografías de la marca configurados de forma global
- [ ] Cabecera y pie hechos con el constructor de Kadence (no con código)

---

## Fase 4 · Plugins

Instalar desde Plugins → Añadir nuevo. Todos tienen versión gratuita suficiente.

| Plugin | Para qué |
|---|---|
| **Rank Math SEO** | Títulos, descripciones, sitemap, datos estructurados, SEO local |
| **LiteSpeed Cache** | Velocidad (Hostinger usa servidores LiteSpeed) |
| **Fluent Forms** (o WPForms Lite) | Formulario de contacto |
| **Advanced Custom Fields (ACF)** | Crear el tipo de contenido "Casos de éxito" |
| **Redirection** | Redirecciones 301 al hacer el cambio de dominio |
| **Complianz** (o CookieYes) | Aviso de cookies |
| **Joinchat** | Botón flotante de WhatsApp (el número se cambia en un solo lugar) |
| **UpdraftPlus** | Copias de seguridad (además de las de Hostinger) |

No instales más de lo necesario: cada plugin extra hace el sitio más lento.

---

## Fase 5 · Tipo de contenido "Casos de éxito"

1. ACF → **Tipos de contenido** (Post Types) → Añadir nuevo:
   - Nombre plural: **Casos de éxito** · Singular: **Caso de éxito**
   - Slug / clave: `casos-de-exito`
   - En ajustes avanzados: activar **Tiene archivo** (Has Archive) con slug `casos-de-exito`, y **desactivar "With Front"** (para que la URL no quede como `/blog/casos-de-exito/`).
   - Activar **Mostrar en REST** (necesario para el editor de bloques) y que soporte **imagen destacada**, **extracto** y **editor**.
2. ACF → **Taxonomías** → Añadir nueva: **Categorías de caso** (Branding, Redes Sociales, Contenido, Publicidad, Estrategia, Web), vinculada a Casos de éxito.
3. Ajustes → Enlaces permanentes → **Guardar** (sin cambiar nada; refresca las URLs).
4. Crear el primer caso y comprobar que abre en `/casos-de-exito/nombre-del-caso/`.

Desde ahora, en el menú lateral aparece **"Casos de éxito" → Añadir nuevo**: cualquiera del equipo puede publicar un caso sin tocar código.

---

## Fase 6 · Secciones reutilizables (patrones sincronizados)

Las piezas que se repiten en varias páginas se crean **una sola vez** como patrón sincronizado. Al editarlo, cambia en todas las páginas.

Cómo crear uno: en el editor, seleccionar el grupo de bloques → menú de tres puntos → **Crear patrón** → activar **Sincronizado** → ponerle nombre.

Crear estos:
- [ ] **CTA final** — "¿Listo para que tu marca hable más fuerte?" + botón de WhatsApp
- [ ] **Nuestro proceso** — los 4 pasos (Diagnóstico, Estrategia, Ejecución, Medición)
- [ ] **Planes de redes sociales** — las 3 tarjetas con precios (aparecen en Redes Sociales y se pueden mostrar en Inicio)
- [ ] **Planes de diseño web** — las 3 tarjetas
- [ ] **Datos de contacto** — dirección, teléfono, correo

Para editarlos todos juntos: Apariencia → **Editor** → **Patrones** (o desde cualquier página donde estén insertados).

---

## Fase 7 · Crear las páginas

Usar como texto base los archivos de `docs/wordpress/`. Orden recomendado:

1. **Servicios** (`pagina-servicios.md`) — crearla primero porque es la página madre.
2. Las **10 páginas de servicio** (`servicio-*.md`). En cada una: barra lateral → **Página** → **Superior: Servicios**, y en **URL / slug** poner el que indica el archivo (p. ej. `gestion-de-redes-sociales`).
3. **Inicio** (`pagina-inicio.md`).
4. **Nosotros**, **Contacto**, **Política de privacidad**.
5. Una página vacía llamada **Blog**.
6. Ajustes → Lectura → **Tu página de inicio muestra: Una página estática** → Portada: **Inicio** · Página de entradas: **Blog**.
7. Ajustes → Privacidad → elegir **Política de privacidad**.

Cómo pasar el texto: copiar desde el archivo y pegar en el editor. Los títulos `#`, `##` se convierten en bloques de encabezado; revisar que solo haya **un H1** por página. Lo que está entre [corchetes] se sustituye por el bloque correspondiente (botón, formulario, casos de éxito…).

Bloques útiles de Kadence para cada sección:
- **Fila (Row Layout):** para cada sección con fondo de color o imagen.
- **Botón avanzado:** botones de WhatsApp (enlace `https://wa.me/18099136191?text=...`, abrir en nueva pestaña).
- **Acordeón:** preguntas frecuentes. (Para los datos estructurados de FAQ, usar en su lugar el bloque **FAQ de Rank Math**.)
- **Info Box / Columnas:** tarjetas de servicios y planes.
- **Consulta (Query Loop, bloque de WordPress):** mostrar los últimos casos de éxito en Inicio y en cada servicio; en sus ajustes elegir tipo de contenido **Casos de éxito**.

**Menú:** Apariencia → Menús (o el editor de cabecera de Kadence) → Inicio · Servicios (con los 10 como submenú) · Casos de éxito · Blog · Nosotros · Contacto.

---

## Fase 8 · SEO con Rank Math

1. Al activarlo se abre el **asistente**: modo **Avanzado**.
   - Tipo de sitio: **Pequeña empresa / Negocio local** → Tipo: **Agencia de marketing** (o Professional Service).
   - Nombre, logo, imagen social por defecto (1200×630 px).
   - Conectar con **Google Search Console** (se hace en el paso 3 de abajo si no lo haces aquí).
   - Sitemap: activado. Incluir páginas, entradas y casos de éxito; excluir etiquetas y archivos de autor.
2. Rank Math → Títulos y Meta → **SEO local**: dirección, teléfono, horario y redes, **exactamente igual** que en `pagina-contacto.md`.
3. En cada página: abrir el panel de Rank Math (arriba a la derecha en el editor) → pegar el **título SEO**, la **meta descripción** y la **palabra clave principal** de su archivo.
4. Política de privacidad → Rank Math → Avanzado → **noindex**.

---

## Fase 9 · Formulario, cookies y WhatsApp

- **Fluent Forms:** crear el formulario de contacto con los campos de `pagina-contacto.md`. En **Ajustes → Notificaciones** poner el correo que recibe los mensajes. Insertarlo en Contacto con el bloque de Fluent Forms. Hacer un envío de prueba.
- **Complianz:** seguir el asistente (región: "Otras / Global"), y enlazar la Política de privacidad.
- **Joinchat:** poner el número `18099136191` y un mensaje inicial. Aparece en todas las páginas.

---

## Fase 10 · Usuarios y roles

Usuarios → Añadir nuevo:
- **Administrador:** solo 1–2 personas de confianza.
- **Editor:** puede crear y editar páginas, entradas y casos de éxito, pero no cambiar plugins ni ajustes. Ideal para el equipo.
- **Autor:** solo puede escribir y publicar sus propias entradas del blog.

Cada persona con su propio usuario y contraseña (nada de compartir el acceso).

---

## Fase 11 · Revisión antes de publicar

- [ ] Todas las páginas se ven bien en **celular** (vista previa del editor → Móvil)
- [ ] Todos los botones de WhatsApp abren el chat con el mensaje correcto
- [ ] El formulario llega al correo
- [ ] Cada página tiene título SEO y meta descripción en Rank Math
- [ ] Solo un H1 por página
- [ ] Las imágenes tienen texto alternativo y pesan poco (subirlas en WebP o JPG de menos de 300 KB)
- [ ] LiteSpeed Cache activado (ajustes por defecto) y velocidad revisada en [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Copia de seguridad completa hecha con UpdraftPlus

---

## Fase 12 · Pasar al dominio principal

1. Volver a revisar que tienes el `.zip` de la landing (Fase 0).
2. **Mover el sitio** del subdominio al dominio principal. Dos opciones:
   - Herramienta de Hostinger para **copiar/migrar sitio** si tu plan la incluye (en el panel del sitio WordPress).
   - O con el plugin **All-in-One WP Migration** o **Duplicator**: exportar desde `nuevo.tudominio.com`, instalar un WordPress limpio en `tudominio.com` (después de vaciar `public_html`, ya respaldado) e importar.
3. En el sitio ya publicado:
   - Ajustes → Lectura → **desmarcar** "Disuadir a los motores de búsqueda".
   - Ajustes → Generales → comprobar que las dos direcciones sean `https://tudominio.com`.
   - Ajustes → Enlaces permanentes → Guardar.
4. **Redirection** → añadir redirecciones 301:
   - `/index.html` → `/`
   - Si `nuevo.tudominio.com` sigue existiendo, redirigirlo entero al dominio principal (o borrar el subdominio).
5. Asegurarse de que **ya no existe** la carpeta `/admin/` de la landing vieja.
6. Rank Math → **sitemap** → copiar la URL (`https://tudominio.com/sitemap_index.xml`) y enviarla en **Google Search Console** → Sitemaps.
7. Crear o actualizar el perfil de **Google Business** con los mismos datos y enlazar la web.

**Comprobación final:**
- [ ] `tudominio.com` muestra el sitio nuevo con candado `https`
- [ ] "Disuadir a los motores de búsqueda" está **desmarcado**
- [ ] Sitemap enviado a Search Console
- [ ] Perfil de Google Business enlazado a la web

---

## Después de publicar: rutina recomendada

- **Semanal:** revisar mensajes del formulario y actualizaciones de plugins (Escritorio → Actualizaciones).
- **Cada mes:** publicar 2–4 artículos en el blog y 1 caso de éxito nuevo; revisar en Search Console qué búsquedas traen visitas.
- **Cada 3 meses:** revisar precios y textos de los planes (se cambian en el patrón sincronizado y se actualizan solos en todas las páginas).
