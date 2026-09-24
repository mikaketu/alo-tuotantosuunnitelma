# Tuotantosuunnitelma – copy master (fi + en)

*Ainoa lähde `src/copy/fi.json`- ja `src/copy/en.json`-tiedostoille. Generoi: `npm run copy:generate`; tarkista ilman kirjoitusta: `npm run copy:check`.*

**Tila:** tyhjä = käytössä · `uusi` = lisätty 2026-09-24 session aikana · `muutettu` = teksti muuttunut session aikana · `ehdotus` = ei päätetty, ei generoida (`--include-drafts` ottaa mukaan) · `auki` = avoin kysymys, ei generoida · `poistetaan` = poistettu koodista, jää pois generoinnista.  
**Välilyönnit:** arvo, jonka alussa tai lopussa on merkitsevä välilyönti tai joka on tyhjä, kirjoitetaan JSON-merkkijonona lainausmerkkeihin, esim. `" ja "` tai `""`.

| avain | missä näkyy | milloin | tila | fi | en |
|---|---|---|---|---|---|
| `card.alcohol.help` | kortti · Järjestelyt · help | aina |  | Jos myyt alkoholia, tarvitset luvan, baarin ja ikärajan. Jos tarjoat omia juomia myymättä, riittää, että tila sallii sen. Jos tila hoitaa anniskelun, pyyhkäise ylös. | Selling alcohol means a licence, a bar and an age limit. If you serve your own drinks without selling them, the venue just has to allow it. If the venue runs the bar, swipe up. |
| `card.alcohol.label` | kortti · Järjestelyt · label | aina |  | Alkoholi | Alcohol |
| `card.alcohol.opt.none` | kortti · Järjestelyt · opt.none | aina |  | Ei alkoholia | No alcohol |
| `card.alcohol.opt.venue_handles` | kortti · Järjestelyt · opt.venue_handles | aina |  | Tila hoitaa anniskelun | The venue runs the bar |
| `card.alcohol.opt.we_bring` | kortti · Järjestelyt · opt.we_bring | aina |  | Tarjoamme omia, emme myy | We serve our own, not for sale |
| `card.alcohol.opt.we_sell` | kortti · Järjestelyt · opt.we_sell | aina |  | Myymme itse | We sell it ourselves |
| `card.alcohol.q` | kortti · Järjestelyt · q | aina |  | Tarjoillaanko alkoholia? | Will alcohol be served? |
| `card.alcohol.up` | card | — |  | Tila hoitaa anniskelun | The venue runs the bar |
| `card.build_days.label` | kortti · Järjestelyt · label | lava tai oma tuotanto tai Näytteilleasettajat: kyllä |  | Rakennuspäivät | Build days |
| `card.build_days.q` | kortti · Järjestelyt · q | lava tai oma tuotanto tai Näytteilleasettajat: kyllä |  | Tarvitaanko erillisiä rakennus- tai purkupäiviä? | Do you need separate build or strike days? |
| `card.catering.label` | kortti · Järjestelyt · label | aina |  | Tarjoilu | Food |
| `card.catering.opt.buffet` | kortti · Järjestelyt · opt.buffet | aina |  | Buffet | Buffet |
| `card.catering.opt.none` | kortti · Järjestelyt · opt.none | aina |  | Ei ruokaa | No food |
| `card.catering.opt.seated_meal` | kortti · Järjestelyt · opt.seated_meal | aina |  | Istuva illallinen | Seated dinner |
| `card.catering.opt.snacks` | kortti · Järjestelyt · opt.snacks | aina |  | Pientä purtavaa | Snacks |
| `card.catering.q` | kortti · Järjestelyt · q | aina |  | Tarjoillaanko ruokaa? | Will food be served? |
| `card.catering.q.haat` | kortti · Järjestelyt · q.haat | aina |  | Millainen tarjoilu? | What kind of food? |
| `card.catering.up` | card | — |  | Tila hoitaa tarjoilun | The venue handles catering |
| `card.ends.help` | kortti · Järjestelyt · help | aina |  | Myöhäinen lopetus vaikuttaa lupiin ja siihen, mikä tila käy. | A late finish affects permits and which venues will work. |
| `card.ends.label` | kortti · Järjestelyt · label | aina |  | Päättyy | Ends |
| `card.ends.opt.after23` | kortti · Järjestelyt · opt.after23 | aina |  | Jatkuu klo 23 jälkeen | Runs past 11 pm |
| `card.ends.opt.before22` | kortti · Järjestelyt · opt.before22 | aina |  | Päättyy viimeistään klo 22 | Ends by 10 pm |
| `card.ends.opt.late22` | kortti · Järjestelyt · opt.late22 | aina |  | Jatkuu klo 22–23 | Runs 10–11 pm |
| `card.ends.q` | kortti · Järjestelyt · q | aina |  | Mihin asti tapahtuma jatkuu? | How late does the event run? |
| `card.exhibitors.label` | kortti · Yleisö · label | tapahtumatyyppi: Muu kulttuuri­tapahtuma |  | Näytteilleasettajat | Exhibitors |
| `card.exhibitors.q` | kortti · Yleisö · q | tapahtumatyyppi: Muu kulttuuri­tapahtuma |  | Onko näytteilleasettajia tai myyjiä? | Will there be exhibitors or vendors? |
| `card.layout.label` | kortti · Järjestelyt · label | tapahtumatyyppi: Keikka tai Muu kulttuuri­tapahtuma |  | Yleisö | Audience |
| `card.layout.opt.seated` | kortti · Järjestelyt · opt.seated | tapahtumatyyppi: Keikka tai Muu kulttuuri­tapahtuma |  | Istuen | Seated |
| `card.layout.opt.standing` | kortti · Järjestelyt · opt.standing | tapahtumatyyppi: Keikka tai Muu kulttuuri­tapahtuma |  | Seisten | Standing |
| `card.layout.opt.tables` | kortti · Järjestelyt · opt.tables | tapahtumatyyppi: Keikka tai Muu kulttuuri­tapahtuma |  | Pöydissä | At tables |
| `card.layout.q` | kortti · Järjestelyt · q | tapahtumatyyppi: Keikka tai Muu kulttuuri­tapahtuma |  | Miten yleisö sijoitetaan? | How will the audience be arranged? |
| `card.merch.label` | kortti · Yleisö · label | julkisessa tapahtumassa |  | Merch | Merch |
| `card.merch.q` | kortti · Yleisö · q | julkisessa tapahtumassa |  | Myydäänkö merchiä? | Will you sell merch? |
| `card.outdoor.label` | kortti · Järjestelyt · label | julkisessa tapahtumassa |  | Ulkotila | Outdoors |
| `card.outdoor.q` | kortti · Järjestelyt · q | julkisessa tapahtumassa |  | Onko osa tapahtumasta ulkona? | Is any part of the event outdoors? |
| `card.performances.help` | kortti · Ohjelma · help | ohjelmaa on |  | Jos esityspäiviä on useampi, esityspäivän tehtävät toistuvat joka päivä ja jälkityöt lasketaan viimeisestä päivästä. | With several show days, the show-day tasks repeat each day and wrap-up is counted from the last one. |
| `card.performances.label` | kortti · Ohjelma · label | ohjelmaa on |  | Esitykset | Performances |
| `card.performances.lastDate` | kortti · Ohjelma · lastDate | ohjelmaa on |  | Viimeinen esityspäivä (ensimmäinen {date}) | Last show day (the first is {date}) |
| `card.performances.opt.one` | kortti · Ohjelma · opt.one | ohjelmaa on |  | Yhtenä päivänä | On one day |
| `card.performances.opt.several` | kortti · Ohjelma · opt.several | ohjelmaa on |  | Useampana päivänä | On several days |
| `card.performances.q` | kortti · Ohjelma · q | ohjelmaa on |  | Yhtenä päivänä vai useampana? | One day or several? |
| `card.performances.reset` | kortti · Ohjelma · reset | ohjelmaa on |  | Sittenkin yhtenä päivänä | Just one day after all |
| `card.programme.confirm` | kortti · Ohjelma · confirm | aina |  | Valmis | Done |
| `card.programme.help` | kortti · Ohjelma · help | aina |  | Valitse kaikki sopivat. | Pick all that apply. |
| `card.programme.label` | kortti · Ohjelma · label | aina |  | Ohjelma | Programme |
| `card.programme.opt.dj` | kortti · Ohjelma · opt.dj | aina |  | DJ | DJ |
| `card.programme.opt.live` | kortti · Ohjelma · opt.live | aina |  | Livemusiikki | Live music |
| `card.programme.opt.none` | kortti · Ohjelma · opt.none | aina |  | Ei erillistä ohjelmaa | No separate programme |
| `card.programme.opt.own_production` | kortti · Ohjelma · opt.own_production | aina |  | Esiinnymme itse | We're performing ourselves |
| `card.programme.opt.speakers` | kortti · Ohjelma · opt.speakers | aina |  | Puhujia tai muita esiintyjiä | Speakers or other performers |
| `card.programme.q` | kortti · Ohjelma · q | aina |  | Millaista ohjelmaa tapahtumassa on? | What's on the programme? |
| `card.registration.label` | kortti · Yleisö · label | tapahtumatyyppi: Seminaari |  | Ilmoittautuminen | Registration |
| `card.registration.opt.free` | kortti · Yleisö · opt.free | tapahtumatyyppi: Seminaari |  | Maksuton | Free |
| `card.registration.opt.paid` | kortti · Yleisö · opt.paid | tapahtumatyyppi: Seminaari |  | Maksullinen | Paid |
| `card.registration.q` | kortti · Yleisö · q | tapahtumatyyppi: Seminaari |  | Onko ilmoittautuminen maksullinen? | Is registration paid? |
| `card.rigging.help` | kortti · Järjestelyt · help | lava |  | Jos valoja, kaiuttimia tai somisteita ripustetaan ylös, tarvitaan ripustaja ja tieto kuormarajoista. | Hanging lights, speakers or decor overhead means a rigger and knowing the load limits. |
| `card.rigging.label` | kortti · Järjestelyt · label | lava |  | Ripustus | Rigging |
| `card.rigging.q` | kortti · Järjestelyt · q | lava |  | Ripustetaanko jotain kattoon? | Will anything hang from the ceiling? |
| `card.rigging.up` | card | — |  | Tila hoitaa ripustuksen | The venue handles rigging |
| `card.staffing.confirm` | kortti · Järjestelyt · confirm | aina |  | Valmis | Done |
| `card.staffing.help` | kortti · Järjestelyt · help | aina |  | Valitse kaikki sopivat. Jos teette kaiken itse, jätä tyhjäksi. | Pick all that apply. If you're doing everything yourselves, leave it empty. |
| `card.staffing.label` | kortti · Järjestelyt · label | aina |  | Henkilökunta | Staff |
| `card.staffing.opt.friends` | kortti · Järjestelyt · opt.friends | aina |  | Kaverit ja vapaaehtoiset | Friends and volunteers |
| `card.staffing.opt.paid` | kortti · Järjestelyt · opt.paid | aina |  | Palkattu henkilökunta | Paid staff |
| `card.staffing.q` | kortti · Järjestelyt · q | aina |  | Kuka muu tekee töitä tapahtumassa? | Who else is working at the event? |
| `card.stage_slot.label` | kortti · Ohjelma · label | tapahtumatyyppi: Muu kulttuuri­tapahtuma |  | Lava | Stage |
| `card.stage_slot.q` | kortti · Ohjelma · q | tapahtumatyyppi: Muu kulttuuri­tapahtuma |  | Onko tapahtumassa lava tai esiintyjiä? | Is there a stage or performers? |
| `card.tickets.label` | kortti · Yleisö · label | julkisessa tapahtumassa ja tapahtumatyyppi ei ole: Seminaari |  | Liput | Tickets |
| `card.tickets.opt.advance` | kortti · Yleisö · opt.advance | julkisessa tapahtumassa ja tapahtumatyyppi ei ole: Seminaari |  | Liput ennakkoon | Tickets in advance |
| `card.tickets.opt.both` | kortti · Yleisö · opt.both | julkisessa tapahtumassa ja tapahtumatyyppi ei ole: Seminaari |  | Liput ennakkoon ja ovelta | Tickets in advance and at the door |
| `card.tickets.opt.door` | kortti · Yleisö · opt.door | julkisessa tapahtumassa ja tapahtumatyyppi ei ole: Seminaari |  | Liput ovelta | Tickets at the door |
| `card.tickets.opt.free` | kortti · Yleisö · opt.free | julkisessa tapahtumassa ja tapahtumatyyppi ei ole: Seminaari |  | Vapaa pääsy | Free entry |
| `card.tickets.q` | kortti · Yleisö · q | julkisessa tapahtumassa ja tapahtumatyyppi ei ole: Seminaari |  | Miten sisään pääsee? | How do people get in? |
| `card.tickets.up` | card | — |  | Tila hoitaa lipunmyynnin | The venue handles ticketing |
| `card.v_access.label` | kortti · Tilan valmiudet · label | Tila: Kyllä |  | Esteettömyys | Accessibility |
| `card.v_access.q` | kortti · Tilan valmiudet · q | Tila: Kyllä |  | Onko tilassa esteetön sisäänkäynti ja wc? | Does the venue have step-free access and an accessible toilet? |
| `card.v_av.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja esitystekniikkaa tarvitaan |  | Esitystekniikka | AV |
| `card.v_av.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja esitystekniikkaa tarvitaan |  | Onko tilassa projektori, kangas ja striimaus? | Does the venue have a projector, screen and streaming? |
| `card.v_backstage.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja livemusiikkia |  | Backstage | Backstage |
| `card.v_backstage.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja livemusiikkia |  | Onko tilassa backstage tai pukuhuone? | Does the venue have a backstage or dressing room? |
| `card.v_bare.help` | kortti · Tilan valmiudet · help | Tila: Kyllä |  | Kyllä tarkoittaa, että tilassa ei ole tekniikkaa, keittiötä, anniskelulupaa eikä henkilökuntaa. Jos jokin tehtävä on turha, voit pyyhkäistä sen myöhemmin pois. | Yes means the venue has no tech, kitchen, alcohol licence or staff. If a task turns out unnecessary, you can swipe it away later. |
| `card.v_bare.label` | kortti · Tilan valmiudet · label | Tila: Kyllä |  | Tyhjä tila | Empty venue |
| `card.v_bare.left` | kortti · Tilan valmiudet · left | Tila: Kyllä |  | Ei, perusasiat löytyvät | No, the basics are there |
| `card.v_bare.q` | kortti · Tilan valmiudet · q | Tila: Kyllä |  | Onko tila tyhjä, eli tuot kaiken itse? | Is the venue empty, so you bring everything? |
| `card.v_bare.right` | kortti · Tilan valmiudet · right | Tila: Kyllä |  | Kyllä, tuon kaiken | Yes, I bring everything |
| `card.v_capacity.label` | kortti · Tilan valmiudet · label | Tila: Kyllä |  | Kapasiteetti | Capacity |
| `card.v_capacity.left` | kortti · Tilan valmiudet · left | Tila: Kyllä |  | Ei mahdu | Doesn't fit |
| `card.v_capacity.q` | kortti · Tilan valmiudet · q | Tila: Kyllä |  | Mahtuuko yleisö tilaan? | Does the audience fit in the venue? |
| `card.v_capacity.right` | kortti · Tilan valmiudet · right | Tila: Kyllä |  | Mahtuu | Fits |
| `card.v_host.label` | kortti · Tilan valmiudet · label | Tila: Kyllä |  | Tilan edustaja | Venue contact |
| `card.v_host.q` | kortti · Tilan valmiudet · q | Tila: Kyllä |  | Onko tilalta joku paikalla tapahtumapäivänä? | Will someone from the venue be there on the day? |
| `card.v_kitchen.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja tarjoilua on |  | Keittiö | Kitchen |
| `card.v_kitchen.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja tarjoilua on |  | Onko tilassa keittiö tai tarjoilutila? | Does the venue have a kitchen or catering area? |
| `card.v_licence.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja Alkoholi: Tuomme itse, ei myydä tai Myymme itse |  | Anniskelulupa | Alcohol licence |
| `card.v_licence.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja Alkoholi: Tuomme itse, ei myydä tai Myymme itse |  | Onko tilalla anniskelulupa? | Does the venue have an alcohol licence? |
| `card.v_loadin.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja (ohjelmaa on tai tarjoilua on tai Näytteilleasettajat: kyllä) |  | Lastaus | Load-in |
| `card.v_loadin.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja (ohjelmaa on tai tarjoilua on tai Näytteilleasettajat: kyllä) |  | Onko tilassa lastauspaikka ja pysäköinti? | Does the venue have a loading spot and parking? |
| `card.v_pa.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja ohjelmaa on |  | Äänentoisto | PA |
| `card.v_pa.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja ohjelmaa on |  | Onko tilassa äänentoisto ja mikit? | Does the venue have a PA and mics? |
| `card.v_seating.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja istumapaikkoja tarvitaan |  | Istuimet | Seating |
| `card.v_seating.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja istumapaikkoja tarvitaan |  | Onko tilassa istuimet ja pöydät väkimäärällesi? | Does the venue have enough chairs and tables for your crowd? |
| `card.v_stage.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja lava |  | Lava ja valot | Stage and lights |
| `card.v_stage.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja lava |  | Onko tilassa lava ja lavavalot? | Does the venue have a stage and stage lighting? |
| `card.v_tech.label` | kortti · Tilan valmiudet · label | Tila: Kyllä ja ohjelmaa on |  | Tilan teknikko | Venue technician |
| `card.v_tech.q` | kortti · Tilan valmiudet · q | Tila: Kyllä ja ohjelmaa on |  | Onko tilalta teknikko paikalla tapahtumapäivänä? | Will a venue technician be there on the day? |
| `card.venue.help` | kortti · Tila · help | aina |  | Ilman tilaa osa tehtävistä jää odottamaan. Suunnitelma syntyy silti. | Without a venue, some tasks have to wait. You'll still get a plan. |
| `card.venue.label` | kortti · Tila · label | aina |  | Tila | Venue |
| `card.venue.opt.none` | kortti · Tila · opt.none | aina |  | Ei vielä | Not yet |
| `card.venue.opt.own` | kortti · Tila · opt.own | aina |  | Kyllä | Yes |
| `card.venue.q` | kortti · Tila · q | aina |  | Onko sinulla jo tila mielessä? | Do you already have a venue in mind? |
| `cat.catering` | cat | — |  | Ruoka ja juoma | Food and drink |
| `cat.communications` | cat | — |  | Viestintä | Communications |
| `cat.financing` | cat | — |  | Talous | Money |
| `cat.logistics` | cat | — |  | Logistiikka | Logistics |
| `cat.programming` | cat | — |  | Ohjelma | Programme |
| `cat.security` | cat | — |  | Turvallisuus | Safety |
| `cat.staffing` | cat | — |  | Henkilökunta | Staff |
| `cat.venue` | cat | — |  | Tila | Venue |
| `deck.closed` | deck | — |  | yksityinen tapahtuma | private event |
| `deck.public` | deck | — |  | julkinen tapahtuma | public event |
| `fact.av_needed` | fact | — |  | esitystekniikkaa tarvitaan | AV is needed |
| `fact.bare` | fact | — |  | tila on tyhjä | the venue is empty |
| `fact.catering_any` | fact | — |  | tarjoilua on | food is served |
| `fact.closed` | fact | — |  | tapahtuma on yksityinen | the event is private |
| `fact.deck` | fact | — |  | tapahtuma | event |
| `fact.family` | fact | — |  | tapahtumaperhe | event family |
| `fact.has_stage` | fact | — |  | tapahtumassa on lava | there's a stage |
| `fact.head` | fact | — |  | väkimäärä | headcount |
| `fact.head_ge_200` | fact | — |  | paikalla on yhtä aikaa yli 200 | there are over 200 people at once |
| `fact.head_near_200` | fact | — |  | paikalla on yhtä aikaa 150 tai enemmän | there are 150 or more people at once |
| `fact.headcount` | fact | — |  | väkimäärä | headcount |
| `fact.late` | fact | — |  | tapahtuma jatkuu yli klo 22 | the event runs past 10 pm |
| `fact.music_family` | fact | — |  | kyseessä on musiikkitapahtuma | it's a music event |
| `fact.need_seats` | fact | — |  | istumapaikkoja tarvitaan | seating is needed |
| `fact.profile` | fact | — |  | tapahtumatyypin palvelut | services for this event type |
| `fact.programme_any` | fact | — |  | ohjelmaa on | there's a programme |
| `fact.programme_dj` | fact | — |  | tapahtumassa on DJ | there's a DJ |
| `fact.programme_dj_only` | fact | — |  | ohjelmana on vain DJ | the only programme is a DJ |
| `fact.programme_live` | fact | — |  | tapahtumassa on livemusiikkia | there's live music |
| `fact.programme_music` | fact | — |  | tapahtumassa on livemusiikkia tai DJ | there's live music or a DJ |
| `fact.programme_own` | fact | — |  | esiinnytte itse | you're performing yourselves |
| `fact.programme_speakers` | fact | — |  | tapahtumassa on puhujia | there are speakers |
| `fact.public` | fact | — |  | tapahtuma on julkinen | the event is public |
| `fact.runway` | fact | — |  | aikaa tapahtumaan | time until the event |
| `fact.seated` | fact | — |  | yleisö istuu | the audience is seated |
| `fact.seats_over_60` | fact | — |  | istumapaikkoja yli 60 | more than 60 seats |
| `fact.tickets_yes` | fact | — |  | liput ovat maksullisia | tickets are paid |
| `fact.type` | fact | — |  | tapahtumatyyppi | event type |
| `fact.venue` | fact | — |  | tila | venue |
| `family.music` | family | — |  | musiikkitapahtuma | music event |
| `family.muu` | family | — |  | muu kulttuuritapahtuma | other cultural event |
| `family.standup` | family | — |  | stand-up | stand-up |
| `family.teatteri` | family | — |  | teatteri | theatre |
| `family.yksityis` | family | — |  | yksityistilaisuus | private party |
| `family.yritys` | family | — |  | yritystapahtuma | corporate event |
| `head.h0` | head | — |  | alle 50 | under 50 |
| `head.h1` | head | — |  | 50–150 | 50–150 |
| `head.h2` | head | — |  | 150–400 | 150–400 |
| `head.h3` | head | — |  | yli 400 | over 400 |
| `phase.after` | phase | — |  | Jälkeen | After |
| `phase.after.explain` | phase | — |  | Kiitokset, laskut ja palautukset viikon sisällä viimeisestä päivästä | Thank-yous, invoices and returns within a week of the last day |
| `phase.eventweek` | phase | — |  | Tapahtumaviikko | Event week |
| `phase.eventweek.explain` | phase | — |  | Paikan päällä: tilan vastaanotto, aikataulut ja purku | On site: venue handover, schedules and strike |
| `phase.midway` | phase | — |  | Puolivälissä | Midway |
| `phase.midway.explain` | phase | — |  | {n} päivää ennen tapahtumaa, puolivälissä tästä päivästä tapahtumaan | {n} days before the event, halfway between today and the event |
| `phase.now` | phase | — |  | Nyt | Now |
| `phase.now.explain` | phase | — |  | Asiat, joita kaikki muu odottaa | The things everything else waits on |
| `phase.threeweeks` | phase | — |  | 3 viikkoa ennen | 3 weeks before |
| `phase.threeweeks.explain` | phase | — |  | Vahvistukset, briiffit ja lopulliset luvut | Confirmations, briefings and final numbers |
| `row.C-01.title` | tehtävä · Rahoitus · P1 · järjestäjän | yksityisessä tapahtumassa |  | Sovi budjetista ja siitä, kuka maksaa mitäkin | Agree on the budget and who pays for what |
| `row.C-02.title` | tehtävä · Rahoitus · P1 · järjestäjän | yksityisessä tapahtumassa |  | Maksa tilan varausmaksu | Pay the venue deposit |
| `row.C-03.title` | tehtävä · Rahoitus · P5 · järjestäjän | yksityisessä tapahtumassa |  | Tarkista, että laskut vastaavat sovittua | Check that invoices match what was agreed |
| `row.C-10.title` | tehtävä · Tila · P1 · järjestäjän | aina |  | Käy katsomassa tila | Visit the venue |
| `row.C-11.title` | tehtävä · Tila · P1 · tilavuokra | aina |  | Vahvista päivä ja varaa tila | Confirm the date and book the venue |
| `row.C-12.title` | tehtävä · Tila · P1 · järjestäjän · tilavuokra | aina |  | Lue peruutusehdot ja allekirjoita tilasopimus | Read the cancellation terms and sign the venue contract |
| `row.C-13.title` | tehtävä · Tila · P2 · järjestäjän | aina |  | Selvitä, mitä tilan vakuutus kattaa ja mikä jää sinun vastuullesi | Find out what the venue's insurance covers and what's on you |
| `row.C-14.title` | tehtävä · Tila · P3 | aina |  | Sovi kulkuajat, avaimet, hälytys ja lastaus | Agree on access times, keys, alarm and load-in |
| `row.C-15.title` | tehtävä · Tila · P4 | aina |  | Käy tila läpi ja ota se vastaan tilan edustajan kanssa | Walk through the venue with the venue contact and take it over |
| `row.C-16.title` | tehtävä · Tila · P5 | aina |  | Palauta avaimet, tee lopputarkastus ja pyydä vakuus takaisin | Return the keys, do the final check and get the deposit back |
| `row.C-20.title` | tehtävä · Viestintä · P1 · järjestäjän | yksityisessä tapahtumassa |  | Kokoa vieraslista | Put together the guest list |
| `row.C-21.title` | tehtävä · Viestintä · P2 · järjestäjän | yksityisessä tapahtumassa |  | Lähetä kutsut | Send the invitations |
| `row.C-21.title.saveTheDate` | tehtävä · Viestintä · P2 · järjestäjän | yksityisessä tapahtumassa ja aikaa tapahtumaan: 181 |  | Lähetä ensin save the date, sitten kutsut | Send a save the date first, then the invitations |
| `row.C-21.title.seminar` | tehtävä · Viestintä · P2 · järjestäjän | yksityisessä tapahtumassa ja tapahtumatyyppi: Seminaari |  | Lähetä kutsut ja ilmoittautumislinkki | Send the invitations and the registration link |
| `row.C-21.title.seminarSaveTheDate` | tehtävä · Viestintä · P2 · järjestäjän | yksityisessä tapahtumassa ja tapahtumatyyppi: Seminaari ja aikaa tapahtumaan: 181 |  | Lähetä ensin save the date, sitten kutsut ja ilmoittautumislinkki | Send a save the date first, then the invitations and the registration link |
| `row.C-22.title` | tehtävä · Viestintä · P3 · järjestäjän | yksityisessä tapahtumassa |  | Aseta vastauksille takaraja ja muistuta niitä, jotka eivät vastanneet | Set an RSVP deadline and remind those who haven't replied |
| `row.C-22.title.seminar` | tehtävä · Viestintä · P3 · järjestäjän | yksityisessä tapahtumassa ja tapahtumatyyppi: Seminaari |  | Aseta ilmoittautumisen takaraja ja muistuta niitä, jotka eivät ilmoittautuneet | Set a registration deadline and remind those who haven't registered |
| `row.C-23.title` | tehtävä · Viestintä · P3 | yksityisessä tapahtumassa |  | Lähetä vieraille käytännön tiedot: osoite, aikataulu, pysäköinti, pukukoodi | Send guests the practical details: address, schedule, parking, dress code |
| `row.C-24.title` | tehtävä · Viestintä · P5 · järjestäjän | yksityisessä tapahtumassa |  | Kiitä vieraita ja auttajia | Thank your guests and helpers |
| `row.C-30.title` | tehtävä · Ohjelma · P2 | yksityisessä tapahtumassa |  | Kirjoita päivän kulku auki | Write out the running order of the day |
| `row.C-31.title` | tehtävä · Ohjelma · P2 | yksityisessä tapahtumassa |  | Päätä, kuka juontaa | Decide who hosts |
| `row.C-40.title` | tehtävä · Logistiikka · P3 | yksityisessä tapahtumassa |  | Suunnittele kalusteet ja tilan järjestys | Plan the furniture and room layout |
| `row.C-41.title` | tehtävä · Logistiikka · P3 | yksityisessä tapahtumassa |  | Somistus: mitä, kuka tuo ja milloin se laitetaan paikoilleen | Decor: what, who brings it and when it goes up |
| `row.C-42.title` | tehtävä · Logistiikka · P5 | yksityisessä tapahtumassa |  | Purku: kuka vie mitäkin kotiin | Strike: who takes what home |
| `row.C-50.title` | tehtävä · Henkilöstö · P3 | yksityisessä tapahtumassa |  | Tee yksi lista päivän tehtävistä ja kirjoita nimet viereen | Make one list of the day's tasks with a name next to each |
| `row.C-60.title` | tehtävä · Turvallisuus · P3 | yksityisessä tapahtumassa |  | Nimeä vastuuhenkilö, joka ei itse isännöi | Name a person in charge who isn't hosting |
| `row.C-61.title` | tehtävä · Turvallisuus · P4 | yksityisessä tapahtumassa |  | Selvitä poistumistiet, ensiapulaukku ja lähin päivystys | Find the exits, the first aid kit and the nearest emergency department |
| `row.C-62.title` | tehtävä · Turvallisuus · P3 · järjestäjän | yksityisessä tapahtumassa |  | Sovi kotimatkat: kuka ajaa ja miten muut pääsevät kotiin | Sort out getting home: who drives and how everyone else gets there |
| `row.F-01.title` | tehtävä · Tila · P1 · järjestäjän | Tila: Ei vielä |  | Listaa tilat, jotka sopivat päivään, väkimäärään ja budjettiin | List venues that fit your date, headcount and budget |
| `row.F-02.title` | tehtävä · Tila · P1 · järjestäjän | Tila: Ei vielä |  | Käy katsomassa kaksi tai kolme parasta | Visit the top two or three |
| `row.F-03.title` | tehtävä · Tila · P1 · järjestäjän | Tila: Ei vielä |  | Päätä tila ja palaa vastaamaan tilan kysymyksiin | Pick a venue and come back to answer the venue questions |
| `row.H-01.title` | tehtävä · Ohjelma · E−14 d · järjestäjän | tapahtumatyyppi: Häät |  | Pyydä avioliiton esteiden tutkintaa DVV:ltä tai seurakunnalta – pyyntö tehdään yhdessä | Request the examination of impediments to marriage from DVV or your parish – you request it together |
| `row.H-02.title` | tehtävä · Ohjelma · P1 · järjestäjän | tapahtumatyyppi: Häät |  | Varaa vihkijä ja vihkipaikka, jos se on eri kuin juhlapaikka | Book the officiant and the ceremony venue, if it's not where the party is |
| `row.H-03.title` | tehtävä · Ohjelma · P2 · järjestäjän | tapahtumatyyppi: Häät |  | Pyydä kaksi todistajaa | Ask two witnesses |
| `row.H-04.title` | tehtävä · Ohjelma · P2 · järjestäjän | tapahtumatyyppi: Häät |  | Seremonian musiikki, luennat ja valat: kuka tekee mitäkin | Ceremony music, readings and vows: who does what |
| `row.H-06.title` | tehtävä · Logistiikka · P3 | tapahtumatyyppi: Häät |  | Tee istumajärjestys pöydittäin | Make a table seating plan |
| `row.H-07.title` | tehtävä · Ohjelma · P1 | tapahtumatyyppi: Häät |  | Varaa valokuvaaja tai videokuvaaja | Book a photographer or videographer |
| `row.H-08.title` | tehtävä · Catering · P3 | tapahtumatyyppi: Häät |  | Kakku: kuka tekee, milloin se toimitetaan ja missä se seisoo | Cake: who makes it, when it's delivered and where it stands |
| `row.H-09.title` | tehtävä · Ohjelma · P3 | tapahtumatyyppi: Häät |  | Aikataulu juhlaväelle: vihkiminen, kuvat, illallinen, puheet, häävalssi | Schedule for the wedding party: ceremony, photos, dinner, speeches, first dance |
| `row.K-01.title` | tehtävä · Ohjelma · P2 | tapahtumatyyppi: Klubi |  | Päätä sulkemisaika ja viimeinen sisäänpääsy ja tarkista, että tilan lupa-ajat riittävät | Decide closing time and last entry, and check the venue's licensed hours cover them |
| `row.MU-10.title` | tehtävä · Ohjelma · P1 · järjestäjän | tapahtumatyyppi: Muu kulttuuri­tapahtuma ja Näytteilleasettajat: kyllä |  | Näytteilleasettajat: haku, valinta ja vahvistukset | Exhibitors: open call, selection and confirmations |
| `row.MU-11.title` | tehtävä · Rahoitus · P2 · järjestäjän | tapahtumatyyppi: Muu kulttuuri­tapahtuma ja Näytteilleasettajat: kyllä |  | Pöytämaksu: hinta, mitä siihen sisältyy ja laskutus | Table fee: price, what it includes and invoicing |
| `row.MU-12.title` | tehtävä · Logistiikka · P3 | tapahtumatyyppi: Muu kulttuuri­tapahtuma ja Näytteilleasettajat: kyllä |  | Pohjapiirros: pöydät, käytävät, sähkö ja poistumistiet vapaina | Floor plan: tables, aisles, power and clear exits |
| `row.MU-13.title` | tehtävä · Viestintä · P3 | tapahtumatyyppi: Muu kulttuuri­tapahtuma ja Näytteilleasettajat: kyllä |  | Infopaketti näytteilleasettajille: lastaus, ajat, säännöt, pysäköinti | Info pack for exhibitors: load-in, times, rules, parking |
| `row.P-01.title` | tehtävä · Rahoitus · P1 · järjestäjän | julkisessa tapahtumassa |  | Tee budjetti: palkkiot, tila, tekniikka, henkilökunta ja markkinointi – ja laske, millä myynnillä pääset omillesi | Make a budget: fees, venue, tech, staff and marketing – and work out how much you need to sell to break even |
| `row.P-02.title` | tehtävä · Rahoitus · P1 · järjestäjän | julkisessa tapahtumassa |  | Maksa tilan varausmaksu | Pay the venue deposit |
| `row.P-03.title` | tehtävä · Rahoitus · P2 · ticket_sales | julkisessa tapahtumassa ja maksulliset liput |  | Päätä lipun hinta ja myyntikanava | Set the ticket price and sales channel |
| `row.P-04.title` | tehtävä · Rahoitus · E−14 d | julkisessa tapahtumassa ja ohjelmaa on |  | Hae musiikin esityslupa Teostolta (tallennemusiikkiin myös Gramexilta) | Get a music licence from Teosto (and from Gramex for recorded music) |
| `row.P-05.title` | tehtävä · Rahoitus · P4 | julkisessa tapahtumassa ja maksulliset liput |  | Käteinen ja kortti ovella: pohjakassa, maksupääte ja se, kuka laskee | Cash and card at the door: float, card terminal and who counts |
| `row.P-06.title` | tehtävä · Rahoitus · E−-14 d | julkisessa tapahtumassa ja ohjelmaa on |  | Maksa esiintyjien tai puhujien palkkiot ja tee ohjelmistoilmoitus Teostolle | Pay performer or speaker fees and file the setlist report with Teosto |
| `row.P-07.title` | tehtävä · Rahoitus · P5 · järjestäjän | julkisessa tapahtumassa ja maksulliset liput |  | Vertaa lipunmyynnin, oven ja baarin tuottoja budjettiin | Compare ticket, door and bar income against the budget |
| `row.P-10.title` | tehtävä · Ohjelma · P1 | julkisessa tapahtumassa ja ohjelmaa on |  | Kiinnitä esiintyjät tai puhujat: sovi palkkio, kesto ja tekniset tarpeet | Book performers or speakers: agree fee, set length and tech needs |
| `row.P-11.title` | tehtävä · Ohjelma · P2 | julkisessa tapahtumassa ja ohjelmaa on |  | Tee sopimukset tai pyydä kirjalliset vahvistukset | Sign contracts or get written confirmations |
| `row.P-12.title` | tehtävä · Ohjelma · P2 | julkisessa tapahtumassa ja livemusiikkia tai DJ |  | Kerää tekniset riderit | Collect tech riders |
| `row.P-13.title` | tehtävä · Ohjelma · P3 | julkisessa tapahtumassa ja ohjelmaa on |  | Tee ajolista ja lava-ajat | Make the running order and stage times |
| `row.P-14.title` | tehtävä · Ohjelma · P4 | julkisessa tapahtumassa ja livemusiikkia tai DJ |  | Tee soundcheck-aikataulu | Make the soundcheck schedule |
| `row.P-20.title` | tehtävä · Viestintä · P2 | julkisessa tapahtumassa |  | Julkista tapahtuma: nimi, päivä, paikka, hinta ja ikäraja | Announce the event: name, date, venue, price and age limit |
| `row.P-21.title` | tehtävä · Viestintä · P2 · ticket_sales | julkisessa tapahtumassa ja maksulliset liput |  | Avaa lipunmyynti ja kerro siitä | Open ticket sales and spread the word |
| `row.P-22.title` | tehtävä · Viestintä · P3 | julkisessa tapahtumassa |  | Markkinointi: some, julisteet, sähköpostilistat ja media | Marketing: social media, posters, mailing lists and press |
| `row.P-23.title` | tehtävä · Viestintä · P3 | julkisessa tapahtumassa |  | Julkaise ovi-info: ajat, ikäraja, esteettömyys ja mitä ei saa tuoda | Publish door info: times, age limit, accessibility and what not to bring |
| `row.P-24.title` | tehtävä · Viestintä · P5 | julkisessa tapahtumassa |  | Kiitä yleisöä ja tekijöitä ja julkaise jälkipostaus | Thank the audience and crew and post a recap |
| `row.P-30.title` | tehtävä · Turvallisuus · E−5 d | julkisessa tapahtumassa ja 150 tai enemmän yhtä aikaa |  | Tee poliisille ilmoitus yleisötilaisuudesta | Notify the police of the public event |
| `row.P-30.title.probable` | tehtävä · Turvallisuus · E−5 d | julkisessa tapahtumassa ja 150 tai enemmän yhtä aikaa ja ei: yli 200 yhtä aikaa |  | Tee poliisille ilmoitus yleisötilaisuudesta – todennäköisesti tarpeen, jos paikalla on yhtä aikaa yli 200 | Notify the police of the public event – likely needed if there are over 200 people at once |
| `row.P-31.title` | tehtävä · Turvallisuus · P3 · järjestäjän | julkisessa tapahtumassa |  | Päätä ikäraja ja se, miten se tarkistetaan | Set the age limit and how it's checked |
| `row.P-32.title` | tehtävä · Turvallisuus · P3 · security | julkisessa tapahtumassa |  | Järjestyksenvalvojat: montako, ketkä ja ovatko kortit voimassa | Security staff: how many, who, and are their licences valid |
| `row.P-33.title` | tehtävä · Turvallisuus · P3 | julkisessa tapahtumassa |  | Ensiapu: missä laukku on ja kuka osaa auttaa | First aid: where the kit is and who can help |
| `row.P-34.title` | tehtävä · Turvallisuus · P4 | julkisessa tapahtumassa |  | Turvallisuusbriiffi henkilökunnalle: poistumistiet, kapasiteetti, häiriötilanteet | Safety briefing for staff: exits, capacity, incidents |
| `row.P-40.title` | tehtävä · Henkilöstö · P3 | julkisessa tapahtumassa ja maksulliset liput |  | Varaa tekijät ovelle ja lipunmyyntiin | Book people for the door and ticket sales |
| `row.P-41.title` | tehtävä · Henkilöstö · P3 | julkisessa tapahtumassa |  | Päivän vetäjä: stage manager tai salivastaava | Person running the day: stage manager or house manager |
| `row.P-42.title` | tehtävä · Henkilöstö · P4 | julkisessa tapahtumassa |  | Työvuorot ja saapumisajat | Shifts and call times |
| `row.P-50.title` | tehtävä · Logistiikka · P4 | julkisessa tapahtumassa |  | Rakennus- ja purkusuunnitelma: ajat ja kantajat | Build and strike plan: times and hands |
| `row.P-51.title` | tehtävä · Logistiikka · P3 | julkisessa tapahtumassa ja livemusiikkia tai DJ |  | Backline- ja kalustolista: mikä tulee mistäkin | Backline and gear list: what comes from where |
| `row.P-52.title` | tehtävä · Logistiikka · P4 · ticket_sales | julkisessa tapahtumassa ja maksulliset liput |  | Lippujen skannaus tai vieraslista ovelle | Ticket scanning or guest list at the door |
| `row.P-53.title` | tehtävä · Logistiikka · P4 | julkisessa tapahtumassa |  | Merch- ja infopöytä: tarvitaanko ja kuka pitää | Merch and info table: needed or not, and who runs it |
| `row.P-54.title` | tehtävä · Logistiikka · P5 | julkisessa tapahtumassa |  | Purku, palautukset ja löytötavarat | Strike, returns and lost property |
| `row.S-01.title` | tehtävä · Henkilöstö · P2 · light_tech | tapahtumatyypin palvelut: valoteknikko ja tilassa ei ole: tilan teknikko paikalla |  | Varaa valoteknikko tai sovi, että tilan teknikko hoitaa valot | Book a lighting tech or agree that the venue tech runs lights |
| `row.S-02.title` | tehtävä · Viestintä · P3 · printing | julkisessa tapahtumassa ja tapahtumatyypin palvelut: printit |  | Julisteet, käsiohjelmat ja opasteet: suunnittelu, paino ja ripustus | Posters, printed programmes and signage: design, print and hanging |
| `row.S-03.title` | tehtävä · Turvallisuus · P3 · safer_space | tapahtumatyypin palvelut: häirintäyhdyshenkilö |  | Nimeä häirintäyhdyshenkilö ja kerro yleisölle, kuka hän on ja miten hänet tavoittaa | Name a harassment contact and tell the audience who they are and how to reach them |
| `row.S-04.title` | tehtävä · Logistiikka · P2 · extra_furnishing | tapahtumatyypin palvelut: lisäkalusto ja tilassa ei ole: istuimet ja pöydät |  | Lisäkalustolista: mitä, mistä ja kuka palauttaa | Extra furniture list: what, from where and who returns it |
| `row.S-05.title` | tehtävä · Turvallisuus · P3 · security | yksityisessä tapahtumassa ja tapahtumatyypin palvelut: järjestyksenvalvonta |  | Ovihenkilö tai järjestyksenvalvojat: kuka ja tarvitaanko JV-kortit | Door person or security staff: who, and do they need to be licensed |
| `row.S-07.title` | tehtävä · Logistiikka · P5 · cleaning | aina |  | Siivous tapahtuman jälkeen: kuka, mihin mennessä ja missä kunnossa tila palautetaan | Cleaning after the event: who, by when and what state the venue goes back in |
| `row.SE-03.title` | tehtävä · Logistiikka · P4 | tapahtumatyyppi: Seminaari |  | Osallistujalista ovelle ja nimikyltit | Attendee list for the door and name tags |
| `row.SE-04.title` | tehtävä · Ohjelma · P1 | tapahtumatyyppi: Seminaari |  | Kiinnitä ja vahvista puhujat: sovi palkkio, kesto ja aihe | Book and confirm speakers: agree fee, length and topic |
| `row.SE-05.title` | tehtävä · Ohjelma · P3 | tapahtumatyyppi: Seminaari |  | Puhujabriiffi ja kalvojen takaraja | Speaker briefing and slide deadline |
| `row.SE-06.title` | tehtävä · Logistiikka · P4 | tapahtumatyyppi: Seminaari |  | AV-läpikäynti: projektori, klikkeri, mikit ja striimi, jos hybridi | AV check: projector, clicker, mics and stream if hybrid |
| `row.TE-02.title` | tehtävä · Rahoitus · P1 · järjestäjän | tapahtumatyyppi: Teatteri |  | Näytelmän esitysoikeudet ja esityskohtaiset korvaukset | Performance rights and per-show royalties |
| `row.TE-03.title` | tehtävä · Logistiikka · P3 | tapahtumatyyppi: Teatteri |  | Get-in ja lavastuksen rakennus, get-out viimeisen esityksen jälkeen | Get-in and set build, get-out after the last show |
| `row.TE-04.title` | tehtävä · Ohjelma · P3 | tapahtumatyyppi: Teatteri |  | Harjoitukset tilassa: päivät, tekninen harjoitus ja kenraali | Rehearsals in the venue: dates, tech rehearsal and dress rehearsal |
| `row.TE-05.title` | tehtävä · Turvallisuus · P3 | tapahtumatyyppi: Teatteri |  | Lavastus- ja pukumateriaalien paloturvallisuus: tarkista tilan kanssa | Fire safety of set and costume materials: check with the venue |
| `row.TE-07.title` | tehtävä · Viestintä · P3 · printing | tapahtumatyyppi: Teatteri |  | Käsiohjelma: sisältö, taitto ja paino | Printed programme: content, layout and print |
| `row.V-00.title` | tehtävä · Tila · P1 · järjestäjän | Tila: Kyllä |  | Varmista tilalta: {thing} | Check with the venue: {thing} |
| `row.V-01.title` | tehtävä · Tila · P1 · järjestäjän | tilassa ei ole: kapasiteetti väkimäärällesi |  | Etsi isompi tila tai lyhennä vieraslistaa | Find a bigger venue or shorten the guest list |
| `row.X-01.title` | tehtävä · Catering · P3 | livemusiikkia |  | Pyydä hospitality rider ja vastaa siihen: ruoka, juomat, pyyhkeet ja kuka ostaa | Ask for the hospitality rider and answer it: food, drinks, towels and who buys |
| `row.X-02.title` | tehtävä · Logistiikka · P2 | livemusiikkia tai puhujia |  | Esiintyjien tai puhujien matkat ja majoitus – tai vahvista, että he hoitavat ne itse | Travel and accommodation for performers or speakers – or confirm they sort it themselves |
| `row.X-03.title` | tehtävä · Logistiikka · P4 | livemusiikkia tai puhujia |  | Sovi saapumisaika, pysäköinti ja yhteyshenkilö tapahtumapäivälle | Agree arrival time, parking and a contact person for the day |
| `row.X-04.title` | tehtävä · Rahoitus · P2 | ohjelmaa on ja yksityisessä tapahtumassa |  | Musiikkiluvat: kysy tilalta, kattaako sen Teosto-sopimus yksityistilaisuuden | Music licences: ask the venue whether its Teosto agreement covers private events |
| `row.X-05.title` | tehtävä · Logistiikka · P3 | DJ |  | DJ-tekniikka: soittimet, mikseri ja kuka tuo mitäkin | DJ gear: decks, mixer and who brings what |
| `row.X-06.title` | tehtävä · Catering · P3 | Ohjelma: kyllä |  | Kysy DJ:ltä juomatoiveet – rideria ei yleensä ole | Ask the DJs what they'd like to drink – there's usually no rider |
| `row.X-10.title` | tehtävä · Logistiikka · P2 | tilassa ei ole: äänentoisto ja mikit |  | Vuokraa tilaan ja väkimäärään mitoitettu äänentoisto | Rent a PA sized for the venue and crowd |
| `row.X-100.title` | tehtävä · Logistiikka · P2 | Ulkotila: kyllä |  | Ulkotila: sadesuunnitelma, sähkö ja luvat | Outdoors: rain plan, power and permits |
| `row.X-11.title` | tehtävä · Henkilöstö · P2 · sound_tech | tilassa ei ole: äänentoisto ja mikit tai (tapahtumatyypin palvelut: ääniteknikko ja tilassa ei ole: tilan teknikko paikalla) |  | Varaa ääniteknikko soundcheckiin ja keikkaan | Book a sound tech for soundcheck and the show |
| `row.X-12.title` | tehtävä · Logistiikka · P4 | tilassa ei ole: äänentoisto ja mikit tai tilassa ei ole: projektori, kangas ja striimaus |  | Kaluston toimitus, rakennusaika ja palautus | Gear delivery, build time and return |
| `row.X-13.title` | tehtävä · Tila · P3 | tilassa ei ole: äänentoisto ja mikit tai tilassa ei ole: projektori, kangas ja striimaus tai tilassa ei ole: lava ja lavavalot |  | Sähkö: riittävätkö ryhmät tekniikalle ja missä sähkökeskus on | Power: enough circuits for the tech, and where the fuse board is |
| `row.X-14.title` | tehtävä · Logistiikka · P2 | tilassa ei ole: lava ja lavavalot |  | Vuokraa lava ja valot | Rent a stage and lights |
| `row.X-15.title` | tehtävä · Logistiikka · P2 | tilassa ei ole: projektori, kangas ja striimaus |  | Vuokraa projektori ja kangas ja testaa läppärin liitännät | Rent a projector and screen, and test the laptop connections |
| `row.X-16.title` | tehtävä · Henkilöstö · P3 | tilassa ei ole: projektori, kangas ja striimaus ja tilassa ei ole: tilan teknikko paikalla |  | Etsi joku hoitamaan esitystekniikka ja striimi tapahtumapäivänä | Find someone to run AV and the stream on the day |
| `row.X-20.title` | tehtävä · Catering · P2 | tarjoilua on ja tilassa ei ole: keittiö tai tarjoilutila |  | Tilassa ei ole keittiötä, joten ruoka tulee valmiina – kerro tästä pitopalvelulle | The venue has no kitchen, so food arrives ready – tell the caterer |
| `row.X-21.title` | tehtävä · Logistiikka · P3 | tarjoilua on ja tilassa ei ole: keittiö tai tarjoilutila |  | Ilman keittiötä: miten ruoka lämmitetään, tarjoillaan ja tiskataan | Without a kitchen: how food is heated, served and washed up after |
| `row.X-22.title` | tehtävä · Catering · P1 · catering | tarjoilua on |  | Varaa pitopalvelu ja sovi menu ja hinta henkeä kohden | Book a caterer and agree the menu and price per head |
| `row.X-22.title.seminar` | tehtävä · Catering · P1 · catering | tarjoilua on ja tapahtumatyyppi: Seminaari |  | Kahvitus ja lounas henkilömäärän mukaan: sovi toimittajan tai tilan kanssa | Coffee and lunch for the headcount: agree with the supplier or venue |
| `row.X-22.title.venueKitchen` | tehtävä · Catering · P1 · catering | tarjoilua on ja tilassa on: keittiö tai tarjoilutila |  | Sovi tilan kanssa menu ja hinta henkeä kohden | Agree the menu and price per head with the venue |
| `row.X-23.title` | tehtävä · Viestintä · P3 · catering | tarjoilua on |  | Kerää erityisruokavaliot ja allergiat | Collect dietary needs and allergies |
| `row.X-24.title` | tehtävä · Catering · E−7 d · catering | tarjoilua on |  | Lopullinen henkilömäärä ja ruokavaliolista toimittajalle | Send the final headcount and dietary list to the caterer |
| `row.X-25.title` | tehtävä · Henkilöstö · P3 · catering | tarjoilua on ja Henkilökunta: Kaverit ja vapaaehtoiset |  | Kuka tarjoilee ja korjaa astiat – vai hoitaako pitopalvelu | Who serves and clears – or does the caterer |
| `row.X-26.title` | tehtävä · Catering · P3 | Henkilökunta: Palkattu henkilökunta |  | Varaa henkilökunnalle ruoka ja vesi ja laita ne budjettiin | Food and water for staff, in the budget |
| `row.X-30.title` | tehtävä · Tila · P1 | Alkoholi: Tuomme itse, ei myydä ja tilassa ei ole: anniskelulupa |  | Varmista, että tila sallii omat tai isännän tarjoamat juomat | Check the venue allows your own drinks or drinks served by the host |
| `row.X-31.title` | tehtävä · Turvallisuus · P1 · anniskelu | Alkoholi: Myymme itse ja tilassa ei ole: anniskelulupa |  | Järjestä anniskelu: luvanhaltija anniskelee hyväksytyssä tilassa tai haet määräaikaisen anniskeluluvan | Arrange the bar: a licence holder serves in an approved space, or you apply for a temporary licence |
| `row.X-32.title` | tehtävä · Henkilöstö · P3 | Alkoholi: Myymme itse |  | Baari: henkilökunta, varasto ja kuka vastaa kassasta | Bar: staff, stock and who handles the till |
| `row.X-33.title` | tehtävä · Turvallisuus · P3 | Alkoholi: Myymme itse tai Tila hoitaa anniskelun |  | Ikäraja 18 ja henkilöllisyyden tarkistus ovella | 18+ age limit and ID checks at the door |
| `row.X-34.title` | tehtävä · Viestintä · P3 | Alkoholi: Ei tarjoilla ja julkisessa tapahtumassa |  | Kerro ovi-infossa, että tapahtuma on kaikenikäisille | Say in the door info that the event is all ages |
| `row.X-40.title` | tehtävä · Logistiikka · P2 · extra_furnishing | tilassa ei ole: istuimet ja pöydät ja istumapaikkoja tarvitaan |  | Vuokraa tuolit ja pöydät | Rent chairs and tables |
| `row.X-40.title.exhibitors` | tehtävä · Logistiikka · P2 · extra_furnishing | tilassa ei ole: istuimet ja pöydät ja istumapaikkoja tarvitaan ja Näytteilleasettajat: kyllä |  | Vuokraa pöydät ja tuolit näytteilleasettajille | Rent tables and chairs for exhibitors |
| `row.X-41.title` | tehtävä · Logistiikka · P4 · extra_furnishing | tilassa ei ole: istuimet ja pöydät ja istumapaikkoja tarvitaan |  | Kalusteiden toimitus ja palautus | Furniture delivery and return |
| `row.X-42.title` | tehtävä · Logistiikka · P3 | Yleisö: Istuen |  | Istumajärjestys: rivit, näkyvyys ja mahdolliset varatut paikat | Seating: rows, sightlines and any reserved seats |
| `row.X-50.title` | tehtävä · Viestintä · P3 | tilassa ei ole: esteetön sisäänkäynti ja wc |  | Kerro esteettömyyden rajoitteista ennen kuin vieraat vastaavat tai ostavat lipun | Tell people about accessibility limits before they reply or buy a ticket |
| `row.X-51.title` | tehtävä · Henkilöstö · P3 | tilassa ei ole: esteetön sisäänkäynti ja wc |  | Suunnittele apu paikan päällä niille, jotka sitä tarvitsevat | Plan on-site help for those who need it |
| `row.X-60.title` | tehtävä · Logistiikka · P3 | tilassa ei ole: backstage tai pukuhuone ja livemusiikkia |  | Järjestä tilapäinen green room ja kerro siitä rider-vastauksessa | Set up a temporary green room and mention it in your rider reply |
| `row.X-70.title` | tehtävä · Logistiikka · P4 | tilassa ei ole: lastauspaikka ja pysäköinti |  | Lastaussuunnitelma: kantomatka ja ajat | Load-in plan: carrying distance and times |
| `row.X-80.title` | tehtävä · Henkilöstö · P3 | tilassa ei ole: tilan edustaja paikalla |  | Nimeä oma vastuuhenkilö paikalle koko tapahtuman ajaksi | Name your own person in charge on site for the whole event |
| `row.X-81.title` | tehtävä · Henkilöstö · P3 | tilassa ei ole: tilan teknikko paikalla ja ohjelmaa on ja ei: tapahtumatyypin palvelut: ääniteknikko tai valoteknikko ja tilassa on: äänentoisto ja mikit |  | Tapahtumapäivän teknikko: kuka ajaa äänet ja valot | Tech on the day: who runs sound and lights |
| `row.X-90.title` | tehtävä · Turvallisuus · E−14 d | 150 tai enemmän yhtä aikaa ja julkisessa tapahtumassa |  | Toimita pelastussuunnitelma pelastuslaitokselle | Submit a rescue plan to the fire and rescue service |
| `row.X-90.title.probable` | tehtävä · Turvallisuus · E−14 d | 150 tai enemmän yhtä aikaa ja julkisessa tapahtumassa ja ei: yli 200 yhtä aikaa |  | Toimita pelastussuunnitelma pelastuslaitokselle – pakollinen, jos paikalla on yhtä aikaa vähintään 200 | Submit a rescue plan to the fire and rescue service – required if there are 200 or more people at once |
| `row.X-91.title` | tehtävä · Turvallisuus · E−30 d | Tyhjä tila: kyllä ja Päättyy: kyllä ja ei: tapahtumatyyppi: Häät tai Yksityis­tilaisuus |  | Tee meluilmoitus kaupungille | File a noise notification with the city |
| `row.X-92.title` | tehtävä · Rahoitus · P2 · järjestäjän · ticket_sales | maksulliset liput |  | Päätä palautus- ja peruutusehdot ennen kuin myynti alkaa | Set refund and cancellation terms before sales open |
| `row.X-94.title` | tehtävä · Rahoitus · P2 · järjestäjän | Ilmoittautuminen: Maksullinen |  | Osallistumismaksut: laskutus tai maksutapa ja arvonlisävero | Participation fees: invoicing or payment method, and VAT |
| `row.X-95.title` | tehtävä · Logistiikka · P3 | livemusiikkia ja musiikkitapahtuma |  | Backline: mitä bändit tuovat, mikä on yhteistä ja kuka hankkii loput | Backline: what bands bring, what's shared and who sources the rest |
| `row.X-96.title` | tehtävä · Henkilöstö · P4 | Esitykset: Useampana – valitse viimeinen päivä |  | Esityspäivä {date}: ovi, paikannäyttäjät ja väliaika | Show day {date}: door, ushers and interval |
| `row.X-97.title` | tehtävä · Logistiikka · P2 · merch | Merch: kyllä |  | Merch: suunnittelu, tilausmäärät ja toimitusaika | Merch: design, quantities and delivery time |
| `row.X-98.title` | tehtävä · Tila · P2 · tilavuokra_muut | Rakennuspäivät: kyllä |  | Varaa tila myös edeltäville ja seuraaville päiville ja sovi, mitä saa jättää yöksi | Book the venue for the days before and after too, and agree what can stay overnight |
| `row.X-99.title` | tehtävä · Logistiikka · P2 · telineet | Ripustus: kyllä |  | Ripustus ja trussit: mitä ripustetaan, kuka ripustaa, kuormarajat ja tilan säännöt – tilaa ripustusfirmalta, ei PA-vuokraamosta | Rigging and truss: what hangs, who rigs it, load limits and venue rules – hire a rigging company, not a PA rental |
| `rule.always` | sääntösivu | — |  | aina | always |
| `rule.and` | sääntösivu | — |  | " ja " | " and " |
| `rule.deck.closed` | sääntösivu | — |  | yksityisessä tapahtumassa | at a private event |
| `rule.deck.public` | sääntösivu | — |  | julkisessa tapahtumassa | at a public event |
| `rule.leaf` | sääntösivu | — |  | {fact}: {value} | {fact}: {value} |
| `rule.leafAtLeast` | sääntösivu | — |  | {fact} vähintään: {value} | {fact} at least: {value} |
| `rule.leafNot` | sääntösivu | — |  | {fact} ei ole: {value} | {fact} is not: {value} |
| `rule.not` | sääntösivu | — |  | ei päde: {x} | not true: {x} |
| `rule.or` | sääntösivu | — |  | " tai " | " or " |
| `rule.venueNo` | sääntösivu | — |  | tilassa ei ole: {thing} | venue lacks: {thing} |
| `rule.venueYes` | sääntösivu | — |  | tilassa on: {thing} | venue has: {thing} |
| `section.audience` | section | — |  | Yleisö | Audience |
| `section.capabilities` | section | — |  | Tilan valmiudet | Venue check |
| `section.programme` | section | — |  | Ohjelma | Programme |
| `section.setup` | section | — |  | Järjestelyt | Setup |
| `section.venue` | section | — |  | Tila | Venue |
| `service.anniskelu` | service | — |  | anniskelu | bar service |
| `service.catering` | service | — |  | pitopalvelu | catering |
| `service.cleaning` | service | — |  | siivous | cleaning |
| `service.extra_furnishing` | service | — |  | lisäkalusto | extra furniture |
| `service.light_tech` | service | — |  | valoteknikko | lighting tech |
| `service.merch` | service | — |  | merch | merch |
| `service.printing` | service | — |  | printit | print |
| `service.safer_space` | service | — |  | häirintäyhdyshenkilö | harassment contact |
| `service.security` | service | — |  | järjestyksenvalvonta | security |
| `service.sound_tech` | service | — |  | ääniteknikko | sound tech |
| `service.telineet` | service | — |  | ripustus ja telineet | rigging and truss |
| `service.ticket_sales` | service | — |  | lipunmyynti | ticketing |
| `service.tilavuokra` | service | — |  | tilavuokra | venue hire |
| `service.tilavuokra_muut` | service | — |  | rakennus- ja purkupäivät | build and strike days |
| `statute.alkoholilaki.label` | lakiviite | — |  | Alkoholilaki 20 § | Alcohol Act, section 20 |
| `statute.alkoholilaki.note` | lakiviite | — |  | Luvanhaltija voi anniskella hyväksytyssä tilassa, kun siitä on ilmoitettu viimeistään kolme vuorokautta ennen. Uudelle määräaikaiselle anniskeluluvalle ei ole laissa määräaikaa, joten hae sitä heti. | A licence holder can serve in an approved space if it has been notified at least three days before. There's no statutory processing time for a new temporary licence, so apply right away. |
| `statute.avioliittolaki.label` | lakiviite | — |  | Avioliittolaki 11 ja 13 § | Marriage Act, sections 11 and 13 |
| `statute.avioliittolaki.note` | lakiviite | — |  | Todistus esteiden tutkinnasta annetaan aikaisintaan seitsemäntenä päivänä pyynnöstä, ja vihkiminen on tehtävä neljän kuukauden kuluessa. Pyyntö kannattaa siis tehdä aikaisintaan neljä kuukautta ja viimeistään noin kaksi viikkoa ennen vihkimistä. | The certificate is issued no earlier than the seventh day after the request, and the wedding must take place within four months. So request it no earlier than four months and no later than about two weeks before the wedding. |
| `statute.kokoontumislaki.label` | lakiviite | — |  | Kokoontumislaki 14 § | Assembly Act, section 14 |
| `statute.kokoontumislaki.note` | lakiviite | — |  | Ilmoitus tehdään poliisille viimeistään viisi vuorokautta ennen tilaisuutta. Pieni tilaisuus, joka ei vaadi järjestys-, turvallisuus- tai liikennejärjestelyjä, ei tarvitse ilmoitusta. Laki ei määrittele henkilömäärää. | The police must be notified at least five days before the event. A small event that needs no order, safety or traffic arrangements needs no notification. The law sets no headcount. |
| `statute.pelastuslaki.label` | lakiviite | — |  | Pelastuslaki 16 § ja asetus 407/2011 3 § | Rescue Act, section 16, and Government Decree 407/2011, section 3 |
| `statute.pelastuslaki.note` | lakiviite | — |  | Pelastussuunnitelma toimitetaan pelastuslaitokselle viimeistään 14 vuorokautta ennen tilaisuutta, kun paikalla on yhtä aikaa vähintään 200 ihmistä. Sama koskee avotulta, pyrotekniikkaa ja tavallista vaikeampaa poistumista. | A rescue plan must be submitted to the fire and rescue service at least 14 days before the event if 200 or more people are present at once. The same applies to open flames, pyrotechnics and unusually difficult evacuation. |
| `statute.ysl.label` | lakiviite | — |  | Ympäristönsuojelulaki 118 § | Environmental Protection Act, section 118 |
| `statute.ysl.note` | lakiviite | — |  | Meluilmoitus tehdään kunnan ympäristönsuojeluviranomaiselle viimeistään 30 vuorokautta ennen tapahtumaa, jos melun voi olettaa olevan erityisen häiritsevää. Kunta voi omissa määräyksissään lyhentää aikaa tai poistaa ilmoitusvelvollisuuden. Yksityishenkilön omista juhlista ei tarvitse ilmoittaa. | A noise notification goes to the municipal environmental authority at least 30 days before the event if the noise can be expected to be particularly disturbing. The municipality's own regulations can shorten the time or remove the requirement. Private individuals' own parties are exempt. |
| `type.haat` | type | — |  | Häät | Wedding |
| `type.keikka` | type | — |  | Keikka | Gig |
| `type.klubi` | type | — |  | Klubi | Club night |
| `type.kulttuuri` | type | — |  | Muu kulttuuri­tapahtuma | Other cultural event |
| `type.seminaari` | type | — |  | Seminaari | Seminar |
| `type.standup` | type | — |  | Stand-up | Stand-up |
| `type.teatteri` | type | — |  | Teatteri | Theatre |
| `type.yksityis` | type | — |  | Yksityis­tilaisuus | Private party |
| `type.yritys` | type | — |  | Yritys­tapahtuma | Corporate event |
| `ui.a11y.cardGroup` | käyttöliittymä · a11y | — |  | Kortti: {q} | Card: {q} |
| `ui.a11y.progress` | käyttöliittymä · a11y | — |  | Eteneminen | Progress |
| `ui.answers.back` | käyttöliittymä · answers | — |  | Takaisin suunnitelmaan | Back to the plan |
| `ui.answers.empty` | käyttöliittymä · answers | — |  | Ei mitään | None |
| `ui.answers.intro` | käyttöliittymä · answers | — |  | Napauta kysymystä, jos haluat muuttaa vastausta. Suunnitelma päivittyy heti. | Tap a question to change your answer. The plan updates straight away. |
| `ui.answers.later` | käyttöliittymä · answers | — |  | Myöhemmin | Later |
| `ui.answers.none` | käyttöliittymä · answers | — |  | Ei vastattu | Not answered |
| `ui.answers.title` | käyttöliittymä · answers | — |  | Vastauksesi | Your answers |
| `ui.brand` | käyttöliittymä · brand | — |  | Tuotantosuunnitelma | Production plan |
| `ui.cal.label` | käyttöliittymä · cal | — |  | Kalenteri | Calendar |
| `ui.cal.next` | käyttöliittymä · cal | — |  | Seuraava kuukausi | Next month |
| `ui.cal.prev` | käyttöliittymä · cal | — |  | Edellinen kuukausi | Previous month |
| `ui.cover.backToPlan` | käyttöliittymä · cover | — |  | Takaisin suunnitelmaan | Back to the plan |
| `ui.cover.continue` | käyttöliittymä · cover | — |  | Jatka kortteihin | Continue to the cards |
| `ui.cover.deckSize` | käyttöliittymä · cover | — |  | {n} korttia | {n} cards |
| `ui.cover.deckSizeApprox` | käyttöliittymä · cover | — |  | Noin 15 korttia | About 15 cards |
| `ui.cover.disclaimer` | Vastuunrajaus – ehdotus, ei vielä päätetty | — |  | Muistilista, ei viranomaisneuvontaa. Tarkista luvat ja ilmoitukset aina itse. | A checklist, not official advice. Always check permits and notifications yourself. |
| `ui.cover.head` | käyttöliittymä · cover | — |  | Montako ihmistä on paikalla yhtä aikaa, kun väkeä on eniten? | How many people at once, at the busiest point? |
| `ui.cover.headcountPlaceholder` | käyttöliittymä · cover | — |  | esim. 120 | e.g. 120 |
| `ui.cover.headcountUnit` | käyttöliittymä · cover | — |  | henkeä | people |
| `ui.cover.intro` | käyttöliittymä · cover | — |  | Vastaa muutamaan korttiin ja saat tapahtumallesi tuotantosuunnitelman: tehtävät, vastuut ja määräpäivät. Mihin tahansa tilaan. | Answer a few cards and get a production plan for your event: tasks, owners and deadlines. For any venue. |
| `ui.intro.p1` | intro-sivu · kappale 1 | uusi kävijä |  | Tuotantosuunnitelma on työkalu tapahtumien järjestäjille. Se kokoaa yhteen tapahtuman tuotannon koko kaaren. | The production plan is a tool for event organisers. It brings together the whole arc of producing an event. |
| `ui.intro.p2` | intro-sivu · kappale 2 | uusi kävijä |  | Suunnitelma on jaettu tapahtuman järjestämisen osa-alueisiin, ja jokaisen alla on joukko yksittäisiä tehtäviä. Olemme koonneet valmiiksi tehtäviä, jotka Jonkun™ olisi mielestämme hyvä hoitaa – ja tietysti hyvissä ajoin. | The plan is split into the areas of running an event, and each area holds a set of individual tasks. We've put together a list of tasks that, in our view, Someone™ should take care of – preferably well in advance. |
| `ui.intro.start` | intro-sivu · painike | uusi kävijä |  | Aloita | Get started |
| `ui.cover.past` | käyttöliittymä · cover | — |  | päivä on jo mennyt | that date has passed |
| `ui.cover.presetNote` | käyttöliittymä · cover | — |  | Esivalittu tapahtumatyypin mukaan. Voit vaihtaa. | Preselected for this event type. You can change it. |
| `ui.cover.private` | käyttöliittymä · cover | — |  | Yksityinen tapahtuma | Private event |
| `ui.cover.promise` | käyttöliittymä · cover | — |  | ilmainen · ei kirjautumista · mihin tahansa tilaan | free · no login · any venue |
| `ui.cover.public` | käyttöliittymä · cover | — |  | Julkinen tapahtuma | Public event |
| `ui.cover.resetAsk` | käyttöliittymä · cover | — |  | Aloitetaanko alusta? Nykyinen suunnitelma poistetaan tästä selaimesta. | Start over? Your current plan is removed from this browser. |
| `ui.cover.resetLink` | käyttöliittymä · cover | — |  | Aloita uusi suunnitelma | Start a new plan |
| `ui.cover.resetNo` | käyttöliittymä · cover | — |  | Jatka nykyistä | Keep this one |
| `ui.cover.resetYes` | käyttöliittymä · cover | — |  | Kyllä, aloita alusta | Yes, start over |
| `ui.cover.runway` | käyttöliittymä · cover | — |  | {n} päivää aikaa | {n} days to go |
| `ui.cover.start` | käyttöliittymä · cover | — |  | Aloita | Start |
| `ui.cover.title` | käyttöliittymä · cover | — |  | Tuotantosuunnitelma | Production plan |
| `ui.cover.what` | käyttöliittymä · cover | — |  | Mitä järjestät? | What are you organising? |
| `ui.cover.when` | käyttöliittymä · cover | — |  | Milloin? | When? |
| `ui.deck.capCount` | käyttöliittymä · deck | — |  | {i} / {n} | {i} / {n} |
| `ui.deck.exit` | käyttöliittymä · deck | — |  | Tallenna ja lopeta | Save and exit |
| `ui.deck.has` | käyttöliittymä · deck | — |  | On | Yes |
| `ui.deck.hasNot` | käyttöliittymä · deck | — |  | Ei | No |
| `ui.deck.later` | käyttöliittymä · deck | — |  | Myöhemmin | Later |
| `ui.deck.no` | käyttöliittymä · deck | — |  | Ei | No |
| `ui.deck.progress` | käyttöliittymä · deck | — |  | {i} / {n} | {i} / {n} |
| `ui.deck.progressLive` | käyttöliittymä · deck | — |  | {section}, kortti {i} / {n} | {section}, card {i} of {n} |
| `ui.deck.undo` | käyttöliittymä · deck | — |  | Kumoa | Undo |
| `ui.deck.unknown` | käyttöliittymä · deck | — |  | En tiedä | Not sure |
| `ui.deck.yes` | käyttöliittymä · deck | — |  | Kyllä | Yes |
| `ui.exit.note` | käyttöliittymä · exit | — |  | Voit sulkea tämän välilehden. Mitään ei ole lähetetty kenellekään. | You can close this tab. Nothing has been sent to anyone. |
| `ui.exit.resume` | käyttöliittymä · exit | — |  | Jatka | Continue |
| `ui.exit.text` | käyttöliittymä · exit | — |  | Suunnitelmasi on tallessa tässä selaimessa. Kun palaat samalla laitteella, jatkat siitä, mihin jäit. | Your plan is saved in this browser. Come back on the same device to pick up where you left off. |
| `ui.exit.title` | käyttöliittymä · exit | — |  | Tallennettu. | Saved. |
| `ui.export.button` | käyttöliittymä · export | — |  | Lataa taulukkona | Download as a spreadsheet |
| `ui.export.filename` | käyttöliittymä · export | — |  | tuotantosuunnitelma | production-plan |
| `ui.export.owner.later` | käyttöliittymä · export | — |  | myöhemmin | later |
| `ui.export.owner.me` | käyttöliittymä · export | — |  | minä | me |
| `ui.export.owner.none` | käyttöliittymä · export | — |  | ei tarvita | not needed |
| `ui.export.owner.venue` | käyttöliittymä · export | — |  | tila | venue |
| `ui.keys.allMine` | käyttöliittymä · keys | — |  | kaikki minun | all mine |
| `ui.keys.answer` | käyttöliittymä · keys | — |  | vastaa | answer |
| `ui.keys.decide` | käyttöliittymä · keys | — |  | päätä | decide |
| `ui.keys.exit` | käyttöliittymä · keys | — |  | tallenna ja lopeta | save and exit |
| `ui.keys.later` | käyttöliittymä · keys | — |  | myöhemmin | later |
| `ui.keys.oneByOne` | käyttöliittymä · keys | — |  | yksitellen | one by one |
| `ui.keys.title` | käyttöliittymä · keys | — |  | Näppäimistöllä | Keyboard |
| `ui.keys.undo` | käyttöliittymä · keys | — |  | kumoa | undo |
| `ui.nologin` | käyttöliittymä · nologin | — |  | Ei kirjautumista | No login |
| `ui.own.allCat` | käyttöliittymä · own | — |  | Tila hoitaa kaikki | The venue handles all of them |
| `ui.own.allMine` | käyttöliittymä · own | — |  | Kaikki minun | All mine |
| `ui.own.catIndex` | käyttöliittymä · own | — |  | Kokonaisuus {i} / {n} | Area {i} of {n} |
| `ui.own.catIntro` | käyttöliittymä · own | — |  | {n} tehtävää, kaikki oletuksena sinun. | {n} tasks, all yours by default. |
| `ui.own.catLocked` | käyttöliittymä · own | — |  | {n} niistä on aina järjestäjän. | {n} of them are always the organiser's. |
| `ui.own.catLockedOne` | käyttöliittymä · own | — |  | Yksi on aina järjestäjän. | One is always the organiser's. |
| `ui.own.catProgress` | käyttöliittymä · own | — |  | {cat} · {n} tehtävää | {cat} · {n} tasks |
| `ui.own.catStatutory` | käyttöliittymä · own | — |  | {n} niistä on lakisääteisiä. | {n} of them are statutory. |
| `ui.own.catStatutoryOne` | käyttöliittymä · own | — |  | Yksi niistä on lakisääteinen. | One of them is statutory. |
| `ui.own.ctx.default` | käyttöliittymä · own | — |  | Oletuksena sinä. Pyyhkäise oikealle, jos se pitää paikkansa. | Default: you. Swipe right if that's right. |
| `ui.own.ctx.locked` | käyttöliittymä · own | — |  | Tämän voi tehdä vain järjestäjä. Sitä ei voi antaa tilalle. | Only the organiser can do this. It can't be handed to the venue. |
| `ui.own.deal` | käyttöliittymä · own | — |  | Käy tehtävät läpi yksitellen | Go through the tasks one by one |
| `ui.own.later` | käyttöliittymä · own | — |  | Myöhemmin | Later |
| `ui.own.mine` | käyttöliittymä · own | — |  | Minun | Mine |
| `ui.own.more` | käyttöliittymä · own | — |  | + {n} lisää | + {n} more |
| `ui.own.notNeeded` | käyttöliittymä · own | — |  | Ei tarvita | Not needed |
| `ui.own.okMine` | käyttöliittymä · own | — |  | Selvä, minun | OK, mine |
| `ui.own.organiser` | käyttöliittymä · own | — |  | järjestäjän | organiser's |
| `ui.own.rest` | käyttöliittymä · own | — |  | Tila hoitaa loput | The venue handles the rest |
| `ui.own.restMine` | käyttöliittymä · own | — |  | Loput minun | The rest are mine |
| `ui.own.taskProgress` | käyttöliittymä · own | — |  | {i} / {n} · {mine} minun | {i} / {n} · {mine} mine |
| `ui.own.title` | käyttöliittymä · own | — |  | Kuka hoitaa mitä? | Who does what? |
| `ui.own.wholeCat` | käyttöliittymä · own | — |  | Tila hoitaa koko kokonaisuuden | The venue handles the whole area |
| `ui.plan.bannerShort` | käyttöliittymä · plan | — |  | {n} päivää on vähän, mutta riittää. Suunnitelmassa on kaksi vaihetta ja päivämäärät päivän tarkkuudella. Myöhässä olevat tehtävät näkyvät punaisella eivätkä katoa. | {n} days is tight, but doable. The plan has two phases and dates to the day. Overdue tasks show in red and don't disappear. |
| `ui.plan.bannerTwo` | käyttöliittymä · plan | — |  | Alle kuusi viikkoa aikaa, joten suunnitelmassa on kaksi vaihetta: Nyt ja Tapahtumaviikko. Kaikki, mikä ei kuulu tapahtumaviikkoon, tehdään nyt. | Under six weeks to go, so the plan has two phases: Now and Event week. Everything that isn't in event week happens now. |
| `ui.plan.catCount` | käyttöliittymä · plan | — |  | {n} tehtävää | {n} tasks |
| `ui.plan.chip.late` | käyttöliittymä · plan | — |  | myöhässä | overdue |
| `ui.plan.chip.later` | käyttöliittymä · plan | — |  | myöhemmin | later |
| `ui.plan.chip.notNeeded` | käyttöliittymä · plan | — |  | ei tarvita | not needed |
| `ui.plan.chip.organiser` | käyttöliittymä · plan | — |  | järjestäjän | organiser's |
| `ui.plan.chip.owner` | käyttöliittymä · plan | — |  | Tila hoitaa | Venue handles |
| `ui.plan.chip.prepareSign` | käyttöliittymä · plan | — |  | sinä allekirjoitat | you sign |
| `ui.plan.chip.sign` | käyttöliittymä · plan | — |  | sinä allekirjoitat | you sign |
| `ui.plan.chip.statutory` | käyttöliittymä · plan | — |  | lakisääteinen | statutory |
| `ui.plan.count` | käyttöliittymä · plan | — |  | {n} tehtävää | {n} tasks |
| `ui.plan.date.by` | käyttöliittymä · plan | — |  | viim. {date} | by {date} |
| `ui.plan.date.now` | käyttöliittymä · plan | — |  | nyt | now |
| `ui.plan.date.pending` | käyttöliittymä · plan | — |  | ratkeaa, kun valitset tilan | set once you pick a venue |
| `ui.plan.date.range` | käyttöliittymä · plan | — |  | {from}–{to} | {from}–{to} |
| `ui.plan.date.was` | käyttöliittymä · plan | — |  | oli {date} | was {date} |
| `ui.plan.days` | käyttöliittymä · plan | — |  | {n} päivää aikaa | {n} days to go |
| `ui.plan.disclaimer` | Vastuunrajaus – ehdotus, ei vielä päätetty | — |  | Suunnitelma on muistilista, ei viranomais- tai lakineuvontaa. Olemme koonneet siihen tavallisimmat luvat, ilmoitukset ja määräajat, mutta jokainen tapahtuma ja kunta on erilainen, emmekä voi luvata, että kaikki on mukana. Tarkista oman tapahtumasi velvoitteet viranomaisilta ja tilalta. Emme vastaa seurauksista, jos jokin velvoite puuttuu suunnitelmasta tai jää tekemättä. | This plan is a checklist, not official or legal advice. It covers the most common permits, notifications and deadlines, but every event and municipality is different, and we can't promise everything is included. Check your event's obligations with the authorities and the venue. We aren't liable if an obligation is missing from the plan or left undone. |
| `ui.plan.done` | käyttöliittymä · plan | — |  | {n} tehty | {n} done |
| `ui.plan.doneLabel` | käyttöliittymä · plan | — |  | Tehty: {title} | Done: {title} |
| `ui.plan.editAnswers` | käyttöliittymä · plan | — |  | Muuta vastauksia | Change answers |
| `ui.plan.editCover` | käyttöliittymä · plan | — |  | Muuta perusasioita | Change the basics |
| `ui.plan.exit` | käyttöliittymä · plan | — |  | Tallenna ja lopeta | Save and exit |
| `ui.plan.eyebrow` | käyttöliittymä · plan | — |  | Tuotantosuunnitelma | Production plan |
| `ui.plan.late.advice` | käyttöliittymä · plan | — |  | Myöhässä tehty ilmoitus käsitellään usein, mutta ei aina. Soita viranomaiselle ennen kuin teet mitään muuta. | A late notification is often still processed, but not always. Call the authority before you do anything else. |
| `ui.plan.late.chip` | käyttöliittymä · plan | — |  | {n} määräaikaa mennyt | {n} deadlines passed |
| `ui.plan.late.chipOne` | käyttöliittymä · plan | — |  | 1 määräaika mennyt | 1 deadline passed |
| `ui.plan.late.line` | käyttöliittymä · plan | — |  | {title} piti tehdä viimeistään {date}. | {title} was due by {date}. |
| `ui.plan.late.note` | käyttöliittymä · plan | — |  | Tarkista nämä tänään. | Check these today. |
| `ui.plan.legend.marked` | käyttöliittymä · plan | — |  | merkitsit tilalle | marked for the venue |
| `ui.plan.legend.pending` | käyttöliittymä · plan | — |  | ratkeaa, kun valitset tilan | set once you pick a venue |
| `ui.plan.legend.statutory` | käyttöliittymä · plan | — |  | lakisääteinen määräaika | statutory deadline |
| `ui.plan.matrix.empty` | käyttöliittymä · plan | — |  | – | – |
| `ui.plan.nudge.eyebrow` | käyttöliittymä · plan | — |  | Tila valitsematta | No venue yet |
| `ui.plan.nudge.later` | käyttöliittymä · plan | — |  | Päätän myöhemmin | I'll decide later |
| `ui.plan.nudge.own` | käyttöliittymä · plan | — |  | Minulla on tila | I have a venue |
| `ui.plan.nudge.text` | käyttöliittymä · plan | — |  | {n} tehtävää odottaa tilaa. Ne saavat määräpäivän, kun tila on tiedossa. Kaikki muu on jo aikataulussa. | {n} tasks are waiting for a venue. They get a deadline once the venue is known. Everything else is already scheduled. |
| `ui.plan.own` | käyttöliittymä · plan | — |  | Kuka hoitaa mitä? | Who does what? |
| `ui.plan.people` | käyttöliittymä · plan | — |  | {head} henkeä | {head} people |
| `ui.plan.phaseCount` | käyttöliittymä · plan | — |  | {n} tehtävää | {n} tasks |
| `ui.plan.phaseDone` | käyttöliittymä · plan | — |  | {n} tehty | {n} done |
| `ui.plan.prompt.close` | käyttöliittymä · plan | — |  | Sulje | Close |
| `ui.plan.summary` | käyttöliittymä · plan | — |  | Yhteenveto | Summary |
| `ui.plan.suppressed` | käyttöliittymä · plan | — |  | Tila hoitaa nämä, joten ne eivät ole suunnitelmassa ({n}) | The venue handles these, so they're not in the plan ({n}) |
| `ui.plan.unknownPrompt.text` | käyttöliittymä · plan | — |  | Et ollut varma {n} asiasta tilassasi. Yksi puhelu tilalle ratkaisee ne. | You weren't sure about {n} things at your venue. One call to the venue settles them. |
| `ui.plan.venueLabel.none` | käyttöliittymä · plan | — |  | tila valitsematta | no venue yet |
| `ui.plan.venueLabel.own` | käyttöliittymä · plan | — |  | oma tila | own venue |
| `ui.plan.why` | käyttöliittymä · plan | — |  | Miksi tämä on täällä? | Why is this here? |
| `ui.plan.whyClose` | käyttöliittymä · plan | — |  | Sulje | Close |
| `ui.privacy.close` | käyttöliittymä · privacy | — |  | Sulje | Close |
| `ui.privacy.delete.text` | käyttöliittymä · privacy | — |  | Aloita alusta poistaa suunnitelman tästä selaimesta heti. Sama tapahtuu, kun tyhjennät selaimen sivustotiedot. | Start over removes the plan from this browser at once. Clearing the browser's site data does the same. |
| `ui.privacy.delete.title` | käyttöliittymä · privacy | — |  | Suunnitelman poistaminen | Deleting your plan |
| `ui.privacy.intro` | käyttöliittymä · privacy | — |  | Työkalu ei vaadi tiliä eikä tunnista sinua. Mitään ei lähetetä mihinkään. | The tool needs no account and doesn't identify you. Nothing is sent anywhere. |
| `ui.privacy.link` | käyttöliittymä · privacy | — |  | Tietosuoja | Privacy |
| `ui.privacy.stored.none` | käyttöliittymä · privacy | — |  | Ei evästeitä, seurantaa, kolmansien osapuolten skriptejä eikä palvelinta. Sivu ei tee yhtään verkkopyyntöä sen jälkeen, kun se on ladattu. | No cookies, tracking, third-party scripts or server. The page makes no network requests once it has loaded. |
| `ui.privacy.stored.plan` | käyttöliittymä · privacy | — |  | Suunnitelmasi: tapahtuman tyyppi, päivämäärä ja henkilömäärä, vastauksesi kortteihin, valitsemasi vastuut ja merkitsemäsi tehtävät. Se tallentuu vain tämän selaimen omaan muistiin tällä laitteella. Nimeäsi tai yhteystietojasi ei kysytä. | Your plan: event type, date and headcount, your card answers, the owners you picked and the tasks you ticked off. It is stored only in this browser's own storage on this device. Your name or contact details are never asked for. |
| `ui.privacy.stored.title` | käyttöliittymä · privacy | — |  | Mitä tallennetaan | What is stored |
| `ui.privacy.title` | käyttöliittymä · privacy | — |  | Tietosuoja | Privacy |
| `ui.reveal.allYours` | käyttöliittymä · reveal | — |  | Kaikki tehtävät ovat sinun. Voit jakaa niitä suunnitelmassa myöhemmin. | All tasks are yours. You can share them out later in the plan. |
| `ui.reveal.cats` | käyttöliittymä · reveal | — |  | kokonaisuutta | areas |
| `ui.reveal.days` | käyttöliittymä · reveal | — |  | päivää aikaa | days to go |
| `ui.reveal.done` | käyttöliittymä · reveal | — |  | Valmis | Done |
| `ui.reveal.eyebrow` | käyttöliittymä · reveal | — |  | Se oli viimeinen kortti. | That was the last card. |
| `ui.reveal.go` | käyttöliittymä · reveal | — |  | Näytä suunnitelma | Show the plan |
| `ui.reveal.marked` | käyttöliittymä · reveal | — |  | {n} tehtävää merkitsit jo tilalle. | You've already marked {n} tasks for the venue. |
| `ui.reveal.note` | käyttöliittymä · reveal | — |  | Suunnitelma pysyy tässä selaimessa. Lopussa voit tallentaa sen myös tiedostona. | Your plan stays in this browser. At the end you can also save it as a file. |
| `ui.reveal.pending` | käyttöliittymä · reveal | — |  | {n} tehtävää odottaa vielä tilan valintaa. | {n} tasks are still waiting for a venue. |
| `ui.reveal.statutory` | käyttöliittymä · reveal | — |  | lakisääteistä määräaikaa | statutory deadlines |
| `ui.reveal.tasks` | käyttöliittymä · reveal | — |  | tehtävää | tasks |
| `ui.reveal.title` | käyttöliittymä · reveal | — |  | Vastauksistasi syntyi suunnitelma. | Your answers made a plan. |
| `ui.stamp.allMine` | käyttöliittymä · stamp | — |  | KAIKKI MINUN | ALL MINE |
| `ui.stamp.has` | käyttöliittymä · stamp | — |  | ON | YES |
| `ui.stamp.hasNot` | käyttöliittymä · stamp | — |  | EI | NO |
| `ui.stamp.mine` | käyttöliittymä · stamp | — |  | MINUN | MINE |
| `ui.stamp.no` | käyttöliittymä · stamp | — |  | EI | NO |
| `ui.stamp.notNeeded` | käyttöliittymä · stamp | — |  | EI TARVITA | NOT NEEDED |
| `ui.stamp.notYet` | käyttöliittymä · stamp | — |  | EI VIELÄ | NOT YET |
| `ui.stamp.ok` | käyttöliittymä · stamp | — |  | SELVÄ | OK |
| `ui.stamp.unknown` | käyttöliittymä · stamp | — |  | EN TIEDÄ | NOT SURE |
| `ui.stamp.up` | käyttöliittymä · stamp | — |  | TILA HOITAA | VENUE HANDLES |
| `ui.stamp.yes` | käyttöliittymä · stamp | — |  | KYLLÄ | YES |
| `ui.summary.allYours.eyebrow` | käyttöliittymä · summary | — |  | Kaikki tehtävät sinulla | All tasks with you |
| `ui.summary.allYours` | käyttöliittymä · summary | — |  | Et merkinnyt tilalle mitään. Voit palata milloin tahansa ja siirtää tehtäviä tilalle. | You didn't mark anything for the venue. You can come back any time and move tasks to the venue. |
| `ui.summary.backToPlan` | käyttöliittymä · summary | — |  | Takaisin suunnitelmaan | Back to the plan |
| `ui.summary.bar.later` | käyttöliittymä · summary | — |  | myöhemmin | later |
| `ui.summary.bar.me` | käyttöliittymä · summary | — |  | minä | me |
| `ui.summary.bar.none` | käyttöliittymä · summary | — |  | ei tarvita | not needed |
| `ui.summary.bar.venue` | käyttöliittymä · summary | — |  | tila | venue |
| `ui.summary.confirmWithVenue` | käyttöliittymä · summary | — |  | Käy nämä {n} tehtävää läpi tilan kanssa ennen kuin allekirjoitat sopimuksen. | Go through these {n} tasks with the venue before you sign the contract. |
| `ui.summary.done` | käyttöliittymä · summary | — |  | Valmis. Voit sulkea tämän. | Done. You can close this. |
| `ui.summary.editOwners` | käyttöliittymä · summary | — |  | Muokkaa vastuita | Edit owners |
| `ui.summary.marked` | käyttöliittymä · summary | — |  | Nämä merkitsit tilalle | You marked these for the venue |
| `ui.summary.meta` | käyttöliittymä · summary | — |  | {type}, {date} · {n} tehtävää · {days} päivää | {type}, {date} · {n} tasks · {days} days |
| `ui.summary.title` | käyttöliittymä · summary | — |  | Tässä suunnitelmasi. | Here's your plan. |
| `ui.toast.reset` | käyttöliittymä · toast | — |  | Aloitettu alusta | Started over |
| `value.no` | value | — |  | ei | no |
| `value.unknown` | value | — |  | en tiedä | not sure |
| `value.yes` | value | — |  | kyllä | yes |
| `venue.access` | tilan asia (Varmista tilalta: …) | — |  | esteetön sisäänkäynti ja wc | step-free access and an accessible toilet |
| `venue.av` | tilan asia (Varmista tilalta: …) | — |  | projektori, kangas ja striimaus | projector, screen and streaming |
| `venue.backstage` | tilan asia (Varmista tilalta: …) | — |  | backstage tai pukuhuone | backstage or dressing room |
| `venue.bare` | tilan asia (Varmista tilalta: …) | — |  | tyhjä tila | an empty venue |
| `venue.capacity` | tilan asia (Varmista tilalta: …) | — |  | kapasiteetti väkimäärällesi | capacity for your crowd |
| `venue.host` | tilan asia (Varmista tilalta: …) | — |  | tilan edustaja paikalla | a venue contact on site |
| `venue.kitchen` | tilan asia (Varmista tilalta: …) | — |  | keittiö tai tarjoilutila | kitchen or catering area |
| `venue.licence` | tilan asia (Varmista tilalta: …) | — |  | anniskelulupa | alcohol licence |
| `venue.loadin` | tilan asia (Varmista tilalta: …) | — |  | lastauspaikka ja pysäköinti | loading spot and parking |
| `venue.pa` | tilan asia (Varmista tilalta: …) | — |  | äänentoisto ja mikit | PA and mics |
| `venue.seating` | tilan asia (Varmista tilalta: …) | — |  | istuimet ja pöydät | chairs and tables |
| `venue.stage` | tilan asia (Varmista tilalta: …) | — |  | lava ja lavavalot | stage and stage lighting |
| `venue.tech` | tilan asia (Varmista tilalta: …) | — |  | tilan teknikko paikalla | a venue technician on site |
| `why.answered` | miksi-rivi (tehtävän alla) | — |  | Suunnitelmassa, koska vastasit: {answers} | In the plan because you answered: {answers} |
| `why.askedBecause` | miksi-rivi (tehtävän alla) | — |  | Kysytään, koska {reasons} | Asked because {reasons} |
| `why.base` | miksi-rivi (tehtävän alla) | — |  | Kuuluu jokaiseen tapahtumaan | Part of every event |
| `why.base.closed` | miksi-rivi (tehtävän alla) | — |  | Kuuluu jokaiseen yksityiseen tapahtumaan | Part of every private event |
| `why.base.public` | miksi-rivi (tehtävän alla) | — |  | Kuuluu jokaiseen julkiseen tapahtumaan | Part of every public event |
| `why.contractual` | miksi-rivi (tehtävän alla) | — |  | Kiinteä määräaika, ei lakisääteinen | Fixed deadline, not statutory |
| `why.earliest` | miksi-rivi (tehtävän alla) | — |  | Aikaisintaan {date} | No earlier than {date} |
| `why.headcount` | miksi-rivi (tehtävän alla) | — |  | Väkimäärä: {head} yhtä aikaa | Headcount: {head} at once |
| `why.impact.adds` | miksi-rivi (tehtävän alla) | — |  | Kyllä-vastaus lisää: {titles} | A yes adds: {titles} |
| `why.impact.more` | miksi-rivi (tehtävän alla) | — |  | + {n} muuta | + {n} more |
| `why.impact.removes` | miksi-rivi (tehtävän alla) | — |  | Ei-vastaus poistaa {n} tehtävää | A no removes {n} tasks |
| `why.locked` | miksi-rivi (tehtävän alla) | — |  | Tämän voi tehdä vain järjestäjä | Only the organiser can do this |
| `why.noVenueSecurity` | Kaikki tilat | — |  | Tila ei hoida järjestyksenvalvontaa, koska tilan edustaja ei ole paikalla. | The venue doesn't handle security because no venue contact is on site. |
| `why.notice` | miksi-rivi (tehtävän alla) | — |  | Ilmoitus viimeistään {date} | Notify by {date} |
| `why.offsetAfter` | miksi-rivi (tehtävän alla) | — |  | {n} päivää tapahtuman jälkeen | {n} days after the event |
| `why.offsetBefore` | miksi-rivi (tehtävän alla) | — |  | {n} päivää ennen tapahtumaa | {n} days before the event |
| `why.pending` | miksi-rivi (tehtävän alla) | — |  | Ratkeaa, kun vastaat: {questions} | Settled once you answer: {questions} |
| `why.phaseDate` | miksi-rivi (tehtävän alla) | — |  | {phase}: {date} | {phase}: {date} |
| `why.prepareSign` | miksi-rivi (tehtävän alla) | — |  | Viranomaisilmoitus – allekirjoitus on sinun | Official notification – you sign it |
| `why.profile` | miksi-rivi (tehtävän alla) | — |  | Tämäntyyppisissä tapahtumissa tarvitaan yleensä: {service} | Events like this usually need: {service} |
| `why.removeIfAnswer` | miksi-rivi (tehtävän alla) | — |  | Poistuu, jos vaihdat vastausta kortilla: {cards} | Drops out if you change your answer on: {cards} |
| `why.removeIfVenue` | miksi-rivi (tehtävän alla) | — |  | Poistuu, jos tilassa on: {things} | Drops out if the venue has: {things} |
| `why.rule` | miksi-rivi (tehtävän alla) | — |  | sääntö {id} | rule {id} |
| `why.statute` | miksi-rivi (tehtävän alla) | — |  | Määräaika tulee laista: {statute} | The deadline comes from law: {statute} |
| `why.statute.caveat` | Vastuunrajaus – ehdotus, ei vielä päätetty | — |  | Kunnan omat määräykset ja lakimuutokset voivat muuttaa määräaikaa. Varmista se viranomaiselta. | Local regulations and changes in the law can change the deadline. Confirm it with the authority. |
| `why.statute.reviewed` | miksi-rivi (tehtävän alla) | — |  | tarkistettu {date} | checked {date} |
| `why.suppressed` | miksi-rivi (tehtävän alla) | — |  | Ei suunnitelmassa, koska tilassa on: {things} | Not in the plan because the venue has: {things} |
| `why.type` | miksi-rivi (tehtävän alla) | — |  | Kuuluu tapahtumatyyppiin: {type} | Part of this event type: {type} |
| `why.unknown` | miksi-rivi (tehtävän alla) | — |  | Et tiennyt, onko tilassa tätä. Yksi puhelu tilalle ratkaisee – jos on, tehtävä poistuu. | You weren't sure whether the venue has this. One call to the venue settles it – if it does, the task drops out. |
| `why.upCard` | miksi-rivi (tehtävän alla) | — |  | Merkitsit kortilla {card}: tila hoitaa | On the {card} card you marked: the venue handles it |
| `why.venueUnknown` | miksi-rivi (tehtävän alla) | — |  | Vastasit kortilla {card}: en tiedä | On the {card} card you answered: not sure |
| `row.SU-01.title` | kestävyys · tehtävä | — |  | Tarjoile oikeilla astioilla tai järjestä palautettavat mukit | Serve on real tableware or agree on returnable cups |
| `row.SU-02.title` | kestävyys · tehtävä | — |  | Sovi etukäteen, minne hävikkiruoka menee | Agree in advance where surplus food goes |
| `row.SU-03.title` | kestävyys · tehtävä | — |  | Vesikannut ja lasit tiskille pullovesien sijaan | Water jugs and glasses at the bar instead of bottled water |
| `row.SU-04.title` | kestävyys · tehtävä | — |  | Lajittelupisteet: bio, pahvi, lasi ja sekajäte – ja kerro auttajille, mikä menee minne | Sorting points: bio, cardboard, glass and mixed – and tell helpers what goes where |
| `row.SU-05.title` | kestävyys · tehtävä | — |  | Kerää pantilliset pullot ja tölkit talteen | Collect deposit bottles and cans |
| `row.SU-06.title` | kestävyys · tehtävä | — |  | Somisteet: lainaa, vuokraa tai kysy kukkakaupasta ylijäämäkukkia ennen kuin ostat, ja sovi kuka vie ne pois | Decor: borrow, rent or ask a florist for surplus flowers before buying, and agree who takes it away |
| `row.SU-07.title` | kestävyys · tehtävä | — |  | Kerro ovi-infossa lähimmät ratikka-, bussi- ja kaupunkipyöräpysäkit | List the nearest tram, bus and city bike stops in the door info |
| `row.SU-08.title` | kestävyys · tehtävä | — |  | Painata vain sen verran julisteita kuin ehditte oikeasti levittää | Print only as many posters as you'll actually put up |
| `row.SU-09.title` | kestävyys · tehtävä | — |  | Mitoita merch ennakkotilausten tai aiemman myynnin mukaan, älä arvaa | Size the merch order on pre-orders or past sales, don't guess |
| `row.SU-10.title` | kestävyys · tehtävä | — |  | Niputa esiintyjien kuljetukset ja kalusto samaan kyytiin | Combine performer transport and gear into shared runs |
| `row.SU-11.title` | kestävyys · tehtävä | — |  | Sovi, kuka sammuttaa valot, tekniikan ja ilmanvaihdon lopuksi | Agree who switches off lights, tech and ventilation at the end |
| `row.SU-12.title` | kestävyys · tehtävä | — |  | Kerää nimikylttien kotelot ja nauhat takaisin ovella | Collect name badge holders and lanyards at the door |
| `row.SU-13.title` | kestävyys · tehtävä | — |  | Tee kasvisvaihtoehdosta oletus ja liha lisävalinnaksi | Make vegetarian the default and meat the add-on |
| `row.SU-14.title` | kestävyys · tehtävä | — |  | Kirjaa kestävät valinnat muistiin | Write down your sustainable choices |
| `row.SU-15.title` | kestävyys · tehtävä | — |  | Valitse esiintyjien majoitus kävelymatkan päästä tilasta | Book performer accommodation within walking distance of the venue |
| `row.SU-99.title` | kestävyys · tehtävä | — |  | Arvaa tapahtuman päästöt ja ilmoita ne kolmen desimaalin tarkkuudella | Guess the event's emissions and report them to three decimal places |
| `ui.plan.chip.sustainable` | suunnitelma · SU-tehtävän sirpale | — |  | kestävä valinta | sustainable choice |
| `ui.plan.sustainability.note` | suunnitelma · alaosa, kun SU-tehtäviä on | — |  | Jokainen näistä säästää myös rahaa. Hiilikompensaatioista sitä ei voi sanoa. | Every one of these also saves money. You can't say that about carbon offsets. |
| `why.SU-01` | kestävyys · miksi-rivi | — |  | Kertakäyttöroska on siivouksen suurin yksittäinen työ. | Disposable waste is the biggest single job at clean-up. |
| `why.SU-02` | kestävyys · miksi-rivi | — |  | Ruoka on jo maksettu. Kun reitti on sovittu, sitä ei heitetä pois kiireessä. | The food is already paid for. With a plan, it doesn't get binned in the rush. |
| `why.SU-03` | kestävyys · miksi-rivi | — |  | Hanavesi on ilmaista, pullovesi ei. | Tap water is free, bottled water isn't. |
| `why.SU-04` | kestävyys · miksi-rivi | — |  | Lajiteltu jäte on halvempaa viedä, ja moni tila edellyttää sitä. | Sorted waste is cheaper to dispose of, and many venues require it. |
| `why.SU-05` | kestävyys · miksi-rivi | — |  | Pantit kattavat usein siivoojien kahvit. | The deposits often cover the clean-up crew's coffee. |
| `why.SU-06` | kestävyys · miksi-rivi | — |  | Ostettu somiste on tapahtuman jälkeen jonkun kotona tai roskissa. | Bought decor ends up in someone's home or the bin afterwards. |
| `why.SU-07` | kestävyys · miksi-rivi | — |  | Vähemmän kysymyksiä ja vähemmän autoja oven edessä. | Fewer questions and fewer cars at the door. |
| `why.SU-08` | kestävyys · miksi-rivi | — |  | Levittämätön juliste on hukattu painolasku. | An unposted poster is a wasted print bill. |
| `why.SU-09` | kestävyys · miksi-rivi | — |  | Myymätön merch on sidottua rahaa varastossa. | Unsold merch is money sitting in storage. |
| `why.SU-10` | kestävyys · miksi-rivi | — |  | Yksi pakettiauto on halvempi kuin kolme taksia. | One van is cheaper than three taxis. |
| `why.SU-11` | kestävyys · miksi-rivi | — |  | Yön yli päälle jäänyt tekniikka on tyypillinen syy riitaan tilan kanssa. | Tech left on overnight is a classic cause of disputes with the venue. |
| `why.SU-12` | kestävyys · miksi-rivi | — |  | Ne kelpaavat seuraavaan tapahtumaan, ja uudet maksavat. | They work for the next event, and new ones cost money. |
| `why.SU-13` | kestävyys · miksi-rivi | — |  | Kasvisruoka sopii useimmille ruokavalioille ja vähentää erikoistilauksia. | Vegetarian food suits most diets and cuts down on special orders. |
| `why.SU-14` | kestävyys · miksi-rivi | — |  | Apurahat, kaupunki ja kumppanit kysyvät näitä seuraavaa hakemusta varten. | Grant makers, the city and partners ask for these in the next application. |
| `why.SU-15` | kestävyys · miksi-rivi | — |  | Ei taksilaskuja eikä myöhästymisiä soundcheckistä. | No taxi bills and no one late for soundcheck. |
| `why.SU-99` | kestävyys · miksi-rivi | — |  | Tämä on vitsi. Jos rahoittaja oikeasti pyytää päästölaskelman, kysy siltä, mitä laskuria se käyttää. | This one's a joke. If a funder actually asks for an emissions report, ask them which calculator they use. |
| `ui.lang.en` | etusivu · kielivalinta | — |  | EN | EN |
| `ui.lang.fi` | etusivu · kielivalinta | — |  | FI | FI |
| `ui.lang.label` | etusivu · kielivalinta (ruudunlukija) | — |  | Kieli | Language |
| `why.P-30` | tehtävä P-30 · miksi-rivi | aina |  | Jos tilaisuuteen tarvitaan liikenteenohjaajia tai tilapäisiä järjestyksenvalvojia, tee ilmoitus vähintään kaksi viikkoa ennen tilaisuutta. Jos kyseessä on suuri tai monipäiväinen tapahtuma, ota yhteyttä järjestämispaikan poliisilaitokseen jo järjestelyjen alkuvaiheessa. Kun turvallisuuteen liittyvistä asioista voidaan keskustella hyvissä ajoin, vältytään yllätyksiltä puolin ja toisin. | If the event needs traffic controllers or temporary security staff, notify the police at least two weeks before. For a large or multi-day event, contact the police department where the event is held early in the planning. Talking about safety in good time avoids surprises on both sides. |
| `why.policeEarly` | tehtävä P-30 · miksi-rivi | vähintään 400 henkeä ja useampi päivä |  | Tapahtuma on suuri ja monipäiväinen, joten ota yhteyttä poliisiin jo nyt. | This is a large, multi-day event, so contact the police now. |
| `why.policeTwoWeeks` | tehtävä P-30 · miksi-rivi | ulkotapahtuma |  | Ulkotapahtumassa tarvitaan usein liikenteenohjaajia, joten ilmoitus tehdään kaksi viikkoa ennen. | Outdoor events often need traffic controllers, so the notice goes in two weeks before. |
| `ui.privacy.file.title` | tietosuoja | — |  | Jos tallennat tiedostona | If you save it as a file |
| `ui.privacy.file.text` | tietosuoja | — |  | Tiedosto sisältää saman suunnitelman ja jää sinne, minne sen tallennat. Kun avaat sen, se luetaan vain selaimessasi. | The file holds the same plan and stays wherever you save it. When you open it, it is read only in your browser. |
| `ui.privacy.source.title` | tietosuoja | — |  | Lähdekoodi | Source code |
| `ui.privacy.source.text` | tietosuoja | — |  | Työkalu on avointa lähdekoodia (MIT-lisenssi). Voit tarkistaa itse, mitä se tekee: {repoUrl} | The tool is open source (MIT licence). You can check for yourself what it does: {repoUrl} |
| `ui.privacy.repoUrl` | tietosuoja | — |  | https://github.com/mikaketu/alo-tuotantosuunnitelma | https://github.com/mikaketu/alo-tuotantosuunnitelma |
| `ui.exit.file.eyebrow` | tallennettu · tiedosto | — |  | Tallenna tiedostona | Save as a file |
| `ui.exit.file.save` | tallennettu · tiedosto | — |  | Lataa tiedosto | Download the file |
| `ui.exit.file.note` | tallennettu · tiedosto | — |  | Tiedoston voit avata toisella laitteella tai selaimen tyhjennyksen jälkeen. | You can open the file on another device or after clearing the browser. |
| `ui.cover.open` | kansi | — |  | Avaa tallennettu tiedosto | Open a saved file |
| `ui.toast.opened` | toast | — |  | Suunnitelma avattu | Plan opened |
| `ui.toast.openFailed` | toast | — |  | Tiedostoa ei voitu lukea | The file could not be read |
| `ui.export.jsonFilename` | tiedosto | — |  | tuotantosuunnitelma | production-plan |
