from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
import uuid

from models import db, Expense, Budget, User

expense_bp = Blueprint("expenses", __name__)


# ==========================================================
# Helper
# ==========================================================

def is_demo_mode(user):
    return bool(user.sample_mode)


# ==========================================================
# Expenses
# ==========================================================

@expense_bp.route("/api/expenses/<int:user_id>", methods=["GET"])
def get_expenses(user_id):

    user = User.query.get_or_404(user_id)

    expenses = (
        Expense.query
        .filter_by(
            user_id=user_id,
            is_demo=is_demo_mode(user)
        )
        .order_by(Expense.date.desc())
        .all()
    )

    return jsonify([e.to_dict() for e in expenses]), 200


@expense_bp.route("/api/expenses/<int:user_id>", methods=["POST"])
def add_expense(user_id):

    user = User.query.get_or_404(user_id)

    if user.sample_mode:
        return jsonify({
            "error": "Cannot add expenses while Demo Mode is active."
        }), 400

    data = request.get_json()

    amount = data.get("amount")
    categories = data.get("categories")

    desc = data.get("description", "")
    date_str = data.get("date")
    payment = data.get("paymentMethod", "UPI")

    if not amount or not categories or not date_str:
        return jsonify({
            "error":
            "amount, categories and date are required"
        }), 400

    exp_date = datetime.strptime(
        date_str,
        "%Y-%m-%d"
    ).date()

    is_split = len(categories) > 1

    split_id = (
        str(uuid.uuid4())[:8]
        if is_split
        else None
    )

    count = len(categories)

    base = round(amount / count, 2)

    created = []

    for i, cat in enumerate(categories):

        portion = (
            base
            if i < count - 1
            else round(
                amount - base * (count - 1),
                2
            )
        )

        expense = Expense(
            user_id=user_id,
            amount=portion,
            category=cat,
            description=desc,
            payment_method=payment,
            date=exp_date,
            is_split=is_split,
            split_group_id=split_id,
            is_demo=False
        )

        db.session.add(expense)
        created.append(expense)

    db.session.commit()

    return jsonify(
        [e.to_dict() for e in created]
    ), 201


@expense_bp.route("/api/expenses/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):

    expense = Expense.query.get_or_404(expense_id)

    if expense.is_demo:
        return jsonify({
            "error":
            "Demo expenses cannot be deleted."
        }), 400

    db.session.delete(expense)
    db.session.commit()

    return jsonify({
        "message": "Expense deleted"
    }), 200
