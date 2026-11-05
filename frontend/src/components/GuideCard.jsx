import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

const accents = {
  "Developer tools": "from-slate-500/20 to-slate-300/5",
  Communication: "from-emerald-500/20 to-emerald-300/5",
  Productivity: "from-violet-500/20 to-violet-300/5",
  "Developer platform": "from-blue-500/20 to-blue-300/5",
  CRM: "from-orange-500/20 to-orange-300/5"
};

export default function GuideCard({ app }) {
  return (
    <Link to={`/guide/${app.id}`} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.06]">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accents[app.category] || "from-violet-500/20 to-blue-500/10"} text-lg font-bold`}>
        {app.name.slice(0, 1)}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{app.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{app.category}</p>
        </div>
        <ArrowUpRight size={17} className="text-slate-500 transition group-hover:text-violet-300" />
      </div>
      <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">{app.summary}</p>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">{app.difficulty}</span>
        <span className="flex items-center gap-1 text-xs text-slate-500"><Clock3 size={13} /> Setup guide</span>
      </div>
    </Link>
  );
}