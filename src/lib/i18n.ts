/**
 * The site's two languages, and every visitor-facing string in both.
 *
 * English lives at the bare paths (/, /photos); Spanish mirrors them under /es
 * (/es, /es/photos). The page files under src/app/es/ are thin wrappers that
 * render the same views with lang="es", so a view never has to be written twice.
 *
 * The Spanish is Puerto Rican, and addresses the reader as usted: the audience
 * is older and grieving, and the familiar tú would read as too casual here.
 *
 * Strings are TypeScript rather than JSON so the compiler refuses an `es` entry
 * that is missing or shaped differently from its `en` counterpart. Anything
 * that interpolates a value is a function.
 *
 * The admin pages and admin emails stay English only; they are read by the
 * family, not by visitors.
 */
import { CONTACT_EMAIL, SITE_DESCRIPTION } from "../site.config";

export type Locale = "en" | "es";

export const LOCALES: readonly Locale[] = ["en", "es"];

/** Which language a path is in. Anything not under /es is English. */
export function localeFromPath(pathname: string | null | undefined): Locale {
  if (!pathname) return "en";
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

/** The English path for any path, with the /es prefix removed. */
export function basePath(pathname: string): string {
  if (pathname === "/es") return "/";
  return pathname.startsWith("/es/") ? pathname.slice(3) : pathname;
}

/** An internal path in the given language. `path` is always the English one. */
export function localize(path: string, lang: Locale): string {
  if (lang === "en") return path;
  return path === "/" ? "/es" : `/es${path}`;
}

/**
 * Metadata `alternates` for a page that exists in both languages, so search
 * engines show each reader the version in their language. `path` is English.
 */
export function alternatesFor(path: string, lang: Locale) {
  return {
    canonical: localize(path, lang),
    languages: { en: path, es: localize(path, "es"), "x-default": path },
  };
}

/** BCP 47 tag for date formatting. */
export const DATE_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-PR" };

const C = CONTACT_EMAIL;

const en = {
  langName: "English",
  skip: "Skip to content",
  nav: {
    label: "Main",
    photos: "Photographs",
    art: "Art",
    guestbook: "Guestbook",
    legacy: "Her Legacy",
    subscribe: "Stay in touch",
    language: "Language",
  },
  footer: { howTo: "How to make a site like this" },
  titles: {
    photos: "Photographs",
    addPhotos: "Add Photographs",
    art: "Art",
    guestbook: "Guestbook",
    addMessage: "Add a message",
    legacy: "Carrying on Sandra’s legacy",
    subscribe: "Stay in touch",
    notFound: "Page not found",
  },
  home: {
    dates: "October 7, 1952 – September 22, 2026",
    portraitAlt:
      "Sandra Aponte Santiago smiling, in a magenta blouse, holding a bright arrangement of orchids, roses, and daisies against a pale blue wall.",
  },
  description: SITE_DESCRIPTION,
  common: {
    optional: "(optional)",
    optionalNeverShown: "(optional, never shown)",
    yourName: "Your name",
    yourEmail: "Your email",
    sending: "Sending…",
    loadFailedRetry: "Please try again shortly.",
  },
  notFound: {
    heading: "That page isn’t here",
    body: "The address may have been mistyped, or the page may not exist. Everything on the site is below.",
    obituary: "Sandra’s obituary",
    stuck: "Still stuck? Write to",
  },
  photos: {
    addMore: "Add More Photographs",
    reloadNote: "Note: If some of the pictures are not loading, please hit your browser reload button.",
    artLivesUnder: "Pictures of her paintings and other things she made are under",
    loadFailed: "The gallery can’t be loaded just now. Please try again shortly.",
    emptyLead: "The gallery is still being put together.",
    emptyHaveSome: "If you have photographs of Sandra,",
    emptySendThem: "please send them",
    emptyAppear: "— they’ll appear here.",
    emptySoon: "If you have photographs of Sandra, there will be a way to add them shortly.",
  },
  art: {
    intro: "Some of Sandra’s creations",
    send: "Send Something She Made",
    notOnlyPhotos: "Not only photographs — recordings, scans, letters, and documents are welcome too.",
    loadFailed: "This page can’t be loaded just now. Please try again shortly.",
    emptyLead: "Nothing here yet.",
    emptyHave: "If you have something she made,",
    emptySend: "please send a picture of it",
    emptyAppear: "— it’ll appear here.",
    emptySoon: "There will be a way to add things here shortly.",
  },
  addPhotos: {
    headingArt: "Add to art",
    headingPhotos: "Add photographs",
    back: "← Back to the gallery",
    closedHeading: "Send your photographs",
    closedBody: "Photo submissions aren’t open quite yet. If you have pictures of Sandra, please start looking them out — or send them now to",
  },
  photoForm: {
    headingArt: "Send something she made",
    headingPhotos: "Send your photographs",
    introLead: "Anything at all — family, friends, celebrations, ordinary days. Pictures of her paintings and other things she made go to",
    introArtLink: "art",
    introTail: "; mark each one below. They’ll appear once someone has looked at them.",
    chooseFiles: "Choose files",
    limits: (maxPhotos: number, maxOther: number) =>
      `Up to ${maxPhotos} photographs at a time, 10 MB each — straight off a phone is fine. Other kinds of file are welcome too: recordings, scans, letters, documents, up to ${maxOther} at a time and 100 MB each. Those go into the family archive rather than onto the site.`,
    noPreview: "no preview",
    remove: "Remove",
    whatIsThis: "What is this?",
    kindPhoto: "Photograph of Sandra",
    kindArt: "A painting or something she made",
    notAPicture: "Not a picture — this goes into the family archive rather than a gallery.",
    caption: "Caption",
    whatIsIt: "What is it?",
    captionPlaceholder: "Who, where, when — whatever you remember",
    filePlaceholder: "What it is, and anything we’d need to know to make sense of it",
    yearTaken: "Year taken",
    yearPlaceholder: "e.g. 1978",
    yearFromFile: "from the file — please correct it if the photograph is older than that",
    tsLoading: "Loading the verification check…",
    tsSlow: `Authenticating the form is taking longer than expected. Try reloading the page — if the verification check still doesn’t appear, an ad blocker or privacy extension may be blocking it, or you can email the photos to ${C} instead.`,
    waiting: "Waiting for the verification check… this takes a moment.",
    progress: (done: number, total: number) => `Sending ${done} of ${total}…`,
    verifyingButton: "Verifying…",
    sendN: (n: number) => `Send ${n} files`,
    send: "Send",
    thanks: (n: number) => (n === 1 ? "Thank you — it has been sent." : `Thank you — all ${n} have been sent.`),
    appearOnceSeen: "The pictures will appear in the gallery once someone has had a look at them.",
    archivedFiles: (n: number) =>
      n === 1
        ? "The other file is kept in the family archive rather than shown on the site. Someone will look at it and work out the right way to share it."
        : `The other ${n} files are kept in the family archive rather than shown on the site. Someone will look at them and work out the right way to share them.`,
    sendMore: "Send more",
    viewPhotos: "View the photographs",
    viewArt: "View art",
    errTooBigImage: (name: string, mb: string) =>
      `"${name}" is ${mb} MB, and our image service can’t take anything over 10 MB. Please email that one to ${C} — we’d still very much like to have it, and we’ll resize it at this end.`,
    errTooBigFile: (name: string) => `"${name}" is larger than 100 MB. Please email that one to ${C} instead.`,
    errTooManyPhotos: (n: number) => `Please send up to ${n} photos at a time. You can come back and add more.`,
    errTooManyFiles: (n: number) => `Please send up to ${n} files other than photographs at a time.`,
    errChooseOne: "Please choose at least one file.",
    errTsBlocked: `We couldn’t load the security check — this usually means an ad blocker or privacy extension is active. Try switching it off for this site and reloading, or email the photos to ${C} instead.`,
    errTsStillLoading: "The security check is still loading. Give it a few seconds and press Send again — your photos and captions are still here.",
    errTsBroken: `The security check didn’t load properly. Please reload this page and choose the photographs again — sorry, that does mean picking them a second time. If it happens again, email them to ${C} and we’ll add them for you.`,
    errNoneSent: (failures: string) =>
      `Those files couldn’t be sent${failures ? ` — ${failures}` : ""}. Please try again, or email them to ${C}.`,
    connection: "connection",
    errGeneric: "Something went wrong.",
    errAtStage: {
      verify: "while checking the verification box",
      tickets: "while getting ready to upload",
      upload: "while sending the photos",
      record: "while saving the photos — they may have uploaded already",
    },
    errStage: (where: string) => `Something went wrong ${where}. Please try again, or email them to ${C}.`,
  },
  photoActions: {
    unavailable: "Photo uploads aren’t available just now. Please try again later.",
    filesUnavailable: `Sending files other than photographs isn’t available just now. Please email it to ${C}.`,
    photoCount: (max: number) => `Please choose between 1 and ${max} photos at a time.`,
    fileCount: (max: number) => `Please send up to ${max} other files at a time.`,
    nothing: "Nothing to send.",
    tooLarge: (name: string) => `"${name}" is too large to send through the form. Please email it to ${C}.`,
    rateLimited: `That’s a lot of photos in a short time. Please come back in a little while, or write to ${C}.`,
    startFailed: "Something went wrong starting the upload. Please try again.",
    noFiles: "No files to save.",
    tooManyFiles: "Too many files in one submission.",
    filesNotSaved: "Those files couldn’t be saved. Please try again.",
    noPhotos: "No photos to save.",
    tooManyPhotos: "Too many photos in one submission.",
    photosNotSaved: "Those photos couldn’t be saved. Please try again.",
  },
  gallery: {
    enlarge: "Enlarge photograph",
    enlargeCaption: (caption: string) => `Enlarge: ${caption}`,
    enlargeStack: (caption: string | null, n: number) => `Enlarge: ${caption ?? "photograph"} (${n} images)`,
    defaultAlt: "A photograph of Sandra Aponte Santiago",
    stackHint: (n: number) => `click to see all ${n} items`,
    prevInSet: "← Previous in this set",
    nextInSet: "Next in this set →",
    imageOf: (i: number, n: number) => `Image ${i} of ${n}`,
    prev: "← Previous",
    next: "Next →",
    countOf: (i: number, n: number) => `${i} of ${n}`,
    close: "Close",
  },
  guestbook: {
    leave: "Leave a message",
    loadFailed: "The messages can’t be loaded just now. Please try again shortly — nothing has been lost.",
    emptyFirst: "No messages yet. If you knew Sandra, yours would be the first.",
    emptyMore: "There are no more messages.",
    from: (name: string) => `From ${name}`,
    pagerLabel: "More messages",
    newer: "← Newer",
    older: "Older →",
    showing: (from: number, to: number) => `Showing messages ${from}–${to}.`,
    back: "← Back to the guestbook",
    formIntro: "Once you submit, your message will appear on this page straight away, for her family and everyone else who knew her to read.",
    legacyNote: "If you’ve supported one of the causes Sandra cared about, please mention it in your message — it may inspire others to do the same.",
    legacyLink: "See her legacy causes.",
    yourMessage: "Your message",
    adding: "Adding…",
    add: "Add your message",
    okNote: "Your message is on the page now. Reload to see it among the others.",
    view: "View the guestbook",
  },
  guestbookActions: {
    thanks: "Thank you for writing.",
    needName: "Please add your name.",
    needMessage: "Please write a message.",
    nameTooLong: "That name is longer than we can store.",
    messageTooLong: (max: string) => `That’s longer than we can store — ${max} characters is the limit.`,
    emailTooLong: "That email address is too long.",
    rateLimited: `That’s several messages in a short time. Please wait a little while, or write to ${C}.`,
    saveFailed: `Something went wrong saving that. Please try again, or write to ${C}.`,
  },
  subscribe: {
    intro: "Leave your address and Sandra’s family will write if there is news to share about her memorial.",
    handful: "Rest assured, you are signing up for only a handful of messages. You can reply to any of them to ask to be taken off the list.",
    writeInstead: "Would you rather just write to someone?",
    yourEmailAddress: "Your email address",
    numberAttending: "Number attending",
    anythingToKnow: "Anything we should know?",
    howKnew: "How did you know Sandra?",
    rsvpPlaceholder: "Whether you need a chair near the front — anything useful",
    onList: "You are on the list!",
    seeYou: "We’ll see you there",
    rsvpButton: "Yes, I’ll be there",
    send: "Send it",
  },
  subscribeActions: {
    thanks: "Thank you — we’ll be in touch when there’s news.",
    thanksRsvp: "Thank you — we have you down as coming, and we’ll write when there’s anything else to say.",
    needEmail: "Please enter an email address.",
    badEmail: "That doesn’t look like an email address — please check it.",
    tooLong: "That’s longer than we can store. Please shorten it.",
    partySize: (max: number) => `Number attending should be between 1 and ${max}.`,
    saveFailed: `Something went wrong saving that. Please try again, or write to ${C}.`,
  },
  turnstile: {
    unavailable: "This form is temporarily unavailable. Please try again later.",
    missing: "Please complete the verification below and try again.",
    rejected: "Verification failed. Please reload the page and try again.",
    unreachable: "Could not verify your submission just now. Please try again.",
  },
};

export type Dictionary = typeof en;

const es: Dictionary = {
  langName: "Español",
  skip: "Ir al contenido",
  nav: {
    label: "Principal",
    photos: "Fotos",
    art: "Arte",
    guestbook: "Libro de visitas",
    legacy: "Su legado",
    subscribe: "Manténgase en contacto",
    language: "Idioma",
  },
  footer: { howTo: "Cómo hacer un sitio como este (en inglés)" },
  titles: {
    photos: "Fotos",
    addPhotos: "Añadir fotos",
    art: "Arte",
    guestbook: "Libro de visitas",
    addMessage: "Dejar un mensaje",
    legacy: "Continuar el legado de Sandra",
    subscribe: "Manténgase en contacto",
    notFound: "Página no encontrada",
  },
  home: {
    dates: "7 de octubre de 1952 – 22 de septiembre de 2026",
    portraitAlt:
      "Sandra Aponte Santiago sonriendo, con una blusa magenta, sosteniendo un colorido arreglo de orquídeas, rosas y margaritas frente a una pared azul claro.",
  },
  description:
    "En memoria de Sandra Aponte Santiago, 1952–2026. Educadora, consejera, viajera, y una madre, abuela y hermana amorosa.",
  common: {
    optional: "(opcional)",
    optionalNeverShown: "(opcional, nunca se muestra)",
    yourName: "Su nombre",
    yourEmail: "Su correo electrónico",
    sending: "Enviando…",
    loadFailedRetry: "Por favor, intente de nuevo en un rato.",
  },
  notFound: {
    heading: "Esa página no está aquí",
    body: "Puede que la dirección se haya escrito mal, o que la página no exista. Todo lo que hay en el sitio está aquí abajo.",
    obituary: "El obituario de Sandra",
    stuck: "¿Todavía no encuentra lo que busca? Escriba a",
  },
  photos: {
    addMore: "Añadir más fotos",
    reloadNote: "Nota: Si algunas fotos no cargan, por favor oprima el botón de recargar de su navegador.",
    artLivesUnder: "Las fotos de sus pinturas y otras cosas que ella hizo están en",
    loadFailed: "La galería no se puede cargar en este momento. Por favor, intente de nuevo en un rato.",
    emptyLead: "Todavía estamos preparando la galería.",
    emptyHaveSome: "Si tiene fotos de Sandra,",
    emptySendThem: "por favor envíelas",
    emptyAppear: "— aparecerán aquí.",
    emptySoon: "Si tiene fotos de Sandra, pronto habrá una manera de añadirlas.",
  },
  art: {
    intro: "Algunas de las creaciones de Sandra",
    send: "Enviar algo que ella hizo",
    notOnlyPhotos: "No solo fotos — también son bienvenidas grabaciones, documentos escaneados, cartas y otros documentos.",
    loadFailed: "Esta página no se puede cargar en este momento. Por favor, intente de nuevo en un rato.",
    emptyLead: "Todavía no hay nada aquí.",
    emptyHave: "Si tiene algo que ella hizo,",
    emptySend: "por favor envíe una foto",
    emptyAppear: "— aparecerá aquí.",
    emptySoon: "Pronto habrá una manera de añadir cosas aquí.",
  },
  addPhotos: {
    headingArt: "Añadir al arte",
    headingPhotos: "Añadir fotos",
    back: "← Volver a la galería",
    closedHeading: "Envíe sus fotos",
    closedBody: "Todavía no se pueden enviar fotos. Si tiene fotos de Sandra, por favor vaya buscándolas — o envíelas ahora a",
  },
  photoForm: {
    headingArt: "Enviar algo que ella hizo",
    headingPhotos: "Envíe sus fotos",
    introLead: "Lo que sea — familia, amistades, celebraciones, días cualquiera. Las fotos de sus pinturas y otras cosas que ella hizo van a",
    introArtLink: "arte",
    introTail: "; marque cada una abajo. Aparecerán cuando alguien las haya revisado.",
    chooseFiles: "Escoger archivos",
    limits: (maxPhotos: number, maxOther: number) =>
      `Hasta ${maxPhotos} fotos a la vez, de 10 MB cada una — directamente del celular está bien. También son bienvenidos otros tipos de archivo: grabaciones, documentos escaneados, cartas, hasta ${maxOther} a la vez y de 100 MB cada uno. Esos se guardan en el archivo de la familia y no se publican en el sitio.`,
    noPreview: "sin vista previa",
    remove: "Quitar",
    whatIsThis: "¿Qué es esto?",
    kindPhoto: "Foto de Sandra",
    kindArt: "Una pintura u otra cosa que ella hizo",
    notAPicture: "No es una imagen — esto se guarda en el archivo de la familia y no en una galería.",
    caption: "Descripción",
    whatIsIt: "¿Qué es?",
    captionPlaceholder: "Quién, dónde, cuándo — lo que recuerde",
    filePlaceholder: "Qué es, y cualquier cosa que debamos saber para entenderlo",
    yearTaken: "Año en que se tomó",
    yearPlaceholder: "p. ej. 1978",
    yearFromFile: "según el archivo — por favor corríjalo si la foto es más antigua",
    tsLoading: "Cargando la verificación…",
    tsSlow: `La verificación del formulario está tardando más de lo normal. Intente recargar la página — si la verificación sigue sin aparecer, puede que un bloqueador de anuncios o una extensión de privacidad la esté bloqueando. También puede enviar las fotos por correo electrónico a ${C}.`,
    waiting: "Esperando la verificación… esto toma un momento.",
    progress: (done: number, total: number) => `Enviando ${done} de ${total}…`,
    verifyingButton: "Verificando…",
    sendN: (n: number) => `Enviar ${n} archivos`,
    send: "Enviar",
    thanks: (n: number) => (n === 1 ? "Gracias — ya se envió." : `Gracias — se enviaron los ${n}.`),
    appearOnceSeen: "Las fotos aparecerán en la galería cuando alguien las haya revisado.",
    archivedFiles: (n: number) =>
      n === 1
        ? "El otro archivo se guarda en el archivo de la familia y no se muestra en el sitio. Alguien lo revisará y verá cuál es la mejor manera de compartirlo."
        : `Los otros ${n} archivos se guardan en el archivo de la familia y no se muestran en el sitio. Alguien los revisará y verá cuál es la mejor manera de compartirlos.`,
    sendMore: "Enviar más",
    viewPhotos: "Ver las fotos",
    viewArt: "Ver el arte",
    errTooBigImage: (name: string, mb: string) =>
      `"${name}" pesa ${mb} MB, y nuestro servicio de imágenes no acepta nada de más de 10 MB. Por favor envíela por correo electrónico a ${C} — de verdad nos gustaría tenerla, y nosotros la reduciremos.`,
    errTooBigFile: (name: string) => `"${name}" pesa más de 100 MB. Por favor envíelo por correo electrónico a ${C}.`,
    errTooManyPhotos: (n: number) => `Por favor envíe hasta ${n} fotos a la vez. Puede regresar y añadir más.`,
    errTooManyFiles: (n: number) => `Por favor envíe hasta ${n} archivos que no sean fotos a la vez.`,
    errChooseOne: "Por favor escoja por lo menos un archivo.",
    errTsBlocked: `No pudimos cargar la verificación de seguridad — esto suele significar que hay un bloqueador de anuncios o una extensión de privacidad activa. Intente desactivarla para este sitio y recargar la página, o envíe las fotos por correo electrónico a ${C}.`,
    errTsStillLoading: "La verificación de seguridad todavía está cargando. Espere unos segundos y oprima Enviar otra vez — sus fotos y descripciones siguen aquí.",
    errTsBroken: `La verificación de seguridad no cargó bien. Por favor recargue la página y escoja las fotos otra vez — disculpe, eso significa escogerlas de nuevo. Si vuelve a pasar, envíelas por correo electrónico a ${C} y nosotros las añadimos.`,
    errNoneSent: (failures: string) =>
      `No se pudieron enviar esos archivos${failures ? ` — ${failures}` : ""}. Por favor intente de nuevo, o envíelos por correo electrónico a ${C}.`,
    connection: "conexión",
    errGeneric: "Algo salió mal.",
    errAtStage: {
      verify: "al revisar la verificación",
      tickets: "al prepararse para subir los archivos",
      upload: "al enviar las fotos",
      record: "al guardar las fotos — puede que ya se hayan subido",
    },
    errStage: (where: string) => `Algo salió mal ${where}. Por favor intente de nuevo, o envíelas por correo electrónico a ${C}.`,
  },
  photoActions: {
    unavailable: "En este momento no se pueden subir fotos. Por favor intente más tarde.",
    filesUnavailable: `En este momento no se pueden enviar archivos que no sean fotos. Por favor envíelo por correo electrónico a ${C}.`,
    photoCount: (max: number) => `Por favor escoja entre 1 y ${max} fotos a la vez.`,
    fileCount: (max: number) => `Por favor envíe hasta ${max} archivos adicionales a la vez.`,
    nothing: "No hay nada que enviar.",
    tooLarge: (name: string) => `"${name}" es demasiado grande para enviarlo por el formulario. Por favor envíelo por correo electrónico a ${C}.`,
    rateLimited: `Son muchas fotos en poco tiempo. Por favor regrese en un rato, o escriba a ${C}.`,
    startFailed: "Algo salió mal al empezar a subir los archivos. Por favor intente de nuevo.",
    noFiles: "No hay archivos que guardar.",
    tooManyFiles: "Demasiados archivos en un solo envío.",
    filesNotSaved: "No se pudieron guardar esos archivos. Por favor intente de nuevo.",
    noPhotos: "No hay fotos que guardar.",
    tooManyPhotos: "Demasiadas fotos en un solo envío.",
    photosNotSaved: "No se pudieron guardar esas fotos. Por favor intente de nuevo.",
  },
  gallery: {
    enlarge: "Ampliar foto",
    enlargeCaption: (caption: string) => `Ampliar: ${caption}`,
    enlargeStack: (caption: string | null, n: number) => `Ampliar: ${caption ?? "foto"} (${n} imágenes)`,
    defaultAlt: "Una foto de Sandra Aponte Santiago",
    stackHint: (n: number) => `oprima para ver las ${n}`,
    prevInSet: "← Anterior en este grupo",
    nextInSet: "Siguiente en este grupo →",
    imageOf: (i: number, n: number) => `Imagen ${i} de ${n}`,
    prev: "← Anterior",
    next: "Siguiente →",
    countOf: (i: number, n: number) => `${i} de ${n}`,
    close: "Cerrar",
  },
  guestbook: {
    leave: "Dejar un mensaje",
    loadFailed: "Los mensajes no se pueden cargar en este momento. Por favor intente de nuevo en un rato — no se ha perdido nada.",
    emptyFirst: "Todavía no hay mensajes. Si usted conoció a Sandra, el suyo sería el primero.",
    emptyMore: "No hay más mensajes.",
    from: (name: string) => `De ${name}`,
    pagerLabel: "Más mensajes",
    newer: "← Más recientes",
    older: "Más antiguos →",
    showing: (from: number, to: number) => `Mostrando los mensajes ${from}–${to}.`,
    back: "← Volver al libro de visitas",
    formIntro: "En cuanto lo envíe, su mensaje aparecerá en esta página para que lo lean su familia y todos los que la conocieron.",
    legacyNote: "Si apoyó alguna de las causas que Sandra llevaba en el corazón, por favor menciónelo en su mensaje — puede inspirar a otros a hacer lo mismo.",
    legacyLink: "Vea las causas de su legado.",
    yourMessage: "Su mensaje",
    adding: "Añadiendo…",
    add: "Añadir su mensaje",
    okNote: "Su mensaje ya está en la página. Recargue para verlo junto a los demás.",
    view: "Ver el libro de visitas",
  },
  guestbookActions: {
    thanks: "Gracias por escribir.",
    needName: "Por favor añada su nombre.",
    needMessage: "Por favor escriba un mensaje.",
    nameTooLong: "Ese nombre es más largo de lo que podemos guardar.",
    messageTooLong: (max: string) => `Es más largo de lo que podemos guardar — el límite es de ${max} caracteres.`,
    emailTooLong: "Esa dirección de correo electrónico es demasiado larga.",
    rateLimited: `Son varios mensajes en poco tiempo. Por favor espere un rato, o escriba a ${C}.`,
    saveFailed: `Algo salió mal al guardarlo. Por favor intente de nuevo, o escriba a ${C}.`,
  },
  subscribe: {
    intro: "Deje su dirección de correo electrónico y la familia de Sandra le escribirá si hay noticias sobre su memorial.",
    handful: "Puede estar tranquilo: solo recibirá unos pocos mensajes. Puede responder a cualquiera de ellos para pedir que lo saquen de la lista.",
    writeInstead: "¿Prefiere escribirle directamente a alguien?",
    yourEmailAddress: "Su correo electrónico",
    numberAttending: "Número de personas",
    anythingToKnow: "¿Algo que debamos saber?",
    howKnew: "¿Cómo conoció a Sandra?",
    rsvpPlaceholder: "Si necesita una silla cerca del frente — cualquier cosa útil",
    onList: "¡Ya está en la lista!",
    seeYou: "Nos vemos allí",
    rsvpButton: "Sí, allí estaré",
    send: "Enviar",
  },
  subscribeActions: {
    thanks: "Gracias — le escribiremos cuando haya noticias.",
    thanksRsvp: "Gracias — lo tenemos anotado, y le escribiremos si hay algo más que decir.",
    needEmail: "Por favor escriba una dirección de correo electrónico.",
    badEmail: "Eso no parece una dirección de correo electrónico — por favor revísela.",
    tooLong: "Es más largo de lo que podemos guardar. Por favor acórtelo.",
    partySize: (max: number) => `El número de personas debe ser entre 1 y ${max}.`,
    saveFailed: `Algo salió mal al guardarlo. Por favor intente de nuevo, o escriba a ${C}.`,
  },
  turnstile: {
    unavailable: "Este formulario no está disponible por el momento. Por favor intente más tarde.",
    missing: "Por favor complete la verificación de abajo e intente de nuevo.",
    rejected: "La verificación falló. Por favor recargue la página e intente de nuevo.",
    unreachable: "No pudimos verificar su envío en este momento. Por favor intente de nuevo.",
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { en, es };

export function dict(lang: Locale): Dictionary {
  return DICTIONARIES[lang];
}

/** Read a `lang` value posted by a form, defaulting to English. */
export function parseLocale(v: unknown): Locale {
  return v === "es" ? "es" : "en";
}
