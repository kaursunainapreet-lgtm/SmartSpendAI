// ============================================
// SMARTSPEND AI — SESSION UI, LOGOUT & DEMO MODE
// ============================================

function renderSidebarProfile() {
  const nameEl = document.getElementById("sidebarUserName");
  const incomeEl = document.getElementById("sidebarUserIncome");

  if (nameEl) {
    nameEl.innerHTML = USER.name;

    if (USER.sampleMode) {
      nameEl.innerHTML += ` <span class="demo-badge">DEMO</span>`;
    }
  }

  if (incomeEl) {
    incomeEl.textContent = `${formatCurrency(USER.monthlyIncome)} / month`;
  }

  updateDemoUI();
}

function initLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem("smartspend_session");
    window.location.href = "login.html";
  });
}

function updateSampleDataButtonLabel() {
  const btn = document.getElementById("loadSampleBtn");

  if (!btn) return;

  if (USER.sampleMode) {
    btn.innerHTML = "🚪 Exit Demo Mode";
    btn.classList.add("demo-active");
  } else {
    btn.innerHTML = "📊 Enter Demo Mode";
    btn.classList.remove("demo-active");
  }
}

function updateDemoUI() {

  document.body.classList.toggle("demo-mode", USER.sampleMode);

  const addBtn = document.getElementById("openExpenseModal");

  if (addBtn) {
    addBtn.disabled = USER.sampleMode;

    if (USER.sampleMode) {
      addBtn.innerHTML = "🔒 Add Expense";
    } else {
      addBtn.innerHTML = "+ Add Expense";
    }
  }

  let banner = document.getElementById("demoBanner");

  if (USER.sampleMode) {

    if (!banner) {

      banner = document.createElement("div");
      banner.id = "demoBanner";
      banner.className = "demo-banner";

      banner.innerHTML = `
        <span style="font-size:22px;">🧪</span>

        <div>
            <strong>Demo Mode</strong><br>
            You're viewing demonstration data.
            Your personal expenses, budgets and reports are completely safe.
        </div>
      `;

      const topBar = document.querySelector(".top-bar");

      if (topBar) {
        topBar.insertAdjacentElement("afterend", banner);
      }
    }

  } else {

    if (banner) {
      banner.remove();
    }

  }

}

function initSampleDataButton() {

  const btn = document.getElementById("loadSampleBtn");

  if (!btn) return;

  updateSampleDataButtonLabel();

  btn.addEventListener("click", async () => {

    try {

      if (!USER.sampleMode) {

        const confirmed = confirm(
          "Switch to Demo Mode?\n\nYour real expenses will remain completely safe."
        );

        if (!confirmed) return;

        await apiPost(`/api/sample/${USER.id}`, {});

        await refreshEverything();

        updateSampleDataButtonLabel();

        renderSidebarProfile();

        showToast("🎉 Welcome to Demo Mode!");

      }

      else {

        const confirmed = confirm(
          "Exit Demo Mode and return to your personal data?"
        );

        if (!confirmed) return;

        await apiDelete(`/api/sample/${USER.id}`);

        await refreshEverything();

        updateSampleDataButtonLabel();

        renderSidebarProfile();

        showToast("✅ Back to your personal dashboard.");

      }

    }

    catch (err) {

      showToast("⚠️ " + err.message);

    }

  });

}

document.addEventListener("DOMContentLoaded", () => {

  renderSidebarProfile();

  updateDemoUI();

});