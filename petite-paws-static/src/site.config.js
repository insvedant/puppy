/**
 * Business settings. Edit these, then run `npm run build` to regenerate the site.
 */
export const site = {
  name: "Petite Paws",
  tagline: "Toy & Teacup Puppies",
  description:
    "Vet-checked toy and teacup puppies raised in a loving home, with live video calls, safe delivery and a one-year health guarantee.",
  url: "https://www.example.com", // your live domain, no trailing slash

  // WhatsApp: country code + number, digits only (no +, spaces or dashes)
  whatsappNumber: "15551234567",
  whatsappDisplay: "+1 555 123 4567",
  whatsappDefaultMessage: "Hi Petite Paws! I'd like to know more about your puppies.",

  email: "hello@petitepaws.example",
  phoneDisplay: "+1 555 123 4567",
  hours: [
    { days: "Mon – Fri", time: "9:30 AM – 8:00 PM" },
    { days: "Saturday", time: "10:00 AM – 6:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  foundedYear: 2016,

  currency: "USD", // e.g. "INR"
  locale: "en-US", // e.g. "en-IN"

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },

  stats: [
    { value: "4.9★", label: "from 180+ reviews" },
    { value: "1,200+", label: "puppies placed" },
    { value: "10 yrs", label: "of breeding" },
    { value: "1 year", label: "health guarantee" },
    { value: "Live", label: "video calls daily" },
  ],
};
