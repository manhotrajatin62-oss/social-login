import { Route, Routes } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
              <Home />
            // <ProtectedRoute>
            // </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/login"
          element={
              <LoginPage />
            // <PublicRoute>
            // </PublicRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
