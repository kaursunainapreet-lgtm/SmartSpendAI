from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    age = db.Column(db.Integer)
    profession = db.Column(db.String(80))

    monthly_income = db.Column(db.Float, default=0)
    currency = db.Column(db.String(5), default="₹")

    # Indicates whether the user is currently viewing Demo Mode
    sample_mode = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    expenses = db.relationship(
        "Expense",
        backref="user",
        cascade="all, delete-orphan"
    )

    budgets = db.relationship(
        "Budget",
        backref="user",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "age": self.age,
            "profession": self.profession,
            "monthlyIncome": self.monthly_income,
            "currency": self.currency,
            "sampleMode": self.sample_mode
        }


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)

    description = db.Column(db.String(255))

    payment_method = db.Column(
        db.String(50),
        default="UPI"
    )

    date = db.Column(db.Date, nullable=False)

    is_split = db.Column(db.Boolean, default=False)
    split_group_id = db.Column(db.String(50))

    # NEW
    is_demo = db.Column(db.Boolean, default=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "category": self.category,
            "description": self.description,
            "paymentMethod": self.payment_method,
            "date": self.date.isoformat(),
            "isSplit": self.is_split,
            "splitGroupId": self.split_group_id,
            "isDemo": self.is_demo
        }


class Budget(db.Model):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    category = db.Column(db.String(50), nullable=False)

    limit_amount = db.Column(
        db.Float,
        nullable=False
    )

    month = db.Column(db.String(7))

    # NEW
    is_demo = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "limitAmount": self.limit_amount,
            "month": self.month,
            "isDemo": self.is_demo
        }