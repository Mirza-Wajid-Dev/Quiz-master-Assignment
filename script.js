
// ======================================
// QuizMaster - Interactive Quiz App
// ======================================

// Questions Bank
const questionsBank = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Machine Language",
            "Home Tool Markup Language"
        ],
        answer: 0
    },
    {
        question: "Which language is used to style web pages?",
        options: ["HTML", "CSS", "Python", "SQL"],
        answer: 1
    },
    {
        question: "Which HTML tag creates a hyperlink?",
        options: ["<link>", "<href>", "<a>", "<url>"],
        answer: 2
    },
    {
        question: "Which keyword declares a constant in JavaScript?",
        options: ["var", "let", "const", "static"],
        answer: 2
    },
    {
        question: "Which CSS property changes text color?",
        options: [
            "font-style",
            "background-color",
            "text-decoration",
            "color"
        ],
        answer: 3
    },
    {
        question: "Which HTML tag displays an image?",
        options: ["<picture>", "<img>", "<image>", "<src>"],
        answer: 1
    },
    {
        question: "Which JavaScript method selects an element by ID?",
        options: [
            "document.getElementById()",
            "document.getElements()",
            "document.querySelectorAllId()",
            "window.getId()"
        ],
        answer: 0
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Creative Style System",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        answer: 2
    },
    {
        question: "Which Bootstrap class creates a responsive container?",
        options: [".box", ".container", ".responsive", ".wrapper"],
        answer: 1
    },
    {
        question: "Which symbol creates a single-line JavaScript comment?",
        options: ["<!-- -->", "**", "//", "##"],
        answer: 2
    }
];

// Quiz Settings
const TOTAL_QUESTIONS = 5;
const TOTAL_TIME = 120;

// Quiz Variables
let questions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = [];
let timeLeft = TOTAL_TIME;
let timerInterval = null;
let quizFinished = false;

// Get HTML Elements
const themeToggle = document.getElementById("themeToggle");
const timer = document.getElementById("timer");

const stageTitle = document.getElementById("stageTitle");

const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

const welcomePanel = document.getElementById("welcomePanel");
const quizPanel = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const downloadBtn = document.getElementById("downloadBtn");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");
const answeredHint = document.getElementById("answeredHint");

const resultHeading = document.getElementById("resultHeading");
const resultMessage = document.getElementById("resultMessage");
const finalScore = document.getElementById("finalScore");
const finalPercent = document.getElementById("finalPercent");
const finalTime = document.getElementById("finalTime");
const resultBreakdown = document.getElementById("resultBreakdown");

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}

// Start Quiz
function startQuiz() {
    clearInterval(timerInterval);

    questions = shuffleArray(questionsBank).slice(0, TOTAL_QUESTIONS);

    currentIndex = 0;
    score = 0;
    userAnswers = [];
    timeLeft = TOTAL_TIME;
    quizFinished = false;

    welcomePanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    quizPanel.classList.remove("hidden");

    stageTitle.textContent = "Quiz in progress";

    nextBtn.disabled = true;
    nextBtn.textContent = "Next Question →";

    updateTimer();
    updateProgress();
    showQuestion();

    timerInterval = setInterval(() => {
        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

// Show Question
function showQuestion() {
    if (currentIndex >= questions.length) {
        finishQuiz();
        return;
    }

    const question = questions[currentIndex];

    questionNumber.textContent =
        `QUESTION ${String(currentIndex + 1).padStart(2, "0")}`;

    questionText.textContent = question.question;

    optionsContainer.innerHTML = "";

    feedback.textContent = "";
    feedback.classList.add("hidden");

    answeredHint.textContent = "Choose the best answer";

    nextBtn.disabled = true;
    nextBtn.textContent =
        currentIndex === questions.length - 1
            ? "View Results →"
            : "Next Question →";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "option-btn";
        button.textContent = option;

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        optionsContainer.appendChild(button);
    });

    updateProgress();
}

// Select Answer
function selectAnswer(selectedIndex) {
    if (
        quizFinished ||
        userAnswers[currentIndex] !== undefined
    ) {
        return;
    }

    const question = questions[currentIndex];
    const buttons = optionsContainer.querySelectorAll("button");

    userAnswers[currentIndex] = selectedIndex;

    const correct = selectedIndex === question.answer;

    if (correct) {
        score++;

        feedback.textContent = "Correct! Great job! ✓";
        feedback.classList.remove("hidden");
        feedback.classList.remove("incorrect");
        feedback.classList.add("correct");
    } else {
        feedback.textContent =
            `Incorrect! Correct answer: ${question.options[question.answer]}`;

        feedback.classList.remove("hidden");
        feedback.classList.remove("correct");
        feedback.classList.add("incorrect");
    }

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && !correct) {
            button.classList.add("incorrect");
        }
    });

    answeredHint.textContent = correct
        ? "You earned 1 point!"
        : "Keep going!";

    nextBtn.disabled = false;

    updateProgress();
}

// Next Question
function nextQuestion() {
    if (
        quizFinished ||
        userAnswers[currentIndex] === undefined
    ) {
        return;
    }

    currentIndex++;

    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

// Update Progress Bar
function updateProgress() {
    const answeredCount = userAnswers.filter(
        answer => answer !== undefined
    ).length;

    const percentage = Math.round(
        (answeredCount / TOTAL_QUESTIONS) * 100
    );

    progressText.textContent =
        `${answeredCount} of ${TOTAL_QUESTIONS} answered`;

    progressPercent.textContent = `${percentage}%`;

    const segments = progressBar.querySelectorAll(".segment");

    segments.forEach((segment, index) => {
        segment.classList.remove(
            "active",
            "completed",
            "correct-segment",
            "incorrect-segment"
        );

        if (index < answeredCount) {
            segment.classList.add("completed");

            if (userAnswers[index] === questions[index]?.answer) {
                segment.classList.add("correct-segment");
            } else {
                segment.classList.add("incorrect-segment");
            }
        } else if (
            index === currentIndex &&
            !quizFinished
        ) {
            segment.classList.add("active");
        }
    });
}

// Update Timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

    timer.classList.toggle("timer-danger", timeLeft <= 20);
}

// Finish Quiz
function finishQuiz() {
    if (quizFinished) {
        return;
    }

    quizFinished = true;

    clearInterval(timerInterval);

    quizPanel.classList.add("hidden");
    welcomePanel.classList.add("hidden");
    resultPanel.classList.remove("hidden");

    stageTitle.textContent = "Quiz completed";

    const percentage = Math.round(
        (score / TOTAL_QUESTIONS) * 100
    );

    const timeUsed = TOTAL_TIME - timeLeft;

    finalScore.textContent = `${score}/${TOTAL_QUESTIONS}`;
    finalPercent.textContent = `${percentage}%`;

    const usedMinutes = Math.floor(timeUsed / 60);
    const usedSeconds = timeUsed % 60;

    finalTime.textContent =
        `${String(usedMinutes).padStart(2, "0")}:` +
        `${String(usedSeconds).padStart(2, "0")}`;

    resultHeading.textContent =
        percentage >= 80
            ? "Excellent Work! 🏆"
            : percentage >= 60
                ? "Good Job! 🎉"
                : "Keep Practicing! 💪";

    resultMessage.textContent =
        `You answered ${userAnswers.filter(
            answer => answer !== undefined
        ).length} out of ${TOTAL_QUESTIONS} questions. Your score is ${percentage}%.`;

    resultBreakdown.innerHTML = "";

    questions.forEach((question, index) => {
        const selectedAnswer = userAnswers[index];

        const isCorrect = selectedAnswer === question.answer;

        const item = document.createElement("div");
        item.className = "result-item";

        const title = document.createElement("h5");
        title.textContent = `${index + 1}. ${question.question}`;

        const yourAnswer = document.createElement("p");
        yourAnswer.textContent =
            "Your answer: " +
            (selectedAnswer === undefined
                ? "Not answered"
                : question.options[selectedAnswer]);

        const correctAnswer = document.createElement("p");
        correctAnswer.textContent =
            "Correct answer: " + question.options[question.answer];

        yourAnswer.classList.add(
            isCorrect ? "correct-text" : "incorrect-text"
        );

        item.appendChild(title);
        item.appendChild(yourAnswer);
        item.appendChild(correctAnswer);

        resultBreakdown.appendChild(item);
    });

    updateProgress();
}

// Restart Quiz
function restartQuiz() {
    clearInterval(timerInterval);

    currentIndex = 0;
    score = 0;
    userAnswers = [];
    timeLeft = TOTAL_TIME;
    quizFinished = false;

    resultPanel.classList.add("hidden");
    quizPanel.classList.add("hidden");
    welcomePanel.classList.remove("hidden");

    stageTitle.textContent = "Ready to begin?";

    timer.classList.remove("timer-danger");

    updateTimer();
    updateProgress();
}

// Download Results as PDF
function downloadPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert(
            "PDF library load nahi hui. Internet connection check karein."
        );
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const percentage = Math.round(
        (score / TOTAL_QUESTIONS) * 100
    );

    pdf.setFontSize(20);
    pdf.text("QuizMaster - Quiz Results", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Score: ${score}/${TOTAL_QUESTIONS}`, 20, 35);
    pdf.text(`Accuracy: ${percentage}%`, 20, 43);
    pdf.text(`Time Used: ${finalTime.textContent}`, 20, 51);

    let y = 65;

    questions.forEach((question, index) => {
        const selectedAnswer = userAnswers[index];

        const yourAnswer = selectedAnswer === undefined
            ? "Not answered"
            : question.options[selectedAnswer];

        const correctAnswer = question.options[question.answer];

        const lines = pdf.splitTextToSize(
            `${index + 1}. ${question.question}\n` +
            `Your answer: ${yourAnswer}\n` +
            `Correct answer: ${correctAnswer}`,
            170
        );

        if (y + lines.length * 7 > 275) {
            pdf.addPage();
            y = 20;
        }

        pdf.text(lines, 20, y);
        y += lines.length * 7 + 6;
    });

    pdf.save("QuizMaster-Results.pdf");
}

// Dark / Light Mode
function toggleTheme() {
    document.body.classList.toggle("light-mode");

    const lightMode =
        document.body.classList.contains("light-mode");

    themeToggle.textContent = lightMode ? "🌙" : "☀️";

    themeToggle.setAttribute(
        "aria-label",
        lightMode ? "Switch to dark mode" : "Switch to light mode"
    );
}

// Button Events
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);
downloadBtn.addEventListener("click", downloadPDF);
themeToggle.addEventListener("click", toggleTheme);

// Initial Setup
updateTimer();
updateProgress();

