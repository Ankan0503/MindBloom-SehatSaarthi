const TOTAL_QUESTIONS = 10;
const API_ENDPOINT = '/api/generate-question/';
const GRADE_ENDPOINT = '/api/grade-response/';
const SUBMIT_ENDPOINT = '/api/submit-assessment/';
const ELIGIBILITY_ENDPOINT = '/api/check-eligibility/';
const PINCODE_LOCATION_ENDPOINT = '/api/get-pincode-from-location/';

const MAX_CHAR_INITIAL = 1000;
const MAX_CHAR_ADDITIONAL = 500;
const MIN_CHAR_REQUIRED = 10;

let currentQuestion = 0;
let conversationHistory = [];
let answers = {};
let userFingerprint = null;
let detectedPincode = null;
let locationPermissionGranted = false;
let isGeneratingQuestion = false;
let isGrading = false;
let currentQuestionData = null;

// Initial user input
let initialUserInput = null;
let userHasSkipped = false;

// DOM elements
let questionsContainer, prevBtn, nextBtn, progressFill, progressText;
let resultDiv, form, pincodeSection, pincodeInput, getResultBtn;
let initialInputSection, initialTextarea, btnStartWithText, btnSkip;

// CSRF TOKEN
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getCSRFToken() {
    return getCookie('csrftoken');
}

// EVENT LISTENERS
function initializeEventListeners() {
    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrevious);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
    }

    if (getResultBtn) {
        getResultBtn.addEventListener('click', async function () {
            const pin = pincodeInput.value.trim();

            if (!/^\d{6}$/.test(pin)) {
                alert("Please enter a valid 6-digit pincode.");
                pincodeInput.focus();
                return;
            }

            const btn = this;
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Submitting...';

            try {
                const { totalScore, maxScore } = calculateScore();
                const submissionResult = await submitAssessment(pin, totalScore, maxScore);

                if (submissionResult) {
                    await displayResults(totalScore, maxScore, submissionResult);
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('Failed to submit assessment. Please try again.');
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }

    if (pincodeInput) {
        pincodeInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^\d]/g, '');
        });

        pincodeInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (getResultBtn) getResultBtn.click();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    }
}

// MAIN INITIALIZATION
async function init() {
    console.log('🚀 Initializing AI Mental Health Assessment with Gemini Grading...');

    initializeDOMElements();

    userFingerprint = generateFingerprint();
    console.log('✅ User fingerprint generated');

    const isEligible = await checkEligibility();
    if (!isEligible) {
        console.log('❌ User not eligible - cooldown active');
        return;
    }

    console.log('✅ User eligible - starting assessment');

    initializeEventListeners();

    requestLocation().then(pincode => {
        detectedPincode = pincode;
        if (pincode) {
            console.log('📍 Location detected:', pincode);
        }
    });

    showInitialInputSection();

    console.log('✅ Assessment initialized - AI grading ready');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// DOM INITIALIZATION
function initializeDOMElements() {
    questionsContainer = document.getElementById('questionsContainer');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    progressFill = document.getElementById('quizProgressFill');
    progressText = document.getElementById('quizProgressText');
    resultDiv = document.getElementById('result');
    form = document.getElementById('quizForm');
    pincodeSection = document.getElementById('pincodeSection');
    pincodeInput = document.getElementById('pincodeInput');
    getResultBtn = document.getElementById('getResultBtn');
    initialInputSection = document.getElementById('initialInputSection');
    initialTextarea = document.getElementById('initialTextarea');
    btnStartWithText = document.getElementById('btnStartWithText');
    btnSkip = document.getElementById('btnSkip');

    const required = {
        questionsContainer, prevBtn, nextBtn, progressFill, progressText,
        resultDiv, form, pincodeSection, pincodeInput, getResultBtn,
        initialInputSection, initialTextarea, btnStartWithText, btnSkip
    };

    for (let [name, element] of Object.entries(required)) {
        if (!element) {
            console.error(`❌ Required element not found: ${name}`);
        }
    }
}

// FINGERPRINT
function generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);

    const fingerprint = {
        canvas: canvas.toDataURL(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        colorDepth: screen.colorDepth,
        hardwareConcurrency: navigator.hardwareConcurrency
    };

    return btoa(JSON.stringify(fingerprint));
}

// LOCATION
async function requestLocation() {
    if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        return null;
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                locationPermissionGranted = true;
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(PINCODE_LOCATION_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCSRFToken()
                        },
                        body: JSON.stringify({ latitude, longitude })
                    });

                    const data = await response.json();
                    resolve(data.success && data.pincode ? data.pincode : null);
                } catch (error) {
                    console.error('Error fetching pincode:', error);
                    resolve(null);
                }
            },
            (error) => {
                console.log('Location permission denied:', error.message);
                locationPermissionGranted = false;
                resolve(null);
            },
            { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
        );
    });
}

// ELIGIBILITY
async function checkEligibility() {
    try {
        const response = await fetch(ELIGIBILITY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({ fingerprint: userFingerprint })
        });

        const data = await response.json();

        if (!data.can_submit) {
            showRateLimitMessage(data.days_remaining);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking eligibility:', error);
        return true;
    }
}

function showRateLimitMessage(daysRemaining) {
    const container = document.querySelector('.quizzz') || document.body;
    container.innerHTML = `
        <div class="header" style="text-align: center; padding: 20px;">
            <h1>⏳ Assessment Cooldown Active</h1>
        </div>
        <div class="result moderate show" style="max-width: 600px; margin: 40px auto;">
            <h2>Please Wait ${daysRemaining} Day${daysRemaining > 1 ? 's' : ''}</h2>
            <p>You can retake the assessment in ${daysRemaining} day(s).</p>
        </div>
    `;
}

// INITIAL INPUT SECTION
function showInitialInputSection() {
    const quizContent = document.querySelector('.quiz-content');
    const progressContainer = document.querySelector('.quiz-progress-container');
    if (quizContent) quizContent.style.display = 'none';
    if (progressContainer) progressContainer.style.display = 'none';

    if (initialInputSection) {
        initialInputSection.classList.add('active');
        initialInputSection.style.display = 'block';
    }

    setupInitialInputListeners();
}

function setupInitialInputListeners() {
    if (!initialTextarea || !btnStartWithText || !btnSkip) return;

    initialTextarea.addEventListener('input', () => {
        const charCount = initialTextarea.value.length;
        const counter = document.getElementById('initialCharCounter');
        if (counter) {
            counter.textContent = `${charCount}/${MAX_CHAR_INITIAL}`;
            if (charCount >= MAX_CHAR_INITIAL * 0.9) {
                counter.classList.add('near-limit');
            } else {
                counter.classList.remove('near-limit');
            }
        }
        btnStartWithText.disabled = charCount < MIN_CHAR_REQUIRED;
    });

    btnStartWithText.addEventListener('click', async () => {
        const text = initialTextarea.value.trim();
        if (text.length >= MIN_CHAR_REQUIRED) {
            initialUserInput = text;
            userHasSkipped = false;
            console.log('✅ User provided initial input');

            if (initialInputSection) {
                initialInputSection.classList.remove('active');
                initialInputSection.style.display = 'none';
            }

            const quizContent = document.querySelector('.quiz-content');
            const progressContainer = document.querySelector('.quiz-progress-container');
            if (quizContent) quizContent.style.display = 'block';
            if (progressContainer) progressContainer.style.display = 'block';

            await displayQuestion();
        }
    });

    btnSkip.addEventListener('click', async () => {
        userHasSkipped = true;
        initialUserInput = null;
        console.log('⏭️ User skipped initial input');

        if (initialInputSection) {
            initialInputSection.classList.remove('active');
            initialInputSection.style.display = 'none';
        }

        const quizContent = document.querySelector('.quiz-content');
        const progressContainer = document.querySelector('.quiz-progress-container');
        if (quizContent) quizContent.style.display = 'block';
        if (progressContainer) progressContainer.style.display = 'block';

        await displayQuestion();
    });
}

// AI QUESTION GENERATION
async function generateNextQuestion() {
    if (isGeneratingQuestion) return null;

    isGeneratingQuestion = true;
    showLoadingIndicator('Generating personalized question...');

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                conversation_history: conversationHistory,
                question_number: currentQuestion + 1,
                total_questions: TOTAL_QUESTIONS,
                initial_user_input: initialUserInput,
                user_has_skipped: userHasSkipped
            })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to generate question');
        }

        hideLoadingIndicator();
        isGeneratingQuestion = false;

        return {
            id: `ai_q_${currentQuestion + 1}`,
            question: data.question,
            type: data.type || 'scale',
            options: data.options || generateDefaultOptions(),
            follow_up_areas: data.follow_up_areas || []
        };
    } catch (error) {
        console.error('❌ Error generating question:', error);
        hideLoadingIndicator();
        isGeneratingQuestion = false;
        return generateFallbackQuestion();
    }
}

// AI GRADING
async function gradeResponse(questionText, selectedOption, selectedOptionText, userTextInput) {
    if (isGrading) {
        console.log('Already grading...');
        return null;
    }

    isGrading = true;
    showLoadingIndicator('AI is analyzing your response...');

    try {
        console.log('🤖 Requesting AI grading...');

        const response = await fetch(GRADE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                question_text: questionText,
                selected_option: selectedOption,
                selected_option_text: selectedOptionText,
                user_text_input: userTextInput,
                initial_user_input: initialUserInput,
                conversation_history: conversationHistory
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error('Grading failed');
        }

        console.log(`✅ AI grading: ${data.score}/50 (${data.severity_level})`);
        console.log(`   Reasoning: ${data.reasoning}`);

        hideLoadingIndicator();
        isGrading = false;

        return {
            score: data.score,
            reasoning: data.reasoning,
            severity_level: data.severity_level
        };
    } catch (error) {
        console.error('❌ Error grading response:', error);
        hideLoadingIndicator();
        isGrading = false;

        // Fallback scoring
        if (selectedOption) {
            const scoreMap = { 10: 12, 20: 25, 30: 37, 40: 50 };
            return {
                score: scoreMap[selectedOption] || 25,
                reasoning: 'Fallback scoring',
                severity_level: 'moderate'
            };
        }
        return { score: 25, reasoning: 'Fallback', severity_level: 'moderate' };
    }
}

function generateDefaultOptions() {
    return [
        { value: 10, text: "😊 Not at all / Rarely" },
        { value: 20, text: "😌 Sometimes / Occasionally" },
        { value: 30, text: "😕 Frequently / Often" },
        { value: 40, text: "😰 Almost always / Constantly" }
    ];
}

function generateFallbackQuestion() {
    const fallbacks = [
        {
            question: "How would you describe your energy levels?",
            options: [
                { value: 10, text: "⚡ Full of energy" },
                { value: 20, text: "🔋 Generally good" },
                { value: 30, text: "😴 Often tired" },
                { value: 40, text: "😵 Constantly exhausted" }
            ]
        },
        {
            question: "How often do you feel overwhelmed?",
            options: [
                { value: 10, text: "😊 Rarely" },
                { value: 20, text: "😌 Sometimes" },
                { value: 30, text: "😟 Frequently" },
                { value: 40, text: "😰 Almost always" }
            ]
        }
    ];

    const index = currentQuestion % fallbacks.length;
    return {
        id: `fallback_q_${currentQuestion + 1}`,
        question: fallbacks[index].question,
        type: 'scale',
        options: fallbacks[index].options,
        follow_up_areas: []
    };
}

// LOADING INDICATOR
function showLoadingIndicator(message = 'Processing...') {
    if (!questionsContainer) return;

    questionsContainer.innerHTML = `
        <div class="loading-indicator" style="text-align: center; padding: 60px 20px;">
            <div class="spinner" style="
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            "></div>
            <p style="color: #667eea; font-size: 1.1em;">${message}</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
}

function hideLoadingIndicator() {
    const loader = questionsContainer?.querySelector('.loading-indicator');
    if (loader) loader.remove();
}

// DISPLAY QUESTION
async function displayQuestion(questionData = null) {
    if (!questionData) {
        questionData = await generateNextQuestion();
    }

    if (!questionData) {
        console.error('Failed to get question');
        return;
    }

    currentQuestionData = questionData;
    questionsContainer.innerHTML = '';

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-slide active';
    questionDiv.dataset.questionId = questionData.id;

    const optionsHTML = questionData.options.map((option, idx) => `
        <label class="option" data-value="${option.value}">
            <input type="radio" name="current_question" value="${option.value}" id="opt_${idx}">
            <span class="option-text">${option.text}</span>
        </label>
    `).join('');

    questionDiv.innerHTML = `
        <h3 class="question-title">Question ${currentQuestion + 1}: ${questionData.question}</h3>
        
        <div class="options-header">
            <h4>Choose one option:</h4>
            <button type="button" class="clear-selection-btn" id="clearSelectionBtn">
                ✕ Clear Selection
            </button>
        </div>
        
        <div class="options">
            ${optionsHTML}
        </div>
        
        <div class="additional-input-section">
            <h4>
                Want to share more details?
                <span class="optional-badge" id="inputBadge">Optional</span>
            </h4>
            <textarea 
                class="additional-textarea" 
                id="additionalTextarea"
                placeholder="Share more about how you're feeling... (Optional unless no option is selected)"
                maxlength="${MAX_CHAR_ADDITIONAL}"
            ></textarea>
            <div class="textarea-footer">
                <div class="validation-message" id="validationMessage">
                    ⚠️ Please either select an option or write at least ${MIN_CHAR_REQUIRED} characters
                </div>
                <div class="char-counter" id="additionalCharCounter">0/${MAX_CHAR_ADDITIONAL}</div>
            </div>
        </div>
    `;

    questionsContainer.appendChild(questionDiv);

    setTimeout(() => {
        setupQuestionInteractions();
        updateProgress();
        updateNavigationButtons();
    }, 0);
}

// QUESTION INTERACTIONS
function setupQuestionInteractions() {
    const options = document.querySelectorAll('.option');
    const clearBtn = document.getElementById('clearSelectionBtn');
    const textarea = document.getElementById('additionalTextarea');
    const charCounter = document.getElementById('additionalCharCounter');
    const badge = document.getElementById('inputBadge');

    options.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const input = this.querySelector('input[type="radio"]');

            if (this.classList.contains('selected')) {
                input.checked = false;
                this.classList.remove('selected');
                options.forEach(opt => opt.classList.remove('selected'));

                if (textarea) {
                    textarea.classList.add('required');
                    if (badge) {
                        badge.className = 'required-badge';
                        badge.textContent = 'Required';
                    }
                }
                if (clearBtn) clearBtn.classList.remove('visible');
            } else {
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                input.checked = true;

                if (textarea) {
                    textarea.classList.remove('required');
                    if (badge) {
                        badge.className = 'optional-badge';
                        badge.textContent = 'Optional';
                    }
                }
                if (clearBtn) clearBtn.classList.add('visible');
            }

            validateQuestionInput();
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            options.forEach(opt => {
                opt.classList.remove('selected');
                const input = opt.querySelector('input[type="radio"]');
                if (input) input.checked = false;
            });
            clearBtn.classList.remove('visible');

            if (textarea) {
                textarea.classList.add('required');
                if (badge) {
                    badge.className = 'required-badge';
                    badge.textContent = 'Required';
                }
            }
            validateQuestionInput();
        });
    }

    if (textarea) {
        textarea.addEventListener('input', () => {
            const charCount = textarea.value.length;
            if (charCounter) {
                charCounter.textContent = `${charCount}/${MAX_CHAR_ADDITIONAL}`;
                if (charCount >= MAX_CHAR_ADDITIONAL * 0.9) {
                    charCounter.classList.add('near-limit');
                } else {
                    charCounter.classList.remove('near-limit');
                }
            }
            validateQuestionInput();
        });
    }
}

function validateQuestionInput() {
    const selectedOption = document.querySelector('input[name="current_question"]:checked');
    const textarea = document.getElementById('additionalTextarea');
    const validationMsg = document.getElementById('validationMessage');

    const hasOption = selectedOption !== null;
    const textLength = textarea ? textarea.value.trim().length : 0;
    const hasText = textLength >= MIN_CHAR_REQUIRED;

    const isValid = hasOption || hasText;

    if (validationMsg) {
        if (isValid) {
            validationMsg.classList.remove('show');
        } else {
            validationMsg.classList.add('show');
        }
    }

    if (nextBtn) {
        nextBtn.disabled = !isValid;
    }

    return isValid;
}

// NAVIGATION
function updateNavigationButtons() {
    if (!prevBtn || !nextBtn) return;
    prevBtn.style.display = currentQuestion === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = currentQuestion === TOTAL_QUESTIONS - 1 ? 'Complete Assessment' : 'Next';
}

function updateProgress() {
    if (!progressFill || !progressText) return;
    const progress = ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Question ${currentQuestion + 1} of ${TOTAL_QUESTIONS}`;
}

// HANDLE NEXT WITH AI GRADING
async function handleNext() {
    if (!validateQuestionInput()) {
        alert('Please either select an option or provide details (at least 10 characters).');
        return;
    }

    const selectedOption = document.querySelector('input[name="current_question"]:checked');
    const textarea = document.getElementById('additionalTextarea');
    const currentQuestionId = currentQuestionData.id;

    const selectedValue = selectedOption ? parseInt(selectedOption.value) : null;
    const selectedText = selectedOption ?
        selectedOption.parentElement.querySelector('.option-text').textContent : null;
    const userTextInput = textarea ? textarea.value.trim() : null;
    const hasValidText = userTextInput && userTextInput.length >= MIN_CHAR_REQUIRED;

    // Get AI grading
    const gradeResult = await gradeResponse(
        currentQuestionData.question,
        selectedValue,
        selectedText,
        hasValidText ? userTextInput : null
    );

    const aiScore = gradeResult ? gradeResult.score : (selectedValue ? Math.round(selectedValue * 1.25) : 25);

    // Save answer
    answers[currentQuestionId] = {
        selected_option: selectedValue,
        user_text_input: hasValidText ? userTextInput : null,
        ai_graded_score: aiScore,
        severity_level: gradeResult ? gradeResult.severity_level : 'moderate',
        grading_reasoning: gradeResult ? gradeResult.reasoning : 'N/A'
    };

    // Add to conversation history
    conversationHistory.push({
        question_number: currentQuestion + 1,
        question_id: currentQuestionId,
        question_text: currentQuestionData.question,
        selected_option: selectedValue,
        selected_option_text: selectedText,
        user_text_input: hasValidText ? userTextInput : null,
        ai_graded_score: aiScore,
        severity_level: gradeResult ? gradeResult.severity_level : 'moderate',
        has_both: !!(selectedValue && hasValidText)
    });

    console.log(`✅ Answer recorded: Q${currentQuestion + 1}`);
    console.log(`   - Option: ${selectedValue}`);
    console.log(`   - Text: ${hasValidText ? 'Yes' : 'No'}`);
    console.log(`   - AI Score: ${aiScore}/50`);

    if (currentQuestion < TOTAL_QUESTIONS - 1) {
        currentQuestion++;
        await displayQuestion();
    } else {
        showPincodeSection();
    }
}

function handlePrevious() {
    if (currentQuestion > 0) {
        currentQuestion--;
        const previousEntry = conversationHistory[currentQuestion];
        const questionData = {
            id: previousEntry.question_id,
            question: previousEntry.question_text,
            options: generateDefaultOptions(),
            type: 'scale'
        };
        displayQuestion(questionData);

        setTimeout(() => {
            const previousAnswer = answers[previousEntry.question_id];
            if (previousAnswer && previousAnswer.selected_option) {
                const option = document.querySelector(`input[value="${previousAnswer.selected_option}"]`);
                if (option) {
                    option.checked = true;
                    option.closest('.option').classList.add('selected');
                    const clearBtn = document.getElementById('clearSelectionBtn');
                    if (clearBtn) clearBtn.classList.add('visible');
                }
            }
            if (previousAnswer && previousAnswer.user_text_input) {
                const textarea = document.getElementById('additionalTextarea');
                if (textarea) {
                    textarea.value = previousAnswer.user_text_input;
                    const charCounter = document.getElementById('additionalCharCounter');
                    if (charCounter) {
                        charCounter.textContent = `${previousAnswer.user_text_input.length}/${MAX_CHAR_ADDITIONAL}`;
                    }
                }
            }
            validateQuestionInput();
        }, 100);
    }
}

// PINCODE SECTION
function showPincodeSection() {
    if (!pincodeSection) return;

    const quizContent = document.querySelector('.quiz-content');
    const progressContainer = document.querySelector('.quiz-progress-container');
    if (quizContent) quizContent.style.display = 'none';
    if (progressContainer) progressContainer.style.display = 'none';

    pincodeSection.style.display = 'flex';

    if (detectedPincode) {
        pincodeInput.value = detectedPincode;
    }
}

// CALCULATE SCORE (NEW: Uses AI-graded scores)
function calculateScore() {
    let totalScore = 0;
    let maxScore = TOTAL_QUESTIONS * 50;  // NEW: Max 50 per question

    Object.values(answers).forEach(answer => {
        totalScore += answer.ai_graded_score || 25;
    });

    return { totalScore, maxScore };
}

// SUBMISSION
async function submitAssessment(pincode, score, maxScore) {
    try {
        const response = await fetch(SUBMIT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                pincode: pincode,
                score: score,
                max_score: maxScore,
                fingerprint: userFingerprint,
                conversation_history: conversationHistory,
                initial_user_input: initialUserInput,
                answers: answers  // Include AI-graded scores
            })
        });

        const data = await response.json();

        if (response.status === 429) {
            alert(data.message || 'Rate limit exceeded.');
            setTimeout(() => location.reload(), 2000);
            return null;
        }

        if (!response.ok) {
            throw new Error(data.error || 'Submission failed');
        }

        return data;
    } catch (error) {
        console.error('Error submitting:', error);
        throw error;
    }
}

// RESULTS
async function displayResults(totalScore, maxScore, submissionData) {
    if (!resultDiv) return;

    if (pincodeSection) pincodeSection.style.display = 'none';
    if (form) form.style.display = 'none';
    const progressContainer = document.querySelector('.quiz-progress-container');
    if (progressContainer) progressContainer.style.display = 'none';

    const scorePercentage = (totalScore / maxScore) * 100;
    let resultClass, resultIcon, resultTitle, resultDescription, recommendations, communityStats = '';

    if (scorePercentage <= 30) {
        resultClass = 'excellent';
        resultIcon = '🌟';
        resultTitle = 'Excellent Mental Wellness!';
        resultDescription = 'You\'re managing stress well with healthy coping mechanisms.';
        recommendations = `
            <div class="recommendations">
                <h4>Keep up the great work:</h4>
                <ul>
                    <li>Continue your self-care practices</li>
                    <li>Maintain work-life balance</li>
                </ul>
            </div>
        `;
    } else if (scorePercentage <= 50) {
        resultClass = 'good';
        resultIcon = '😊';
        resultTitle = 'Good Mental Health';
        resultDescription = 'Overall doing well with some areas for improvement.';
        recommendations = `
            <div class="recommendations">
                <h4>Recommended actions:</h4>
                <ul>
                    <li>Practice deep breathing daily</li>
                    <li>Try meditation (5-10 minutes)</li>
                    <li>Ensure 7-8 hours sleep</li>
                </ul>
            </div>
        `;
    } else if (scorePercentage <= 75) {
        resultClass = 'moderate';
        resultIcon = '😟';
        resultTitle = 'Moderate Stress Levels';
        resultDescription = 'Significant stress may be impacting your daily life.';
        recommendations = `
            <div class="recommendations">
                <h4>Important steps:</h4>
                <ul>
                    <li>Consider speaking with a mental health professional</li>
                    <li>Practice stress management techniques</li>
                </ul>
                <div class="helpline" style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
                    <h4>📞 KIRAN Helpline: 1800-599-0019 (24/7)</h4>
                </div>
            </div>
        `;
    } else {
        resultClass = 'concerning';
        resultIcon = '🚨';
        resultTitle = 'High Stress - Support Recommended';
        resultDescription = 'Your stress levels appear very high. Professional support is strongly recommended.';
        recommendations = `
            <div class="recommendations">
                <h4>🚨 Urgent Action Required:</h4>
                <ul>
                    <li><strong>Contact a mental health professional immediately</strong></li>
                    <li>Reach out to trusted friends/family today</li>
                    <li>Use emergency services if in crisis</li>
                </ul>
                <div class="helpline" style="margin-top: 20px; padding: 15px; background: #fee2e2; border-radius: 8px; border-left: 4px solid #dc2626;">
                    <h4>📞 Emergency Mental Health Support:</h4>
                    <div style="margin: 10px 0;">
                        <div style="font-size: 1.3em; font-weight: bold; color: #991b1b; margin: 5px 0;">
                            KIRAN: 9152987821
                        </div>
                        <div style="font-size: 1.3em; font-weight: bold; color: #991b1b; margin: 5px 0;">
                            24/7: 1800-599-0019
                        </div>
                    </div>
                </div>
            </div>
        `;

        communityStats = '';
        if (submissionData && submissionData.total_assessments > 0) {
            communityStats = `
            <div class="community-stats" style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 10px;">
                <h4>📊 Your Area Statistics (Pincode: ${submissionData.pincode})</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                    <div style="padding: 10px; background: white; border-radius: 8px;">
                        <div style="font-size: 0.9em; color: #64748b;">Total Assessments</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #0369a1;">${submissionData.total_assessments}</div>
                    </div>
                    <div style="padding: 10px; background: white; border-radius: 8px;">
                        <div style="font-size: 0.9em; color: #64748b;">Area Stress Level</div>
                        <div style="font-size: 1.2em; font-weight: bold;">${submissionData.stress_level || 'N/A'}</div>
                    </div>
                </div>
            </div>
        `;
        }

    }

    resultDiv.innerHTML = `
        <div class="result-icon" style="font-size: 5rem; margin-bottom: 20px; text-align: center;">${resultIcon}</div>
        <h2 class="result-title" style="text-align: center;">${resultTitle}</h2>
        <p class="result-description" style="text-align: center;">${resultDescription}</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0;"><strong>Your Score: ${totalScore}/${maxScore}</strong> (${scorePercentage.toFixed(1)}%)</p>
            <p style="margin: 5px 0; font-size: 0.9em; color: #64748b;">AI-Enhanced Assessment</p>
        </div>
        
        ${recommendations}
        ${communityStats}
        
        <div style="margin-top: 30px; text-align: center;">
            <button class="btn btn-primary" onclick="location.href='/'" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1em;">
                Back to Home
            </button>
        </div>
    `;

    resultDiv.className = `result ${resultClass} show`;
    resultDiv.style.display = 'block';
}