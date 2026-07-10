// ============================================
// SMARTSPEND AI — TOAST NOTIFICATIONS
// ============================================

let toastTimeout = null;

function showToast(message, type = "success") {

    let container = document.getElementById("toastContainer");

    if (!container) {

        container = document.createElement("div");
        container.id = "toastContainer";

        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.zIndex = "99999";

        document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    let bg = "#4FA79A";

    if (type === "error")
        bg = "#C1553C";

    if (type === "warning")
        bg = "#C9A227";

    toast.style.background = bg;
    toast.style.color = "#fff";
    toast.style.padding = "14px 18px";
    toast.style.marginBottom = "12px";
    toast.style.borderRadius = "12px";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 10px 30px rgba(0,0,0,.25)";
    toast.style.transform = "translateX(120%)";
    toast.style.transition = ".35s ease";
    toast.style.minWidth = "250px";

    toast.innerHTML = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {

        toast.style.transform = "translateX(0)";

    });

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.style.transform = "translateX(120%)";

        setTimeout(() => {

            toast.remove();

        }, 350);

    }, 3000);

}