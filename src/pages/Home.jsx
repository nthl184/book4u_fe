import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Card } from "react-bootstrap";
import {
  BookOpen,
  History,
  Library,
  Search,
  Users,
  Award,
  BookMarked,
} from "lucide-react";
import "../App.css";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "guest";

  const handlePrimary = () => {
    if (role === "student") navigate("/books");
    else if (role === "admin") navigate("/borrow");
    else navigate("/login");
  };

  const handleSecondary = () => {
    if (role === "student") navigate("/history");
    else if (role === "admin") navigate("/books");
    else navigate("/login");
  };

  return (
    <div className="home-page text-center">
      {/* === HERO SECTION === */}
      <section className="hero-section">
        <div className="home-logo mx-auto mb-3">
          <Library size={70} color="#6f42c1" />
        </div>

        <h1 className="fw-bold text-gradient mb-2">
          Welcome to Book4U Library
        </h1>
        <p className="text-muted mb-4">
          Discover, borrow, and enjoy your favorite books anytime, anywhere.
        </p>

        {/* === Buttons Section === */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          {/* Nút chính — tùy theo role */}
          <Button
            onClick={handlePrimary}
            className="btn-gradient px-4 py-2 rounded-pill fw-semibold"
          >
            {role === "admin" ? (
              <>
                <Library size={18} className="me-2" /> Manage Borrow
              </>
            ) : (
              <>
                <BookOpen size={18} className="me-2" /> Explore Books
              </>
            )}
          </Button>

          {/* Nút phụ — student / admin */}
          {role === "student" && (
            <Button
              variant="outline-primary"
              onClick={handleSecondary}
              className="px-4 py-2 rounded-pill border-gradient fw-semibold"
            >
              <History size={18} className="me-2" /> View History
            </Button>
          )}
          {role === "admin" && (
            <Button
              variant="outline-primary"
              onClick={handleSecondary}
              className="px-4 py-2 rounded-pill border-gradient fw-semibold"
            >
              <BookMarked size={18} className="me-2" /> Manage Books
            </Button>
          )}
        </div>
      </section>

      {/* === FEATURE SECTION === */}
      <div className="mt-5 feature-section container-fluid px-5">
        <h3 className="fw-bold text-gradient mb-4">Why Choose Book4U?</h3>
        <p
          className="text-muted mb-5"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          Book4U isn’t just a library — it’s your personal study companion. We
          combine smart search, community learning, and rewards to make reading
          more inspiring.
        </p>

        <Row className="g-4 justify-content-center">
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Search size={30} color="#6f42c1" />
                <h5 className="fw-bold mt-3">Smart Search</h5>
                <p className="text-muted small">
                  Quickly find books by title, author, or category with our
                  powerful search engine.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Users size={30} color="#6f42c1" />
                <h5 className="fw-bold mt-3">Community Learning</h5>
                <p className="text-muted small">
                  Connect with fellow students and share your favorite reads and
                  insights.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Award size={30} color="#6f42c1" />
                <h5 className="fw-bold mt-3">Achievement System</h5>
                <p className="text-muted small">
                  Earn badges for consistent reading and engagement in the
                  Book4U system.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
