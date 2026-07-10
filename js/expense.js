// ============================================
// SMARTSPEND AI — ADD EXPENSE FLOW
// Supports Normal Mode + Demo Mode
// ============================================

function populateCategoryDropdown() {

    const select =
        document.getElementById("expCategory");

    if (!select) return;

    select.innerHTML =
        Object.keys(CATEGORIES)

        .map(cat =>

            `<option value="${cat}">
                ${CATEGORIES[cat].emoji} ${cat}
            </option>`

        )

        .join("");

}



function populateSplitCheckboxList() {

    const list =
        document.getElementById("splitCheckboxList");

    if (!list) return;

    list.innerHTML =
        Object.keys(CATEGORIES)

        .map(cat =>

            `
            <label>

                <input
                    type="checkbox"
                    class="split-cat-checkbox"
                    value="${cat}"
                >

                ${CATEGORIES[cat].emoji}
                ${cat}

            </label>
            `

        )

        .join("");

    list.querySelectorAll(".split-cat-checkbox")

        .forEach(box => {

            box.addEventListener(
                "change",
                updateSplitPreview
            );

        });

}



function getCheckedSplitCategories() {

    return Array.from(

        document.querySelectorAll(
            ".split-cat-checkbox:checked"
        )

    )

    .map(box => box.value);

}



function computeSplitAllocations(

    amount,
    categories

) {

    const n = categories.length;

    if (n === 0) return [];

    const base =
        Math.floor((amount / n) * 100) / 100;

    const allocations =
        categories.map(() => base);

    allocations[n - 1] =

        Math.round(

            (amount - base * (n - 1)) * 100

        ) / 100;

    return allocations;

}



function updateSplitPreview() {

    const preview =
        document.getElementById("splitPreview");

    if (!preview) return;

    const amount =

        parseFloat(

            document.getElementById("expAmount").value

        ) || 0;

    const categories =
        getCheckedSplitCategories();

    if (categories.length === 0) {

        preview.innerHTML =
            "Select categories to preview the split.";

        return;

    }

    const allocations =

        computeSplitAllocations(

            amount,
            categories

        );

    preview.innerHTML =

        categories

        .map(

            (cat, i) =>

                `${CATEGORIES[cat].emoji}
                 ${cat} :
                 ₹${allocations[i].toLocaleString("en-IN")}`

        )

        .join("<br>");

}
// ============================================
// SUBMIT EXPENSE
// ============================================

async function submitExpense({

    amount,
    categories,
    desc,
    date,
    payment

}) {

    try {

        await apiPost(

            `/api/expenses/${USER.id}`,

            {

                amount,
                categories,
                description: desc,
                date,
                paymentMethod: payment

            }

        );

        await refreshEverything();

        // =====================================
        // SMART NOTIFICATIONS
        // =====================================

        categories.forEach(category => {

            runSmartNotifications(

                category,

                amount / categories.length

            );

        });

        // =====================================

        showToast(

            categories.length > 1

                ? `✅ Split ₹${amount.toLocaleString("en-IN")} across ${categories.length} categories`

                : `✅ Added ₹${amount.toLocaleString("en-IN")} to ${categories[0]}`

        );

    }

    catch (err) {

        console.error(err);

        showToast("❌ " + err.message);

    }

}



// ============================================
// INITIALIZE EXPENSE FORM
// ============================================

function initExpenseForm() {

    populateCategoryDropdown();

    populateSplitCheckboxList();



    const overlay =

        document.getElementById("expenseModalOverlay");



    const openBtn =

        document.getElementById("addExpenseBtn");



    const closeBtn =

        document.getElementById("closeExpenseModal");



    const form =

        document.getElementById("expenseForm");



    const splitToggle =

        document.getElementById("expSplitToggle");



    const singleWrap =

        document.getElementById("singleCategoryWrap");



    const splitWrap =

        document.getElementById("splitCategoryWrap");



    const amountInput =

        document.getElementById("expAmount");



    if (!overlay || !form) return;



    document.getElementById("expDate").valueAsDate =
        new Date();



// ============================================
// OPEN MODAL
// ============================================

    openBtn.addEventListener("click", () => {

        if (USER.sampleMode) {

            showToast(

                "👀 Demo Mode is active. Exit Demo Mode to add expenses."

            );

            return;

        }

        overlay.classList.add("open");

    });



// ============================================
// CLOSE MODAL
// ============================================

    closeBtn.addEventListener("click", () => {

        overlay.classList.remove("open");

    });



    overlay.addEventListener("click", e => {

        if (e.target === overlay)

            overlay.classList.remove("open");

    });



// ============================================
// SPLIT MODE
// ============================================

    splitToggle.addEventListener("change", () => {

        if (splitToggle.checked) {

            singleWrap.classList.add("hidden");

            splitWrap.classList.remove("hidden");

            updateSplitPreview();

        }

        else {

            singleWrap.classList.remove("hidden");

            splitWrap.classList.add("hidden");

        }

    });



    amountInput.addEventListener("input", () => {

        if (splitToggle.checked)

            updateSplitPreview();

    });
    // ============================================
// FORM SUBMIT
// ============================================

    form.addEventListener("submit", async e => {

        e.preventDefault();

        if (USER.sampleMode) {

            showToast(
                "🚫 Exit Demo Mode before adding expenses."
            );

            return;

        }

        const amount =
            parseFloat(amountInput.value);

        const desc =
            document
                .getElementById("expDesc")
                .value
                .trim();

        const date =
            document
                .getElementById("expDate")
                .value;

        const payment =
            document
                .getElementById("expPayment")
                .value;

        if (!amount || amount <= 0) {

            showToast("Enter a valid amount.");

            return;

        }

        if (!desc) {

            showToast("Please enter a description.");

            return;

        }

        let categories = [];

        if (splitToggle.checked) {

            categories =
                getCheckedSplitCategories();

            if (categories.length < 2) {

                showToast(
                    "Choose at least two categories."
                );

                return;

            }

        }

        else {

            categories = [

                document
                    .getElementById("expCategory")
                    .value

            ];

        }

        await submitExpense({

            amount,
            categories,
            desc,
            date,
            payment

        });

        form.reset();

        document
            .getElementById("expDate")
            .valueAsDate = new Date();

        singleWrap.classList.remove("hidden");

        splitWrap.classList.add("hidden");

        document

            .querySelectorAll(".split-cat-checkbox")

            .forEach(box => {

                box.checked = false;

            });

        overlay.classList.remove("open");

    });

}



// ============================================
// ENABLE / DISABLE BUTTON
// ============================================

function updateExpenseButtonState() {

    const btn =
        document.getElementById("addExpenseBtn");

    if (!btn) return;

    if (USER.sampleMode) {

        btn.disabled = true;

        btn.innerHTML = "🔒 Demo Mode";

        btn.classList.add("disabled");

    }

    else {

        btn.disabled = false;

        btn.innerHTML = "+ Add Expense";

        btn.classList.remove("disabled");

    }

}