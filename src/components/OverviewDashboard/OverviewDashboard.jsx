import { useState } from "react";
import FinancialTracker from "../FinancialTracker/FinancialTracker";
import TransactionTable from "../TransactionTable/TransactionTable";
import BarGraph from "../BarGraph/BarGraph";
import "./OverviewDashboard.css";

const OverviewDashboard = () => {
  const [balanceAmount, setBalanceAmount] = useState(
    localStorage.getItem("balanceAmount")
      ? JSON.parse(localStorage.getItem("balanceAmount"))
      : 5000
  );

  const [expenseEntries, setExpenseEntries] = useState(
    localStorage.getItem("expenses")?.length > 0
      ? JSON.parse(localStorage.getItem("expenses"))
      : []
  );

  const updateExpenseList = (expenses) => {
    setExpenseEntries(expenses);
    const updatedBalance =
      localStorage.getItem("totalBalance") - calculateTotalExpenses();

    setBalanceAmount(updatedBalance);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  };

  const calculateTotalExpenses = () => {
    return expenseEntries.reduce(
      (total, expense) => total + parseInt(expense.amount, 10),
      0
    );
  };

  const expenseCategories = [
    "Food",
    "Entertainment",
    "Travel",
    "Shopping",
    "Grocery",
    "Others",
  ];

  return (
    <div className="dashboard-wrapper">
      <FinancialTracker
        updateExpenseList={updateExpenseList}
        expenseCategories={expenseCategories}
        expenseEntries={expenseEntries}
        setExpenseEntries={setExpenseEntries}
        computeTotalExpenses={calculateTotalExpenses}
        balanceAmount={balanceAmount}
        setBalanceAmount={setBalanceAmount}
      />
      {expenseEntries.length > 0 && (
        <div className="dashboard-info-section">
          <TransactionTable
            transactionData={expenseEntries}
            updateTransactionList={updateExpenseList}
            expenseCategories={expenseCategories}
          />
          <BarGraph data={expenseEntries} categories={expenseCategories} />
        </div>
      )}
    </div>
  );
};

export default OverviewDashboard;
