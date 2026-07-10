 // ============================================
 // SMARTSPEND AI — SAMPLE DATA
 // ============================================


const SAMPLE_DATA = {

    user: {

        name: "Demo User",

        monthlyIncome: 75000,

        currency: "₹"

    },


    expenses: [

        {
            id: 1,
            category: "Food",
            amount: 450,
            description: "Dinner - Zomato",
            date: "2026-07-08",
            paymentMethod: "UPI"
        },

        {
            id: 2,
            category: "Transport",
            amount: 120,
            description: "Uber Ride",
            date: "2026-07-08",
            paymentMethod: "UPI"
        },

        {
            id: 3,
            category: "Shopping",
            amount: 2200,
            description: "Amazon Shoes",
            date: "2026-07-06",
            paymentMethod: "Card"
        },

        {
            id: 4,
            category: "Utilities",
            amount: 899,
            description: "Internet Bill",
            date: "2026-07-05",
            paymentMethod: "UPI"
        },

        {
            id: 5,
            category: "Entertainment",
            amount: 199,
            description: "Netflix",
            date: "2026-07-04",
            paymentMethod: "Card"
        },

        {
            id: 6,
            category: "Food",
            amount: 650,
            description: "Groceries",
            date: "2026-07-03",
            paymentMethod: "Cash"
        },

        {
            id: 7,
            category: "Travel",
            amount: 2100,
            description: "Weekend Trip",
            date: "2026-07-02",
            paymentMethod: "Card"
        },

        {
            id: 8,
            category: "Housing",
            amount: 15000,
            description: "Monthly Rent",
            date: "2026-07-01",
            paymentMethod: "Bank Transfer"
        },

        {
            id: 9,
            category: "Health",
            amount: 900,
            description: "Pharmacy",
            date: "2026-06-30",
            paymentMethod: "UPI"
        },

        {
            id: 10,
            category: "Personal Care",
            amount: 600,
            description: "Salon",
            date: "2026-06-29",
            paymentMethod: "Cash"
        }

    ],


    budgets: {

        Food: 6000,

        Shopping: 5000,

        Travel: 3000,

        Entertainment: 1500,

        Transport: 2000

    }

};



// ============================================
// LOAD DEMO DATA INTO FRONTEND STATE
// ============================================

function loadDemoData() {


    USER.name = SAMPLE_DATA.user.name;

    USER.monthlyIncome = SAMPLE_DATA.user.monthlyIncome;

    USER.currency = SAMPLE_DATA.user.currency;


    CATEGORY_SPEND_THIS_MONTH = {};



    Object.keys(CATEGORIES).forEach(category => {


        CATEGORY_SPEND_THIS_MONTH[category] = 0;


    });



    SAMPLE_DATA.expenses.forEach(expense => {


        CATEGORY_SPEND_THIS_MONTH[expense.category] += expense.amount;


    });



    RECENT_ENTRIES = SAMPLE_DATA.expenses.map(expense => ({


        type: "expense",

        category: expense.category,

        amount: -Math.abs(expense.amount),

        desc: expense.description,

        date: expense.date,

        id: expense.id


    }));



    BUDGETS = {};


    Object.keys(SAMPLE_DATA.budgets).forEach(category => {


        BUDGETS[category] = SAMPLE_DATA.budgets[category];


    });



    // Simple demo analytics


    MONTHLY_TREND = [

        { month: "Feb", amount: 32000 },

        { month: "Mar", amount: 28000 },

        { month: "Apr", amount: 35000 },

        { month: "May", amount: 31000 },

        { month: "Jun", amount: 39000 },

        { month: "Jul", amount: 23000 }

    ];



    INCOME_VS_EXPENSE = [

        {
            month: "Jul",
            income: 75000,
            expense: 23118
        }

    ];



    WEEKLY_SPEND = [

        {
            week: "Week 1",
            amount: 8500
        },

        {
            week: "Week 2",
            amount: 6200
        },

        {
            week: "Week 3",
            amount: 9100
        },

        {
            week: "Week 4",
            amount: 4300
        }

    ];



    SAVINGS_HISTORY = [

        {
            month: "Jul",
            amount: 51882
        }

    ];

}