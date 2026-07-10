from flask import Blueprint, request, jsonify
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

ai_bp = Blueprint("ai", __name__)


@ai_bp.route("/api/ai/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        question = data.get("question", "")

        monthly_income = data.get("monthlyIncome", 0)

        category_spend = data.get("categorySpend", {})

        budgets = data.get("budgets", {})

        monthly_trend = data.get("monthlyTrend", [])

        savings = data.get("savings", 0)

        prompt = f"""
You are SmartSpend AI.

You are an expert financial advisor.

Use ONLY the information below.

Monthly Income:
₹{monthly_income}

Current Savings:
₹{savings}

Category Spending:
{category_spend}

Budgets:
{budgets}

Monthly Trend:
{monthly_trend}

User Question:
{question}

Rules:

1. Answer only finance questions.

2. Give practical suggestions.

3. Mention actual values whenever useful.

4. Keep the answer under 150 words.

5. Use bullet points if needed.

6. Never invent numbers.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as e:

        return jsonify({
            "reply": str(e)
        }), 500