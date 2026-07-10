// ============================================
// SMARTSPEND AI
// Browser Notifications
// ============================================

let notificationsEnabled = false;

async function initBrowserNotifications() {

    if (!("Notification" in window)) {

        console.log("Notifications not supported.");

        return;

    }

    if (Notification.permission === "granted") {

        notificationsEnabled = true;

        return;

    }

    if (Notification.permission !== "denied") {

        const permission =
            await Notification.requestPermission();

        notificationsEnabled =
            permission === "granted";

    }

}

function showBrowserNotification(

    title,

    body,

    icon = "favicon.ico"

) {

    if (!notificationsEnabled) return;

    new Notification(title, {

        body,

        icon,

        badge: icon

    });

}
// ============================================
// FUNNY NOTIFICATIONS
// ============================================

function notifyExpense(category, amount) {

    const jokes = {

        Food: [
            "🍕 Your stomach is happy. Your wallet is requesting emotional support.",
            "🍔 Calories gained. Savings lost.",
            "🌮 Food is temporary. Budget reports are forever."
        ],

        Shopping: [
            "🛍 Amazon says thanks. Your bank account doesn't.",
            "💸 Retail therapy is still therapy... right?",
            "👕 New clothes unlocked. Savings locked."
        ],

        Travel: [
            "✈ Memories created. Money departed.",
            "🧳 Adventure level increased.",
            "🚆 Hope the trip was worth it 😄"
        ],

        Entertainment: [
            "🎬 Netflix approves this decision.",
            "🍿 Entertainment level: 100%",
            "😂 At least you're having fun."
        ],

        Health: [
            "💪 Investing in health is always a good idea.",
            "🏥 Better health > Bigger wallet.",
            "❤️ Your future self thanks you."
        ],

        Other: [
            "💸 Another expense successfully recorded.",
            "📒 Your wallet noticed.",
            "😅 Spending logged."
        ]

    };

    const list = jokes[category] || jokes.Other;

    const joke =
        list[Math.floor(Math.random() * list.length)];

    showBrowserNotification(

        `${CATEGORIES[category]?.emoji || "💰"} ${category} Expense`,

        `₹${amount.toLocaleString("en-IN")}\n\n${joke}`

    );

}



// ============================================
// BUDGET ALERTS
// ============================================

function notifyBudget(category) {

    const budget = getBudgetStatus(category);

    if (budget.status === "danger") {

        showBrowserNotification(

            "🚨 Budget Exceeded!",

            `${category} has crossed its budget.\n\nMaybe your wallet needs a vacation.`

        );

    }

    else if (budget.status === "warning") {

        showBrowserNotification(

            "⚠ Budget Warning",

            `${category} budget is ${budget.pct}% used.\n\nEasy there... the month isn't over yet.`

        );

    }

}
// ============================================
// SAVINGS MILESTONE
// ============================================

function notifySavings() {

    const savings = getCurrentBalance();

    if (savings <= 0) return;

    if (savings >= 10000) {

        showBrowserNotification(

            "🎉 Savings Milestone!",

            `Amazing! You've saved ₹${savings.toLocaleString("en-IN")} this month.\n\nYour future self is smiling 😎`

        );

    }

}



// ============================================
// SMART NOTIFICATION ENGINE
// ============================================

function runSmartNotifications(category, amount) {

    notifyExpense(category, amount);

    notifyBudget(category);

    notifySavings();

}



// ============================================
// INITIALIZATION
// ============================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initBrowserNotifications();

    }

);



// ============================================
// GLOBAL FUNCTIONS
// ============================================

window.runSmartNotifications = runSmartNotifications;
window.initBrowserNotifications = initBrowserNotifications;