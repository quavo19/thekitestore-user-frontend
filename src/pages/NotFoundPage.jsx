import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";

export function NotFoundPage() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
      <Link to={ROUTES.HOME}>
        <Button>Go Home</Button>
      </Link>
    </section>
  );
}
