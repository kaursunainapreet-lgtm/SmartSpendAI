from flask import Blueprint, jsonify
from datetime import date, timedelta
from models import Expense, User

analytics_bp = Blueprint("analytics", __name__)


def month_key(d):
    return d.strftime("%Y-%m")


def month_label(d):
    return d.strftime("%b")


@analytics_bp.route("/api/analytics/<int:user_id>", methods=["GET"])
def get_analytics(user_id):
    user = User.query.get_or_404(user_id)
    expenses = Expense.query.filter_by(user_id=user_id).all()

    today = date.today()

    # ---- Last 6 months ----
    months = []
    for i in range(5, -1, -1):
        m = today.month - i
        y = today.year
        while m <= 0:
            m += 12
            y -= 1
        months.append(date(y, m, 1))

    monthly_trend = []
    income_vs_expense = []
    savings_history = []
    running_balance = 0

    for m in months:
        key = month_key(m)
        total = sum(e.amount for e in expenses if month_key(e.date) == key)
        monthly_trend.append({"month": month_label(m), "amount": round(total, 2)})
        income_vs_expense.append({
            "month": month_label(m),
            "income": user.monthly_income,
            "expense": round(total, 2)
        })
        running_balance += (user.monthly_income - total)
        savings_history.append({"month": month_label(m), "amount": round(running_balance, 2)})

    # ---- Current week (Mon-Sun) ----
    weekday_today = today.weekday()
    week_start = today - timedelta(days=weekday_today)
    week_days = [week_start + timedelta(days=i) for i in range(7)]

    weekly_spend = []
    for d in week_days:
        total = sum(e.amount for e in expenses if e.date == d)
        weekly_spend.append({"day": d.strftime("%a"), "amount": round(total, 2)})

    return jsonify({
        "monthlyTrend": monthly_trend,
        "incomeVsExpense": income_vs_expense,
        "weeklySpend": weekly_spend,
        "savingsHistory": savings_history
    }), 200