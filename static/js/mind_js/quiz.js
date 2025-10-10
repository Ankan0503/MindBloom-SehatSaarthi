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

const QUESTIONS_TO_SHOW = 10;
let selectedQuestions = [];
let currentQuestion = 0;
let totalQuestions = QUESTIONS_TO_SHOW;
let answers = {};
let userFingerprint = null;
let detectedPincode = null;
let locationPermissionGranted = false;

const questionsContainer = document.getElementById('questionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('quizProgressFill');
const progressText = document.getElementById('quizProgressText');
const resultDiv = document.getElementById('result');
const form = document.getElementById('quizForm');
const pincodeSection = document.getElementById('pincodeSection');
const pincodeInput = document.getElementById('pincodeInput');

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
                    const response = await fetch('/api/get-pincode-from-location/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ latitude, longitude })
                    });
                    
                    const data = await response.json();
                    if (data.success && data.pincode) {
                        resolve(data.pincode);
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.error('Error fetching pincode from location:', error);
                    resolve(null);
                }
            },
            (error) => {
                console.log('Location permission denied or error:', error.message);
                locationPermissionGranted = false;
                resolve(null);
            },
            {
                timeout: 10000,
                maximumAge: 0,
                enableHighAccuracy: true
            }
        );
    });
}

async function checkEligibility() {
    try {
        const response = await fetch('/api/check-eligibility/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    const container = document.querySelector('.quizzz');
    container.innerHTML = `
        <div class="header">
            <h1>⏳ Assessment Cooldown Active</h1>
            <p>Thank you for participating in our mental health survey!</p>
        </div>

        <div class="result moderate show" style="max-width: 600px; margin: 40px auto;">
            <div class="result-icon" style="font-size: 4rem;">⏰</div>
            <h2 class="result-title">Please Wait ${daysRemaining} Day${daysRemaining > 1 ? 's' : ''}</h2>
            <p class="result-description" style="margin: 20px 0;">
                You have already completed this assessment recently. 
                To maintain data integrity and prevent duplicate responses, 
                you can retake the assessment in <strong>${daysRemaining} day(s)</strong>.
            </p>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0; color: #0369a1;">
                    <strong>Why the cooldown?</strong><br>
                    This helps us maintain accurate mental health statistics for your area 
                    and prevents gaming the system. Your honest participation matters!
                </p>
            </div>

            <div class="cooldown-buttons">
                <button class="btn btn-secondary" onclick="location.href='/'">🏠 Back to Home</button>
                <button class="btn btn-primary" onclick="location.href=mapUrl">🗺️ View Stress Map</button>
            </div>
        </div>

        <style>
            .cooldown-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 30px;
                flex-wrap: wrap;
            }

            .cooldown-buttons .btn {
                min-width: 160px;
                padding: 12px 25px;
                font-size: 1rem;
                border-radius: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: none;
            }

            .cooldown-buttons .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .cooldown-buttons .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            }

            .cooldown-buttons .btn-secondary {
                background: #f8f9fa;
                color: #333;
                border: 2px solid #667eea;
            }

            .cooldown-buttons .btn-secondary:hover {
                background: #667eea;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 6px 18px rgba(102, 126, 234, 0.3);
            }

            @media (max-width: 600px) {
                .cooldown-buttons {
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }

                .cooldown-buttons .btn {
                    width: 90%;
                    font-size: 0.95rem;
                }
            }
        </style>
    `;
}



function selectRandomQuestions() {
    const shuffled = [...allQuestionsData].sort(() => 0.5 - Math.random());
    selectedQuestions = shuffled.slice(0, QUESTIONS_TO_SHOW);
}

function generateQuestions() {
    questionsContainer.innerHTML = '';

    selectedQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-slide';
        questionDiv.dataset.question = index + 1;
        if (index === 0) questionDiv.classList.add('active');

        const optionsHTML = question.options.map(option => `
            <label class="option">
                <input type="radio" name="q${index + 1}" value="${option.value}" required>
                <span class="option-text">${option.text}</span>
            </label>
        `).join('');

        questionDiv.innerHTML = `
            <h3 class="question-title">Question ${index + 1}: ${question.title}</h3>
            <div class="options">
                ${optionsHTML}
            </div>
        `;

        questionsContainer.appendChild(questionDiv);
    });
}

function showQuestion(n) {
    const slides = document.querySelectorAll('.question-slide');
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[n]) {
        slides[n].classList.add('active');
    }

    prevBtn.style.display = n === 0 ? 'none' : 'inline-block';
    
    if (n === totalQuestions - 1) {
        nextBtn.textContent = 'Complete Assessment';
    } else {
        nextBtn.textContent = 'Next';
    }
    
    updateProgress();
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Question ${currentQuestion + 1} of ${totalQuestions}`;
}

function nextQuestion() {
    const currentQuestionName = `q${currentQuestion + 1}`;
    if (!answers[currentQuestionName]) {
        alert('Please select an answer before proceeding.');
        return;
    }

    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        showPincodeSection();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

function showPincodeSection() {
    document.querySelector('.quiz-content').style.display = 'none';
    document.querySelector('.quiz-progress-container').style.display = 'none';
    pincodeSection.style.display = 'flex';
    
    const helperText = locationPermissionGranted 
        ? '<p style="color: #10b981; margin-top: 10px;">✓ Location detected automatically</p>'
        : '<p style="color: #f59e0b; margin-top: 10px;">⚠ Please enter your pincode manually</p>';
    
    if (!pincodeSection.querySelector('.helper-text')) {
        pincodeSection.insertAdjacentHTML('beforeend', `<div class="helper-text">${helperText}</div>`);
    }
}

async function submitAssessment(pincode, score, maxScore) {
    try {
        const response = await fetch('/api/submit-assessment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pincode: pincode,
                score: score,
                max_score: maxScore,
                fingerprint: userFingerprint
            })
        });
        
        const data = await response.json();
        
        if (response.status === 429) {
            alert(data.message);
            setTimeout(() => location.reload(), 2000);
            return null;
        }
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit assessment');
        }
        
        return data;
    } catch (error) {
        console.error('Error submitting assessment:', error);
        throw error;
    }
}

async function displayResults(totalScore, maxScore, submissionData, days_rem) {
    pincodeSection.style.display = 'none';
    form.style.display = 'none';
    document.querySelector('.quiz-progress-container').style.display = 'none';

    let resultClass, resultIcon, resultTitle, resultDescription, recommendations;
    const scorePercentage = (totalScore / maxScore) * 100;

    if (scorePercentage <= 30) {
        resultClass = 'excellent';
        resultIcon = '🌟';
        resultTitle = 'Excellent Mental Wellness!';
        resultDescription = 'You\'re doing great! Your stress levels are well-managed and you have healthy coping mechanisms in place.';
        recommendations = `
            <div class="recommendations">
                <h4>Keep up the great work:</h4>
                <ul>
                    <li>Continue your current self-care practices</li>
                    <li>Maintain your work-life balance</li>
                    <li>Share your strategies with others</li>
                    <li>Consider mentoring someone who needs support</li>
                </ul>
            </div>
        `;
    } else if (scorePercentage <= 50) {
        resultClass = 'good';
        resultIcon = '😊';
        resultTitle = 'Good Mental Health';
        resultDescription = 'You\'re doing well overall, but there\'s room for improvement. Some stress is normal, but let\'s work on managing it better.';
        recommendations = `
            <div class="recommendations">
                <h4>Recommended actions:</h4>
                <ul>
                    <li>Practice deep breathing exercises daily</li>
                    <li>Try meditation or mindfulness (even 5 minutes helps)</li>
                    <li>Ensure 7-8 hours of sleep</li>
                    <li>Engage in regular physical activity</li>
                    <li>Connect with friends and family regularly</li>
                </ul>
            </div>
        `;
    } else if (scorePercentage <= 75) {
        resultClass = 'moderate';
        resultIcon = '😟';
        resultTitle = 'Moderate Stress Levels';
        resultDescription = 'You\'re experiencing significant stress that may be impacting your daily life. It\'s important to take proactive steps now.';
        recommendations = `
            <div class="recommendations">
                <h4>Important steps to take:</h4>
                <ul>
                    <li>Consider speaking with a mental health professional</li>
                    <li>Practice stress management techniques daily</li>
                    <li>Reach out to trusted friends or family for support</li>
                    <li>Evaluate and adjust your daily routine</li>
                    <li>Limit caffeine and ensure good nutrition</li>
                </ul>
                <div class="helpline" style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
                    <h4>📞 Mental Health Support:</h4>
                    <div class="helpline-number" style="font-size: 1.2em; font-weight: bold; color: #92400e;">
                        KIRAN Helpline: 1800-599-0019 (24/7)
                    </div>
                </div>
            </div>
        `;
    } else {
        resultClass = 'concerning';
        resultIcon = '🚨';
        resultTitle = 'High Stress - Support Recommended';
        resultDescription = 'Your stress levels are very high and may require professional attention. Please don\'t hesitate to reach out for help - you\'re not alone.';
        recommendations = `
            <div class="recommendations">
                <h4>🚨 Urgent Action Required:</h4>
                <ul>
                    <li><strong>Contact a mental health professional immediately</strong></li>
                    <li>Reach out to trusted friends or family today</li>
                    <li>Use emergency services if you\'re in crisis</li>
                    <li>Don\'t face this alone - support is available and effective</li>
                </ul>
                <div class="helpline" style="margin-top: 20px; padding: 15px; background: #fee2e2; border-radius: 8px; border-left: 4px solid #dc2626;">
                    <h4>📞 Emergency Mental Health Support:</h4>
                    <div style="margin: 10px 0;">
                        <div class="helpline-number" style="font-size: 1.3em; font-weight: bold; color: #991b1b; margin: 5px 0;">
                            KIRAN Mental Health: 9152987821
                        </div>
                        <div class="helpline-number" style="font-size: 1.3em; font-weight: bold; color: #991b1b; margin: 5px 0;">
                            24/7 Helpline: 1800-599-0019
                        </div>
                    </div>
                    <p style="margin-top: 10px; color: #7f1d1d; font-size: 0.95em;">
                        These helplines are free, confidential, and available 24/7. Trained professionals are ready to help you.
                    </p>
                </div>
            </div>
        `;
    }

    let communityStats = '';
    if (submissionData && submissionData.total_assessments > 0) {
        const stressLevelLabels = {
            'excellent': '🟢 Excellent',
            'good': '🟡 Good',
            'moderate': '🟠 Moderate',
            'concerning': '🔴 Concerning'
        };
        
        communityStats = `
            <div class="community-stats" style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 10px;">
                <h4 style="margin-bottom: 15px;">📊 Your Area Statistics (Pincode: ${submissionData.pincode})</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                    <div style="padding: 10px; background: white; border-radius: 8px;">
                        <div style="font-size: 0.9em; color: #64748b;">Total Assessments</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #0369a1;">${submissionData.total_assessments}</div>
                    </div>
                    <div style="padding: 10px; background: white; border-radius: 8px;">
                        <div style="font-size: 0.9em; color: #64748b;">Area Stress Level</div>
                        <div style="font-size: 1.2em; font-weight: bold; color: ${submissionData.color};">
                            ${stressLevelLabels[submissionData.stress_level] || submissionData.stress_level}
                        </div>
                    </div>
                </div>
                <p style="color: #0369a1; font-size: 0.9em; margin-top: 15px; line-height: 1.5;">
                    <strong>Thank you for participating!</strong> Your contribution helps build a comprehensive 
                    mental health map of India, enabling better support and resources for your community.
                </p>
            </div>
        `;
    }

    resultDiv.innerHTML = `
        <div class="result-icon" style="font-size: 5rem; margin-bottom: 20px;">${resultIcon}</div>
        <h2 class="result-title" style="margin-bottom: 15px;">${resultTitle}</h2>
        <p class="result-description" style="font-size: 1.1em; margin-bottom: 20px;">${resultDescription}</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your Score: ${totalScore}/${maxScore}</strong> (${scorePercentage.toFixed(1)}%)</p>
        </div>
        
        ${recommendations}
        ${communityStats}
        
        <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; color: #78350f; font-size: 0.95em;">
                <strong>⏰ Cooldown Period:</strong> You can retake this assessment in ${days_rem} days to track your progress.
                This helps maintain data accuracy.
            </p>
        </div>
        
        <div style="margin-top: 30px;">
            <button class="btn btn-primary" onclick="location.href='/'">Back to Home</button>
        </div>
    `;

    resultDiv.className = `result ${resultClass} show`;
    resultDiv.style.display = 'block';
}

function addEventListeners() {
    prevBtn.addEventListener('click', prevQuestion);
    nextBtn.addEventListener('click', nextQuestion);

    document.addEventListener('click', function (e) {
        if (e.target.closest('.option')) {
            const option = e.target.closest('.option');
            const input = option.querySelector('input[type="radio"]');
            if (!input) return;

            const questionName = input.name;
            const questionSlide = option.closest('.question-slide');
            
            if (questionSlide) {
                questionSlide.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }

            option.classList.add('selected');
            input.checked = true;
            answers[questionName] = parseInt(input.value);
            
            console.log(`Answer recorded: ${questionName} = ${answers[questionName]}`);
        }
    });

    document.getElementById('getResultBtn').addEventListener('click', async function() {
        const pin = pincodeInput.value.trim();
        
        if (!/^\d{6}$/.test(pin)) {
            alert("Please enter a valid 6-digit pincode.");
            pincodeInput.focus();
            return;
        }
        
        const answeredQuestions = Object.keys(answers).length;
        if (answeredQuestions !== totalQuestions) {
            alert(`Please answer all questions. You have answered ${answeredQuestions} out of ${totalQuestions} questions.`);
            return;
        }
        
        const btn = this;
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Submitting...';
        btn.style.cursor = 'wait';
        
        try {
            const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
            const maxScore = totalQuestions * 40;
            
            console.log(`Submitting assessment: Score=${totalScore}/${maxScore}, Pincode=${pin}`);
            
            const submissionResult = await submitAssessment(pin, totalScore, maxScore);
            
            if (submissionResult) {
                console.log('Assessment submitted successfully:', submissionResult);
                await displayResults(totalScore, maxScore, submissionResult, submissionResult.days_remaining);
            } else {
                throw new Error('Failed to submit assessment');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit assessment. Please try again. Error: ' + error.message);
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.cursor = 'pointer';
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    pincodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('getResultBtn').click();
        }
    });

    pincodeInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^\d]/g, '');
    });
}

async function init() {
    console.log('Initializing Mental Health Assessment...');
    
    userFingerprint = generateFingerprint();
    console.log('User fingerprint generated');
    
    const isEligible = await checkEligibility();
    if (!isEligible) {
        console.log('User not eligible - cooldown active');
        return;
    }
    
    console.log('User eligible - proceeding with assessment');
    
    selectRandomQuestions();
    console.log(`Selected ${selectedQuestions.length} random questions`);
    
    generateQuestions();
    showQuestion(0);
    updateProgress();
    addEventListeners();
    
    console.log('Assessment initialized successfully');
    
    console.log('Attempting to detect location...');
    detectedPincode = await requestLocation();
    
    if (detectedPincode) {
        console.log('Location detected, pincode:', detectedPincode);
        pincodeInput.value = detectedPincode;
        pincodeInput.setAttribute('placeholder', `Detected: ${detectedPincode}`);
    } else {
        console.log('Location not detected - user will enter manually');
        pincodeInput.setAttribute('placeholder', 'Enter your 6-digit pincode');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting initialization...');
    init();
});