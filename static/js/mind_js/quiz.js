const allQuestionsData = [
    {
        title: "How often do you feel relaxed during the day?",
        options: [
            { value: 10, text: "😎 Always relaxed and at peace" },
            { value: 20, text: "😬 Sometimes feel tense" },
            { value: 30, text: "😓 Frequently stressed" },
            { value: 40, text: "😰 Almost always anxious" }
        ]
    },
    {
        title: "How would you describe your sleep quality?",
        options: [
            { value: 10, text: "😴 Peaceful and deep sleep" },
            { value: 20, text: "🌙 Light disturbances occasionally" },
            { value: 30, text: "🥱 Difficulty falling asleep" },
            { value: 40, text: "😵 Hardly any proper sleep" }
        ]
    },
    {
        title: "How often do you worry about small issues?",
        options: [
            { value: 10, text: "🙂 Rarely worry about minor things" },
            { value: 20, text: "🤔 Sometimes concerned" },
            { value: 30, text: "😟 Frequently worried" },
            { value: 40, text: "😫 Almost always anxious" }
        ]
    },
    {
        title: "How do you handle work or study pressure?",
        options: [
            { value: 10, text: "💪 Easily manageable" },
            { value: 20, text: "😬 Sometimes stressful" },
            { value: 30, text: "😓 Quite stressful" },
            { value: 40, text: "😰 Extremely overwhelming" }
        ]
    },
    {
        title: "How often do you feel low on energy?",
        options: [
            { value: 10, text: "⚡ Almost never feel drained" },
            { value: 20, text: "🔋 Sometimes tired" },
            { value: 30, text: "😴 Often feel drained" },
            { value: 40, text: "😵 Always exhausted" }
        ]
    },
    {
        title: "How do you react to unexpected problems?",
        options: [
            { value: 10, text: "😎 Stay calm and focused" },
            { value: 20, text: "😬 Get a little nervous" },
            { value: 30, text: "😟 Feel very stressed" },
            { value: 40, text: "😱 Panic completely" }
        ]
    },
    {
        title: "How often do you feel positive about yourself?",
        options: [
            { value: 10, text: "🌟 Almost always confident" },
            { value: 20, text: "🙂 Sometimes positive" },
            { value: 30, text: "😔 Rarely feel good about myself" },
            { value: 40, text: "😞 Almost never positive" }
        ]
    },
    {
        title: "How often do you experience headaches or body tension?",
        options: [
            { value: 10, text: "😌 Rarely experience physical symptoms" },
            { value: 20, text: "🤕 Sometimes get headaches" },
            { value: 30, text: "😖 Frequently tense or in pain" },
            { value: 40, text: "😩 Almost daily physical symptoms" }
        ]
    },
    {
        title: "How often do you engage in hobbies or relaxation activities?",
        options: [
            { value: 10, text: "🎨 Regularly enjoy hobbies" },
            { value: 20, text: "🎶 Sometimes find time to relax" },
            { value: 30, text: "📉 Rarely have time for myself" },
            { value: 40, text: "😔 Never have time for relaxation" }
        ]
    },
    {
        title: "How supported do you feel by friends and family?",
        options: [
            { value: 10, text: "❤️ Always feel supported and loved" },
            { value: 20, text: "🤝 Sometimes feel supported" },
            { value: 30, text: "😞 Rarely feel understood" },
            { value: 40, text: "💔 Feel isolated and alone" }
        ]
    },
    // You can easily add more questions here
    {
        title: "How often do you take breaks during work/study?",
        options: [
            { value: 10, text: "⏰ Regular breaks throughout the day" },
            { value: 20, text: "🕐 Occasional breaks" },
            { value: 30, text: "🚫 Rarely take breaks" },
            { value: 40, text: "❌ Never take breaks" }
        ]
    },
    {
        title: "How do you feel about your future?",
        options: [
            { value: 10, text: "🌟 Very optimistic and hopeful" },
            { value: 20, text: "😊 Generally positive" },
            { value: 30, text: "😐 Uncertain and worried" },
            { value: 40, text: "😞 Pessimistic and hopeless" }
        ]
    },
    {
        title: "How often do you practice mindfulness or meditation?",
        options: [
            { value: 10, text: "🧘 Daily practice" },
            { value: 20, text: "🌸 Few times a week" },
            { value: 30, text: "🤔 Occasionally" },
            { value: 40, text: "❌ Never practice" }
        ]
    },
    {
        title: "How do you handle conflicts with others?",
        options: [
            { value: 10, text: "🤝 Communicate calmly and resolve" },
            { value: 20, text: "😬 Sometimes get defensive" },
            { value: 30, text: "😡 Often get angry or upset" },
            { value: 40, text: "😰 Avoid conflicts completely" }
        ]
    },
    {
        title: "How satisfied are you with your current lifestyle?",
        options: [
            { value: 10, text: "😍 Very satisfied and content" },
            { value: 20, text: "🙂 Mostly satisfied" },
            { value: 30, text: "😕 Somewhat dissatisfied" },
            { value: 40, text: "😞 Very dissatisfied" }
        ]
    },
    {
        title: "How often do you feel overwhelmed by daily tasks?",
        options: [
            { value: 10, text: "✅ Rarely overwhelmed" },
            { value: 20, text: "📋 Sometimes feel busy" },
            { value: 30, text: "😵 Often overwhelmed" },
            { value: 40, text: "🆘 Always drowning in tasks" }
        ]
    },
    {
        title: "How is your appetite and eating patterns?",
        options: [
            { value: 10, text: "🍽️ Healthy and regular eating" },
            { value: 20, text: "🍕 Sometimes irregular" },
            { value: 30, text: "🍪 Often stress eating or skipping" },
            { value: 40, text: "❌ Severely disrupted eating" }
        ]
    },
    {
        title: "How often do you laugh or experience joy?",
        options: [
            { value: 10, text: "😄 Daily laughter and joy" },
            { value: 20, text: "😊 Regular moments of happiness" },
            { value: 30, text: "🙂 Occasional joy" },
            { value: 40, text: "😐 Rarely feel joyful" }
        ]
    },
    {
        title: "How do you cope with stressful situations?",
        options: [
            { value: 10, text: "💪 Healthy coping strategies" },
            { value: 20, text: "🤔 Mix of good and bad coping" },
            { value: 30, text: "😟 Often use unhealthy coping" },
            { value: 40, text: "🚫 No effective coping strategies" }
        ]
    },
    {
        title: "How connected do you feel to your community or social circle?",
        options: [
            { value: 10, text: "🤗 Very connected and engaged" },
            { value: 20, text: "👥 Moderately connected" },
            { value: 30, text: "😔 Somewhat isolated" },
            { value: 40, text: "🏝️ Very isolated and lonely" }
        ]
    }
];

// Configuration
const QUESTIONS_TO_SHOW = 10; // Number of questions to display
let selectedQuestions = [];
let currentQuestion = 0;
let totalQuestions = QUESTIONS_TO_SHOW;
let answers = {};

// Function to randomly select questions
function selectRandomQuestions() {
    const shuffled = [...allQuestionsData].sort(() => 0.5 - Math.random());
    selectedQuestions = shuffled.slice(0, QUESTIONS_TO_SHOW);
}

const questionsContainer = document.getElementById('questionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const progressFill = document.getElementById('quizProgressFill');
const progressText = document.getElementById('quizProgressText');
const resultDiv = document.getElementById('result');
const form = document.getElementById('quizForm');

// Generate HTML for selected questions
function generateQuestions() {
    questionsContainer.innerHTML = '';

    selectedQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-slide';
        questionDiv.dataset.question = index + 1;
        if (index === 0) questionDiv.classList.add('active');

        const optionsHTML = question.options.map(option => `
                    <label class="option">
                        <input type="radio" name="q${index + 1}" value="${option.value}">
                        <span class="option-text">${option.text}</span>
                    </label>
                `).join('');

        questionDiv.innerHTML = `
                    <h3 class="question-title">${question.title}</h3>
                    <div class="options">
                        ${optionsHTML}
                    </div>
                `;

        questionsContainer.appendChild(questionDiv);
    });
}

// Initialize quiz
function init() {
    selectRandomQuestions(); // Select random questions first
    generateQuestions();
    showQuestion(0);
    updateProgress();
    addEventListeners();
}

// Show specific question
function showQuestion(n) {
    const slides = document.querySelectorAll('.question-slide');
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[n]) {
        slides[n].classList.add('active');
    }

    // Update navigation buttons
    prevBtn.style.display = n === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = n === totalQuestions - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = n === totalQuestions - 1 ? 'inline-block' : 'none';

    updateProgress();
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Question ${currentQuestion + 1} of ${totalQuestions}`;
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

// Navigate to previous question
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// Add event listeners
function addEventListeners() {
    prevBtn.addEventListener('click', prevQuestion);
    nextBtn.addEventListener('click', nextQuestion);

    // Handle option selection
    document.addEventListener('click', function (e) {
        if (e.target.closest('.option')) {
            const option = e.target.closest('.option');
            const input = option.querySelector('input[type="radio"]');
            if (!input) return;

            const questionName = input.name;

            // Remove selected class from all options in this question
            const questionSlide = option.closest('.question-slide');
            if (questionSlide) {
                questionSlide.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }

            // Add selected class to clicked option
            option.classList.add('selected');
            input.checked = true;

            // Store answer
            answers[questionName] = parseInt(input.value);
        }
    });

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateResults();
    });
}

// Calculate and display results
function calculateResults() {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const maxScore = totalQuestions * 40; // Maximum possible score

    // Hide quiz form and progress
    form.style.display = 'none';
    document.querySelector('.quiz-progress-container').style.display = 'none';

    let resultClass, resultIcon, resultTitle, resultDescription, recommendations;

    // Adjust scoring ranges based on total questions
    const scoreThresholds = {
        excellent: Math.floor(maxScore * 0.3),   // 30% of max score
        good: Math.floor(maxScore * 0.5),        // 50% of max score
        moderate: Math.floor(maxScore * 0.75),   // 75% of max score
    };

    if (totalScore <= scoreThresholds.excellent) {
        resultClass = 'excellent';
        resultIcon = '😎';
        resultTitle = 'Excellent Mental Wellness!';
        resultDescription = 'You\'re doing great! Your stress levels are well-managed and you have healthy coping mechanisms in place.';
        recommendations = `
                    <div class="helpline">
                        <h4>Keep up the great work:</h4>
                        <p>• Continue your current self-care practices</p>
                        <p>• Maintain your work-life balance</p>
                        <p>• Share your strategies with others</p>
                    </div>
                `;
    } else if (totalScore <= scoreThresholds.good) {
        resultClass = 'good';
        resultIcon = '😐';
        resultTitle = 'Mild Stress Detected';
        resultDescription = 'You\'re experiencing some stress, but it\'s manageable. Consider incorporating more relaxation techniques into your routine.';
        recommendations = `
                    <div class="helpline">
                        <h4>Recommended actions:</h4>
                        <p>• Practice deep breathing exercises</p>
                        <p>• Try meditation or mindfulness</p>
                        <p>• Ensure adequate sleep and exercise</p>
                        <p>• Consider talking to a counselor</p>
                    </div>
                `;
    } else if (totalScore <= scoreThresholds.moderate) {
        resultClass = 'moderate';
        resultIcon = '😟';
        resultTitle = 'Moderate Stress Levels';
        resultDescription = 'You\'re experiencing significant stress that may be impacting your daily life. It\'s important to take action now.';
        recommendations = `
                    <div class="helpline">
                        <h4>Important steps to take:</h4>
                        <p>• Speak with a mental health professional</p>
                        <p>• Practice regular stress management techniques</p>
                        <p>• Reach out to trusted friends or family</p>
                        <p>• Consider lifestyle changes</p>
                        <br>
                        <h4>📞 Mental Health Support:</h4>
                        <div class="helpline-number">1800-599-0019 (KIRAN Helpline India)</div>
                    </div>
                `;
    } else {
        resultClass = 'concerning';
        resultIcon = '🚨';
        resultTitle = 'High Stress - Immediate Support Needed';
        resultDescription = 'Your stress levels are very high and may require immediate professional attention. Please don\'t hesitate to reach out for help.';
        recommendations = `
                    <div class="helpline">
                        <h4>🚨 Urgent Action Required:</h4>
                        <p>• Contact a mental health professional immediately</p>
                        <p>• Reach out to emergency services if you\'re in crisis</p>
                        <p>• Don\'t face this alone - support is available</p>
                        <br>
                        <h4>📞 Emergency Mental Health Support:</h4>
                        <div class="helpline-number">9152987821 (KIRAN Mental Health Helpline)</div>
                        <div class="helpline-number">1800-599-0019 (24/7 Support)</div>
                    </div>
                `;
    }

    resultDiv.innerHTML = `
                <div class="result-icon">${resultIcon}</div>
                <h2 class="result-title">${resultTitle}</h2>
                <p class="result-description">${resultDescription}</p>
                <p><strong>Your Score: ${totalScore}/${maxScore}</strong></p>
                ${recommendations}
                <br>
                <button class="btn btn-primary" onclick="location.reload()">Take Assessment Again</button>
            `;

    resultDiv.className = `result ${resultClass} show`;
}

// Initialize the quiz when page loads
document.addEventListener('DOMContentLoaded', init);