const BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function getApps() {
  const res = await fetch(`${BASE}/api/apps`);
  if (!res.ok) throw new Error("Could not load app library");
  return res.json();
}

export async function getGuide(id) {
  const res = await fetch(`${BASE}/api/guides/${id}`);
  if (!res.ok) throw new Error("Guide not found");
  return res.json();
}

export async function researchApp(app) {
  const res = await fetch(`${BASE}/api/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Research failed");
  return data.guide;
}