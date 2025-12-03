// 📘 src/pages/BookDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spinner, Row, Col, Badge } from "react-bootstrap";
import { ArrowLeft, Bookmark } from "lucide-react";
import Footer from "../components/Footer";
import bookApi from "../api/bookApi";
import borrowApi from "../api/borrowApi";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // === Toast tím ===
  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.innerText = msg;

    Object.assign(toast.style, {
      position: "fixed",
      top: "25px",
      right: "25px",
      background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      opacity: "0",
      transform: "translateY(-10px)",
      transition: "all 0.4s ease",
      zIndex: "9999",
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 30);

    setTimeout(() => {
      toast.style.opacity = "0";
    }, 2500);

    setTimeout(() => toast.remove(), 3000);
  };

  // === Fetch book detail ===
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await bookApi.getById(id);
        setBook(res.data);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  // === Save history ===
  useEffect(() => {
    if (book) {
      const history = JSON.parse(localStorage.getItem("bookHistory")) || [];

      const newEntry = {
        id: book.id,
        title: book.title,
        author: book.author,
        img: book.img || book.image,
        category: book.category,
        lastVisited: new Date().toISOString(),
      };

      const filtered = history.filter((b) => b.id !== book.id);
      filtered.unshift(newEntry);

      localStorage.setItem("bookHistory", JSON.stringify(filtered));
    }
  }, [book]);

  // === FETCH RELATED with fallback ===
  useEffect(() => {
    const fetchRelated = async () => {
      if (!book?.category) return;
      try {
        const res = await bookApi.getAll();
        const allBooks = res.data || [];

        // Ưu tiên sách cùng category
        let related = allBooks.filter(
          (b) => b.category === book.category && b.id !== book.id
        );

        // Nếu ít hơn 3 thì bổ sung sách khác
        if (related.length < 3) {
          const extra = allBooks
            .filter((b) => b.id !== book.id && b.category !== book.category)
            .slice(0, 3 - related.length);

          related = [...related, ...extra];
        }

        // Chỉ lấy tối đa 3
        setRelatedBooks(related.slice(0, 3));
      } catch (err) {
        console.error(" Related load failed:", err);
      }
    };
    fetchRelated();
  }, [book]);

  // Borrow
  const handleBorrow = async () => {
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || user?.id;

    if (role !== "student")
      return showToast("⚠️ Only students can borrow books!");

    if (!userId) return showToast("⚠️ Please log in before borrowing!");

    try {
      await borrowApi.create(userId, id);
      showToast("📚 Borrow request sent!");
    } catch (err) {
      const msg = err.response?.data?.message || "Borrow failed!";
      showToast(`❌ ${msg}`);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" /> Loading book...
      </div>
    );

  if (!book)
    return <h3 className="text-center mt-5 text-danger">Book not found!</h3>;

  return (
    <div
      className="book-detail-page d-flex flex-column align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f3e8ff 0%,#faf5ff 50%,#ffffff 100%)",
        padding: "4rem 1rem",
        marginTop: "-20px",
      }}
    >
      <div className="container" style={{ maxWidth: "900px" }}>
        <Button
          variant="outline-secondary"
          className="rounded-pill mb-4 border-gradient"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="me-1" /> Back
        </Button>

        <Card className="shadow-sm p-3 rounded-4 mb-5">
          <div className="text-center mb-4">
            <img
              src={book.img || book.image}
              alt={book.title}
              className="rounded shadow"
              style={{ height: "320px", objectFit: "cover" }}
            />
          </div>

          <h2 className="fw-bold text-gradient">{book.title}</h2>
          <p className="text-muted">{book.author}</p>

          <Badge
            bg="light"
            text="primary"
            className="border border-primary mb-3"
          >
            {book.category}
          </Badge>

          {/* === Preview === */}
          <div className="preview-box bg-light-subtle p-3 rounded mt-3">
            <h5 className="fw-semibold mb-2">📖 Preview</h5>

            <p style={{ whiteSpace: "pre-line" }}>
              {showFullPreview
                ? book.description || book.intro || "No preview available."
                : (
                    book.description ||
                    book.intro ||
                    "No preview available."
                  ).slice(0, 350) +
                  ((book.description || book.intro)?.length > 350 ? "..." : "")}
            </p>

            {(book.description || book.intro)?.length > 350 && (
              <button
                className="btn btn-link p-0 mt-1"
                style={{
                  color: "#9b59b6",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                onClick={() => setShowFullPreview(!showFullPreview)}
              >
                {showFullPreview ? "▲ Collapse" : "▼ Read More"}
              </button>
            )}
          </div>

          {/* Borrow btn */}
          <div className="text-center mt-4">
            <Button
              className="btn-gradient rounded-pill px-4"
              onClick={handleBorrow}
            >
              <Bookmark size={18} className="me-1" /> Borrow This Book
            </Button>
          </div>
        </Card>

        {/* === Related Books === */}
        {relatedBooks.length > 0 && (
          <div>
            <h4 className="fw-bold text-gradient text-center mb-4">
              📚 Related Books
            </h4>

            <Row className="g-3 justify-content-center">
              {relatedBooks.map((b) => (
                <Col key={b.id} sm={6} md={4}>
                  <Card
                    className="shadow-sm border-0 book-card"
                    onClick={() => navigate(`/book/${b.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Img
                      src={b.img || b.image}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <h6 className="fw-semibold">{b.title}</h6>
                      <p className="text-muted small">{b.author}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default BookDetail;
