export const categorySlug = (name = "") => name.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const CATALOG_CATEGORIES = [
  {
    "id": "phones",
    "label": "Phones",
    "description": "Every iPhone family, from iPhone 5 onward.",
    "image": "/catalog/phones.svg"
  },
  {
    "id": "ipads",
    "label": "iPads",
    "description": "iPad, iPad mini, iPad Air and iPad Pro.",
    "image": "/catalog/ipads.svg"
  },
  {
    "id": "macbooks",
    "label": "MacBooks",
    "description": "MacBook, MacBook Air and MacBook Pro.",
    "image": "/catalog/macbooks.svg"
  },
  {
    "id": "desktops-displays",
    "label": "Desktops & Displays",
    "description": "iMac, Mac mini, Mac Studio, Mac Pro and displays.",
    "image": "/catalog/desktops-displays.svg"
  },
  {
    "id": "airpods-audio",
    "label": "AirPods & Audio",
    "description": "AirPods, AirPods Pro, AirPods Max and EarPods.",
    "image": "/catalog/airpods-audio.svg"
  },
  {
    "id": "watches",
    "label": "Watches",
    "description": "Apple Watch, SE, Ultra, bands and charging accessories.",
    "image": "/catalog/watches.svg"
  },
  {
    "id": "chargers-cables",
    "label": "Chargers & Cables",
    "description": "Power adapters, MagSafe, cables and charging docks.",
    "image": "/catalog/chargers-cables.svg"
  },
  {
    "id": "cases-protection",
    "label": "Cases & Protection",
    "description": "Cases, sleeves, screen protection and wallets.",
    "image": "/catalog/cases-protection.svg"
  },
  {
    "id": "keyboards-mice",
    "label": "Keyboards & Mice",
    "description": "Magic Keyboard, Magic Mouse, Magic Trackpad and input accessories.",
    "image": "/catalog/keyboards-mice.svg"
  },
  {
    "id": "airtags-find-my",
    "label": "AirTags & Find My",
    "description": "AirTag trackers, holders, loops and key rings.",
    "image": "/catalog/airtags-find-my.svg"
  },
  {
    "id": "tv-home",
    "label": "TV & Home",
    "description": "Apple TV, HomePod, HomePod mini and remotes.",
    "image": "/catalog/tv-home.svg"
  },
  {
    "id": "vision-accessories",
    "label": "Vision & Accessories",
    "description": "Apple Vision Pro, Apple Pencil, adapters, storage and more.",
    "image": "/catalog/vision-accessories.svg"
  }
];
export const categoryHref = (id) => `/shop?category=${encodeURIComponent(id)}`;
