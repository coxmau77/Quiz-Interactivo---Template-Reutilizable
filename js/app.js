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
const headerClassInfo = document.getElementById('header-class-info');
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

const shareDialog = document.getElementById('share-dialog');
const closeShareDialogBtn = document.getElementById('close-share-dialog');
const shareDialogOverlay = document.querySelector('.share-dialog-overlay');
const shareDialogMessage = document.getElementById('share-dialog-message');

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

function showShareDialog(message) {
    shareDialogMessage.textContent = message;
    shareDialog.classList.remove('hidden');
}

function closeShareDialog() {
    shareDialog.classList.add('hidden');
}

closeShareDialogBtn.addEventListener('click', closeShareDialog);
shareDialogOverlay.addEventListener('click', closeShareDialog);

document.getElementById('copy-message-btn').addEventListener('click', function() {
    const message = shareDialogMessage.textContent;
    navigator.clipboard.writeText(message).then(() => {
        const btn = this;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ¡Copiado!
        `;
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    });
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
    
    scoreHistoryList.innerHTML = sortedHistory.map(attempt => {
        function getLevelBadge(percent) {
            let level, label;
            
            if (percent === 100) {
                level = 'perfect';
                label = 'Perfecto';
            } else if (percent >= 70) {
                level = 'excellent';
                label = 'Excelente';
            } else if (percent >= 60) {
                level = 'good';
                label = 'Bueno';
            } else if (percent >= 30) {
                level = 'needs-improvement';
                label = 'Mejorar';
            } else {
                level = 'poor';
                label = 'Bajo';
            }
            
            return `<span class="attempt-badge ${level}">${label}</span>`;
        }
        
        const canShare = attempt.percent >= 70;
        const shareButton = canShare ? `<button class="share-btn" data-message="${encodeURIComponent(attempt.message)}" title="Compartir">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
            </button>` : '';
        
        return `
            <li>
                <div class="attempt-info">
                    <div class="attempt-header">
                        <span class="attempt-date">${attempt.date}</span>
                        ${getLevelBadge(attempt.percent)}
                    </div>
                    <div class="attempt-actions">
                        <span class="attempt-score">${attempt.score}/${attempt.total}</span>
                        ${shareButton}
                    </div>
                </div>
                <p class="attempt-message">${attempt.message || ''}</p>
            </li>
        `;
    }).join('');
    
    scoreHistoryList.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const message = decodeURIComponent(this.dataset.message);
            showShareDialog(message);
        });
    });
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
    headerClassInfo.textContent = quizInfo.classInfo;
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
// document.getElementById('share-diploma-btn').addEventListener('click', shareDiploma);

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

    const progressPercent = ((currentQuestionIdx + 1) / quizData.length) * 100;
    progressBar.style.width = `${Math.min(progressPercent, 100)}%`;

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

    if (percent >= 60) {
        launchCelebrationConfetti();
    }

    saveScoreToHistory(score, quizData.length, elapsedTime);
    populateDiploma();
}

function restartQuiz() {
    shuffleQuiz();
    currentQuestionIdx = 0;
    score = 0;
    scoreCounter.textContent = "0";
    progressBar.style.width = "0%";
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

function getAchievementSvg(icon) {
    const icons = {
        trophy: '<svg fill="currentColor" viewBox="0 0 16 16"><path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356a.5.5 0 0 1-.085.987l-1.593.318a.5.5 0 0 1-.166 0l-1.593-.318a.5.5 0 0 1-.085-.987l1.425-.356V10.44c-.955-.234-2.042-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm2.5 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5.348-2.652a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
        award: '<svg fill="currentColor" viewBox="0 0 16 16"><path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/><path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/></svg>',
        star: '<svg fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>',
        lightning: '<svg fill="currentColor" viewBox="0 0 16 16"><path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658l-.28.842H9.18L10.613 3.5H13.5a.5.5 0 0 1 .44.736l-7 12a.5.5 0 0 1-.896-.555L7.117 9.5H4.5a.5.5 0 0 1-.474-.658l2-6A.5.5 0 0 1 6.5 2.5h.618l-.992-1.798A.5.5 0 0 1 5.52.359z"/></svg>',
        fire: '<svg fill="currentColor" viewBox="0 0 16 16"><path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4.5 9.5 3 8 2c-1.5 1-3 2.5-2.25 4.5 0 0-1.5-.5-1.25-2C3 5.5 2 8 2 10.5 2 14 4.686 16 8 16z"/></svg>',
        flag: '<svg fill="currentColor" viewBox="0 0 16 16"><path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.813-.125-2.648-.43-.613-.224-1.115-.459-1.513-.648-.326-.156-.578-.296-.746-.382a4.036 4.036 0 0 1-.237-.138c-.028-.017-.036-.025-.036-.025v4.985a.5.5 0 1 1-1 0V.5a.5.5 0 0 1 .5-.5c.023 0 .109.037.196.078.126.054.296.125.513.207.436.166.977.337 1.591.414.662.085 1.388.076 2.145-.016.576-.07 1.245-.2 1.94-.464.264-.1.52-.203.74-.33.175-.1.322-.192.418-.262.056-.041.088-.065.1-.077l.01-.008.003-.002A.5.5 0 0 1 14.778.085z"/></svg>'
    };
    return icons[icon] || icons.flag;
}

function populateDiploma() {
    const savedUser = getUserFromStorage();
    const userName = savedUser ? savedUser.name : 'Usuario';

    document.getElementById('diploma-name').textContent = userName;
    document.getElementById('diploma-quiz-title').textContent = quizInfo.title;

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('diploma-date').textContent = dateStr;

    const percent = Math.round((score / quizData.length) * 100);
    const scoreEl = document.getElementById('diploma-score');
    scoreEl.innerHTML = `
        <span class="diploma-score-value">${score}/${quizData.length}</span>
        <span class="diploma-score-pct">${percent}%</span>
    `;

    const titleEl = document.getElementById('diploma-result-title');
    if (percent === 100) titleEl.textContent = `¡Felicitaciones, ${userName}!`;
    else if (percent >= 70) titleEl.textContent = `¡Excelente trabajo, ${userName}!`;
    else if (percent >= 60) titleEl.textContent = `Buen intento, ${userName}`;
    else if (percent >= 30) titleEl.textContent = `Sigue intentando, ${userName}`;
    else titleEl.textContent = `Ánimo, ${userName}`;

    document.getElementById('diploma-message').textContent = getMessageByScore(score, quizData.length, elapsedTime, userName);

    function getLevelData(pct) {
        if (pct === 100) return {
            cssClass: 'perfect',
            label: 'PERFECTO',
            iconSvg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>'
        };
        if (pct >= 70) return {
            cssClass: 'excellent',
            label: 'EXCELENTE',
            iconSvg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
        };
        if (pct >= 60) return {
            cssClass: 'good',
            label: 'BUENO',
            iconSvg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
        };
        if (pct >= 30) return {
            cssClass: 'needs-improvement',
            label: 'MEJORAR',
            iconSvg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
        };
        return {
            cssClass: 'poor',
            label: 'BAJO',
            iconSvg: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
        };
    }

    const levelData = getLevelData(percent);
    const levelEl = document.getElementById('diploma-level');
    levelEl.className = `diploma-level ${levelData.cssClass}`;
    document.getElementById('diploma-level-icon').innerHTML = levelData.iconSvg;
    document.getElementById('diploma-level-label').textContent = levelData.label;
    const iconContainer = document.getElementById('diploma-icon');
    iconContainer.innerHTML = levelData.iconSvg;
    iconContainer.className = `diploma-icon ${levelData.cssClass}`;

    const achievements = [];

    if (percent === 100) {
        achievements.push({ cssClass: 'perfect', label: 'Perfecto', icon: 'trophy' });
    } else if (percent >= 70) {
        achievements.push({ cssClass: 'excellent', label: 'Excelente', icon: 'award' });
    } else if (percent >= 60) {
        achievements.push({ cssClass: 'good', label: 'Bueno', icon: 'star' });
    }

    if (elapsedTime < 120) {
        achievements.push({ cssClass: 'speed', label: 'Veloz', icon: 'lightning' });
    }

    const history = getScoreHistory();
    if (history.length >= 3) {
        achievements.push({ cssClass: 'persistent', label: 'Persistente', icon: 'fire' });
    }

    if (achievements.length === 0) {
        achievements.push({ cssClass: 'default', label: 'Participante', icon: 'flag' });
    }

    const container = document.getElementById('diploma-achievements');
    container.innerHTML = achievements.map(a => {
        const svg = getAchievementSvg(a.icon);
        return `
            <div class="achievement-badge">
                <div class="achievement-icon ${a.cssClass}">${svg}</div>
                <span class="achievement-label">${a.label}</span>
            </div>
        `;
    }).join('');
}

// function shareDiploma() {
//     const diplomaCard = document.getElementById('diploma-card');
//     const shareBtn = document.getElementById('share-diploma-btn');
//     const shareText = document.getElementById('share-btn-text');
// 
//     shareBtn.disabled = true;
//     shareText.textContent = 'Generando...';
// 
//     html2canvas(diplomaCard, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: null,
//         logging: false,
//         width: 360,
//         height: 640
//     }).then(canvas => {
//         return new Promise(resolve => {
//             canvas.toBlob(blob => resolve({ blob, canvas }), 'image/png');
//         });
//     }).then(({ blob }) => {
//         const file = new File([blob], 'diploma-quiz.png', { type: 'image/png' });
// 
//         if (navigator.canShare && navigator.canShare({ files: [file] })) {
//             return navigator.share({
//                 files: [file],
//                 title: 'Mi Diploma Digital',
//                 text: '¡Mira mi diploma del Quiz!'
//             }).then(() => {
//                 shareText.textContent = '¡Compartido!';
//             }).catch(err => {
//                 if (err.name === 'AbortError') return;
//                 throw err;
//             });
//         }
// 
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'diploma-quiz.png';
//         a.click();
//         URL.revokeObjectURL(url);
//         shareText.textContent = '¡Descargado!';
//     }).catch(err => {
//         if (err.name !== 'AbortError') {
//             console.error(err);
//             shareText.textContent = 'Error';
//         }
//     }).finally(() => {
//         shareBtn.disabled = false;
//         setTimeout(() => {
//             shareText.textContent = 'Compartir Diploma';
//         }, 2500);
//     });
// }

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