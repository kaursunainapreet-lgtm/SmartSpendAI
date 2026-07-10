// ============================================
// SMARTSPEND AI — SIGN UP FLOW
// ============================================

function initOnboardingForm() {
  const form = document.getElementById("onboardingForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("onboardError");
    errorEl.textContent = "";

    const payload = {
      name: document.getElementById("obName").value.trim(),
      email: document.getElementById("obEmail").value.trim().toLowerCase(),
      password: document.getElementById("obPassword").value,
      age: parseInt(document.getElementById("obAge").value, 10),
      profession: document.getElementById("obProfession").value,
      monthlyIncome: parseFloat(document.getElementById("obIncome").value)
    };

    if (!payload.name || !payload.email || !payload.password || !payload.age || !payload.profession || !payload.monthlyIncome) {
      errorEl.textContent = "Please fill in all fields";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || "Registration failed";
        return;
      }

      localStorage.setItem("smartspend_session", JSON.stringify(data.user));

      const submitBtn = form.querySelector(".btn-auth-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "All set ✅";

      triggerFlowerRain(2800);

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } catch (err) {
      errorEl.textContent = "Could not reach the server. Is the Flask backend running?";
    }
  });
}

document.addEventListener("DOMContentLoaded", initOnboardingForm);