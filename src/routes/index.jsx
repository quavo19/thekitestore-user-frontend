import { ROUTES } from "@/constants";
import { MainLayout } from "@/layouts/MainLayout";
import { AboutPage } from "@/pages/AboutPage";
import { HomePage } from "@/pages/HomePage";
import { InspirationPage } from "@/pages/InspirationPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ShopPage } from "@/pages/ShopPage";

export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.SHOP, element: <ShopPage /> },
      { path: ROUTES.INSPIRATION, element: <InspirationPage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
];
