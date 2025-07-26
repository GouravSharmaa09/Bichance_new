import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

// Public Pages
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import HelpPage from "./pages/HelpPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ContactUsPage from "./pages/ContactUsPage";

// Auth Pages
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// User Pages
import Dashboard from "./pages/Dashboard";
import DinnersPage from "./pages/DinnersPage";
import DinnerDetailsPage from "./pages/DinnerDetailsPage";
import MatchesPage from "./pages/MatchesPage";
import BookingsPage from "./pages/BookingsPage";
import SettingsPage from "./pages/SettingsPage";
import UserProfile from "./pages/UserProfile";
import OnboardingPage from "./pages/OnboardingPage";
import WelcomePage from "./pages/WelcomePage";
import SignInPage from "./pages/SignInPage";

// Admin Pages
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminDinnersPage from "./pages/AdminDinnersPage";
import AdminRestaurantsPage from "./pages/AdminRestaurantsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

// Misc Pages
import RegistrationSuccessPage from "./pages/RegistrationSuccessPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import NotFoundPage from "./pages/NotFoundPage";
import { RedirectIfAuthenticated } from "./routes/RedirectIfAuthenticated";
import { PrivateRoute } from "./routes/PrivateRoute";
import { AdminRoute } from "./routes/AdminRoutes";
import { AdminPanel } from "./components";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route
              path="/subscription/success"
              element={
                <PrivateRoute>
                  <SubscriptionSuccess />
                </PrivateRoute>
              }
            />
            <Route
              path="/subscription/cancel"
              element={
                <PrivateRoute>
                  <SubscriptionCancel />
                </PrivateRoute>
              }
            />
            {/* <Route path="/signin" element={<SignInPage />} /> */}

            {/* Auth Routes */}
            <Route
              path="/auth"
              element={
                <RedirectIfAuthenticated>
                  <AuthPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dinners"
              element={
                <PrivateRoute>
                  <DinnersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dinners/:id"
              element={
                <PrivateRoute>
                  <DinnerDetailsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/matches"
              element={
                <PrivateRoute>
                  <MatchesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <BookingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <PrivateRoute>
                  <OnboardingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/welcome"
              element={
                <PrivateRoute>
                  <WelcomePage />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dinners"
              element={
                <AdminRoute>
                  <AdminDinnersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/restaurants"
              element={
                <AdminRoute>
                  <AdminRestaurantsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalyticsPage />
                </AdminRoute>
              }
            />

            {/* Misc */}
            <Route
              path="/registration-success"
              element={<RegistrationSuccessPage />}
            />
            <Route
              path="/email-verification"
              element={<EmailVerificationPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
