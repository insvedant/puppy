/**
 * Petite Paws — server code (Cloudflare Workers / Pages).
 * The website and admin panel are the .html/.css/.js files in this folder.
 * This file only does what needs a server: stores content in the D1 database,
 * checks the admin password, saves photos to R2 and receives contact-form messages.
 * Cloudflare runs it automatically. You don't need to edit it.
 */

// ../pp-html-src/worker/seed/site.js
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

// ../pp-html-src/worker/seed/breeds.js
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

// ../pp-html-src/worker/seed/puppies.js
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

// ../pp-html-src/worker/seed/posts.js
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

// ../pp-html-src/worker/seed/reviews.js
var reviews = [
  { text: "Milo arrived calm and healthy. The team sent videos every few days before pickup and answered every WhatsApp message within minutes.", name: "Priya S.", puppy: "Maltipoo family", rating: 5 },
  { text: "I was nervous about buying online. The video call with the actual puppy and the written health guarantee made all the difference.", name: "Daniel R.", puppy: "Pomeranian family", rating: 5 },
  { text: "The flight nanny handed us our little girl at arrivals with her vaccine card and a starter pack. Smooth from start to finish.", name: "Aisha K.", puppy: "Toy Poodle family", rating: 5 },
  { text: "They helped us choose a breed that suits apartment life. Six months in, Pixie is the happiest little dog.", name: "Marco L.", puppy: "Chihuahua family", rating: 5 },
  { text: "Clear contract, clear pricing, no surprises. Our vet said Teddy was in excellent condition.", name: "Hannah W.", puppy: "Bichon family", rating: 5 },
  { text: "The puppy care checklist was so useful for the first week. We still message them with questions.", name: "Rahul M.", puppy: "Yorkie family", rating: 5 }
];

// ../pp-html-src/worker/seed/faqs.js
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

// ../pp-html-src/worker/seed/process.js
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

// ../pp-html-src/worker/seed/legal.js
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

// ../pp-html-src/worker/store.js
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

// ../pp-html-src/worker/contact.js
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
      html
    })
  });
  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    if (saved) return json({ ok: true });
    return json({ error: "We couldn't send your message right now. Please message us on WhatsApp." }, 502);
  }
  return json({ ok: true });
}

// ../pp-html-src/worker/auth.js
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

// ../pp-html-src/worker/index.js
var COLLECTIONS2 = ["puppies", "breeds", "posts", "reviews", "faqs", "process", "legal"];
var PRIVATE_FILES = /* @__PURE__ */ new Set(["/wrangler.jsonc", "/.assetsignore", "/.gitignore", "/README.md", "/.dev.vars"]);
var MAX_ITEM_BYTES = 200 * 1024;
var json2 = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers } });
var slugify = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path === "/api/content") return await getContent(env);
      if (path === "/api/contact") return await handleContact(request, env);
      if (path.startsWith("/api/admin/")) return await handleAdminApi(request, env, url);
      if (path.startsWith("/api/")) return json2({ error: "Not found" }, 404);
      if (path.startsWith("/media/")) return await serveMedia(env, url);
      if (PRIVATE_FILES.has(path)) return new Response("Not found", { status: 404 });
      if (path === "/admin") return Response.redirect(`${url.origin}/admin/`, 301);
      return env.ASSETS.fetch(request);
    } catch (err) {
      console.error(err);
      return json2({ error: err.message || "Server error" }, 500);
    }
  }
};
async function getContent(env) {
  const data = await loadAll(env);
  return json2(data, 200, { "Cache-Control": "no-cache" });
}
async function handleAdminApi(request, env, url) {
  const action = url.pathname.slice("/api/admin/".length);
  const method = request.method;
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  if (method !== "GET") {
    const origin = request.headers.get("Origin");
    if (origin && origin !== url.origin) return json2({ error: "Forbidden" }, 403);
  }
  if (action === "me") {
    return json2({ configured: isConfigured(env), loggedIn: await isLoggedIn(request, env), uploads: Boolean(env.IMAGES), database: Boolean(env.DB) });
  }
  if (action === "login" && method === "POST") {
    if (!isConfigured(env)) return json2({ error: "The admin password isn't set yet. Add a secret named ADMIN_PASSWORD in Cloudflare (Settings \u2192 Variables and Secrets), then redeploy." }, 400);
    if (tooManyAttempts(ip)) return json2({ error: "Too many failed attempts. Try again in 15 minutes." }, 429);
    const body = await request.json().catch(() => ({}));
    if (await checkCredentials(env, body.username, body.password)) {
      clearFailures(ip);
      return json2({ ok: true }, 200, { "Set-Cookie": await createSessionCookie(env, url) });
    }
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 600));
    return json2({ error: "Wrong username or password." }, 401);
  }
  if (action === "logout" && method === "POST") return json2({ ok: true }, 200, { "Set-Cookie": clearSessionCookie(url) });
  if (!await isLoggedIn(request, env)) return json2({ error: "Please log in again.", loggedOut: true }, 401);
  if (action === "upload" && method === "POST") return handleUpload(request, env);
  if (action === "dashboard") {
    const counts = {};
    for (const c of COLLECTIONS2) counts[c] = (await listItems(env, c)).length;
    const puppies2 = await listItems(env, "puppies");
    return json2({
      counts,
      available: puppies2.filter((p) => p.status === "available").length,
      reserved: puppies2.filter((p) => p.status === "reserved").length,
      unread: await countUnread(env),
      uploads: Boolean(env.IMAGES)
    });
  }
  if (action === "items" && method === "GET") {
    const c = url.searchParams.get("c");
    if (!COLLECTIONS2.includes(c)) return json2({ error: "Unknown section." }, 400);
    return json2({ items: await listItems(env, c), breeds: await listItems(env, "breeds"), settings: await getSettings(env) });
  }
  if (action === "item" && method === "GET") {
    const c = url.searchParams.get("c");
    if (!COLLECTIONS2.includes(c)) return json2({ error: "Unknown section." }, 400);
    const item = await getItem(env, c, url.searchParams.get("slug") || "");
    if (!item) return json2({ error: "Not found." }, 404);
    return json2({ item });
  }
  if (action === "save" && method === "POST") {
    const body = await request.json().catch(() => null);
    if (!body || !COLLECTIONS2.includes(body.collection) || typeof body.data !== "object") return json2({ error: "Invalid request." }, 400);
    const { collection, data } = body;
    const oldSlug = String(body.oldSlug || "");
    let slug = slugify(body.slug);
    if (!slug && (collection === "reviews" || collection === "faqs")) slug = oldSlug || `${collection.slice(0, -1)}-${Date.now().toString(36)}`;
    if (!slug) slug = slugify(data.name || data.title);
    if (!slug) return json2({ error: "Please give it a name so a web address can be made." }, 400);
    if (slug !== oldSlug && await getItem(env, collection, slug)) return json2({ error: `The URL name \u201C${slug}\u201D is already used. Choose a different one.` }, 409);
    if (JSON.stringify(data).length > MAX_ITEM_BYTES) return json2({ error: "This item is too large to save." }, 413);
    await saveItem(env, collection, slug, data, Number(data.sort) || 0, oldSlug || null);
    return json2({ ok: true, slug });
  }
  if (action === "delete" && method === "POST") {
    const body = await request.json().catch(() => ({}));
    if (!COLLECTIONS2.includes(body.collection) || !body.slug) return json2({ error: "Invalid request." }, 400);
    await deleteItem(env, body.collection, String(body.slug));
    return json2({ ok: true });
  }
  if (action === "settings") {
    if (method === "GET") return json2({ settings: await getSettings(env) });
    if (method === "POST") {
      const body = await request.json().catch(() => null);
      if (!body || typeof body.data !== "object") return json2({ error: "Invalid request." }, 400);
      const data = { ...await getSettings(env), ...body.data };
      data.whatsappNumber = String(data.whatsappNumber || "").replace(/\D/g, "");
      if (!data.name) return json2({ error: "Business name is required." }, 400);
      if (!data.whatsappNumber) return json2({ error: "WhatsApp number is required." }, 400);
      await saveSettings(env, data);
      return json2({ ok: true });
    }
  }
  if (action === "messages") {
    if (method === "GET") return json2({ messages: await listMessages(env) });
    if (method === "POST") {
      const body = await request.json().catch(() => ({}));
      const id = Number(body.id);
      if (!id) return json2({ error: "Invalid request." }, 400);
      if (body.action === "delete") await deleteMessage(env, id);
      else await markMessage(env, id, body.action === "read");
      return json2({ ok: true });
    }
  }
  return json2({ error: "Not found." }, 404);
}
var TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };
async function handleUpload(request, env) {
  if (!env.IMAGES) return json2({ error: "Photo uploads aren't set up yet: add an R2 bucket binding named IMAGES (see README)." }, 501);
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
  if (file.size > 8 * 1024 * 1024) return json2({ error: "That image is over 8 MB. Please use a smaller photo." }, 413);
  const key = `uploads/${(/* @__PURE__ */ new Date()).toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  await env.IMAGES.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  return json2({ url: `/media/${key}` });
}
async function serveMedia(env, url) {
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
export {
  index_default as default
};
