/**
 * Shared contact-form handler used by both the Cloudflare Pages Function
 * (functions/api/contact.js) and the Worker (worker/index.js).
 *
 * Environment variables (set in the Cloudflare dashboard → Settings → Variables):
 *   RESEND_API_KEY      API key from https://resend.com (optional)
 *   CONTACT_TO_EMAIL    where enquiries are sent
 *   CONTACT_FROM_EMAIL  verified sender, e.g. "Website <noreply@yourdomain.com>"
 * Without RESEND_API_KEY, messages are only logged (visible in Workers logs).
 */
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export async function handleContact(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  let body;
  try {
    const type = request.headers.get("content-type") || "";
    body = type.includes("application/json") ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (body.company) return json({ ok: true }); // honeypot

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const interest = clean(body.interest, 100);
  const message = clean(body.message, 3000);

  if (!name || !message) return json({ error: "Please add your name and a message." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400);

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    console.log("[contact] New message (email not configured)", { name, email, phone, interest, message });
    return json({ ok: true });
  }

  const html = `<h2>New website enquiry</h2>
<p><b>Name:</b> ${escape(name)}<br><b>Email:</b> ${escape(email)}<br><b>Phone:</b> ${escape(phone || "-")}<br><b>Interested in:</b> ${escape(interest || "-")}</p>
<p>${escape(message).replace(/\n/g, "<br>")}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || "Website <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `New enquiry from ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return json({ error: "We couldn't send your message right now. Please message us on WhatsApp." }, 502);
  }
  return json({ ok: true });
}
