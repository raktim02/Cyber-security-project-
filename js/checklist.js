
// ========================================
// CyberShield 2.1 - Security Checklist
// ========================================

const checklistTasks = [
    "Use a unique password for every account",
    "Enable Two-Factor Authentication (2FA)",
    "Update operating system and applications",
    "Verify email sender before opening attachments",
    "Check website domain before entering passwords",
    "Avoid sensitive activities on untrusted public Wi-Fi",
    "Back up important files regularly",
    "Enable screen lock on your devices",
    "Review app permissions and privacy settings",
    "Never share passwords or OTP codes"
];

const CHECKLIST_KEY = "cybershield_checklist_v21";

const checklistContainer = document.getElementById("checklistItems");
const checklistLabel = document.getElementById("checklistLabel");
const checklistBar = document.getElementById("checklistBar");
const checkProgress = document.getElementById("checkProgress");

function getChecklistProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(CHECKLIST_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function saveChecklistProgress(completed) {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(completed));
}

function updateChecklistProgress(completed) {
    const total = checklistTasks.length;
    const done = completed.length;
    const percentage = Math.round((done / total) * 100);

    if (checklistLabel) {
        checklistLabel.textContent =
            `${done} of ${total} completed (${percentage}%)`;
    }

    if (checklistBar) {
        checklistBar.style.width = `${percentage}%`;
    }

    if (checkProgress) {
        checkProgress.textContent = `${percentage}%`;
    }
}

function renderChecklist() {
    if (!checklistContainer) return;

    const completed = getChecklistProgress();

    checklistContainer.replaceChildren();

    checklistTasks.forEach((task, index) => {
        const item = document.createElement("label");
        item.className = "checklist-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed.includes(index);

        const taskText = document.createElement("span");
        taskText.textContent = task;

        if (checkbox.checked) {
            item.classList.add("completed");
        }

        checkbox.addEventListener("change", () => {
            let updated = getChecklistProgress();

            if (checkbox.checked) {
                if (!updated.includes(index)) {
                    updated.push(index);
                }
                item.classList.add("completed");
            } else {
                updated = updated.filter(id => id !== index);
                item.classList.remove("completed");
            }

            saveChecklistProgress(updated);
            updateChecklistProgress(updated);
        });

        item.append(checkbox, taskText);
        checklistContainer.appendChild(item);
    });

    updateChecklistProgress(completed);
}

// Start checklist
renderChecklist();
