import whatsappIcon from "@/assets/svgs/WhatsApp.svg?raw";
import { Icon } from "@/components/ui/Icon";
import { APP_NAME, ROUTES } from "@/constants";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Terms & Conditions", to: ROUTES.TERMS },
  { label: "Refund Policy", to: ROUTES.REFUND_POLICY },
  { label: "Privacy Policy", to: ROUTES.PRIVACY_POLICY },
];

const SOCIAL_LINKS = [
  {
    label: "WhatsApp: +2335013339",
    href: "https://wa.me/2335013339",
    icon: whatsappIcon,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="-mx-4 -mb-6 mt-10 bg-sidebar px-6 py-8 text-sidebar-muted sm:mt-12 lg:-mx-8 lg:-mb-8 lg:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-lg text-white">{APP_NAME}</p>
          <p className="mt-1 text-sm font-light">
            Beautiful plants. Expert care. Delivered to your door.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <nav
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-light"
            aria-label="Footer links"
          >
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-card transition-colors hover:bg-sidebar-active"
              >
                <Icon svg={item.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 border-t border-sidebar-active pt-5 text-xs font-light text-sidebar-muted/80">
        © {year} {APP_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
