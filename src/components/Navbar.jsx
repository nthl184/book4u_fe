import { Link, useLocation, useNavigate } from "react-router-dom";
import { Image, Dropdown } from "react-bootstrap";
import { BookOpen, LogOut, UserCog } from "lucide-react";
import "../App.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "guest";
  const userName = user?.name || (role === "admin" ? "Admin" : "Guest");
  const userEmail = user?.email || "Not logged in";

  const isActive = (path) =>
    currentPath === path ? "nav-link active-link" : "nav-link";

  const handleLogout = () => {
    // Chỉ xóa dữ liệu liên quan đến login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav
      className="book4u-navbar d-flex align-items-center justify-content-between px-4 py-2"
      style={{
        background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        height: "64px",
      }}
    >
      {/* === LEFT: LOGO === */}
      <Link
        to="/"
        className="navbar-brand d-flex align-items-center gap-2 text-white fw-semibold"
        style={{ textDecoration: "none" }}
      >
        <BookOpen size={30} color="#fff" strokeWidth={2.2} />
        <span>Book4U</span>
      </Link>

      {/* === RIGHT: MENU + PROFILE === */}
      <div className="d-flex align-items-center gap-4">
        {/* === Menu links aligned right === */}
        <div className="d-flex align-items-center gap-4 me-3">
          <Link to="/books" className={isActive("/books")}>
            Books
          </Link>

          {role === "student" && (
            <>
              <Link to="/history" className={isActive("/history")}>
                History
              </Link>
              <Link to="/borrow-status" className={isActive("/borrow-status")}>
                My Borrow
              </Link>
            </>
          )}

          {role === "admin" && (
            <Link to="/borrow" className={isActive("/borrow")}>
              Borrow List
            </Link>
          )}
        </div>

        {/* === Dropdown profile fixed to right corner === */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="outline-light"
            id="user-dropdown"
            className="d-flex align-items-center gap-2 rounded-pill px-3 fw-semibold"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <Image
              src={
                role === "admin"
                  ? "https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
                  : "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
              }
              alt="avatar"
              roundedCircle
              style={{ width: "32px", height: "32px", objectFit: "cover" }}
            />
            <span>{userName}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="shadow border-0 mt-2"
            style={{
              borderRadius: "16px",
              minWidth: "230px",
              padding: "10px 0",
            }}
          >
            <div className="px-3 py-2 border-bottom">
              <h6 className="fw-bold mb-0">{userName}</h6>
              <small className="text-muted d-block">{userEmail}</small>
              <span
                className={`badge mt-1 ${
                  role === "admin" ? "bg-danger" : "bg-primary"
                }`}
              >
                {role.toUpperCase()}
              </span>
            </div>

            <Dropdown.Divider />

            <Dropdown.Item
              onClick={handleLogout}
              className="d-flex align-items-center gap-2 text-danger fw-semibold py-2 px-3"
            >
              <LogOut size={16} /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
}
