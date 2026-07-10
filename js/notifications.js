// ============================================
// SMARTSPEND AI — NOTIFICATION ENGINE
// ============================================

let NOTIFICATIONS = [];

function loadNotifications() {
    const stored = localStorage.getItem(
        `smartspend_notifications_${USER.id}`
    );

    NOTIFICATIONS = stored
        ? JSON.parse(stored)
        : [];
}

function saveNotifications() {

    localStorage.setItem(
        `smartspend_notifications_${USER.id}`,
        JSON.stringify(NOTIFICATIONS)
    );

}

function addNotification({
    title,
    message,
    type = "info",
    icon = "🔔"
}) {

    const notification = {

        id: Date.now(),

        title,

        message,

        type,

        icon,

        read: false,

        time: new Date().toLocaleString()

    };

    NOTIFICATIONS.unshift(notification);

    if (NOTIFICATIONS.length > 100)
        NOTIFICATIONS.pop();

    saveNotifications();

    showToast(`${icon} ${title}`);

    renderNotificationCenter();

}

function markNotificationRead(id) {

    const item = NOTIFICATIONS.find(n => n.id === id);

    if (item)
        item.read = true;

    saveNotifications();

    renderNotificationCenter();

}

function unreadNotificationCount() {

    return NOTIFICATIONS.filter(
        n => !n.read
    ).length;

}
// ============================================
// SMART ALERT ENGINE
// ============================================

function runNotificationChecks() {

    loadNotifications();

    checkBudgetAlerts();

    checkSavingsAlert();

}

function notificationExists(title) {

    return NOTIFICATIONS.some(
        n => n.title === title
    );

}

function checkBudgetAlerts() {

    Object.keys(BUDGETS).forEach(category => {

        const { spent, limit, pct, status } =
            getBudgetStatus(category);

        if (!limit) return;

        // -----------------------
        // Budget Exceeded
        // -----------------------

        if (status === "danger") {

            const title = `${category} Budget Exceeded`;

            if (!notificationExists(title)) {

                addNotification({

                    title,

                    icon: "🚨",

                    type: "danger",

                    message:
                        generateFunnyMessage(category, pct)

                });

            }

        }

        // -----------------------
        // 80% Warning
        // -----------------------

        else if (status === "warning") {

            const title = `${category} Budget Warning`;

            if (!notificationExists(title)) {

                addNotification({

                    title,

                    icon: "⚠️",

                    type: "warning",

                    message:
                        `You've already used ${pct}% of your ${category} budget.`

                });

            }

        }

    });

}

function checkSavingsAlert() {

    const expense =
        getTotalExpenseThisMonth();

    const balance =
        getCurrentBalance();

    if (
        balance >
        USER.monthlyIncome * 0.50
    ) {

        const title =
            "Savings Hero";

        if (!notificationExists(title)) {

            addNotification({

                title,

                icon: "🎉",

                type: "success",

                message:
                    "You're saving more than half of your income this month. Future You says thanks!"

            });

        }

    }

}
// ============================================
// Funny Messages
// ============================================

function generateFunnyMessage(category, pct) {

    const jokes = {

        Food: [

            "🍕 Your stomach is celebrating, but your wallet isn't.",

            "🍔 Your fridge would like to remind you that it exists.",

            "🥲 Zomato knows your address better than your relatives."

        ],

        Shopping: [

            "🛍️ Amazon thinks you're their Employee of the Month.",

            "💳 Your debit card is requesting annual leave.",

            "😂 Retail therapy isn't covered by insurance."

        ],

        Entertainment: [

            "🎬 Netflix is entertained by your spending.",

            "🍿 Plot twist: your budget disappeared."

        ],

        Travel: [

            "✈️ Your passport is happy. Your wallet isn't.",

            "🌍 Collect memories... maybe fewer receipts."

        ],

        Transport: [

            "🚗 Even your fuel tank is asking for a break."

        ],

        Health: [

            "💊 Health is wealth... but let's save some wealth too."

        ],

        Utilities: [

            "💡 Your electricity bill is brighter than your future savings."

        ]

    };

    const list =
        jokes[category] || [

            "💸 Your wallet just sighed dramatically."

        ];

    const joke =
        list[Math.floor(Math.random() * list.length)];

    return `${joke}\n\nBudget used: ${pct}%`;

}
// ============================================
// FUNNY NOTIFICATIONS
// ============================================

function funnyExpenseNotification(category, amount) {

    let message = "";

    switch(category){

        case "Food":

            message =
            "🍕 Swiggy thinks you're their favourite customer 😂";

            break;

        case "Shopping":

            message =
            "🛍️ Amazon sends its regards. Your wallet doesn't.";

            break;

        case "Travel":

            message =
            "✈️ Passport ready? Your money already left.";

            break;

        case "Entertainment":

            message =
            "🎬 Netflix approves this spending.";

            break;

        case "Health":

            message =
            "💪 Money spent on health is always a good investment.";

            break;

        default:

            message =
            "💸 Another expense recorded successfully.";

    }

    addNotification(

        `${category} Expense`,

        `${message}<br><br>Amount: ₹${amount.toLocaleString("en-IN")}`,

        "funny"

    );

}
// ============================================
// FUNNY NOTIFICATIONS
// ============================================

function funnyExpenseNotification(category, amount) {

    let message = "";

    switch(category){

        case "Food":

            message =
            "🍕 Swiggy thinks you're their favourite customer 😂";

            break;

        case "Shopping":

            message =
            "🛍️ Amazon sends its regards. Your wallet doesn't.";

            break;

        case "Travel":

            message =
            "✈️ Passport ready? Your money already left.";

            break;

        case "Entertainment":

            message =
            "🎬 Netflix approves this spending.";

            break;

        case "Health":

            message =
            "💪 Money spent on health is always a good investment.";

            break;

        default:

            message =
            "💸 Another expense recorded successfully.";

    }

    addNotification(

        `${category} Expense`,

        `${message}<br><br>Amount: ₹${amount.toLocaleString("en-IN")}`,

        "funny"

    );

}
// ============================================
// FINANCIAL HEALTH ALERT
// ============================================

function checkFinancialHealth() {

    const score = getFinancialHealthScore();

    if(score >= 90){

        addNotification(

            "🌟 Financial Health",

            "Excellent! Your Financial Score is above 90.",

            "success"

        );

    }

    else if(score < 50){

        addNotification(

            "⚠ Financial Health",

            "Your Financial Score is low. Try reducing unnecessary expenses.",

            "warning"

        );

    }

}
// ============================================
// AFTER EVERY EXPENSE
// ============================================

function runSmartNotifications(category, amount){

    funnyExpenseNotification(category, amount);

    checkAchievements();

    checkFinancialHealth();

}
