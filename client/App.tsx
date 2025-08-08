import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@shared/stack";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import AuthSignIn from "./pages/auth/SignIn";
import AuthSignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <StackProvider app={stackClientApp}>
        <StackTheme>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              
              {/* Auth routes */}
              <Route path="/auth/signin" element={<AuthSignIn />} />
              <Route path="/auth/signup" element={<AuthSignUp />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor/:projectId" element={<Editor />} />
              <Route path="/editor/:projectId/:pageId" element={<Editor />} />
              
              {/* Placeholder routes for future features */}
              <Route path="/templates" element={<PlaceholderPage title="Templates" description="Browse and use pre-built templates" />} />
              <Route path="/components" element={<PlaceholderPage title="Components" description="Manage your component library" />} />
              <Route path="/assets" element={<PlaceholderPage title="Assets" description="Upload and manage media assets" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" description="Manage your account and billing" />} />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </StackTheme>
      </StackProvider>
    </ThemeProvider>
  );
}

export default App;
