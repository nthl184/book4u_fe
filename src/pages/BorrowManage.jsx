// 📘 src/pages/BorrowManage.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Badge,
  ButtonGroup,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import {
  Check,
  X,
  RefreshCcw,
  RotateCcw,
  Upload,
  Ban,
  Search,
  ArrowLeft,
  ArrowUp,
} from "lucide-react";

import Footer from "../components/Footer";
import borrowApi from "../api/borrowApi";

function BorrowManage() {
  const [borrowList, setBorrowList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch records
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await borrowApi.getAll();
        setBorrowList(res.data || []);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Toast
  const showToast = (msg) => {
    const div = document.createElement("div");
    div.innerText = msg;
    Object.assign(div.style, {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      padding: "12px 20px",
      background: "linear-gradient(90deg,#6f42c1,#9b59b6)",
      color: "white",
      borderRadius: "12px",
      fontWeight: "600",
      opacity: "0",
      transition: "0.3s",
      zIndex: "9999",
    });

    document.body.appendChild(div);
    setTimeout(() => (div.style.opacity = 1), 80);
    setTimeout(() => (div.style.opacity = 0), 2500);
    setTimeout(() => div.remove(), 3000);
  };

  /** ================================
   *   ACTION: REJECT
   *   ================================ */
  const handleReject = async (id) => {
    if (!window.confirm("Reject this request?")) return;

    try {
      const res = await borrowApi.reject(id);
      const updated = res.data;

      // FIX: Compare using string to avoid mismatch
      setBorrowList((prev) =>
        prev.map((i) => (i.id.toString() === id.toString() ? updated : i))
      );

      showToast("🚫 Rejected");
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  /** ================================
   *   ACTION: DELETE
   *   ================================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await borrowApi.delete(id);
      setBorrowList((prev) => prev.filter((i) => i.id !== id));
      showToast("🗑️ Deleted");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /** ================================
   *   FILTERING
   *   ================================ */
  const filteredList = borrowList.filter((b) => {
    const q = searchTerm.toLowerCase();

    return (
      (b.title?.toLowerCase().includes(q) ||
        b.borrowerName?.toLowerCase().includes(q) ||
        b.borrowerEmail?.toLowerCase().includes(q)) &&
      (filter === "All" || b.status === filter)
    );
  });

  const calcRemaining = (due) => {
    if (!due) return null;
    return Math.ceil((new Date(due) - new Date()) / 86400000);
  };

  const statusColor = (s) =>
    ({
      "Pending Approval": "secondary",
      Borrowing: "info",
      Returned: "success",
      Overdue: "danger",
      Rejected: "dark",
    }[s] || "light");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f3e8ff 0%,#faf5ff 50%,#fff 100%)",
        padding: "4rem 1rem",
        marginTop: "-20px",
      }}
    >
      <div className="container">
        {/* HEADER ROW */}
        <div
          className="d-flex justify-content-between align-items-center mb-4 flex-wrap"
          style={{ gap: "20px" }}
        >
          {/* BACK */}
          <Button
            variant="outline-secondary"
            className="rounded-pill border-gradient d-flex align-items-center gap-1"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} /> Back
          </Button>

          {/* SEARCH */}
          <InputGroup
            className="shadow-sm"
            style={{
              width: "500px",
              borderRadius: "50px",
              overflow: "hidden",
            }}
          >
            <InputGroup.Text className="bg-white border-end-0">
              <Search color="#9b59b6" size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by book or borrower..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>

        </div>

        {/* FILTER BUTTONS */}
        <div className="text-center mb-3">
          <ButtonGroup>
            {[
              "All",
              "Pending Approval",
              "Borrowing",
              "Returned",
              "Overdue",
              "Rejected",
            ].map((tab) => (
              <Button
                key={tab}
                variant={filter === tab ? "primary" : "outline-primary"}
                onClick={() => setFilter(tab)}
                className="rounded-pill px-3"
              >
                {tab}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-center text-muted">Loading...</p>
        ) : filteredList.length === 0 ? (
          <p className="text-center text-muted">No records found.</p>
        ) : (
          <Table bordered hover responsive className="align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Remaining</th>
                <th>Status</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.map((b, i) => {
                const remain = calcRemaining(b.dueDate);
                const overdue = remain < 0;
                const mssv = b.borrowerEmail?.split("@")[0] || "";

                return (
                  <tr key={b.id} className={overdue ? "table-danger" : ""}>
                    <td>{i + 1}</td>

                    <td>{b.title}</td>

                    <td>
                      <strong>{b.borrowerName}</strong>
                      <br />
                      <small className="text-muted">{mssv}</small>
                    </td>

                    <td>{b.borrowDate}</td>
                    <td>{b.dueDate}</td>

                    <td>
                      {remain == null ? (
                        "-"
                      ) : (
                        <Badge bg={overdue ? "danger" : "secondary"}>
                          {overdue
                            ? `Overdue ${Math.abs(remain)}d`
                            : `${remain} days`}
                        </Badge>
                      )}
                    </td>

                    <td>
                      <Badge bg={statusColor(b.status)}>{b.status}</Badge>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td style={{ background: "white" }}>
                      <div className="d-flex gap-2 justify-content-center">
                        {/* APPROVE */}
                        {b.status === "Pending Approval" && (
                          <OverlayTrigger overlay={<Tooltip>Approve</Tooltip>}>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                borrowApi.approve(b.id).then((res) => {
                                  setBorrowList((prev) =>
                                    prev.map((x) =>
                                      x.id === b.id ? res.data : x
                                    )
                                  );
                                  showToast("Approved");
                                })
                              }
                            >
                              <Check size={14} />
                            </Button>
                          </OverlayTrigger>
                        )}

                        {/* REJECT */}
                        {b.status === "Pending Approval" && (
                          <OverlayTrigger overlay={<Tooltip>Reject</Tooltip>}>
                            <Button
                              size="sm"
                              variant="outline-dark"
                              onClick={() => handleReject(b.id)}
                            >
                              <Ban size={14} />
                            </Button>
                          </OverlayTrigger>
                        )}

                        {/* EXTEND */}
                        {b.status === "Borrowing" && (
                          <OverlayTrigger
                            overlay={<Tooltip>Extend +7 days</Tooltip>}
                          >
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() =>
                                borrowApi.extend(b.id).then((res) => {
                                  setBorrowList((prev) =>
                                    prev.map((x) =>
                                      x.id === b.id ? res.data : x
                                    )
                                  );
                                  showToast("Extended");
                                })
                              }
                            >
                              <RefreshCcw size={14} />
                            </Button>
                          </OverlayTrigger>
                        )}

                        {/* RETURN */}
                        {b.status === "Borrowing" && (
                          <OverlayTrigger
                            overlay={<Tooltip>Mark Returned</Tooltip>}
                          >
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() =>
                                borrowApi.markReturned(b.id).then((res) => {
                                  setBorrowList((prev) =>
                                    prev.map((x) =>
                                      x.id === b.id ? res.data : x
                                    )
                                  );
                                  showToast("Returned");
                                })
                              }
                            >
                              <RotateCcw size={14} />
                            </Button>
                          </OverlayTrigger>
                        )}

                        {/* DELETE */}
                        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(b.id)}
                          >
                            <X size={14} />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <Button
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} />
      </Button>

      <Footer />
    </div>
  );
}

export default BorrowManage;
