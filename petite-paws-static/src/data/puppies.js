export const puppies = [
    { slug: "bella", name: "Bella", breed: "pomeranian", sex: "Female", age: "12 weeks", color: "Orange Sable", price: 4800, status: "available", adultWeight: "Est. 4 lb", vaccinations: "Up to date (5-in-1)", microchip: true, featured: true,
        about: "Bella is a confident little girl who loves cuddles and greets everyone with a wagging tail. She is already pad-trained and eats well on her own." },
    { slug: "milo", name: "Milo", breed: "maltipoo", sex: "Male", age: "10 weeks", color: "Apricot", price: 3900, status: "available", adultWeight: "Est. 7 lb", vaccinations: "Up to date (5-in-1)", microchip: true, featured: true,
        about: "Milo is gentle and easygoing. He loves to play with soft toys and then fall asleep on a lap. Great with children." },
    { slug: "snow", name: "Snow", breed: "maltese", sex: "Female", age: "13 weeks", color: "White", price: 4200, status: "reserved", adultWeight: "Est. 5 lb", vaccinations: "Up to date (5-in-1)", microchip: true,
        about: "Snow is calm and sweet with a silky white coat. She enjoys being brushed and follows her people everywhere." },
    { slug: "coco", name: "Coco", breed: "toy-poodle", sex: "Female", age: "11 weeks", color: "Red", price: 4500, status: "available", adultWeight: "Est. 5 lb", vaccinations: "Up to date (5-in-1)", microchip: true, featured: true,
        about: "Coco is clever and playful. She is learning her name already and loves short training games with treats." },
    { slug: "rocky", name: "Rocky", breed: "yorkie", sex: "Male", age: "12 weeks", color: "Black & Tan", price: 3600, status: "available", adultWeight: "Est. 5 lb", vaccinations: "Up to date (5-in-1)", microchip: true,
        about: "Rocky is a brave little explorer with a big heart. He loves walks around the garden and naps in the sun." },
    { slug: "pixie", name: "Pixie", breed: "chihuahua", sex: "Female", age: "14 weeks", color: "Fawn", price: 3200, status: "available", adultWeight: "Est. 3 lb", vaccinations: "Up to date (5-in-1)", microchip: true,
        about: "Pixie is tiny, spirited and very affectionate. She is the perfect travel companion and loves being carried." },
    { slug: "bruno", name: "Bruno", breed: "french-bulldog", sex: "Male", age: "12 weeks", color: "Blue", price: 5200, status: "reserved", adultWeight: "Est. 22 lb", vaccinations: "Up to date (5-in-1)", microchip: true,
        about: "Bruno is a relaxed, funny boy who snores when he sleeps. He loves people and gets along with other dogs." },
    { slug: "luna", name: "Luna", breed: "pomsky", sex: "Female", age: "11 weeks", color: "Grey & White", price: 4900, status: "available", adultWeight: "Est. 20 lb", vaccinations: "Up to date (5-in-1)", microchip: true, featured: true,
        about: "Luna has striking husky markings and lots of energy. She will thrive with an active family who loves to play." },
    { slug: "teddy", name: "Teddy", breed: "bichon-frise", sex: "Male", age: "10 weeks", color: "White", price: 3800, status: "available", adultWeight: "Est. 10 lb", vaccinations: "Up to date (5-in-1)", microchip: true,
        about: "Teddy is a happy cotton ball who gets along with everyone. He is well socialized with children and other pets." },
    { slug: "honey", name: "Honey", breed: "pomeranian", sex: "Female", age: "—", color: "Cream", price: 5100, status: "sold", adultWeight: "Est. 4 lb", vaccinations: "Up to date (5-in-1)", microchip: true,
        about: "Honey went home to a wonderful family." },
    { slug: "oreo", name: "Oreo", breed: "toy-poodle", sex: "Male", age: "—", color: "Black", price: 4300, status: "sold", adultWeight: "Est. 6 lb", vaccinations: "Up to date (5-in-1)", microchip: true,
        about: "Oreo went home to a wonderful family." },
    { slug: "daisy", name: "Daisy", breed: "maltipoo", sex: "Female", age: "—", color: "Cream", price: 3900, status: "sold", adultWeight: "Est. 7 lb", vaccinations: "Up to date (5-in-1)", microchip: true,
        about: "Daisy went home to a wonderful family." },
];
export const getPuppy = (slug) => puppies.find((p) => p.slug === slug);
export const currentPuppies = () => puppies.filter((p) => p.status !== "sold");
export const previousPuppies = () => puppies.filter((p) => p.status === "sold");
