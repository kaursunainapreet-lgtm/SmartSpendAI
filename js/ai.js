// ============================================
// SMARTSPEND AI — AI COACH + GEMINI
// ============================================

let roastMode = true;



// ============================================
// SMART INSIGHTS
// ============================================

function generateInsights() {

    const insights = [];

    const totalExpense =
        getTotalExpenseThisMonth();

    if (totalExpense === 0) {

        return [

            "🌱 No spending recorded yet. Add your first expense to unlock AI insights."

        ];

    }

    const income =
        USER.monthlyIncome;

    const used =
        income > 0
            ? Math.round(
                totalExpense /
                income *
                100
            )
            : 0;

    insights.push(

        `💰 You have used <strong>${used}%</strong> of your monthly income.`

    );



    // Highest category

    const highest =
        Object.entries(CATEGORY_SPEND_THIS_MONTH)

        .sort((a,b)=>b[1]-a[1])[0];

    if(highest && highest[1]>0){

        insights.push(

            `${CATEGORIES[highest[0]].emoji}
            Your biggest expense is
            <strong>${highest[0]}</strong>
            (₹${highest[1].toLocaleString("en-IN")}).`

        );

    }



    // Budget Alerts

    Object.keys(BUDGETS).forEach(category=>{

        const b =
            getBudgetStatus(category);

        if(b.status==="danger"){

            insights.push(

                `🚨 ${category} budget exceeded by
                ₹${(b.spent-b.limit).toLocaleString("en-IN")}.`

            );

        }

        else if(b.status==="warning"){

            insights.push(

                `⚠ ${category} budget is already ${b.pct}% used.`

            );

        }

    });



    // Savings

    const savings =
        getCurrentBalance();

    if(savings>0){

        insights.push(

            `🌱 Estimated savings this month:
            <strong>₹${savings.toLocaleString("en-IN")}</strong>.`

        );

    }



    // Prediction

    if(MONTHLY_TREND.length>=2){

        const current =
            MONTHLY_TREND[MONTHLY_TREND.length-1].amount;

        const last =
            MONTHLY_TREND[MONTHLY_TREND.length-2].amount;

        if(current>last){

            insights.push(

                `📈 Spending has increased by
                <strong>${Math.round((current-last)/last*100)}%</strong>
                compared to last month.`

            );

        }

        else{

            insights.push(

                `📉 Great! Spending is lower than last month.`

            );

        }

    }

    return insights;

}



// ============================================
// AI PANEL
// ============================================

function renderAIInsight(){

    const body=
        document.getElementById("aiInsightBody");

    if(!body) return;

    const insights=
        generateInsights();

    body.innerHTML=

    `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:14px;">

    ${insights.map(i=>`<li>${i}</li>`).join("")}

    </ul>`;

}



// ============================================
// CHAT
// ============================================

function addChatMessage(text,sender){

    const messages=
        document.getElementById("chatMessages");

    if(!messages) return;

    const div=
        document.createElement("div");

    div.className=
        sender==="user"
        ?"msg msg-user"
        :"msg msg-ai";

    div.innerHTML=text;

    messages.appendChild(div);

    messages.scrollTop=
        messages.scrollHeight;

}
// ============================================
// GEMINI AI
// ============================================

async function answerQuestion(question){

    try{

        const response = await fetch(

            "http://127.0.0.1:5000/api/ai/chat",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    question,

                    roastMode,

                    user:USER,

                    monthlyIncome:USER.monthlyIncome,

                    categorySpend:CATEGORY_SPEND_THIS_MONTH,

                    budgets:BUDGETS,

                    monthlyTrend:MONTHLY_TREND,

                    savings:getCurrentBalance(),

                    healthScore:getFinancialHealthScore(),

                    personality:getSpendingPersonality().title

                })

            }

        );

        const data = await response.json();

        if(data.reply)
            return data.reply;

        return "🤖 I couldn't think of a good answer.";

    }

    catch(err){

        console.error(err);

        return "⚠ Unable to contact Gemini.";

    }

}



// ============================================
// CHATBOT
// ============================================

function initChatbot(){

    const toggle =
        document.getElementById("chatToggle");

    const panel =
        document.getElementById("chatPanel");

    const closeBtn =
        document.getElementById("chatClose");

    const form =
        document.getElementById("chatForm");

    const input =
        document.getElementById("chatInput");

    if(!toggle || !panel || !form) return;

    let greeted=false;

    toggle.addEventListener("click",()=>{

        panel.classList.toggle("open");

        toggle.classList.remove("attention");

        if(!greeted){

            addChatMessage(

`👋 Hi ${USER.name.split(" ")[0]}!

I'm SmartSpend AI.

📊 I know your spending.
💰 I know your budgets.
😂 I can even roast your bad financial decisions.

Ask me anything!`,

"ai"

);

            greeted=true;

        }

    });



    closeBtn.addEventListener("click",()=>{

        panel.classList.remove("open");

    });



    form.addEventListener("submit",async(e)=>{

        e.preventDefault();

        const question=input.value.trim();

        if(!question) return;

        addChatMessage(question,"user");

        input.value="";

        addChatMessage("🧠 Thinking...","ai");

        const messages=
            document.getElementById("chatMessages");

        const loading=
            messages.lastChild;

        const reply=
            await answerQuestion(question);

        loading.remove();

        addChatMessage(reply,"ai");

    });



    setTimeout(()=>{

        toggle.classList.add("attention");

    },1500);

}



// ============================================
// ROAST MODE
// ============================================

function toggleRoastMode(){

    roastMode=!roastMode;

    showToast(

        roastMode

        ? "😂 Roast Mode Enabled"

        : "😊 Roast Mode Disabled"

    );

}



// ============================================
// REFRESH
// ============================================

function refreshAI(){

    renderAIInsight();

}



// ============================================
// INIT
// ============================================

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        renderAIInsight();

    }

);



// ============================================
// GLOBAL
// ============================================

window.renderAIInsight=renderAIInsight;

window.initChatbot=initChatbot;

window.refreshAI=refreshAI;

window.toggleRoastMode=toggleRoastMode;