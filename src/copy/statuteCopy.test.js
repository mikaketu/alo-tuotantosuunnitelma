// Statute-sensitive copy is pinned: changing it is a deliberate act.
// Reviewed 2026-09-22 against the plan's copy rules (never implies a duty that may not exist).
// Owner decision 2026-09-22: P-30 keys on the same > 200 threshold as X-90; below 150 the row does not exist.
// Owner copy pass 2026-09-23 (kopiotaulukko): imperative titles, X-90 names the statute's own ≥ 200 wording;
// every conditional duty still reads as conditional ("jos …", "todennäköisesti").
import { describe, it, expect } from 'vitest';
import FI from './fi.json' with { type: 'json' };

const PINNED = {
  'row.P-30.title': 'Tee poliisille ilmoitus yleisötilaisuudesta',
  'row.P-30.title.probable': 'Tee poliisille ilmoitus yleisötilaisuudesta – todennäköisesti tarpeen, jos paikalla on yhtä aikaa yli 200',
  'row.X-90.title': 'Toimita pelastussuunnitelma pelastuslaitokselle',
  'row.X-90.title.probable': 'Toimita pelastussuunnitelma pelastuslaitokselle – pakollinen, jos paikalla on yhtä aikaa vähintään 200',
  'row.X-91.title': 'Tee meluilmoitus kaupungille',
  'row.X-31.title': 'Järjestä anniskelu: luvanhaltija anniskelee hyväksytyssä tilassa tai haet määräaikaisen anniskeluluvan',
  'row.H-01.title': 'Pyydä avioliiton esteiden tutkintaa DVV:ltä tai seurakunnalta – pyyntö tehdään yhdessä',
  'statute.kokoontumislaki.label': 'Kokoontumislaki 14 §',
  'statute.pelastuslaki.label': 'Pelastuslaki 16 § ja asetus 407/2011 3 §',
  'statute.ysl.label': 'Ympäristönsuojelulaki 118 §',
  'statute.alkoholilaki.label': 'Alkoholilaki 20 §',
  'statute.avioliittolaki.label': 'Avioliittolaki 11 ja 13 §',
};

describe('statute copy', () => {
  for (const [k, v] of Object.entries(PINNED)) it(k, () => expect(FI[k]).toBe(v));
  it('statute notes never state a duty as certain for the small cases', () => {
    expect(FI['statute.kokoontumislaki.note']).toMatch(/ei tarvitse ilmoitusta/);
    expect(FI['statute.ysl.note']).toMatch(/omista juhlista ei tarvitse ilmoittaa/);
  });
});
