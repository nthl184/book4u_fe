// 📘 src/pages/Books.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Modal,
} from "react-bootstrap";
import {
  Search,
  ArrowUp,
  BookOpen,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import bookApi from "../api/bookApi";
import borrowApi from "../api/borrowApi";

function Books() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "guest";

  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "",
    img: "",
    description: "",
  });

  // === TOAST TÍM GRADIENT ===
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

  // ==========================
  // Fetch books
  // ==========================
  const fetchBooks = async () => {
    try {
      const params = {};

      if (searchTerm.trim()) params.keyword = searchTerm.trim();
      if (filterCategory && filterCategory !== "all")
        params.category = filterCategory.toLowerCase();

      const res = await bookApi.getAll(params);
      setBooksData(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, filterCategory]);

  const handleViewDetail = (id) => navigate(`/book/${id}`);

  // ==========================
  // Borrow
  // ==========================
  const handleBorrow = async (bookId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id || user?._id;

      if (!userId) {
        showToast("⚠️ Please log in before borrowing!");
        return;
      }

      await borrowApi.create(userId, bookId);
      showToast("📚 Borrow request sent! Waiting for admin approval.");
      fetchBooks();
    } catch (err) {
      const msg = err.response?.data?.message || "Borrow failed!";
      showToast(`❌ ${msg}`, "error");
    }
  };

  // ==========================
  // Admin CRUD
  // ==========================
  const handleOpenModal = (book = null) => {
    setEditMode(!!book);
    setBookForm(
      book || { title: "", author: "", category: "", img: "", description: "" }
    );
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await bookApi.update(bookForm.id, bookForm);
        showToast("📘 Book updated!");
      } else {
        await bookApi.create(bookForm);
        showToast("📘 New book added!");
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      console.error("❌ Save failed:", err);
      showToast("❌ Failed to save book!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this book?")) {
      try {
        await bookApi.delete(id);
        fetchBooks();
        showToast("🗑️ Book deleted");
      } catch (err) {
        console.error("❌ Delete failed:", err);
      }
    }
  };

  return (
    <div className="books-page">
      <div className="content-wrapper">
        <div className="search-container mb-4">
          <h3 className="fw-bold mb-3 text-gradient">Find Your Book</h3>

          <Row className="justify-content-center g-3 align-items-center">
            <Col md={7}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search color="#9b59b6" size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>

            <Col md={2}>
              <Form.Select
                className="rounded-pill"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All</option>
                <option value="programming">Programming</option>
                <option value="fiction">Fiction</option>
                <option value="romance">Romance</option>
                <option value="history">History</option>
                <option value="fantasy">Fantasy</option>
                <option value="science">Science</option>
                <option value="technology">Technology</option>
              </Form.Select>
            </Col>

            {role === "admin" && (
              <Col md="auto">
                <Button
                  className="btn-gradient rounded-pill px-4"
                  onClick={() => handleOpenModal()}
                >
                  <PlusCircle size={18} className="me-1" /> Add Book
                </Button>
              </Col>
            )}
          </Row>
        </div>

        {loading ? (
          <p className="text-center text-muted">Loading books...</p>
        ) : (
          <Row className="g-4 justify-content-center">
            {booksData.map((book) => (
              <Col key={book.id} xs={10} sm={6} md={4} lg={3}>
                <Card className="book-card h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={book.img || book.image}
                    alt={book.title}
                    className="book-img"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleViewDetail(book.id)}
                  />

                  <Card.Body>
                    <Card.Title className="fw-semibold">
                      {book.title}
                    </Card.Title>

                    <Card.Text className="text-muted mb-2">
                      {book.author}
                    </Card.Text>

                    <span className="badge bg-light text-primary border border-primary mb-2">
                      {book.category}
                    </span>

                    {role === "student" && (
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          className="btn-gradient rounded-pill px-3"
                          onClick={() => handleViewDetail(book.id)}
                        >
                          <BookOpen size={16} className="me-1" /> View
                        </Button>

                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="border-gradient rounded-pill px-3"
                          onClick={() => handleBorrow(book.id)}
                        >
                          Borrow
                        </Button>
                      </div>
                    )}

                    {role === "admin" && (
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="rounded-pill px-3"
                          onClick={() => handleOpenModal(book)}
                        >
                          <Edit size={16} className="me-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="rounded-pill px-3"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 size={16} className="me-1" /> Delete
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Button
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} />
      </Button>

      <Footer />

      {/* MODAL ADD / EDIT */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Book" : "Add New Book"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={bookForm.title}
                onChange={(e) =>
                  setBookForm({ ...bookForm, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={bookForm.author}
                onChange={(e) =>
                  setBookForm({ ...bookForm, author: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={bookForm.category || "programming"}
                onChange={(e) =>
                  setBookForm({
                    ...bookForm,
                    category: e.target.value.toLowerCase(),
                  })
                }
                className="rounded-pill"
              >
                <option value="programming">Programming</option>
                <option value="fiction">Fiction</option>
                <option value="romance">Romance</option>
                <option value="history">History</option>
                <option value="fantasy">Fantasy</option>
                <option value="science">Science</option>
                <option value="technology">Technology</option>
                <option value="others">Others</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={bookForm.img}
                onChange={(e) =>
                  setBookForm({ ...bookForm, img: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bookForm.description}
                onChange={(e) =>
                  setBookForm({ ...bookForm, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="btn-gradient" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Books;
