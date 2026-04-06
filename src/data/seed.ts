import { format, addDays } from 'date-fns'
import {
  savePlannerItem, saveRememberItem, savePlaceItem,
  saveJournalEntry, saveMedication
} from '../db'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function seedDemoData() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
  const now = Date.now()

  // Planner seed
  const plannerSeed = [
    { slotKey: '07:00', iconId: 'ontbijt', label: 'Ontbijt', duration: 30 },
    { slotKey: '07:30', iconId: 'tandenpoetsen', label: 'Tanden poetsen', duration: 10 },
    { slotKey: '08:00', iconId: 'medicatie', label: 'Medicatie', duration: 10 },
    { slotKey: '09:00', iconId: 'werk', label: 'Werken', duration: 120 },
    { slotKey: '11:00', iconId: 'water', label: 'Water drinken', duration: 5 },
    { slotKey: '12:00', iconId: 'lunch', label: 'Lunch', duration: 30 },
    { slotKey: '13:00', iconId: 'wandelen', label: 'Korte wandeling', duration: 20 },
    { slotKey: '14:00', iconId: 'werk', label: 'Focus blok', duration: 90 },
    { slotKey: '16:00', iconId: 'rust', label: 'Rustpauze', duration: 20 },
    { slotKey: '18:00', iconId: 'diner', label: 'Avondeten', duration: 45 },
    { slotKey: '20:00', iconId: 'boek', label: 'Lezen', duration: 30 },
    { slotKey: '21:30', iconId: 'slapen', label: 'Voorbereiden slaap', duration: 30 },
  ]

  for (const p of plannerSeed) {
    await savePlannerItem({ id: uid(), date: today, completed: false, color: undefined, notes: '', createdAt: now, updatedAt: now, ...p })
  }

  // Tomorrow seed
  await savePlannerItem({ id: uid(), date: tomorrow, slotKey: '07:00', iconId: 'ontbijt', label: 'Ontbijt', duration: 30, completed: false, createdAt: now, updatedAt: now })
  await savePlannerItem({ id: uid(), date: tomorrow, slotKey: '10:00', iconId: 'boodschappen', label: 'Boodschappen', duration: 45, completed: false, createdAt: now, updatedAt: now })

  // Remember seed
  const rememberSeed = [
    { text: 'Brief in brievenbus doen', urgency: 'normaal' as const, category: 'Administratie', done: false, pinned: false },
    { text: 'Medicatie bijbestellen', urgency: 'hoog' as const, category: 'Gezondheid', done: false, pinned: true },
    { text: 'Bellen met huisarts voor herhaalrecept', urgency: 'normaal' as const, category: 'Gezondheid', done: false, pinned: false },
    { text: 'Sleutels aan sleutelhaken hangen', urgency: 'laag' as const, category: 'Thuis', done: true, pinned: false },
    { text: 'Wasmachine aanzetten', urgency: 'normaal' as const, category: 'Thuis', done: false, pinned: false },
  ]

  for (const r of rememberSeed) {
    await saveRememberItem({ id: uid(), createdAt: now, updatedAt: now, ...r })
  }

  // Places seed
  const placesSeed = [
    { title: 'Sleutels', room: 'Hal', subzone: 'Sleutelhaken', label: 'Voordeursleutels', notes: 'Hangen aan het haakje naast de deur', tags: ['sleutels', 'hal'] },
    { title: 'Portemonnee', room: 'Slaapkamer', subzone: 'Nachtkastje', label: 'Bruine portemonnee', notes: 'Rechtsboven in nachtkastje', tags: ['portemonnee'] },
    { title: 'Paspoort', room: 'Werkplek', subzone: 'Lade', label: 'Reisdocumenten', notes: 'In de bovenste lade van het bureau', tags: ['paspoort', 'documenten'] },
    { title: 'Oplader telefoon', room: 'Slaapkamer', subzone: 'Nachtkastje', label: 'USB-C oplader', notes: 'Linker stop van het stopcontact', tags: ['oplader', 'telefoon'] },
  ]

  for (const pl of placesSeed) {
    await savePlaceItem({ id: uid(), createdAt: now, updatedAt: now, imageData: undefined, ...pl })
  }

  // Journal seed
  await saveJournalEntry({
    id: uid(),
    date: today,
    type: 'geleid',
    mood: 3,
    energy: 3,
    stress: 2,
    wentWell: 'Ik heb mijn ochtendroutine goed gevolgd.',
    wasHard: 'Concentratie was lastig in de middag.',
    rememberTomorrow: 'Eerder beginnen met de moeilijke taak.',
    freeText: '',
    draft: false,
    createdAt: now,
    updatedAt: now
  })

  // Medication seed
  await saveMedication({
    id: uid(),
    name: 'Magnesium',
    dose: '1 pil',
    times: ['08:00'],
    taken: { [today]: [false] },
    notes: 'Bij het ontbijt met een glas water',
    refillDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    createdAt: now,
    updatedAt: now
  })

  await saveMedication({
    id: uid(),
    name: 'Omega-3',
    dose: '1 capsule',
    times: ['08:00'],
    taken: { [today]: [false] },
    notes: 'Bij het ontbijt',
    createdAt: now,
    updatedAt: now
  })
}
