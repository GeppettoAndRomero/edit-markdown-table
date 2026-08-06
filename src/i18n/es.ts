import type { ToolContent } from './types';

// Español. Transcreación basada en el vocabulario que usan los editores Markdown en
// español, no traducción literal. Sin palabras publicitarias (fácil / rápido / perfecto…);
// la privacidad se explica de forma estructural, no como promesa. Español pan-regional
// (BRAND-OPERATING-MODEL / I18N-SEO-GUIDELINE).

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Editar tabla Markdown — Editor de tablas GFM, sin subir archivos | runlocally',
    description:
      'Edita una tabla Markdown en una cuadrícula, o pega una tabla GFM existente para importarla. Añade y elimina filas/columnas, define la alineación de cada columna y obtén siempre una tabla limpia y con las barras alineadas. Funciona en tu navegador, nada se sube.',
    ogTitle: 'Editar tabla Markdown — Editor de tablas GFM, sin subir archivos',
    ogDescription:
      'Edita una tabla Markdown GFM en una cuadrícula y obtén Markdown correctamente alineado. Pega una tabla existente para importarla. Nada se sube.',
  },

  hero: {
    h1: 'Editar tabla Markdown',
    tagline:
      'Edita una tabla en una cuadrícula y las barras del Markdown se mantienen alineadas automáticamente — en tu navegador. Pega una tabla existente para partir de ella.',
  },

  intro: {
    h2: 'Edita tablas Markdown GFM sin alinear las barras a mano',
    paras: [
      'Las tablas de Markdown con sabor GitHub (GFM) son texto plano, y mantener cada `|` alineado a mano se vuelve tedioso en cuanto una celda se alarga o se añade una fila. Esta herramienta ofrece en su lugar una cuadrícula: haz clic en una celda y escribe, añade o elimina filas y columnas con un botón, y define cada columna como alineada a la izquierda, al centro o a la derecha.',
      'El Markdown de abajo se regenera siempre a partir de la cuadrícula, así que sale como una tabla limpia y alineada por ancho de columna en cada edición — nunca editas las barras a mano. Empieza desde una cuadrícula en blanco, o pega una tabla Markdown existente en el cuadro de importación para cargarla y seguir editando.',
    ],
  },

  privacy: {
    h2: 'Por qué tu tabla se queda en tu dispositivo',
    lead: 'Aquí la privacidad es estructural, no una promesa. No hay un paso de subida porque no hay un servidor al que subir nada:',
    points: [
      'Analizar, editar y regenerar la tabla ocurre enteramente en tu navegador.',
      'La página se sirve como archivos estáticos y no hace ninguna solicitud que lleve los datos de tu tabla.',
      'El código fuente es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo que solo es posible porque nada sale del dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de red de tu navegador mientras editas — ninguna solicitud lleva el contenido de tu tabla.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo usarlo',
    steps: [
      {
        h3: 'Empieza desde una cuadrícula en blanco o impórtala',
        p: 'Aparece lista una cuadrícula en blanco de 3 columnas para escribir directamente. Para partir de una tabla existente, pega Markdown GFM en el cuadro de importación y haz clic en Importar — reemplaza la cuadrícula con la tabla interpretada.',
      },
      {
        h3: 'Edita celdas',
        p: 'Haz clic en una celda y escribe. Tab, Intro y las flechas mueven entre celdas, como en una hoja de cálculo.',
      },
      {
        h3: 'Añade, elimina y alinea columnas',
        p: 'Usa los botones de fila y columna para añadirlas o eliminarlas. Cada encabezado de columna tiene un control de alineación izquierda/centro/derecha que se traduce en la fila separadora del Markdown.',
      },
      {
        h3: 'Copia o descarga el Markdown',
        p: 'La vista previa de Markdown bajo la cuadrícula es siempre una tabla limpia y con las barras alineadas. Cópiala al portapapeles o descárgala como archivo .md.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi tabla a algún sitio?',
      a: 'No. Analizar, editar y regenerar ocurre enteramente en tu navegador. No hay componente de servidor, así que tu tabla no tiene ninguna vía para salir de tu dispositivo. El código fuente es abierto y puedes comprobarlo en el panel de red de tu navegador.',
    },
    {
      q: '¿Cómo se trata un carácter `|` dentro de una celda?',
      a: 'Un `|` literal que escribas en una celda se escapa automáticamente como `\\|` al generar el Markdown, y se vuelve a convertir en `|` al importar una tabla, así que se muestra correctamente en la cuadrícula en ambos casos.',
    },
    {
      q: '¿Qué pasa si pego una tabla con una fila irregular (número de celdas incorrecto)?',
      a: 'Se trata igual que lo hace GitHub: una fila con menos celdas que el encabezado se rellena con celdas vacías, y una fila con más celdas descarta las sobrantes. Nada falla ni se corrompe en silencio.',
    },
    {
      q: '¿Puede una celda contener un salto de línea?',
      a: 'No — las celdas de una tabla GFM son de una sola línea por especificación. Si pegas texto con un salto de línea en una celda, se sustituye por un espacio en lugar de romper en silencio la estructura de la tabla.',
    },
    {
      q: '¿Esta herramienta renderiza o previsualiza otro Markdown, como títulos o enlaces?',
      a: 'No, está limitada a la edición de tablas. Si necesitas previsualizar un documento Markdown completo, existe otra herramienta dedicada para eso.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda en caché, así que la edición funciona sin conexión a internet. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con asistencia de IA; toda revisión y decisión es del mantenedor.',
    securityText: 'Seguridad',
  },

  related: {
    h2: 'Herramientas relacionadas',
    blogLinkText: 'Leer las notas técnicas',
  },
};
