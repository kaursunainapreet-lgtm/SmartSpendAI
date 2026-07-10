// ============================================
// SMARTSPEND AI — EXPENSES TABLE (multi-select filter) + REPORTS VIEW
// ============================================

let selectedFilterCategories = new Set();

function populateExpenseFilterDropdown() {
  const dropdown = document.getElementById("filterDropdown");
  const dropdownBtn = document.getElementById("filterDropdownBtn");
  if (!dropdown || !dropdownBtn) return;

  dropdown.innerHTML = Object.keys(CATEGORIES).map(cat => `
    <label class="filter-option">
      <input type="checkbox" value="${cat}" ${selectedFilterCategories.has(cat) ? "checked" : ""} />
      ${CATEGORIES[cat].emoji} ${cat}
    </label>
  `).join("") + `
    <div class="filter-dropdown-footer">
      <button type="button" class="filter-clear-btn" id="filterClearBtn">Clear all</button>
    </div>
  `;

  dropdown.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.addEventListener("change", () => {
      if (box.checked) selectedFilterCategories.add(box.value);
      else selectedFilterCategories.delete(box.value);
      updateFilterButtonLabel();
      renderExpenseTable();
    });
  });

  document.getElementById("filterClearBtn").addEventListener("click", () => {
    selectedFilterCategories.clear();
    populateExpenseFilterDropdown();
    updateFilterButtonLabel();
    renderExpenseTable();
  });

  dropdownBtn.onclick = (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  };

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== dropdownBtn) {
      dropdown.classList.remove("open");
    }
  });

  updateFilterButtonLabel();
}

function updateFilterButtonLabel() {
  const btn = document.getElementById("filterDropdownBtn");
  if (!btn) return;
  const count = selectedFilterCategories.size;
  if (count === 0) btn.textContent = "All categories ▾";
  else if (count === 1) btn.textContent = `${[...selectedFilterCategories][0]} ▾`;
  else btn.textContent = `${count} categories selected ▾`;
}

function renderExpenseTable() {
  const container = document.getElementById("expenseTable");
  if (!container) return;

  let entries = RECENT_ENTRIES;
  if (selectedFilterCategories.size > 0) {
    entries = entries.filter(e => selectedFilterCategories.has(e.category));
  }

  if (entries.length === 0) {
    container.innerHTML = `<div class="empty-state"><span class="empty-emoji">🧾</span>No transactions found${selectedFilterCategories.size > 0 ? " for this filter" : ""}.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="expense-row expense-row-head">
      <span>Description</span>
      <span>Category</span>
      <span>Date</span>
      <span>Amount</span>
    </div>
    ${entries.map(e => {
      const emoji = CATEGORIES[e.category]?.emoji || "💰";
      const isPositive = e.amount > 0;
      const cls = isPositive ? "amt-pos" : "amt-neg";
      const sign = isPositive ? "+" : "";
      return `
        <div class="expense-row">
          <span>${e.desc}</span>
          <span>${emoji} ${e.category}</span>
          <span class="mono-date">${e.date}</span>
          <span class="${cls}">${sign}${formatCurrency(e.amount)}</span>
        </div>
      `;
    }).join("")}
  `;
}

function renderMonthlyReport() {
  const container = document.getElementById("reportGrid");
  if (!container) return;

  const totalIncome = USER.monthlyIncome;
  const totalExpense = getTotalExpenseThisMonth();
  const savings = totalIncome - totalExpense;

  const nonZero = Object.entries(CATEGORY_SPEND_THIS_MONTH).filter(([, v]) => v > 0);
  const highestCategory = nonZero.length ? nonZero.sort((a, b) => b[1] - a[1])[0] : ["None", 0];
  const highestDay = WEEKLY_SPEND.length ? [...WEEKLY_SPEND].sort((a, b) => b.amount - a.amount)[0] : { day: "—" };
  const dayOfMonth = new Date().getDate();
  const avgDaily = Math.round(totalExpense / dayOfMonth);

  container.innerHTML = `
    <div class="report-stat">
      <span class="stat-label">Total Income</span>
      <span class="stat-value">${formatCurrency(totalIncome)}</span>
    </div>
    <div class="report-stat">
      <span class="stat-label">Total Expense</span>
      <span class="stat-value negative">${formatCurrency(totalExpense)}</span>
    </div>
    <div class="report-stat">
      <span class="stat-label">Savings</span>
      <span class="stat-value positive">${formatCurrency(savings)}</span>
    </div>
    <div class="report-stat">
      <span class="stat-label">Highest Spending Category</span>
      <span class="stat-value gold">${CATEGORIES[highestCategory[0]]?.emoji || ""} ${highestCategory[0]}</span>
    </div>
    <div class="report-stat">
      <span class="stat-label">Most Expensive Day</span>
      <span class="stat-value gold">${highestDay.day}</span>
    </div>
    <div class="report-stat">
      <span class="stat-label">Average Daily Expense</span>
      <span class="stat-value">${formatCurrency(avgDaily)}</span>
    </div>
  `;
}