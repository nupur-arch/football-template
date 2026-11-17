export function ScoreRoll({ value }: { value: string }) {
  return <span className="score-roll" key={value}>{value}</span>;
}

export function CheckDraw() {
  return <svg className="check-draw" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
