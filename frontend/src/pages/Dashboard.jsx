
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../index.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [frequency, setFrequency] = useState("All Data");
  const [type, setType] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    type: "",
    date: "",
  });
  useEffect(() => {
    fetch("http://localhost:5000/dashboard")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dashboard Data:", data);
        setTransactions(data.transactions || []); // Backend कडून transactions मिळत असतील तर add करा
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  // 🟢 Load Transactions from LocalStorage
  useEffect(() => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);


  // Function to get filtered transactions
  const getFilteredTransactions = () => {
    const now = new Date();
    let filteredTransactions = [...transactions];

    console.log("Before filtering:", filteredTransactions);

    // Convert date string to Date object for accurate filtering
    filteredTransactions = filteredTransactions.map(transaction => ({
      ...transaction,
      dateObj: new Date(transaction.date) 
    }));

    // Apply frequency filter
    if (frequency !== "All Data") {
      if (frequency === "Last Week") {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.dateObj >= lastWeek
        );
      } else if (frequency === "Last Month") {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.dateObj >= lastMonth
        );
      } else if (frequency === "Last Year") {
        const lastYear = new Date();
        lastYear.setFullYear(now.getFullYear() - 1);
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.dateObj >= lastYear
        );
      }
    }

    // Apply type filter
    if (type !== "All") {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.type === type
      );
    }

    console.log("After filtering:", filteredTransactions);
    return filteredTransactions;
  };

  const handleReset = () => {
    setFrequency("All Data");
    setType("All");
  };

  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  //   navigate("/");
  // };
  const handleLogout = () => {
    localStorage.removeItem("token"); // Token delete kar
    setIsAuthenticated(false); // Authentication state false kar
    navigate("/"); // Login page la redirect kar
  };
  
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedTransactions = [...transactions];
      updatedTransactions[editIndex] = formData;
      setTransactions(updatedTransactions);
      setEditIndex(null);
    } else {
      setTransactions([...transactions, formData]);
    }
    setShowForm(false);
    setFormData({ title: "", amount: "", category: "", description: "", type: "", date: "" });
  };

  const handleEdit = (index) => {
    setFormData(transactions[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  return (
    <div className="dashboard-container">
      <h1>WELCOME TO</h1>
      <h1>PERSONAL FINANCE MANAGER</h1><br></br>
      <h3><u>Effortless Expense Tracking for a Brighter Future</u></h3>
      <br /><br></br>
      <div className="filter-options">
        <div className="filters">
          <label>Select Frequency:</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option>All </option>
            <option>Last Week</option>
            <option>Last Month</option>
            <option>Last Year</option>
          </select>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>All</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
          <button className="reset-btn" onClick={handleReset}>Reset Filter</button>
        </div>
        <button className="add-btn" onClick={() => { setShowForm(true); setEditIndex(null); }}>Add New</button>
        <button className="stats-btn" onClick={() => setShowGraph(!showGraph)}>Stats</button>
      </div>
      
      {showForm && (
        <div className="modal">
          <form onSubmit={handleFormSubmit}>
            <label>Title:<input type="text" name="title" value={formData.title} onChange={handleFormChange} required /></label>
            <label>Amount:<input type="number" name="amount" value={formData.amount} onChange={handleFormChange} required /></label>
            <label>Category:<input type="text" name="category" value={formData.category} onChange={handleFormChange} required /></label>
            <label>Description:<input type="text" name="description" value={formData.description} onChange={handleFormChange} /></label>
            <label>Transaction Type:<input type="text" name="type" value={formData.type} onChange={handleFormChange} required /></label>
            <label>Date:<input type="date" name="date" value={formData.date} onChange={handleFormChange} required /></label>
            <button type="submit">{editIndex !== null ? "Update" : "Submit"}</button>
            <button type="button" onClick={() => setShowForm(false)}>Close</button>
          </form>
        </div>
      )}
      
      {showGraph && (
        <div className="graph-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactions}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        <div className="info-boxes">
        <div className="info-box">Total Transactions: {getFilteredTransactions().length}</div>
        <div className="info-box">Total TurnOver: {getFilteredTransactions().reduce((acc, t) => acc + Number(t.amount), 0)}</div>
        <div className="info-box">Categorywise Income</div>
        <div className="info-box">Categorywise Expense</div>
      </div>
      </div>
      )}
      
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredTransactions().map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date}</td>
              <td>{transaction.title}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>{transaction.category}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <br></br>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default Dashboard;


