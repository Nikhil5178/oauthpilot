import { ArrowLeft, ArrowUpRight, CheckCircle2, Circle, Clock3, Copy, ExternalLink, ShieldCheck, UserRound, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function GuideView({ guide }) {
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  const done = Object.values(checked).filter(Boolean).length;
  const steps = guide.steps || [];
  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-10">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16}/> Back to library</Link>
        <button onClick={copyLink} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"><Copy size={15}/>{copied ? "Copied!" : "Share guide"}</button>
      </div>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-[#11182a] to-[#0b1020] p-7 md:p-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-violet-200"><span className="rounded-full bg-violet-400/10 px-3 py-1">OAUTH SETUP GUIDE</span>{guide.created_at && <span className="text-slate-500">AI-generated research</span>}</div>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
          <div><h1 className="text-4xl font-bold tracking-tight text-white">{guide.name}</h1><a href={guide.website} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-violet-300">{guide.website} <ArrowUpRight size={13}/></a></div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-200">{guide.difficulty || "Unknown"} difficulty</span>
        </div>
        <p className="mt-6 max-w-3xl leading-7 text-slate-300">{guide.summary}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><Clock3 size={18} className="text-violet-300"/><p className="mt-3 text-xs text-slate-500">ESTIMATED HANDS-ON EFFORT</p><p className="mt-1 font-semibold text-white">{guide.effort || "Not verified"}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><ShieldCheck size={18} className="text-amber-300"/><p className="mt-3 text-xs text-slate-500">APPROVAL / WAIT TIME</p><p className="mt-1 text-sm leading-6 text-white">{guide.approval || "Not verified"}</p></div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Setup checklist</h2><span className="text-xs text-slate-500">{done}/{steps.length} completed</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-400 transition-all" style={{width: `${steps.length ? done / steps.length * 100 : 0}%`}}/></div>
            <div className="mt-5 space-y-4">{steps.map((step, i) => <button key={i} onClick={() => setChecked(s => ({...s, [i]: !s[i]}))} className="flex w-full items-start gap-3 text-left"><span className={`mt-0.5 ${checked[i] ? "text-emerald-400" : "text-slate-600"}`}>{checked[i] ? <CheckCircle2 size={19}/> : <Circle size={19}/>}</span><span className={`text-sm leading-6 ${checked[i] ? "text-slate-500 line-through" : "text-slate-300"}`}>{step}</span></button>)}</div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <h2 className="text-xl font-semibold">Before you start</h2>
            <ul className="mt-4 space-y-3">{(guide.prerequisites || []).map((x,i)=><li key={i} className="flex gap-3 text-sm text-slate-300"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-violet-300"/>{x}</li>)}</ul>
          </section>

          <section className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-6">
            <h2 className="text-xl font-semibold">Potential blockers</h2>
            <ul className="mt-4 space-y-3">{(guide.blockers || []).map((x,i)=><li key={i} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300"/>{x}</li>)}</ul>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-5"><div className="flex items-center gap-2 font-semibold"><Bot size={17} className="text-violet-300"/> Agent can do</div><ul className="mt-4 space-y-2 text-sm leading-6 text-slate-400">{(guide.agent_can || []).map((x,i)=><li key={i}>• {x}</li>)}</ul></div>
            <div className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.04] p-5"><div className="flex items-center gap-2 font-semibold"><UserRound size={17} className="text-blue-300"/> You must do</div><ul className="mt-4 space-y-2 text-sm leading-6 text-slate-400">{(guide.developer_must || []).map((x,i)=><li key={i}>• {x}</li>)}</ul></div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <h2 className="text-xl font-semibold">Sources & evidence</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{guide.confidence || "Review the linked sources before relying on this guide."}</p>
            <div className="mt-4 space-y-3">{(guide.sources || []).map((s,i)=><a key={i} href={s.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-white/10 p-3 text-sm hover:border-violet-400/30"><span><span className="block text-slate-200">{s.title || s.url}</span><span className="mt-1 block break-all text-xs text-slate-500">{s.url}</span></span><ExternalLink size={15} className="shrink-0 text-slate-500"/></a>)}</div>
            {(guide.verification_notes || []).length > 0 && <div className="mt-5 rounded-xl bg-black/20 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verification notes</p>{guide.verification_notes.map((n,i)=><p key={i} className="mt-2 text-sm leading-6 text-slate-400">{n}</p>)}</div>}
          </section>
        </div>
        <aside className="space-y-4">
          <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your progress</p>
            <p className="mt-2 text-3xl font-bold text-white">{steps.length ? Math.round(done / steps.length * 100) : 0}%</p>
            <p className="mt-1 text-sm text-slate-500">Checklist completed</p>
            <div className="mt-5 border-t border-white/10 pt-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Confidence</p><p className="mt-2 text-sm leading-6 text-slate-300">{guide.confidence || "Not assessed"}</p></div>
            <p className="mt-5 text-xs leading-5 text-slate-500">OAuthPilot provides research and guidance. It does not create provider apps, submit approvals, or store OAuth secrets.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}