// Template text — have these reviewed for your country before going live.
export const legalPages = [
    {
        slug: "privacy-policy",
        title: "Privacy Policy",
        body: `<p>We collect the information you give us when you contact us by WhatsApp, email or our contact form: your name, phone number, email address and message. We use it only to answer your questions and to arrange your puppy's reservation and delivery.</p>
<p>We do not sell your personal information. We share it only with service providers needed to complete your order, such as payment processors and delivery partners.</p>
<p>You can ask us to see, correct or delete your information at any time by contacting us.</p>`,
    },
    {
        slug: "terms-of-service",
        title: "Terms of Service",
        body: `<p>By using this website you agree to these terms. Puppy listings, prices and availability may change without notice. A puppy is only reserved once a deposit is received and confirmed in writing.</p>
<p>All sales are governed by the adoption agreement signed at the time of reservation.</p>`,
    },
    {
        slug: "refund-policy",
        title: "Refund Policy",
        body: `<p>Deposits are non-refundable but can be moved to another puppy. If your chosen puppy does not pass its final vet check, your deposit is transferred to another puppy of your choice or refunded in full.</p>
<p>Health-related claims are handled under our one-year health guarantee.</p>`,
    },
];
export const getLegalPage = (slug) => legalPages.find((p) => p.slug === slug);
