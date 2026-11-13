import { Link } from "react-router-dom";
import { categoryHref } from "@/constants/catalog";
export function InspirationPage() {
  return <section className="store-home"><div className="section-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h1 className="mt-3 text-4xl font-semibold tracking-tight">A setup for every day.</h1></div></div><section className="setup-story"><img src="/images/connected-workspace.jpg" alt="Laptop and wireless earbuds on a wooden desk" /><div><span className="eyebrow">WORK, PLAY, CREATE</span><h2>Start with your<br />next big idea.</h2><p>Explore Macs, displays and input accessories for your workspace. Add audio for a little focus, and a charger to keep it all going.</p><Link to={categoryHref("desktops-displays")} className="store-button">Explore desktops & displays ↗</Link></div></section></section>;
}
