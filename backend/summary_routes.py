from flask import Blueprint, jsonify
from models import User, Expense, Budget
from datetime import date

summary_bp = Blueprint("summary", __name__)


@summary_bp.route("/api/summary/<int:user_id>", methods=["GET"])
def get_summary(user_id):

    user = User.query.get_or_404(user_id)

    expenses = Expense.query.filter_by(user_id=user_id).all()

    category_spend = {}

    for e in expenses:
        category_spend[e.category] = (
            category_spend.get(e.category, 0) + e.amount
        )


    budgets = []

    try:
        user_budgets = Budget.query.filter_by(user_id=user_id).all()

        for b in user_budgets:
            budgets.append({
                "category": b.category,
                "limitAmount": b.limit_amount
            })

    except Exception:
        budgets = []


    return jsonify({

        "user": {
            "name": user.name,
            "age": user.age,
            "profession": user.profession,
            "monthlyIncome": user.monthly_income,
            "currency": user.currency,
            "sampleMode": getattr(user, "sample_mode", False)
        },

        "categorySpend": category_spend,

        "budgets": budgets

    }), 200