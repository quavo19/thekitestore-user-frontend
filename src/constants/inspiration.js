import banner1 from "@/assets/images/banners/banner1.jpg";
import banner2 from "@/assets/images/banners/banner2.jpg";
import banner3 from "@/assets/images/banners/banner3.jpg";
import banner from "@/assets/images/banners/banner.jpg";
import plant1 from "@/assets/images/plants/plant1.png";
import plant2 from "@/assets/images/plants/plant2.png";
import plant3 from "@/assets/images/plants/plant3.jpg";
import plant4 from "@/assets/images/plants/plant4.jpg";

export const INSPIRATION_PAGE_SIZE = 12;

/** @type {("tall" | "medium" | "wide" | "square")[]} */
const ASPECT_VARIANTS = ["tall", "medium", "wide", "square"];

const BOARD_TEMPLATES = [
  {
    title: "Living Room Greens",
    images: [banner3, plant1, plant3, banner2],
  },
  {
    title: "Hanging Basket Ideas",
    images: [plant4, plant2, banner1, plant3],
  },
  {
    title: "Shelf Styling",
    images: [banner2, plant4, plant1, banner],
  },
  {
    title: "Minimalist Corners",
    images: [plant2, banner3, plant4, plant1],
  },
  {
    title: "Kitchen Herb Nooks",
    images: [banner2, plant3, banner1, plant2],
  },
  {
    title: "Bedroom Plant Retreats",
    images: [plant1, banner3, plant2, banner],
  },
  {
    title: "Balcony Jungle",
    images: [plant3, plant4, banner1, banner3],
  },
  {
    title: "Woven Pot Collection",
    images: [plant4, banner, plant1, plant3],
  },
  {
    title: "Sunlit Window Ledges",
    images: [banner3, plant2, banner2, plant4],
  },
  {
    title: "Terrarium Displays",
    images: [plant3, plant1, banner1, plant2],
  },
  {
    title: "Entryway Greenery",
    images: [banner, plant4, banner3, plant1],
  },
  {
    title: "Office Desk Plants",
    images: [plant2, plant3, banner2, plant4],
  },
  {
    title: "Bathroom Spa Vibes",
    images: [plant1, banner1, plant4, banner3],
  },
  {
    title: "Propagation Stations",
    images: [plant3, banner, plant2, banner2],
  },
  {
    title: "Statement Floor Plants",
    images: [banner3, plant4, plant1, banner1],
  },
  {
    title: "Cozy Reading Nooks",
    images: [plant2, banner2, plant3, banner],
  },
  {
    title: "Dining Table Centerpieces",
    images: [plant4, plant1, banner3, plant2],
  },
  {
    title: "Staircase Cascades",
    images: [banner1, plant3, banner, plant4],
  },
  {
    title: "Outdoor Patio Setup",
    images: [banner2, plant2, plant1, plant3],
  },
  {
    title: "Monochrome Planters",
    images: [plant1, plant4, banner2, banner3],
  },
  {
    title: "Trailing Vine Walls",
    images: [plant3, banner3, plant2, banner1],
  },
  {
    title: "Seasonal Refresh",
    images: [banner, plant2, plant4, banner2],
  },
  {
    title: "Small Space Solutions",
    images: [plant4, banner1, plant1, plant3],
  },
  {
    title: "Gift-Worthy Arrangements",
    images: [plant2, plant1, banner, plant4],
  },
];

export const INSPIRATION_BOARDS = BOARD_TEMPLATES.map((board, index) => ({
  id: index + 1,
  title: board.title,
  thumbnail: board.images[0],
  images: board.images,
  aspect: ASPECT_VARIANTS[index % ASPECT_VARIANTS.length],
}));
