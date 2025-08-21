import React, { useEffect, useMemo, useState } from "react";

// Play‑Money Casino — single‑file React component
// Notes
// - No real money, no accounts, no payouts.
// - Includes 18+ age gate and responsible‑play info.
// - Tailwind classes used for styling (canvas preview supports Tailwind).
// - You can drop this into a React app and export default it.

const EMOJIS = ["🍒", "🍋", "🍇", "🔔", "⭐", "7️⃣"];
const DEFAULT_BALANCE = 1000;

function format(num) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
}

function getStored(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function Pill({ children }) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/20">{children}</span>
  );
}

function Card({ title, children, footer }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 shadow-lg p-5 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div>{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-white/10 text-sm text-white/80">{footer}</div>}
    </div>
  );
}

function AgeGate({ onConfirm }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="max-w-lg w-full mx-4 rounded-2xl bg-zinc-900 border border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-2">Are you 18 or older?</h2>
        <p className="text-white/80 mb-4">This demo is for entertainment and educational purposes only. It does not accept real money and offers no prizes.</p>
        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" className="w-4 h-4" checked={checked} onChange={(e)=>setChecked(e.target.checked)} />
          <span className="text-sm">I confirm I am at least 18 years old.</span>
        </label>
        <div className="flex gap-3">
          <button disabled={!checked} onClick={onConfirm} className="disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition font-medium">
            Enter Demo
          </button>
          <a href="#" onClick={(e)=>e.preventDefault()} className="px-4 py-2 rounded-xl bg-zinc-800 border border-white/10">Exit</a>
        </div>
      </div>
    </div>
  );
}

function Slots({ balance, setBalance }) {
  const [reels, setReels] = useState(["🍒", "🍋", "🍇"]);
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");
  const bets = [5, 10, 25, 50, 100];

  const spin = async () => {
    if (spinning) return;
    if (balance < bet) { setMessage("Not enough credits."); return; }
    setSpinning(true);
    setBalance(b => b - bet);
    setMessage("Spinning…");

    const steps = 16 + Math.floor(Math.random() * 10);
    let r = [...reels];
    for (let i = 0; i < steps; i++) {
      r = r.map(() => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
      setReels([...r]);
      // small delay for animation
      // eslint-disable-next-line no-await-in-loop
      await new Promise(res => setTimeout(res, 60));
    }

    const [a, b, c] = r;
    let win = 0;
    if (a === b && b === c) {
      // triple payout table
      const triplePayout = { "🍒": 5, "🍋": 6, "🍇": 8, "🔔": 10, "⭐": 15, "7️⃣": 50 };
      win = bet * (triplePayout[a] || 0);
      setMessage(`JACKPOT! ${a}${b}${c} You win ${format(win)}!`);
    } else if (a === b || b === c || a === c) {
      win = Math.floor(bet * 1.5);
      setMessage(`Nice! A pair wins ${format(win)}.`);
    } else {
      setMessage("No win this time. Try again!");
    }
    if (win > 0) setBalance(x => x + win);
    setSpinning(false);
  };

  return (
    <Card title="🎰 Lucky Slots">
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <div>
          <div className="flex items-center justify-center gap-3 text-6xl sm:text-7xl p-4 rounded-2xl bg-zinc-900 border border-white/10">
            {reels.map((r, i) => (
              <div key={i} className="w-20 h-20 sm:w-24 sm:h-24 grid place-content-center rounded-xl bg-zinc-800 border border-white/10">
                {r}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-white/80 h-5">{message}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">Bet</span>
            <div className="flex flex-wrap gap-2">
              {bets.map(v => (
                <button key={v} className={`px-3 py-1 rounded-xl border ${bet===v?"bg-white/20 border-white/40":"bg-zinc-800 border-white/10"}`} onClick={()=>setBet(v)}>
                  {format(v)}
                </button>
              ))}
            </div>
          </div>
          <button onClick={spin} disabled={spinning} className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 font-semibold shadow">
            {spinning ? "Spinning…" : "Spin"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function CoinFlip({ balance, setBalance }) {
  const [choice, setChoice] = useState("heads");
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState(null);
  const flip = () => {
    if (balance < bet) return;
    setBalance(b => b - bet);
    const r = Math.random() < 0.5 ? "heads" : "tails";
    setResult(r);
    if (r === choice) setBalance(b => b + bet * 2);
  };
  return (
    <Card title="🪙 Coin Flip">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {(["heads","tails"]).map(opt => (
            <button key={opt} onClick={()=>setChoice(opt)} className={`px-3 py-1 rounded-xl border ${choice===opt?"bg-white/20 border-white/40":"bg-zinc-800 border-white/10"}`}>{opt}</button>
          ))}
        </div>
        <label className="text-sm">Bet: {format(bet)}</label>
        <input type="range" min={5} max={200} step={5} value={bet} onChange={e=>setBet(parseInt(e.target.value))} />
        <button onClick={flip} className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-semibold shadow">Flip</button>
        {result && <p className="text-sm">Result: <b>{result}</b> — {result===choice?"You won!":"You lost."}</p>}
      </div>
    </Card>
  );
}

function Header({ balance, onAdd, onReset }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl grid place-content-center bg-indigo-500">🎲</div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Play‑Money Casino</h1>
          <p className="text-white/70 text-sm">For entertainment & learning only — no real money.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Pill>Balance: {format(balance)}</Pill>
        <button onClick={onAdd} className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-medium">+ Add 500 credits</button>
        <button onClick={onReset} className="px-3 py-2 rounded-xl bg-zinc-800 border border-white/10">Reset</button>
      </div>
    </div>
  );
}

function Tabs({ current, setCurrent }) {
  const items = [
    { key: "slots", label: "Slots" },
    { key: "coin", label: "Coin Flip" },
  ];
  return (
    <div className="flex gap-2 mt-6 mb-2">
      {items.map(it => (
        <button key={it.key} onClick={()=>setCurrent(it.key)} className={`px-4 py-2 rounded-2xl border ${current===it.key?"bg-white/20 border-white/40":"bg-zinc-800 border-white/10"}`}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-8 text-xs text-white/70 leading-relaxed">
      <p><b>Responsible Play:</b> Set limits, take breaks, and remember this demo is not designed to simulate real‑world odds or payouts. If gambling is causing you stress, seek help from local support services.</p>
      <p className="mt-2">This software is provided as‑is for learning. No wagering, no cash‑out, no prizes.</p>
    </div>
  );
}

export default function PlayMoneyCasino() {
  const [ageOk, setAgeOk] = useState(getStored("demo_age_ok", false));
  const [balance, setBalance] = useState(() => getStored("demo_balance", DEFAULT_BALANCE));
  const [tab, setTab] = useState("slots");

  useEffect(() => { setStored("demo_balance", balance); }, [balance]);
  useEffect(() => { setStored("demo_age_ok", ageOk); }, [ageOk]);

  const addCredits = () => setBalance(b => b + 500);
  const resetAll = () => { setBalance(DEFAULT_BALANCE); setTab("slots"); };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white">
      {!ageOk && <AgeGate onConfirm={()=>setAgeOk(true)} />}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Header balance={balance} onAdd={addCredits} onReset={resetAll} />
        <Tabs current={tab} setCurrent={setTab} />

        <div className="grid md:grid-cols-2 gap-4 mt-2">
          {tab === "slots" && <Slots balance={balance} setBalance={setBalance} />}
          {tab === "coin" && <CoinFlip balance={balance} setBalance={setBalance} />}

          <Card title="📘 How it Works" footer={<div className="space-y-1">
            <p>• Slots: Choose a bet and press Spin. Triple symbols pay more; pairs pay a small win.</p>
            <p>• Coin Flip: Pick heads/tails and set a bet. Win returns 2× your stake.</p>
            <p>• Credits are virtual and stored locally in your browser.</p>
          </div>}>
            <div className="space-y-2 text-sm">
              <p>This is a *play‑money* demo crafted to practice UI, state management, and basic RNG logic in React. It intentionally avoids real payments, accounts, or withdrawals.</p>
              <p>To adapt it for other mini‑games, duplicate a game card and plug in your own rules.</p>
            </div>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  );
}
