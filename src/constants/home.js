import plant1 from "@/assets/images/plants/plant1.png";
import plant2 from "@/assets/images/plants/plant2.png";
import banner2 from "@/assets/images/banners/banner2.jpg";
import banner3 from "@/assets/images/banners/banner3.jpg";
import plant3 from "@/assets/images/plants/plant3.jpg";
import plant4 from "@/assets/images/plants/plant4.jpg";
import { ROUTES } from "@/constants/routes";

export const SHOP_COLLECTIONS = [
  {
    id: "rattan-pots",
    title: "Rattan pots",
    count: 52,
    image: plant1,
    href: `${ROUTES.SHOP}?category=rattan-pots`,
  },
  {
    id: "plant-stands",
    title: "Plant stands",
    count: 38,
    image: plant2,
    href: `${ROUTES.SHOP}?category=plant-stands`,
  },
  {
    id: "propagation-jars",
    title: "Propagation jars",
    count: 44,
    image: plant3,
    href: `${ROUTES.SHOP}?category=propagation-jars`,
  },
  {
    id: "gardening-tool-kit",
    title: "Gardening tool kit",
    count: 66,
    image: plant4,
    href: `${ROUTES.SHOP}?category=gardening-tool-kit`,
  },
];

export const BEST_SELLERS = [
  {
    id: 1,
    name: "Snake Plant",
    price: 28.99,
    rating: 4.9,
    image: plant1,
    href: ROUTES.SHOP,
  },
  {
    id: 2,
    name: "Pothos",
    price: 28.99,
    rating: 4.9,
    image: plant2,
    href: ROUTES.SHOP,
  },
  {
    id: 3,
    name: "ZZ Plant",
    price: 28.99,
    rating: 4.9,
    image: plant1,
    href: ROUTES.SHOP,
  },
  {
    id: 4,
    name: "Peace Lily",
    price: 28.99,
    rating: 4.9,
    image: plant2,
    href: ROUTES.SHOP,
  },
];

export const DAILY_DEALS = [
  {
    id: 1,
    name: "American Marigold",
    price: 60,
    rating: 4.9,
    image: plant3,
    href: ROUTES.SHOP,
  },
  {
    id: 2,
    name: "Special Flower Tree",
    price: 60,
    rating: 4.8,
    image: plant4,
    href: ROUTES.SHOP,
  },
  {
    id: 3,
    name: "Golden Pothos",
    price: 45,
    rating: 4.9,
    image: plant1,
    href: ROUTES.SHOP,
  },
  {
    id: 4,
    name: "Snake Plant",
    price: 38,
    rating: 4.7,
    image: plant2,
    href: ROUTES.SHOP,
  },
  {
    id: 5,
    name: "Peace Lily",
    price: 52,
    rating: 4.9,
    image: plant3,
    href: ROUTES.SHOP,
  },
  {
    id: 6,
    name: "ZZ Plant",
    price: 48,
    rating: 4.8,
    image: plant4,
    href: ROUTES.SHOP,
  },
  {
    id: 7,
    name: "Monstera Deliciosa",
    price: 72,
    rating: 4.9,
    image: plant1,
    href: ROUTES.SHOP,
  },
];

export const HOME_INSPIRATION_GRID = [
  {
    id: 1,
    image: banner3,
    alt: "Indoor plants in a styled living space",
    variant: "banner",
    href: ROUTES.INSPIRATION,
  },
  {
    id: 2,
    image: plant3,
    alt: "Hanging glass terrarium plant",
    variant: "square",
    href: ROUTES.SHOP,
  },
  {
    id: 3,
    image: plant4,
    alt: "Trailing plants in woven hanging baskets",
    variant: "square",
    href: ROUTES.SHOP,
  },
  {
    id: 4,
    image: banner2,
    alt: "Fresh herbs in pots on a wooden shelf",
    variant: "banner",
    href: ROUTES.INSPIRATION,
  },
];
