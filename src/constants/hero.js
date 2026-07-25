import plant1 from "@/assets/images/plants/plant1.png";
import plant2 from "@/assets/images/plants/plant2.png";

export const HERO_AVATARS = [
  { id: 1, image: plant1, name: "Sarah" },
  { id: 2, image: plant2, name: "James" },
  { id: 3, image: plant1, name: "Mia" },
];

export const HERO_SHOWCASE_SLIDES = [
  {
    id: 1,
    image: plant2,
    badge: "4.8K+",
    testimonial: {
      quote: "My plants have never been happier!",
      author: "Mahbuba I.",
      avatar: plant1,
      rating: 5,
    },
  },
  {
    id: 2,
    image: plant1,
    badge: "4.8K+",
    testimonial: {
      quote: "Beautiful plants, fast delivery!",
      author: "Daniel K.",
      avatar: plant2,
      rating: 5,
    },
  },
  {
    id: 3,
    image: plant2,
    badge: "4.8K+",
    testimonial: {
      quote: "Expert care tips made all the difference.",
      author: "Lena P.",
      avatar: plant1,
      rating: 5,
    },
  },
];

export const HERO_FEATURED_PLANTS = [
  {
    id: 1,
    label: "This Week's Featured Plant",
    name: "Monstera Deliciosa",
    price: 34.99,
    originalPrice: 49.99,
    image: plant1,
  },
  {
    id: 2,
    label: "This Week's Featured Plant",
    name: "Fiddle Leaf Fig",
    price: 42.99,
    originalPrice: 58.99,
    image: plant2,
  },
  {
    id: 3,
    label: "This Week's Featured Plant",
    name: "Snake Plant",
    price: 28.99,
    originalPrice: 39.99,
    image: plant1,
  },
];

export const HERO_RATING = {
  score: "4.9",
  label: "Customer Rating",
  stars: 5,
};

export const HERO_SOCIAL_PROOF = {
  count: "20K",
  label: "Happy Plant Parents",
};

export const HERO_FEATURES = [
  {
    id: 1,
    title: "Handpicked Quality",
    description: "Carefully selected healthy plants",
    iconBg: "bg-[#F0F4D8]",
  },
  {
    id: 2,
    title: "Fast & Safe Delivery",
    description: "Secure packaging right to your door",
    iconBg: "bg-[#E4F0E4]",
  },
  {
    id: 3,
    title: "Expert Guidance",
    description: "Care tips and support for every plant",
    iconBg: "bg-[#FAEBE0]",
  },
  {
    id: 4,
    title: "Plant Happiness Guarantee",
    description: "Care tips and support for every plant",
    iconBg: "bg-[#F9E8EB]",
  },
];
