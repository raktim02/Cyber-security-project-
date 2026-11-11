
/* =====================================
   CyberShield 2.1 - Cybersecurity Quiz
===================================== */

const quizQuestions = [
    {
        question: "What does 2FA stand for?",
        options: [
            "Two-Factor Authentication",
            "Two File Access",
            "Two Firewall Application",
            "Two-Folder Account"
        ],
        answer: 0
    },
    {
        question: "Which password is the strongest?",
        options: [
            "123456",
            "password",
            "Raktim123",
            "T#9mQ!7vLp@2"
        ],
        answer: 3
    },
    {
        question: "What is phishing?",
        options: [
            "A computer game",
            "A cyber attack to steal information",
            "A programming language",
            "A backup method"
        ],
        answer: 1
    },
    {
        question: "What does HTTPS provide?",
        options: [
            "Encrypted communication",
            "Free internet",
            "Unlimited storage",
            "Virus removal"
        ],
        answer: 0
    },
    {
        question: "What is malware?",
        options: [
            "Useful software",
            "A web browser",
            "Malicious software",
            "An operating system"
        ],
        answer: 2
    },
    {
        question: "What should you do with a suspicious email?",
        options: [
            "Open every attachment",
            "Click every link",
            "Reply with your password",
            "Avoid clicking and verify the sender"
        ],
        answer: 3
    },
    {
        question: "What is a firewall?",
        options: [
            "A security system that filters network traffic",
            "A photo editor",
            "A music player",
            "A password generator"
        ],
        answer: 0
    },
    {
        question: "What is ransomware?",
        options: [
            "A search engine",
            "Malware that locks or encrypts files for ransom",
            "A programming tool",
            "A firewall setting"
        ],
        answer: 1
    },
    {
        question: "Why should software be updated?",
        options: [
            "To make the screen brighter",
            "To delete all files",
            "To fix bugs and security vulnerabilities",
            "To reduce password length"
        ],
        answer: 2
    },
    {
        question: "What should you never share with strangers?",
        options: [
            "Public website links",
            "Passwords and OTP codes",
            "Public news",
            "Weather information"
        ],
        answer: 1
    },
    {
        question: "What is a VPN commonly used for?",
        options: [
            "Encrypting network traffic between your device and VPN server",
            "Increasing phone storage",
            "Removing every virus",
            "Creating strong passwords"
        ],
        answer: 0
    },
    {
        question: "Which is a safe browsing practice?",
        options: [
            "Download files from unknown websites",
            "Ignore browser warnings",
            "Check website addresses before entering information",
            "Use the same password everywhere"
        ],
        answer: 2
    },
    {
        question: "What is social engineering?",
        options: [
            "Building a computer",
            "Manipulating people to reveal confidential information",
            "Creating a website",
            "Installing an operating system"
        ],
        answer: 1
    },
    {
        question: "Why is data backup important?",
        options: [
            "To increase internet speed",
            "To remove advertisements",
            "To change the operating system",
            "To recover data after loss or damage"
        ],
        answer: 3
    },
    {
        question: "What should you do if an account is compromised?",
        options: [
            "Ignore the problem",
            "Share the account with friends",
            "Change the password and secure the account",
            "Disable all security features"
        ],
        answer: 2
    }
];

const quizArea = document.getElementById("quizArea");
const startQuizButton = document.getElementById("startQuiz");

let currentQuestion = 0;
let quizScore = 0;
let quizAnswered = false;

function startCyberQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    quizAnswered = false;

    showQuizQuestion();
}

function showQuizQuestion() {
    if (!quizArea) return;

    quizAnswered = false;

    const questionData = quizQuestions[currentQuestion];

    quizArea.replaceChildren();

    const progress = document.createElement("p");
    progress.className = "quiz-question";
    progress.textContent =
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    const questionTitle = document.createElement("h3");
    questionTitle.textContent = questionData.question;

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "quiz-options";

    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "btn-primary";
    nextButton.textContent = "Next Question";
    nextButton.hidden = true;

    questionData.options.forEach((option, index) => {
        const optionButton = document.createElement("button");

        optionButton.type = "button";
        optionButton.className = "quiz-option";
        optionButton.textContent = option;

        optionButton.addEventListener("click", () => {
            if (quizAnswered) return;

            quizAnswered = true;

            const isCorrect = index === questionData.answer;

            if (isCorrect) {
                quizScore++;
                feedback.textContent = "Correct! Well done.";
                feedback.classList.add("correct");
            } else {
                feedback.textContent =
                    `Incorrect. Correct answer: ${questionData.options[questionData.answer]}`;
                feedback.classList.add("incorrect");
            }

            questionData.options.forEach((unused, optionIndex) => {
                const button = optionsContainer.children[optionIndex];

                button.disabled = true;

                if (optionIndex === questionData.answer) {
                    button.classList.add("correct");
                } else if (optionIndex === index) {
                    button.classList.add("incorrect");
                }
            });

            nextButton.hidden = false;
        });

        optionsContainer.appendChild(optionButton);
    });

    nextButton.addEventListener("click", () => {
        currentQuestion++;

        if (currentQuestion < quizQuestions.length) {
            showQuizQuestion();
        } else {
            showQuizResult();
        }
    });

    quizArea.append(
        progress,
        questionTitle,
        optionsContainer,
        feedback,
        nextButton
    );
}

function showQuizResult() {
    quizArea.replaceChildren();

    const percentage = Math.round(
        (quizScore / quizQuestions.length) * 100
    );

    const heading = document.createElement("h2");
    heading.textContent = "Quiz Completed!";

    const score = document.createElement("h3");
    score.textContent =
        `Your Score: ${quizScore}/${quizQuestions.length}`;

    const result = document.createElement("p");
    result.textContent = `Your Result: ${percentage}%`;

    const message = document.createElement("p");

    if (percentage >= 80) {
        message.textContent = "Excellent! You have strong cybersecurity awareness.";
    } else if (percentage >= 50) {
        message.textContent = "Good effort! Keep learning cybersecurity.";
    } else {
        message.textContent = "Keep practicing to improve your cybersecurity knowledge.";
    }

    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.className = "btn-primary";
    restartButton.textContent = "Restart Quiz";
    restartButton.addEventListener("click", startCyberQuiz);

    quizArea.append(
        heading,
        score,
        result,
        message,
        restartButton
    );
}

if (startQuizButton) {
    startQuizButton.addEventListener("click", startCyberQuiz);
}
