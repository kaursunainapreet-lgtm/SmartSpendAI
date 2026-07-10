// ============================================
// SMARTSPEND AI — CHARTS
// ============================================

Chart.defaults.color = "#9AA7B2";
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;


const GOLD = "#C9A227";
const TEAL = "#4FA79A";
const BRICK = "#C1553C";
const GRID_COLOR = "rgba(255,255,255,0.05)";



// ============================================
// TREND CHART
// ============================================

function renderTrendChart() {

  const ctx = document.getElementById("trendChart");

  if (!ctx) return null;


  return new Chart(ctx, {

    type: "line",

    data: {

      labels: MONTHLY_TREND.map(m => m.month),

      datasets: [{

        label: "Total Expense",

        data: MONTHLY_TREND.map(m => m.amount),

        borderColor: GOLD,

        backgroundColor: "rgba(201,162,39,0.12)",

        fill: true,

        tension: 0.35,

        pointBackgroundColor: GOLD,

        pointBorderColor: "#0F1720",

        pointRadius: 4,

        pointHoverRadius: 6,

        borderWidth: 2

      }]

    },

    options: {

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {

        x: {
          grid: {
            display: false
          }
        },

        y: {

          grid: {
            color: GRID_COLOR
          },

          ticks: {
            callback: value => "₹" + value / 1000 + "k"
          }

        }

      }

    }

  });

}



// ============================================
// CATEGORY CHART
// ============================================

function renderCategoryChart() {


  const ctx = document.getElementById("categoryChart");

  if (!ctx) return null;



  const labels =
    Object.keys(CATEGORY_SPEND_THIS_MONTH)
      .filter(c => CATEGORY_SPEND_THIS_MONTH[c] > 0);



  const data =
    labels.map(c => CATEGORY_SPEND_THIS_MONTH[c]);



  const colors =
    labels.map(c => CATEGORIES[c]?.color || "#7A8A99");



  return new Chart(ctx, {


    type: "doughnut",


    data: {


      labels:
        labels.map(c =>
          `${CATEGORIES[c]?.emoji || ""} ${c}`
        ),


      datasets: [{

        data,

        backgroundColor: colors,

        borderColor: "#172431",

        borderWidth: 2

      }]


    },


    options: {


      plugins: {

        legend: {

          position: "bottom",

          labels: {

            boxWidth: 10,

            padding: 10,

            font: {
              size: 11
            }

          }

        }

      },


      cutout: "62%"

    }


  });


}



// ============================================
// INCOME VS EXPENSE CHART
// ============================================

function renderIncomeExpenseChart() {


  const ctx =
    document.getElementById("incomeExpenseChart");


  if (!ctx) return null;



  return new Chart(ctx, {


    type: "bar",


    data: {


      labels:
        INCOME_VS_EXPENSE.map(m => m.month),


      datasets: [


        {

          label: "Income",

          data:
            INCOME_VS_EXPENSE.map(m => m.income),

          backgroundColor: TEAL,

          borderRadius: 4

        },


        {

          label: "Expense",

          data:
            INCOME_VS_EXPENSE.map(m => m.expense),

          backgroundColor: BRICK,

          borderRadius: 4

        }


      ]


    },


    options: {


      plugins: {

        legend: {

          position: "bottom",

          labels: {

            boxWidth: 10,

            font: {
              size: 11
            }

          }

        }

      },


      scales: {


        x: {

          grid: {
            display: false
          }

        },


        y: {

          grid: {
            color: GRID_COLOR
          },


          ticks: {

            callback: value =>
              "₹" + value / 1000 + "k"

          }

        }


      }


    }


  });


}



// ============================================
// WEEKLY SPENDING CHART
// ============================================

function renderWeeklyChart() {


  const ctx =
    document.getElementById("weeklyChart");


  if (!ctx) return null;



  const threshold =
    (USER.monthlyIncome / 75000) * 2000 || 2000;



  return new Chart(ctx, {


    type: "bar",


    data: {


      labels:
        WEEKLY_SPEND.map(d => d.day || d.week),


      datasets: [{

        label: "Spent",


        data:
          WEEKLY_SPEND.map(d => d.amount),


        backgroundColor:
          WEEKLY_SPEND.map(d =>
            d.amount > threshold
              ? BRICK
              : GOLD
          ),


        borderRadius: 6,


        maxBarThickness: 40


      }]


    },


    options: {


      plugins: {

        legend: {

          display: false

        }

      },


      scales: {


        x: {

          grid: {
            display: false
          }

        },


        y: {

          grid: {
            color: GRID_COLOR
          },


          ticks: {

            callback: value =>
              "₹" + value

          }

        }


      }


    }


  });


}




// ============================================
// CHART INSTANCES
// ============================================


let trendChartInstance;
let categoryChartInstance;
let incomeExpenseChartInstance;
let weeklyChartInstance;




function initCharts() {


  const trend =
    document.getElementById("trendChart");


  const category =
    document.getElementById("categoryChart");


  const income =
    document.getElementById("incomeExpenseChart");


  const weekly =
    document.getElementById("weeklyChart");



  if (trend)
    trendChartInstance = renderTrendChart();



  if (category)
    categoryChartInstance = renderCategoryChart();



  if (income)
    incomeExpenseChartInstance = renderIncomeExpenseChart();



  if (weekly)
    weeklyChartInstance = renderWeeklyChart();


}




function refreshCharts() {


  [
    trendChartInstance,
    categoryChartInstance,
    incomeExpenseChartInstance,
    weeklyChartInstance

  ].forEach(chart => {


    if (chart) {

      chart.destroy();

    }


  });



  initCharts();


}