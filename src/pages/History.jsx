// 📘 src/pages/History.jsx
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookHistory")) || [];
    setHistory(saved);
  }, []);

  const handleView = (id) => navigate(`/book/${id}`);

  return (
    <div
      className="history-page"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f3e8ff 0%, #faf5ff 50%, #ffffff 100%)",
        padding: "4rem 1rem",
      }}
    >
      <div className="container">
        <h3 className="fw-bold text-gradient mb-4 text-center">
          Recently Viewed Books
        </h3>

        {history.length === 0 ? (
          <p className="text-center text-muted mt-5">
            You haven’t viewed any books yet 📖
          </p>
        ) : (
          <Row className="g-4 justify-content-center">
            {history.map((book) => (
              <Col key={book.id} xs={10} sm={6} md={4} lg={3}>
                <Card className="history-card h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={book.img}
                    alt={book.title}
                    className="history-img"
                    onClick={() => handleView(book.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {book.author || ""}
                    </Card.Text>

                    <div className="small text-secondary d-flex align-items-center justify-content-center gap-1 mb-1">
                      <Clock size={14} />
                      {book.lastVisited
                        ? new Date(book.lastVisited).toLocaleString()
                        : ""}
                    </div>

                    <div className="text-info small mb-2 fw-medium">
                      Start reading
                    </div>

                    <div className="text-center">
                      <Button
                        size="sm"
                        className="btn-gradient rounded-pill px-3"
                        onClick={() => handleView(book.id)}
                      >
                        <BookOpen size={15} className="me-1" /> Read Again
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default History;
