import { ROUTES } from "@/constants";
import { MainLayout } from "@/layouts/MainLayout";
import { AboutPage } from "@/pages/AboutPage";
import { HomePage } from "@/pages/HomePage";
import { GoogleAuthCallbackPage } from "@/pages/GoogleAuthCallbackPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { InspirationPage } from "@/pages/InspirationPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ShopPage } from "@/pages/ShopPage";
import {
  PrivacyPolicyPage,
  RefundPolicyPage,
  TermsAndConditionsPage,
} from "@/pages/LegalPages";

export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.SHOP, element: <ShopPage /> },
      { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetailPage /> },
      { path: ROUTES.INSPIRATION, element: <InspirationPage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: ROUTES.PROFILE, element: <ProfilePage /> },
      { path: ROUTES.ORDERS, element: <OrdersPage /> },
      { path: ROUTES.ORDER_DETAIL, element: <OrderDetailPage /> },
      { path: ROUTES.CHECKOUT, element: <CheckoutPage /> },
      { path: ROUTES.PAYMENT_CALLBACK, element: <CheckoutPage /> },
      { path: ROUTES.TERMS, element: <TermsAndConditionsPage /> },
      { path: ROUTES.REFUND_POLICY, element: <RefundPolicyPage /> },
      { path: ROUTES.PRIVACY_POLICY, element: <PrivacyPolicyPage /> },
      { path: ROUTES.GOOGLE_AUTH_CALLBACK, element: <GoogleAuthCallbackPage /> },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
];
