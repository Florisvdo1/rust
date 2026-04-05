import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react'
import { useApp } from '../../store/AppContext'
import { BottomSheet } from '../../components/ui/BottomSheet'

// ─── Types ───────────────────────────────────────────────────────────────────

interface BreathPhase {
  name: 'Inademen' | 'Vasthouden' | 'Uitademen' | 'Pauze'
  duration: number
  cue: string
  supportText: string
}

interface PreInstruction {
  what: string
  helps: string[]
  inhaleHow: string
  exhaleHow: string
  hold?: string
  belly: string
  shoulders: string
  safetyNote?: string
  whenNotTo?: string
  handGuide?: string
}

interface BreathExercise {
  id: string
  title: string
  category: 'Rustiger' | 'Focus' | 'Energie'
  intent: string
  level: 'Beginner' | 'Gevorderd'
  evidenceLabel: 'Sterk bewijs' | 'Gemengd bewijs' | 'Voorzichtig'
  durationOptions: number[]
  isAdvanced: boolean
  safetyWarning?: string
  phases: BreathPhase[]
  preInstruction: PreInstruction
  sceneType: 'belly' | 'box' | 'nostril' | 'mist' | 'pulse' | 'torso'
}

type PlayerStatus = 'counting' | 'running' | 'paused' | 'done'
type Stage = 'library' | 'pre' | 'countdown' | 'player'
type CategoryFilter = 'Alle' | 'Rustiger' | 'Focus' | 'Energie'

// ─── Data ────────────────────────────────────────────────────────────────────

const EXERCISES: BreathExercise[] = [
  {
    id: 'buikademhaling',
    title: 'Buikademhaling',
    category: 'Rustiger',
    intent: 'Activeer je parasympathisch zenuwstelsel en verlaag spanning met diepe buikademing.',
    level: 'Beginner',
    evidenceLabel: 'Sterk bewijs',
    durationOptions: [5, 10, 15],
    isAdvanced: false,
    phases: [
      {
        name: 'Inademen',
        duration: 4,
        cue: 'Adem rustig in door je neus',
        supportText: 'Voel je buik zachtjes uitzetten',
      },
      {
        name: 'Uitademen',
        duration: 6,
        cue: 'Adem langzaam uit door je neus',
        supportText: 'Laat je buik rustig dalen',
      },
    ],
    preInstruction: {
      what: 'Buikademhaling, ook wel diafragmatisch ademen, activeert het parasympathisch zenuwstelsel. Dit vertraagt de hartslag en vermindert stresshormonen.',
      helps: ['Stress en angst verminderen', 'Ontspanning bevorderen', 'Slaapkwaliteit verbeteren', 'Bloeddruk verlagen'],
      inhaleHow: 'Adem in via je neus, tel langzaam tot 4. Laat de lucht diep naar beneden stromen.',
      exhaleHow: 'Adem uit via je neus, tel langzaam tot 6. Langer uitademen dan inademen verdiept de ontspanning.',
      belly: 'Leg een hand op je buik. Voel hem bij het inademen omhoog komen, bij het uitademen dalen.',
      shoulders: 'Houd je schouders ontspannen en laag. Ze mogen niet meetrekken.',
    },
    sceneType: 'belly',
  },
  {
    id: 'verlengde-uitademing',
    title: 'Verlengde uitademing',
    category: 'Rustiger',
    intent: 'Een lange uitademing activeert de rustrespons van je lichaam en kalmeert het zenuwstelsel snel.',
    level: 'Beginner',
    evidenceLabel: 'Sterk bewijs',
    durationOptions: [5, 10],
    isAdvanced: false,
    phases: [
      {
        name: 'Inademen',
        duration: 4,
        cue: 'Adem rustig in',
        supportText: 'Vul je longen kalm en volledig',
      },
      {
        name: 'Uitademen',
        duration: 8,
        cue: 'Adem heel langzaam uit',
        supportText: 'Dubbel zo lang als inademen — dat is de sleutel',
      },
    ],
    preInstruction: {
      what: 'Door langer uit te ademen dan in te ademen activeer je de nervus vagus, de hoofdkabel van je parasympathisch zenuwstelsel.',
      helps: ['Snel kalmeren bij stress', 'Paniekaanval onderbreken', 'Slaap inducing voor het slapengaan'],
      inhaleHow: 'Adem in via je neus, 4 tellen.',
      exhaleHow: 'Adem uit via je neus of mond, 8 tellen. Maak de uitademing zo gelijkmatig mogelijk.',
      belly: 'Buik omhoog bij inademen, zachtjes samentrekken bij uitademen.',
      shoulders: 'Schouders zakken bij elke uitademing een beetje verder.',
    },
    sceneType: 'mist',
  },
  {
    id: 'cyclische-zucht',
    title: 'Cyclische zucht',
    category: 'Rustiger',
    intent: 'Een dubbele inademing gevolgd door een lange zucht — klinisch bewezen de snelste manier om het zenuwstelsel te kalmeren.',
    level: 'Beginner',
    evidenceLabel: 'Sterk bewijs',
    durationOptions: [3, 5, 10],
    isAdvanced: false,
    phases: [
      {
        name: 'Inademen',
        duration: 4,
        cue: 'Adem diep in via je neus',
        supportText: 'Vul je longen voor ongeveer 80%',
      },
      {
        name: 'Inademen',
        duration: 1,
        cue: 'Snuif nog een beetje extra lucht bij',
        supportText: 'Een korte extra inademing om de longen volledig te openen',
      },
      {
        name: 'Uitademen',
        duration: 8,
        cue: 'Laat alles langzaam los via je mond',
        supportText: 'Een lange, volledige uitademing — de cyclische zucht',
      },
    ],
    preInstruction: {
      what: 'De cyclische zucht is onderzocht door Stanford University. De dubbele inademing opent ingeklapte longblaasjes, waarna een lange uitademing CO₂ afvoert en direct kalmte induceert.',
      helps: ['Acute stress snel reduceren', 'Angst doorbreken', 'Stemming verbeteren'],
      inhaleHow: 'Eerste inademing via de neus, diep en vol (4 sec). Dan een korte extra snuif om longen maximaal te vullen (1 sec).',
      exhaleHow: 'Lange, langzame uitademing via de mond (8 sec). Laat het ontspannen gaan, geen kracht.',
      belly: 'Bij de dubbele inademing voel je de buik en ribbenkast uitzetten. Bij de lange uitademing valt alles weg.',
      shoulders: 'Schouders mogen even optrekken bij de tweede inademing — laat ze daarna volledig vallen bij de uitademing.',
    },
    sceneType: 'pulse',
  },
  {
    id: 'afwisselend-neusgat',
    title: 'Afwisselend neusgat',
    category: 'Rustiger',
    intent: 'Nadi Shodhana uit de yoga-traditie — balanceert de twee hersenhelften en bevordert diepe rust.',
    level: 'Gevorderd',
    evidenceLabel: 'Gemengd bewijs',
    durationOptions: [5, 10, 15],
    isAdvanced: true,
    phases: [
      {
        name: 'Inademen',
        duration: 4,
        cue: 'Sluit rechterneusgat, adem in via links',
        supportText: 'Rechterduim sluit rechterneusgat',
      },
      {
        name: 'Vasthouden',
        duration: 2,
        cue: 'Houd de adem vast',
        supportText: 'Beide neusgaten gesloten',
      },
      {
        name: 'Uitademen',
        duration: 4,
        cue: 'Sluit linkerneusgat, adem uit via rechts',
        supportText: 'Ringvinger sluit linkerneusgat',
      },
      {
        name: 'Vasthouden',
        duration: 2,
        cue: 'Houd de adem vast',
        supportText: 'Klaar voor de volgende cyclus',
      },
    ],
    preInstruction: {
      what: 'Nadi Shodhana (afwisselend neusgat-ademhaling) is een pranayama-techniek die in traditionele yoga wordt gebruikt om de energiebanen te zuiveren en de geest te balanceren.',
      helps: ['Mentale balans herstellen', 'Concentratie verbeteren', 'Emotionele stabiliteit bevorderen'],
      inhaleHow: 'Altijd via één neusgat per keer. Gebruik je rechterhand in Vishnu mudra.',
      exhaleHow: 'Via het tegenovergestelde neusgat als waar je inademde.',
      hold: 'Korte pauze tussen in- en uitademing met beide neusgaten gesloten.',
      belly: 'Buikademhaling: laat de buik uitzetten bij elke inademing.',
      shoulders: 'Ontspannen en laag — de arm mag rusten als dat comfortabeler is.',
      whenNotTo: 'Niet doen bij neusverstopping, hoge bloeddruk of tijdens zwangerschap zonder begeleiding.',
      handGuide: 'Rechterhand: duim sluit rechterneusgat, ringvinger sluit linkerneusgat. Wijs- en middelvinger rusten op het voorhoofd of gevouwen in de palm. Links-rechts-links = één cyclus.',
    },
    sceneType: 'nostril',
  },
  {
    id: 'box-breathing',
    title: 'Box breathing',
    category: 'Focus',
    intent: 'Vier gelijke fases zorgen voor symmetrie in het zenuwstelsel — gebruikt door Navy SEALs en topsporters.',
    level: 'Beginner',
    evidenceLabel: 'Sterk bewijs',
    durationOptions: [5, 10, 20],
    isAdvanced: false,
    phases: [
      {
        name: 'Inademen',
        duration: 4,
        cue: 'Adem in — 4 tellen',
        supportText: 'Eerste zijde van de doos',
      },
      {
        name: 'Vasthouden',
        duration: 4,
        cue: 'Houd vast — 4 tellen',
        supportText: 'Tweede zijde van de doos',
      },
      {
        name: 'Uitademen',
        duration: 4,
        cue: 'Adem uit — 4 tellen',
        supportText: 'Derde zijde van de doos',
      },
      {
        name: 'Pauze',
        duration: 4,
        cue: 'Pauze — 4 tellen',
        supportText: 'Vierde zijde van de doos',
      },
    ],
    preInstruction: {
      what: 'Box breathing (vierkante ademhaling) gebruikt vier gelijke fases om het autonome zenuwstelsel te resetten. Het wordt door militairen en topsporters gebruikt om scherp te blijven onder druk.',
      helps: ['Concentratie verhogen', 'Stress beheersen', 'Emotieregulatie', 'Presteren onder druk'],
      inhaleHow: 'Via de neus, gelijkmatig, 4 tellen.',
      exhaleHow: 'Via de neus of mond, gelijkmatig, 4 tellen.',
      hold: 'Twee keer vasthouden per cyclus: na inademen en na uitademen, elk 4 tellen.',
      belly: 'Buik uit bij inademen, neutraal bij vasthouden, in bij uitademen.',
      shoulders: 'Bewust ontspannen — stel je voor dat je schouders bij elke uitademing een millimeter zakken.',
    },
    sceneType: 'box',
  },
  {
    id: 'gelijke-adem-focus',
    title: 'Gelijke adem voor focus',
    category: 'Focus',
    intent: 'Gelijke in- en uitademing stabiliseert de hartcoherentie en schept mentale helderheid.',
    level: 'Beginner',
    evidenceLabel: 'Sterk bewijs',
    durationOptions: [5, 10, 15],
    isAdvanced: false,
    phases: [
      {
        name: 'Inademen',
        duration: 4,
        cue: 'Adem gelijkmatig in',
        supportText: 'Rustig en beheerst — geen haast',
      },
      {
        name: 'Uitademen',
        duration: 4,
        cue: 'Adem gelijkmatig uit',
        supportText: 'Precies even lang als inademen',
      },
    ],
    preInstruction: {
      what: 'Sama Vritti ("gelijke beweging") is een pranayama-techniek waarbij in- en uitademing even lang zijn. Dit bevordert hartcoherentie, een toestand van maximale coördinatie tussen hart, geest en ademhaling.',
      helps: ['Mentale helderheid voor een taak', 'Concentratie duurzaam vasthouden', 'Mild kalmerende werking'],
      inhaleHow: 'Via de neus, 4 tellen, gelijkmatig van begin tot eind.',
      exhaleHow: 'Via de neus, 4 tellen, even gelijkmatig.',
      belly: 'Zachte buikademhaling — geen geforceerde beweging.',
      shoulders: 'Volledig ontspannen gedurende de hele sessie.',
    },
    sceneType: 'torso',
  },
  {
    id: 'activerende-inademing',
    title: 'Activerende inademing',
    category: 'Energie',
    intent: 'Snelle dubbele inademing gevolgd door een rustige uitademing — verhoogt alertheid en energieniveau.',
    level: 'Beginner',
    evidenceLabel: 'Gemengd bewijs',
    durationOptions: [3, 5],
    isAdvanced: false,
    safetyWarning: 'Stop direct bij duizeligheid. Niet doen bij hoge bloeddruk of hart- en vaatziekten.',
    phases: [
      {
        name: 'Inademen',
        duration: 1,
        cue: 'Snelle inademing via neus',
        supportText: 'Kort en krachtig',
      },
      {
        name: 'Inademen',
        duration: 1,
        cue: 'Nog een snelle inademing',
        supportText: 'Direct na de eerste, vul de longen',
      },
      {
        name: 'Uitademen',
        duration: 3,
        cue: 'Rustig uitademen via de mond',
        supportText: 'Ontspannen loslaten',
      },
    ],
    preInstruction: {
      what: 'Deze activerende techniek gebruikt snelle dubbele inademingen om de sympathische respons licht te activeren — je zenuwstelsel komt in een hogere versnelling voor alertheid en energie.',
      helps: ['Energie boost midden op de dag', 'Alertheid verhogen', 'Middag-dip doorbreken'],
      inhaleHow: 'Twee snelle, krachtige inademingen via de neus direct achter elkaar.',
      exhaleHow: 'Rustige uitademing via de mond, laat lucht vrij stromen.',
      belly: 'Buik pompt licht mee bij de snelle inademingen.',
      shoulders: 'Mogen licht meebewegen — na de uitademing direct ontspannen.',
      whenNotTo: 'Niet bij hoge bloeddruk, hart- en vaatziekten, epilepsie of zwangerschap. Stop bij duizeligheid.',
    },
    sceneType: 'pulse',
  },
  {
    id: 'bewuste-uitademing',
    title: 'Bewuste uitademing',
    category: 'Energie',
    intent: 'Verlengt bewust de uitademingsfase en verlaagt sluimerende vermoeidheid voor frisse energie.',
    level: 'Gevorderd',
    evidenceLabel: 'Gemengd bewijs',
    durationOptions: [5, 10, 15],
    isAdvanced: true,
    phases: [
      {
        name: 'Inademen',
        duration: 5,
        cue: 'Langzaam en volledig inademen',
        supportText: 'Vul van buik naar borst',
      },
      {
        name: 'Uitademen',
        duration: 7,
        cue: 'Bewust en volledig uitademen',
        supportText: 'Laat elke cel lucht loslaten',
      },
      {
        name: 'Pauze',
        duration: 2,
        cue: 'Rust — leeg moment',
        supportText: 'Observeer de stilte voor de volgende inademing',
      },
    ],
    preInstruction: {
      what: 'Een bewuste, verlengde uitademing verwijdert stale lucht volledig uit de longen en reset het koolzuurgehalte. Dit geeft een gevoel van frisheid en wakkerheid zonder cafeïne.',
      helps: ['Sluimerende vermoeidheid verminderen', 'Mentale helderheid vergroten', 'Energieniveau resetten'],
      inhaleHow: 'Via de neus, 5 tellen. Begin vanuit de buik, dan de borstkas.',
      exhaleHow: 'Via de neus of mond, 7 tellen. Bewust en volledig — probeer de longen echt leeg te maken.',
      hold: 'Korte pauze van 2 tellen na de uitademing — observeer de stilte.',
      belly: 'Actief bewegen: uit bij inademen, in bij uitademen.',
      shoulders: 'Laag en ontspannen — niet naar voren buigen.',
    },
    sceneType: 'mist',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`
}

function cycleDuration(ex: BreathExercise): number {
  return ex.phases.reduce((sum, p) => sum + p.duration, 0)
}

function totalCycles(ex: BreathExercise, minutes: number): number {
  return Math.max(1, Math.round((minutes * 60) / cycleDuration(ex)))
}

function getFavKey(id: string) {
  return `rust_breath_fav_${id}`
}

// ─── Color tokens for categories ─────────────────────────────────────────────

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Rustiger: { bg: 'rgba(74,153,112,0.15)', text: '#5db888', border: 'rgba(74,153,112,0.3)' },
  Focus: { bg: 'rgba(74,120,168,0.15)', text: '#6896c8', border: 'rgba(74,120,168,0.3)' },
  Energie: { bg: 'rgba(200,144,64,0.15)', text: '#d4a050', border: 'rgba(200,144,64,0.3)' },
}

const EVIDENCE_COLORS: Record<string, { bg: string; text: string }> = {
  'Sterk bewijs': { bg: 'rgba(74,153,112,0.1)', text: '#5db888' },
  'Gemengd bewijs': { bg: 'rgba(200,144,64,0.1)', text: '#d4a050' },
  'Voorzichtig': { bg: 'rgba(160,64,64,0.1)', text: '#c87070' },
}

// ─── Breathing Animations ────────────────────────────────────────────────────

interface AnimProps {
  phase: BreathPhase
  progress: number // 0..1 within phase
  reducedMotion: boolean
}

function BellyScene({ phase, progress, reducedMotion }: AnimProps) {
  const isIn = phase.name === 'Inademen'
  const scale = reducedMotion ? 1 : isIn ? 0.85 + progress * 0.3 : 1.15 - progress * 0.3
  const opacity = 0.5 + (isIn ? progress * 0.5 : (1 - progress) * 0.5)

  return (
    <svg viewBox="0 0 200 200" width="180" height="180" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="bellyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6896c8" stopOpacity={opacity} />
          <stop offset="60%" stopColor="#4a78a8" stopOpacity={opacity * 0.6} />
          <stop offset="100%" stopColor="#4a78a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="95" r={50 * scale} fill="url(#bellyGrad)"
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }} />
      <circle cx="100" cy="95" r={50 * scale} fill="none"
        stroke="#6896c8" strokeWidth="1.5" strokeOpacity={0.5}
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }} />
      {/* belly wave */}
      <ellipse cx="100" cy="152" rx={32 * scale} ry={8}
        fill="none" stroke="#4a78a8" strokeWidth="1.5" strokeOpacity={0.4}
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }} />
      <ellipse cx="100" cy="160" rx={20 * scale} ry={5}
        fill="none" stroke="#4a78a8" strokeWidth="1" strokeOpacity={0.2}
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }} />
    </svg>
  )
}

function MistScene({ phase, progress, reducedMotion }: AnimProps) {
  const isOut = phase.name === 'Uitademen'
  const r1 = reducedMotion ? 40 : isOut ? 30 + progress * 50 : 80 - progress * 40
  const r2 = reducedMotion ? 60 : isOut ? 50 + progress * 60 : 110 - progress * 50
  const op1 = isOut ? (1 - progress) * 0.5 : progress * 0.5
  const op2 = isOut ? (1 - progress) * 0.25 : progress * 0.25

  return (
    <svg viewBox="0 0 200 200" width="180" height="180" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="mistGrad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a8c8e0" stopOpacity={op1} />
          <stop offset="100%" stopColor="#a8c8e0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mistGrad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6896c8" stopOpacity={op2} />
          <stop offset="100%" stopColor="#6896c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r={r2}
        fill="url(#mistGrad2)"
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }} />
      <circle cx="100" cy="100" r={r1}
        fill="url(#mistGrad1)"
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }} />
      <circle cx="100" cy="100" r="18" fill="#1a2740" stroke="#6896c8" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  )
}

function PulseScene({ phase, progress, reducedMotion }: AnimProps) {
  const isIn = phase.name === 'Inademen'
  const base = reducedMotion ? 0 : isIn ? progress : 1 - progress * 0.5
  const rings = [0.3, 0.55, 0.8]

  return (
    <svg viewBox="0 0 200 200" width="180" height="180" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="pulseCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6896c8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4a78a8" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      {rings.map((ratio, i) => (
        <circle
          key={i}
          cx="100" cy="100"
          r={20 + base * 60 * ratio}
          fill="none"
          stroke="#6896c8"
          strokeWidth={1.5 - i * 0.4}
          strokeOpacity={(0.6 - i * 0.15) * (0.3 + base * 0.7)}
          style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }}
        />
      ))}
      <circle cx="100" cy="100" r={18 + base * 8} fill="url(#pulseCore)"
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }} />
    </svg>
  )
}

function BoxScene({ phase, progress, reducedMotion }: AnimProps) {
  const size = 120
  const pad = 40
  const x0 = pad, y0 = pad, x1 = pad + size, y1 = pad + size
  const perimeter = size * 4

  const phaseIndex = ['Inademen', 'Vasthouden', 'Uitademen', 'Pauze'].indexOf(phase.name)
  const baseOffset = phaseIndex * size
  const offset = reducedMotion ? baseOffset : baseOffset + progress * size

  // Convert perimeter offset to x,y
  function perimToXY(d: number): [number, number] {
    const p = ((d % perimeter) + perimeter) % perimeter
    if (p < size) return [x0 + p, y0]
    if (p < size * 2) return [x1, y0 + (p - size)]
    if (p < size * 3) return [x1 - (p - size * 2), y1]
    return [x0, y1 - (p - size * 3)]
  }

  const [dotX, dotY] = perimToXY(offset)

  return (
    <svg viewBox="0 0 200 200" width="180" height="180">
      <rect x={x0} y={y0} width={size} height={size}
        fill="none" stroke="#2a3d5a" strokeWidth="1.5" rx="4" />
      {/* glow trail corners */}
      {[0, 1, 2, 3].map(i => {
        const corners: [number, number][] = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
        const active = i === phaseIndex
        const [cx, cy] = corners[i]
        return (
          <circle key={i} cx={cx} cy={cy} r={active ? 5 : 3}
            fill={active ? '#6896c8' : '#2a3d5a'}
            opacity={active ? 0.9 : 0.4} />
        )
      })}
      {/* moving dot */}
      <circle cx={dotX} cy={dotY} r="6" fill="#6896c8"
        style={{ filter: 'drop-shadow(0 0 6px #6896c8)', transition: reducedMotion ? 'none' : 'all 0.15s linear' }} />
      <circle cx={dotX} cy={dotY} r="10" fill="#6896c8" opacity="0.2"
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s linear' }} />
    </svg>
  )
}

function NostrilScene({ phase, progress, reducedMotion }: AnimProps) {
  const isLeft = phase.name === 'Inademen' // inhale via left
  const isOut = phase.name === 'Uitademen' // exhale via right
  const leftActive = isLeft || !isOut
  const rightActive = isOut

  const arrowOp = reducedMotion ? 0.6 : 0.3 + progress * 0.7

  return (
    <svg viewBox="0 0 200 200" width="180" height="180">
      {/* left channel */}
      <ellipse cx="70" cy="110" rx="20" ry="50" fill="none"
        stroke={leftActive ? '#6896c8' : '#2a3d5a'}
        strokeWidth={leftActive ? 2 : 1}
        opacity={leftActive ? 0.9 : 0.3} />
      {/* right channel */}
      <ellipse cx="130" cy="110" rx="20" ry="50" fill="none"
        stroke={rightActive ? '#6896c8' : '#2a3d5a'}
        strokeWidth={rightActive ? 2 : 1}
        opacity={rightActive ? 0.9 : 0.3} />
      {/* bridge */}
      <path d="M70 62 Q100 48 130 62" fill="none" stroke="#4a6480" strokeWidth="1.5" />
      {/* airflow arrows - left */}
      {leftActive && !reducedMotion && (
        <>
          <line x1="70" y1={80 + progress * 40} x2="70" y2={80 + progress * 40 + 15}
            stroke="#6896c8" strokeWidth="1.5" strokeLinecap="round" opacity={arrowOp} />
          <polyline points={`63,${80 + progress * 40 + 10} 70,${80 + progress * 40 + 15} 77,${80 + progress * 40 + 10}`}
            fill="none" stroke="#6896c8" strokeWidth="1.5" strokeLinecap="round" opacity={arrowOp} />
        </>
      )}
      {/* airflow arrows - right out */}
      {rightActive && !reducedMotion && (
        <>
          <line x1="130" y1={150 - progress * 40} x2="130" y2={150 - progress * 40 - 15}
            stroke="#6896c8" strokeWidth="1.5" strokeLinecap="round" opacity={arrowOp} />
          <polyline points={`123,${150 - progress * 40 - 10} 130,${150 - progress * 40 - 15} 137,${150 - progress * 40 - 10}`}
            fill="none" stroke="#6896c8" strokeWidth="1.5" strokeLinecap="round" opacity={arrowOp} />
        </>
      )}
      {/* labels */}
      <text x="70" y="175" textAnchor="middle" fontSize="10" fill="#6a85a0">Links</text>
      <text x="130" y="175" textAnchor="middle" fontSize="10" fill="#6a85a0">Rechts</text>
      {leftActive && (
        <circle cx="70" cy="110" r="16" fill="#6896c8" fillOpacity="0.08" />
      )}
      {rightActive && (
        <circle cx="130" cy="110" r="16" fill="#6896c8" fillOpacity="0.08" />
      )}
    </svg>
  )
}

function TorsoScene({ phase, progress, reducedMotion }: AnimProps) {
  const isIn = phase.name === 'Inademen'
  const flowY = reducedMotion ? 100 : isIn ? 160 - progress * 80 : 80 + progress * 80

  return (
    <svg viewBox="0 0 200 200" width="180" height="180">
      {/* simple torso outline */}
      <path
        d="M80 40 Q100 30 120 40 L130 80 Q130 100 115 115 L115 160 L85 160 L85 115 Q70 100 70 80 Z"
        fill="none" stroke="#2a3d5a" strokeWidth="1.5"
      />
      {/* airflow line */}
      <line
        x1="100" y1={isIn ? 160 : 80}
        x2="100" y2={flowY}
        stroke="#6896c8" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"
        opacity={0.7}
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }}
      />
      {/* arrow head */}
      <polyline
        points={isIn
          ? `94,${flowY - 8} 100,${flowY} 106,${flowY - 8}`
          : `94,${flowY + 8} 100,${flowY} 106,${flowY + 8}`
        }
        fill="none" stroke="#6896c8" strokeWidth="2" strokeLinecap="round"
        opacity={0.7}
        style={{ transition: reducedMotion ? 'none' : 'all 0.15s ease-out' }}
      />
    </svg>
  )
}

function BreathingAnimation({ exercise, phase, progress, reducedMotion }: {
  exercise: BreathExercise
  phase: BreathPhase
  progress: number
  reducedMotion: boolean
}) {
  const props: AnimProps = { phase, progress, reducedMotion }
  switch (exercise.sceneType) {
    case 'belly': return <BellyScene {...props} />
    case 'box': return <BoxScene {...props} />
    case 'nostril': return <NostrilScene {...props} />
    case 'mist': return <MistScene {...props} />
    case 'pulse': return <PulseScene {...props} />
    case 'torso': return <TorsoScene {...props} />
    default: return <BellyScene {...props} />
  }
}

// ─── Mini scene previews ──────────────────────────────────────────────────────

function MiniPreview({ type }: { type: BreathExercise['sceneType'] }) {
  const size = 48
  switch (type) {
    case 'belly':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle cx="24" cy="22" r="12" fill="rgba(104,150,200,0.15)" stroke="#4a78a8" strokeWidth="1.5" />
          <ellipse cx="24" cy="37" rx="8" ry="3" fill="none" stroke="#4a78a8" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      )
    case 'box':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <rect x="10" y="10" width="28" height="28" fill="none" stroke="#2a3d5a" strokeWidth="1.5" rx="2" />
          <circle cx="10" cy="10" r="3" fill="#6896c8" />
        </svg>
      )
    case 'nostril':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <ellipse cx="17" cy="28" rx="6" ry="13" fill="none" stroke="#4a78a8" strokeWidth="1.5" />
          <ellipse cx="31" cy="28" rx="6" ry="13" fill="none" stroke="#2a3d5a" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      )
    case 'mist':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="16" fill="rgba(168,200,224,0.08)" stroke="#6896c8" strokeWidth="1" />
          <circle cx="24" cy="24" r="8" fill="rgba(168,200,224,0.15)" />
        </svg>
      )
    case 'pulse':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          {[20, 14, 8].map((r, i) => (
            <circle key={i} cx="24" cy="24" r={r} fill="none" stroke="#6896c8"
              strokeWidth="1" strokeOpacity={0.7 - i * 0.2} />
          ))}
        </svg>
      )
    case 'torso':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M19 9 Q24 6 29 9 L31 21 Q31 27 27 30 L27 42 L21 42 L21 30 Q17 27 17 21 Z"
            fill="none" stroke="#2a3d5a" strokeWidth="1.5" />
        </svg>
      )
    default:
      return null
  }
}

// ─── Phase indicator dots ─────────────────────────────────────────────────────

function PhaseDots({ phases, currentIndex }: { phases: BreathPhase[]; currentIndex: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
      {phases.map((p, i) => (
        <div key={i} style={{
          width: i === currentIndex ? 20 : 7,
          height: 7,
          borderRadius: 4,
          background: i === currentIndex ? '#6896c8' : 'rgba(104,150,200,0.25)',
          transition: 'all 300ms cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      ))}
    </div>
  )
}

// ─── Settings Sheet ───────────────────────────────────────────────────────────

function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, updateSettings } = useApp()
  const { settings } = state

  const row = (label: string, key: keyof typeof settings, description?: string) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid var(--c-border)',
    }}>
      <div style={{ flex: 1, paddingRight: 16 }}>
        <div style={{ fontSize: 'var(--fs-base)', color: 'var(--c-text-primary)', fontWeight: 500 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      <button
        onClick={() => updateSettings({ [key]: !settings[key] })}
        style={{
          width: 48, height: 28, borderRadius: 14,
          background: settings[key] ? '#6896c8' : 'var(--c-surface3)',
          border: 'none', cursor: 'pointer', position: 'relative',
          flexShrink: 0,
          transition: 'background 200ms ease',
        }}
      >
        <div style={{
          position: 'absolute', top: 4, left: settings[key] ? 24 : 4,
          width: 20, height: 20, borderRadius: '50%',
          background: '#fff',
          transition: 'left 200ms cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  )

  return (
    <BottomSheet open={open} onClose={onClose} title="Instellingen">
      <div style={{ paddingTop: 8 }}>
        {row('Verminderde beweging', 'reducedMotion', 'Animaties worden vereenvoudigd')}
        {row('Laag sensorisch', 'lowSensory', 'Minder kleur en contrast')}
        {row('Geluid dempen', 'muteSounds', 'Toekomstige audio-begeleiding')}
        {row('Trillingsfeedback', 'haptics', 'Trilling bij fase-overgang')}
        {row('Beginnersmodus', 'beginnerMode', 'Verberg gevorderde oefeningen')}
        {row('Toon geavanceerd', 'showAdvancedBreathing', 'Inclusief intensievere technieken')}
      </div>
    </BottomSheet>
  )
}

// ─── Pre-instruction Sheet ────────────────────────────────────────────────────

function PreSheet({ exercise, onCancel, onStart }: {
  exercise: BreathExercise
  onCancel: () => void
  onStart: (minutes: number) => void
}) {
  const [selectedMinutes, setSelectedMinutes] = useState(exercise.durationOptions[0])
  const pre = exercise.preInstruction
  const catColor = CAT_COLORS[exercise.category]

  const section = (title: string, content: React.ReactNode) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
        {content}
      </div>
    </div>
  )

  return (
    <BottomSheet open onClose={onCancel}>
      <div>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 'var(--fs-xs)', fontWeight: 600,
              background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}`,
              borderRadius: 'var(--r-full)', padding: '3px 10px',
            }}>{exercise.category}</span>
            <span style={{
              fontSize: 'var(--fs-xs)', fontWeight: 500,
              background: 'var(--c-surface3)', color: 'var(--c-text-muted)',
              borderRadius: 'var(--r-full)', padding: '3px 10px',
            }}>{exercise.level}</span>
            <span style={{
              fontSize: 'var(--fs-xs)', fontWeight: 500,
              background: EVIDENCE_COLORS[exercise.evidenceLabel].bg,
              color: EVIDENCE_COLORS[exercise.evidenceLabel].text,
              borderRadius: 'var(--r-full)', padding: '3px 10px',
            }}>{exercise.evidenceLabel}</span>
          </div>
          <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--c-text-primary)' }}>
            {exercise.title}
          </h2>
        </div>

        {/* What */}
        <div style={{
          background: 'rgba(104,150,200,0.08)', border: '1px solid rgba(104,150,200,0.2)',
          borderRadius: 'var(--r-lg)', padding: '12px 14px', marginBottom: 20,
          fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.7,
        }}>
          {pre.what}
        </div>

        {/* Helps */}
        {section('Helpt met', (
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {pre.helps.map((h, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#5db888', fontSize: 16, lineHeight: 1 }}>·</span>
                {h}
              </li>
            ))}
          </ul>
        ))}

        {/* Breathing guide */}
        {section('Hoe adem je in', pre.inhaleHow)}
        {section('Hoe adem je uit', pre.exhaleHow)}
        {pre.hold && section('Vasthouden', pre.hold)}
        {section('Buik', pre.belly)}
        {section('Schouders', pre.shoulders)}

        {/* Hand guide for nostril */}
        {pre.handGuide && (
          <div style={{
            background: 'rgba(104,150,200,0.06)', border: '1px solid rgba(104,150,200,0.15)',
            borderRadius: 'var(--r-md)', padding: '10px 12px', marginBottom: 16,
          }}>
            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: '#6896c8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Handpositie
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
              {pre.handGuide}
            </div>
          </div>
        )}

        {/* Safety */}
        {(pre.safetyNote || pre.whenNotTo || exercise.safetyWarning) && (
          <div style={{
            background: 'rgba(160,64,64,0.08)', border: '1px solid rgba(160,64,64,0.25)',
            borderRadius: 'var(--r-md)', padding: '10px 12px', marginBottom: 16,
          }}>
            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: '#c87070', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Veiligheid
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
              {exercise.safetyWarning || pre.safetyNote || pre.whenNotTo}
            </div>
          </div>
        )}

        {/* Phase timeline */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Één cyclus
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {exercise.phases.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 60, fontSize: 'var(--fs-xs)', color: '#6896c8', fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {p.duration}s
                </div>
                <div style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: 'var(--c-surface3)', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(p.duration / cycleDuration(exercise)) * 100}%`,
                    background: 'var(--g-accent)',
                    borderRadius: 3,
                  }} />
                </div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', width: 90, flexShrink: 0 }}>
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Duration picker */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Duur
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {exercise.durationOptions.map(min => (
              <button key={min}
                onClick={() => setSelectedMinutes(min)}
                style={{
                  padding: '8px 18px', borderRadius: 'var(--r-full)',
                  fontSize: 'var(--fs-sm)', fontWeight: 600, cursor: 'pointer',
                  background: min === selectedMinutes ? 'var(--g-accent)' : 'var(--c-surface3)',
                  color: min === selectedMinutes ? '#fff' : 'var(--c-text-secondary)',
                  border: min === selectedMinutes ? 'none' : '1px solid var(--c-border)',
                  transition: 'all 200ms ease',
                }}
              >
                {min} min
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '14px 0', borderRadius: 'var(--r-lg)',
            background: 'var(--c-surface3)', border: '1px solid var(--c-border)',
            color: 'var(--c-text-secondary)', fontSize: 'var(--fs-base)', fontWeight: 600,
            cursor: 'pointer',
          }}>
            Annuleren
          </button>
          <button onClick={() => onStart(selectedMinutes)} style={{
            flex: 2, padding: '14px 0', borderRadius: 'var(--r-lg)',
            background: 'var(--g-accent)', border: 'none',
            color: '#fff', fontSize: 'var(--fs-base)', fontWeight: 700,
            cursor: 'pointer', boxShadow: 'var(--sh-accent)',
          }}>
            Starten
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}

// ─── Countdown overlay ────────────────────────────────────────────────────────

function CountdownOverlay({ count }: { count: number }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'var(--c-bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`
        @keyframes pulse-count {
          0% { transform: scale(0.7); opacity: 0; }
          40% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
      <div style={{
        fontSize: 96, fontWeight: 800,
        color: '#6896c8',
        animation: 'pulse-count 900ms ease forwards',
        lineHeight: 1,
      }}>
        {count}
      </div>
      <div style={{ fontSize: 'var(--fs-md)', color: 'var(--c-text-muted)', marginTop: 16 }}>
        Maak je klaar...
      </div>
    </div>
  )
}

// ─── Active Player ────────────────────────────────────────────────────────────

interface PlayerProps {
  exercise: BreathExercise
  totalMinutes: number
  reducedMotion: boolean
  onClose: () => void
}

function ActivePlayer({ exercise, totalMinutes, reducedMotion, onClose }: PlayerProps) {
  const cycles = totalCycles(exercise, totalMinutes)
  const totalSec = cycles * cycleDuration(exercise)

  const [status, setStatus] = useState<PlayerStatus>('running')
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [phaseRemaining, setPhaseRemaining] = useState(exercise.phases[0].duration)
  const [cycleCount, setCycleCount] = useState(1)
  const [totalRemaining, setTotalRemaining] = useState(totalSec)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseIdxRef = useRef(0)
  const phaseRemRef = useRef(exercise.phases[0].duration)
  const cycleRef = useRef(1)
  const totalRemRef = useRef(totalSec)

  const tick = useCallback(() => {
    if (totalRemRef.current <= 0) {
      setStatus('done')
      return
    }

    totalRemRef.current -= 1
    setTotalRemaining(totalRemRef.current)

    if (phaseRemRef.current <= 1) {
      // advance phase
      const nextPhaseIdx = (phaseIdxRef.current + 1) % exercise.phases.length
      const wrapping = nextPhaseIdx === 0

      if (wrapping) {
        if (cycleRef.current >= cycles) {
          setStatus('done')
          return
        }
        cycleRef.current += 1
        setCycleCount(cycleRef.current)
      }

      phaseIdxRef.current = nextPhaseIdx
      phaseRemRef.current = exercise.phases[nextPhaseIdx].duration

      setPhaseIdx(nextPhaseIdx)
      setPhaseRemaining(exercise.phases[nextPhaseIdx].duration)
    } else {
      phaseRemRef.current -= 1
      setPhaseRemaining(phaseRemRef.current)
    }
  }, [exercise, cycles])

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status, tick])

  const currentPhase = exercise.phases[phaseIdx]
  const phaseDur = currentPhase.duration
  const progress = 1 - phaseRemaining / phaseDur

  if (status === 'done') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'var(--c-bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 32,
      }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="rgba(74,153,112,0.15)" stroke="#5db888" strokeWidth="2" />
            <polyline points="25,40 36,52 56,28" fill="none" stroke="#5db888" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 12, textAlign: 'center' }}>
          Goed gedaan
        </h2>
        <p style={{ fontSize: 'var(--fs-base)', color: 'var(--c-text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 36 }}>
          Je hebt {totalMinutes} minuten {exercise.title.toLowerCase()} beoefend.<br />
          Neem even de tijd om te voelen hoe je lichaam zich nu aanvoelt.
        </p>
        <div style={{ display: 'flex', gap: 14, width: '100%', maxWidth: 320 }}>
          <button onClick={() => {
            phaseIdxRef.current = 0
            phaseRemRef.current = exercise.phases[0].duration
            cycleRef.current = 1
            totalRemRef.current = totalSec
            setPhaseIdx(0)
            setPhaseRemaining(exercise.phases[0].duration)
            setCycleCount(1)
            setTotalRemaining(totalSec)
            setStatus('running')
          }} style={{
            flex: 1, padding: '14px 0', borderRadius: 'var(--r-lg)',
            background: 'var(--c-surface3)', border: '1px solid var(--c-border)',
            color: 'var(--c-text-secondary)', fontSize: 'var(--fs-base)', fontWeight: 600,
            cursor: 'pointer',
          }}>
            Opnieuw
          </button>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px 0', borderRadius: 'var(--r-lg)',
            background: 'var(--g-accent)', border: 'none',
            color: '#fff', fontSize: 'var(--fs-base)', fontWeight: 700,
            cursor: 'pointer', boxShadow: 'var(--sh-accent)',
          }}>
            Klaar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--c-bg)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'calc(var(--safe-top) + 16px) 20px 12px',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', fontWeight: 500 }}>
            {exercise.title}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-subtle)', marginTop: 2 }}>
            Ronde {cycleCount} van {cycles}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {formatTime(totalRemaining)}
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 'var(--r-full)',
            background: 'var(--c-surface2)', border: '1px solid var(--c-border)',
            color: 'var(--c-text-muted)', cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            ×
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
        gap: 0,
      }}>
        {/* Cue text */}
        <div style={{
          fontSize: 'var(--fs-md)', color: 'var(--c-text-secondary)', fontWeight: 500,
          textAlign: 'center', marginBottom: 12, minHeight: 28,
          transition: 'opacity 400ms ease',
        }}>
          {currentPhase.cue}
        </div>

        {/* Phase label */}
        <div style={{
          fontSize: 'var(--fs-3xl)', fontWeight: 800, color: 'var(--c-text-primary)',
          textAlign: 'center', marginBottom: 8,
          letterSpacing: '-0.02em',
        }}>
          {currentPhase.name}
        </div>

        {/* Timer */}
        <div style={{
          fontSize: 'var(--fs-2xl)', fontWeight: 700, color: '#6896c8',
          fontVariantNumeric: 'tabular-nums', marginBottom: 32,
        }}>
          {phaseRemaining}
        </div>

        {/* Animation */}
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <BreathingAnimation
            exercise={exercise}
            phase={currentPhase}
            progress={progress}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Support text */}
        <div style={{
          fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)',
          textAlign: 'center', marginBottom: 28, minHeight: 20,
          lineHeight: 1.5,
        }}>
          {currentPhase.supportText}
        </div>

        {/* Phase dots */}
        <PhaseDots phases={exercise.phases} currentIndex={phaseIdx} />
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 16,
        padding: '16px 24px calc(var(--safe-bottom) + 24px)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setStatus(s => s === 'paused' ? 'running' : 'paused')}
          style={{
            width: 64, height: 64, borderRadius: 'var(--r-full)',
            background: 'var(--g-accent)', border: 'none',
            color: '#fff', cursor: 'pointer', fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--sh-accent)',
          }}
        >
          {status === 'paused' ? '▶' : '⏸'}
        </button>
        <button
          onClick={() => {
            phaseIdxRef.current = 0
            phaseRemRef.current = exercise.phases[0].duration
            cycleRef.current = 1
            totalRemRef.current = totalSec
            setPhaseIdx(0)
            setPhaseRemaining(exercise.phases[0].duration)
            setCycleCount(1)
            setTotalRemaining(totalSec)
            setStatus('running')
          }}
          style={{
            width: 64, height: 64, borderRadius: 'var(--r-full)',
            background: 'var(--c-surface2)', border: '1px solid var(--c-border)',
            color: 'var(--c-text-secondary)', cursor: 'pointer', fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ↺
        </button>
      </div>

      {/* Paused overlay */}
      {status === 'paused' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15,26,46,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
        }}>
          <div style={{
            background: 'var(--c-surface)', border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-2xl)', padding: '32px 40px',
            textAlign: 'center', boxShadow: 'var(--sh-xl)',
          }}>
            <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 8 }}>
              Gepauzeerd
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)', marginBottom: 24 }}>
              Druk op het afspeelknopje om verder te gaan
            </div>
            <button onClick={() => setStatus('running')} style={{
              padding: '12px 32px', borderRadius: 'var(--r-lg)',
              background: 'var(--g-accent)', border: 'none',
              color: '#fff', fontSize: 'var(--fs-base)', fontWeight: 700,
              cursor: 'pointer',
            }}>
              Verdergaan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Exercise card ────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, onStart }: {
  exercise: BreathExercise
  onStart: (ex: BreathExercise) => void
}) {
  const [fav, setFav] = useState(() => localStorage.getItem(getFavKey(exercise.id)) === '1')
  const catColor = CAT_COLORS[exercise.category]
  const evidColor = EVIDENCE_COLORS[exercise.evidenceLabel]

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !fav
    setFav(next)
    if (next) localStorage.setItem(getFavKey(exercise.id), '1')
    else localStorage.removeItem(getFavKey(exercise.id))
  }

  return (
    <div style={{
      background: 'var(--g-card)', border: '1px solid var(--c-border)',
      borderRadius: 'var(--r-xl)', overflow: 'hidden',
      marginBottom: 12,
    }}>
      <div style={{ padding: '16px 16px 0' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            <span style={{
              fontSize: 'var(--fs-xs)', fontWeight: 600,
              background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}`,
              borderRadius: 'var(--r-full)', padding: '2px 9px',
            }}>{exercise.category}</span>
            <span style={{
              fontSize: 'var(--fs-xs)', fontWeight: 500,
              background: 'var(--c-surface3)', color: 'var(--c-text-muted)',
              borderRadius: 'var(--r-full)', padding: '2px 9px',
            }}>{exercise.level}</span>
            <span style={{
              fontSize: 'var(--fs-xs)', fontWeight: 500,
              background: evidColor.bg, color: evidColor.text,
              borderRadius: 'var(--r-full)', padding: '2px 9px',
            }}>{exercise.evidenceLabel}</span>
          </div>
          <button onClick={toggleFav} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, marginLeft: 8, marginTop: -2,
            color: fav ? '#d4a050' : 'var(--c-text-subtle)',
            flexShrink: 0,
          }}>
            {fav ? '★' : '☆'}
          </button>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'var(--fs-md)', fontWeight: 700, color: 'var(--c-text-primary)',
          marginBottom: 6,
        }}>
          {exercise.title}
        </h3>

        {/* Intent */}
        <p style={{
          fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)', lineHeight: 1.6,
          marginBottom: 14,
        }}>
          {exercise.intent}
        </p>
      </div>

      {/* Bottom section */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderTop: '1px solid var(--c-border)',
        background: 'rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MiniPreview type={exercise.sceneType} />
          <div style={{ display: 'flex', gap: 6 }}>
            {exercise.durationOptions.map(m => (
              <span key={m} style={{
                fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)',
                background: 'var(--c-surface3)', borderRadius: 'var(--r-full)',
                padding: '3px 9px', fontWeight: 500,
              }}>
                {m} min
              </span>
            ))}
          </div>
        </div>
        <button onClick={() => onStart(exercise)} style={{
          padding: '9px 20px', borderRadius: 'var(--r-full)',
          background: 'var(--g-accent)', border: 'none',
          color: '#fff', fontSize: 'var(--fs-sm)', fontWeight: 700,
          cursor: 'pointer', boxShadow: 'var(--sh-accent)',
        }}>
          Start
        </button>
      </div>
    </div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function Ademhaling() {
  const { state, updateSettings } = useApp()
  const { settings } = state

  const [stage, setStage] = useState<Stage>('library')
  const [selectedExercise, setSelectedExercise] = useState<BreathExercise | null>(null)
  const [selectedMinutes, setSelectedMinutes] = useState(5)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Alle')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const reducedMotion = settings.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(ex => {
      if (settings.beginnerMode && ex.level === 'Gevorderd') return false
      if (!settings.showAdvancedBreathing && ex.isAdvanced) return false
      if (categoryFilter !== 'Alle' && ex.category !== categoryFilter) return false
      return true
    })
  }, [settings.beginnerMode, settings.showAdvancedBreathing, categoryFilter])

  const handleSelectExercise = useCallback((ex: BreathExercise) => {
    setSelectedExercise(ex)
    setStage('pre')
  }, [])

  const handleStartFromPre = useCallback((minutes: number) => {
    setSelectedMinutes(minutes)
    setStage('countdown')
    setCountdown(3)
  }, [])

  // Countdown effect
  useEffect(() => {
    if (stage !== 'countdown') return
    if (countdown <= 0) {
      setStage('player')
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 900)
    return () => clearTimeout(t)
  }, [stage, countdown])

  const handleClose = useCallback(() => {
    setStage('library')
    setSelectedExercise(null)
  }, [])

  const CATEGORIES: CategoryFilter[] = ['Alle', 'Rustiger', 'Focus', 'Energie']

  return (
    <>
      {/* ── Library ── */}
      {stage === 'library' && (
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          background: 'var(--c-bg)',
        }}>
          {/* Header */}
          <div style={{
            padding: 'calc(var(--safe-top) + 20px) 20px 0',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h1 style={{
                fontSize: 'var(--fs-2xl)', fontWeight: 800,
                color: 'var(--c-text-primary)', letterSpacing: '-0.02em',
              }}>
                Ademhaling
              </h1>
              <button
                onClick={() => setSettingsOpen(true)}
                style={{
                  width: 40, height: 40, borderRadius: 'var(--r-full)',
                  background: 'var(--c-surface2)', border: '1px solid var(--c-border)',
                  color: 'var(--c-text-muted)', cursor: 'pointer', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ⚙
              </button>
            </div>

            {/* Category tabs */}
            <div style={{
              display: 'flex', gap: 8,
              overflowX: 'auto',
              paddingBottom: 16,
              scrollbarWidth: 'none',
            }}>
              {CATEGORIES.map(cat => {
                const active = categoryFilter === cat
                const color = cat !== 'Alle' ? CAT_COLORS[cat] : null
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      flexShrink: 0,
                      padding: '8px 18px', borderRadius: 'var(--r-full)',
                      fontSize: 'var(--fs-sm)', fontWeight: 600, cursor: 'pointer',
                      background: active
                        ? (color ? color.bg : 'var(--c-surface3)')
                        : 'transparent',
                      color: active
                        ? (color ? color.text : 'var(--c-text-primary)')
                        : 'var(--c-text-muted)',
                      border: active
                        ? `1px solid ${color ? color.border : 'var(--c-border2)'}`
                        : '1px solid transparent',
                      transition: 'all 200ms ease',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Exercise list */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '4px 20px',
            paddingBottom: 'calc(var(--nav-h) + var(--safe-bottom) + 16px)',
          }}>
            {filteredExercises.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 24px',
                color: 'var(--c-text-muted)', fontSize: 'var(--fs-sm)',
                lineHeight: 1.7,
              }}>
                <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>🌬</div>
                <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--c-text-secondary)' }}>
                  Geen oefeningen gevonden
                </div>
                Pas de filters of instellingen aan om meer te zien.
              </div>
            ) : (
              filteredExercises.map(ex => (
                <ExerciseCard key={ex.id} exercise={ex} onStart={handleSelectExercise} />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Pre-instruction sheet ── */}
      {stage === 'pre' && selectedExercise && (
        <>
          {/* Keep library visible underneath */}
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: 'var(--c-bg)',
          }}>
            <div style={{ padding: 'calc(var(--safe-top) + 20px) 20px 0' }}>
              <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--c-text-primary)', letterSpacing: '-0.02em' }}>
                Ademhaling
              </h1>
            </div>
          </div>
          <PreSheet
            exercise={selectedExercise}
            onCancel={() => setStage('library')}
            onStart={handleStartFromPre}
          />
        </>
      )}

      {/* ── Countdown ── */}
      {stage === 'countdown' && countdown > 0 && (
        <CountdownOverlay count={countdown} />
      )}

      {/* ── Player ── */}
      {stage === 'player' && selectedExercise && (
        <ActivePlayer
          exercise={selectedExercise}
          totalMinutes={selectedMinutes}
          reducedMotion={reducedMotion}
          onClose={handleClose}
        />
      )}

      {/* ── Settings ── */}
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
