// ============================================
// SMARTSPEND AI — LOGIN LOGIC + FLOWER RAIN
// ============================================

const API_BASE = "http://127.0.0.1:5000";
const FLOWER_EMOJIS = ["🌸", "🌷", "🌼", "💮", "🌺", "🌻"];

function triggerFlowerRain(durationMs = 3500) {
  const container = document.getElementById("flowerRain");
  if (!container) return;

  const totalFlowers = 40;
  let dropped = 0;

  const interval = setInterval(() => {
    if (dropped >= totalFlowers) {
      clearInterval(interval);
      return;
    }
    const flower = document.createElement("span");
    flower.className = "falling-flower";
    flower.textContent = FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];
    flower.style.left = Math.random() * 100 + "vw";
    flower.style.fontSize = 18 + Math.random() * 20 + "px";
    flower.style.animationDuration = 2.5 + Math.random() * 2 + "s";
    container.appendChild(flower);
    flower.addEventListener("animationend", () => flower.remove());
    dropped++;
  }, durationMs / totalFlowers);
}

function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || "Login failed";
        return;
      }

      localStorage.setItem("smartspend_session", JSON.stringify(data.user));

      const submitBtn = form.querySelector(".btn-auth-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Login Successful ✅";

      triggerFlowerRain();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2400);
    } catch (err) {
      errorEl.textContent = "Could not reach the server. Is the Flask backend running?";
    }
  });
}

document.addEventListener("DOMContentLoaded", initLoginForm);