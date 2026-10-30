
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard, Wallet, TrendingUp, TrendingDown,
  Plus, Search, Bell, ArrowUpRight, ArrowDownRight,
  Utensils, Car, ShoppingBag, Receipt, HeartPulse,
  GraduationCap, Clapperboard, MoreHorizontal, Trash2,
  Pencil, X, CalendarDays
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from "recharts";
import "./App.css";

const API = "http://localhost:5000/api/expenses";

const categories = [
  "Food", "Travel", "Shopping", "Bills",
  "Health", "Education", "Entertainment", "Other"
];

const icons = {
  Food: Utensils,
  Travel: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Health: HeartPulse,
  Education: GraduationCap,
  Entertainment: Clapperboard,
  Other: MoreHorizontal
};

const colors = [
  "#7868e6", "#32b8a5", "#f4a261", "#e76f8a",
  "#5b9bd5", "#9b7ede", "#e8b84c", "#8492a6"
];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "Expense",
    date: new Date().toISOString().slice(0, 10),
    description: ""
  });

  const loadExpenses = async () => {
    try {
      const response = await axios.get(API);
      setExpenses(response.data);
      setError("");
    } catch {
      setError("Unable to load expenses. Check whether backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    axios.get(API)
      .then(response => {
        if (!active) return;
        setExpenses(response.data);
        setError("");
      })
      .catch(() => {
        if (active) {
          setError("Unable to load expenses. Check whether backend is running.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totals = useMemo(() => {
    const income = expenses
      .filter(item => item.type === "Income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const spent = expenses
      .filter(item => item.type === "Expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return { income, spent, balance: income - spent };
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || item.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [expenses, search, filter]);

  const categoryData = useMemo(() => {
    return categories.map((category, index) => ({
      name: category,
      value: expenses
        .filter(item => item.category === category && item.type === "Expense")
        .reduce((sum, item) => sum + Number(item.amount), 0),
      color: colors[index]
    })).filter(item => item.value > 0);
  }, [expenses]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: "",
      amount: "",
      category: "Food",
      type: "Expense",
      date: new Date().toISOString().slice(0, 10),
      description: ""
    });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      amount: item.amount,
      category: item.category,
      type: item.type,
      date: item.date.slice(0, 10),
      description: item.description || ""
    });
    setModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = { ...form, amount: Number(form.amount) };

      if (editing) {
        await axios.put(`${API}/${editing._id}`, payload);
      } else {
        await axios.post(API, payload);
      }

      setModal(false);
      await loadExpenses();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to save transaction.");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      await loadExpenses();
    } catch {
      setError("Unable to delete transaction.");
    }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Wallet size={22} /></div>
          <span>Finora<span className="brand-dot">.</span></span>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <button className="nav-item active">
          <LayoutDashboard size={19} /> Dashboard
        </button>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>My Workspace</strong>
              <small>Personal Account</small>
            </div>
          </div>
          <p className="sidebar-footer">Finora © 2026</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Dashboard</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <button className="add-button" onClick={openAdd}>
              <Plus size={18} /> Add Transaction
            </button>
          </div>
        </header>

        <section className="welcome-row">
          <div>
            <h2>Welcome back! 👋</h2>
            <p>Here's what's happening with your finances.</p>
          </div>
          <div className="date-chip">
            <CalendarDays size={16} />
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </div>
        </section>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError("")}><X size={16} /></button>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Balance</span>
              <div className="stat-icon purple"><Wallet size={19} /></div>
            </div>
            <h2>{formatMoney(totals.balance)}</h2>
            <p className="stat-note">Your available balance</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Income</span>
              <div className="stat-icon green"><TrendingUp size={19} /></div>
            </div>
            <h2>{formatMoney(totals.income)}</h2>
            <p className="stat-note positive"><ArrowUpRight size={15} /> Money received</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Expenses</span>
              <div className="stat-icon orange"><TrendingDown size={19} /></div>
            </div>
            <h2>{formatMoney(totals.spent)}</h2>
            <p className="stat-note negative"><ArrowDownRight size={15} /> Money spent</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel transactions-panel">
            <div className="panel-heading">
              <div>
                <h3>Recent Transactions</h3>
                <p>Manage your income and expenses</p>
              </div>
              <button className="text-button" onClick={openAdd}>
                <Plus size={16} /> Add New
              </button>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={17} />
                <input
                  placeholder="Search transactions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option>All</option>
                <option>Income</option>
                <option>Expense</option>
              </select>
            </div>

            <div className="transaction-list">
              {loading ? (
                <p className="empty-state">Loading transactions...</p>
              ) : filteredExpenses.length === 0 ? (
                <p className="empty-state">No transactions found. Add your first transaction!</p>
              ) : filteredExpenses.map(item => {
                const Icon = icons[item.category] || MoreHorizontal;
                return (
                  <div className="transaction-row" key={item._id}>
                    <div className={`transaction-icon ${item.type === "Income" ? "income-icon" : ""}`}>
                      <Icon size={19} />
                    </div>
                    <div className="transaction-info">
                      <strong>{item.title}</strong>
                      <small>{item.category} · {new Date(item.date).toLocaleDateString("en-IN")}</small>
                    </div>
                    <strong className={`transaction-amount ${item.type === "Income" ? "income-text" : ""}`}>
                      {item.type === "Income" ? "+" : "-"}{formatMoney(item.amount)}
                    </strong>
                    <div className="row-actions">
                      <button onClick={() => openEdit(item)} aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => deleteExpense(item._id)} aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel category-panel">
            <div className="panel-heading">
              <div>
                <h3>Spending Breakdown</h3>
                <p>Expenses by category</p>
              </div>
            </div>

            {categoryData.length > 0 ? (
              <>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => formatMoney(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="category-legend">
                  {categoryData.map(item => (
                    <div className="legend-row" key={item.name}>
                      <span><i style={{ background: item.color }} />{item.name}</span>
                      <strong>{formatMoney(item.value)}</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="chart-empty">Your spending chart will appear here.</div>
            )}
          </div>
        </section>
      </main>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <form className="expense-modal" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <h2>{editing ? "Edit Transaction" : "Add Transaction"}</h2>
                <p>Enter your transaction details below.</p>
              </div>
              <button type="button" className="close-button" onClick={() => setModal(false)}>
                <X size={20} />
              </button>
            </div>

            <label>Transaction Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={form.type === "Expense" ? "selected expense-selected" : ""}
                onClick={() => setForm({ ...form, type: "Expense" })}
              >Expense</button>
              <button
                type="button"
                className={form.type === "Income" ? "selected income-selected" : ""}
                onClick={() => setForm({ ...form, type: "Income" })}
              >Income</button>
            </div>

            <label>Title</label>
            <input
              required
              placeholder="e.g. Monthly groceries"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <label>Amount (₹)</label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />

            <div className="form-two">
              <div>
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map(category => <option key={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label>Date</label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>

            <label>Description (Optional)</label>
            <textarea
              rows="3"
              placeholder="Add a note..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <button className="submit-button" type="submit">
        {editing ? "Save Changes" : "Add Transaction"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
