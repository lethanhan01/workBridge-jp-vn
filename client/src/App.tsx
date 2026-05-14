import { RouterProvider } from "react-router";
import { router } from "./routes/routes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./utils/contexts/AuthContext";
import { LanguageProvider } from "./utils/contexts/LanguageContext";



export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </LanguageProvider>
  );
}
