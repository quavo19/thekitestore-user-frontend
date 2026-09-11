import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useUser } from "@/contexts/UserContext";
import { AUTH_REDIRECT_STORAGE_KEY } from "@/services";

export function GoogleAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeGoogleAuth } = useUser();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate(ROUTES.HOME, { replace: true });
      return;
    }

    completeGoogleAuth(token).finally(() => {
      const redirectTo = localStorage.getItem(AUTH_REDIRECT_STORAGE_KEY) || ROUTES.HOME;
      localStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
      navigate(redirectTo, { replace: true });
    });
  }, [completeGoogleAuth, navigate, searchParams]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium text-ink">Signing you in</p>
        <p className="mt-2 text-sm font-light text-hero-muted">
          Please wait while Google finishes authentication.
        </p>
      </div>
    </div>
  );
}
