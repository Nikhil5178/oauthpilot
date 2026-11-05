import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Search, Sparkles, ShieldCheck, Zap, Github, LoaderCircle, AlertCircle } from "lucide-react";
import GuideCard from "./components/GuideCard";
import GuideView from "./components/GuideView";
import { getApps, getGuide, researchApp } from "./services/api";

function Header() {
  return <header className="border-b border-white/10"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link to="/" className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white"><ShieldCheck size={20}/></div><span className="text-lg font-bold tracking-tight text-white">OAuth<span className="text-violet-300">Pilot</span></span></Link><div className="hidden items-center gap-6 text-sm text-slate-500 sm:flex"><a href="#library" className="hover:text-white">App library</a><a href="#how-it-works" className="hover:text-white">How it works</a><span className="rounded-full border border-white/10 px-3 py-1 text-xs">Developer preview</span></div></div></header>;
}

function Home() {
  const [apps, setApps] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { getApps().then(setApps).catch(e => setError(e.message)); }, []);
  const filtered = useMemo(() => apps.filter(a => `${a.name} ${a.category}`.toLowerCase().includes(query.toLowerCase())), [apps, query]);

  async function submit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setError("");
    try {
      const guide = await researchApp(query.trim());
      navigate(`/guide/${guide.id}`, { state: { guide } });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return <main>
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute left-1/2 top-[-240px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[110px]"/>
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 md:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs text-violet-200"><Sparkles size={13}/> AI research for developer integrations</div>
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl">OAuth setup,<br/><span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">without the guesswork.</span></h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">Understand the steps, effort, approval requirements, and blockers before you build. Search a guide or let an AI research agent investigate any app.</p>
        <form onSubmit={submit} className="mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-[#111827]/90 p-2 shadow-2xl shadow-violet-950/30 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3"><Search size={19} className="shrink-0 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search an app or paste its website..." className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"/></div>
          <button disabled={loading || !query.trim()} className="flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <><LoaderCircle size={16} className="animate-spin"/> Researching</> : <><Bot size={16}/> Research an app <ArrowRight size={15}/></>}</button>
        </form>
        {error && <div className="mt-3 flex max-w-2xl items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200"><AlertCircle size={16} className="mt-0.5 shrink-0"/>{error}</div>}
        <p className="mt-3 text-xs text-slate-600">Try an app not in the library. Live research requires an OpenAI API key on the backend.</p>
        <div className="mt-12 flex flex-wrap gap-8 text-xs text-slate-500"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-300"/> Evidence-backed guidance</span><span className="flex items-center gap-2"><Zap size={15} className="text-amber-300"/> Effort vs. approval clarity</span><span className="flex items-center gap-2"><Bot size={15} className="text-violet-300"/> Live agent research</span></div>
      </div>
    </section>

    <section id="library" className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">STARTER LIBRARY</p><h2 className="mt-3 text-3xl font-bold text-white">Explore OAuth guides</h2><p className="mt-2 text-sm text-slate-500">A focused set of providers with different setup and review challenges.</p></div><span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">{apps.length} starter guides</span></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(app=><GuideCard key={app.id} app={app}/>)}</div>
      {filtered.length === 0 && <p className="mt-8 text-sm text-slate-500">No matching starter guide. Use the research box above to investigate this app.</p>}
    </section>

    <section id="how-it-works" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-5 py-16"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">HOW IT WORKS</p><h2 className="mt-3 text-3xl font-bold text-white">From unknown app to clear next steps.</h2><div className="mt-9 grid gap-4 md:grid-cols-3">{[{n:"01",t:"Investigate",d:"The agent searches official provider documentation and registration paths."},{n:"02",t:"Assess",d:"It extracts setup steps, scopes, approval conditions, effort, and likely blockers."},{n:"03",t:"Act with confidence",d:"Get a sourced guide, track your checklist, and share it with your team."}].map(x=><div key={x.n} className="rounded-2xl border border-white/10 bg-[#0c1220] p-6"><span className="text-sm font-semibold text-violet-300">{x.n}</span><h3 className="mt-4 text-xl font-semibold text-white">{x.t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{x.d}</p></div>)}</div></div>
    </section>
    <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-xs text-slate-600"><span>OAuthPilot · Built for developers and agent builders</span><span>Research assistant, not an OAuth credential manager.</span></footer>
  </main>;
}

function GuideRoute() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getGuide(id).then(r=>setGuide(r.guide)).catch(e=>setError(e.message)); }, [id]);
  if (error) return <div className="mx-auto max-w-4xl px-5 py-20 text-center text-slate-400">{error}<p className="mt-4"><Link to="/" className="text-violet-300">Return to library</Link></p></div>;
  if (!guide) return <div className="flex min-h-[50vh] items-center justify-center text-slate-500"><LoaderCircle className="animate-spin"/> <span className="ml-2">Loading guide...</span></div>;
  return <GuideView guide={guide}/>;
}

export default function App() {
  return <div className="min-h-screen bg-[#090d18]"><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/guide/:id" element={<GuideRoute/>}/></Routes></div>;
}