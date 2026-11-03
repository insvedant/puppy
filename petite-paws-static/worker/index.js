// Cloudflare Worker entry: serves /api/contact, everything else comes from /public (static assets).
import { handleContact } from "./contact.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};
