// ============================================
// SMARTSPEND AI — APP BOOTSTRAP
// ============================================

async function refreshEverything() {

    await loadAllData();

    renderSidebarProfile();

    renderLedgerTape();

    renderStatCards();

    renderBudgetList();

    renderAIInsight();

    renderExpenseTable();

    renderMonthlyReport();

    // Demo Mode UI
    updateDemoUI();

    // Notification Engine
    if (typeof loadNotifications === "function") {
        loadNotifications();
    }

    if (typeof runNotificationChecks === "function") {
        runNotificationChecks();
    }

    refreshCharts();
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

async function initApp() {

    try {

        await loadAllData();

    } catch (err) {

        console.error(err);

        alert(
            "Could not connect to the backend.\n\nMake sure Flask is running."
        );

        return;
    }

    // ---------------------------------
    // Notification Engine
    // ---------------------------------

    if (typeof loadNotifications === "function") {
        loadNotifications();
    }

    if (typeof runNotificationChecks === "function") {
        runNotificationChecks();
    }

    // ---------------------------------
    // Sidebar
    // ---------------------------------

    renderSidebarProfile();

    initLogout();

    // ---------------------------------
    // Demo Button
    // ---------------------------------

    const demoBtn = document.getElementById("demoToggleBtn");

    if (demoBtn) {
        demoBtn.addEventListener("click", toggleDemoMode);
    }

    // ---------------------------------
    // Dashboard
    // ---------------------------------

    renderLedgerTape();

    renderStatCards();

    renderBudgetList();

    updateDemoUI();

    // ---------------------------------
    // Charts
    // ---------------------------------

    initCharts();

    // ---------------------------------
    // AI
    // ---------------------------------

    renderAIInsight();

    initChatbot();

    // ---------------------------------
    // Expense Form
    // ---------------------------------

    initExpenseForm();

    // Uncomment if you restore this feature
    // populateExpenseFilterDropdown();

    // ---------------------------------
    // Router
    // ---------------------------------

    initRouter();
}

// ============================================
// START APP
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    initApp
);