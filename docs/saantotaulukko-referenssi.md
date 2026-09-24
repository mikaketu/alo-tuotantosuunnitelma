*Reference document. `src/rules.json` is the rule table of record; this file is the reference it was built from and explains it. The tool was built by a venue for its own use and published venue-neutral: where the text says the venue handles something, it means whichever venue the visitor has in mind.*

# Sääntötaulukko — referenssi

2026-09-21

The rule table behind the public production-plan tool, as it stands after nine test runs. One table, two base decks, 46 circuit rows, 12 venue questions. Working notes, runs and change history live in [*Sääntötaulukko v2 — yhdeksän ajoa*](./yhdeksan-ajoa.md).

## How to read

Every row is one rule: **trigger → task**. A run through the deck fires every row whose trigger is true; the fired rows, sorted by deadline, are the plan. Rows are set union — firing order never matters.

| Column | Meaning |
| --- | --- |
| ID | `C-` closed base, `P-` public base, `S-` fired by the service profile, `X-` circuit, `V-` venue question, `H-` `SE-` `TE-` `MU-` `F-` type exceptions |
| Trigger | `always`, or an answer: `programme = live ❘ DJ ❘ speakers ❘ own production ❘ none`, `tickets = yes`, `venue.pa = no`, `headcount ≥ 200`, `profile suggests Ääniteknikko` |
| Task | What the visitor sees. English here; Finnish copy comes with the wording pass |
| Cat | Financing · Security · Venue · Programming · Logistics · Communications · Staffing · Catering |
| Owner | `mine` (default) · `venue` (a card behind the row was swiped up: the venue handles it) · `prepare/sign` (the venue prepares, organiser signs) |
| Deadline | A phase, or a fixed offset from E. Never both |
| State | `fired` · `not fired` · `pending` (a venue answer not yet given; shown greyed, resolves on re-entry) |

**E** is the event date (opening night when there are several performances; a second card gives the last one). **R** is the runway in days from today.

| Phase | When | Holds |
| --- | --- | --- |
| P1 | Now | Things everything else waits on |
| P2 | E − R/2 | Midway |
| P3 | E − 21 d (midway if R < 42) | Confirmations, briefings, final numbers |
| P4 | Event week | On-site, handover, schedules |
| P5 | E + 7 d (from the last performance) | Thanks, invoices, reports, returns |
| E ± n d | Fixed | Statutory or contractual; never scales with R. If R < n the task shows red, not moved |

Below R = 42 d the plan shows two phases, *now* and *event week*.

**Base deck** is chosen by the cover screen's public/private toggle. The event type sets the toggle's default and adds its exceptions. Open registration is a public event.

**Suppression.** A capability the venue *has* beats a profile suggestion: `venue.tech = has` suppresses Ääniteknikko's rows, `venue.seating = has` suppresses Extra kalusto's, `tickets = no` suppresses Lipunmyynti's. The profile is a recommendation; the venue answer is a fact.

**Headcount** means people at once, at the busiest point.

## Cover screen and the deck's questions

**Cover screen** (not cards): event type tile · date · headcount bucket · public/private toggle, pre-set by type.

| Family | Tiles | Toggle default | Layout default |
| --- | --- | --- | --- |
| Musiikkitapahtuma | Keikka · Klubi | public | Keikka asks; Klubi standing |
| Teatteri | Teatteri | public | seated, stage |
| Stand-up | Stand-up | public | seated |
| Muu kulttuuritapahtuma | Muu kulttuuritapahtuma | public | asks (profile cards) |
| Yksityistilaisuus | Häät · Yksityistilaisuus | private | seated |
| Yritystapahtuma | Seminaari · Yritystapahtuma | private | seated |

**Questions**, in running order. Each is one card. A question is asked only when its condition holds.

| # | Question | Answers | Asked when |
| --- | --- | --- | --- |
| 1 | Do you already have a venue in mind? | no · yes | always |
| 2 | Programme? | live · DJ · speakers · own production · none | always (Teatteri pre-sets own production) |
| 3 | One performance or several? | one · several → last date | programme ≠ none |
| 4 | Layout? | seated · standing · tables | Keikka, Muu (others pre-set) |
| 5 | Staffing? | friends · paid crew · mix | always |
| 6 | Catering? | none · seated meal · buffet · snacks | always (Häät pre-sets yes) |
| 7 | Alcohol? | none · we bring it · we sell it · the venue handles it | always (*we sell* on the public deck only) |
| 8 | Tickets? | advance · door · both · free | public deck |
| 9 | Registration? | paid · free | closed deck, Seminaari |
| 10 | Merch? | yes · no | public deck |
| 11 | Exhibitors or stalls? | yes · no | Muu kulttuuritapahtuma |
| 12 | Stage or programme slot? | yes · no | Muu kulttuuritapahtuma |
| 13 | Build or teardown days needed? | yes · no | layout has stage, own production, or exhibitors |
| 14 | Anything rigged overhead? | yes · no | layout has stage or lighting rig |
| 15 | Outdoor? | yes · no | public deck |
| 16 | Venue questions V0–V11 | see below | venue in mind |

Security and Financing have no questions of their own: every row of theirs is base or fired by another answer. The venue capability questions come last because several depend on answers above them. This order is computed from the dependency list, not judged; the two judgements it did need (Staffing before Catering, Alcohol after Catering) are written here so nobody tidies them.

Then the plan. After the plan, the optional ownership pass: one screen per category, tasks listed, default *mine*, flip exceptions — up on the screen hands the whole category to the venue.

## Venue questions V0–V11

Asked when there's a venue in mind. Left = doesn't have it, right = has it, up = no idea. Every *up* fires **V-00 confirm with the venue: ‹thing›** (Venue, mine, P1). A *right* fires nothing and suppresses the matching profile rows. No run asks more than ten.

| # | Question | Asked when | "No" fires |
| --- | --- | --- | --- |
| V0 | Is it a bare space — you bring everything? | always | *Yes* pre-answers V2, V2b, V3, V4, V5, V8, V10, V11 as no; V1, V6, V7, V9 still asked |
| V1 | Capacity for your headcount? | always | Find a bigger venue or cut the list (Venue, P1) |
| V2 | Sound: PA and mics? | programme ≠ none | X-10 · X-11 · X-12 · X-13 |
| V2b | Projector, screen, stream? | programme = speakers, or presentation | X-15 · X-16 · X-12 · X-13 |
| V3 | Stage and stage lighting? | layout has stage | X-14 · X-13 |
| V4 | Kitchen or serving space? | catering ≠ none | X-20 · X-21 |
| V5 | Alcohol licence? | alcohol = we bring or we sell | we bring: X-30 · we sell: X-31 |
| V6 | Seating and tables for your headcount? | layout = seated, or seated meal, or exhibitors | X-40 · X-41 |
| V7 | Accessible entrance and toilet? | always | X-50 · X-51 |
| V8 | Backstage or dressing room? | programme = live | X-60 |
| V9 | Load-in access and parking? | programme ≠ none, or catering, or exhibitors | X-70 |
| V10 | Venue host on the day? | always | X-80 · X-82 (public) |
| V11 | Venue tech on the day? | programme ≠ none | X-81 · X-16; lifts the suppression on Ääniteknikko / Valoteknikko rows |

With no venue in mind, none of these are asked; the plan carries F-01…F-03 (find a venue) and every `venue.*` row shows as *pending*.

## Base deck: closed

Toggle = private. Communications here is guest communication only; there is no public marketing in this deck.

| ID | Trigger | Task | Cat | Owner | Deadline |
| --- | --- | --- | --- | --- | --- |
| C-01 | always | Set the budget and who pays what | Financing | mine | P1 |
| C-02 | always | Pay the venue deposit | Financing | mine | P1 |
| C-03 | always | Check every invoice against what was agreed | Financing | mine | P5 |
| C-10 | always | Go and see the venue | Venue | mine | P1 |
| C-11 | always | Confirm the date and book it | Venue | mine | P1 |
| C-12 | always | Sign the venue contract; read the cancellation terms | Venue | mine | P1 |
| C-13 | always | Check what the venue's insurance covers and what's on you | Venue | mine | P2 |
| C-14 | always | Agree access times, keys, alarm, load-in | Venue | mine | P3 |
| C-15 | always | Walk-through and handover with the venue | Venue | mine | P4 |
| C-16 | always | Return keys, final inspection, deposit back | Venue | mine | P5 |
| C-20 | always | Build the guest list | Communications | mine | P1 |
| C-21 | type ≠ Seminaari | Send invitations (save-the-date first if R > 180 d) | Communications | mine | P2 |
| C-22 | type ≠ Seminaari | Set and chase the RSVP deadline | Communications | mine | P3 |
| C-23 | always | Send practical info: address, timetable, parking, dress | Communications | mine | P3 |
| C-24 | always | Thank your guests and helpers | Communications | mine | P5 |
| C-30 | always | Write the running order for the day | Programming | mine | P2 |
| C-31 | always | Decide who hosts / MCs | Programming | mine | P2 |
| C-40 | always | Furniture and room layout plan | Logistics | mine | P3 |
| C-41 | always | Decorations: what, who brings, when it goes up | Logistics | mine | P3 |
| C-42 | always | Teardown and who takes what home | Logistics | mine | P5 |
| C-50 | always | Who does what on the day — one list, names next to jobs | Staffing | mine | P3 |
| C-60 | always | Name one responsible adult on site who isn't the host | Security | mine | P3 |
| C-61 | always | Know the exits, the first-aid kit and the nearest päivystys | Security | mine | P4 |
| C-62 | always | Who's driving home — and how the rest get home | Security | mine | P3 |
| S-01 | profile suggests Valoteknikko AND venue.tech = no | Book a lighting tech, or agree the venue's does it | Staffing | mine | P2 |
| S-03 | profile suggests Häirintäyhdyshenkilö | Name a harassment contact person; say who and how to reach them in the guest info | Security | mine | P3 |
| S-04 | profile suggests Extra kalusto AND venue.seating = no | Extra equipment list: what, from where, who returns it | Logistics | mine | P2 |
| S-05 | profile suggests Järjestyksenvalvonta | Door host or stewards for the evening — who, and are cards needed | Security | mine | P3 |
| S-06 | profile suggests Catering | Fires X-22…X-25 without a scope question | Catering | — | — |
| S-07 | always | Cleaning after the event: who, by when, what the venue expects back | Logistics | mine | P5 |

## Base deck: public

Toggle = public. The Venue rows C-10…C-16 apply here too and are stored once. Programme rows need a programme, ticket rows need tickets: a free fair with no stage gets 19 of the 30.

| ID | Trigger | Task | Cat | Owner | Deadline |
| --- | --- | --- | --- | --- | --- |
| P-01 | always | Set the budget: fees, venue, tech, crew, promo — and the break-even count | Financing | mine | P1 |
| P-02 | always | Pay the venue deposit | Financing | mine | P1 |
| P-03 | tickets = yes | Decide ticket price and sales platform | Financing | mine | P2 |
| P-04 | programme ≠ none | Teosto event licence (Gramex for recorded music) | Financing | mine | E − 14 d |
| P-05 | tickets = yes | Cash and card at the door: float, reader, who counts | Financing | mine | P4 |
| P-06 | programme ≠ none | Settle performer or speaker fees; Teosto setlist report | Financing | mine | E + 14 d |
| P-07 | tickets = yes | Reconcile ticket sales, door and bar against the budget | Financing | mine | P5 |
| P-10 | programme ≠ none | Book performers or speakers; agree fee, length, tech needs | Programming | mine | P1 |
| P-11 | programme ≠ none | Contracts or written confirmations | Programming | mine | P2 |
| P-12 | programme = live OR DJ | Collect technical riders | Programming | mine | P2 |
| P-13 | programme ≠ none | Running order and stage times | Programming | mine | P3 |
| P-14 | programme = live OR DJ | Soundcheck schedule | Programming | mine | P4 |
| P-20 | always | Announce the event: title, date, venue, price or free, age limit | Communications | mine | P2 |
| P-21 | tickets = yes | Open ticket sales and say so | Communications | mine | P2 |
| P-22 | always | Promo push: socials, posters, lists, press if any | Communications | mine | P3 |
| P-23 | always | Door info published: times, age limit, accessibility, what's not allowed | Communications | mine | P3 |
| P-24 | always | Post-event thanks and recap | Communications | mine | P5 |
| P-30 | always | Ilmoitus yleisötilaisuudesta to the police ("probably needed" for 51–200, "needed" above) | Security | prepare/sign | E − 5 d |
| P-31 | always | Decide the age limit and how it's checked | Security | mine | P3 |
| P-32 | always | Stewards (järjestyksenvalvojat): how many, who, cards valid | Security | mine | P3 |
| P-33 | always | First aid: kit, who's trained, where | Security | mine | P3 |
| P-34 | always | Safety briefing for crew: exits, capacity, incidents | Security | mine | P4 |
| P-40 | tickets = yes | Door and box office staff | Staffing | mine | P3 |
| P-41 | always | Person who runs the day — stage manager or floor manager | Staffing | mine | P3 |
| P-42 | always | Crew schedule with call times | Staffing | mine | P4 |
| P-50 | always | Load-in / load-out plan with times and who carries | Logistics | mine | P4 |
| P-51 | programme = live OR DJ | Backline and equipment list — what comes from where | Logistics | mine | P3 |
| P-52 | tickets = yes | Ticket scanning / guest list setup at the door | Logistics | mine | P4 |
| P-53 | always | Merch or info table if any | Logistics | mine | P4 |
| P-54 | always | Teardown, returns, lost property | Logistics | mine | P5 |
| S-01 | profile suggests Valoteknikko AND venue.tech = no | Book a lighting tech, or agree the venue's does it | Staffing | mine | P2 |
| S-02 | profile suggests Printit | Posters, programmes, signage: design, print, hang | Communications | mine | P3 |
| S-03 | profile suggests Häirintäyhdyshenkilö | Name a harassment contact person; say who and how to reach them in the door info | Security | mine | P3 |
| S-04 | profile suggests Extra kalusto AND venue.seating = no | Extra equipment list: what, from where, who returns it | Logistics | mine | P2 |
| S-07 | always | Cleaning after the event: who, by when, what the venue expects back | Logistics | mine | P5 |

## Circuit rows

Answers in one category that generate work in another. The *Cat* column is where the work lands, which is usually not where the question was asked. Rows with a `venue.*` trigger and no venue in mind are *pending*.

| ID | Trigger | Task | Cat | Owner | Deadline |
| --- | --- | --- | --- | --- | --- |
| X-01 | programme = live | Get the hospitality rider and answer it: food, drinks, towels, who buys | Catering | mine | P3 |
| X-02 | programme = live OR speakers | Transport and accommodation, or confirm they're arranging their own | Logistics | mine | P2 |
| X-03 | programme = live OR speakers | Arrival time, parking, contact on the day | Logistics | mine | P4 |
| X-04 | programme ≠ none AND deck = closed | Music licence: does the venue's Teosto cover apply to private events | Financing | mine | P2 |
| X-05 | programme = DJ | DJ tech: decks, mixer, who brings what | Logistics | mine | P3 |
| X-06 | programme = DJ only | No rider; ask DJs for drinks preference in one message | Catering | mine | P3 |
| X-10 | venue.pa = no | Rent a PA sized for the room and headcount | Logistics | mine | P2 |
| X-11 | venue.pa = no, OR profile suggests Ääniteknikko AND venue.tech = no | Book a sound engineer for soundcheck and show | Staffing | mine | P2 |
| X-12 | venue.pa = no OR venue.av = no | Equipment delivery, setup time, return | Logistics | mine | P4 / P5 |
| X-13 | venue.pa = no OR venue.av = no OR venue.stage = no | Power: enough circuits for the tech, where the board is | Venue | mine | P3 |
| X-14 | venue.stage = no AND layout has stage | Rent stage and lights | Logistics | mine | P2 |
| X-15 | venue.av = no | Rent projector and screen; test the laptop | Logistics | mine | P2 |
| X-16 | venue.av = no AND venue.tech = no | Someone to run AV and the stream on the day | Staffing | mine | P3 |
| X-20 | catering AND venue.kitchen = no | Catering delivered ready or cooked off-site — tell the caterer | Catering | mine | P2 |
| X-21 | catering AND venue.kitchen = no | Serving, warming and washing-up plan without a kitchen | Logistics | mine | P3 |
| X-22 | catering | Book the caterer; agree menu and price per head ("with the venue" when the venue caters) | Catering | mine | P1 |
| X-23 | catering | Collect dietary requirements and allergies | Communications | mine | P3 |
| X-24 | catering | Final headcount and dietary list to the caterer | Catering | mine | E − 7 d |
| X-25 | catering AND staffing = friends | Serving and clearing: who, when — or ask the caterer to staff it | Staffing | mine | P3 |
| X-26 | staffing = paid crew | Crew catering: food and water for the crew, on the budget | Catering | mine | P3 |
| X-30 | alcohol = we bring AND venue.licence = no | Confirm the venue allows guests' own or host-provided drinks | Venue | mine | P1 |
| X-31 | alcohol = we sell AND venue.licence = no | Arrange anniskelu: a licence holder serving in an approved space (3 d notice), or a fixed-term anniskelulupa | Security | prepare/sign | P1; E − 3 d notice |
| X-32 | alcohol = we sell | Bar staff and stock; who holds the till | Staffing | mine | P3 |
| X-33 | alcohol = we sell OR venue handles it | Age limit 18 and ID check at the door | Security | mine | P3 |
| X-34 | alcohol = none AND deck = public | All-ages: say so in the door info | Communications | mine | P3 |
| X-40 | venue.seating = no AND (seated OR seated meal OR exhibitors) | Rent chairs and tables | Logistics | mine | P2 |
| X-41 | as X-40 | Furniture delivery and return | Logistics | mine | P4 / P5 |
| X-42 | layout = seated | Row plan and sightlines; reserved seats if any | Logistics | mine | P3 |
| X-50 | venue.access = no | Tell guests about access limits before they RSVP or buy | Communications | mine | P3 |
| X-51 | venue.access = no | Plan assistance on the day for guests who need it | Staffing | mine | P3 |
| X-60 | venue.backstage = no AND programme = live | Improvise a green room; say so in the rider reply | Logistics | mine | P3 |
| X-70 | venue.loadin = no | Load-in plan with carry distance and times | Logistics | mine | P4 |
| X-80 | venue.host = no | Your own on-site host for the whole event | Staffing | mine | P3 |
| X-81 | venue.tech = no AND programme ≠ none AND profile suggests neither Ääniteknikko nor Valoteknikko AND venue.pa ≠ no — *2026-09-23: exclusive catch-all, fires only when neither S-01 nor X-11 does; no service key* | Tech on the day: who runs sound and lights | Staffing | mine | P3 |
| X-82 | venue.host = no AND deck = public | Stewards are yours to find, not the venue's | Security | mine | P3 |
| X-90 | headcount ≥ 200 AND deck = public | Pelastussuunnitelma to the pelastuslaitos | Security | prepare/sign | E − 14 d |
| X-91 | V0 bare space AND ends after 22:00 | Meluilmoitus to the city | Security | prepare/sign | E − 30 d |
| X-92 | tickets = yes | Refund and cancellation terms decided before sales open | Financing | mine | P2 |
| X-93 | headcount ≥ 200 | Capacity count at the door: clicker and a number | Security | mine | P4 |
| X-94 | registration = paid | Invoice or collect payment; VAT treatment | Financing | mine | P2 |
| X-95 | programme = live AND music family | Backline: what the bands bring, what's shared, who supplies the rest | Logistics | mine | P3 |
| X-96 | performances > 1 | Front of house per performance: door, ushers, interval — repeats per date | Staffing | mine | P4 |
| X-97 | merch = yes | Merch: design, order quantities, lead time | Logistics | mine | P2 |
| X-98 | build/teardown days = yes | Book the venue for the days before and after; agree access and what may stay overnight | Venue | mine | P2 |
| X-99 | rigging = yes | Rigging and truss: what hangs, who rigs it, load limits, the venue's rules — a rigging company, not the PA hire | Logistics | mine | P2 |

## Type exceptions

A type adds rows only where it differs from its base. Klubi, Stand-up, Keikka and Yritystapahtuma add nothing: their differences turned out to be profile, layout or circuit rows.

### Häät

| ID | Task | Cat | Owner | Deadline |
| --- | --- | --- | --- | --- |
| H-01 | Request avioliiton esteiden tutkinta from DVV or your parish — both of you, together | Programming | mine | E − 4 mo at the earliest; by E − 14 d |
| H-02 | Book the officiant and the ceremony venue if separate from the party | Programming | mine | P1 |
| H-03 | Two witnesses, named and told | Programming | mine | P2 |
| H-04 | Ceremony music, readings, vows — who does what | Programming | mine | P2 |
| H-05 | Catering pre-set to yes (fires X-22…X-25) | — | — | — |
| H-06 | Seating plan by table | Logistics | mine | P3 |
| H-07 | Photographer / videographer booked | Programming | mine | P1 |
| H-08 | Cake: who, when delivered, where it stands | Catering | mine | P3 |
| H-09 | Timetable to the party: ceremony, photos, dinner, speeches, first dance | Programming | mine | P3 |

### Seminaari

| ID | Task | Cat | Owner | Deadline |
| --- | --- | --- | --- | --- |
| SE-01 | Open registrations (replaces C-21) | Communications | mine | P2 |
| SE-02 | Registration deadline, then chase the no-replies (replaces C-22) | Communications | mine | P3 |
| SE-03 | Attendee list to the door; name badges | Logistics | mine | P4 |
| SE-04 | Book and confirm speakers; agree fee, length, topic | Programming | mine | P1 |
| SE-05 | Speaker brief and slide deadline | Programming | mine | P3 |
| SE-06 | AV run-through: projector, clicker, mics, stream if hybrid | Logistics | mine | P4 |
| SE-07 | Coffee and lunch by headcount (X-22…X-25 with that wording) | Catering | — | — |

### Teatteri

| ID | Task | Cat | Owner | Deadline |
| --- | --- | --- | --- | --- |
| TE-01 | Programme pre-set to own production; performances question asked | — | — | card |
| TE-02 | Performance rights for the play; royalties per show | Financing | mine | P1 |
| TE-03 | Get-in and set build schedule; get-out after the last show | Logistics | mine | P3 / P5 |
| TE-04 | Rehearsals in the venue: dates, tech rehearsal, dress | Programming | mine | P3 |
| TE-05 | Set and costume materials: fire safety check with the venue | Security | mine | P3 |

### Muu kulttuuritapahtuma

| ID | Trigger | Task | Cat | Owner | Deadline |
| --- | --- | --- | --- | --- | --- |
| MU-01–03 | type | Profile cards: layout · stage or programme slot · exhibitors | — | — | cards |
| MU-10 | exhibitors | Open call, selection, confirmations | Programming | mine | P1 |
| MU-11 | exhibitors | Table fee, invoicing, what's included | Financing | mine | P2 |
| MU-12 | exhibitors | Floor plan: tables, aisles, power, exits kept clear | Logistics | mine | P3 |
| MU-13 | exhibitors | Exhibitor info pack: load-in, times, rules, parking | Communications | mine | P3 |
| MU-14 | exhibitors AND venue.seating = no | Tables and chairs for exhibitors (X-40/X-41 with exhibitor counts) | Logistics | mine | P2 |

### No venue in mind

| ID | Task | Cat | Owner | Deadline |
| --- | --- | --- | --- | --- |
| F-01 | Shortlist venues that fit the date, headcount and budget | Venue | mine | P1 |
| F-02 | Visit the top two or three | Venue | mine | P1 |
| F-03 | Decide, then come back and answer the venue questions | Venue | mine | P1 |

## Service profile → rows

The profile is `types.<key>.services` in `rules.json`: the services an event of that type usually needs. A suggested service fires its rows as tasks; it's a recommendation, never a requirement, and a capability the venue *has* suppresses the rows (see Suppression). Two type keys inherit a sibling's list (Yksityistilaisuus → Häät's, Yritystapahtuma → Seminaari's); Muu kulttuuritapahtuma has Lipunmyynti only.

| Service (`key`) | Suggested for | → rows |
| --- | --- | --- |
| Ääniteknikko `sound_tech` | Keikka, Klubi, Teatteri, Häät, Seminaari | X-11 (X-81 dropped its service key 2026-09-23) |
| Valoteknikko `light_tech` | Keikka, Teatteri, Häät | S-01 |
| Järjestyksenvalvonta `security` | Keikka, Klubi, Häät, Seminaari | P-32 · X-82 (public) · S-05 (closed) |
| Lipunmyynti `ticket_sales` | Keikka, Klubi, Teatteri, Stand-up, Muu kulttuuritapahtuma | P-03 · P-21 · P-52 · X-92 |
| Printit `printing` | Keikka, Teatteri | S-02 · TE-07 |
| Häirintäyhdyshenkilö `safer_space` | Keikka, Klubi, Häät, Seminaari | S-03 |
| Extra kalusto `extra_furnishing` | Teatteri, Häät, Stand-up, Seminaari | X-40 · X-41 · S-04 |
| Catering `catering` | Häät | X-22…X-25 |
| Tilavuokra `tilavuokra` | every plan | C-11 · C-12 |
| Tilavuokra (muut) `tilavuokra_muut` | — | Build and teardown days: X-98 |
| Siivous `cleaning` | — | S-07 |
| Anniskelu `anniskelu` | — | X-31 |
| Telinepalvelut `telineet` | — | Scaffolding and rigging: X-99 |
| Merch `merch` | — | X-97 |

## Statutory and fixed deadlines

These never scale with runway. Statutory offsets were checked against the consolidated statute text on 21.9.2026; the rest are working practice (contractual).

| Row | What | Offset | Fires when | Source | Copy note |
| --- | --- | --- | --- | --- | --- |
| P-30 | Ilmoitus yleisötilaisuudesta poliisille | E − 5 d | Public deck, always | [Kokoontumislaki 530/1999 14 §](https://www.finlex.fi/fi/laki/ajantasa/1999/19990530#P14) | Small events are exempt and the statute gives no number: "probably needed" for 51–200, "needed" above. Never implies a duty that may not exist |
| X-90 | Pelastussuunnitelma | E − 14 d | ≥ 200 people at once, public deck | [Pelastuslaki 379/2011 16 §](https://www.finlex.fi/fi/laki/ajantasa/2011/20110379#P16) · [VNA 407/2011 3 §](https://www.finlex.fi/fi/laki/ajantasa/2011/20110407#P3) | Also required for open fire, pyro, unusual exits — not asked in v2 |
| X-91 | Meluilmoitus | E − 30 d; activity may not start before 30 d have passed | Bare space (V0) and ends after 22:00 | [Ympäristönsuojelulaki 527/2014 118 §](https://www.finlex.fi/fi/laki/ajantasa/2014/20140527#P118) | Private households exempt — a wedding never fires it. A licensed venue's own conditions cover its events |
| X-31 | Anniskelu without a licence | Notice E − 3 d if a licence holder serves in an approved space; a new fixed-term licence has no statutory time — P1 | alcohol = we sell, venue.licence = no | [Alkoholilaki 1102/2017 20 §](https://www.finlex.fi/fi/laki/ajantasa/2017/20171102#P20) | Free drinks at a private event are not anniskelu; that's X-30, a plain venue question |
| H-01 | Avioliiton esteiden tutkinta | Certificate not before day 7 after the request; wedding within 4 months of it | Every Häät | [Avioliittolaki 234/1929 11, 13 §](https://www.finlex.fi/fi/laki/ajantasa/1929/19290234#P13) | Window: earliest E − 4 mo, latest safe E − 14 d |
| P-04 | Teosto / Gramex event licence | E − 14 d | programme ≠ none, public deck | Working practice | Fixed, contractual |
| P-06 | Teosto setlist report | E + 14 d | programme ≠ none, public deck | Working practice | Fixed, contractual |
| X-24 | Final headcount to the caterer | E − 7 d | catering | Convention | Fixed, contractual — copy never implies a legal duty |

Not in v2: tilapäinen elintarvikemyynti notification if the organiser sells food, and pyrotechnics (Tukes).
