import { ROUTES } from "./routes";
import homeIcon from "@/assets/svgs/Home.svg?raw";
import bagIcon from "@/assets/svgs/Bag.svg?raw";
import groupIcon from "@/assets/svgs/Group.svg?raw";
import inspirationIcon from "@/assets/svgs/Inspiration.svg?raw";

export const NAV_ITEMS = [
  { label: "Home", path: ROUTES.HOME, icon: homeIcon },
  { label: "Shop", path: ROUTES.SHOP, icon: bagIcon },
  { label: "Orders", path: ROUTES.ORDERS, icon: bagIcon },
  { label: "Inspiration", path: ROUTES.INSPIRATION, icon: inspirationIcon },
  { label: "About Us", path: ROUTES.ABOUT, icon: groupIcon },
];
