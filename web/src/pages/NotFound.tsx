
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout showSidebar={false}>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-8xl font-bold text-fantasy-primary opacity-20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl text-fantasy-light">Quest Not Found</p>
            </div>
          </div>

          <p className="text-muted-foreground max-w-md mx-auto">
            The ancient scrolls do not speak of this path. Perhaps your journey lies elsewhere in the realm.
          </p>

          <div className="pt-6">
            <Button>
              <Link to="/" className="flex items-center">
                <>
                  <Home className="mr-2 h-4 w-4" />
                  Return to the Main Hall
                </>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;
