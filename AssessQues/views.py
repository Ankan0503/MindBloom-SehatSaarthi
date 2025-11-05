# views.py - Enhanced Django view with text input support
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import requests
import os

# OpenRouter API Configuration
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

@csrf_exempt
@require_http_methods(["POST"])
def generate_question(request):
    """
    Generate personalized mental health assessment questions using OpenRouter
    with support for initial user input and additional text responses
    """
    try:
        data = json.loads(request.body)
        conversation_history = data.get('conversation_history', [])
        question_number = data.get('question_number', 1)
        total_questions = data.get('total_questions', 10)
        initial_user_input = data.get('initial_user_input', None)
        user_has_skipped = data.get('user_has_skipped', False)
        
        # Build context from previous answers
        context = build_conversation_context(
            conversation_history, 
            initial_user_input, 
            user_has_skipped
        )
        
        # Generate question using OpenRouter AI
        question_data = generate_ai_question(
            context, 
            question_number, 
            total_questions,
            conversation_history,
            initial_user_input
        )
        
        return JsonResponse({
            'success': True,
            'question': question_data['question'],
            'options': question_data['options'],
            'type': question_data['type'],
            'follow_up_areas': question_data.get('follow_up_areas', [])
        })
        
    except Exception as e:
        print(f"Error in generate_question: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


def build_conversation_context(conversation_history, initial_user_input=None, user_has_skipped=False):
    """
    Build enhanced conversation context including initial user input and text responses
    """
    context_parts = []
    
    # Add initial user input if provided
    if initial_user_input and not user_has_skipped:
        context_parts.append(
            f"📝 INITIAL USER INPUT (Question 0 - User's self-description):\n"
            f"\"{initial_user_input}\"\n"
            f"[This is what the user wrote about their mental health before starting. "
            f"Use this as PRIMARY CONTEXT for all questions. Reference specific concerns they mentioned.]"
        )
    
    if not conversation_history:
        if initial_user_input:
            return "\n\n".join(context_parts) + "\n\nThis is the first formal question. Build directly on what they wrote above."
        return "This is the first question. Start with a broad assessment."
    
    high_stress_areas = []
    key_text_insights = []
    
    for entry in conversation_history:
        selected_option = entry.get('selected_option')
        selected_text = entry.get('selected_option_text', '')
        user_text_input = entry.get('user_text_input', '')
        question_text = entry.get('question_text', '')
        question_number = entry.get('question_number')
        has_both = entry.get('has_both', False)
        
        # Build response summary
        response_summary = []
        
        if selected_option:
            response_summary.append(f"Selected option: '{selected_text}' (stress level: {selected_option}/40)")
            
            # Track high stress responses
            if selected_option >= 30:
                high_stress_areas.append({
                    'question': question_number,
                    'question_text': question_text,
                    'response': selected_text,
                    'severity': selected_option
                })
        
        if user_text_input:
            response_summary.append(f"User wrote: \"{user_text_input}\"")
            
            # Extract key insights from text
            key_text_insights.append({
                'question': question_number,
                'text': user_text_input,
                'context': question_text
            })
        
        if not selected_option and user_text_input:
            response_summary.append("[User provided only text, no option selected]")
        
        # Combine into context entry
        context_entry = (
            f"Q{question_number}: {question_text}\n"
            f"  Response: {' | '.join(response_summary)}"
        )
        
        if has_both:
            context_entry += "\n  [User provided BOTH option AND detailed text - this is particularly informative]"
        
        context_parts.append(context_entry)
    
    context = "\n\n".join(context_parts)
    
    # Add high stress areas summary
    if high_stress_areas:
        focus_areas = "\n".join([
            f"  • Q{area['question']}: {area['question_text']}\n"
            f"    High stress: {area['response']} (severity: {area['severity']}/40)"
            for area in high_stress_areas
        ])
        context += f"\n\n🚨 HIGH STRESS AREAS REQUIRING FOLLOW-UP:\n{focus_areas}"
    
    # Add key text insights summary
    if key_text_insights:
        insights = "\n".join([
            f"  • Q{insight['question']}: \"{insight['text'][:100]}{'...' if len(insight['text']) > 100 else ''}\""
            for insight in key_text_insights
        ])
        context += f"\n\n💭 KEY USER-PROVIDED INSIGHTS (reference these directly):\n{insights}"
    
    return context


def generate_ai_question(context, question_number, total_questions, conversation_history, initial_user_input=None):
    """
    Use OpenRouter AI to generate personalized next question
    Enhanced to leverage user's text input
    """
    
    # Determine assessment phase
    if question_number <= 3:
        phase = "initial_broad_assessment"
        if initial_user_input:
            instruction = (
                "The user already described their situation in detail. Ask a focused question "
                "that builds DIRECTLY on specific concerns they mentioned. Reference their exact words."
            )
        else:
            instruction = "Ask a general question to understand their overall mental state."
    elif question_number <= 7:
        phase = "deep_dive"
        instruction = (
            "Dive deeper into areas showing stress. If they provided text responses, "
            "acknowledge and build on what they shared. Use their own words to show you're listening."
        )
    else:
        phase = "wrap_up"
        instruction = (
            "Focus on coping mechanisms, support systems, or important aspects not yet covered. "
            "If they've been detailed in text responses, acknowledge their openness."
        )
    
    system_prompt = """You are a compassionate mental health assessment assistant. Your role is to generate personalized, empathetic questions.

CRITICAL INSTRUCTIONS:
- When users provide text responses, READ THEM CAREFULLY and reference specific details
- Build each question naturally from what they've shared, using their own words when appropriate
- If they mentioned something like "work deadlines", ask specifically about work stress
- If they wrote about "not sleeping", focus on sleep patterns
- Make them feel HEARD - show you're paying attention to their written responses
- Be warm, non-judgmental, and supportive
- Ask one clear question at a time

Guidelines:
- Build naturally on previous responses - both option selections AND text input
- Focus on actionable areas: sleep, work stress, relationships, self-care, emotions, physical symptoms
- Match the assessment phase (broad → deep dive → wrap-up)
- Questions should feel conversational, like a caring professional

You must respond with ONLY valid JSON, nothing else."""

    # Build user prompt with emphasis on text responses
    text_emphasis = ""
    if any(entry.get('user_text_input') for entry in conversation_history):
        text_emphasis = """
⚠️ IMPORTANT: The user has provided detailed text responses. You MUST:
1. Reference their specific words and concerns
2. Build directly on what they shared
3. Show you're listening by acknowledging details they mentioned
4. Make the conversation feel personalized, not generic
"""

    user_prompt = f"""Generate the next question for a mental wellness assessment.

Assessment Progress: Question {question_number} of {total_questions}
Phase: {phase}

{text_emphasis}

Previous Conversation:
{context}

Instructions: {instruction}

Return ONLY a valid JSON object (no markdown, no explanation):
{{
    "question": "Your empathetic, personalized question here",
    "type": "scale",
    "options": [
        {{"value": 10, "text": "😊 [Positive/low stress response]"}},
        {{"value": 20, "text": "😌 [Moderate/manageable response]"}},
        {{"value": 30, "text": "😕 [High stress/concerning response]"}},
        {{"value": 40, "text": "😔 [Severe/overwhelming response]"}}
    ],
    "follow_up_areas": ["area1", "area2"]
}}

Important:
- Use emojis that match sentiment (😊😌😕😔)
- Make options specific to the question
- Progress logically from low stress (10) to high stress (40)
- Return ONLY the JSON object"""

    try:
        print(f"🤖 Calling OpenRouter API for question {question_number}...")
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "Mental Health Assessment"
        }
        
        payload = {
            "model": "openai/gpt-oss-20b:free",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 800
        }
        
        response = requests.post(
            OPENROUTER_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Full error response: {response.text}")
            raise Exception(f"OpenRouter API error: {response.status_code}")
        
        response_data = response.json()
        
        if 'choices' not in response_data or len(response_data['choices']) == 0:
            raise Exception("No choices in API response")
        
        response_text = response_data['choices'][0]['message']['content'].strip()
        
        # Clean up response
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0].strip()
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0].strip()
        
        response_text = response_text.strip()
        
        question_data = json.loads(response_text)
        
        # Validate structure
        if not all(key in question_data for key in ['question', 'options']):
            raise ValueError("Invalid question structure from AI")
        
        if len(question_data['options']) < 4:
            raise ValueError("Not enough options generated")
        
        if 'type' not in question_data:
            question_data['type'] = 'scale'
        
        print(f"✅ Question generated successfully!")
        
        return question_data
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        return generate_fallback_question(question_number, conversation_history)
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return generate_fallback_question(question_number, conversation_history)
    except Exception as e:
        print(f"❌ Error generating AI question: {e}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return generate_fallback_question(question_number, conversation_history)


def generate_fallback_question(question_number, conversation_history):
    """Generate a fallback question if AI fails"""
    print(f"⚠️ Using fallback question {question_number}")
    
    fallback_questions = [
        {
            "question": "How would you describe your energy levels throughout the day?",
            "options": [
                {"value": 10, "text": "⚡ Full of energy and vitality"},
                {"value": 20, "text": "🔋 Generally good with occasional dips"},
                {"value": 30, "text": "😴 Often feeling tired or drained"},
                {"value": 40, "text": "😵 Constantly exhausted"}
            ]
        },
        {
            "question": "How often do you feel overwhelmed by your responsibilities?",
            "options": [
                {"value": 10, "text": "😊 Rarely, I manage well"},
                {"value": 20, "text": "😌 Sometimes, but I cope"},
                {"value": 30, "text": "😟 Frequently feel overwhelmed"},
                {"value": 40, "text": "😰 Almost always drowning in tasks"}
            ]
        },
        {
            "question": "How would you rate your ability to relax and unwind?",
            "options": [
                {"value": 10, "text": "😌 I relax easily and often"},
                {"value": 20, "text": "🙂 I can relax with some effort"},
                {"value": 30, "text": "😕 Struggling to truly relax"},
                {"value": 40, "text": "😫 Unable to relax at all"}
            ]
        },
        {
            "question": "How connected do you feel to the people around you?",
            "options": [
                {"value": 10, "text": "❤️ Very connected and supported"},
                {"value": 20, "text": "🤝 Moderately connected"},
                {"value": 30, "text": "😔 Somewhat isolated"},
                {"value": 40, "text": "💔 Very lonely and disconnected"}
            ]
        },
        {
            "question": "How often do you experience physical tension or discomfort?",
            "options": [
                {"value": 10, "text": "😌 Rarely have physical symptoms"},
                {"value": 20, "text": "🤕 Occasional tension or headaches"},
                {"value": 30, "text": "😖 Frequent physical discomfort"},
                {"value": 40, "text": "😩 Constant pain or tension"}
            ]
        },
        {
            "question": "How satisfied are you with your work-life balance?",
            "options": [
                {"value": 10, "text": "✨ Very balanced and fulfilled"},
                {"value": 20, "text": "⚖️ Mostly balanced with minor issues"},
                {"value": 30, "text": "😓 Struggling to find balance"},
                {"value": 40, "text": "😫 Completely imbalanced and burnt out"}
            ]
        },
        {
            "question": "How well are you sleeping lately?",
            "options": [
                {"value": 10, "text": "😴 Sleeping soundly and waking refreshed"},
                {"value": 20, "text": "🌙 Decent sleep with minor interruptions"},
                {"value": 30, "text": "😪 Poor sleep quality or difficulty falling asleep"},
                {"value": 40, "text": "😵 Severe insomnia or constant exhaustion"}
            ]
        },
        {
            "question": "How often do racing thoughts or worries keep you from focusing?",
            "options": [
                {"value": 10, "text": "🧘 I maintain focus easily"},
                {"value": 20, "text": "💭 Occasionally distracted by worries"},
                {"value": 30, "text": "😟 Frequently interrupted by anxious thoughts"},
                {"value": 40, "text": "🌪️ Constantly overwhelmed by racing thoughts"}
            ]
        },
        {
            "question": "How would you describe your mood over the past week?",
            "options": [
                {"value": 10, "text": "😊 Generally positive and upbeat"},
                {"value": 20, "text": "😐 Neutral with ups and downs"},
                {"value": 30, "text": "😔 More down than usual"},
                {"value": 40, "text": "😢 Persistently low or hopeless"}
            ]
        },
        {
            "question": "How comfortable are you reaching out for support when needed?",
            "options": [
                {"value": 10, "text": "🤗 Very comfortable asking for help"},
                {"value": 20, "text": "👥 Somewhat comfortable with trusted people"},
                {"value": 30, "text": "😬 Difficult but I try"},
                {"value": 40, "text": "🚫 Unable to ask for help"}
            ]
        }
    ]
    
    index = (question_number - 1) % len(fallback_questions)
    question = fallback_questions[index]
    
    return {
        "question": question["question"],
        "type": "scale",
        "options": question["options"],
        "follow_up_areas": []
    }

# @csrf_exempt  # Or use Django's CSRF middleware properly
# @require_http_methods(["POST"])
# def submit_assessment(request):
#     try:
#         data = json.loads(request.body)
#         pincode = data.get('pincode')
#         score = data.get('score')
#         max_score = data.get('max_score')
#         fingerprint = data.get('fingerprint')
#         conversation_history = data.get('conversation_history', [])
#         initial_user_input = data.get('initial_user_input')
        
#         # Store in database
#         # Calculate stress level for area
#         # Return response
        
#         return JsonResponse({
#             'success': True,
#             'pincode': pincode,
#             'total_assessments': 150,  # From database
#             'stress_level': 'Moderate'  # Calculate from area data
#         })
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

# Test endpoint
@csrf_exempt
@require_http_methods(["GET"])
def test_openrouter_connection(request):
    """Test endpoint to verify OpenRouter API is working"""
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "Test Connection"
        }
        
        payload = {
            "model": "openai/gpt-oss-20b:free",
            "messages": [
                {"role": "user", "content": "Say 'OpenRouter connection successful!' in exactly those words."}
            ],
            "max_tokens": 50
        }
        
        response = requests.post(
            OPENROUTER_API_URL,
            headers=headers,
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            response_data = response.json()
            message = response_data['choices'][0]['message']['content']
            
            return JsonResponse({
                'success': True,
                'message': message,
                'api_working': True,
                'status_code': response.status_code,
                'model': 'openai/gpt-oss-20b:free'
            })
        else:
            return JsonResponse({
                'success': False,
                'error': f"API returned status {response.status_code}",
                'details': response.text,
                'api_working': False
            }, status=response.status_code)
            
    except Exception as e:
        import traceback
        return JsonResponse({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc(),
            'api_working': False
        }, status=500)