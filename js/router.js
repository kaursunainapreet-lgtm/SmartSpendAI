// ============================================
// SMARTSPEND AI — VIEW ROUTER
// ============================================

const VIEW_TITLES = {
    dashboard: "Dashboard",
    expenses: "Expenses",
    budgets: "Budgets",
    reports: "Reports",
    assistant: "AI Assistant"
};

function switchView(viewName) {

    document.querySelectorAll(".view").forEach(view => {
        view.classList.remove("active");
    });

    const target = document.getElementById(`view-${viewName}`);

    if (target) {
        target.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    const activeItem = document.querySelector(
        `.nav-item[data-view="${viewName}"]`
    );

    if (activeItem) {
        activeItem.classList.add("active");
    }

    const title = document.getElementById("pageTitle");

    if (title) {
        title.textContent =
            VIEW_TITLES[viewName] || "Dashboard";
    }

    switch (viewName) {

        case "expenses":
            renderExpenseTable();
            break;

        case "budgets":
            renderBudgetList();
            break;

        case "reports":
            renderMonthlyReport();
            break;

        case "assistant":
            renderAIInsight();
            break;
    }

}

function initRouter() {

    document.querySelectorAll(".nav-item").forEach(item => {

        item.addEventListener("click", function (e) {

            e.preventDefault();

            switchView(this.dataset.view);

        });

    });

    switchView("dashboard");

}