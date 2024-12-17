import { useState, useEffect } from "react";
import Modal from "react-modal";
import "./FinancialTracker.css";
import PieVisualization from "../PieVisualization/PieVisualization";
import { v4 as uuidv4 } from "uuid";

Modal.setAppElement("#root");

const FinancialTracker = ({
  updateExpenseList,
  expenseCategories,
  expenseEntries,
  setExpenseEntries,
  computeTotalExpenses,
  balanceAmount,
  setBalanceAmount,
}) => {
  const [isExpenseModalVisible, setExpenseModalVisibility] = useState(false);
  const [isIncomeModalVisible, setIncomeModalVisibility] = useState(false);
  const [expenseData, setExpenseData] = useState({
    id: null,
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [incomeData, setIncomeData] = useState("");

  const handleChange = (e, isIncome = true) => {
    const { name, value } = e.target;
    if (isIncome) {
      setExpenseData((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setIncomeData(value);
    }
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (balanceAmount < expenseData.amount) {
      return alert("Cannot add expense, insufficient balance.");
    }
    expenseData.id = uuidv4();

    const updatedBalance = balanceAmount - expenseData.amount;
    setBalanceAmount(updatedBalance);
    localStorage.setItem("balanceAmount", JSON.stringify(updatedBalance));
    localStorage.setItem(
      "expenses",
      JSON.stringify([...expenseEntries, expenseData])
    );

    setExpenseEntries((prevExpenses) => [...prevExpenses, expenseData]);
    setExpenseModalVisibility(false);
    setExpenseData({
      id: null,
      title: "",
      amount: "",
      category: "",
      date: "",
    });
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!isNaN(incomeData) && incomeData.trim() !== "") {
      const updatedBalance = balanceAmount + parseInt(incomeData, 10);
      setBalanceAmount(updatedBalance);
      localStorage.setItem("totalBalance", JSON.stringify(updatedBalance));
      setIncomeModalVisibility(false);
      setIncomeData("");
    }
  };

  useEffect(() => {
    updateExpenseList(expenseEntries);
  }, [expenseEntries, updateExpenseList]);

  useEffect(() => {
    if (!localStorage.getItem("totalBalance")) {
      localStorage.setItem("totalBalance", JSON.stringify(5000));
    }
  }, []);

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

  return (
    <div className="financial-container glass-effect">
      <div className="financial-summary-container">
        <div className="financial-card glass-effect">
          <h2>
            Current Balance:{" "}
            <span className="balance-display"> ₹{balanceAmount} </span>
          </h2>
          <button
            className="glass-effect"
            onClick={() => setIncomeModalVisibility(true)}
          >
            + Add Income
          </button>
        </div>
        <div className="financial-card glass-effect">
          <h2>
            Total Expenses:{" "}
            <span className="expenses-display">
              {" "}
              ₹{computeTotalExpenses()}{" "}
            </span>
          </h2>
          <button
            className="glass-effect"
            onClick={() => setExpenseModalVisibility(true)}
          >
            + Add Expense
          </button>
        </div>
      </div>
      <PieVisualization data={expenseEntries} />

      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalVisible}
        onRequestClose={() => setIncomeModalVisibility(false)}
        style={customModalStyle}
        contentLabel="Add New Income"
      >
        <h2 className="modal-title">Add New Income</h2>
        <form className="income-form" onSubmit={handleAddIncome}>
          <input
            className="glass-effect-input"
            name="income"
            placeholder="Income Amount"
            type="number"
            value={incomeData}
            onChange={(e) => handleChange(e, false)}
            required
          />
          <div>
            <button className="glass-effect-button" type="submit">
              Add Income
            </button>
            <button
              className="glass-effect-button"
              type="button"
              onClick={() => setIncomeModalVisibility(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseModalVisible}
        onRequestClose={() => setExpenseModalVisibility(false)}
        style={customModalStyle}
        contentLabel="Add New Expense"
      >
        <h2 className="modal-title">Add New Expense</h2>
        <form className="expense-form" onSubmit={handleAddExpense}>
          <input
            name="title"
            placeholder="Title"
            value={expenseData.title}
            onChange={handleChange}
            required
          />

          <input
            name="amount"
            placeholder="Amount"
            type="number"
            value={expenseData.amount}
            onChange={handleChange}
            required
          />
          <select
            className="category-select"
            name="category"
            value={expenseData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>{" "}
            {expenseCategories.map((category, i) => (
              <option key={i} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            name="date"
            placeholder="Date"
            type="date"
            value={expenseData.date}
            onChange={handleChange}
            required
          />
          <div>
            <button className="glass-effect-button" type="submit">
              Add Expense
            </button>
            <button
              className="glass-effect-button"
              type="button"
              onClick={() => setExpenseModalVisibility(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FinancialTracker;
