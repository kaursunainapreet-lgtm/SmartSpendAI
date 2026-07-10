// ============================================
// SMARTSPEND AI — CORE DATA STORE (backend-powered)
// ============================================

const API_BASE = "http://127.0.0.1:5000";

// ---- Route guard: bounce to login if no session exists ----
const SESSION = JSON.parse(localStorage.getItem("smartspend_session") || "null");

if (!SESSION || !SESSION.id) {
  window.location.href = "login.html";
}


// ---- Global state, filled in by loadAllData() ----

let USER = {
  id: SESSION?.id || null,
  name: SESSION?.name || "",
  age: SESSION?.age || null,
  profession: SESSION?.profession || null,
  monthlyIncome: SESSION?.monthlyIncome || 0,
  currency: "₹",

  // Demo mode tracking
  sampleMode: false,
  isDemo: false
};


const CATEGORIES = {

  Food:          { emoji: "🍔", color: "#C9A227" },
  Drinks:        { emoji: "☕", color: "#8A7020" },
  Shopping:      { emoji: "🛍️", color: "#C1553C" },
  Travel:        { emoji: "✈️", color: "#4FA79A" },
  Transport:     { emoji: "🚗", color: "#6C8CBF" },
  Housing:       { emoji: "🏠", color: "#9A6FB0" },
  Utilities:     { emoji: "💡", color: "#D9A441" },
  Entertainment: { emoji: "🎬", color: "#E07A5F" },
  Health:        { emoji: "💊", color: "#5FA8D3" },
  Education:     { emoji: "📚", color: "#7FB069" },
  "Personal Care": { emoji: "💇", color: "#D08FB0" },
  Other:         { emoji: "🧾", color: "#7A8A99" }

};


let RECENT_ENTRIES = [];
let CATEGORY_SPEND_THIS_MONTH = {};
let BUDGETS = {};
let MONTHLY_TREND = [];
let INCOME_VS_EXPENSE = [];
let WEEKLY_SPEND = [];
let SAVINGS_HISTORY = [];



// ============================================
// API HELPERS
// ============================================

async function apiGet(path) {

  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();

}



async function apiPost(path, body) {

  const res = await fetch(`${API_BASE}${path}`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(body)

  });


  const data = await res.json();


  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }


  return data;

}



// Used when switching back from demo mode
async function apiDelete(path) {

  const res = await fetch(`${API_BASE}${path}`, {

    method: "DELETE"

  });


  const data = await res.json();


  if (!res.ok) {

    throw new Error(data.error || "Request failed");

  }


  return data;

}



// ============================================
// LOAD ALL DATA
// ============================================

async function loadAllData() {


  const [summary, analytics, allExpenses] = await Promise.all([

    apiGet(`/api/summary/${USER.id}`),

    apiGet(`/api/analytics/${USER.id}`),

    apiGet(`/api/expenses/${USER.id}`)

  ]);



  USER.name = summary.user.name;

  USER.age = summary.user.age;

  USER.profession = summary.user.profession;

  USER.monthlyIncome = summary.user.monthlyIncome;

  USER.currency = summary.user.currency;



  // Demo mode status from backend

  USER.sampleMode = summary.user.sampleMode || false;

  USER.isDemo = USER.sampleMode;



  CATEGORY_SPEND_THIS_MONTH = {};


  Object.keys(CATEGORIES).forEach(category => {

    CATEGORY_SPEND_THIS_MONTH[category] =
      summary.categorySpend[category] || 0;

  });



  BUDGETS = {};


  summary.budgets.forEach(budget => {

    BUDGETS[budget.category] = budget.limitAmount;

  });



  RECENT_ENTRIES = allExpenses.map(expense => ({

    type: "expense",

    category: expense.category,

    amount: -Math.abs(expense.amount),

    desc: expense.description,

    date: expense.date,

    id: expense.id

  }));



  MONTHLY_TREND = analytics.monthlyTrend;

  INCOME_VS_EXPENSE = analytics.incomeVsExpense;

  WEEKLY_SPEND = analytics.weeklySpend;

  SAVINGS_HISTORY = analytics.savingsHistory;


}



// ============================================
// DERIVED HELPERS
// ============================================


function getTotalExpenseThisMonth() {

  return Object.values(CATEGORY_SPEND_THIS_MONTH)
    .reduce((total, amount) => total + amount, 0);

}



function getCurrentBalance() {

  return USER.monthlyIncome - getTotalExpenseThisMonth();

}



function getSavingsGrowthStage() {


  const latest =
    SAVINGS_HISTORY[SAVINGS_HISTORY.length - 1]?.amount || 0;


  const ratio =
    (USER.monthlyIncome || 75000) / 75000;



  if (latest < 15000 * ratio) return "🌱";

  if (latest < 40000 * ratio) return "🌿";


  return "🌳";

}




function getBudgetStatus(category) {


  const spent =
    CATEGORY_SPEND_THIS_MONTH[category] || 0;


  const limit =
    BUDGETS[category] || 0;



  const pct =
    limit > 0
      ? Math.min(100, Math.round((spent / limit) * 100))
      : 0;



  let status = "ok";


  if (pct >= 100) {

    status = "danger";

  }

  else if (pct >= 80) {

    status = "warning";

  }



  return {

    spent,

    limit,

    pct,

    status

  };

}