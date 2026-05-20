let currentQuestionIdx = 0;
let score = 0;
let selectedOptionIdx = null;
let isSubmitted = false;

const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const hintBtn = document.getElementById('hint-btn');
const hintBox = document.getElementById('hint-box');
const hintText = document.getElementById('hint-text');
const themeToggle = document.getElementById('theme-toggle');

const questionIndicator = document.getElementById('question-indicator');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreCounter = document.getElementById('score-counter');
const progressBar = document.getElementById('progress-bar');

const headerTitle = document.querySelector('.header-title h1');
const headerSubtitle = document.querySelector('.header-title p');
const welcomeTitle = document.querySelector('.welcome h2');
const welcomeDescription = document.querySelector('.welcome p');

const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const faviconLink = document.getElementById('favicon-link');

const registrationScreen = document.getElementById('registration-screen');
const userForm = document.getElementById('user-form');
const userNameInput = document.getElementById('user-name');
const userEmailInput = document.getElementById('user-email');
const formError = document.getElementById('form-error');
const userGreeting = document.getElementById('user-greeting');

let timerInterval = null;
let startTime = null;
let elapsedTime = 0;

const timerContainer = document.getElementById('timer-container');
const timerDisplay = document.getElementById('timer');
const currentScoreDisplay = document.getElementById('current-score');
const scoreDisplay = document.getElementById('score-display');
const userMenuBtn = document.getElementById('user-menu-btn');

const userDialog = document.getElementById('user-dialog');
const closeDialogBtn = document.getElementById('close-dialog');
const dialogOverlay = document.querySelector('.dialog-overlay');
const dialogUserName = document.getElementById('dialog-user-name');
const dialogUserEmail = document.getElementById('dialog-user-email');
const resetUserBtn = document.getElementById('reset-user-btn');
const scoreHistoryList = document.getElementById('score-history-list');

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getUserFromStorage() {
    const userData = localStorage.getItem('quizUserData');
    return userData ? JSON.parse(userData) : null;
}

function saveUserToStorage(name, email) {
    const userData = { name, email };
    localStorage.setItem('quizUserData', JSON.stringify(userData));
}

function clearAllData() {
    localStorage.removeItem('quizUserData');
    localStorage.removeItem('theme');
    localStorage.removeItem('quizScoreHistory');
    window.location.reload();
}

function validateEmail(email) {
    const allowedDomain = quizUser.allowedDomain;
    const emailPattern = new RegExp(`^[\\w.-]+@${allowedDomain}$`, 'i');
    return emailPattern.test(email);
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    timerDisplay.textContent = "00:00";
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function getScoreHistory() {
    const history = localStorage.getItem('quizScoreHistory');
    return history ? JSON.parse(history) : [];
}

function getMessageByScore(score, totalQuestions, timeSpent, userName) {
    const percent = (score / totalQuestions) * 100;
    const timeFormatted = formatTime(timeSpent);
    let level, message;
    
    if (percent === 100) level = 'perfect';
    else if (percent >= 70) level = 'excellent';
    else if (percent >= 60) level = 'good';
    else if (percent >= 30) level = 'needsImprovement';
    else level = 'poor';
    
    const messages = quizMessages[level];
    message = messages[Math.floor(Math.random() * messages.length)];
    
    const exclamationMatch = message.match(/!|\./);
    if (exclamationMatch) {
        const matchIndex = exclamationMatch.index;
        const afterPunct = message.slice(matchIndex + 1).trim();
        message = message.slice(0, matchIndex + 1) + ' ' + userName + ', ' + afterPunct;
    } else {
        message = message + ', ' + userName;
    }
    
    if (percent >= 70) {
        message += ` Lo completaste en ${timeFormatted}.`;
    } else {
        message += ` Tiempo: ${timeFormatted}.`;
    }
    
    return message;
}

function saveScoreToHistory(score, totalQuestions, timeSpent) {
    const percent = (score / totalQuestions) * 100;
    const savedUser = getUserFromStorage();
    const userName = savedUser ? savedUser.name : 'Usuario';
    const message = getMessageByScore(score, totalQuestions, timeSpent, userName);
    
    const history = getScoreHistory();
    const attempt = {
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        score: score,
        total: totalQuestions,
        time: timeSpent,
        percent: percent,
        message: message
    };
    history.push(attempt);
    if (history.length > 10) {
        history.shift();
    }
    localStorage.setItem('quizScoreHistory', JSON.stringify(history));
    return message;
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `${score}/${quizData.length}`;
}

function showRegistration() {
    welcomeScreen.classList.add('hidden');
    welcomeScreen.classList.remove('active');
    quizScreen.classList.add('hidden');
    quizScreen.classList.remove('active');
    resultScreen.classList.add('hidden');
    resultScreen.classList.remove('active');
    registrationScreen.classList.remove('hidden');
    registrationScreen.classList.add('active');
}

function showWelcome() {
    registrationScreen.classList.add('hidden');
    registrationScreen.classList.remove('active');
    welcomeScreen.classList.remove('hidden');
    welcomeScreen.classList.add('active');
}

userForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    
    if (!name) {
        formError.textContent = 'Por favor ingresa tu nombre';
        formError.classList.remove('hidden');
        return;
    }
    
    if (!validateEmail(email)) {
        formError.textContent = `El email debe ser del dominio @${quizUser.allowedDomain}`;
        formError.classList.remove('hidden');
        return;
    }
    
    formError.classList.add('hidden');
    saveUserToStorage(name, email);
    userGreeting.querySelector('.user-name').textContent = `Hola, ${name}`;
    userGreeting.querySelector('.user-email').textContent = email;
    userGreeting.classList.remove('hidden');
    showWelcome();
});

userMenuBtn.addEventListener('click', function() {
    const savedUser = getUserFromStorage();
    if (savedUser) {
        dialogUserName.textContent = savedUser.name;
        dialogUserEmail.textContent = savedUser.email;
    }
    renderScoreHistory();
    userDialog.classList.remove('hidden');
});

const userMenuBtnResults = document.getElementById('user-menu-btn-results');
if (userMenuBtnResults) {
    userMenuBtnResults.addEventListener('click', function() {
        const savedUser = getUserFromStorage();
        if (savedUser) {
            dialogUserName.textContent = savedUser.name;
            dialogUserEmail.textContent = savedUser.email;
        }
        renderScoreHistory();
        userDialog.classList.remove('hidden');
    });
}

function closeDialog() {
    userDialog.classList.add('hidden');
}

closeDialogBtn.addEventListener('click', closeDialog);
dialogOverlay.addEventListener('click', closeDialog);

resetUserBtn.addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas reiniciar el usuario? Esto borrará todos los datos y el historial.')) {
        clearAllData();
    }
});

function renderScoreHistory() {
    const history = getScoreHistory();
    if (history.length === 0) {
        scoreHistoryList.innerHTML = '<li class="empty-history">Sin intentos registrados</li>';
        return;
    }
    
    const sortedHistory = [...history].sort((a, b) => {
        if (b.percent !== a.percent) {
            return b.percent - a.percent;
        }
        return a.time - b.time;
    });
    
    scoreHistoryList.innerHTML = sortedHistory.map(attempt => `
        <li>
            <div class="attempt-info">
                <span class="attempt-date">${attempt.date}</span>
                <span class="attempt-score">${attempt.score}/${attempt.total}</span>
            </div>
            <p class="attempt-message">${attempt.message || ''}</p>
        </li>
    `).join('');
}

function shuffleQuiz() {
    const shuffledQuestions = shuffleArray(quizData);
    shuffledQuestions.forEach(question => {
        question.options = shuffleArray(question.options);
    });
    quizData.length = 0;
    quizData.push(...shuffledQuestions);
}

function loadQuizInfo() {
    headerTitle.textContent = quizInfo.title;
    headerSubtitle.textContent = quizInfo.subtitle;
    welcomeTitle.textContent = quizInfo.welcomeTitle;
    welcomeDescription.textContent = quizInfo.welcomeDescription;
    document.title = quizInfo.pageTitle;
    
    const savedUser = getUserFromStorage();
    if (savedUser) {
        userGreeting.querySelector('.user-name').textContent = `Hola, ${savedUser.name}`;
        userGreeting.querySelector('.user-email').textContent = savedUser.email;
        userGreeting.classList.remove('hidden');
    }
}

shuffleQuiz();
loadQuizInfo();

const savedUser = getUserFromStorage();
if (!savedUser) {
    showRegistration();
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', handleNextBtnAction);
restartBtn.addEventListener('click', restartQuiz);
hintBtn.addEventListener('click', toggleHint);
themeToggle.addEventListener('click', toggleTheme);

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        setLightTheme();
    } else {
        setDarkTheme();
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    if (isDark) {
        setLightTheme();
        localStorage.setItem('theme', 'light');
    } else {
        setDarkTheme();
        localStorage.setItem('theme', 'dark');
    }
}

function setDarkTheme() {
    document.body.classList.add('dark');
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
    faviconLink.setAttribute('href', 'img/favicon-dark.svg');
}

function setLightTheme() {
    document.body.classList.remove('dark');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
    faviconLink.setAttribute('href', 'img/favicon.svg');
}

initTheme();

function startQuiz() {
    welcomeScreen.classList.add('hidden');
    welcomeScreen.classList.remove('active');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('active');
    
    timerContainer.classList.remove('hidden');
    currentScoreDisplay.classList.remove('hidden');
    userMenuBtn.classList.remove('hidden');
    
    updateScoreDisplay();
    startTimer();
    loadQuestion();
}

function loadQuestion() {
    isSubmitted = false;
    selectedOptionIdx = null;
    hintBox.classList.remove('show');

    const currentQuestion = quizData[currentQuestionIdx];

    questionIndicator.textContent = `Pregunta ${currentQuestionIdx + 1} de ${quizData.length}`;
    questionText.textContent = currentQuestion.question;
    hintText.textContent = currentQuestion.hint;

    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'option-wrapper';

        const button = document.createElement('button');
        button.className = 'option';
        button.dataset.idx = idx;
        button.innerHTML = `
            <span class="option-letter">${getLetter(idx)}</span>
            <span class="option-text">${option.text}</span>
        `;
        button.addEventListener('click', () => selectOption(idx, button));

        const feedback = document.createElement('div');
        feedback.className = 'option-feedback';
        feedback.dataset.idx = idx;

        wrapper.appendChild(button);
        wrapper.appendChild(feedback);
        optionsContainer.appendChild(wrapper);
    });

    nextBtn.disabled = true;
    nextBtn.innerHTML = `
        <span>Comprobar respuesta</span>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
    `;

    const progressPercent = ((currentQuestionIdx) / quizData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

function selectOption(idx, optionButton) {
    if (isSubmitted) return;

    selectedOptionIdx = idx;
    nextBtn.disabled = false;

    const buttons = optionsContainer.querySelectorAll('.option');
    buttons.forEach((btn, i) => {
        btn.classList.remove('selected', 'disabled');
        if (i === idx) {
            btn.classList.add('selected');
        }
    });
}

function handleNextBtnAction() {
    if (!isSubmitted) {
        checkAnswer();
    } else {
        currentQuestionIdx++;
        if (currentQuestionIdx < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }
}

function checkAnswer() {
    isSubmitted = true;
    const currentQuestion = quizData[currentQuestionIdx];
    const selectedOption = currentQuestion.options[selectedOptionIdx];

    const buttons = optionsContainer.querySelectorAll('.option');
    const feedbacks = optionsContainer.querySelectorAll('.option-feedback');

    buttons.forEach(btn => {
        btn.classList.add('disabled');
        btn.classList.remove('selected');
    });

    if (selectedOption.isCorrect) {
        score++;
        scoreCounter.textContent = score;
        updateScoreDisplay();
        launchConfetti();
    }

    buttons.forEach((btn, i) => {
        const option = currentQuestion.options[i];
        const isCorrect = option.isCorrect;
        const isSelected = i === selectedOptionIdx;
        const feedbackEl = feedbacks[i];

        if (isCorrect) {
            btn.classList.add('correct');
        } else if (isSelected) {
            btn.classList.add('incorrect');
        }

        feedbackEl.classList.add('show');
        if (isCorrect) {
            feedbackEl.classList.add('correct');
            feedbackEl.classList.remove('incorrect');
            feedbackEl.innerHTML = `
                <div class="option-feedback-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <div class="option-feedback-content">
                    <span>Respuesta correcta</span>
                    <p>${option.rationale}</p>
                </div>
            `;
        } else if (isSelected) {
            feedbackEl.classList.add('incorrect');
            feedbackEl.classList.remove('correct');
            feedbackEl.innerHTML = `
                <div class="option-feedback-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <div class="option-feedback-content">
                    <span>Tu respuesta</span>
                    <p>${option.rationale}</p>
                </div>
            `;
        } else {
            feedbackEl.innerHTML = '';
            feedbackEl.classList.remove('correct', 'incorrect');
        }
    });

    const isLast = currentQuestionIdx === quizData.length - 1;
    nextBtn.innerHTML = `
        <span>${isLast ? "Ver Resultados" : "Siguiente pregunta"}</span>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
    `;
}

function showResults() {
    quizScreen.classList.add('hidden');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('hidden');
    resultScreen.classList.add('active');

    stopTimer();
    timerContainer.classList.add('hidden');
    currentScoreDisplay.classList.add('hidden');
    userMenuBtn.classList.add('hidden');
    
    if (userMenuBtnResults) {
        userMenuBtnResults.classList.remove('hidden');
    }

    progressBar.style.width = `100%`;

    const percent = Math.round((score / quizData.length) * 100);
    document.getElementById('final-score').textContent = `${score}/${quizData.length}`;
    document.getElementById('final-percent').textContent = `${percent}%`;

    if (percent >= 60) {
        launchCelebrationConfetti();
    }

    const savedUser = getUserFromStorage();
    const userName = savedUser ? savedUser.name : 'Usuario';
    const timeSpent = formatTime(elapsedTime);
    const resultMessage = getMessageByScore(score, quizData.length, elapsedTime, userName);

    const badgeContainer = document.getElementById('badge-container');
    const resultTitle = document.getElementById('result-title');
    const resultSubtitle = document.getElementById('result-subtitle');

    if (percent === 100) {
        badgeContainer.className = 'badge perfect';
        badgeContainer.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
        `;
        resultTitle.textContent = `¡Felicitaciones, ${userName}!`;
    } else if (percent >= 70) {
        badgeContainer.className = 'badge excellent';
        badgeContainer.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        `;
        resultTitle.textContent = `¡Excelente trabajo, ${userName}!`;
    } else if (percent >= 60) {
        badgeContainer.className = 'badge good';
        badgeContainer.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        `;
        resultTitle.textContent = `Buen intento, ${userName}`;
    } else if (percent >= 30) {
        badgeContainer.className = 'badge needs-improvement';
        badgeContainer.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        `;
        resultTitle.textContent = `Sigue intentando, ${userName}`;
    } else {
        badgeContainer.className = 'badge poor';
        badgeContainer.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        `;
        resultTitle.textContent = `Ánimo, ${userName}`;
    }

    resultSubtitle.textContent = resultMessage;
    saveScoreToHistory(score, quizData.length, elapsedTime);
}

function restartQuiz() {
    shuffleQuiz();
    currentQuestionIdx = 0;
    score = 0;
    scoreCounter.textContent = "0";
    resultScreen.classList.add('hidden');
    resultScreen.classList.remove('active');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('active');
    
    timerContainer.classList.remove('hidden');
    currentScoreDisplay.classList.remove('hidden');
    userMenuBtn.classList.remove('hidden');
    
    if (userMenuBtnResults) {
        userMenuBtnResults.classList.add('hidden');
    }
    
    resetTimer();
    updateScoreDisplay();
    startTimer();
    loadQuestion();
}

function toggleHint() {
    hintBox.classList.toggle('show');
}

function getLetter(idx) {
    return String.fromCharCode(65 + idx);
}

function launchConfetti() {
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#15803d']
    });
}

function launchCelebrationConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#22c55e', '#16a34a', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b'];

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: colors
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}