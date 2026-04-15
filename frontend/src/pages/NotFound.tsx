import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    const timeout = window.setTimeout(() => {
      navigate("/");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found.</p>
        <p className="mb-6 text-sm text-muted-foreground">
          Redirecting you to the homepage...
        </p>
        <button
          onClick={() => navigate("/")}
          className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to Home Now
        </button>
      </div>
    </div>
  );
};

export default NotFound;
