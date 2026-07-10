// ============================================
// SMARTSPEND AI — DEMO MODE
// ============================================


let DEMO_MODE = sessionStorage.getItem("demoMode") === "true";


// ---------------------------
// Public Helpers
// ---------------------------

function isDemoMode() {

    return DEMO_MODE;

}



function enterDemoMode() {


    DEMO_MODE = true;

    USER.sampleMode = true;
    USER.isDemo = true;


    sessionStorage.setItem("demoMode", "true");


    loadDemoData();


    updateDemoUI();


    renderDashboard();


    refreshCharts();


    showToast("🧪 Demo Mode Enabled", "success");

}




async function exitDemoMode() {


    DEMO_MODE = false;


    USER.sampleMode = false;
    USER.isDemo = false;


    sessionStorage.removeItem("demoMode");


    await loadAllData();


    updateDemoUI();


    renderDashboard();


    refreshCharts();


    showToast("✅ Back to Your Data", "success");

}




function toggleDemoMode() {


    if (DEMO_MODE) {

        exitDemoMode();

    } else {

        enterDemoMode();

    }

}



// ---------------------------
// UI
// ---------------------------

function updateDemoUI() {


    const banner =
        document.getElementById("demoBanner");


    const badge =
        document.getElementById("demoBadge");


    const toggle =
        document.getElementById("demoToggleBtn");


    const addExpenseBtn =
        document.getElementById("addExpenseBtn");



    // Banner

    if (banner) {

        banner.style.display =
            DEMO_MODE ? "flex" : "none";

    }



    // Badge

    if (badge) {

        badge.style.display =
            DEMO_MODE ? "inline-flex" : "none";

    }



    // Demo Button

    if (toggle) {


        toggle.innerHTML =
            DEMO_MODE
            ? "← Exit Demo"
            : "🧪 Enter Demo";



        toggle.classList.toggle(
            "demo-active",
            DEMO_MODE
        );

    }




    // Disable Add Expense

    if (addExpenseBtn) {


        addExpenseBtn.disabled =
            DEMO_MODE;



        addExpenseBtn.title =
            DEMO_MODE
            ? "Exit Demo Mode to add expenses."
            : "";

    }


}



// ---------------------------
// Initialization
// ---------------------------

window.addEventListener("DOMContentLoaded", () => {


    updateDemoUI();



    if (DEMO_MODE) {


        loadDemoData();


        renderDashboard();


        refreshCharts();


    }


});