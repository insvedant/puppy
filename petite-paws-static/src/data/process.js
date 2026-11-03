export const processPages = [
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
<p>Card, bank transfer or financing. We never ask for gift cards or crypto.</p>`,
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
<p>Read more: <a href="/blog/puppy-delivery-cargo-vs-flight-nanny">Cargo vs flight nanny</a>.</p>`,
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
<p>Take your puppy for a vet check within 7 days of arrival and keep vaccinations up to date.</p>`,
    },
    {
        slug: "financing",
        title: "Financing",
        summary: "Spread the cost with monthly payments.",
        body: `
<h2>Pay over time</h2>
<p>Spread the cost with monthly payments through our financing partner. Apply online in a few minutes and get a decision quickly.</p>
<ul><li>Plans from 6 to 24 months</li><li>No obligation to check your rate</li><li>Subject to approval</li></ul>
<p>Message us on WhatsApp and we'll send you the application link.</p>`,
    },
    {
        slug: "special-order",
        title: "Special Order",
        summary: "Tell us your wishlist and we'll match you with an upcoming litter.",
        body: `
<h2>Can't find the right puppy?</h2>
<p>Tell us the breed, sex, color and size you want. We'll match you with an upcoming litter and send photos and videos as soon as a puppy fits your wishlist.</p>
<p>A special-order deposit secures your place on the waitlist and goes toward the price of your puppy.</p>`,
    },
    {
        slug: "adoption-agreement",
        title: "Adoption Agreement",
        summary: "What you sign when you reserve a puppy.",
        body: `
<h2>Our adoption agreement</h2>
<p>Before any payment is final, you receive our written agreement. It covers:</p>
<ul><li>The puppy's details, price, deposit and balance</li><li>Delivery method and estimated date</li><li>The health guarantee and how to make a claim</li><li>Your responsibilities as the new owner</li><li>Our deposit and refund policy</li></ul>
<p>Ask us on WhatsApp for a sample copy before you reserve.</p>`,
    },
    {
        slug: "puppy-checklist",
        title: "Puppy Checklist",
        summary: "Everything to have ready before your puppy arrives.",
        body: `
<h2>Before your puppy arrives</h2>
<ul><li>Crate or playpen, with a soft bed</li><li>Small-breed puppy food (we'll tell you the brand)</li><li>Shallow food and water bowls</li><li>Puppy pads and enzyme cleaner</li><li>Lightweight harness and leash</li><li>Soft brush and puppy shampoo</li><li>Chew toys sized for small mouths</li><li>Nutritional gel for low blood sugar</li></ul>
<p>Read our guide: <a href="/blog/first-7-days-with-your-puppy">The first 7 days</a>.</p>`,
    },
];
export const getProcessPage = (slug) => processPages.find((p) => p.slug === slug);
