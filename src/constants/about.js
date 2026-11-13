import banner1 from "@/assets/images/banners/banner1.jpg";
import banner2 from "@/assets/images/banners/banner2.jpg";
import banner3 from "@/assets/images/banners/banner3.jpg";
import banner from "@/assets/images/banners/banner.jpg";
import plant1 from "@/assets/images/plants/plant1.png";
import plant2 from "@/assets/images/plants/plant2.png";
import plant3 from "@/assets/images/plants/plant3.jpg";
import plant4 from "@/assets/images/plants/plant4.jpg";
import leavesIcon from "@/assets/svgs/leaves.svg?raw";
import medalIcon from "@/assets/svgs/medal.svg?raw";
import securityCheckIcon from "@/assets/svgs/security-check.svg?raw";
import docIcon from "@/assets/svgs/doc-1.svg?raw";
import groupIcon from "@/assets/svgs/Group.svg?raw";

export const ABOUT_HERO = {
  eyebrow: "Welcome to The Kite Store",
  headline: "Plants That Belong In Real Homes",
  description:
    "We design plant experiences for real lives and real routines, with living systems that quietly integrate into how you already move through your space.",
  badge: "Biophilic Design Studio",
  images: {
    main: banner3,
    top: plant3,
    bottom: plant4,
  },
};

export const ABOUT_WHY_CHOOSE_US = {
  title: "Why Choose Us?",
  description:
    "At The Kite Store, we design plant experiences that belong in real homes, real lives, and real routines. Not as decoration that demands attention, but as living systems that quietly integrate into how you already move through your space.",
  closing:
    "The result is a space that feels grounded and alive at once: clean but not empty, green but not chaotic, designed but never forced.",
  image: banner2,
  features: [
    {
      id: 1,
      title: "Intentional Placement",
      description:
        "We begin with the space itself: how light moves, how people flow, and where stillness naturally exists. Every placement is designed to grow with you.",
      icon: leavesIcon,
      iconBg: "bg-[#E4F0E4]",
    },
    {
      id: 2,
      title: "Function & Feeling",
      description:
        "Plants are selected based on function, feeling, and long-term harmony rather than trends, so your space stays cohesive over time.",
      icon: medalIcon,
      iconBg: "bg-[#F0F4D8]",
    },
    {
      id: 3,
      title: "Grounded & Alive",
      description:
        "We create environments that feel natural and enduring: clean but not empty, green but not chaotic, designed but never forced.",
      icon: securityCheckIcon,
      iconBg: "bg-[#FAEBE0]",
    },
  ],
};

export const ABOUT_OVERVIEW = {
  title: "Overview",
  paragraphs: [
    "At The Kite Store, we understand that plants bring life and balance into every space. Our work focuses on biophilic design, creating calm, well-designed environments through expert plant care and clean, nature-inspired décor.",
    "Whether supporting first-time plant owners or designing curated indoor and outdoor green spaces, we provide practical guidance, tailored consultations, and plant design solutions that are both functional and aesthetically refined.",
    "From selecting plants suited to your light conditions, lifestyle, and space, to arranging them with purpose, The Kite Store combines technical knowledge, thoughtful design, and a balanced approach to deliver environments that feel natural, cohesive, and enduring.",
  ],
  image: banner1,
};

export const ABOUT_MISSION = {
  title: "Mission",
  description:
    "The Kite Store exists to enhance living and working spaces through professional plant care and refined, nature-inspired décor. We deliver thoughtful solutions that combine aesthetics, functionality, and environmental responsibility.",
};

export const ABOUT_VISION = {
  title: "Vision",
  description:
    "Our vision is to see homes, cities, and communities thoughtfully integrated with nature, where green spaces improve quality of life and human activity supports long-term environmental sustainability.",
};

export const ABOUT_VALUES = {
  title: "Our Values",
  description:
    "We are guided by professionalism, sustainability, and intentional design. The Kite Store is committed to responsible plant care, quality service delivery, and creating spaces that are balanced, healthy, and enduring.",
  pillars: ["Professionalism", "Sustainability", "Intentional Design"],
};

export const ABOUT_SERVICES = [
  {
    id: 1,
    title: "Corporate & Commercial Spaces",
    description:
      "We design and install plant setups for offices, retail spaces, and other working environments. The focus is on creating a setting that feels more grounded and comfortable without interfering with how the space functions day to day.",
    image: banner,
    icon: groupIcon,
  },
  {
    id: 2,
    title: "Home & Personal Spaces",
    description:
      "We work with individuals to introduce plants into their homes in a way that feels natural and manageable. This can include anything from a few well-placed plants to a more complete setup across different areas of the home.",
    image: plant1,
    icon: leavesIcon,
  },
  {
    id: 3,
    title: "Plant Consultation",
    description:
      "For those who need direction, we offer consultations that look at your space in detail. We assess light, layout, and daily use, then recommend plants and arrangements that will work in that specific environment.",
    image: plant2,
    icon: docIcon,
  },
];
