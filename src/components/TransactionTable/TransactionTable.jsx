import React, { useState } from "react";
import Modal from "react-modal";
import {
  FaUtensils,
  FaFilm,
  FaPlane,
  FaShoppingCart,
  FaShoppingBasket,
  FaEllipsisH,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "./TransactionTable.css";

Modal.setAppElement("#root");

const categoryIcons = {
  Food: <FaUtensils />,
  Entertainment: <FaFilm />,
  Travel: <FaPlane />,
  Shopping: <FaShoppingCart />,
  Grocery: <FaShoppingBasket />,
  Others: <FaEllipsisH />,
};

const customModalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "500px",
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },
};

const TransactionTable = ({
  transactionData,
  updateTransactionList,
  expenseCategories,
}) => {
  const [isModalVisible, setModalVisibility] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const totalPages = Math.ceil(transactionData.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransaction((prevState) => ({ ...prevState, [name]: value }));
  };

  const getPageNumbers = () => {
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 2, totalPages);
    if (currentPage > totalPages - 2) {
      start = Math.max(totalPages - 2, 1);
      end = totalPages;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const changePage = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const currentItems = transactionData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderCategoryIcon = (category) => {
    return categoryIcons[category] || <FaEllipsisH />;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openModal = (transaction) => {
    setModalVisibility(true);
    setCurrentTransaction(transaction);
  };

  const closeModal = () => {
    setModalVisibility(false);
    setCurrentTransaction({
      title: "",
      amount: "",
      category: "",
      date: "",
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setModalVisibility(false);
  };

  const handleDelete = (id) => {
    const updatedTransactions = transactionData.filter((txn) => txn.id !== id);
    updateTransactionList(updatedTransactions);
  };

  const editTransaction = (e) => {
    e.preventDefault();
    const txnIndex = transactionData.findIndex(
      (txn) => txn.id === currentTransaction.id
    );
    const updatedTransactions = [...transactionData];
    if (txnIndex !== -1) {
      updatedTransactions[txnIndex] = {
        ...updatedTransactions[txnIndex],
        ...currentTransaction,
      };
      updateTransactionList(updatedTransactions);
      setModalVisibility(false);
    } else {
      console.log("Transaction not found");
    }
  };

  return (
    <>
      <div className="transaction-container">
        <h2>Recent Transactions & Top Expenses</h2>
        <br />
        <div className="transaction-table-container">
          {currentItems.map((item, index) => (
            <div className="transaction-row" key={index}>
              <div className="transaction-row-icon-title">
                <div className="transaction-icon">
                  {React.cloneElement(renderCategoryIcon(item.category), {
                    className: "transaction-category-icon",
                  })}
                </div>
                <div className="transaction-title-date">
                  <div className="transaction-title">{item.title}</div>
                  <div className="transaction-date">
                    {formatDate(item.date)}
                  </div>
                </div>
              </div>
              <div className="transaction-amount-actions">
                <div className="transaction-amount">
                  ₹{parseInt(item.amount, 10).toLocaleString()}
                </div>
                <button
                  className="action-button edit-button"
                  onClick={() => openModal(item)}
                >
                  <FaEdit />
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          <div className="pagination-controls">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              &laquo;
            </button>
            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => changePage(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={isModalVisible}
        onRequestClose={() => setModalVisibility(false)}
        style={customModalStyle}
        contentLabel="Edit Transaction"
      >
        <h2 className="modal-title">Edit Transaction</h2>
        <form className="expense-form" onSubmit={editTransaction}>
          <input
            name="title"
            placeholder="Title"
            value={currentTransaction.title}
            onChange={handleInputChange}
            required
          />

          <input
            name="amount"
            placeholder="Amount"
            type="number"
            value={currentTransaction.amount}
            onChange={handleInputChange}
            required
          />
          <select
            className="category-select"
            name="category"
            value={currentTransaction.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>{" "}
            {expenseCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            name="date"
            placeholder="Date"
            type="date"
            value={currentTransaction.date}
            onChange={handleInputChange}
            required
          />
          <div>
            <button className="glass-effect-button" type="submit">
              Save
            </button>
            <button
              className="glass-effect-button"
              type="button"
              onClick={() => setModalVisibility(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TransactionTable;
