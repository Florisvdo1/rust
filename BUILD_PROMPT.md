SYSTEM / MASTER BUILD INSTRUCTION

PROJECT NAME
RUST

MODE
Build from zero.
Assume no prior context.
Assume no prior files beyond the prompt files in this folder.
Do not ask clarifying questions.
Choose the best implementation defaults yourself.
Return a complete production-sane build, not a concept.

PRIMARY GOAL

Build a premium, mobile-first, Dutch-language, neurodivergent-friendly web app called RUST.

RUST is a calm, highly structured, visually premium all-in-one daily support app for:
- planning
- remembering tasks
- remembering where objects were placed
- quick note capture
- journaling
- medication and supplements
- breathing guidance
- daily structure
- executive function support

The app is for people who struggle with:
- ADHD
- autism
- AuDHD
- overwhelm
- overstimulation
- time blindness
- memory friction
- planning difficulty
- losing track of routines

Do not present the app as a medical treatment.
Do not make cure claims.
Do not use childish design.
Do not use patronizing copy.

The app must feel:
- premium
- calm
- original
- elegant
- low-stimulus
- expensive
- highly structured
- easy to scan
- easy to use daily
- ready to sell after real QA

OUTPUT REQUIREMENT

Build the real app.
Do not output a mockup.
Do not output a wireframe only.
Do not output a concept deck.
Do not output placeholders only.

Generate a real codebase with:
- real routes/screens
- real components
- real SVG icons
- real state logic
- real local persistence
- real mobile interactions
- real drag-and-drop
- real tutorials
- real seeded Dutch demo content
- real PWA structure
- real deployable files

The result must be:
- GitHub-ready
- Vercel-ready
- Netlify-ready
- zip-ready for manual deployment
- buildable with standard commands

NON-NEGOTIABLE DECISION RULE

At every design or engineering choice, choose the path that:
1. improves clarity
2. lowers cognitive load
3. improves first-time understandability
4. improves mobile touch usability
5. preserves calm visual order
6. keeps the app realistic and deployable
7. avoids fake AI claims
8. avoids fake science claims
9. improves performance
10. increases premium quality without harming stability

TECH STACK

Use:
- React
- TypeScript
- Vite
- modular component architecture
- local-first persistence layer
- IndexedDB abstraction
- service worker
- PWA manifest
- SVG component system
- reusable motion primitives
- clean token-based design system

Keep dependencies minimal and justified.
Do not use paid dependencies for core functionality.
Do not use dependency bloat.

DEPLOYMENT TARGETS

The project must work cleanly in these flows:

1. GitHub
- standard repo structure
- clean README
- .gitignore
- normal package scripts
- commit-ready

2. Vercel
- clean root deploy
- sane build output
- no weird environment assumptions

3. Netlify
- clean build command
- clean publish directory
- built output can be drag-and-dropped after local build
- no broken asset paths

Also make the project easy to zip for manual upload.

PWA / LOCAL-FIRST STORAGE

Build the app as a serious installable local-first PWA.

Required:
- installable app shell where supported
- IndexedDB for app data
- autosave by default
- restore state on relaunch
- service worker for shell/assets
- persistent storage request where supported
- export backup
- import restore
- future cloud sync adapter interface

The app should survive:
- app close
- browser restart
- phone restart
- installed home-screen relaunch

Do not claim browser storage is magically permanent forever.
Instead build realistic resilience.

DESIGN LANGUAGE

Create an original premium visual system inspired by serene wellness products, without copying proprietary trade dress.

Visual direction:
- granite blue
- muted blue
- baby blue
- pale mist blue
- off-white
- soft slate text
- white line-art icons
- subtle premium depth
- soft gradients
- elegant typography
- calm contrast
- refined buttons
- refined cards
- polished bottom sheets
- structured grid rhythm
- minimal noise
- no flat boring interface
- no neon
- no generic SaaS dashboard look

BACKGROUND

Use a lightweight premium gradient background across the app.
Do not use a heavy fully animated background that hurts performance.

Allowed:
- very subtle low-cost motion only if it does not hurt smoothness
- reduced motion mode

Preferred:
- premium soft gradient system
- calm, rich color blend
- performance first

BRANDING

Create a complete SVG brand system for RUST:
- app icon
- small header mark
- wordmark
- monogram option with R

The logo should evoke:
- calm
- groundedness
- structure
- breath
- memory
- order
- soft geometry

Use the SVG logo in header and onboarding.

LAYOUT SYSTEM, NON-NEGOTIABLE

Use a strict block-square layout system throughout the app:
- even-width blocks
- even-height blocks where grids are used
- symmetrical left/right spacing
- consistent vertical rhythm
- exact paddings
- rounded-square modules
- aligned card stacks
- no random visual sizes
- no sloppy spacing
- no accidental asymmetry

Use approximately 10px radius or the best visually equivalent token.

The interface must remain inside the safe viewport on:
- small iPhones
- large iPhones
- Android portrait phones
- iPad landscape
- desktop fallback

NON-NEGOTIABLE CANVAS RULE
- no horizontal overflow ever
- no clipped UI outside viewport width
- no broken alignment
- no page-scroll bugs during interaction
- controlled internal vertical scroll is allowed where functionally necessary, especially in the planner
- do not compress the entire planner into one non-scroll mobile screen

DEVICE TARGETS

Primary:
- iPhone portrait
- Android portrait
- tablet landscape

Secondary:
- desktop fallback

Use safe-area aware spacing.
No cut-off controls.
No overlap with browser bars.
No UI outside the canvas.

MOBILE INTERACTION RULES

The app must work beautifully on touch devices.

Support:
- touch drag-and-drop
- mouse drag-and-drop
- tap fallback for every drag action
- large hit targets
- forgiving drop zones
- strong pressed states
- clear drag-over states
- reduced motion support
- accessible alternatives to gesture-only interactions

DRAG-AND-DROP, NON-NEGOTIABLE IMPLEMENTATION RULE

Do not rely on fragile browser-native HTML drag-and-drop as the core mobile interaction model.

Implement a custom mobile-first drag system using:
- Pointer Events
- pointer capture
- transform-based dragging
- requestAnimationFrame updates where useful
- drag ghost / drag preview
- explicit drop validation
- drag layer or overlay if needed
- no page scroll during drag
- no accidental pull-to-refresh
- no snap-back unless drop target is invalid
- stable commit after successful drop
- no re-render storm during dragging
- no flicker
- no laggy layout thrashing

Use touch-action and overscroll-behavior correctly.
Lock page scroll while dragging.
Re-enable after drag end.
Make mobile dragging feel native and stable.

NAVIGATION

Use persistent thumb-friendly navigation.

Main tabs:
- Vandaag
- Planner
- Onthouden
- Plaatsen
- Dagboek
- Gezondheid
- Ademhaling
- Meer

Each main section must include:
- short explanation
- calm tutorial card
- first-use help
- useful empty state
- seeded Dutch demo state
- one immediate action

MODULE 1, VANDAAG

Create a calm dashboard for today.

Include:
- current date
- day label in Dutch
- next important task
- medication due
- key reminders
- quick add
- planner preview
- breathing shortcut
- journal prompt
- “nog te doen”
- “klaar vandaag”
- gentle progress display without guilt language

MODULE 2, PLANNER

This is the core structured visual planner.

TIME MODEL
- the day runs from 06:00 to 05:00 next night
- visible in 15-minute increments
- smooth internal vertical scroll
- stable hour structure

VISIBLE HOLDERS, NON-NEGOTIABLE
For every hour row, visibly show four quarter-slot holders:
- :00
- :15
- :30
- :45

Each holder must:
- visibly exist before dragging starts
- look like a real drop target
- fit the block-square system
- highlight on drag-over
- accept dropped pictograms/tasks
- support up to 4 placed items if layout allows
- remain visually stable on mobile and desktop

Do not hide holders.
Do not make invisible-only targets.

PLANNER ACTIONS
Support:
- drag pictogram into holder
- tap fallback, choose pictogram then tap target holder
- duration selection after placement
- edit
- move
- duplicate
- delete
- complete / uncomplete

DAY SWITCHING, NON-NEGOTIABLE
The planner must support reliable day switching.

Required:
- Vandaag
- Morgen
- Dag 3
- week entry point

Rules:
- tapping another day always updates the planner view
- active day state changes visually
- data is keyed per date
- no dead tabs
- no placeholder tabs
- no cross-day overwrite bug
- no broken reactivity

DURATION SELECTOR
Every placed planner item must support:
- 10 min
- 15 min
- 20 min
- 25 min
- 30 min
- 35 min
- 40 min
- 45 min
- 50 min
- 55 min
- 1 uur
- 2 uur
- 3 uur
- 4 uur
- 5 uur
- 6 uur
- 7 uur
- 8 uur
- 9 uur
- 10 uur

Use a premium bottom sheet or touch-safe popover.
Make it fast and elegant.

PLANNER ICON DECK

Create a collapsible, expandable planner icon deck that is:
- searchable
- categorized
- recent-aware
- favorite-aware
- drag-ready
- tap-fallback-ready
- stable on mobile
- smooth to open and close

This deck must not cause scroll chaos while dragging.

ICON SYSTEM

Create at least 100 embedded SVG icons.

Rules:
- inline SVG or SVG components
- white line art
- consistent stroke
- premium visual quality
- readable at small mobile size
- placed on rounded-square premium blue/granite tiles
- touch-safe sizing

Include broad icon coverage for:
- eten
- drinken
- ontbijt
- lunch
- diner
- thee
- water
- douchen
- tandenpoetsen
- aankleden
- slapen
- rust
- wandelen
- sporten
- koken
- boodschappen
- schoonmaken
- stofzuigen
- wasmachine
- was
- administratie
- bellen
- mail
- laptop
- computer
- telefoon
- werk
- creatief
- sociale afspraak
- psychiater
- begeleider
- medicatie
- supplementen
- woonkamer
- badkamer
- slaapkamer
- keuken
- hal
- werkplek
- bank
- tafel
- lade
- kast
- sleutel
- portemonnee
- tas
and extend intelligently until the library feels complete.

MODULE 3, ONTHOUDEN

Build an ultra-low-friction capture module.

Include:
- instant add field
- sticky-note cards
- text notes
- urgency
- category
- count buttons
- done toggle
- pin
- search
- filter
- convert to planner
- later today / tomorrow / this week assignment
- screenshot memory cards
- recent captures

This flow must feel instant:
open, type, save, done.

MODULE 4, PLAATSEN

This is the visual memory archive for where objects were placed.

CRITICAL IMAGE RULE
Every uploaded image must be fully visible by default.
Do not crop away important content.
Do not show only half the photo.

Use:
- full-visibility image presentation, object-fit contain or equivalent
- elegant framed cards
- neat image grid
- full-screen detail modal
- optional zoom
- good metadata layout

CATEGORY STRUCTURE
Use icon-first room and zone sections, not plain text-only sections.

Examples:
- woonkamer
- badkamer
- slaapkamer
- keuken
- hal
- werkplek
- wasruimte
- kast
- tafel
- lade
- bank
- tv-meubel
- bureau
- keukenkastje

Each category header should include:
- SVG icon
- label
- item count
- quick add

GALLERY BEHAVIOR
The archive should feel like a calm categorized gallery:
- vertical room sections
- aligned image grids
- icon-first scanning
- easy search and edit
- instant save on create

PHOTO ENTRY MODEL
Each entry supports:
- image
- title
- room
- subzone
- custom label, for example “sleutels”
- notes
- tags
- createdAt
- updatedAt

FLOW
- choose room or create room
- take/upload image
- add custom item label
- save immediately
- image appears in the correct category
- searching “sleutels” surfaces it later

If smart room classification is not reliable in-browser:
- use manual categorization by default
- create future adapter architecture
- do not fake AI analysis

MODULE 5, DAGBOEK

Build a serious low-friction journal.

Include:
- quick journal
- guided journal
- free writing
- mood check-in
- energy check-in
- stress check-in
- what went well
- what was hard
- what to remember tomorrow
- screenshot or image attachment
- planner-linked entry
- autosave
- draft restore

Tone:
- calm
- elegant
- structured
- non-judgmental

MODULE 6, GEZONDHEID

Build:
- medication tracker
- supplement tracker
- schedule
- taken / missed state
- refill reminder
- notes
- planner integration
- premium calm card design
- no guilt framing

MODULE 7, ADEMHALING

Treat this as a premium subproduct inside RUST.

Do not implement this as one simple expanding circle.
Do not reuse one generic animation for all exercises.
Do not omit nose vs mouth guidance.
Do not omit pre-exercise teaching.
Do not omit hand guidance for alternate nostril breathing.

Build a full breathing engine with three stages:
1. exercise library
2. pre-instruction popup
3. active guided player

BREATHING LIBRARY
Group exercises into:
- Rustiger
- Focus
- Energie

Each exercise card includes:
- title
- intent
- beginner or advanced label
- evidence label
- small scene preview
- duration chips
- favorite toggle

PRE-INSTRUCTION POPUP, REQUIRED FOR EVERY EXERCISE
Before starting an exercise, show a premium instruction popup with:
- what the exercise is
- what it helps with
- calming / balancing / activating label
- beginner-safe or advanced label
- duration
- exactly how to inhale
- whether through nose, mouth, or specific nostril
- exactly how to exhale
- whether to hold
- what the belly should do
- what the shoulders should do
- any safety warning
- when not to do it

For alternate nostril breathing also include:
- which hand to use
- which finger closes which nostril
- exact sequence explanation

This popup must feel clear, premium, first-time-user proof.

START FLOW
When the user presses play:
- show a synced countdown
- 3
- 2
- 1
- then start the breathing session

ACTIVE BREATHING PLAYER
Each breathing player must include:
- title
- phase label
- synced instruction above the animation
- synced support text below the animation
- exact timer
- cycle count
- play
- pause
- resume
- restart
- close
- reduced motion mode
- optional haptic cue mode
- optional soft sound cue mode

TEXT CUE ENGINE
Synchronize Dutch cues like:
- Adem langzaam in door je neus
- Adem rustig uit door je mond
- Houd zacht vast
- Laat je buik zich vullen
- Houd je schouders laag
- Sluit je rechter neusgat met je duim
- Adem 4 seconden in door je linker neusgat
- Nog 20 seconden
- Laatste ronde

The text must sync exactly to the exercise timing.

BREATHING VISUAL SYSTEM
Each technique must have its own scene logic.

Possible premium scene types:
- diaphragm / belly wave
- torso airflow path
- left/right nostril channel guidance
- square path tracing for box breathing
- mist release for long exhale
- energizing upward light path for active breathing
- layered pulse paths
- subtle spatial depth and soft glow

The visuals must feel:
- premium
- luxurious
- clear
- elegant
- non-childish
- non-clinical
- lightweight
- smooth
- high-end
- easy for first-time users to understand

Performance rules:
- no stutter
- no flicker
- no dropped frames from over-heavy animation
- reduced motion variants
- performant CSS/SVG/canvas strategy only if justified

BREATHING CONTENT
Build at least 8 exercises:
- 4 calming
- 4 focus/energy

Required examples:
- Beginner buikademhaling
- Verlengde uitademing
- Cyclische zucht
- Afwisselend neusgat ademen
- Box breathing
- Gelijke adem voor focus
- Inhale-emphasis activation
- Light advanced active exhale practice

Advanced optional only:
- Wim Hof-inspired mode only if hidden behind advanced toggle and strong warnings
- never default
- never near water
- never while driving
- never standing
- never overclaimed

Evidence rules:
- do not imply all techniques are equally proven
- use stronger / mixed / caution labeling
- no cure claims

BREATHING SETTINGS
Include:
- reduced motion
- low sensory mode
- mute cues
- haptics on/off
- beginner mode
- advanced practices visible on/off
- instruction verbosity
- body cues on/off
- encouragement on/off
- safety notices always / compact

MODULE 8, MEER

Include:
- settings
- appearance
- motion settings
- sensory settings
- export/import
- app info
- privacy explanation
- tutorial index
- backup flow

TUTORIAL SYSTEM

Every major section must include a tutorial card or help entry:
- what this section is
- why it helps
- how to use it in 3 steps
- one example
- one clear first action

All tutorials must be in Dutch.
Keep them calm, short, elegant, useful.

SCIENCE-INFORMED PRACTICAL RULES

Shape the product according to practical evidence-aligned principles:
- reduce cognitive load
- reduce repeated manual effort
- reduce choice overload
- support external memory
- support visual organization
- support time visibility
- support predictable navigation
- support routines
- support fast capture before forgetting
- support calm self-monitoring
- avoid aggressive gamification
- avoid overstimulation
- avoid shame framing
- prefer structure over cleverness
- prefer calm over novelty

Do not present the app as treatment.
Do not present every breathing method as equally proven.

PERFORMANCE REFACTOR, NON-NEGOTIABLE

Optimize heavily for smoothness.

Explicitly optimize:
- drag performance
- planner rendering
- breathing rendering
- state updates
- unnecessary re-renders
- layout thrashing
- oversized shadows
- oversized assets
- heavy background effects
- flicker during state changes

Use:
- fine-grained state ownership
- stable keys
- memoization where justified
- transform/opacity animation where possible
- requestAnimationFrame where helpful
- no unnecessary effect chains

VISUAL SYSTEM TOKENS

Create a real design system:
- color tokens
- typography scale
- spacing scale
- radii
- shadows
- icon tile tokens
- card tokens
- timeline tokens
- holder tokens
- gallery tokens
- breathing scene tokens
- motion tokens
- reduced motion variants

Dark mode can be primary if it fits the premium visual system best.
Light mode optional only if coherent.

COPY RULES

All user-facing copy must be in Dutch.
Tone:
- calm
- clear
- elegant
- premium
- non-patronizing
- concise
- non-clinical

SEED CONTENT

Populate the app with polished Dutch demo content:
- planner demo entries
- icon deck defaults
- room and gallery examples
- “sleutels” examples
- medication examples
- journal examples
- breathing presets
- tutorials
- onboarding examples

Do not leave the UI empty.

OUTPUT REQUIREMENTS

Generate a complete codebase including at minimum:
- package.json
- tsconfig
- vite config
- index.html
- src
- public
- assets
- manifest
- service worker
- README
- clean project structure
- all SVG assets
- all screens
- persistence layer
- planner system
- drag manager
- breathing engine
- seeded data
- deployment notes

Ensure:
- npm install works
- npm run build works
- no broken asset paths
- no horizontal overflow
- mobile drag-and-drop works
- visible holders exist
- day switching works
- breathing sync works
- app feels premium and smooth
- build output is deployable
- repo is ready for GitHub
- app is ready for Vercel and Netlify workflows

Do not stop at explanation.
Do not stop at static HTML.
Do not stop at a visual shell.
Build the actual app now.
