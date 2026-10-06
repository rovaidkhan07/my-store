export const STORE_CATEGORIES = [
  { name: "Earbuds & Audio", slug: "earbuds", shortName: "Earbuds", enabled: true, count: 32, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop" },
  { name: "Chargers & Adapters", slug: "chargers", shortName: "Chargers", enabled: true, count: 24, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop" },
  { name: "Cables & Fast Charging", slug: "cables", shortName: "Cables", enabled: true, count: 18, image: "https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=300&auto=format&fit=crop" },
  { name: "Power Banks", slug: "power-banks", shortName: "Power Banks", enabled: true, count: 12, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&auto=format&fit=crop" },
  { name: "Phone Covers & Cases", slug: "phone-covers", shortName: "Cases", enabled: false, count: 56, image: "https://images.unsplash.com/photo-1541560052-5e137f229371?w=300&auto=format&fit=crop" },
  { name: "Screen Protectors", slug: "screen-protectors", shortName: "Protectors", enabled: false, count: 40, image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=300&auto=format&fit=crop" },
  { name: "Car Accessories", slug: "car-accessories", shortName: "Car Acc.", enabled: false, count: 15, image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=300&auto=format&fit=crop" },
  { name: "Stands & Holders", slug: "stands-mounts", shortName: "Stands", enabled: false, count: 10, image: "https://images.unsplash.com/photo-1544281679-22072382c4ee?w=300&auto=format&fit=crop" }
];

export const ACTIVE_CATEGORIES = STORE_CATEGORIES.filter(c => c.enabled);
