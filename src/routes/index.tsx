import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
  type FormEvent,
} from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

type TabId = "tipoff" | "roster" | "five" | "log" | "trophy" | "timeout";

const TABS: { id: TabId; label: string; num: string }[] = [
  { id: "tipoff",  label: "Tip-Off",       num: "00" },
  { id: "roster",  label: "Roster",        num: "01" },
  { id: "log",     label: "Game Log",      num: "02" },
  { id: "five",    label: "Starting Five", num: "03" },
  { id: "trophy",  label: "Trophy Case",   num: "04" },
  { id: "timeout", label: "Timeout",       num: "05" },
];

const QUIPS = [
  "SWISH! Nothin' but net. 🏀",
  "AND-ONE! The crowd goes wild.",
  "BUZZER BEATER! From downtown.",
  "SLAM DUNK! Rim's still shaking.",
  "COOKIN'! He's heating up.",
  "SPLASH! Ice in the veins.",
  "GAME. BLOUSES. 🎽",
  "POSTERIZED! Somebody call his mom.",
  "FROM WAY DOWNTOWN! BANG!",
  "HE'S ON FIRE — 🔥 quick, get water.",
  "ANKLE BREAKER! Medic to the court.",
  "NO-LOOK PASS! Even the ref is confused.",
  "GOT 'EM! That's a wrap, folks.",
  "ALLEY-OOP! Gravity took a timeout.",
  "MONEY BALL! Cha-ching. 💸",
  "ICE COLD! Somebody get this man a jacket.",
  "WHO'S GUARDING HIM?! Nobody, apparently.",
  "COAST TO COAST! Get him some Gatorade.",
  "THE ROOF! THE ROOF IS ON FIRE!",
  "KA-BOOM! Backboard just filed a complaint.",
];

const BRICKS = [
  "BRICK! Call a mason. 🧱",
  "AIRBALL! The rim was insulted.",
  "OFF THE SIDE! Somebody hide the tape.",
  "REJECTED! By physics itself.",
  "CLANK! That one's still ringing.",
  "IRON! Rim said 'not today'.",
  "SHORT! Needs more legs, coach.",
  "BACKBOARD SMOOCH — no kiss, no bucket.",
];

function Basketball({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-full shadow-[0_6px_14px_rgba(0,0,0,.35)] ${className}`}
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #ffb26b, #e8641b 55%, #8a3a0d 100%)",
      }}
    >
      <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-court-ink rounded" />
      <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-court-ink rounded" />
      <span
        className="absolute inset-0 rounded-full border-2 border-court-ink"
        style={{ clipPath: "inset(30% -4px 30% -4px)", transform: "rotate(35deg)" }}
      />
      <span
        className="absolute inset-0 rounded-full border-2 border-court-ink"
        style={{ clipPath: "inset(30% -4px 30% -4px)", transform: "rotate(-35deg)" }}
      />
    </div>
  );
}

function Hoop() {
  return (
    <div className="relative w-64 h-56">
      {/* backboard */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-52 h-32 rounded-md bg-court-cream border-4 border-court-ink shadow-[0_10px_0_rgba(0,0,0,.15)]">
        <div className="absolute left-1/2 top-10 -translate-x-1/2 w-24 h-14 border-4 border-court-ink" />
      </div>
      {/* rim */}
      <div className="absolute left-1/2 top-[128px] -translate-x-1/2 w-40 h-4 rounded-full bg-court-key-dark border-2 border-court-ink" />
      {/* net */}
      <div
        className="absolute left-1/2 top-[140px] -translate-x-1/2 w-36 origin-top"
        style={{ animation: "net-swish .6s ease-out 2" }}
      >
        <svg viewBox="0 0 144 80" className="w-full h-20">
          <g stroke="#1a1208" strokeWidth="1.6" fill="none">
            {[0,1,2,3,4,5,6].map(i => (
              <line key={`v${i}`} x1={12 + i*20} y1="0" x2={24 + i*14} y2="78" />
            ))}
            {[0,1,2,3,4,5,6,7].map(i => (
              <line key={`w${i}`} x1={0 + i*20} y1="0" x2={-8 + i*22} y2="78" />
            ))}
            <path d="M6 22 L138 22" />
            <path d="M14 44 L130 44" />
            <path d="M22 66 L122 66" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CourtButton({
  children,
  variant = "solid",
  onClick,
  href,
  ...rest
}: {
  children: ReactNode;
  variant?: "solid" | "ghost" | "whistle";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  href?: string;
} & Record<string, unknown>) {
  const base =
    "inline-flex items-center gap-2 px-5 py-3 font-mono text-[12px] tracking-[2px] uppercase font-bold border-2 border-court-ink transition-all duration-150 active:translate-y-[2px] active:shadow-none";
  const styles = {
    solid: "bg-court-key text-court-ink shadow-[4px_4px_0_#1a1208] hover:bg-court-key-dark hover:text-court-cream",
    ghost: "bg-court-cream text-court-ink shadow-[4px_4px_0_#1a1208] hover:bg-court-wood",
    whistle: "bg-court-ink text-court-cream shadow-[4px_4px_0_#e8641b] hover:bg-court-key hover:text-court-ink",
  }[variant];

  const cls = `${base} ${styles}`;
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={(e) => onClick?.(e as unknown as MouseEvent<HTMLButtonElement>)}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
}

function Index() {
  const [tab, setTab] = useState<TabId>("tipoff");
  const [dunk, setDunk] = useState<null | { quip: string; key: number; mode: "swish" | "brick" }>(null);
  const dunkTimer = useRef<number | null>(null);
  const [score, setScore] = useState({ swish: 0, brick: 0, streak: 0, best: 0 });

  const triggerDunk = (opts?: { forceMode?: "swish" | "brick" }) => {
    const mode: "swish" | "brick" =
      opts?.forceMode ?? (Math.random() < 0.25 ? "brick" : "swish");
    const pool = mode === "swish" ? QUIPS : BRICKS;
    const quip = pool[Math.floor(Math.random() * pool.length)];
    setDunk({ quip, key: Date.now(), mode });
    if (dunkTimer.current) window.clearTimeout(dunkTimer.current);
    dunkTimer.current = window.setTimeout(() => setDunk(null), 1900);
    return mode;
  };

  // "Take a Shot" mini-game — tracks streak + best.
  const takeShot = () => {
    const mode = triggerDunk();
    setScore((s) => {
      if (mode === "swish") {
        const streak = s.streak + 1;
        return { swish: s.swish + 1, brick: s.brick, streak, best: Math.max(s.best, streak) };
      }
      return { ...s, brick: s.brick + 1, streak: 0 };
    });
  };

  const goTab = (id: TabId) => {
    triggerDunk({ forceMode: "swish" });
    window.setTimeout(() => setTab(id), 550);
  };

  useEffect(() => () => { if (dunkTimer.current) window.clearTimeout(dunkTimer.current); }, []);

  // Keyboard shortcuts: 1–6 jumps tabs, S = take a shot.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const idx = ["1","2","3","4","5","6"].indexOf(e.key);
      if (idx >= 0) { e.preventDefault(); goTab(TABS[idx].id); return; }
      if (e.key.toLowerCase() === "s") { e.preventDefault(); takeShot(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen font-body text-court-ink relative overflow-hidden">
      {/* hardwood floor */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(122,74,32,.18) 0 2px, transparent 2px 46px), linear-gradient(160deg, #ffd79a 0%, #f2c98a 55%, #dda765 100%)",
        }}
      />
      {/* court key lines */}
      <svg
        className="fixed inset-0 -z-10 w-full h-full opacity-40 pointer-events-none"
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="#ffffff" strokeWidth="3">
          <circle cx="720" cy="450" r="120" />
          <circle cx="720" cy="450" r="40" />
          <line x1="720" y1="0" x2="720" y2="900" />
          <rect x="560" y="620" width="320" height="240" />
          <path d="M560 620 A160 160 0 0 0 880 620" />
          <rect x="560" y="40"  width="320" height="240" />
          <path d="M560 280 A160 160 0 0 1 880 280" />
        </g>
      </svg>

      {/* SCOREBOARD */}
      <header className="sticky top-0 z-40 bg-court-ink text-court-cream border-b-4 border-court-key">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-jersey text-xl text-court-key border-2 border-court-key px-2 leading-tight">AG</span>
            <div className="font-court text-xl tracking-wider">ANSH GUPTA</div>
            <span className="hidden sm:inline font-mono text-[10px] tracking-[2px] text-court-key/80 ml-2 border-l border-court-key/40 pl-2">AI/ML · No. 01</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] tracking-[2px] mr-2 border border-court-key/40 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-court-red" style={{ animation: "buzzer 1.2s infinite" }} />
              <span className="text-court-red">LIVE</span>
              <span className="text-court-cream/60">Q4 · 00:00</span>
            </div>
          </div>
          <nav className="w-full flex flex-wrap gap-1 pt-1">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goTab(t.id)}
                  className={[
                    "flex-1 min-w-[110px] px-3 py-2 text-left border-2 transition-all",
                    active
                      ? "bg-court-key text-court-ink border-court-key shadow-[0_-3px_0_#fff_inset]"
                      : "bg-transparent text-court-cream/70 border-court-key/30 hover:text-court-cream hover:border-court-key",
                  ].join(" ")}
                >
                  <div className="font-mono text-[10px] tracking-[2px] opacity-80">Q{t.num}</div>
                  <div className="font-court text-lg tracking-wide leading-none">{t.label}</div>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* MAIN COURT */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div
          key={tab}
          className="min-h-[calc(100vh-220px)] animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
        >
          {tab === "tipoff" && (
            <TipOff onCta={goTab} onShoot={takeShot} score={score} />
          )}
          {tab === "roster" && <Roster />}
          {tab === "five" && <StartingFive />}
          {tab === "log" && <GameLog />}
          {tab === "trophy" && <TrophyCase />}
          {tab === "timeout" && <Timeout onDunk={triggerDunk} />}
        </div>

        {/* ticker */}
        <div className="mt-6 bg-court-key text-court-ink border-y-4 border-court-ink overflow-hidden">
          <div
            className="inline-block whitespace-nowrap py-2 font-mono text-[12px] font-bold tracking-[2px]"
            style={{ animation: "ticker 32s linear infinite" }}
          >
            {Array.from({ length: 2 }).map((_, r) => (
              <span key={r}>
                <span className="mx-6">ROC-AUC +12%</span>●
                <span className="mx-6">10,000+ PPI SAMPLES</span>●
                <span className="mx-6">ROBUSTNESS +18%</span>●
                <span className="mx-6">600K+ WEATHER OBSERVATIONS</span>●
                <span className="mx-6">PYTORCH · TENSORFLOW · FASTAPI</span>●
                <span className="mx-6">44 YRS OF SATELLITE TELEMETRY</span>●
              </span>
            ))}
          </div>
        </div>

        <CourtFooter onDunk={triggerDunk} />
      </main>

      {/* COACH BUZZER — AI ASSISTANT */}
      <CoachBuzzer onGoTab={(id) => { triggerDunk(); window.setTimeout(() => setTab(id), 500); }} />

      {/* SLAM DUNK / BRICK OVERLAY */}
      {dunk && (
        <div
          key={dunk.key}
          className="fixed inset-0 z-[100] pointer-events-none"
          aria-hidden="true"
        >
          {/* dim flash */}
          <div className={`absolute inset-0 animate-in fade-in duration-200 ${dunk.mode === "swish" ? "bg-court-key/15" : "bg-court-red/15"}`} />

          {/* hoop */}
          <div className="absolute left-1/2 top-[6vh] -translate-x-1/2">
            <Hoop />
          </div>

          {/* ball — swish arcs in, brick clangs off */}
          <div
            className="absolute left-1/2 top-0"
            style={{
              animation:
                dunk.mode === "swish"
                  ? "swish-ball 1.1s cubic-bezier(.4,.6,.3,1) forwards"
                  : "swish-ball 1.1s cubic-bezier(.4,.6,.3,1) forwards",
              filter: dunk.mode === "brick" ? "hue-rotate(-20deg) saturate(1.4)" : undefined,
            }}
          >
            <Basketball className="w-20 h-20 -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* quip */}
          <div
            className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2"
            style={{ animation: "pop-in .5s .55s cubic-bezier(.34,1.56,.64,1) both" }}
          >
            <div className={`bg-court-cream border-4 border-court-ink px-8 py-4 rotate-[-2deg] ${dunk.mode === "swish" ? "shadow-[8px_8px_0_#e8641b]" : "shadow-[8px_8px_0_#e0313c]"}`}>
              <div className={`font-mono text-[11px] tracking-[3px] mb-1 ${dunk.mode === "swish" ? "text-court-key" : "text-court-red"}`}>
                ● {dunk.mode === "swish" ? "COURTSIDE COMMENTARY" : "OFF THE IRON"}
              </div>
              <div className="font-jersey text-3xl md:text-5xl tracking-wide uppercase text-court-ink">
                {dunk.quip}
              </div>
            </div>
          </div>

          {/* confetti — only on swish */}
          {dunk.mode === "swish" && Array.from({ length: 18 }).map((_, i) => {
            const colors = ["#e8641b","#e0313c","#1a1208","#fff8ea","#3f9b5f"];
            return (
              <span
                key={i}
                className="absolute top-0 w-2 h-3"
                style={{
                  left: `${5 + i * 5.2}%`,
                  background: colors[i % colors.length],
                  ["--dx" as string]: `${(i % 2 ? 1 : -1) * (30 + (i * 7) % 80)}px`,
                  animation: `confetti-fall ${1.2 + (i % 5) * 0.2}s ${0.4 + (i % 6) * 0.05}s ease-in forwards`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- sections ---------- */

function TipOff({
  onCta,
  onShoot,
  score,
}: {
  onCta: (id: TabId) => void;
  onShoot: () => void;
  score: { swish: number; brick: number; streak: number; best: number };
}) {
  const fg = score.swish + score.brick;
  const pct = fg === 0 ? 0 : Math.round((score.swish / fg) * 100);
  const fire = score.streak >= 3;
  return (
    <section className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-center py-4">
      <div>
        <p className="font-mono text-[11px] tracking-[4px] text-court-key uppercase mb-3">
          AI / ML Engineer · Jersey #01
        </p>
        <h1 className="font-jersey uppercase leading-[0.9] text-[clamp(56px,10vw,120px)] text-court-ink drop-shadow-[3px_3px_0_#fff8ea]">
          ANSH
          <span className="block text-court-key drop-shadow-[3px_3px_0_#1a1208]">GUPTA</span>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-court-ink/85 border-l-4 border-court-key pl-4">
          Point guard of ML pipelines and production backends. From computational biology
          at IIIT Delhi to full-stack AI platforms — feature engineering, graph learning,
          and benchmarking are the fundamentals I never skip.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CourtButton onClick={() => onCta("log")}>▶ Watch Game Log</CourtButton>
          <CourtButton variant="ghost" onClick={() => onCta("timeout")}>Call Timeout</CourtButton>
          <CourtButton variant="whistle" onClick={onShoot}>
            🏀 Take a Shot {fire && <span className="ml-1">🔥</span>}
          </CourtButton>
        </div>

        {/* Shot-clock scoreboard */}
        <div className="mt-4 inline-flex items-stretch border-2 border-court-ink bg-court-ink text-court-cream shadow-[4px_4px_0_#e8641b] font-mono text-[10px] tracking-[2px] uppercase">
          <div className="px-3 py-2 border-r-2 border-court-key/40">
            <div className="opacity-60">Swish</div>
            <div className="font-jersey text-2xl text-court-key leading-none mt-0.5">{score.swish}</div>
          </div>
          <div className="px-3 py-2 border-r-2 border-court-key/40">
            <div className="opacity-60">Brick</div>
            <div className="font-jersey text-2xl text-court-red leading-none mt-0.5">{score.brick}</div>
          </div>
          <div className="px-3 py-2 border-r-2 border-court-key/40">
            <div className="opacity-60">FG%</div>
            <div className="font-jersey text-2xl leading-none mt-0.5">{pct}</div>
          </div>
          <div className="px-3 py-2">
            <div className="opacity-60">Streak</div>
            <div className={`font-jersey text-2xl leading-none mt-0.5 ${fire ? "text-court-red" : "text-court-cream"}`}>
              {score.streak}{fire && " 🔥"}
            </div>
          </div>
        </div>
        <p className="mt-2 font-mono text-[10px] tracking-[2px] uppercase text-court-ink/60">
          Tip: press <b>1–6</b> to switch quarters · <b>S</b> to shoot
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2 max-w-md">
          {[
            ["+12%", "ROC-AUC"],
            ["10K+", "PPI SAMPLES"],
            ["600K+", "OBSERVATIONS"],
          ].map(([b, s]) => (
            <div key={s} className="bg-court-ink text-court-cream border-4 border-court-ink px-3 py-2 shadow-[4px_4px_0_#e8641b]">
              <div className="font-jersey text-2xl text-court-key leading-none">{b}</div>
              <div className="font-mono text-[9px] tracking-[2px] opacity-70 mt-1">{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-[340px] hidden md:flex items-end justify-center">
        <div className="absolute inset-x-0 top-6 flex justify-center">
          <Hoop />
        </div>
        <div className="relative flex flex-col items-center">
          <div style={{ animation: "dribble 1.15s cubic-bezier(.5,0,.85,.35) infinite" }}>
            <Basketball className="w-32 h-32" />
          </div>
          <div
            className="mt-2 w-28 h-4 rounded-full bg-black/40 blur-[2px]"
            style={{ animation: "shadow-pulse 1.15s cubic-bezier(.5,0,.85,.35) infinite" }}
          />
        </div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="font-mono text-[11px] tracking-[3px] text-court-key-dark uppercase">{kicker}</p>
        <h2 className="font-jersey uppercase text-4xl md:text-5xl leading-none text-court-ink">{title}</h2>
      </div>
      <div className="h-1 flex-1 min-w-[80px] bg-[repeating-linear-gradient(90deg,#1a1208_0_14px,transparent_14px_26px)]" />
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-court-cream border-4 border-court-ink shadow-[6px_6px_0_#1a1208] ${className}`}>
      {children}
    </div>
  );
}

function Roster() {
  return (
    <section className="py-2">
      <SectionHead kicker="Player Profile" title="Roster Card" />
      <Card className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center relative">
        <div className="absolute left-0 top-0 h-full w-2 bg-court-key" />
        <div className="w-32 h-32 rounded-full border-4 border-court-ink bg-court-key flex items-center justify-center font-jersey text-5xl text-court-ink shadow-[4px_4px_0_#1a1208]">
          AG
        </div>
        <div className="flex-1">
          <h3 className="font-court text-3xl tracking-wide">Ansh Gupta</h3>
          <p className="font-mono text-[11px] tracking-[2px] text-court-key-dark uppercase mb-3">
            Point Guard — AI/ML Engineering
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {[
              ["Team", "University of Delhi"],
              ["Program", "B.Tech ECE"],
              ["Minor", "AI / ML"],
              ["Season", "Aug 2023 — Present"],
            ].map(([l, v]) => (
              <div key={l} className="border-2 border-court-ink px-2 py-1 bg-white">
                <div className="font-mono text-[9px] tracking-[2px] uppercase text-court-ink/60">{l}</div>
                <div className="text-sm font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <div className="font-mono text-[10px] tracking-[2px] uppercase mb-2 text-court-ink/60">Training camp drills</div>
          <div className="flex flex-wrap gap-2">
            {["Embedded Systems","Digital Comm","Linear ICs","Machine Learning","Neural Networks","DSA","Signal Processing","Probability","Data Analytics"].map(d => (
              <span key={d} className="text-xs px-2 py-1 bg-court-ink text-court-cream font-mono">{d}</span>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}

function StartingFive() {
  const five = [
    { n: "01", pos: "PG — Languages", h: "Ball Handlers", items: ["Python","Java","C/C++","JavaScript","MATLAB"] },
    { n: "02", pos: "SG — Frameworks", h: "Scoring Tools", items: ["PyTorch","TensorFlow","FastAPI","scikit-learn","OpenCV","Express.js"] },
    { n: "03", pos: "C — ML & Research", h: "Down Low", items: ["GNNs","Transformers","Model Opt.","Feature Eng.","Benchmarking"] },
    { n: "04", pos: "PF — Tech Stack", h: "Under the Boards", items: ["DSP","Embedded","IoT","CV","PostgreSQL","MongoDB"] },
    { n: "05", pos: "SF — Tools", h: "Two-Way Utility", items: ["AWS","Docker","Git","GCP","Linux"] },
  ];
  return (
    <section className="py-2">
      <SectionHead kicker="The Lineup" title="Starting Five" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {five.map(p => (
          <Card key={p.n} className="p-4 hover:-translate-y-1 hover:shadow-[8px_8px_0_#e8641b] transition-transform">
            <div className="font-jersey text-5xl text-court-key leading-none">{p.n}</div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-court-ink/60 mt-1">{p.pos}</div>
            <h4 className="font-court text-xl tracking-wide mt-2">{p.h}</h4>
            <ul className="mt-2 flex flex-wrap gap-1">
              {p.items.map(i => (
                <li key={i} className="text-[11px] px-2 py-[2px] border border-court-ink bg-white font-mono">{i}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}

function GameLog() {
  const logs = [
    {
      q: "Q1", when: "Jun–Aug 2025",
      h: "Research Intern",
      org: "IIIT Delhi · Computational Biology (Prof. Gaurav Ahuja)",
      bullets: [
        "ML models with ECFP6 + GROVER fingerprints; feature eng. & tuning.",
        "Processed 10K+ PPI samples; balanced via negative sampling.",
      ],
      stats: [["+12%","ROC-AUC"],["+18%","Robustness"],["10K+","PPI"]],
    },
    {
      q: "Q2", when: "Jun–Aug 2025",
      h: "FitBudd — AI Fitness Assistant", org: "Personal Project",
      bullets: [
        "Real-time posture pipeline w/ MediaPipe (33 keypoints) + dual-stream CNN.",
        "Skeletal features: joint angles, velocities, temporal smoothing.",
      ],
      stats: [["33","Keypoints"],["-20%","Noise"]],
    },
    {
      q: "Q3", when: "Jan–Mar 2026",
      h: "API Doc Drift Detection", org: "Personal Project",
      bullets: [
        "Contract validator monitoring live payloads vs OpenAPI specs.",
        "AI-generated drift explanations + auto patch suggestions.",
      ],
      stats: [["Live","Monitoring"],["Auto","Patches"]],
    },
    {
      q: "Q4", when: "Feb–Apr 2026",
      h: "Geo-Intelligent Disaster Response", org: "Personal Project",
      bullets: [
        "PostGIS + Transformer/CNN-BiLSTM ensemble for multi-hazard forecasting.",
        "ETL over 44 yrs of NASA POWER satellite telemetry.",
      ],
      stats: [["600K+","Obs"],["40+","Regions"],["44yr","History"]],
    },
  ];
  return (
    <section className="py-2">
      <SectionHead kicker="Play by Play" title="Game Log" />
      <div className="grid md:grid-cols-2 gap-4">
        {logs.map(l => (
          <Card key={l.q} className="p-5 relative">
            <div className="absolute -top-3 -left-3 bg-court-key border-4 border-court-ink font-jersey text-2xl px-3 py-1 shadow-[3px_3px_0_#1a1208]">
              {l.q}
            </div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-court-ink/60 text-right">{l.when}</div>
            <h4 className="font-court text-2xl tracking-wide mt-1">{l.h}</h4>
            <div className="font-mono text-[11px] text-court-key-dark mb-2">{l.org}</div>
            <ul className="text-sm space-y-1 mb-3 list-disc pl-5 marker:text-court-key">
              {l.bullets.map((b,i) => <li key={i}>{b}</li>)}
            </ul>
            <div className="flex gap-3 flex-wrap">
              {l.stats.map(([b,s]) => (
                <div key={s} className="bg-court-ink text-court-cream px-2 py-1">
                  <div className="font-jersey text-xl text-court-key leading-none">{b}</div>
                  <div className="font-mono text-[9px] tracking-[1px] opacity-70">{s}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TrophyCase() {
  const items = [
    ["⭐","Selected for Amazon ML Summer School 2026","Top 3000 candidates from 140K+ applicants."],
    ["🏆","AWS Bharat Startup Yatra","Core team member of CubeSanchar."],
    ["🥇","Top 10 Teams","Blueprint Competition · eDC IIT Delhi."],
    ["🥈","2nd Place","Startup Spotlight · Masters' Union (MUIL)."],
    ["🥉","3rd Place","Sankalp 101 Hackathon · Team TrishulX."],
    ["⭐","Treasurer","IEEE Student Branch — budgeting & tech events."],
    ["🎤","Volunteer","NVIDIA Community Meetup — 200+ attendees."],
  ];
  return (
    <section className="py-2">
      <SectionHead kicker="Trophy Case" title="Achievements" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map(([em, h, p]) => (
          <Card key={h} className="p-4 flex gap-3 items-start hover:rotate-[-1deg] transition-transform">
            <div className="text-3xl">{em}</div>
            <div>
              <h5 className="font-court text-lg tracking-wide leading-tight">{h}</h5>
              <p className="text-xs text-court-ink/75 mt-1 leading-snug">{p}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Timeout({ onDunk }: { onDunk: () => void }) {
  return (
    <section className="py-2">
      <SectionHead kicker="Final Buzzer" title="Call a Timeout" />
      <Card className="p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: "repeating-linear-gradient(45deg,#e8641b 0 12px,transparent 12px 24px)" }} />
        <p className="font-mono text-[12px] tracking-[3px] text-court-red mb-3 relative">
          <span className="inline-block w-2 h-2 rounded-full bg-court-red align-middle mr-2" style={{ animation: "buzzer 1s infinite" }} />
          00:00 ON THE CLOCK
        </p>
        <h2 className="font-jersey uppercase text-4xl md:text-6xl relative">Let's Run a Play</h2>
        <p className="max-w-xl mx-auto mt-3 text-court-ink/80 relative">
          Have a role, project, or idea worth a possession? Pass me the ball.
        </p>
        <div className="mt-6 flex gap-3 flex-wrap justify-center relative">
          <CourtButton href="mailto:anshgupta456ansh@gmail.com" onClick={onDunk}>📧 Email</CourtButton>
          <CourtButton href="tel:+919311522763" variant="ghost" onClick={onDunk}>📞 Call</CourtButton>
          <CourtButton href="https://linkedin.com/in/ansh-gupta" variant="ghost" onClick={onDunk} target="_blank" rel="noopener">LinkedIn</CourtButton>
          <CourtButton href="https://github.com/anshgupta-456" variant="whistle" onClick={onDunk} target="_blank" rel="noopener">GitHub</CourtButton>
        </div>
      </Card>
    </section>
  );
}

/* ---------- shared footer ---------- */

function CourtFooter({ onDunk }: { onDunk: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("anshgupta456ansh@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  };
  const contacts: { label: string; href: string; icon: string }[] = [
    { label: "Email",    href: "mailto:anshgupta456ansh@gmail.com", icon: "📧" },
    { label: "Call",     href: "tel:+919311522763",                 icon: "📞" },
    { label: "LinkedIn", href: "https://linkedin.com/in/ansh-gupta", icon: "in" },
    { label: "GitHub",   href: "https://github.com/anshgupta-456",   icon: "gh" },
  ];
  return (
    <footer className="mt-6 bg-court-ink text-court-cream border-t-4 border-court-key">
      <div className="max-w-6xl mx-auto px-6 py-8 grid gap-6 md:grid-cols-[1fr_auto] items-center">
        <div>
          <div className="font-mono text-[11px] tracking-[3px] text-court-key uppercase mb-2">
            ● The bench is always open
          </div>
          <div className="font-jersey text-3xl uppercase leading-none">Contact Me</div>
          <p className="mt-2 text-sm text-court-cream/70 max-w-md">
            Roles, collabs, weird ML questions — throw the pass, I'll finish the play.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 border-2 border-court-key bg-court-key text-court-ink font-mono text-[11px] tracking-[2px] uppercase px-3 py-2 hover:bg-court-cream transition-colors shadow-[3px_3px_0_#e8641b]"
          >
            <span className="text-xs">{copied ? "✓" : "⎘"}</span>{copied ? "Copied!" : "Copy Email"}
          </button>
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              onClick={onDunk}
              className="inline-flex items-center gap-2 border-2 border-court-key bg-court-ink text-court-cream font-mono text-[11px] tracking-[2px] uppercase px-3 py-2 hover:bg-court-key hover:text-court-ink transition-colors shadow-[3px_3px_0_#e8641b]"
            >
              <span className="text-xs">{c.icon}</span>{c.label}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-court-key/30">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap justify-between gap-2 font-mono text-[10px] tracking-[2px] text-court-cream/60 uppercase">
          <span>© 2026 Ansh Gupta · Full-Court Portfolio</span>
          <span>Built with PyTorch &amp; hustle · Ask Coach Buzzer 🏀</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Coach Buzzer AI ---------- */

function CoachBuzzer({ onGoTab }: { onGoTab: (id: TabId) => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handledToolCalls = useRef<Set<string>>(new Set());

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, status, error } = useChat({ transport });

  // handle tool call → tab jump (AI SDK v5 tool part shape: type "tool-<name>", state "output-available")
  useEffect(() => {
    for (const m of messages) {
      if (m.role !== "assistant") continue;
      for (const part of m.parts ?? []) {
        const anyPart = part as {
          type?: string;
          state?: string;
          toolCallId?: string;
          output?: { tab?: TabId };
          input?: { tab?: TabId };
        };
        if (anyPart.type !== "tool-go_to_tab") continue;
        const id = anyPart.toolCallId ?? `${m.id}:${anyPart.type}`;
        if (handledToolCalls.current.has(id)) continue;
        const tab = anyPart.output?.tab ?? anyPart.input?.tab;
        if (tab && (anyPart.state === "output-available" || anyPart.state === "input-available")) {
          handledToolCalls.current.add(id);
          onGoTab(tab);
        }
      }
    }
  }, [messages, onGoTab]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const busy = status === "streaming" || status === "submitted";

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    void sendMessage({ text: trimmed });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const QUICK_PROMPTS: { label: string; prompt: string }[] = [
    { label: "🏀 Who is Ansh?",   prompt: "Give me a quick scouting report on Ansh." },
    { label: "📊 Show projects",   prompt: "Take me to the projects tab." },
    { label: "🛠 Skills stack",    prompt: "Show me his skills / tech stack." },
    { label: "🏆 Achievements",    prompt: "What are his top achievements?" },
    { label: "📬 Contact",         prompt: "Take me to the contact section." },
  ];

  return (
    <>
      {/* toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[90] flex items-center gap-2 bg-court-key text-court-ink border-4 border-court-ink px-4 py-3 shadow-[6px_6px_0_#1a1208] hover:-translate-y-0.5 hover:shadow-[8px_10px_0_#1a1208] active:translate-y-0 active:shadow-[3px_3px_0_#1a1208] transition-all duration-200 ease-out font-mono text-[11px] tracking-[2px] uppercase font-bold"
        aria-label="Talk to Coach Buzzer"
      >
        <span
          className="w-7 h-7 rounded-full grid place-items-center bg-court-ink text-court-cream font-jersey transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >🏀</span>
        {open ? "Close Bench" : "Ask Coach"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[90] w-[min(380px,calc(100vw-2.5rem))] bg-court-cream border-4 border-court-ink shadow-[8px_8px_0_#1a1208] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300 ease-out origin-bottom-right">
          <div className="bg-court-ink text-court-cream px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[3px] text-court-key uppercase">Head Coach</div>
              <div className="font-court text-xl leading-none">Coach Buzzer</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-court-cream/70 hover:text-court-key text-lg leading-none"
              aria-label="Close"
            >✕</button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 p-3 max-h-[52vh] overflow-y-auto space-y-2 text-sm bg-[repeating-linear-gradient(0deg,transparent_0_24px,rgba(26,18,8,.06)_24px_25px)]"
          >
            {messages.length === 0 && (
              <div className="text-court-ink/80 text-[13px] leading-relaxed animate-in fade-in duration-500">
                <b>Coach Buzzer here.</b> Run a play — tap a quick prompt or type your own.
              </div>
            )}
            {messages.map((m) => {
              const text = (m.parts ?? [])
                .map((p) => (p.type === "text" ? (p as { text: string }).text : ""))
                .join("");
              const isUser = m.role === "user";
              if (!text) return null;
              return (
                <div
                  key={m.id}
                  className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={[
                      "max-w-[85%] px-3 py-2 border-2 border-court-ink text-[13px] leading-snug whitespace-pre-wrap",
                      isUser
                        ? "bg-court-key text-court-ink shadow-[3px_3px_0_#1a1208]"
                        : "bg-white text-court-ink shadow-[3px_3px_0_#e8641b]",
                    ].join(" ")}
                  >
                    {text}
                  </div>
                </div>
              );
            })}
            {busy && (
              <div className="flex items-center gap-1.5 text-court-ink/70 font-mono text-[11px] tracking-[2px] uppercase animate-in fade-in duration-200">
                <span className="w-2 h-2 rounded-full bg-court-key animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-court-key animate-bounce" style={{ animationDelay: "120ms" }} />
                <span className="w-2 h-2 rounded-full bg-court-key animate-bounce" style={{ animationDelay: "240ms" }} />
                <span className="ml-2">Coach on the clipboard…</span>
              </div>
            )}
            {error && (
              <div className="text-court-red font-mono text-[11px] tracking-[1px] animate-in fade-in">
                Timeout on the play — {error.message}
              </div>
            )}
          </div>

          {/* quick prompt chips */}
          <div className="border-t-2 border-court-ink/20 bg-court-cream px-2 py-2 flex gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q.label}
                type="button"
                disabled={busy}
                onClick={() => send(q.prompt)}
                className="whitespace-nowrap shrink-0 border-2 border-court-ink bg-white text-court-ink text-[11px] font-mono uppercase tracking-[1px] px-2.5 py-1 hover:bg-court-key hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0_#1a1208]"
              >
                {q.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex border-t-4 border-court-ink">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, contact…"
              className="flex-1 px-3 py-2 bg-white text-court-ink outline-none font-mono text-[13px] placeholder:text-court-ink/40"
            />
            <button
              type="submit"
              disabled={busy}
              className="bg-court-key text-court-ink border-l-4 border-court-ink px-4 font-mono text-[11px] tracking-[2px] uppercase font-bold hover:bg-court-ink hover:text-court-key transition-colors duration-200 disabled:opacity-50"
            >
              Pass ▶
            </button>
          </form>
        </div>
      )}
    </>
  );
}
