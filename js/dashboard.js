// ============================================
// SMARTSPEND AI — DASHBOARD RENDERING
// ============================================

function formatCurrency(amount) {

    const sign = amount < 0 ? "-" : "";

    return sign +
        USER.currency +
        Math.abs(Math.round(amount))
            .toLocaleString("en-IN");

}

// ============================================
// FINANCIAL HEALTH
// ============================================

function getFinancialHealthScore() {

    const expense =
        getTotalExpenseThisMonth();

    if (USER.monthlyIncome <= 0)
        return 50;

    let score = 100;

    const ratio =
        expense / USER.monthlyIncome;

    if (ratio > 1)
        score -= 40;

    else if (ratio > .9)
        score -= 30;

    else if (ratio > .8)
        score -= 20;

    else if (ratio > .7)
        score -= 10;

    const overBudget =
        Object.keys(BUDGETS)
            .filter(cat =>
                getBudgetStatus(cat).status === "danger"
            ).length;

    score -= overBudget * 5;

    if (score < 0)
        score = 0;

    return Math.round(score);

}

function getHealthStars(score) {

    if (score >= 90)
        return "★★★★★";

    if (score >= 75)
        return "★★★★☆";

    if (score >= 60)
        return "★★★☆☆";

    if (score >= 40)
        return "★★☆☆☆";

    return "★☆☆☆☆";

}

// ============================================
// SPENDING PERSONALITY
// ============================================

function getSpendingPersonality() {

    const total =
        getTotalExpenseThisMonth();

    if (total === 0) {

        return {

            emoji: "🌱",

            title: "Fresh Starter",

            text:
                "Start adding expenses to unlock your personality."

        };

    }

    let highest = 0;

    let category = "Other";

    Object.entries(CATEGORY_SPEND_THIS_MONTH)
        .forEach(([cat, amt]) => {

            if (amt > highest) {

                highest = amt;

                category = cat;

            }

        });

    switch (category) {

        case "Food":

            return {

                emoji: "🍔",

                title: "Food Explorer",

                text:
                    "You love good food. Home cooking could save you more."

            };

        case "Shopping":

            return {

                emoji: "🛍️",

                title: "Impulse Shopper",

                text:
                    "Amazon probably knows your address by heart."

            };

        case "Travel":

            return {

                emoji: "✈️",

                title: "Travel Lover",

                text:
                    "Experiences matter more than things."

            };

        case "Entertainment":

            return {

                emoji: "🎬",

                title: "Fun Seeker",

                text:
                    "You enjoy life, just remember to save too."

            };

        case "Health":

            return {

                emoji: "💪",

                title: "Health Champion",

                text:
                    "Health is the best investment."

            };

        default:

            return {

                emoji: "💰",

                title: "Balanced Spender",

                text:
                    "Your spending looks well balanced."

            };

    }

}
// ============================================
// DAILY CHALLENGE
// ============================================

function getDailyChallenge() {

    const challenges = [

        {
            emoji: "🚶",
            title: "Walk instead of taking a cab today.",
            save: 150
        },

        {
            emoji: "☕",
            title: "Skip one coffee today.",
            save: 180
        },

        {
            emoji: "🍕",
            title: "Cook one meal at home.",
            save: 250
        },

        {
            emoji: "🥤",
            title: "Avoid soft drinks today.",
            save: 90
        },

        {
            emoji: "🛍️",
            title: "No unnecessary shopping today.",
            save: 500
        }

    ];

    return challenges[
        new Date().getDate() %
        challenges.length
    ];

}



// ============================================
// LEDGER TAPE
// ============================================

function renderLedgerTape() {

    const tape =
        document.getElementById("ledgerTape");

    if (!tape) return;

    if (RECENT_ENTRIES.length === 0) {

        tape.innerHTML = `

        <span class="empty-state">

        🧾 No transactions yet.

        </span>

        `;

        return;

    }

    tape.innerHTML = RECENT_ENTRIES

        .slice(0,10)

        .map(entry=>{

            const emoji =
                CATEGORIES[entry.category]?.emoji || "💰";

            return `

            <span class="ledger-entry">

                <span>

                ${emoji}
                ${entry.desc}

                </span>

                <span class="${
                    entry.amount<0
                    ?"amt-neg"
                    :"amt-pos"
                }">

                ${formatCurrency(entry.amount)}

                </span>

            </span>

            `;

        })

        .join("");

}



// ============================================
// STAT CARDS
// ============================================

function renderStatCards() {

    const row =
        document.getElementById("statRow");

    if (!row) return;

    const expense =
        getTotalExpenseThisMonth();

    const balance =
        getCurrentBalance();

    const score =
        getFinancialHealthScore();

    const personality =
        getSpendingPersonality();

    const challenge =
        getDailyChallenge();

    const budgetPct =
        USER.monthlyIncome
        ? Math.round(
            expense /
            USER.monthlyIncome *
            100
        )
        : 0;

    const sprout =
        getSavingsGrowthStage();

    row.innerHTML = `

<div class="stat-card">

<span class="stat-label">

Current Balance

</span>

<span class="stat-value gold">

${formatCurrency(balance)}

</span>

<span class="stat-sub">

Available now

</span>

</div>



<div class="stat-card">

<span class="stat-label">

Monthly Income

</span>

<span class="stat-value">

${formatCurrency(USER.monthlyIncome)}

</span>

<span class="stat-sub">

${USER.name}

</span>

</div>



<div class="stat-card">

<span class="stat-label">

Monthly Expenses

</span>

<span class="stat-value negative">

${formatCurrency(expense)}

</span>

<span class="stat-sub">

${budgetPct}% of income used

</span>

</div>



<div class="stat-card">

<span class="stat-label">

Savings ${sprout}

</span>

<span class="stat-value positive">

${formatCurrency(balance)}

</span>

<span class="stat-sub">

Looking good

</span>

</div>



<div class="stat-card">

<span class="stat-label">

Financial Health

</span>

<span class="stat-value">

${score}/100

</span>

<span class="stat-sub">

${getHealthStars(score)}

</span>

</div>
<div class="stat-card">

    <span class="stat-label">

        ${personality.emoji}
        ${personality.title}

    </span>

    <span class="stat-sub">

        ${personality.text}

    </span>

</div>



<div class="stat-card">

    <span class="stat-label">

        ${challenge.emoji}
        Daily Challenge

    </span>

    <span class="stat-sub">

        ${challenge.title}

    </span>

    <span class="stat-value positive">

        Save ₹${challenge.save}

    </span>

</div>

`;

}



// ============================================
// BUDGET LIST
// ============================================

function renderBudgetList() {

    const list =
        document.getElementById("budgetList");

    if (!list) return;

    const categories =
        Object.keys(BUDGETS);

    if (!categories.length) {

        list.innerHTML = `

        <div class="empty-state">

            <span class="empty-emoji">

                🗂️

            </span>

            No budgets available.

        </div>

        `;

        return;

    }

    list.innerHTML = categories

        .map(category => {

            const {

                spent,
                limit,
                pct,
                status

            } = getBudgetStatus(category);

            const emoji =
                CATEGORIES[category]?.emoji || "🧾";

            return `

            <div class="budget-row">

                <div class="budget-row-top">

                    <span class="budget-cat">

                        <span class="cat-emoji">

                            ${emoji}

                        </span>

                        ${category}

                    </span>

                    <span class="budget-nums">

                        ${formatCurrency(spent)}

                        /

                        ${formatCurrency(limit)}

                    </span>

                </div>

                <div class="budget-bar-track">

                    <div

                        class="budget-bar-fill ${status !== "ok" ? status : ""}"

                        style="width:${pct}%">

                    </div>

                </div>

            </div>

            `;

        })

        .join("");

}



// ============================================
// ACHIEVEMENTS
// ============================================

function getAchievements() {

    const achievements = [];

    const expense =
        getTotalExpenseThisMonth();

    if (expense > 0) {

        achievements.push("🏆 First Expense Logged");

    }

    if (expense < USER.monthlyIncome * 0.5) {

        achievements.push("🌱 Excellent Saving Habit");

    }

    const overBudget =
        Object.keys(BUDGETS)

        .filter(c =>
            getBudgetStatus(c).status === "danger"
        );

    if (overBudget.length === 0) {

        achievements.push("💎 Budget Master");

    }

    if (RECENT_ENTRIES.length >= 20) {

        achievements.push("🔥 Expense Tracker");

    }

    return achievements;

}