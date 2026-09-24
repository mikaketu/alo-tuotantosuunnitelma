import React, { useEffect } from 'react';
import { ts } from '../copy/ts.js';
import { rules } from '../engine/index.js';
import { taskTitle } from '../engine/render.js';
import * as store from '../store.js';
import { useDrag } from '../useDrag.js';
import { fmtDate } from '../fmt.js';
import TopBar, { Wordmark } from './TopBar.jsx';
import { dateLabel } from './TaskRow.jsx';

const cardLabel = (id) => ts(`card.${id}.label`);

/** Stacks = categories with ≥ 1 non-pending task, in category order. */
export function ownCats(tasks) {
  return rules.categories.map((key) => ({ key, tasks: tasks.filter((t) => t.cat === key && !t.pending) })).filter((c) => c.tasks.length);
}

/** The task card's context line: why the default is what it is. */
export function contextLine(t) {
  if (t.locked) return ts('ui.own.ctx.locked');
  if (t.def === 'venue' && t.why && t.why.upCards && t.why.upCards.length) return ts('why.upCard', { card: t.why.upCards.map(cardLabel).join(', ') });
  if (t.unknown) return ts('why.unknown');
  if (t.prepareSign) return ts('why.prepareSign');
  return ts('ui.own.ctx.default');
}

function CategoryCard({ cat, i, n, dragRef, front = true }) {
  const stat = cat.tasks.filter((t) => t.statutory).length, locked = cat.tasks.filter((t) => t.locked).length;
  const intro = [ts('ui.own.catIntro', { n: cat.tasks.length })];
  if (stat) intro.push(stat === 1 ? ts('ui.own.catStatutoryOne') : ts('ui.own.catStatutory', { n: stat }));
  if (locked) intro.push(locked === 1 ? ts('ui.own.catLockedOne') : ts('ui.own.catLocked', { n: locked }));
  const short = (s) => (s.length > 32 ? `${s.slice(0, 30)}…` : s);
  return (
    <div className={`card ${front ? 'front' : 'back'} own-cat`} ref={front ? dragRef : undefined} role={front ? 'group' : undefined} aria-hidden={front ? undefined : true}>
      {front && <><span className="stamp" data-stamp="r">{ts('ui.stamp.allMine')}</span><span className="stamp u venue" data-stamp="u">{ts('ui.stamp.up')}</span></>}
      <span className="eyebrow navy">{ts('ui.own.catIndex', { i, n })}</span>
      <h2 className="serif q big">{ts(`cat.${cat.key}`)}</h2>
      <p className="h">{intro.join(' ')}</p>
      <div className="list">
        {cat.tasks.slice(0, 7).map((t) => (
          <div key={t.id}><span>{t.statutory ? '§ ' : ''}{short(taskTitle(t))}</span><span>{t.pending ? '' : `${t.fixed ? `${ts('ui.plan.date.by', { date: '' }).trim()} ` : ''}${fmtDate(t.date)}`}</span></div>
        ))}
        {cat.tasks.length > 7 && <div><span className="muted">{ts('ui.own.more', { n: cat.tasks.length - 7 })}</span></div>}
      </div>
      <div className="hints"><div className="u"><span className="chip venue">↑ {ts('ui.own.wholeCat')}</span></div></div>
    </div>
  );
}

function TaskCard({ t, dragRef, front = true }) {
  return (
    <div className={`card ${front ? 'front' : 'back'} own-task`} ref={front ? dragRef : undefined} role={front ? 'group' : undefined} aria-label={front ? ts('ui.a11y.cardGroup', { q: taskTitle(t) }) : undefined} aria-hidden={front ? undefined : true}>
      {front && (t.locked
        ? <span className="stamp" data-stamp="r">{ts('ui.stamp.ok')}</span>
        : <><span className="stamp l" data-stamp="l">{ts('ui.stamp.notNeeded')}</span><span className="stamp" data-stamp="r">{ts('ui.stamp.mine')}</span><span className="stamp u venue" data-stamp="u">{ts('ui.stamp.up')}</span></>)}
      <div className="row between">
        <span className="eyebrow navy">{ts(`cat.${t.cat}`)}{t.locked ? ` · ${ts('ui.own.organiser')}` : ''}</span>
        {t.statutory && <span className="chip statutory">{ts('ui.plan.chip.statutory')}</span>}
      </div>
      <h2 className="serif q mid">{taskTitle(t)}</h2>
      <div className="dl">{t.statutory && <span className="par">§</span>}<b>{dateLabel(t)}</b><span className="muted">{ts('why.rule', { id: t.row })}</span></div>
      <p className="h">{contextLine(t)}</p>
      <div className="hints">
        {!t.locked && <div className="u"><span className="chip venue">↑ {ts('ui.plan.chip.owner')}</span></div>}
      </div>
    </div>
  );
}

/**
 * The ownership pass: one stack per category. The category card decides every
 * undecided task at once (→ default, ↑ the venue); "Käy tehtävät läpi
 * yksitellen" deals them. Locked rows only ever take "Selvä, minun".
 */
export default function Ownership({ s, ev, keys }) {
  const { plan } = s;
  const cats = ownCats(ev.tasks);
  const o = plan.own;
  const cat = cats[o.cat];
  const dealing = o.mode === 'tasks';
  // One by one: every task of the category from position own.i — decided ones too, so
  // "Muokkaa vastuita" can walk them again. The category card counts the undecided.
  const queue = !cat ? [] : dealing ? cat.tasks.slice(o.i || 0) : cat.tasks.filter((t) => plan.owners[t.id] === undefined);
  const t = dealing ? queue[0] : null;

  useEffect(() => {
    if (!cat) store.finishOwn();
    else if (dealing && !queue.length) store.nextCat();
  }, [cat, dealing, queue.length]);

  const catCommit = (dir) => { if (dir === 'right') store.catDecide('me', cat.tasks); else if (dir === 'up') store.catDecide('venue', cat.tasks); };
  const taskCommit = (dir) => store.ownDecide(t, dir === 'left' ? 'none' : dir === 'right' ? 'me' : 'venue');
  const drag = useDrag({
    allow: t ? { lr: true, up: !t.locked, left: !t.locked } : { lr: true, up: true, left: false },
    onCommit: t ? taskCommit : catCommit,
    key: t ? t.id : `cat:${o.cat}`,
  });
  const fly = (dir) => { if (t && t.locked && dir !== 'right') return false; if (!t && dir === 'left') return false; drag.api.fly(dir, t ? taskCommit : catCommit); return true; };
  keys.current = {
    ...keys.current, view: 'own', tapOnly: false,
    left: () => fly('left'), right: () => fly('right'), up: () => fly('up'),
    later: () => { if (t && !t.locked) { store.ownDecide(t, 'later'); return true; } return false; },
    confirm: () => { if (!t) { store.dealCat(); return true; } return false; },
    option: () => false,
  };

  if (!cat || (dealing && !t)) return <div className="app screen"><TopBar left={<Wordmark />} /></div>;

  const mine = cat.tasks.filter((x) => (plan.owners[x.id] || x.def) === 'me').length;
  const segs = cats.map((c, i) => (i < o.cat ? 100 : i === o.cat ? Math.round(((c.tasks.length - queue.length) / c.tasks.length) * 100) : 0));
  return (
    <div className="app screen deck own">
      <TopBar
        left={s.undo.length ? <button type="button" className="btn text sm" onClick={() => store.undo()}>↶ {ts('ui.deck.undo')}</button> : <Wordmark />}
        right={<button type="button" className="btn ghost sm" onClick={() => store.setView('exit')}>{ts('ui.deck.exit')}</button>}
      />
      <div className="prog" role="group" aria-label={ts('ui.a11y.progress')}>
        <div className="segs" aria-hidden="true">{segs.map((w, i) => <span key={cats[i].key} className="seg"><i style={{ width: `${w}%` }} /></span>)}</div>
        <div className="l">
          <span className="eyebrow navy">{dealing ? ts(`cat.${cat.key}`) : ts('ui.own.title')}</span>
          <span className="muted">{dealing ? ts('ui.own.taskProgress', { i: cat.tasks.length - queue.length + 1, n: cat.tasks.length, mine }) : ts('ui.own.catProgress', { cat: ts(`cat.${cat.key}`), n: cat.tasks.length })}</span>
        </div>
      </div>
      <div className="stage">
        <div className="card back2" aria-hidden="true" />
        {dealing ? (queue[1] ? <TaskCard key={`b-${queue[1].id}`} t={queue[1]} front={false} /> : null) : <div className="card back" aria-hidden="true" />}
        {dealing
          ? <TaskCard key={t.id} t={t} dragRef={drag.ref} />
          : <CategoryCard key={`cat:${o.cat}`} cat={cat} i={o.cat + 1} n={cats.length} dragRef={drag.ref} />}
      </div>
      <div className="actions">
        {dealing ? (
          <>
            <div className="accel">
              <button type="button" className="btn ghost sm" onClick={() => store.catDecide('me', cat.tasks)}>{ts('ui.own.restMine')} →</button>
              <button type="button" className="btn ghost sm" onClick={() => store.catDecide('venue', cat.tasks)}>↑ {ts('ui.own.rest')}</button>
            </div>
            {t.locked ? (
              <button type="button" className="btn primary wide" onClick={() => fly('right')}>{ts('ui.own.okMine')} →</button>
            ) : (
              <div className="actions three">
                <button type="button" className="btn ghost" onClick={() => fly('left')}>← {ts('ui.own.notNeeded')}</button>
                <button type="button" className="btn venue" onClick={() => fly('up')}>↑ {ts('ui.plan.chip.owner')}</button>
                <button type="button" className="btn primary" onClick={() => fly('right')}>{ts('ui.own.mine')} →</button>
              </div>
            )}
            <div className="later">{!t.locked && <button type="button" className="btn text" onClick={() => store.ownDecide(t, 'later')}>{ts('ui.own.later')}</button>}</div>
            <div className="keys" aria-hidden="true">
              <span className="eyebrow">{ts('ui.keys.title')}</span>
              <span><i className="key">←</i><i className="key">↑</i><i className="key">→</i> {ts('ui.keys.decide')}</span>
              <span><i className="key">M</i> {ts('ui.keys.later')}</span>
              <span><i className="key">Z</i> {ts('ui.keys.undo')}</span>
            </div>
          </>
        ) : (
          <>
            <div className="actions two">
              <button type="button" className="btn venue" onClick={() => fly('up')}>↑ {ts('ui.own.allCat')}</button>
              <button type="button" className="btn primary" onClick={() => fly('right')}>{ts('ui.own.allMine')} →</button>
            </div>
            <div className="later"><button type="button" className="btn text" onClick={() => store.dealCat()}>{ts('ui.own.deal')}</button></div>
            <div className="keys" aria-hidden="true">
              <span className="eyebrow">{ts('ui.keys.title')}</span>
              <span><i className="key">→</i> {ts('ui.keys.allMine')}</span>
              <span><i className="key">↑</i> {ts('ui.plan.chip.owner')}</span>
              <span><i className="key">Enter</i> {ts('ui.keys.oneByOne')}</span>
              <span><i className="key">Z</i> {ts('ui.keys.undo')}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
