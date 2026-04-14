import React from 'react'

// Utility: wraps SVG with consistent styling
const I = (d: string, stroke = 'currentColor') => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const I2 = (children: React.ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

// ETEN & DRINKEN
export const IconOntbijt = () => I2(<><path d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7"/><path d="M8 3v4M12 3v4M16 3v4"/></>)
export const IconLunch = () => I2(<><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/><path d="M9 4l1 2M15 4l-1 2"/></>)
export const IconAvondeten = () => I2(<><ellipse cx="12" cy="14" rx="9" ry="6"/><path d="M12 3v3M8 4l1 3M16 4l-1 3"/></>)
export const IconSnack = () => I2(<><path d="M8 6c0-2 1.5-3 4-3s4 1 4 3"/><rect x="6" y="6" width="12" height="14" rx="3"/><path d="M10 11h4"/></>)
export const IconWater = () => I2(<><path d="M12 3c-4 5-6 8-6 11a6 6 0 0012 0c0-3-2-6-6-11z"/></>)
export const IconKoffie = () => I2(<><path d="M17 8h1a3 3 0 010 6h-1"/><rect x="5" y="8" width="12" height="10" rx="2"/><path d="M6 18h12M8 3v3M12 3v3M16 3v3"/></>)
export const IconThee = () => I2(<><path d="M17 8h2a2 2 0 010 4h-2"/><rect x="4" y="8" width="13" height="9" rx="2"/><path d="M7 17h9M9 3c0 1 1 2 0 3M13 3c0 1 1 2 0 3"/></>)

// VERZORGING
export const IconDouchen = () => I2(<><path d="M4 4h2v10a4 4 0 008 0V4h-2"/><path d="M8 20v1M12 20v1M10 20v2"/><circle cx="14" cy="4" r="2"/></>)
export const IconTandenPoetsen = () => I2(<><rect x="9" y="2" width="6" height="8" rx="3"/><path d="M11 10h2v10h-2z"/><path d="M10 22h4"/></>)
export const IconHuidverzorging = () => I2(<><circle cx="12" cy="8" r="5"/><path d="M12 13v4"/><circle cx="12" cy="19" r="2"/></>)
export const IconMedicatie = () => I2(<><rect x="7" y="3" width="10" height="7" rx="2"/><path d="M7 10h10v8a3 3 0 01-3 3h-4a3 3 0 01-3-3v-8z"/><path d="M7 14h10"/></>)
export const IconSupplement = () => I2(<><ellipse cx="12" cy="12" rx="5" ry="8"/><path d="M7 12h10"/></>)

// RUST
export const IconRustmoment = () => I2(<><path d="M12 3a9 9 0 100 18 9 9 0 000-18z"/><path d="M12 7v5l3 2"/></>)
export const IconSlapen = () => I2(<><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></>)
export const IconLezen = () => I2(<><path d="M2 4h6a4 4 0 014 4v12a3 3 0 00-3-3H2z"/><path d="M22 4h-6a4 4 0 00-4 4v12a3 3 0 013-3h7z"/></>)
export const IconPauze = () => I2(<><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></>)

// BEWEGING
export const IconWandelen = () => I2(<><circle cx="13" cy="4" r="2"/><path d="M10 22l1-8-3-2v-5l4-1 4 3-2 4"/><path d="M17 22l-3-8"/></>)
export const IconSporten = () => I2(<><circle cx="12" cy="5" r="2"/><path d="M5 12h14M7 12l-2 7M17 12l2 7"/><path d="M9 12V8l3-1 3 1v4"/></>)
export const IconYoga = () => I2(<><circle cx="12" cy="5" r="2"/><path d="M4 17l4-5 4 2 4-2 4 5"/><path d="M12 9v5"/></>)
export const IconStretchen = () => I2(<><circle cx="12" cy="4" r="2"/><path d="M12 6v6M8 10l4 2 4-2M10 18l2-4 2 4"/></>)
export const IconFietsen = () => I2(<><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M7 17l3-7h4l3 7M13 10l-1-4h-2"/></>)
export const IconZwemmen = () => I2(<><path d="M2 16c1-1 2-2 4-2s3 2 4 2 2-1 4-2c2 0 3 2 4 2s2-1 4-2"/><circle cx="12" cy="8" r="3"/><path d="M9 11l3 3 3-3"/></>)

// WERK
export const IconWerken = () => I2(<><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M12 12v3"/></>)
export const IconFocusblok = () => I2(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>)
export const IconComputer = () => I2(<><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10M9 16v4M15 16v4"/></>)
export const IconEmail = () => I2(<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 5l9 7 9-7"/></>)
export const IconTelefoon = () => I2(<><rect x="7" y="2" width="10" height="20" rx="3"/><path d="M10 18h4"/></>)
export const IconVergadering = () => I2(<><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 18c0-3 2-5 5-5s5 2 5 5"/><path d="M13 18c0-3 2-5 5-5s5 2 5 5"/></>)
export const IconNotities = () => I2(<><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h3"/></>)

// SOCIAAL
export const IconSociaalContact = () => I2(<><circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 3-7 6-7s6 3 6 7"/><path d="M16 11a3 3 0 100-6"/><path d="M21 20c0-3-2-5.5-5-6.5"/></>)
export const IconBellen = () => I2(<><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.67 2.36a2 2 0 01-.45 2.11L8.09 9.43a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.76.31 1.55.54 2.36.67A2 2 0 0122 16.92z"/></>)

// THERAPIE
export const IconTherapie = () => I2(<><path d="M20 8a2 2 0 00-2-2H6a2 2 0 00-2 2v8l4-3h10a2 2 0 002-2V8z"/><path d="M12 8v3M12 14v0"/></>)
export const IconMeditatie = () => I2(<><circle cx="12" cy="6" r="3"/><path d="M6 21c0-4 3-8 6-8s6 4 6 8"/><path d="M8 14l-3 2M16 14l3 2"/></>)

// ADEMHALING
export const IconAdemhaling = () => I2(<><path d="M12 4c-2 3-5 5-5 9a5 5 0 0010 0c0-4-3-6-5-9z"/><path d="M12 13v4"/></>)

// HUISHOUDEN
export const IconKoken = () => I2(<><path d="M12 2v4M8 4l1 3M16 4l-1 3"/><ellipse cx="12" cy="14" rx="8" ry="5"/><path d="M4 14v3a8 5 0 0016 0v-3"/></>)
export const IconOpruimen = () => I2(<><rect x="4" y="8" width="16" height="13" rx="2"/><path d="M8 8V5a1 1 0 011-1h6a1 1 0 011 1v3"/><path d="M10 12v5M14 12v5"/></>)
export const IconAfwassen = () => I2(<><circle cx="12" cy="14" r="6"/><path d="M12 2v6M9 4l3 4 3-4"/><path d="M9 14h6"/></>)
export const IconWasDoen = () => I2(<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/></>)
export const IconStofzuigen = () => I2(<><rect x="8" y="3" width="8" height="5" rx="2"/><path d="M12 8v8"/><ellipse cx="12" cy="18" rx="5" ry="3"/></>)
export const IconBoodschappen = () => I2(<><path d="M6 2l-2 6h16l-2-6"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M10 12v4M14 12v4"/></>)

// VERPLAATSING
export const IconVertrekken = () => I2(<><path d="M5 12h14M13 6l6 6-6 6"/></>)
export const IconThuiskomen = () => I2(<><path d="M3 12l9-9 9 9"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></>)

// ADMINISTRATIE
export const IconAdministratie = () => I2(<><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></>)

// ZELFZORG
export const IconZelfzorg = () => I2(<><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></>)
export const IconDagboek = () => I2(<><path d="M4 4h4v16H4z"/><path d="M8 4h12v16H8"/><path d="M12 8h4M12 12h4M12 16h2"/></>)
export const IconDankbaarheid = () => I2(<><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></>)

// CREATIEF
export const IconCreatief = () => I2(<><path d="M12 2a7 7 0 017 7c0 3-2 5-4 7l-3 4-3-4c-2-2-4-4-4-7a7 7 0 017-7z"/><circle cx="12" cy="9" r="2"/></>)
export const IconMuziek = () => I2(<><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>)
export const IconTekenen = () => I2(<><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></>)

// AFSPRAKEN
export const IconAfspraak = () => I2(<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M10 14l2 2 4-4"/></>)
export const IconHuisarts = () => I2(<><path d="M12 2C8 2 4 5 4 10c0 6 8 12 8 12s8-6 8-12c0-5-4-8-8-8z"/><path d="M10 10h4M12 8v4"/></>)

// EXTRA
export const IconVoeding = () => I2(<><path d="M7 3c0 3 3 6 5 8 2-2 5-5 5-8a5 5 0 00-10 0z"/><path d="M12 11v10"/></>)
export const IconPlanning = () => I2(<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></>)
export const IconFeest = () => I2(<><path d="M5.8 11.3L2 22l10.7-3.8"/><path d="M4 3l9.2 9.2"/><path d="M13.4 3a1 1 0 01.7.3l6.6 6.6a1 1 0 01-.7 1.7H8.4a1 1 0 01-.7-1.7L14.3 3.3a1 1 0 01.7-.3z"/></>)
export const IconTuinieren = () => I2(<><path d="M12 10c-4 0-7 3-7 7h14c0-4-3-7-7-7z"/><path d="M12 3v7"/><path d="M8 5c2 1 4 1 4 1s2 0 4-1"/></>)
export const IconHuisdier = () => I2(<><circle cx="11" cy="8" r="4"/><path d="M11 12v5"/><path d="M7 17c0 2 2 4 4 4s4-2 4-4"/><circle cx="5" cy="5" r="1.5"/><circle cx="17" cy="5" r="1.5"/></>)
export const IconUitrusten = () => I2(<><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></>)
export const IconGesprek = () => I2(<><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5A8.48 8.48 0 0121 11.5z"/></>)
export const IconStudie = () => I2(<><path d="M2 7l10-4 10 4-10 4z"/><path d="M6 9v6c0 2 3 3 6 3s6-1 6-3V9"/></>)
export const IconWinkelen = () => I2(<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></>)
export const IconReizen = () => I2(<><path d="M17.8 19.2L16 11l-2-5h4l-2 5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>)
export const IconNatuur = () => I2(<><path d="M12 2l-3 7h6l-3-7z"/><path d="M12 9l-4 8h8l-4-8z"/><path d="M11 17h2v5h-2z"/></>)
export const IconPodcast = () => I2(<><path d="M12 1a4 4 0 014 4v7a4 4 0 01-8 0V5a4 4 0 014-4z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><path d="M12 19v4M8 23h8"/></>)

// Icon map for programmatic access
export const iconMap: Record<string, React.FC> = {
  ontbijt: IconOntbijt,
  lunch: IconLunch,
  avondeten: IconAvondeten,
  snack: IconSnack,
  water: IconWater,
  koffie: IconKoffie,
  thee: IconThee,
  'eten-voorbereiden': IconKoken,
  douchen: IconDouchen,
  tandenpoetsen: IconTandenPoetsen,
  'tanden-poetsen': IconTandenPoetsen,
  huidverzorging: IconHuidverzorging,
  medicatie: IconMedicatie,
  supplement: IconSupplement,
  creatine: IconSupplement,
  'medicijn-ophalen': IconMedicatie,
  'kleding-klaarleggen': IconOpruimen,
  rustmoment: IconRustmoment,
  slapen: IconSlapen,
  'slaap-voorbereiding': IconSlapen,
  lezen: IconLezen,
  pauze: IconPauze,
  dutje: IconSlapen,
  uitrusten: IconUitrusten,
  ontspanning: IconUitrusten,
  game: IconFocusblok,
  muziek: IconMuziek,
  wandelen: IconWandelen,
  sporten: IconSporten,
  yoga: IconYoga,
  stretchen: IconStretchen,
  fietsen: IconFietsen,
  'fietsen-buiten': IconFietsen,
  zwemmen: IconZwemmen,
  'hond-uitlaten': IconHuisdier,
  werken: IconWerken,
  laptopwerk: IconComputer,
  email: IconEmail,
  mailen: IconEmail,
  telefoon: IconTelefoon,
  vergadering: IconVergadering,
  meeting: IconVergadering,
  'notities-maken': IconNotities,
  notities: IconNotities,
  'bureau-opruimen': IconOpruimen,
  bellen: IconBellen,
  focusblok: IconFocusblok,
  studie: IconStudie,
  schermpauze: IconPauze,
  'waterfles-vullen': IconWater,
  'ademhaling-oef': IconAdemhaling,
  meditatie: IconMeditatie,
  'sociaal-contact': IconSociaalContact,
  gesprek: IconGesprek,
  winkelen: IconWinkelen,
  feest: IconFeest,
  therapie: IconTherapie,
  psycholoog: IconTherapie,
  'ademhaling-therapie': IconAdemhaling,
  ademhaling: IconAdemhaling,
  dankbaarheid: IconDankbaarheid,
  'dagboek-zelfzorg': IconDagboek,
  dagboek: IconDagboek,
  zelfzorg: IconZelfzorg,
  avondroutine: IconSlapen,
  ochtendroutine: IconRustmoment,
  buitenlucht: IconNatuur,
  'telefoon-opladen': IconTelefoon,
  opladen: IconTelefoon,
  koken: IconKoken,
  opruimen: IconOpruimen,
  afwassen: IconAfwassen,
  'was-doen': IconWasDoen,
  'was-ophangen': IconWasDoen,
  'was-vouwen': IconWasDoen,
  stofzuigen: IconStofzuigen,
  schoonmaken: IconStofzuigen,
  boodschappen: IconBoodschappen,
  boodschappenlijst: IconNotities,
  vuilnis: IconOpruimen,
  'planten-water': IconNatuur,
  'keuken-reset': IconKoken,
  opruimronde: IconOpruimen,
  'schoon-bed': IconSlapen,
  vertrekken: IconVertrekken,
  thuiskomen: IconThuiskomen,
  reizen: IconReizen,
  trein: IconReizen,
  bus: IconReizen,
  auto: IconReizen,
  scooter: IconFietsen,
  'huis-verlaten': IconVertrekken,
  'tas-inpakken': IconBoodschappen,
  'sleutels-checken': IconRustmoment,
  'portemonnee-checken': IconRustmoment,
  administratie: IconAdministratie,
  'post-openen': IconEmail,
  'rekening-betalen': IconAdministratie,
  'pakketje-ophalen': IconBoodschappen,
  'pakketje-versturen': IconBoodschappen,
  afspraak: IconAfspraak,
  huisarts: IconHuisarts,
  tandarts: IconHuisarts,
  creatief: IconCreatief,
  tekenen: IconTekenen,
  schrijven: IconNotities,
  podcast: IconPodcast,
  natuur: IconNatuur,
  tuinieren: IconTuinieren,
  huisdier: IconHuisdier,
  voeding: IconVoeding,
  planning: IconPlanning,
  computer: IconComputer,
  sociaal: IconSociaalContact,
}
