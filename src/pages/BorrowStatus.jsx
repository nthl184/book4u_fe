import React, { useEffect, useState } from "react";
import { Table, Badge } from "react-bootstrap";
import Footer from "../components/Footer";
import borrowApi from "../api/borrowApi";

function BorrowStatus() {
  const [borrowList, setBorrowList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student borrow list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await borrowApi.getByStudent();

        // 🔥 FIX QUAN TRỌNG: phải dùng res.data
        setBorrowList(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching borrow status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calcRemainingDays = (dueDate) => {
    const diff = Math.ceil(
      (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f3e8ff 0%, #faf5ff 50%, #ffffff 100%)",
        padding: "4rem 1rem",
        marginTop: "-20px",
      }}
    >
      <div className="container">
        <h3 className="fw-bold text-gradient mb-4 text-center">
          My Borrowed Books
        </h3>

        {loading ? (
          <p className="text-center text-muted">Loading borrow status...</p>
        ) : borrowList.length === 0 ? (
          <p className="text-center text-muted">
            You haven't borrowed any books yet.
          </p>
        ) : (
          <Table
            bordered
            hover
            responsive
            className="table-book4u align-middle"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Extended</th>
              </tr>
            </thead>
            <tbody>
              {borrowList.map((book, index) => {
                const remaining = calcRemainingDays(book.dueDate);
                const color =
                  remaining < 0
                    ? "danger"
                    : remaining <= 3
                    ? "warning"
                    : "secondary";

                return (
                  <tr key={book.id}>
                    <td>{index + 1}</td>
                    <td>{book.title}</td>
                    <td>{book.borrowDate}</td>
                    <td>{book.dueDate}</td>
                    <td>
                      <Badge bg={color}>
                        {remaining < 0
                          ? `Overdue ${Math.abs(remaining)}d`
                          : `${remaining} days left`}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg={
                          book.status === "Borrowing"
                            ? "info"
                            : book.status === "Returned"
                            ? "success"
                            : book.status === "Overdue"
                            ? "danger"
                            : "secondary"
                        }
                      >
                        {book.status}
                      </Badge>
                    </td>
                    <td>
                      {book.extendedDays ? `${book.extendedDays} days` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default BorrowStatus;
