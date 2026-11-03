/**
 * Petite Paws — server code for Cloudflare Pages (advanced mode).
 * This one file runs the website pages, the /admin panel, the contact form and photo uploads.
 * Plain JavaScript, no dependencies. Cloudflare runs it automatically because it is named _worker.js.
 *
 * Needs these in Cloudflare Pages → your project → Settings:
 *   Bindings:  D1 database named DB, R2 bucket named IMAGES (optional, for photo uploads)
 *   Secrets:   ADMIN_PASSWORD (required), ADMIN_USERNAME (optional, default admin)
 */

// petite-paws-cf/worker/seed/site.js
var site = {
  name: "Petite Paws",
  tagline: "Toy & Teacup Puppies",
  description: "Vet-checked toy and teacup puppies raised in a loving home, with live video calls, safe delivery and a one-year health guarantee.",
  url: "https://www.example.com",
  // your live domain, no trailing slash
  // WhatsApp: country code + number, digits only (no +, spaces or dashes)
  whatsappNumber: "15551234567",
  whatsappDisplay: "+1 555 123 4567",
  whatsappDefaultMessage: "Hi Petite Paws! I'd like to know more about your puppies.",
  email: "hello@petitepaws.example",
  phoneDisplay: "+1 555 123 4567",
  hours: [
    { days: "Mon \u2013 Fri", time: "9:30 AM \u2013 8:00 PM" },
    { days: "Saturday", time: "10:00 AM \u2013 6:00 PM" },
    { days: "Sunday", time: "Closed" }
  ],
  foundedYear: 2016,
  heroEyebrow: "Toy & teacup puppies",
  heroTitle: "Small puppies, raised with big care.",
  heroText: "Vet-checked Pomeranians, Maltipoos, Poodles and more, raised in our home and delivered to your door with a one-year health guarantee.",
  aboutStory: "We started with one Pomeranian and a lot of questions about how to raise small dogs well. Today we work with a handful of carefully selected breeds and a dedicated vet partner.\n\nOur puppies grow up inside our home, around everyday sounds and people. By the time they leave, they're used to handling, grooming and short car rides.",
  currency: "USD",
  // e.g. "INR"
  locale: "en-US",
  // e.g. "en-IN"
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/"
  },
  stats: [
    { value: "4.9\u2605", label: "from 180+ reviews" },
    { value: "1,200+", label: "puppies placed" },
    { value: "10 yrs", label: "of breeding" },
    { value: "1 year", label: "health guarantee" },
    { value: "Live", label: "video calls daily" }
  ]
};

// petite-paws-cf/worker/seed/breeds.js
var breeds = [
  {
    slug: "pomeranian",
    image: "/images/breeds/pomeranian.webp",
    name: "Pomeranian",
    blurb: "Fox-like face, big personality, lots of fluff.",
    description: "Pomeranians are bold, curious and loyal. Their thick double coat and bright expression make them one of the most popular toy breeds. They are alert little watchdogs and love being the centre of attention.",
    weight: "3\u20137 lb",
    lifespan: "12\u201316 years",
    grooming: "Brush 3\u20134 times a week; occasional trims",
    goodFor: ["Apartments", "Adults & older kids", "Companionship"],
    art: { fur: "#EFC48E", ear: "#D9A15E", type: "fluffy", bg: "#FBEBD6" }
  },
  {
    slug: "maltipoo",
    image: "/images/breeds/maltipoo.webp",
    name: "Maltipoo",
    blurb: "Low-shedding, gentle and great with families.",
    description: "A cross between a Maltese and a Toy Poodle, the Maltipoo is affectionate, easy to train and has a soft, low-shedding coat. A great first dog for families and first-time owners.",
    weight: "5\u201312 lb",
    lifespan: "12\u201315 years",
    grooming: "Brush 2\u20133 times a week; trim every 6\u20138 weeks",
    goodFor: ["First-time owners", "Families", "Allergy-friendly"],
    art: { fur: "#F1DDC6", ear: "#D8B994", type: "floppy", bg: "#F7EEE4" }
  },
  {
    slug: "maltese",
    image: "/images/breeds/maltese.webp",
    name: "Maltese",
    blurb: "Silky white coat and a calm, loving nature.",
    description: "The Maltese is gentle, playful and devoted to its people. Its long white coat sheds very little, and it adapts easily to apartment life as long as it has company.",
    weight: "4\u20137 lb",
    lifespan: "12\u201315 years",
    grooming: "Daily brushing; regular face cleaning",
    goodFor: ["Apartments", "Allergy-friendly", "Calm homes"],
    art: { fur: "#FBF8F3", ear: "#EDE5DA", type: "floppy", bg: "#EEF0F6" }
  },
  {
    slug: "toy-poodle",
    image: "/images/breeds/toy-poodle.webp",
    name: "Toy Poodle",
    blurb: "Smart, hypoallergenic and easy to train.",
    description: "Toy Poodles are among the most intelligent dog breeds. They learn quickly, shed very little and come in many colours, from red and apricot to black and white.",
    weight: "4\u20136 lb",
    lifespan: "14\u201318 years",
    grooming: "Professional trim every 6\u20138 weeks",
    goodFor: ["Allergy-friendly", "Training", "Long lifespan"],
    art: { fur: "#C68B5E", ear: "#A9693F", type: "fluffy", bg: "#F5E4D8" }
  },
  {
    slug: "yorkie",
    image: "/images/breeds/yorkie.webp",
    name: "Yorkshire Terrier",
    blurb: "Brave little companion with a silky coat.",
    description: "Yorkies are confident, energetic and affectionate. Their fine, hair-like coat sheds little, and they carry a big-dog attitude in a tiny body.",
    weight: "4\u20137 lb",
    lifespan: "13\u201316 years",
    grooming: "Brush daily if kept long; or a short puppy cut",
    goodFor: ["Apartments", "Active owners", "Allergy-friendly"],
    art: { fur: "#D7A968", ear: "#6B5446", type: "pointy", bg: "#F3E7D3" }
  },
  {
    slug: "chihuahua",
    image: "/images/breeds/chihuahua.webp",
    name: "Chihuahua",
    blurb: "Tiny, loyal and full of spirit.",
    description: "The smallest breed in the world, the Chihuahua forms a deep bond with its owner. Chihuahuas are lively, alert and easy to carry everywhere.",
    weight: "2\u20136 lb",
    lifespan: "14\u201317 years",
    grooming: "Weekly brushing",
    goodFor: ["Apartments", "Single owners", "Travel"],
    art: { fur: "#E6BE8A", ear: "#D2A56C", type: "bat", bg: "#F8EBDA" }
  },
  {
    slug: "french-bulldog",
    image: "/images/breeds/french-bulldog.webp",
    name: "French Bulldog",
    blurb: "Easygoing, playful and apartment-friendly.",
    description: "Frenchies are relaxed, funny and affectionate. They need little exercise and are happy in small homes, but they don't tolerate heat well.",
    weight: "16\u201328 lb",
    lifespan: "10\u201312 years",
    grooming: "Weekly brushing; clean facial folds",
    goodFor: ["Apartments", "Families", "Low exercise"],
    art: { fur: "#B9AFA8", ear: "#958A83", type: "bat", bg: "#ECE9EC" }
  },
  {
    slug: "pomsky",
    image: "/images/breeds/pomsky.webp",
    name: "Pomsky",
    blurb: "Husky looks in a compact, cuddly size.",
    description: "A cross between a Pomeranian and a Siberian Husky, the Pomsky has striking looks, often with blue eyes. Pomskies are playful and energetic and need daily activity.",
    weight: "15\u201330 lb",
    lifespan: "12\u201315 years",
    grooming: "Brush 3\u20134 times a week; heavy seasonal shedding",
    goodFor: ["Active families", "Houses with yards"],
    art: { fur: "#B7BCC6", ear: "#6E7480", type: "pointy", bg: "#E8ECF3" }
  },
  {
    slug: "bichon-frise",
    image: "/images/breeds/bichon-frise.webp",
    name: "Bichon Frise",
    blurb: "Cheerful cotton-ball coat, low-shedding.",
    description: "Bichons are happy, sociable and gentle. Their curly white coat sheds very little, and they get along with children, other dogs and visitors.",
    weight: "7\u201312 lb",
    lifespan: "14\u201315 years",
    grooming: "Brush 2\u20133 times a week; trim every 4\u20136 weeks",
    goodFor: ["Families", "Allergy-friendly", "First-time owners"],
    art: { fur: "#FFFFFF", ear: "#F0ECE6", type: "fluffy", bg: "#F2EEF6" }
  }
];

// petite-paws-cf/worker/seed/puppies.js
var puppies = [
  {
    slug: "bella",
    name: "Bella",
    breed: "pomeranian",
    sex: "Female",
    age: "12 weeks",
    color: "Orange Sable",
    price: 4800,
    status: "available",
    adultWeight: "Est. 4 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    featured: true,
    about: "Bella is a confident little girl who loves cuddles and greets everyone with a wagging tail. She is already pad-trained and eats well on her own."
  },
  {
    slug: "milo",
    name: "Milo",
    breed: "maltipoo",
    sex: "Male",
    age: "10 weeks",
    color: "Apricot",
    price: 3900,
    status: "available",
    adultWeight: "Est. 7 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    featured: true,
    about: "Milo is gentle and easygoing. He loves to play with soft toys and then fall asleep on a lap. Great with children."
  },
  {
    slug: "snow",
    name: "Snow",
    breed: "maltese",
    sex: "Female",
    age: "13 weeks",
    color: "White",
    price: 4200,
    status: "reserved",
    adultWeight: "Est. 5 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    about: "Snow is calm and sweet with a silky white coat. She enjoys being brushed and follows her people everywhere."
  },
  {
    slug: "coco",
    name: "Coco",
    breed: "toy-poodle",
    sex: "Female",
    age: "11 weeks",
    color: "Red",
    price: 4500,
    status: "available",
    adultWeight: "Est. 5 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    featured: true,
    about: "Coco is clever and playful. She is learning her name already and loves short training games with treats."
  },
  {
    slug: "rocky",
    name: "Rocky",
    breed: "yorkie",
    sex: "Male",
    age: "12 weeks",
    color: "Black & Tan",
    price: 3600,
    status: "available",
    adultWeight: "Est. 5 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    about: "Rocky is a brave little explorer with a big heart. He loves walks around the garden and naps in the sun."
  },
  {
    slug: "pixie",
    name: "Pixie",
    breed: "chihuahua",
    sex: "Female",
    age: "14 weeks",
    color: "Fawn",
    price: 3200,
    status: "available",
    adultWeight: "Est. 3 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    about: "Pixie is tiny, spirited and very affectionate. She is the perfect travel companion and loves being carried."
  },
  {
    slug: "bruno",
    name: "Bruno",
    breed: "french-bulldog",
    sex: "Male",
    age: "12 weeks",
    color: "Blue",
    price: 5200,
    status: "reserved",
    adultWeight: "Est. 22 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    about: "Bruno is a relaxed, funny boy who snores when he sleeps. He loves people and gets along with other dogs."
  },
  {
    slug: "luna",
    name: "Luna",
    breed: "pomsky",
    sex: "Female",
    age: "11 weeks",
    color: "Grey & White",
    price: 4900,
    status: "available",
    adultWeight: "Est. 20 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    featured: true,
    about: "Luna has striking husky markings and lots of energy. She will thrive with an active family who loves to play."
  },
  {
    slug: "teddy",
    name: "Teddy",
    breed: "bichon-frise",
    sex: "Male",
    age: "10 weeks",
    color: "White",
    price: 3800,
    status: "available",
    adultWeight: "Est. 10 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    about: "Teddy is a happy cotton ball who gets along with everyone. He is well socialized with children and other pets."
  },
  {
    slug: "honey",
    name: "Honey",
    breed: "pomeranian",
    sex: "Female",
    age: "\u2014",
    color: "Cream",
    price: 5100,
    status: "sold",
    adultWeight: "Est. 4 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    about: "Honey went home to a wonderful family."
  },
  {
    slug: "oreo",
    name: "Oreo",
    breed: "toy-poodle",
    sex: "Male",
    age: "\u2014",
    color: "Black",
    price: 4300,
    status: "sold",
    adultWeight: "Est. 6 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    about: "Oreo went home to a wonderful family."
  },
  {
    slug: "daisy",
    name: "Daisy",
    breed: "maltipoo",
    sex: "Female",
    age: "\u2014",
    color: "Cream",
    price: 3900,
    status: "sold",
    adultWeight: "Est. 7 lb",
    vaccinations: "Up to date (5-in-1)",
    microchip: true,
    about: "Daisy went home to a wonderful family."
  }
];

// petite-paws-cf/worker/seed/posts.js
var posts = [
  {
    slug: "choose-the-right-small-breed",
    title: "How to Choose the Right Small Breed for Your Home",
    excerpt: "Energy, shedding, size and temperament: a practical guide to matching a toy breed to the way you live.",
    date: "2026-10-12",
    readTime: "6 min",
    breed: "maltipoo",
    body: `
<p>Small dogs share a size category, not a personality. A Chihuahua and a Maltipoo can weigh the same and still need very different homes. Before you fall in love with a photo, check how each breed fits these four areas of your life.</p>
<h2>1. Your space and schedule</h2>
<p>Apartment living suits most toy breeds, but some handle being alone better than others. Maltese and Bichons are happiest with company for most of the day. Yorkies and Chihuahuas are a little more independent once they are adults. If you work long hours away from home, plan for a dog walker or daycare whichever breed you choose.</p>
<h2>2. Allergies and shedding</h2>
<p>If anyone in the home has allergies, look at low-shedding coats: Toy Poodle, Maltipoo, Maltese and Bichon Frise. No dog is fully hypoallergenic, so spend time around the breed before deciding.</p>
<h2>3. Grooming time</h2>
<p>A Pomeranian's double coat needs brushing three to four times a week. Poodle-type coats need a professional trim every six to eight weeks. A French Bulldog needs little brushing but regular cleaning of its facial folds. Grooming is a real cost in both time and money, so budget for it.</p>
<h2>4. Children and other pets</h2>
<p>Very small puppies can be hurt by an accidental drop or a rough game. With young children, a sturdier small breed such as a Maltipoo, Bichon or French Bulldog is often the safer choice.</p>
<h2>Quick match guide</h2>
<ul>
<li><strong>First-time owner:</strong> Maltipoo, Bichon Frise</li>
<li><strong>Allergy-friendly:</strong> Toy Poodle, Maltese</li>
<li><strong>Big personality:</strong> Pomeranian, Chihuahua</li>
<li><strong>Low exercise:</strong> French Bulldog</li>
<li><strong>Active family:</strong> Pomsky</li>
</ul>
<p>Still unsure? Message us on WhatsApp and tell us about your home. We will suggest two or three breeds that fit.</p>`
  },
  {
    slug: "first-7-days-with-your-puppy",
    title: "Bringing Your Puppy Home: The First 7 Days",
    excerpt: "A day-by-day plan for settling in, from the car ride home to the first vet visit.",
    date: "2026-09-28",
    readTime: "7 min",
    breed: "pomeranian",
    body: `
<p>The first week sets the tone for everything that follows. Keep it calm, keep it simple and stick to a routine.</p>
<h2>Before day one</h2>
<ul>
<li>A small crate or playpen with a soft bed</li>
<li>The same food your puppy is already eating</li>
<li>Puppy pads, an enzyme cleaner and a few chew toys</li>
<li>A lightweight harness (not a collar) for tiny breeds</li>
<li>A nutritional gel in case of low blood sugar</li>
</ul>
<h2>Days 1\u20132: Quiet arrival</h2>
<p>Limit visitors. Show your puppy its bed, water and potty spot, then let it rest. Toy puppies sleep 18\u201320 hours a day, and that is normal. Some crying at night is also normal; a warm blanket that smells of its litter helps.</p>
<h2>Days 3\u20134: Build the routine</h2>
<p>Feed at the same times every day. Take your puppy to the potty spot after every meal, nap and play session. Praise every success, and clean accidents with an enzyme cleaner so the smell doesn't draw the puppy back.</p>
<h2>Days 5\u20136: Gentle socialization</h2>
<p>Introduce new sounds, surfaces and calm people in short sessions. Keep your puppy off public ground until its vaccinations are complete, but you can carry it outside to see the world.</p>
<h2>Day 7: First vet check</h2>
<p>Book a wellness visit within the first week. Bring the vaccination and deworming records from your puppy pack. This visit is also required to keep your health guarantee active.</p>
<h2>Watch for these signs</h2>
<p>Small breeds can develop low blood sugar. If your puppy seems weak, wobbly or very sleepy and won't eat, rub a little honey or nutritional gel on its gums and call your vet right away.</p>`
  },
  {
    slug: "feeding-a-toy-puppy",
    title: "Feeding a Toy Puppy: Schedules That Work",
    excerpt: "How often to feed, how much, and how to prevent the blood-sugar dips small puppies are prone to.",
    date: "2026-09-10",
    readTime: "5 min",
    breed: "toy-poodle",
    body: `
<p>Tiny puppies have tiny stomachs and fast metabolisms. They need small meals often, especially in the first months.</p>
<h2>How often</h2>
<ul>
<li><strong>8\u201312 weeks:</strong> 4 meals a day</li>
<li><strong>3\u20136 months:</strong> 3 meals a day</li>
<li><strong>6 months and up:</strong> 2 meals a day</li>
</ul>
<h2>What to feed</h2>
<p>Choose a small-breed puppy formula with a small kibble size. Keep the food your puppy came home with for at least two weeks, then switch gradually over 7\u201310 days if you want to change brands. Mix a little more of the new food in each day.</p>
<h2>Preventing low blood sugar</h2>
<p>Hypoglycemia is the most common emergency in toy breeds. Never skip a meal, keep a high-calorie supplement gel at home, and offer a snack after long play sessions or travel.</p>
<h2>Treats and water</h2>
<p>Treats should stay under 10% of daily calories. Fresh water should be available at all times. Use a shallow bowl that a small puppy can reach easily.</p>
<h2>Foods to avoid</h2>
<p>Chocolate, grapes, raisins, onions, garlic, xylitol (found in sugar-free gum), macadamia nuts and cooked bones are all dangerous for dogs.</p>`
  },
  {
    slug: "puppy-delivery-cargo-vs-flight-nanny",
    title: "How Puppy Delivery Works: Cargo vs Flight Nanny",
    excerpt: "What each option involves and how to choose the safest way to get your puppy home.",
    date: "2026-08-22",
    readTime: "5 min",
    breed: "chihuahua",
    body: `
<p>If you can't pick up in person, there are two main ways to bring your puppy home. Both are safe when arranged properly.</p>
<h2>Option 1: Pet cargo</h2>
<p>Your puppy travels in a climate-controlled, pressurized area of the plane in an airline-approved crate. You collect it at the cargo office at your destination airport.</p>
<ul>
<li>Lower cost</li>
<li>Available on most major routes</li>
<li>Airlines may restrict travel in very hot or cold months</li>
</ul>
<h2>Option 2: Flight nanny</h2>
<p>A trained handler flies in the cabin with your puppy under the seat and hands it to you at arrivals.</p>
<ul>
<li>Your puppy is never out of sight</li>
<li>Best for very small or young puppies</li>
<li>Higher cost, quoted per route</li>
</ul>
<h2>Paperwork that travels with your puppy</h2>
<p>A vet health certificate issued within 10 days of travel, the vaccination record and the microchip number. International trips may also need an import permit and a minimum age, so always check the rules for your country.</p>
<h2>Our recommendation</h2>
<p>For puppies under 4 lb, we suggest a flight nanny. Message us on WhatsApp with your city and we will send you both quotes.</p>`
  },
  {
    slug: "how-to-spot-a-puppy-scam",
    title: "How to Spot a Puppy Scam and Buy Safely",
    excerpt: "Fake listings are common. These checks protect you and your money before you send a deposit.",
    date: "2026-08-05",
    readTime: "6 min",
    breed: "maltese",
    body: `
<p>Puppy scams use stolen photos and pressure tactics. A few simple checks will protect you.</p>
<h2>Red flags</h2>
<ul>
<li>Prices far below what other breeders charge</li>
<li>The seller refuses a live video call</li>
<li>Payment only by gift card, crypto or a money transfer app</li>
<li>Sudden extra fees for "insurance" or "special crates" after you pay</li>
<li>Photos that appear on other websites (try a reverse image search)</li>
</ul>
<h2>What a real breeder will do</h2>
<ul>
<li>Show you the puppy live on video, on request</li>
<li>Send a written contract and health guarantee before payment</li>
<li>Share vet records and the vet clinic's details</li>
<li>Give you a registered business name you can look up</li>
</ul>
<h2>Verify you're talking to us</h2>
<p>We only message from the WhatsApp number listed on this website. If someone contacts you claiming to be us from another number, don't pay. Message our official number to confirm.</p>
<h2>Pay safely</h2>
<p>Use a card or a bank transfer to our registered business account, and always ask for a receipt for every payment.</p>`
  }
];

// petite-paws-cf/worker/seed/reviews.js
var reviews = [
  { text: "Milo arrived calm and healthy. The team sent videos every few days before pickup and answered every WhatsApp message within minutes.", name: "Priya S.", puppy: "Maltipoo family", rating: 5 },
  { text: "I was nervous about buying online. The video call with the actual puppy and the written health guarantee made all the difference.", name: "Daniel R.", puppy: "Pomeranian family", rating: 5 },
  { text: "The flight nanny handed us our little girl at arrivals with her vaccine card and a starter pack. Smooth from start to finish.", name: "Aisha K.", puppy: "Toy Poodle family", rating: 5 },
  { text: "They helped us choose a breed that suits apartment life. Six months in, Pixie is the happiest little dog.", name: "Marco L.", puppy: "Chihuahua family", rating: 5 },
  { text: "Clear contract, clear pricing, no surprises. Our vet said Teddy was in excellent condition.", name: "Hannah W.", puppy: "Bichon family", rating: 5 },
  { text: "The puppy care checklist was so useful for the first week. We still message them with questions.", name: "Rahul M.", puppy: "Yorkie family", rating: 5 }
];

// petite-paws-cf/worker/seed/faqs.js
var faqs = [
  { q: "How do I reserve a puppy?", a: "Message us on WhatsApp or use the contact form with the puppy's name. We confirm availability, set up a video call, and you secure your puppy with a deposit. The balance is due before delivery." },
  { q: "Can I see the puppy before I pay?", a: "Yes. Every reservation starts with a live video call with the puppy so you can see its movement, coat and personality." },
  { q: "What comes with my puppy?", a: "Vaccination record, deworming record, vet health certificate, microchip details, a written health guarantee and a starter kit with food, a blanket and a toy." },
  { q: "Do you deliver?", a: "Yes. You can pick up in person, or we arrange delivery by pet cargo or a flight nanny who hands the puppy to you at your airport." },
  { q: "Is the deposit refundable?", a: "Deposits are non-refundable but can be moved to another puppy if your chosen puppy does not pass its final vet check." },
  { q: "Do you offer financing?", a: "Yes. Monthly payment plans are available through our financing partner, subject to approval." },
  { q: "How big will my puppy get?", a: "Each listing shows an estimated adult weight based on the parents. Small breeds usually reach full size by 10\u201312 months." },
  { q: "What if my puppy has a health issue?", a: "Our one-year health guarantee covers genetic and congenital conditions diagnosed by a licensed vet. See the Health Guarantee page for details." },
  { q: "Can I visit in person?", a: "Yes, by appointment. Message us on WhatsApp to book a visit time." },
  { q: "How old are puppies when they go home?", a: "Puppies go home at 10 weeks or older, once they are eating well, vaccinated and cleared by our vet." }
];

// petite-paws-cf/worker/seed/process.js
var processPages = [
  {
    slug: "how-to-buy",
    title: "How to Buy",
    summary: "Choose, meet on video, reserve and bring your puppy home.",
    body: `
<h2>Reserving your puppy</h2>
<ol>
<li><strong>Pick a puppy</strong> from the available list, or tell us what you're looking for.</li>
<li><strong>Video call.</strong> We show you the puppy live and answer your questions.</li>
<li><strong>Deposit.</strong> A deposit reserves your puppy and marks it as reserved on the website.</li>
<li><strong>Agreement.</strong> You sign our adoption agreement and receive the health guarantee.</li>
<li><strong>Balance and delivery.</strong> Pay the balance before pickup or delivery.</li>
</ol>
<h3>Payment methods</h3>
<p>Card, bank transfer or financing. We never ask for gift cards or crypto.</p>`
  },
  {
    slug: "delivery",
    title: "Delivery",
    summary: "Pick up in person, pet cargo or a flight nanny.",
    body: `
<h2>Getting your puppy home</h2>
<h3>Pick up</h3><p>Collect your puppy from us by appointment. Free.</p>
<h3>Pet cargo</h3><p>Climate-controlled cargo on a direct flight to your nearest major airport. Quoted per route.</p>
<h3>Flight nanny</h3><p>A trained handler flies with your puppy in the cabin and hands it to you at arrivals. Recommended for puppies under 4 lb.</p>
<p>Read more: <a href="/blog/puppy-delivery-cargo-vs-flight-nanny">Cargo vs flight nanny</a>.</p>`
  },
  {
    slug: "health-guarantee",
    title: "Health Guarantee",
    summary: "One-year written guarantee on genetic and congenital conditions.",
    body: `
<h2>One-year health guarantee</h2>
<p>Every puppy has a full vet examination before going home. Our written guarantee covers genetic and congenital conditions diagnosed by a licensed vet within 12 months.</p>
<h3>What's included</h3>
<ul><li>Vet health certificate</li><li>Age-appropriate vaccinations and deworming</li><li>Microchip</li><li>Replacement puppy or partial refund if a covered condition is diagnosed</li></ul>
<h3>Your part</h3>
<p>Take your puppy for a vet check within 7 days of arrival and keep vaccinations up to date.</p>`
  },
  {
    slug: "financing",
    title: "Financing",
    summary: "Spread the cost with monthly payments.",
    body: `
<h2>Pay over time</h2>
<p>Spread the cost with monthly payments through our financing partner. Apply online in a few minutes and get a decision quickly.</p>
<ul><li>Plans from 6 to 24 months</li><li>No obligation to check your rate</li><li>Subject to approval</li></ul>
<p>Message us on WhatsApp and we'll send you the application link.</p>`
  },
  {
    slug: "special-order",
    title: "Special Order",
    summary: "Tell us your wishlist and we'll match you with an upcoming litter.",
    body: `
<h2>Can't find the right puppy?</h2>
<p>Tell us the breed, sex, color and size you want. We'll match you with an upcoming litter and send photos and videos as soon as a puppy fits your wishlist.</p>
<p>A special-order deposit secures your place on the waitlist and goes toward the price of your puppy.</p>`
  },
  {
    slug: "adoption-agreement",
    title: "Adoption Agreement",
    summary: "What you sign when you reserve a puppy.",
    body: `
<h2>Our adoption agreement</h2>
<p>Before any payment is final, you receive our written agreement. It covers:</p>
<ul><li>The puppy's details, price, deposit and balance</li><li>Delivery method and estimated date</li><li>The health guarantee and how to make a claim</li><li>Your responsibilities as the new owner</li><li>Our deposit and refund policy</li></ul>
<p>Ask us on WhatsApp for a sample copy before you reserve.</p>`
  },
  {
    slug: "puppy-checklist",
    title: "Puppy Checklist",
    summary: "Everything to have ready before your puppy arrives.",
    body: `
<h2>Before your puppy arrives</h2>
<ul><li>Crate or playpen, with a soft bed</li><li>Small-breed puppy food (we'll tell you the brand)</li><li>Shallow food and water bowls</li><li>Puppy pads and enzyme cleaner</li><li>Lightweight harness and leash</li><li>Soft brush and puppy shampoo</li><li>Chew toys sized for small mouths</li><li>Nutritional gel for low blood sugar</li></ul>
<p>Read our guide: <a href="/blog/first-7-days-with-your-puppy">The first 7 days</a>.</p>`
  }
];

// petite-paws-cf/worker/seed/legal.js
var legalPages = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    body: `<p>We collect the information you give us when you contact us by WhatsApp, email or our contact form: your name, phone number, email address and message. We use it only to answer your questions and to arrange your puppy's reservation and delivery.</p>
<p>We do not sell your personal information. We share it only with service providers needed to complete your order, such as payment processors and delivery partners.</p>
<p>You can ask us to see, correct or delete your information at any time by contacting us.</p>`
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    body: `<p>By using this website you agree to these terms. Puppy listings, prices and availability may change without notice. A puppy is only reserved once a deposit is received and confirmed in writing.</p>
<p>All sales are governed by the adoption agreement signed at the time of reservation.</p>`
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    body: `<p>Deposits are non-refundable but can be moved to another puppy. If your chosen puppy does not pass its final vet check, your deposit is transferred to another puppy of your choice or refunded in full.</p>
<p>Health-related claims are handled under our one-year health guarantee.</p>`
  }
];

// petite-paws-cf/worker/store.js
var SCHEMA = [
  `CREATE TABLE IF NOT EXISTS items (
     collection TEXT NOT NULL,
     slug TEXT NOT NULL,
     data TEXT NOT NULL,
     sort INTEGER NOT NULL DEFAULT 0,
     updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (collection, slug))`,
  `CREATE TABLE IF NOT EXISTS messages (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
     name TEXT, email TEXT, phone TEXT, interest TEXT, message TEXT,
     is_read INTEGER NOT NULL DEFAULT 0)`
];
var COLLECTIONS = ["puppies", "breeds", "posts", "reviews", "faqs", "process", "legal"];
var ready = false;
async function ensureDb(env) {
  if (ready) return;
  if (!env.DB) throw new Error('D1 database binding "DB" is missing. See README: create the database and add its id to wrangler.jsonc.');
  await env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s)));
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM items").first();
  if (!row || !row.n) await seed(env);
  ready = true;
}
async function seed(env) {
  const rows = [["settings", "site", site, 0]];
  const addAll = (collection, list, slugOf = (x) => x.slug) => list.forEach((item, i) => rows.push([collection, slugOf(item, i), { ...item, slug: slugOf(item, i) }, i + 1]));
  addAll("breeds", breeds);
  addAll("puppies", puppies);
  addAll("posts", posts);
  addAll("reviews", reviews, (_, i) => `review-${i + 1}`);
  addAll("faqs", faqs, (_, i) => `faq-${i + 1}`);
  addAll("process", processPages);
  addAll("legal", legalPages);
  const stmt = env.DB.prepare("INSERT OR IGNORE INTO items (collection, slug, data, sort) VALUES (?, ?, ?, ?)");
  await env.DB.batch(rows.map(([c, s, d, o]) => stmt.bind(c, s, JSON.stringify(d), o)));
}
async function loadAll(env) {
  await ensureDb(env);
  const { results } = await env.DB.prepare("SELECT collection, slug, data, sort FROM items ORDER BY collection, sort, slug").all();
  const out = { site: { ...site } };
  COLLECTIONS.forEach((c) => out[c] = []);
  for (const r of results) {
    const data = JSON.parse(r.data);
    if (r.collection === "settings") out.site = { ...site, ...data };
    else if (out[r.collection]) out[r.collection].push({ ...data, slug: r.slug, sort: r.sort });
  }
  return out;
}
async function listItems(env, collection) {
  await ensureDb(env);
  const { results } = await env.DB.prepare("SELECT slug, data, sort, updated_at FROM items WHERE collection = ? ORDER BY sort, slug").bind(collection).all();
  return results.map((r) => ({ ...JSON.parse(r.data), slug: r.slug, sort: r.sort, updated_at: r.updated_at }));
}
async function getItem(env, collection, slug) {
  await ensureDb(env);
  const r = await env.DB.prepare("SELECT slug, data, sort FROM items WHERE collection = ? AND slug = ?").bind(collection, slug).first();
  return r ? { ...JSON.parse(r.data), slug: r.slug, sort: r.sort } : null;
}
async function saveItem(env, collection, slug, data, sort = 0, oldSlug = null) {
  await ensureDb(env);
  const stmts = [];
  if (oldSlug && oldSlug !== slug) stmts.push(env.DB.prepare("DELETE FROM items WHERE collection = ? AND slug = ?").bind(collection, oldSlug));
  stmts.push(
    env.DB.prepare(
      `INSERT INTO items (collection, slug, data, sort, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(collection, slug) DO UPDATE SET data = excluded.data, sort = excluded.sort, updated_at = CURRENT_TIMESTAMP`
    ).bind(collection, slug, JSON.stringify({ ...data, slug }), sort)
  );
  await env.DB.batch(stmts);
}
async function deleteItem(env, collection, slug) {
  await ensureDb(env);
  await env.DB.prepare("DELETE FROM items WHERE collection = ? AND slug = ?").bind(collection, slug).run();
}
async function getSettings(env) {
  return await getItem(env, "settings", "site") || { ...site };
}
async function saveSettings(env, data) {
  await saveItem(env, "settings", "site", data, 0);
}
async function addMessage(env, m) {
  await ensureDb(env);
  await env.DB.prepare("INSERT INTO messages (name, email, phone, interest, message) VALUES (?, ?, ?, ?, ?)").bind(m.name, m.email, m.phone, m.interest, m.message).run();
}
async function listMessages(env) {
  await ensureDb(env);
  const { results } = await env.DB.prepare("SELECT * FROM messages ORDER BY id DESC LIMIT 500").all();
  return results;
}
async function countUnread(env) {
  await ensureDb(env);
  const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM messages WHERE is_read = 0").first();
  return r?.n || 0;
}
async function markMessage(env, id, read) {
  await env.DB.prepare("UPDATE messages SET is_read = ? WHERE id = ?").bind(read ? 1 : 0, id).run();
}
async function deleteMessage(env, id) {
  await env.DB.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();
}

// petite-paws-cf/worker/contact.js
var json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
var clean = (v, max) => typeof v === "string" ? v.trim().slice(0, max) : "";
var escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
async function handleContact(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  let body;
  try {
    const type = request.headers.get("content-type") || "";
    body = type.includes("application/json") ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (body.company) return json({ ok: true });
  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const interest = clean(body.interest, 100);
  const message = clean(body.message, 3e3);
  if (!name || !message) return json({ error: "Please add your name and a message." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  let saved = false;
  try {
    await addMessage(env, { name, email, phone, interest, message });
    saved = true;
  } catch (e) {
    console.error("[contact] Could not save message", e);
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    if (!saved) return json({ error: "We couldn't send your message right now. Please message us on WhatsApp." }, 500);
    return json({ ok: true });
  }
  const html2 = `<h2>New website enquiry</h2>
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
      html: html2
    })
  });
  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    if (saved) return json({ ok: true });
    return json({ error: "We couldn't send your message right now. Please message us on WhatsApp." }, 502);
  }
  return json({ ok: true });
}

// petite-paws-cf/worker/render.js
var esc = (s = "") => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var WA_ICON = `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.6C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`;
function puppyArt({ fur = "#E9C9A0", ear = "#C99A68", type = "fluffy" } = {}) {
  const eye = "#2B1B33";
  let ears;
  if (type === "pointy") ears = `<path d="M48 70 L60 18 L88 58Z" fill="${esc(ear)}"/><path d="M152 70 L140 18 L112 58Z" fill="${esc(ear)}"/>`;
  else if (type === "bat") ears = `<path d="M46 76 L44 14 L92 54Z" fill="${esc(ear)}"/><path d="M154 76 L156 14 L108 54Z" fill="${esc(ear)}"/><path d="M54 66 L54 30 L80 54Z" fill="#F2B8C6"/><path d="M146 66 L146 30 L120 54Z" fill="#F2B8C6"/>`;
  else ears = `<ellipse cx="46" cy="96" rx="24" ry="40" fill="${esc(ear)}" transform="rotate(18 46 96)"/><ellipse cx="154" cy="96" rx="24" ry="40" fill="${esc(ear)}" transform="rotate(-18 154 96)"/>`;
  const f = esc(fur);
  const tuft = type === "fluffy" ? `<circle cx="86" cy="50" r="16" fill="${f}"/><circle cx="100" cy="44" r="18" fill="${f}"/><circle cx="114" cy="50" r="16" fill="${f}"/>` : "";
  return `<svg viewBox="0 0 200 190" aria-hidden="true">${ears}${tuft}<ellipse cx="100" cy="104" rx="62" ry="58" fill="${f}"/><ellipse cx="100" cy="132" rx="34" ry="24" fill="#FFF7EE" opacity=".9"/><circle cx="76" cy="98" r="9" fill="${eye}"/><circle cx="124" cy="98" r="9" fill="${eye}"/><circle cx="79" cy="95" r="3" fill="#fff"/><circle cx="127" cy="95" r="3" fill="#fff"/><ellipse cx="100" cy="122" rx="11" ry="8" fill="${eye}"/><path d="M100 130 Q100 140 90 142 M100 130 Q100 140 110 142" stroke="${eye}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="66" cy="120" rx="8" ry="5" fill="#F2A7B9" opacity=".6"/><ellipse cx="134" cy="120" rx="8" ry="5" fill="#F2A7B9" opacity=".6"/></svg>`;
}
var icon = (p) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
var ICONS = {
  shield: icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  video: icon('<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>'),
  plane: icon('<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'),
  heart: icon('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>')
};
var NAV = [
  ["/puppies/", "Available Puppies"],
  ["/breeds/", "Breeds"],
  ["/how-it-works/", "How It Works"],
  ["/about/", "About"],
  ["/reviews/", "Reviews"],
  ["/blog/", "Blog"],
  ["/faq/", "FAQ"],
  ["/contact/", "Contact"]
];
var TEAM = [
  { name: "Sarah Mitchell", role: "Founder & breeder", text: "Handles matching, video calls and every litter's daily care." },
  { name: "Dr. Arjun Rao", role: "Partner veterinarian", text: "Examines every puppy and issues health certificates before travel." },
  { name: "Emily Chen", role: "Client care", text: "Your contact on WhatsApp from reservation to delivery and beyond." }
];
var DEFAULT_BREED_PHOTOS = {
  pomeranian: "/images/breeds/pomeranian.webp",
  maltipoo: "/images/breeds/maltipoo.webp",
  maltese: "/images/breeds/maltese.webp",
  "toy-poodle": "/images/breeds/toy-poodle.webp",
  yorkie: "/images/breeds/yorkie.webp",
  chihuahua: "/images/breeds/chihuahua.webp",
  "french-bulldog": "/images/breeds/french-bulldog.webp",
  pomsky: "/images/breeds/pomsky.webp",
  "bichon-frise": "/images/breeds/bichon-frise.webp"
};
var paragraphs = (text = "") => String(text).split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p.trim())}</p>`).join("");
function createRenderer(data, origin) {
  const { site: site2, breeds: breeds2, puppies: puppies2, posts: posts2, reviews: reviews2, faqs: faqs2 } = data;
  const processPages2 = data.process;
  const legalPages2 = data.legal;
  const YEAR = (/* @__PURE__ */ new Date()).getFullYear();
  const baseUrl = (site2.url && !/example\.com/.test(site2.url) ? site2.url : origin).replace(/\/$/, "");
  const wa = (msg = site2.whatsappDefaultMessage) => `https://wa.me/${String(site2.whatsappNumber).replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  const price = (n) => {
    try {
      return new Intl.NumberFormat(site2.locale || "en-US", { style: "currency", currency: site2.currency || "USD", maximumFractionDigits: 0 }).format(n || 0);
    } catch {
      return `${site2.currency} ${Number(n || 0).toLocaleString()}`;
    }
  };
  const fmtDate = (iso) => {
    const d = /* @__PURE__ */ new Date(String(iso) + "T00:00:00");
    return isNaN(d) ? esc(iso) : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const getBreed = (slug) => breeds2.find((b) => b.slug === slug);
  const bgOf = (slug) => getBreed(slug)?.art?.bg || "#F4ECF3";
  const pronoun = (p) => p.sex === "Female" ? "she" : "he";
  const breedPhoto = (slug) => getBreed(slug)?.image || DEFAULT_BREED_PHOTOS[slug] || "";
  const breedArt = (slug, { alt = "", eager = false } = {}) => {
    const src = breedPhoto(slug);
    return src ? `<img class="art-photo" src="${esc(src)}" alt="${esc(alt)}" width="480" height="480"${eager ? "" : ' loading="lazy"'} decoding="async">` : puppyArt(getBreed(slug)?.art);
  };
  const current = puppies2.filter((p) => p.status !== "sold");
  const previous = puppies2.filter((p) => p.status === "sold");
  const byFeatured = (a, b) => Number(!!b.featured) - Number(!!a.featured) || (a.sort || 0) - (b.sort || 0);
  const sortedPosts = [...posts2].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const fixLinks = (html2 = "") => html2.replace(/href="(\/[^"#?]*?[^/"])"/g, 'href="$1/"');
  const waBtn = (msg, label = "Chat on WhatsApp", cls = "btn btn-wa") => `<a class="${cls}" href="${esc(wa(msg))}" target="_blank" rel="noopener noreferrer">${WA_ICON}${esc(label)}</a>`;
  const header = (path) => `<header class="site-header"><div class="wrap nav">
<a class="logo" href="/" aria-label="${esc(site2.name)} home"><span class="logo-mark">${puppyArt({ fur: "#EFC48E", ear: "#D9A15E", type: "fluffy" })}</span><span><b>${esc(site2.name)}</b><small>${esc(site2.tagline)}</small></span></a>
<button class="burger" type="button" aria-expanded="false" aria-controls="main-menu">Menu</button>
<nav id="main-menu" class="menu" aria-label="Main">${NAV.map(([href, label]) => `<a href="${href}"${path.startsWith(href) ? ' aria-current="page"' : ""}>${esc(label)}</a>`).join("")}</nav>
</div></header>`;
  const footer = () => `<footer class="site-foot"><div class="wrap">
<div class="cols">
  <div><div class="foot-brand">${esc(site2.name)}</div>
  <p style="opacity:.8;margin-top:.5rem;max-width:34ch;font-size:.92rem">Small-breed puppies raised in a home environment, vet-checked and delivered with care.</p>
  <p style="margin-top:1rem;font-size:.92rem">WhatsApp: ${esc(site2.whatsappDisplay)}<br>${esc(site2.email)}</p></div>
  <div><h4>Puppies</h4><a href="/puppies/">Available Puppies</a><a href="/puppies/previous/">Previous Puppies</a><a href="/breeds/">Breeds</a><a href="/how-it-works/special-order/">Special Order</a></div>
  <div><h4>Process</h4>${processPages2.slice(0, 4).map((p) => `<a href="/how-it-works/${esc(p.slug)}/">${esc(p.title)}</a>`).join("")}<a href="/buy-safely/">Buy Safely</a></div>
  <div><h4>Company</h4><a href="/about/">About Us</a><a href="/reviews/">Reviews</a><a href="/blog/">Blog</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a></div>
</div>
<div class="legal"><span>\xA9 ${YEAR} ${esc(site2.name)}. All rights reserved.</span><nav aria-label="Legal">${legalPages2.map((p) => `<a href="/legal/${esc(p.slug)}/">${esc(p.title)}</a>`).join("")}</nav></div>
</div></footer>`;
  const waFloat = (msg) => `<a class="wa-float" href="${esc(wa(msg))}" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"><span class="lbl">Chat on WhatsApp</span><span class="bubble">${WA_ICON}</span></a>`;
  const pageHero = (title, subtitle, crumbs = []) => `<div class="page-hero"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${crumbs.map((x) => ` / ${x.href ? `<a href="${x.href}">${esc(x.label)}</a>` : `<span>${esc(x.label)}</span>`}`).join("")}</nav><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div></div>`;
  const ctaBand = (title = "Ready to meet your puppy?", text = "Message us and we'll set up a live video call today.") => `<section><div class="wrap"><div class="cta-band"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><div style="display:flex;gap:.6rem;flex-wrap:wrap">${waBtn("Hi! I'd like to book a video call to meet a puppy.", "WhatsApp us")}<a class="btn btn-ghost" href="/puppies/">See puppies</a></div></div></div></section>`;
  const badge = (status) => status === "reserved" ? `<span class="badge reserved">Reserved</span>` : status === "sold" ? `<span class="badge sold">Found a home</span>` : `<span class="badge">Available</span>`;
  const pupCard = (p) => {
    const b = getBreed(p.breed);
    const img = p.images?.[0];
    const media = img ? `<img src="${esc(img)}" alt="${esc(`${p.name}, ${b?.name || ""} puppy`)}" loading="lazy">` : breedArt(p.breed, { alt: `${b?.name || ""} puppy` });
    return `<a class="pup" href="/puppies/${esc(p.slug)}/" data-breed="${esc(p.breed)}" data-sex="${esc(p.sex)}" data-status="${esc(p.status)}" data-price="${Number(p.price) || 0}" data-featured="${p.featured ? 1 : 0}">
<div class="ph" style="background:${esc(bgOf(p.breed))}">${badge(p.status)}${media}</div>
<div class="info"><div class="row"><span class="name">${esc(p.name)}</span><span class="price">${p.status === "sold" ? "" : price(p.price)}</span></div>
<span class="muted" style="font-size:.9rem">${esc(b?.name)}</span>
<div class="chips"><span class="chip">${esc(p.sex)}</span>${p.age ? `<span class="chip">${esc(p.age)}</span>` : ""}${p.color ? `<span class="chip">${esc(p.color)}</span>` : ""}</div></div></a>`;
  };
  const breedCard = (b, { count, blurb } = {}) => `<a class="breed" href="/breeds/${esc(b.slug)}/"><span class="breed-art" style="background:${esc(b.art?.bg || "#F4ECF3")}">${breedArt(b.slug, { alt: `${b.name} puppy` })}</span><h3>${esc(b.name)}</h3><span>${esc(b.weight)}${count !== void 0 ? ` \xB7 ${count} available` : ""}</span>${blurb ? `<p>${esc(b.blurb)}</p>` : ""}</a>`;
  const postCard = (p) => `<a class="post" href="/blog/${esc(p.slug)}/"><div class="cover" style="background:${esc(bgOf(p.breed))}">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : breedArt(p.breed)}</div><div class="body"><div class="meta">${fmtDate(p.date)} \xB7 ${esc(p.readTime)} read</div><h3>${esc(p.title)}</h3><p class="muted" style="font-size:.93rem">${esc(p.excerpt)}</p></div></a>`;
  const reviewCard = (r) => {
    const n = Math.max(1, Math.min(5, Number(r.rating) || 5));
    return `<figure class="card review"><div class="stars" aria-label="${n} out of 5 stars">${"\u2605".repeat(n)}</div><blockquote>${esc(r.text)}</blockquote><figcaption>${esc(r.name)}${r.puppy ? ` \xB7 ${esc(r.puppy)}` : ""}</figcaption></figure>`;
  };
  const faqList = (items) => `<div class="faq">${items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>`;
  const trust = () => `<div class="trust">${(site2.stats || []).map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>`;
  const steps = () => `<div class="steps">
<div><h3>Choose</h3><p>Browse available puppies or ask us to match you with a breed.</p></div>
<div><h3>Video call</h3><p>Meet your puppy live and ask us anything.</p></div>
<div><h3>Reserve</h3><p>Secure your puppy with a deposit and sign the agreement.</p></div>
<div><h3>Go home</h3><p>Pick up or get delivery, with records and a starter kit.</p></div></div>`;
  const hoursGrid = () => `<div class="hours">${(site2.hours || []).map((h) => `<span>${esc(h.days)}</span><span>${esc(h.time)}</span>`).join("")}</div>`;
  function layout({ path, title, description = site2.description, body, waMessage, jsonLd = [], ogType = "website", fullTitle = false, noindex = false }) {
    const t = fullTitle ? title : `${title} | ${site2.name}`;
    const url = baseUrl + path;
    const ld = [
      { "@context": "https://schema.org", "@type": "PetStore", name: site2.name, url: baseUrl, email: site2.email, telephone: site2.phoneDisplay, foundingDate: String(site2.foundedYear || ""), sameAs: Object.values(site2.social || {}).filter(Boolean) },
      ...jsonLd
    ];
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(url)}">`}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site2.name)}">
<meta property="og:title" content="${esc(t)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#211824" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/nunito-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/dm-serif-display-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/style.css">
${ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
${waFloat(waMessage)}
<script src="/js/main.js" defer></script>
</body>
</html>`;
  }
  const home = () => layout({
    path: "/",
    fullTitle: true,
    title: `${site2.name} | ${site2.tagline}`,
    body: `
<div class="wrap hero">
  <div>
    <div class="eyebrow">${esc(site2.heroEyebrow || "Toy & teacup puppies")}${site2.foundedYear ? ` \xB7 since ${esc(site2.foundedYear)}` : ""}</div>
    <h1 style="margin-top:.6rem">${esc(site2.heroTitle)}</h1>
    <p class="lede">${esc(site2.heroText)}</p>
    <div class="ctas"><a class="btn btn-primary" href="/puppies/">See available puppies</a>${waBtn("Hi! I'd like to book a video call to see your available puppies.", "Book a video call")}</div>
  </div>
  <div class="art-frame" style="background:${esc(bgOf("pomeranian"))}">${site2.heroImage ? `<img src="${esc(site2.heroImage)}" alt="" style="border-radius:50% 50% 24px 24px">` : breedArt("pomeranian", { alt: "Pomeranian puppy", eager: true })}
    <span class="hero-tag" style="top:12%;left:4%">Vet-checked \u2713</span>
    <span class="hero-tag" style="bottom:12%;right:4%">1-year health guarantee</span>
  </div>
</div>
<div class="wrap">${trust()}</div>
<section><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Ready for their new homes</div><h2>Available puppies</h2></div><a class="btn btn-ghost" href="/puppies/">View all</a></div>
  ${current.length ? `<div class="grid">${[...current].sort(byFeatured).slice(0, 8).map(pupCard).join("")}</div>` : `<p class="muted">New puppies are coming soon. Message us to join the waitlist.</p>`}
</div></section>
<section class="band"><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Why families choose us</div><h2>Every puppy comes with peace of mind</h2></div></div>
  <div class="feat">
    <div><div class="ic">${ICONS.shield}</div><h3>Vet-checked</h3><p>Full vet exam, vaccinations and deworming before going home, backed by a written one-year health guarantee.</p></div>
    <div><div class="ic">${ICONS.video}</div><h3>See them live</h3><p>Meet your puppy on a live video call before you reserve. Ask for one any day of the week.</p></div>
    <div><div class="ic">${ICONS.plane}</div><h3>Safe delivery</h3><p>Pick up in person, or choose pet cargo or a flight nanny who hands your puppy to you at the airport.</p></div>
    <div><div class="ic">${ICONS.heart}</div><h3>Lifetime support</h3><p>Questions about food, training or health? Message us on WhatsApp for as long as you own your dog.</p></div>
  </div>
</div></section>
<section><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Simple and transparent</div><h2>How to bring your puppy home</h2></div><a class="btn btn-ghost" href="/how-it-works/">Full process</a></div>
  ${steps()}
</div></section>
<section class="band"><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Shop by breed</div><h2>Our breeds</h2></div><a class="btn btn-ghost" href="/breeds/">All breeds</a></div>
  <div class="breeds">${breeds2.slice(0, 5).map((b) => breedCard(b)).join("")}</div>
</div></section>
${reviews2.length ? `<section><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">Happy families</div><h2>What our families say</h2></div><a class="btn btn-ghost" href="/reviews/">All reviews</a></div>
  <div class="reviews">${reviews2.slice(0, 3).map(reviewCard).join("")}</div>
</div></section>` : ""}
${posts2.length ? `<section class="band"><div class="wrap">
  <div class="sec-head"><div><div class="eyebrow">From the blog</div><h2>Puppy guides</h2></div><a class="btn btn-ghost" href="/blog/">All posts</a></div>
  <div class="posts">${sortedPosts.slice(0, 3).map(postCard).join("")}</div>
</div></section>` : ""}
<section><div class="wrap two">
  <div><div class="eyebrow">Questions</div><h2>Frequently asked</h2>
  <p class="muted" style="margin-top:.6rem">Can't find your answer? Message us on WhatsApp and we'll reply within minutes during business hours.</p>
  <p style="margin-top:1rem"><a class="link" href="/faq/">See all questions \u2192</a></p></div>
  ${faqList(faqs2.slice(0, 5))}
</div></section>
${ctaBand()}`
  });
  const puppiesPage = () => {
    const breedOptions = breeds2.filter((b) => current.some((p) => p.breed === b.slug));
    return layout({
      path: "/puppies/",
      title: "Available Puppies",
      description: "Browse vet-checked toy and teacup puppies available now. Meet any puppy on a live video call before you reserve.",
      body: `${pageHero("Available puppies", "Every puppy is vet-checked and can be met on a live video call before you reserve.", [{ label: "Available puppies" }])}
<section><div class="wrap">
<div class="shop" data-puppy-filter>
  <aside class="filters" aria-label="Filter puppies">
    <div><label for="f-breed">Breed</label><select id="f-breed" data-f="breed"><option value="all">All breeds</option>${breedOptions.map((b) => `<option value="${esc(b.slug)}">${esc(b.name)}</option>`).join("")}</select></div>
    <div><label for="f-sex">Sex</label><select id="f-sex" data-f="sex"><option value="all">Any</option><option value="Female">Female</option><option value="Male">Male</option></select></div>
    <div><label for="f-status">Availability</label><select id="f-status" data-f="status"><option value="all">Available &amp; reserved</option><option value="available">Available only</option><option value="reserved">Reserved</option></select></div>
    <div><label for="f-sort">Sort</label><select id="f-sort" data-f="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
  </aside>
  <div>
    <p class="result-count" aria-live="polite" data-count>${current.length} puppies</p>
    <div class="grid" data-grid>${[...current].sort(byFeatured).map(pupCard).join("")}</div>
    <div class="card" data-empty hidden><p>No puppies match these filters right now. Ask us about upcoming litters.</p><div>${waBtn("Hi! I'm looking for a puppy that's not listed. Can you help?", "Ask on WhatsApp")}</div></div>
  </div>
</div>
<p class="muted" style="margin-top:2rem">Looking for puppies that already went home? <a class="link" href="/puppies/previous/">See previous puppies</a>.</p>
</div></section>${ctaBand()}`
    });
  };
  const previousPage = () => layout({
    path: "/puppies/previous/",
    title: "Previous Puppies",
    description: "Puppies who have already found their forever families.",
    body: `${pageHero("Previous puppies", "Puppies who have already found their families.", [{ href: "/puppies/", label: "Puppies" }, { label: "Previous" }])}
<section><div class="wrap">${previous.length ? `<div class="grid">${previous.map(pupCard).join("")}</div>` : `<p class="muted">No previous puppies listed yet.</p>`}</div></section>
${ctaBand("Want a puppy like these?", "Tell us what you're looking for and we'll match you with an upcoming litter.")}`
  });
  const puppyPage = (p) => {
    const b = getBreed(p.breed) || { name: "", slug: p.breed, art: {} };
    const imgs = (p.images || []).filter(Boolean);
    const slots = imgs.length ? imgs : [null];
    const bg = esc(b.art?.bg || "#F4ECF3");
    const slide = (src, i) => `<div class="slide" data-slide="${i}"${i ? " hidden" : ""}>${src ? `<img src="${esc(src)}" alt="${esc(`${p.name}, photo ${i + 1}`)}"${i ? ' loading="lazy"' : ""}>` : breedArt(p.breed, { alt: `${b.name} puppy`, eager: true })}</div>`;
    const thumb = (src, i) => `<button type="button" style="background:${bg};position:relative" aria-pressed="${i === 0}" aria-label="Show photo ${i + 1}" data-thumb="${i}">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : breedArt(p.breed)}</button>`;
    const similar = puppies2.filter((x) => x.slug !== p.slug && x.status === "available").sort((x) => x.breed === p.breed ? -1 : 1).slice(0, 4);
    const ctas = p.status !== "sold" ? `<div class="detail-ctas">${waBtn(`Hi! I'm interested in ${p.name} (${b.name}, ${p.sex}). Is ${pronoun(p)} still available?`, `Ask about ${p.name} on WhatsApp`)}${waBtn(`Hi! I'd like to book a video call to see ${p.name} (${b.name}).`, "Book a video call", "btn btn-ghost")}</div>` : `<div class="detail-ctas">${waBtn(`Hi! I loved ${p.name} (${b.name}). Do you have a similar puppy coming up?`, "Ask about a similar puppy")}</div>`;
    const row = (k, v) => v ? `<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>` : "";
    return layout({
      path: `/puppies/${p.slug}/`,
      title: `${p.name} \u2013 ${b.name} ${p.sex} Puppy`,
      description: `${p.name} is a ${p.age || ""} ${p.color || ""} ${b.name} ${String(p.sex || "").toLowerCase()} puppy. ${p.about || ""}`.replace(/\s+/g, " "),
      waMessage: `Hi! I'm interested in ${p.name} (${b.name}, ${p.sex}). Is ${pronoun(p)} still available?`,
      jsonLd: [{
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${p.name} \u2013 ${b.name} puppy`,
        description: p.about,
        brand: site2.name,
        ...imgs[0] ? { image: imgs[0].startsWith("http") ? imgs[0] : baseUrl + imgs[0] } : {},
        offers: { "@type": "Offer", price: Number(p.price) || 0, priceCurrency: site2.currency, availability: p.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut" }
      }],
      body: `<div class="wrap" style="padding-block:1.2rem 0"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/puppies/">Available puppies</a> / <span>${esc(p.name)}</span></nav></div>
<section style="padding-top:1rem"><div class="wrap detail">
  <div data-gallery>
    <div class="gallery-main" style="background:${bg}">${slots.map(slide).join("")}</div>
    ${slots.length > 1 ? `<div class="thumbs">${slots.slice(0, 8).map(thumb).join("")}</div>` : ""}
  </div>
  <div>
    <a class="eyebrow" href="/breeds/${esc(b.slug)}/" style="text-decoration:none">${esc(b.name)}</a>
    <h1 style="margin-top:.4rem">${esc(p.name)}</h1>
    <div class="big-price">${p.status === "sold" ? "Found a home" : price(p.price)}</div>
    ${p.status === "reserved" ? `<p class="note">${esc(p.name)} is reserved. Message us to join the waitlist or see a similar puppy.</p>` : ""}
    <table class="specs"><tbody>
      ${row("Breed", b.name)}${row("Sex", p.sex)}${row("Age", p.age)}${row("Color", p.color)}${row("Adult size", p.adultWeight)}${row("Vaccinations", p.vaccinations)}
      <tr><th scope="row">Microchip</th><td>${p.microchip ? "Yes" : "No"}</td></tr>
    </tbody></table>
    ${ctas}
    <div class="prose" style="margin-top:1.6rem"><h3>About ${esc(p.name)}</h3>${paragraphs(p.about)}
    <p class="muted">Comes home with vet records, a microchip, our one-year <a href="/how-it-works/health-guarantee/">health guarantee</a> and a starter kit.</p></div>
  </div>
</div></section>
${similar.length ? `<section class="band"><div class="wrap"><div class="sec-head"><h2>You might also like</h2></div><div class="grid">${similar.map(pupCard).join("")}</div></div></section>` : ""}`
    });
  };
  const breedsPage = () => layout({
    path: "/breeds/",
    title: "Breeds",
    description: `Toy and small breeds we raise: ${breeds2.map((b) => b.name).join(", ")}.`,
    body: `${pageHero("Our breeds", "Toy and small breeds chosen for temperament, health and how well they fit modern homes.", [{ label: "Breeds" }])}
<section><div class="wrap"><div class="breeds">${breeds2.map((b) => breedCard(b, { blurb: true, count: puppies2.filter((p) => p.breed === b.slug && p.status === "available").length })).join("")}</div></div></section>
${ctaBand("Not sure which breed?", "Tell us about your home and we'll suggest the best match.")}`
  });
  const breedPage = (b) => {
    const list = puppies2.filter((p) => p.breed === b.slug && p.status !== "sold");
    return layout({
      path: `/breeds/${b.slug}/`,
      title: `${b.name} Puppies for Sale`,
      description: `${b.blurb} See available ${b.name} puppies, vet-checked with a one-year health guarantee.`,
      waMessage: `Hi! I'm interested in a ${b.name} puppy.`,
      body: `${pageHero(`${b.name} puppies`, `${b.blurb || ""}${b.weight ? ` Adult weight ${b.weight}.` : ""}`, [{ href: "/breeds/", label: "Breeds" }, { label: b.name }])}
<section><div class="wrap two">
  <div class="art-frame" style="background:${esc(b.art?.bg || "#F4ECF3")};max-width:380px">${breedArt(b.slug, { alt: `${b.name} puppy`, eager: true })}</div>
  <div class="prose"><h2>About the ${esc(b.name)}</h2>${paragraphs(b.description)}
  <ul>${b.weight ? `<li><strong>Adult weight:</strong> ${esc(b.weight)}</li>` : ""}${b.lifespan ? `<li><strong>Lifespan:</strong> ${esc(b.lifespan)}</li>` : ""}${b.grooming ? `<li><strong>Grooming:</strong> ${esc(b.grooming)}</li>` : ""}${b.goodFor?.length ? `<li><strong>Good for:</strong> ${esc(b.goodFor.join(", "))}</li>` : ""}</ul>
  ${waBtn(`Hi! I'm interested in a ${b.name} puppy.`, `Ask about ${b.name}s`)}</div>
</div></section>
<section class="band"><div class="wrap"><div class="sec-head"><h2>Available ${esc(b.name)} puppies</h2></div>
${list.length ? `<div class="grid">${list.map(pupCard).join("")}</div>` : `<p class="muted">No ${esc(b.name)} puppies available right now. Message us to join the waitlist for the next litter.</p>`}
</div></section>${ctaBand()}`
    });
  };
  const processTabs = (active) => `<nav class="tabs" aria-label="How it works sections">${processPages2.map((p) => `<a href="/how-it-works/${esc(p.slug)}/"${p.slug === active ? ' aria-current="page"' : ""}>${esc(p.title)}</a>`).join("")}</nav>`;
  const howPage = () => layout({
    path: "/how-it-works/",
    title: "How It Works",
    description: "How to reserve, pay for and receive your puppy: delivery, health guarantee, financing and special orders.",
    body: `${pageHero("How it works", "Everything you need to know about reserving, paying for and receiving your puppy.", [{ label: "How it works" }])}
<section><div class="wrap">${processTabs()}
<div style="margin-bottom:2.5rem">${steps()}</div>
<div class="cards3">${processPages2.map((p) => `<a href="/how-it-works/${esc(p.slug)}/" class="card" style="text-decoration:none"><h3>${esc(p.title)}</h3><p class="muted">${esc(p.summary)}</p><span class="link">Read more \u2192</span></a>`).join("")}</div>
</div></section>${ctaBand()}`
  });
  const processPage = (p) => layout({
    path: `/how-it-works/${p.slug}/`,
    title: p.title,
    description: p.summary,
    body: `${pageHero(p.title, p.summary, [{ href: "/how-it-works/", label: "How it works" }, { label: p.title }])}
<section><div class="wrap">${processTabs(p.slug)}<div class="prose">${fixLinks(p.body)}</div></div></section>${ctaBand()}`
  });
  const aboutPage = () => layout({
    path: "/about/",
    title: "About Us",
    description: `Meet the family behind ${site2.name}: our story, our team and our promise.`,
    body: `${pageHero(`About ${site2.name}`, "A small, family-run breeding program focused on healthy, well-socialized toy breeds.", [{ label: "About" }])}
<section><div class="wrap two">
  <div class="prose"><h2>Our story</h2>${paragraphs(site2.aboutStory)}
  <h2>Our promise</h2><ul><li>Honest descriptions and real videos of every puppy</li><li>Written contract and health guarantee</li><li>Support for the life of your dog</li></ul></div>
  <div class="art-frame" style="background:${esc(bgOf("maltese"))}">${breedArt("maltese", { alt: "Maltese puppy" })}</div>
</div></section>
<section class="band" id="team"><div class="wrap"><div class="sec-head"><h2>Meet the team</h2></div>
<div class="cards3">${TEAM.map((t) => `<div class="card"><h3>${esc(t.name)}</h3><p class="muted">${esc(t.role)}</p><p>${esc(t.text)}</p></div>`).join("")}</div></div></section>
<section id="locations"><div class="wrap"><div class="sec-head"><h2>Where to find us</h2></div><div class="cards3">
<div class="card"><h3>Main kennel</h3><p class="muted">Visits by appointment only. Message us on WhatsApp to book.</p></div>
<div class="card"><h3>Opening hours</h3>${hoursGrid()}</div>
<div class="card"><h3>Licensed breeder</h3><p class="muted">Registered business. License number available on request.</p></div>
</div></div></section>${ctaBand()}`
  });
  const reviewsPage = () => layout({
    path: "/reviews/",
    title: "Reviews",
    description: "What families say about their puppies and our service.",
    body: `${pageHero("What our families say", "Messages from families who brought a puppy home.", [{ label: "Reviews" }])}
<section><div class="wrap"><div style="margin-bottom:2rem">${trust()}</div><div class="reviews">${reviews2.map(reviewCard).join("")}</div></div></section>${ctaBand()}`
  });
  const faqPage = () => layout({
    path: "/faq/",
    title: "FAQ",
    description: "Answers to common questions about reserving, paying for, delivering and caring for your puppy.",
    jsonLd: [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs2.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }],
    body: `${pageHero("Frequently asked questions", "Answers to the questions we hear most often.", [{ label: "FAQ" }])}
<section><div class="wrap" style="max-width:860px">${faqList(faqs2)}</div></section>
${ctaBand("Still have a question?", "Message us on WhatsApp. We usually reply within minutes.")}`
  });
  const safePage = () => layout({
    path: "/buy-safely/",
    title: "Buy Safely",
    description: "How to make sure you're talking to us and not a scammer using our name.",
    body: `${pageHero("Buy safely", "How to make sure you're talking to us and not a scammer using our name.", [{ label: "Buy safely" }])}
<section><div class="wrap">
<div class="steps">
<div><h3>Check the number</h3><p>We only message from ${esc(site2.whatsappDisplay)}, the number shown on this website.</p></div>
<div><h3>Ask for video</h3><p>We'll always show your puppy on a live video call.</p></div>
<div><h3>Pay the business</h3><p>Payments go only to our registered business account.</p></div>
<div><h3>Get it in writing</h3><p>You receive a contract and receipt for every payment.</p></div></div>
<div class="note" style="margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;justify-content:space-between"><span>Contacted by someone claiming to be us? Check with our official number first.</span>${waBtn("Hi! Someone contacted me claiming to be you. Can you confirm?", "Verify on WhatsApp")}</div>
<p style="margin-top:2rem">Read the full guide: <a class="link" href="/blog/how-to-spot-a-puppy-scam/">How to spot a puppy scam</a>.</p>
</div></section>`
  });
  const contactPage = () => layout({
    path: "/contact/",
    title: "Contact",
    description: "Contact us on WhatsApp, by email or with our contact form.",
    body: `${pageHero("Get in touch", "WhatsApp is the fastest way to reach us. We usually reply within minutes during business hours.", [{ label: "Contact" }])}
<section><div class="wrap two">
  <div style="display:grid;gap:1.2rem">
    <div class="card"><h3>WhatsApp</h3><p style="font-weight:800">${esc(site2.whatsappDisplay)}</p><div>${waBtn("Hi! I have a question about your puppies.", "Start a chat")}</div></div>
    <div class="card"><h3>Email</h3><p><a class="link" href="mailto:${esc(site2.email)}">${esc(site2.email)}</a></p></div>
    <div class="card"><h3>Hours</h3>${hoursGrid()}</div>
  </div>
  <form class="card" id="contact-form" action="/api/contact" method="post">
    <h3>Send a message</h3>
    <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" required maxlength="100" placeholder="Your name"></div>
    <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required maxlength="200" placeholder="you@example.com"></div>
    <div class="field"><label for="c-phone">Phone / WhatsApp</label><input id="c-phone" name="phone" maxlength="40" placeholder="+1 \u2026"></div>
    <div class="field"><label for="c-breed">Interested in</label><select id="c-breed" name="interest"><option>Any breed</option>${breeds2.map((b) => `<option>${esc(b.name)}</option>`).join("")}</select></div>
    <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="4" required maxlength="3000" placeholder="Tell us what you're looking for"></textarea></div>
    <input type="text" name="company" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true">
    <button class="btn btn-primary" type="submit" style="justify-self:start">Send message</button>
    <p class="form-ok" aria-live="polite" data-status></p>
  </form>
</div></section>`
  });
  const blogPage = () => layout({
    path: "/blog/",
    title: "Blog",
    description: "Practical advice on choosing, raising and caring for small-breed puppies.",
    body: `${pageHero("Puppy guides & news", "Practical advice on choosing, raising and caring for small-breed puppies.", [{ label: "Blog" }])}
<section><div class="wrap">${sortedPosts.length ? `<div class="posts">${sortedPosts.map(postCard).join("")}</div>` : `<p class="muted">No posts yet.</p>`}</div></section>`
  });
  const postPage = (p) => {
    const more = sortedPosts.filter((x) => x.slug !== p.slug).slice(0, 2);
    return layout({
      path: `/blog/${p.slug}/`,
      title: p.title,
      description: p.excerpt,
      ogType: "article",
      jsonLd: [{ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.excerpt, datePublished: p.date, author: { "@type": "Organization", name: site2.name }, publisher: { "@type": "Organization", name: site2.name } }],
      body: `<section><div class="wrap"><article class="article">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog/">Blog</a></nav>
<div class="meta">${fmtDate(p.date)}${p.readTime ? ` \xB7 ${esc(p.readTime)} read` : ""}</div>
<h1 style="margin-top:.4rem">${esc(p.title)}</h1>
<div class="article-cover" style="background:${esc(bgOf(p.breed))}">${p.cover ? `<img src="${esc(p.cover)}" alt="">` : breedArt(p.breed, { eager: true })}</div>
<div class="prose">${fixLinks(p.body)}</div>
<div class="note ask-box"><span>Have a question about this?</span>${waBtn(`Hi! I just read "${p.title}" and have a question.`, "Ask on WhatsApp")}</div>
</article></div></section>
${more.length ? `<section class="band"><div class="wrap"><div class="sec-head"><h2>Keep reading</h2></div><div class="posts">${more.map(postCard).join("")}</div></div></section>` : ""}`
    });
  };
  const legalPage = (p) => layout({
    path: `/legal/${p.slug}/`,
    title: p.title,
    description: `${p.title} for ${site2.name}.`,
    body: `${pageHero(p.title, "", [{ label: p.title }])}<section><div class="wrap"><div class="prose">${p.body}</div></div></section>`
  });
  const notFound = () => layout({
    path: "/404/",
    title: "Page not found",
    noindex: true,
    body: `${pageHero("Page not found", "The page you're looking for doesn't exist or has moved.", [{ label: "Not found" }])}
<section><div class="wrap" style="display:flex;gap:.6rem;flex-wrap:wrap"><a class="btn btn-primary" href="/">Back to home</a><a class="btn btn-ghost" href="/puppies/">See puppies</a></div></section>`
  });
  function allPaths() {
    return [
      "/",
      "/puppies/",
      "/puppies/previous/",
      "/breeds/",
      "/how-it-works/",
      "/about/",
      "/reviews/",
      "/faq/",
      "/buy-safely/",
      "/contact/",
      "/blog/",
      ...puppies2.map((p) => `/puppies/${p.slug}/`),
      ...breeds2.map((b) => `/breeds/${b.slug}/`),
      ...processPages2.map((p) => `/how-it-works/${p.slug}/`),
      ...posts2.map((p) => `/blog/${p.slug}/`),
      ...legalPages2.map((p) => `/legal/${p.slug}/`)
    ];
  }
  function render(path) {
    const html2 = (body, status = 200) => ({ status, body, type: "text/html; charset=utf-8" });
    if (path === "/sitemap.xml") {
      return { status: 200, type: "application/xml", body: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths().map((p) => `  <url><loc>${esc(baseUrl + p)}</loc></url>`).join("\n")}
</urlset>
` };
    }
    if (path === "/robots.txt") {
      return { status: 200, type: "text/plain", body: `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
` };
    }
    const fixed = { "/": home, "/puppies/": puppiesPage, "/puppies/previous/": previousPage, "/breeds/": breedsPage, "/how-it-works/": howPage, "/about/": aboutPage, "/reviews/": reviewsPage, "/faq/": faqPage, "/buy-safely/": safePage, "/contact/": contactPage, "/blog/": blogPage };
    if (fixed[path]) return html2(fixed[path]());
    const m = path.match(/^\/(puppies|breeds|how-it-works|blog|legal)\/([^/]+)\/$/);
    if (m) {
      const slug = decodeURIComponent(m[2]);
      const find = { puppies: [puppies2, puppyPage], breeds: [breeds2, breedPage], "how-it-works": [processPages2, processPage], blog: [posts2, postPage], legal: [legalPages2, legalPage] }[m[1]];
      const item = find[0].find((x) => x.slug === slug);
      if (item) return html2(find[1](item));
    }
    return html2(notFound(), 404);
  }
  return { render };
}

// petite-paws-cf/worker/schemas.js
var SORT = { name: "sort", label: "Display order", type: "number", help: "Lower numbers show first." };
var collections = {
  puppies: {
    label: "Puppies",
    singular: "puppy",
    titleField: "name",
    slugFrom: "name",
    publicPath: (s) => `/puppies/${s}/`,
    columns: [
      ["Breed", (x, ctx) => ctx.breedName(x.breed)],
      ["Price", (x, ctx) => ctx.price(x.price)],
      ["Status", (x) => x.status]
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "URL name", type: "slug", help: "Used in the web address, e.g. /puppies/bella/. Leave empty to create it from the name." },
      { name: "breed", label: "Breed", type: "select", options: "breeds", required: true },
      { name: "sex", label: "Sex", type: "select", options: ["Female", "Male"], required: true },
      { name: "status", label: "Status", type: "select", options: [["available", "Available"], ["reserved", "Reserved"], ["sold", "Sold (moves to Previous Puppies)"]], required: true },
      { name: "price", label: "Price", type: "number", required: true },
      { name: "age", label: "Age", type: "text", placeholder: "12 weeks" },
      { name: "color", label: "Color", type: "text", placeholder: "Orange Sable" },
      { name: "adultWeight", label: "Adult size", type: "text", placeholder: "Est. 4 lb" },
      { name: "vaccinations", label: "Vaccinations", type: "text", placeholder: "Up to date (5-in-1)" },
      { name: "microchip", label: "Microchipped", type: "checkbox" },
      { name: "featured", label: "Featured (shown first on the home page)", type: "checkbox" },
      { name: "images", label: "Photos", type: "images", help: "The first photo is the main one. Without photos, the breed photo is shown." },
      { name: "about", label: "About this puppy", type: "textarea", rows: 5 },
      SORT
    ]
  },
  breeds: {
    label: "Breeds",
    singular: "breed",
    titleField: "name",
    slugFrom: "name",
    publicPath: (s) => `/breeds/${s}/`,
    columns: [["Weight", (x) => x.weight]],
    fields: [
      { name: "name", label: "Breed name", type: "text", required: true },
      { name: "slug", label: "URL name", type: "slug", help: "Used in the web address and to link puppies to this breed. Changing it unlinks existing puppies." },
      { name: "blurb", label: "Short description", type: "text", help: "One line shown on breed cards." },
      { name: "description", label: "Full description", type: "textarea", rows: 5 },
      { name: "weight", label: "Adult weight", type: "text", placeholder: "3\u20137 lb" },
      { name: "lifespan", label: "Lifespan", type: "text", placeholder: "12\u201316 years" },
      { name: "grooming", label: "Grooming", type: "text" },
      { name: "goodFor", label: "Good for", type: "list", help: "Separate with commas, e.g. Apartments, Families" },
      { name: "image", label: "Breed photo", type: "image", help: "Shown on breed cards, and on any puppy or blog post of this breed that has no photo of its own." },
      { name: "art.type", label: "Drawing style (only used if the breed has no photo)", type: "select", options: [["fluffy", "Fluffy"], ["floppy", "Floppy ears"], ["pointy", "Pointy ears"], ["bat", "Bat ears"]] },
      { name: "art.fur", label: "Drawing fur color", type: "color" },
      { name: "art.ear", label: "Drawing ear color", type: "color" },
      { name: "art.bg", label: "Card background color", type: "color" },
      SORT
    ]
  },
  posts: {
    label: "Blog posts",
    singular: "blog post",
    titleField: "title",
    slugFrom: "title",
    publicPath: (s) => `/blog/${s}/`,
    columns: [["Date", (x) => x.date]],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL name", type: "slug" },
      { name: "date", label: "Publish date", type: "date", required: true },
      { name: "readTime", label: "Read time", type: "text", placeholder: "5 min" },
      { name: "excerpt", label: "Summary", type: "textarea", rows: 2, help: "Shown on the blog list and in Google results." },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "breed", label: "Breed photo to use if there is no cover image", type: "select", options: "breeds" },
      { name: "body", label: "Article", type: "html", rows: 18 }
    ]
  },
  reviews: {
    label: "Reviews",
    singular: "review",
    titleField: "name",
    slugFrom: "random",
    columns: [["Rating", (x) => "\u2605".repeat(Number(x.rating) || 5)], ["Text", (x) => String(x.text || "").slice(0, 70) + "\u2026"]],
    fields: [
      { name: "name", label: "Customer name", type: "text", required: true },
      { name: "puppy", label: "Label", type: "text", placeholder: "Pomeranian family" },
      { name: "rating", label: "Stars (1\u20135)", type: "number", min: 1, max: 5, default: 5 },
      { name: "text", label: "Review", type: "textarea", rows: 4, required: true },
      SORT
    ]
  },
  faqs: {
    label: "FAQs",
    singular: "question",
    titleField: "q",
    slugFrom: "random",
    columns: [],
    fields: [
      { name: "q", label: "Question", type: "text", required: true },
      { name: "a", label: "Answer", type: "textarea", rows: 4, required: true },
      SORT
    ]
  },
  process: {
    label: "How it works pages",
    singular: "page",
    titleField: "title",
    slugFrom: "title",
    publicPath: (s) => `/how-it-works/${s}/`,
    columns: [["Summary", (x) => x.summary]],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL name", type: "slug" },
      { name: "summary", label: "Summary", type: "text" },
      { name: "body", label: "Page content", type: "html", rows: 16 },
      SORT
    ]
  },
  legal: {
    label: "Legal pages",
    singular: "page",
    titleField: "title",
    slugFrom: "title",
    publicPath: (s) => `/legal/${s}/`,
    columns: [],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL name", type: "slug" },
      { name: "body", label: "Page content", type: "html", rows: 16 },
      SORT
    ]
  }
};
var settingsFields = [
  { section: "Business" },
  { name: "name", label: "Business name", type: "text", required: true },
  { name: "tagline", label: "Tagline (under the logo)", type: "text" },
  { name: "description", label: "Site description (for Google)", type: "textarea", rows: 2 },
  { name: "url", label: "Website address", type: "text", placeholder: "https://www.yourdomain.com", help: "Used for the sitemap and Google. Leave as example.com to use the current address." },
  { name: "foundedYear", label: "Year founded", type: "number" },
  { section: "WhatsApp & contact" },
  { name: "whatsappNumber", label: "WhatsApp number (digits only, with country code)", type: "text", required: true, placeholder: "919876543210", help: "No +, spaces or dashes. This is the number the WhatsApp buttons open." },
  { name: "whatsappDisplay", label: "WhatsApp number as shown on the site", type: "text", placeholder: "+91 98765 43210" },
  { name: "whatsappDefaultMessage", label: "Default WhatsApp message", type: "text" },
  { name: "phoneDisplay", label: "Phone", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "hours", label: "Opening hours", type: "pairs", keys: ["days", "time"], help: "One per line: Days | Time, e.g. Mon \u2013 Fri | 9:30 AM \u2013 8:00 PM" },
  { section: "Home page" },
  { name: "heroEyebrow", label: "Small heading above the title", type: "text" },
  { name: "heroTitle", label: "Main title", type: "text" },
  { name: "heroText", label: "Intro text", type: "textarea", rows: 3 },
  { name: "heroImage", label: "Hero photo (optional)", type: "image" },
  { name: "stats", label: "Trust numbers", type: "pairs", keys: ["value", "label"], help: "One per line: Value | Label, e.g. 4.9\u2605 | from 180+ reviews" },
  { section: "About page" },
  { name: "aboutStory", label: "Our story", type: "textarea", rows: 6, help: "Leave a blank line between paragraphs." },
  { section: "Prices" },
  { name: "currency", label: "Currency code", type: "text", placeholder: "USD, INR, CAD, GBP\u2026" },
  { name: "locale", label: "Number format", type: "text", placeholder: "en-US, en-IN\u2026" },
  { section: "Social links" },
  { name: "social.instagram", label: "Instagram URL", type: "text" },
  { name: "social.facebook", label: "Facebook URL", type: "text" },
  { name: "social.youtube", label: "YouTube URL", type: "text" }
];
function getPath(obj, path) {
  return path.split(".").reduce((o, k) => o == null ? void 0 : o[k], obj);
}
function setPath(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  keys.slice(0, -1).forEach((k) => {
    if (typeof o[k] !== "object" || o[k] === null) o[k] = {};
    o = o[k];
  });
  o[keys[keys.length - 1]] = value;
}
var slugify = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
function parseForm(fields, form, base = {}) {
  const data = structuredClone(base);
  const errors = [];
  for (const f of fields) {
    if (!f.name) continue;
    const raw = form.get(f.name);
    let v;
    switch (f.type) {
      case "checkbox":
        v = raw === "on";
        break;
      case "number": {
        const s = String(raw ?? "").trim();
        v = s === "" ? f.default ?? 0 : Number(s);
        if (Number.isNaN(v)) {
          errors.push(`${f.label} must be a number.`);
          v = 0;
        }
        if (f.min !== void 0 && v < f.min) v = f.min;
        if (f.max !== void 0 && v > f.max) v = f.max;
        break;
      }
      case "images":
        v = String(raw || "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
        break;
      case "list":
        v = String(raw || "").split(",").map((x) => x.trim()).filter(Boolean);
        break;
      case "pairs":
        v = String(raw || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
          const [a, ...rest] = l.split("|");
          return { [f.keys[0]]: a.trim(), [f.keys[1]]: rest.join("|").trim() };
        });
        break;
      default:
        v = String(raw ?? "").trim();
    }
    if (f.required && (v === "" || Array.isArray(v) && !v.length)) errors.push(`${f.label} is required.`);
    setPath(data, f.name, v);
  }
  return { data, errors };
}

// petite-paws-cf/worker/auth.js
var COOKIE = "pp_admin";
var SESSION_DAYS = 7;
var enc = new TextEncoder();
var b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function hmac(secret, message) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}
async function sha256(s) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s)));
}
async function safeEqual(a, b) {
  const [x, y] = await Promise.all([sha256(String(a)), sha256(String(b))]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
var secretOf = (env) => env.SESSION_SECRET || `pp-session::${env.ADMIN_PASSWORD}`;
var isConfigured = (env) => Boolean(env.ADMIN_PASSWORD);
async function checkCredentials(env, username, password) {
  if (!isConfigured(env)) return false;
  const userOk = await safeEqual(username || "", env.ADMIN_USERNAME || "admin");
  const passOk = await safeEqual(password || "", env.ADMIN_PASSWORD);
  return userOk && passOk;
}
async function createSessionCookie(env, url) {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const value = `${exp}.${await hmac(secretOf(env), String(exp))}`;
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}
function clearSessionCookie(url) {
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}
async function isLoggedIn(request, env) {
  if (!isConfigured(env)) return false;
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;
  const [exp, sig] = match[1].split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(secretOf(env), exp));
}
var failures = /* @__PURE__ */ new Map();
function tooManyAttempts(ip) {
  const f = failures.get(ip);
  if (!f) return false;
  if (Date.now() - f.first > 15 * 6e4) {
    failures.delete(ip);
    return false;
  }
  return f.count >= 10;
}
function recordFailure(ip) {
  const f = failures.get(ip);
  if (!f || Date.now() - f.first > 15 * 6e4) failures.set(ip, { first: Date.now(), count: 1 });
  else f.count++;
}
function clearFailures(ip) {
  failures.delete(ip);
}

// petite-paws-cf/worker/admin.js
var html = (body, status = 200, headers = {}) => new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", ...headers } });
var redirect = (to, headers = {}) => new Response(null, { status: 303, headers: { Location: to, "Cache-Control": "no-store", ...headers } });
var json2 = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
function page({ title, body, active = "", unread = 0, flash = "", error = "" }) {
  const nav = [
    ["/admin", "Dashboard", "dashboard"],
    ...Object.entries(collections).map(([k, c]) => [`/admin/c/${k}`, c.label, k]),
    ["/admin/messages", `Messages${unread ? ` <span class="pill">${unread}</span>` : ""}`, "messages"],
    ["/admin/settings", "Site settings", "settings"]
  ];
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)} \xB7 Admin</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/admin-assets/admin.css">
</head><body>
<div class="shell">
  <aside class="side">
    <a class="brand" href="/admin">Admin panel</a>
    <nav>${nav.map(([href, label, key]) => `<a href="${href}"${key === active ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    <div class="side-foot">
      <a href="/" target="_blank" rel="noopener">View website \u2197</a>
      <form method="post" action="/admin/logout"><button type="submit" class="linklike">Log out</button></form>
    </div>
  </aside>
  <main class="main">
    ${flash ? `<div class="flash ok" role="status">${esc(flash)}</div>` : ""}
    ${error ? `<div class="flash err" role="alert">${error}</div>` : ""}
    ${body}
  </main>
</div>
<script src="/admin-assets/admin.js" defer></script>
</body></html>`;
}
function loginPage({ error = "", configured = true, next = "/admin" } = {}) {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Admin login</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/admin-assets/admin.css">
</head><body class="login-body">
<form class="login card" method="post" action="/admin/login">
  <h1>Admin login</h1>
  ${!configured ? `<div class="flash err">The admin password isn't set yet. Run <code>npx wrangler secret put ADMIN_PASSWORD</code>, or add <b>ADMIN_PASSWORD</b> as a secret in the Cloudflare dashboard (Worker \u2192 Settings \u2192 Variables and Secrets), then reload this page.</div>` : ""}
  ${error ? `<div class="flash err" role="alert">${esc(error)}</div>` : ""}
  <input type="hidden" name="next" value="${esc(next)}">
  <label for="u">Username</label><input id="u" name="username" autocomplete="username" required value="admin">
  <label for="p">Password</label><input id="p" name="password" type="password" autocomplete="current-password" required autofocus>
  <button class="btn primary" type="submit"${configured ? "" : " disabled"}>Log in</button>
  <a class="muted small" href="/">\u2190 Back to website</a>
</form>
</body></html>`;
}
function fieldHtml(f, item, ctx) {
  if (f.section) return `<h2 class="section">${esc(f.section)}</h2>`;
  const id = `f-${f.name.replace(/\./g, "-")}`;
  let v = getPath(item, f.name);
  if (v === void 0) v = f.default ?? "";
  const req = f.required ? " required" : "";
  const help = f.help ? `<small class="help">${esc(f.help)}</small>` : "";
  const label = `<label for="${id}">${esc(f.label)}${f.required ? ' <span class="req">*</span>' : ""}</label>`;
  let input;
  switch (f.type) {
    case "textarea":
      input = `<textarea id="${id}" name="${f.name}" rows="${f.rows || 4}"${req}>${esc(v)}</textarea>`;
      break;
    case "html":
      input = `<textarea id="${id}" name="${f.name}" rows="${f.rows || 12}" class="code"${req}>${esc(v)}</textarea>
<small class="help">HTML is allowed: &lt;h2&gt;Heading&lt;/h2&gt;, &lt;p&gt;Paragraph&lt;/p&gt;, &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;, &lt;strong&gt;bold&lt;/strong&gt;, &lt;a href="/contact/"&gt;link&lt;/a&gt;</small>
<button type="button" class="btn small" data-preview="${id}">Preview</button><div class="preview prose" data-preview-for="${id}" hidden></div>`;
      break;
    case "number":
      input = `<input id="${id}" name="${f.name}" type="number" step="any" value="${esc(v)}"${f.min !== void 0 ? ` min="${f.min}"` : ""}${f.max !== void 0 ? ` max="${f.max}"` : ""}${req}>`;
      break;
    case "date":
      input = `<input id="${id}" name="${f.name}" type="date" value="${esc(v)}"${req}>`;
      break;
    case "color":
      input = `<input id="${id}" name="${f.name}" type="color" value="${esc(v || "#eeeeee")}">`;
      break;
    case "checkbox":
      return `<div class="field check"><input id="${id}" name="${f.name}" type="checkbox"${v ? " checked" : ""}><label for="${id}">${esc(f.label)}</label>${help}</div>`;
    case "select": {
      const opts = f.options === "breeds" ? ctx.breeds.map((b) => [b.slug, b.name]) : f.options.map((o) => Array.isArray(o) ? o : [o, o]);
      input = `<select id="${id}" name="${f.name}"${req}>${f.required ? "" : '<option value="">\u2014</option>'}${opts.map(([val, lab]) => `<option value="${esc(val)}"${String(v) === String(val) ? " selected" : ""}>${esc(lab)}</option>`).join("")}</select>`;
      break;
    }
    case "slug":
      input = `<input id="${id}" name="slug" value="${esc(v)}" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="created automatically">`;
      break;
    case "list":
      input = `<input id="${id}" name="${f.name}" value="${esc((v || []).join(", "))}">`;
      break;
    case "pairs":
      input = `<textarea id="${id}" name="${f.name}" rows="${Math.max(3, (v || []).length + 1)}">${esc((v || []).map((p) => `${p[f.keys[0]] ?? ""} | ${p[f.keys[1]] ?? ""}`).join("\n"))}</textarea>`;
      break;
    case "image":
      input = `<div class="media" data-media="single">
  <input id="${id}" name="${f.name}" value="${esc(v)}" placeholder="/media/\u2026 or https://\u2026">
  <label class="btn small upload">Upload photo<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden></label>
  <div class="thumbs" data-thumbs></div>
</div>`;
      break;
    case "images":
      input = `<div class="media" data-media="multi">
  <textarea id="${id}" name="${f.name}" rows="3" placeholder="One image address per line">${esc((v || []).join("\n"))}</textarea>
  <label class="btn small upload">Upload photos<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple hidden></label>
  <div class="thumbs" data-thumbs></div>
</div>`;
      break;
    default:
      input = `<input id="${id}" name="${f.name}" value="${esc(v)}"${f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : ""}${req}>`;
  }
  return `<div class="field">${label}${input}${f.type === "html" ? "" : help}</div>`;
}
async function handleAdmin(request, env, url) {
  const path = url.pathname.replace(/\/+$/, "") || "/admin";
  const method = request.method;
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  if (method === "POST") {
    const origin = request.headers.get("Origin");
    if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403 });
  }
  if (path === "/admin/login") {
    const next = url.searchParams.get("next") || "/admin";
    if (method === "GET") {
      if (await isLoggedIn(request, env)) return redirect("/admin");
      return html(loginPage({ configured: isConfigured(env), next }));
    }
    if (method === "POST") {
      const form = await request.formData();
      const nextUrl = String(form.get("next") || "/admin");
      const safeNext = nextUrl.startsWith("/admin") ? nextUrl : "/admin";
      if (tooManyAttempts(ip)) return html(loginPage({ error: "Too many failed attempts. Try again in 15 minutes.", next: safeNext }), 429);
      if (await checkCredentials(env, form.get("username"), form.get("password"))) {
        clearFailures(ip);
        return redirect(safeNext, { "Set-Cookie": await createSessionCookie(env, url) });
      }
      recordFailure(ip);
      await new Promise((r) => setTimeout(r, 600));
      return html(loginPage({ error: "Wrong username or password.", configured: isConfigured(env), next: safeNext }), 401);
    }
  }
  if (path === "/admin/logout" && method === "POST") return redirect("/admin/login", { "Set-Cookie": clearSessionCookie(url) });
  if (!await isLoggedIn(request, env)) {
    if (path === "/admin/upload") return json2({ error: "Your session has expired. Log in again." }, 401);
    return redirect(`/admin/login?next=${encodeURIComponent(url.pathname)}`);
  }
  try {
    await ensureDb(env);
  } catch (e) {
    return html(page({ title: "Setup needed", body: `<h1>Setup needed</h1><p>${esc(e.message)}</p>` }), 500);
  }
  const unread = await countUnread(env);
  const flash = url.searchParams.get("saved") ? "Saved. The website is updated." : url.searchParams.get("deleted") ? "Deleted." : "";
  if (path === "/admin/upload" && method === "POST") return handleUpload(request, env);
  if (path === "/admin") {
    const counts = {};
    for (const k of Object.keys(collections)) counts[k] = (await listItems(env, k)).length;
    const puppies2 = await listItems(env, "puppies");
    const avail = puppies2.filter((p) => p.status === "available").length;
    const reserved = puppies2.filter((p) => p.status === "reserved").length;
    const r2 = env.IMAGES ? "" : `<div class="flash err">Photo uploads are off: the R2 bucket isn't connected. See the README (step 3) to turn them on. You can still paste image links.</div>`;
    return html(page({
      title: "Dashboard",
      active: "dashboard",
      unread,
      flash,
      body: `<div class="head"><h1>Dashboard</h1><a class="btn primary" href="/admin/c/puppies/new">+ Add a puppy</a></div>
${r2}
<div class="stats">
  <a class="stat" href="/admin/c/puppies"><b>${avail}</b><span>Available puppies</span></a>
  <a class="stat" href="/admin/c/puppies"><b>${reserved}</b><span>Reserved</span></a>
  <a class="stat" href="/admin/messages"><b>${unread}</b><span>Unread messages</span></a>
  <a class="stat" href="/admin/c/posts"><b>${counts.posts}</b><span>Blog posts</span></a>
</div>
<h2 class="section">Content</h2>
<div class="tiles">${Object.entries(collections).map(([k, c]) => `<a class="tile" href="/admin/c/${k}"><b>${esc(c.label)}</b><span>${counts[k]} ${counts[k] === 1 ? "item" : "items"}</span></a>`).join("")}
<a class="tile" href="/admin/settings"><b>Site settings</b><span>Name, WhatsApp number, hours, home page text</span></a></div>`
    }));
  }
  if (path === "/admin/settings") {
    const current = await getSettings(env);
    if (method === "POST") {
      const form = await request.formData();
      const { data, errors } = parseForm(settingsFields, form, current);
      data.whatsappNumber = String(data.whatsappNumber || "").replace(/\D/g, "");
      if (errors.length) return html(page({ title: "Site settings", active: "settings", unread, error: errors.map(esc).join("<br>"), body: settingsForm(data) }), 400);
      await saveSettings(env, data);
      return redirect("/admin/settings?saved=1");
    }
    return html(page({ title: "Site settings", active: "settings", unread, flash, body: settingsForm(current) }));
  }
  if (path === "/admin/messages") {
    const msgs = await listMessages(env);
    return html(page({
      title: "Messages",
      active: "messages",
      unread,
      flash,
      body: `<div class="head"><h1>Messages</h1></div>
<p class="muted">Messages sent through the contact form on the website.</p>
${msgs.length ? `<div class="msgs">${msgs.map((m2) => `<article class="msg card${m2.is_read ? "" : " unread"}">
  <header><b>${esc(m2.name)}</b> <span class="muted">${esc(m2.created_at)} UTC</span>${m2.is_read ? "" : ' <span class="pill">New</span>'}</header>
  <p class="meta"><a href="mailto:${esc(m2.email)}">${esc(m2.email)}</a>${m2.phone ? ` \xB7 ${esc(m2.phone)}` : ""}${m2.interest ? ` \xB7 Interested in: ${esc(m2.interest)}` : ""}</p>
  <p class="body">${esc(m2.message).replace(/\n/g, "<br>")}</p>
  <div class="row">
    ${m2.phone ? `<a class="btn small wa" href="https://wa.me/${esc(String(m2.phone).replace(/\D/g, ""))}" target="_blank" rel="noopener">Reply on WhatsApp</a>` : ""}
    <a class="btn small" href="mailto:${esc(m2.email)}?subject=${encodeURIComponent("Re: your enquiry")}">Reply by email</a>
    <form method="post" action="/admin/messages/${m2.id}/${m2.is_read ? "unread" : "read"}"><button class="btn small" type="submit">${m2.is_read ? "Mark unread" : "Mark read"}</button></form>
    <form method="post" action="/admin/messages/${m2.id}/delete" data-confirm="Delete this message?"><button class="btn small danger" type="submit">Delete</button></form>
  </div>
</article>`).join("")}</div>` : `<div class="card empty">No messages yet.</div>`}`
    }));
  }
  let m = path.match(/^\/admin\/messages\/(\d+)\/(read|unread|delete)$/);
  if (m && method === "POST") {
    if (m[2] === "delete") await deleteMessage(env, Number(m[1]));
    else await markMessage(env, Number(m[1]), m[2] === "read");
    return redirect(m[2] === "delete" ? "/admin/messages?deleted=1" : "/admin/messages");
  }
  m = path.match(/^\/admin\/c\/([a-z]+)(?:\/(new|edit|save|delete)(?:\/([^/]+))?)?$/);
  if (m && collections[m[1]]) {
    const key = m[1];
    const c = collections[key];
    const action = m[2];
    const slug = m[3] ? decodeURIComponent(m[3]) : null;
    const breeds2 = await listItems(env, "breeds");
    const settings = await getSettings(env);
    const ctx = {
      breeds: breeds2,
      breedName: (s) => breeds2.find((b) => b.slug === s)?.name || s,
      price: (n) => {
        try {
          return new Intl.NumberFormat(settings.locale || "en-US", { style: "currency", currency: settings.currency || "USD", maximumFractionDigits: 0 }).format(n || 0);
        } catch {
          return n;
        }
      }
    };
    if (!action) {
      const items = await listItems(env, key);
      return html(page({
        title: c.label,
        active: key,
        unread,
        flash,
        body: `<div class="head"><h1>${esc(c.label)}</h1><a class="btn primary" href="/admin/c/${key}/new">+ Add ${esc(c.singular)}</a></div>
${items.length ? `<div class="table-wrap"><table class="list"><thead><tr><th>${key === "faqs" ? "Question" : "Name"}</th>${c.columns.map(([h]) => `<th>${esc(h)}</th>`).join("")}<th class="actions"><span class="sr-only">Actions</span></th></tr></thead><tbody>
${items.map((x) => `<tr>
  <td><a href="/admin/c/${key}/edit/${encodeURIComponent(x.slug)}"><b>${esc(x[c.titleField] || x.slug)}</b></a>${x.featured ? ' <span class="pill">Featured</span>' : ""}</td>
  ${c.columns.map(([, fn]) => `<td>${esc(fn(x, ctx))}</td>`).join("")}
  <td class="actions">
    <a class="btn small" href="/admin/c/${key}/edit/${encodeURIComponent(x.slug)}">Edit</a>
    ${c.publicPath ? `<a class="btn small" href="${c.publicPath(encodeURIComponent(x.slug))}" target="_blank" rel="noopener">View</a>` : ""}
    <form method="post" action="/admin/c/${key}/delete/${encodeURIComponent(x.slug)}" data-confirm="Delete \u201C${esc(x[c.titleField] || x.slug)}\u201D? This can't be undone."><button class="btn small danger" type="submit">Delete</button></form>
  </td></tr>`).join("")}
</tbody></table></div>` : `<div class="card empty">Nothing here yet. <a href="/admin/c/${key}/new">Add the first ${esc(c.singular)}</a>.</div>`}`
      }));
    }
    if (action === "new" || action === "edit") {
      const item = action === "edit" ? await getItem(env, key, slug) : { sort: (await listItems(env, key)).length + 1 };
      if (!item) return html(page({ title: "Not found", unread, body: `<h1>Not found</h1><p><a href="/admin/c/${key}">Back to ${esc(c.label)}</a></p>` }), 404);
      return html(page({ title: `${action === "new" ? "Add" : "Edit"} ${c.singular}`, active: key, unread, flash, body: itemForm(key, c, item, action === "edit" ? slug : "", ctx) }));
    }
    if (action === "save" && method === "POST") {
      const form = await request.formData();
      const oldSlug = String(form.get("_oldSlug") || "");
      const base = oldSlug ? await getItem(env, key, oldSlug) || {} : {};
      const { data, errors } = parseForm(c.fields, form, base);
      let newSlug;
      if (c.slugFrom === "random") newSlug = oldSlug || `${key.slice(0, -1)}-${Date.now().toString(36)}`;
      else newSlug = slugify(form.get("slug")) || slugify(data[c.slugFrom]);
      if (!newSlug) errors.push("Please give it a name so a web address can be made.");
      if (newSlug && newSlug !== oldSlug && await getItem(env, key, newSlug)) errors.push(`The URL name \u201C${newSlug}\u201D is already used by another ${c.singular}. Choose a different one.`);
      data.slug = newSlug;
      if (errors.length) {
        return html(page({ title: `Edit ${c.singular}`, active: key, unread, error: errors.map(esc).join("<br>"), body: itemForm(key, c, data, oldSlug, ctx) }), 400);
      }
      const sort = Number(data.sort) || 0;
      await saveItem(env, key, newSlug, data, sort, oldSlug || null);
      return redirect(`/admin/c/${key}/edit/${encodeURIComponent(newSlug)}?saved=1`);
    }
    if (action === "delete" && method === "POST" && slug) {
      await deleteItem(env, key, slug);
      return redirect(`/admin/c/${key}?deleted=1`);
    }
  }
  return html(page({ title: "Not found", unread, body: `<h1>Page not found</h1><p><a href="/admin">Back to the dashboard</a></p>` }), 404);
}
function itemForm(key, c, item, oldSlug, ctx) {
  const viewLink = oldSlug && c.publicPath ? `<a class="btn" href="${c.publicPath(encodeURIComponent(oldSlug))}" target="_blank" rel="noopener">View on website \u2197</a>` : "";
  return `<div class="head"><h1>${oldSlug ? `Edit ${esc(c.singular)}: ${esc(item[c.titleField] || oldSlug)}` : `Add ${esc(c.singular)}`}</h1>${viewLink}</div>
<form class="card form" method="post" action="/admin/c/${key}/save">
  <input type="hidden" name="_oldSlug" value="${esc(oldSlug)}">
  ${c.fields.map((f) => fieldHtml(f, item, ctx)).join("")}
  <div class="form-actions"><button class="btn primary" type="submit">Save</button><a class="btn" href="/admin/c/${key}">Cancel</a></div>
</form>`;
}
function settingsForm(data) {
  return `<div class="head"><h1>Site settings</h1></div>
<form class="card form" method="post" action="/admin/settings">
  ${settingsFields.map((f) => fieldHtml(f, data, { breeds: [] })).join("")}
  <div class="form-actions"><button class="btn primary" type="submit">Save settings</button></div>
</form>`;
}
var TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };
var MAX_BYTES = 8 * 1024 * 1024;
async function handleUpload(request, env) {
  if (!env.IMAGES) return json2({ error: "Photo uploads aren't set up yet: connect an R2 bucket named IMAGES (see README, step 3)." }, 501);
  let form;
  try {
    form = await request.formData();
  } catch {
    return json2({ error: "Upload failed. Please try again." }, 400);
  }
  const file = form.get("file");
  if (!file || typeof file === "string") return json2({ error: "No file received." }, 400);
  const ext = TYPES[file.type];
  if (!ext) return json2({ error: "Please upload a JPG, PNG, WebP, GIF or AVIF image." }, 415);
  if (file.size > MAX_BYTES) return json2({ error: "That image is over 8 MB. Please use a smaller photo." }, 413);
  const key = `uploads/${(/* @__PURE__ */ new Date()).toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  await env.IMAGES.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  return json2({ url: `/media/${key}` });
}
async function serveMedia(request, env, url) {
  if (!env.IMAGES) return new Response("Not found", { status: 404 });
  const key = decodeURIComponent(url.pathname.slice("/media/".length));
  if (!key.startsWith("uploads/") || key.includes("..")) return new Response("Not found", { status: 404 });
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("ETag", obj.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
}

// petite-paws-cf/worker/index.js
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path === "/api/contact") return await handleContact(request, env);
      if (path === "/admin" || path.startsWith("/admin/")) return await handleAdmin(request, env, url);
      if (path.startsWith("/media/")) return await serveMedia(request, env, url);
      if (/\.[a-z0-9]+$/i.test(path) && path !== "/sitemap.xml" && path !== "/robots.txt") {
        return env.ASSETS.fetch(request);
      }
      if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
      if (!path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path)) {
        return Response.redirect(`${url.origin}${path}/${url.search}`, 301);
      }
      const data = await loadAll(env);
      const page2 = createRenderer(data, url.origin).render(path);
      return new Response(request.method === "HEAD" ? null : page2.body, {
        status: page2.status,
        headers: {
          "Content-Type": page2.type,
          "Cache-Control": "public, max-age=0, must-revalidate",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "X-Frame-Options": "SAMEORIGIN"
        }
      });
    } catch (err) {
      console.error(err);
      return new Response(
        `<!DOCTYPE html><meta charset="utf-8"><title>Setup needed</title><body style="font-family:system-ui;max-width:640px;margin:3rem auto;padding:0 1rem;line-height:1.6"><h1>The site couldn't load</h1><p>${String(err.message || err).replace(/</g, "&lt;")}</p><p>If you just deployed, check the setup steps in the README (D1 database binding).</p></body>`,
        { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  }
};
export {
  index_default as default
};
