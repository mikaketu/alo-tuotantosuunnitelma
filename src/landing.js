// Where a saved plan lands when the page is opened again: the first unanswered
// card if the deck is unfinished, never card 1; else the plan, or the summary
// once the ownership pass is done. The reveal is shown once (`revealed`).
export function landingView(plan, queue) {
  if (!plan.cover?.type || !plan.cover?.date || !plan.started) return 'cover';
  if (queue.length) return 'deck';
  if (plan.own?.done) return 'summary';
  if (plan.revealed) return 'plan';
  return 'reveal';
}
