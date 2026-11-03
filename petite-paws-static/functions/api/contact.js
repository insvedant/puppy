// Cloudflare Pages Function: handles POST /api/contact
import { handleContact } from "../../worker/contact.js";

export const onRequestPost = ({ request, env }) => handleContact(request, env);
