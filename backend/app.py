from flask import Flask, jsonify
from flask_cors import CORS

from models import db

from auth_routes import auth_bp, bcrypt
from expense_routes import expense_bp
from analytics_routes import analytics_bp
from summary_routes import summary_bp
from ai_routes import ai_bp

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///smartspend.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "dev-secret-change-this-later"

db.init_app(app)
bcrypt.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(summary_bp)
app.register_blueprint(ai_bp)

with app.app_context():
    db.create_all()


@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "SmartSpend AI backend is running"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)