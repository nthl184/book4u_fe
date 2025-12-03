import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Books from "./pages/Books";
import BorrowManage from "./pages/BorrowManage";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import BookDetail from "./pages/BookDetail";
import BorrowStatus from "./pages/BorrowStatus";

function AppContent() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div
      style={{
        overflow: isLogin ? "hidden" : "auto",
        minHeight: "100vh",
        backgroundColor: isLogin ? "#faf5ff" : "transparent",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isLogin && <Navbar />}

      <main className={isLogin ? "" : "flex-grow-1 container-fluid px-0 py-4"}>
        <Routes>
          {/* ✅ Cả / và /home đều trỏ đến trang Home */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book/:id" element={<BookDetail />} />

          {/* Student only */}
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrow-status"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <BorrowStatus />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/borrow"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <BorrowManage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isLogin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
