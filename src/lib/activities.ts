import type { Activity, ActivityCategory } from '@/types'

export const categories: ActivityCategory[] = [
  { id: 'eten', name: 'Eten & drinken', color: '#e8a87c' },
  { id: 'verzorging', name: 'Verzorging', color: '#95b8d1' },
  { id: 'werk', name: 'Werk', color: '#6b7b8d' },
  { id: 'focus', name: 'Focus', color: '#5c7a99' },
  { id: 'gezondheid', name: 'Gezondheid', color: '#81b29a' },
  { id: 'beweging', name: 'Beweging', color: '#6baa7d' },
  { id: 'rust', name: 'Rust', color: '#7c98b3' },
  { id: 'huishouden', name: 'Huishouden', color: '#9cadbc' },
  { id: 'sociaal', name: 'Sociaal', color: '#c9ada7' },
  { id: 'therapie', name: 'Therapie', color: '#a8d5ba' },
  { id: 'zelfzorg', name: 'Zelfzorg', color: '#d4a5a5' },
  { id: 'reizen', name: 'Reizen', color: '#a3b5c7' },
  { id: 'afspraken', name: 'Afspraken', color: '#8eaabd' },
  { id: 'administratie', name: 'Administratie', color: '#7a8b99' },
  { id: 'creatief', name: 'Creatief', color: '#b8a9c9' },
  { id: 'buiten', name: 'Buiten', color: '#81b29a' },
  { id: 'huisdieren', name: 'Huisdieren', color: '#c9ada7' },
  { id: 'slapen', name: 'Slapen', color: '#5c7a99' },
]

export const activities: Activity[] = [
  // Eten & drinken
  { id: 'ontbijt', name: 'Ontbijt', category: 'eten', iconId: 'ontbijt', color: '#e8a87c' },
  { id: 'lunch', name: 'Lunch', category: 'eten', iconId: 'lunch', color: '#e8a87c' },
  { id: 'avondeten', name: 'Avondeten', category: 'eten', iconId: 'avondeten', color: '#e8a87c' },
  { id: 'snack', name: 'Snack', category: 'eten', iconId: 'snack', color: '#e8a87c' },
  { id: 'water', name: 'Water', category: 'eten', iconId: 'water', color: '#95b8d1' },
  { id: 'koffie', name: 'Koffie', category: 'eten', iconId: 'koffie', color: '#a08060' },
  { id: 'thee', name: 'Thee', category: 'eten', iconId: 'thee', color: '#81b29a' },
  { id: 'eten-voorbereiden', name: 'Eten voorbereiden', category: 'eten', iconId: 'eten-voorbereiden', color: '#e8a87c' },

  // Verzorging
  { id: 'douchen', name: 'Douchen', category: 'verzorging', iconId: 'douchen', color: '#95b8d1' },
  { id: 'tandenpoetsen', name: 'Tanden poetsen', category: 'verzorging', iconId: 'tandenpoetsen', color: '#95b8d1' },
  { id: 'huidverzorging', name: 'Huidverzorging', category: 'verzorging', iconId: 'huidverzorging', color: '#d4a5a5' },
  { id: 'medicatie', name: 'Medicatie', category: 'verzorging', iconId: 'medicatie', color: '#8eaabd' },
  { id: 'supplement', name: 'Supplement', category: 'verzorging', iconId: 'supplement', color: '#81b29a' },
  { id: 'creatine', name: 'Creatine', category: 'verzorging', iconId: 'creatine', color: '#81b29a' },
  { id: 'medicijn-ophalen', name: 'Medicijn ophalen', category: 'verzorging', iconId: 'medicijn-ophalen', color: '#8eaabd' },
  { id: 'kleding-klaarleggen', name: 'Kleding klaarleggen', category: 'verzorging', iconId: 'kleding-klaarleggen', color: '#95b8d1' },

  // Werk
  { id: 'werken', name: 'Werken', category: 'werk', iconId: 'werken', color: '#6b7b8d' },
  { id: 'laptopwerk', name: 'Laptopwerk', category: 'werk', iconId: 'laptopwerk', color: '#6b7b8d' },
  { id: 'email', name: 'E-mail', category: 'werk', iconId: 'email', color: '#6b7b8d' },
  { id: 'telefoon', name: 'Telefoon', category: 'werk', iconId: 'telefoon', color: '#6b7b8d' },
  { id: 'meeting', name: 'Meeting', category: 'werk', iconId: 'meeting', color: '#8eaabd' },
  { id: 'notities-maken', name: 'Notities maken', category: 'werk', iconId: 'notities-maken', color: '#7a8b99' },
  { id: 'bureau-opruimen', name: 'Bureau opruimen', category: 'werk', iconId: 'bureau-opruimen', color: '#9cadbc' },
  { id: 'mailen', name: 'Mailen', category: 'werk', iconId: 'mailen', color: '#6b7b8d' },
  { id: 'bellen', name: 'Bellen', category: 'werk', iconId: 'bellen', color: '#6b7b8d' },

  // Focus
  { id: 'focusblok', name: 'Focusblok', category: 'focus', iconId: 'focusblok', color: '#5c7a99' },
  { id: 'studie', name: 'Studie', category: 'focus', iconId: 'studie', color: '#5c7a99' },
  { id: 'lezen', name: 'Lezen', category: 'focus', iconId: 'lezen', color: '#7c98b3' },
  { id: 'schermpauze', name: 'Schermpauze', category: 'focus', iconId: 'schermpauze', color: '#9cadbc' },

  // Gezondheid
  { id: 'waterfles-vullen', name: 'Waterfles vullen', category: 'gezondheid', iconId: 'waterfles-vullen', color: '#95b8d1' },
  { id: 'ademhaling-oef', name: 'Ademhaling', category: 'gezondheid', iconId: 'ademhaling-oef', color: '#95b8d1' },
  { id: 'meditatie', name: 'Meditatie', category: 'gezondheid', iconId: 'meditatie', color: '#a8d5ba' },

  // Beweging
  { id: 'wandelen', name: 'Wandelen', category: 'beweging', iconId: 'wandelen', color: '#81b29a' },
  { id: 'sporten', name: 'Sporten', category: 'beweging', iconId: 'sporten', color: '#81b29a' },
  { id: 'yoga', name: 'Yoga', category: 'beweging', iconId: 'yoga', color: '#a8d5ba' },
  { id: 'stretchen', name: 'Stretchen', category: 'beweging', iconId: 'stretchen', color: '#81b29a' },
  { id: 'fietsen', name: 'Fietsen', category: 'beweging', iconId: 'fietsen', color: '#81b29a' },
  { id: 'zwemmen', name: 'Zwemmen', category: 'beweging', iconId: 'zwemmen', color: '#95b8d1' },
  { id: 'hond-uitlaten', name: 'Hond uitlaten', category: 'beweging', iconId: 'hond-uitlaten', color: '#c9ada7' },

  // Rust
  { id: 'rustmoment', name: 'Rustmoment', category: 'rust', iconId: 'rustmoment', color: '#7c98b3' },
  { id: 'pauze', name: 'Pauze', category: 'rust', iconId: 'pauze', color: '#9cadbc' },
  { id: 'uitrusten', name: 'Uitrusten', category: 'rust', iconId: 'uitrusten', color: '#7c98b3' },
  { id: 'dutje', name: 'Dutje', category: 'rust', iconId: 'dutje', color: '#7c98b3' },
  { id: 'ontspanning', name: 'Ontspanning', category: 'rust', iconId: 'ontspanning', color: '#9cadbc' },
  { id: 'game', name: 'Gamen', category: 'rust', iconId: 'game', color: '#b8a9c9' },
  { id: 'muziek', name: 'Muziek', category: 'rust', iconId: 'muziek', color: '#b8a9c9' },

  // Huishouden
  { id: 'koken', name: 'Koken', category: 'huishouden', iconId: 'koken', color: '#9cadbc' },
  { id: 'opruimen', name: 'Opruimen', category: 'huishouden', iconId: 'opruimen', color: '#9cadbc' },
  { id: 'afwassen', name: 'Afwassen', category: 'huishouden', iconId: 'afwassen', color: '#9cadbc' },
  { id: 'was-doen', name: 'Was doen', category: 'huishouden', iconId: 'was-doen', color: '#9cadbc' },
  { id: 'was-ophangen', name: 'Was ophangen', category: 'huishouden', iconId: 'was-ophangen', color: '#9cadbc' },
  { id: 'was-vouwen', name: 'Was vouwen', category: 'huishouden', iconId: 'was-vouwen', color: '#9cadbc' },
  { id: 'stofzuigen', name: 'Stofzuigen', category: 'huishouden', iconId: 'stofzuigen', color: '#9cadbc' },
  { id: 'schoonmaken', name: 'Schoonmaken', category: 'huishouden', iconId: 'schoonmaken', color: '#9cadbc' },
  { id: 'boodschappen', name: 'Boodschappen', category: 'huishouden', iconId: 'boodschappen', color: '#9cadbc' },
  { id: 'boodschappenlijst', name: 'Boodschappenlijst', category: 'huishouden', iconId: 'boodschappenlijst', color: '#9cadbc' },
  { id: 'vuilnis', name: 'Vuilnis buiten', category: 'huishouden', iconId: 'vuilnis', color: '#9cadbc' },
  { id: 'planten-water', name: 'Planten water geven', category: 'huishouden', iconId: 'planten-water', color: '#81b29a' },
  { id: 'keuken-reset', name: 'Keuken reset', category: 'huishouden', iconId: 'keuken-reset', color: '#9cadbc' },
  { id: 'opruimronde', name: 'Opruimronde', category: 'huishouden', iconId: 'opruimronde', color: '#9cadbc' },
  { id: 'schoon-bed', name: 'Schoon bed', category: 'huishouden', iconId: 'schoon-bed', color: '#bdd5ea' },

  // Sociaal
  { id: 'sociaal-contact', name: 'Sociaal contact', category: 'sociaal', iconId: 'sociaal-contact', color: '#c9ada7' },
  { id: 'gesprek', name: 'Gesprek', category: 'sociaal', iconId: 'gesprek', color: '#c9ada7' },
  { id: 'winkelen', name: 'Winkelen', category: 'sociaal', iconId: 'winkelen', color: '#c9ada7' },
  { id: 'feest', name: 'Feest', category: 'sociaal', iconId: 'feest', color: '#e8a87c' },

  // Therapie
  { id: 'therapie', name: 'Therapie', category: 'therapie', iconId: 'therapie', color: '#a8d5ba' },
  { id: 'psycholoog', name: 'Psycholoog', category: 'therapie', iconId: 'psycholoog', color: '#a8d5ba' },
  { id: 'ademhaling-therapie', name: 'Ademhaling', category: 'therapie', iconId: 'ademhaling-therapie', color: '#95b8d1' },
  { id: 'dankbaarheid', name: 'Dankbaarheid', category: 'therapie', iconId: 'dankbaarheid', color: '#e8a87c' },

  // Zelfzorg
  { id: 'dagboek-zelfzorg', name: 'Dagboek', category: 'zelfzorg', iconId: 'dagboek-zelfzorg', color: '#b8a9c9' },
  { id: 'zelfzorg', name: 'Zelfzorg', category: 'zelfzorg', iconId: 'zelfzorg', color: '#d4a5a5' },
  { id: 'avondroutine', name: 'Avondroutine', category: 'zelfzorg', iconId: 'avondroutine', color: '#7c98b3' },
  { id: 'ochtendroutine', name: 'Ochtendroutine', category: 'zelfzorg', iconId: 'ochtendroutine', color: '#e8a87c' },
  { id: 'buitenlucht', name: 'Buitenlucht', category: 'zelfzorg', iconId: 'buitenlucht', color: '#81b29a' },
  { id: 'telefoon-opladen', name: 'Telefoon opladen', category: 'zelfzorg', iconId: 'telefoon-opladen', color: '#9cadbc' },
  { id: 'opladen', name: 'Opladen', category: 'zelfzorg', iconId: 'opladen', color: '#9cadbc' },

  // Reizen
  { id: 'vertrekken', name: 'Vertrekken', category: 'reizen', iconId: 'vertrekken', color: '#a3b5c7' },
  { id: 'thuiskomen', name: 'Thuiskomen', category: 'reizen', iconId: 'thuiskomen', color: '#a3b5c7' },
  { id: 'reizen', name: 'Reizen', category: 'reizen', iconId: 'reizen', color: '#a3b5c7' },
  { id: 'trein', name: 'Trein', category: 'reizen', iconId: 'trein', color: '#a3b5c7' },
  { id: 'bus', name: 'Bus', category: 'reizen', iconId: 'bus', color: '#a3b5c7' },
  { id: 'auto', name: 'Auto', category: 'reizen', iconId: 'auto', color: '#a3b5c7' },
  { id: 'scooter', name: 'Scooter', category: 'reizen', iconId: 'scooter', color: '#a3b5c7' },
  { id: 'huis-verlaten', name: 'Huis verlaten', category: 'reizen', iconId: 'huis-verlaten', color: '#a3b5c7' },
  { id: 'tas-inpakken', name: 'Tas inpakken', category: 'reizen', iconId: 'tas-inpakken', color: '#a3b5c7' },
  { id: 'sleutels-checken', name: 'Sleutels checken', category: 'reizen', iconId: 'sleutels-checken', color: '#a3b5c7' },
  { id: 'portemonnee-checken', name: 'Portemonnee checken', category: 'reizen', iconId: 'portemonnee-checken', color: '#a3b5c7' },

  // Afspraken
  { id: 'afspraak', name: 'Afspraak', category: 'afspraken', iconId: 'afspraak', color: '#8eaabd' },
  { id: 'huisarts', name: 'Huisarts', category: 'afspraken', iconId: 'huisarts', color: '#8eaabd' },
  { id: 'tandarts', name: 'Tandarts', category: 'afspraken', iconId: 'tandarts', color: '#8eaabd' },

  // Administratie
  { id: 'administratie', name: 'Administratie', category: 'administratie', iconId: 'administratie', color: '#7a8b99' },
  { id: 'post-openen', name: 'Post openen', category: 'administratie', iconId: 'post-openen', color: '#7a8b99' },
  { id: 'rekening-betalen', name: 'Rekening betalen', category: 'administratie', iconId: 'rekening-betalen', color: '#7a8b99' },
  { id: 'pakketje-ophalen', name: 'Pakketje ophalen', category: 'administratie', iconId: 'pakketje-ophalen', color: '#7a8b99' },
  { id: 'pakketje-versturen', name: 'Pakketje versturen', category: 'administratie', iconId: 'pakketje-versturen', color: '#7a8b99' },

  // Creatief
  { id: 'creatief', name: 'Creatief', category: 'creatief', iconId: 'creatief', color: '#b8a9c9' },
  { id: 'tekenen', name: 'Tekenen', category: 'creatief', iconId: 'tekenen', color: '#b8a9c9' },
  { id: 'schrijven', name: 'Schrijven', category: 'creatief', iconId: 'schrijven', color: '#b8a9c9' },
  { id: 'podcast', name: 'Podcast', category: 'creatief', iconId: 'podcast', color: '#b8a9c9' },

  // Buiten
  { id: 'natuur', name: 'Natuur', category: 'buiten', iconId: 'natuur', color: '#81b29a' },
  { id: 'tuinieren', name: 'Tuinieren', category: 'buiten', iconId: 'tuinieren', color: '#81b29a' },
  { id: 'fietsen-buiten', name: 'Fietsen', category: 'buiten', iconId: 'fietsen-buiten', color: '#81b29a' },

  // Huisdieren
  { id: 'huisdier', name: 'Huisdier', category: 'huisdieren', iconId: 'huisdier', color: '#c9ada7' },

  // Slapen
  { id: 'slapen', name: 'Slapen', category: 'slapen', iconId: 'slapen', color: '#5c7a99' },
  { id: 'slaap-voorbereiding', name: 'Slaapvoorbereiding', category: 'slapen', iconId: 'slaap-voorbereiding', color: '#5c7a99' },
]

export const durationOptions = [
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '25 min', value: 25 },
  { label: '30 min', value: 30 },
  { label: '35 min', value: 35 },
  { label: '40 min', value: 40 },
  { label: '45 min', value: 45 },
  { label: '50 min', value: 50 },
  { label: '55 min', value: 55 },
  { label: '1 uur', value: 60 },
  { label: '2 uur', value: 120 },
  { label: '3 uur', value: 180 },
  { label: '4 uur', value: 240 },
  { label: '5 uur', value: 300 },
  { label: '6 uur', value: 360 },
  { label: '7 uur', value: 420 },
  { label: '8 uur', value: 480 },
  { label: '9 uur', value: 540 },
  { label: '10 uur', value: 600 },
]
