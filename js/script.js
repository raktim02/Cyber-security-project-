
"use strict";

// ===================================
// 1. COMMON SETTINGS
// ===================================

const STORAGE_KEYS = {
    history: "cybershield_history_v21",
    generated: "cybershield_generated_v21",
    theme: "cybershield_theme_v21"
};

const $ = (id) => document.getElementById(id);

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch {
        return fallback;
    }
}

function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


// ===================================
// 2. PASSWORD SHOW / HIDE
// ===================================

const passwordInput = $("passwordInput");
const togglePassword = $("togglePassword");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
        }

    });
}


// ===================================
// 3. PASSWORD STRENGTH ANALYZER
// ===================================

if (passwordInput) {
    passwordInput.addEventListener("input", analyzePassword);
}

function analyzePassword() {

    const password = passwordInput.value;
    const bar = $("strengthBar");
    const text = $("strengthText");
    const feedback = $("passwordFeedback");

    if (!password) {
        bar.style.width = "0%";
        text.textContent = "Not Analyzed";
        feedback.textContent = "";
        return;
    }

    let score = 0;
    let suggestions = [];

    if (password.length >= 8) score++;
    else suggestions.push("Use at least 8 characters.");

    if (password.length >= 12) score++;

    if (/[A-Z]/.test(password)) score++;
    else suggestions.push("Add uppercase letters.");

    if (/[a-z]/.test(password)) score++;
    else suggestions.push("Add lowercase letters.");

    if (/[0-9]/.test(password)) score++;
    else suggestions.push("Add numbers.");

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else suggestions.push("Add special characters.");

    if (/(.)\1{2,}/.test(password)) {
        score = Math.max(0, score - 1);
        suggestions.push("Avoid repeating the same character.");
    }

    const commonPasswords = [
        "password", "password123", "12345678",
        "qwerty", "admin123", "letmein"
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
        score = 0;
        suggestions.push("This is a commonly used password.");
    }

    let level = "";
    let color = "";

    if (score <= 2) {
        level = "Weak";
        color = "#ef4444";
    } else if (score <= 4) {
        level = "Medium";
        color = "#f59e0b";
    } else {
        level = "Strong";
        color = "#75b82d";
    }

    bar.style.width = (score / 6 * 100) + "%";
    bar.style.background = color;

    text.textContent = "Password Strength: " + level;
    text.style.color = color;

    feedback.replaceChildren();

    if (suggestions.length === 0) {
        const p = document.createElement("p");
        p.textContent = "✓ Good character variety. Avoid reusing passwords.";
        feedback.appendChild(p);
    } else {
        suggestions.forEach(item => {
            const p = document.createElement("p");
            p.textContent = "• " + item;
            feedback.appendChild(p);
        });
    }
}


// ===================================
// 4. SECURE PASSWORD GENERATOR
// ===================================

const lengthInput = $("passwordLength");
const lengthValue = $("lengthValue");

if (lengthInput && lengthValue) {
    lengthInput.addEventListener("input", () => {
        lengthValue.textContent = lengthInput.value;
    });
}

function secureRandomIndex(max) {
    const limit = Math.floor(256 / max) * max;
    const byte = new Uint8Array(1);

    do {
        crypto.getRandomValues(byte);
    } while (byte[0] >= limit);

    return byte[0] % max;
}

function secureShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandomIndex(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateSecurePassword() {

    const length = Number(lengthInput.value);

    const groups = [];

    if ($("uppercase").checked) {
        groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    if ($("lowercase").checked) {
        groups.push("abcdefghijklmnopqrstuvwxyz");
    }

    if ($("numbers").checked) {
        groups.push("0123456789");
    }

    if ($("symbols").checked) {
        groups.push("!@#$%^&*()_+-=[]{}?");
    }

    if (groups.length === 0) {
        alert("Please select at least one character type.");
        return;
    }

    if (length < groups.length) {
        alert("Password length is too short for selected options.");
        return;
    }

    const allCharacters = groups.join("");
    const password = [];

    // Include at least one character from every selected group
    groups.forEach(group => {
        password.push(group[secureRandomIndex(group.length)]);
    });

    // Fill remaining positions
    while (password.length < length) {
        password.push(
            allCharacters[secureRandomIndex(allCharacters.length)]
        );
    }

    const result = secureShuffle(password).join("");

    $("generatedPassword").value = result;

    const count = Number(
        localStorage.getItem(STORAGE_KEYS.generated) || 0
    ) + 1;

    localStorage.setItem(STORAGE_KEYS.generated, String(count));

    updateDashboard();
}

if ($("generateBtn")) {
    $("generateBtn").addEventListener("click", generateSecurePassword);
}


// Copy Password

if ($("copyPassword")) {
    $("copyPassword").addEventListener("click", async () => {

        const password = $("generatedPassword").value;

        if (!password) {
            alert("Generate a password first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            $("copyPassword").textContent = "Copied!";

            setTimeout(() => {
                $("copyPassword").textContent = "Copy";
            }, 1500);

        } catch {
            alert("Clipboard unavailable. Please copy manually.");
        }
    });
}


// ===================================
// 5. URL ANALYZER
// ===================================

function analyzeURL(input) {

    const warnings = [];
    let parsed;

    try {
        const url = input.startsWith("http://") ||
                    input.startsWith("https://")
            ? input
            : "https://" + input;

        parsed = new URL(url);

    } catch {
        return {
            risk: "Invalid URL",
            warnings: ["Please enter a valid website URL."]
        };
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
        return {
            risk: "Invalid URL",
            warnings: ["Unsupported URL protocol."]
        };
    }

    const hostname = parsed.hostname.toLowerCase();

    if (parsed.protocol !== "https:") {
        warnings.push("Website does not use HTTPS.");
    }

    if (parsed.username || parsed.password) {
        warnings.push("URL contains embedded login information.");
    }

    if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
        warnings.push("Domain uses internationalized encoding.");
    }

    const ipv4Pattern =
        /^(?:\d{1,3}\.){3}\d{1,3}$/;

    if (ipv4Pattern.test(hostname)) {
        warnings.push("Website uses an IP address instead of a domain.");
    }

    const shorteners = [
        "bit.ly", "tinyurl.com", "t.co",
        "shorturl.at", "is.gd", "cutt.ly"
    ];

    if (shorteners.some(s => hostname === s || hostname.endsWith("." + s))) {
        warnings.push("URL uses a link shortening service.");
    }

    const suspiciousWords = [
        "login", "verify", "secure", "update",
        "account", "banking", "password"
    ];

    const lowerURL = parsed.href.toLowerCase();

    if (suspiciousWords.some(word => lowerURL.includes(word))) {
        warnings.push("URL contains words sometimes used in phishing links.");
    }

    if (parsed.href.length > 120) {
        warnings.push("URL is unusually long.");
    }

    if (parsed.port && !["80", "443"].includes(parsed.port)) {
        warnings.push("URL uses an unusual port.");
    }

    if (hostname.split(".").length > 4) {
        warnings.push("Domain has many subdomains.");
    }

    let risk = "Low Risk Indicators";

    if (warnings.length >= 3) {
        risk = "High Risk Indicators";
    } else if (warnings.length > 0) {
        risk = "Medium Risk Indicators";
    }

    return {
        risk: risk,
        warnings: warnings,
        domain: hostname
    };
}


// URL scan button

if ($("scanUrlBtn")) {
    $("scanUrlBtn").addEventListener("click", () => {

        const input = $("urlInput").value.trim();
        const result = $("urlResult");

        if (!input) {
            result.textContent = "Please enter a website URL.";
            return;
        }

        const data = analyzeURL(input);

        result.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = data.risk;
        result.appendChild(heading);

        data.warnings.forEach(warning => {
            const p = document.createElement("p");
            p.textContent = "• " + warning;
            result.appendChild(p);
        });

        if (data.warnings.length === 0) {
            const p = document.createElement("p");
            p.textContent = "No suspicious indicators were found by these basic checks.";
            result.appendChild(p);
        }

        if (data.domain) {
            const p = document.createElement("p");
            p.textContent = "Analyzed domain: " + data.domain;
            result.appendChild(p);

            saveURLHistory(data.domain, data.risk);
        }

    });
}


// ===================================
// 6. SCAN HISTORY
// ===================================

function saveURLHistory(domain, risk) {

    let history = readStorage(STORAGE_KEYS.history, []);

    if (!Array.isArray(history)) history = [];

    history.unshift({
        domain: domain,
        risk: risk,
        date: new Date().toLocaleString()
    });

    history = history.slice(0, 50);

    saveStorage(STORAGE_KEYS.history, history);

    renderHistory();
    updateDashboard();
}

function renderHistory() {

    const container = $("historyList");

    if (!container) return;

    container.replaceChildren();

    const history = readStorage(STORAGE_KEYS.history, []);

    if (!history.length) {
        const p = document.createElement("p");
        p.textContent = "No URL scans available yet.";
        container.appendChild(p);
        return;
    }

    history.forEach(item => {

        const row = document.createElement("div");
        row.className = "history-row";

        const domain = document.createElement("strong");
        domain.textContent = item.domain;

        const risk = document.createElement("span");
        risk.textContent = item.risk;
        risk.className = item.risk === "Low Risk Indicators"
            ? "risk-low"
            : "risk-warning";

        const date = document.createElement("small");
        date.textContent = item.date;

        row.append(domain, risk, date);
        container.appendChild(row);
    });
}


// Clear History

if ($("clearHistory")) {
    $("clearHistory").addEventListener("click", () => {

        if (confirm("Are you sure you want to clear scan history?")) {
            saveStorage(STORAGE_KEYS.history, []);
            renderHistory();
            updateDashboard();
        }

    });
}


// ===================================
// 7. DASHBOARD STATISTICS
// ===================================

function updateDashboard() {

    const history = readStorage(STORAGE_KEYS.history, []);

    const total = history.length;

    const warnings = history.filter(item =>
        item.risk !== "Low Risk Indicators"
    ).length;

    const generated = Number(
        localStorage.getItem(STORAGE_KEYS.generated) || 0
    );

    if ($("totalScans")) $("totalScans").textContent = total;
    if ($("warningScans")) $("warningScans").textContent = warnings;
    if ($("generatedCount")) $("generatedCount").textContent = generated;

    updateChart(history);
}


// ===================================
// 8. SECURITY ACTIVITY CHART
// ===================================

let securityChart = null;

function updateChart(history) {

    const canvas = $("securityChart");

    if (!canvas || typeof Chart === "undefined") return;

    const last7 = history.slice(0, 7).reverse();

    const labels = last7.map((item, index) => "Scan " + (index + 1));

    const values = last7.map(item =>
        item.risk === "Low Risk Indicators" ? 1 : 2
    );

    if (securityChart) {
        securityChart.destroy();
    }

    securityChart = new Chart(canvas, {
        type: "bar",

        data: {
            labels: labels,

            datasets: [{
                label: "Scan Indicator (1 = Low, 2 = Flagged)",
                data: values,
                backgroundColor: "#75b82d",
                borderRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}


// ===================================
// 9. DARK / LIGHT THEME
// ===================================

function applyTheme() {

    const theme = localStorage.getItem(STORAGE_KEYS.theme) || "dark";

    document.body.classList.toggle("light", theme === "light");

    if ($("themeToggle")) {
        $("themeToggle").textContent =
            theme === "light" ? "🌙" : "☀";
    }
}

if ($("themeToggle")) {
    $("themeToggle").addEventListener("click", () => {

        const light = document.body.classList.contains("light");

        localStorage.setItem(
            STORAGE_KEYS.theme,
            light ? "dark" : "light"
        );

        applyTheme();

    });
}


// ===================================
// 10. MOBILE SIDEBAR
// ===================================

if ($("menuToggle")) {
    $("menuToggle").addEventListener("click", () => {
        $("sidebar").classList.toggle("open");
    });
}


// ===================================
// 11. NAVIGATION ACTIVE STATE
// ===================================

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");

        if (window.innerWidth <= 850) {
            $("sidebar").classList.remove("open");
        }

    });

});


// ===================================
// 12. INITIALIZE DASHBOARD
// ===================================

applyTheme();
renderHistory();
updateDashboard();
