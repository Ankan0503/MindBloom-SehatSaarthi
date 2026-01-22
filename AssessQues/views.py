from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
GEMINI_MODEL = "gemini-3-pro-preview"  # Correct model name
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

MAX_CHAR_INITIAL = 1000
MAX_CHAR_ADDITIONAL = 500
MIN_CHAR_REQUIRED = 10


@csrf_exempt
@require_http_methods(["POST"])
def generate_question(request):
    """Generate personalized mental health assessment questions"""
    try:
        data = json.loads(request.body)
        conversation_history = data.get('conversation_history', [])
        question_number = data.get('question_number', 1)
        total_questions = data.get('total_questions', 10)
        initial_user_input = data.get('initial_user_input', None)
        user_has_skipped = data.get('user_has_skipped', False)
        
        context = build_conversation_context(
            conversation_history, 
            initial_user_input, 
            user_has_skipped
        )
        
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


@csrf_exempt
@require_http_methods(["POST"])
def grade_response(request):
    """
    Grade user's text response using Gemini AI
    Returns a score between 1-50 based on mental health indicators
    """
    try:
        data = json.loads(request.body)
        
        question_text = data.get('question_text', '')
        selected_option = data.get('selected_option', None)
        selected_option_text = data.get('selected_option_text', '')
        user_text_input = data.get('user_text_input', '')
        initial_user_input = data.get('initial_user_input', '')
        conversation_history = data.get('conversation_history', [])
        
        # Grade the response
        grade_result = grade_with_gemini(
            question_text=question_text,
            selected_option=selected_option,
            selected_option_text=selected_option_text,
            user_text_input=user_text_input,
            initial_user_input=initial_user_input,
            conversation_history=conversation_history
        )
        
        return JsonResponse({
            'success': True,
            'score': grade_result['score'],
            'reasoning': grade_result['reasoning'],
            'severity_level': grade_result['severity_level']
        })
        
    except Exception as e:
        print(f"Error in grade_response: {str(e)}")
        import traceback
        print(traceback.format_exc())
        
        # Return fallback score if AI grading fails
        fallback_score = data.get('selected_option', 25)
        return JsonResponse({
            'success': True,
            'score': fallback_score,
            'reasoning': 'Fallback scoring used',
            'severity_level': 'moderate'
        })


def grade_with_gemini(question_text, selected_option, selected_option_text, 
                      user_text_input, initial_user_input, conversation_history):
    """
    Use Gemini AI to grade mental health response
    Returns score between 1-50
    """
    
    # Build context for grading
    context_parts = []
    
    if initial_user_input:
        context_parts.append(f"User's initial description: {initial_user_input[:300]}")
    
    if conversation_history:
        recent_context = "\n".join([
            f"Q{e['question_number']}: {e.get('question_text', '')[:100]} - "
            f"Response: {e.get('selected_option_text', 'N/A')}"
            for e in conversation_history[-3:]  # Last 3 questions
        ])
        context_parts.append(f"Recent conversation:\n{recent_context}")
    
    context = "\n\n".join(context_parts) if context_parts else "No prior context"
    
    # Build the grading prompt
    system_prompt = """You are a mental health assessment grading expert. Your task is to assign a score between 1-50 that reflects the severity of mental health distress based on the user's response.

SCORING SCALE (1-50):
- 1-12: Minimal distress, healthy coping, positive mental state
- 13-25: Mild to moderate stress, manageable with self-care
- 26-37: Significant distress, may need professional support
- 38-50: Severe distress, urgent professional help recommended

GRADING FACTORS:
1. Severity of symptoms described
2. Impact on daily functioning
3. Duration and frequency of issues
4. Presence of crisis indicators (self-harm thoughts, hopelessness)
5. Coping mechanisms mentioned
6. Support system availability
7. Physical symptoms mentioned
8. Sleep, appetite, energy disturbances

IMPORTANT:
- If ONLY an option is selected (no text), use the predefined score (10, 20, 30, or 40) but scale it to 1-50 range
- If text is provided WITH an option, consider BOTH for comprehensive assessment
- If ONLY text is provided (no option), grade entirely based on text content
- Look for red flags: suicidal ideation, severe isolation, inability to function
- Consider context from previous responses if available

You must respond with ONLY valid JSON in this exact format:
{
  "score": 25,
  "reasoning": "Brief explanation of the score",
  "severity_level": "mild|moderate|significant|severe"
}"""

    # Prepare response summary
    response_summary = []
    
    if selected_option:
        response_summary.append(f"Selected option: '{selected_option_text}' (base severity: {selected_option}/40)")
    
    if user_text_input:
        response_summary.append(f"User's written response: \"{user_text_input}\"")
    
    if not selected_option and not user_text_input:
        response_summary.append("No response provided")
    
    user_prompt = f"""Grade the following mental health assessment response:

QUESTION: {question_text}

USER'S RESPONSE:
{chr(10).join(response_summary)}

CONTEXT FROM ASSESSMENT:
{context}

Provide a score between 1-50 that accurately reflects the mental health distress level. Return ONLY the JSON object."""

    try:
        print(f"🤖 Calling Gemini AI for grading...")
        
        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"{system_prompt}\n\n{user_prompt}"
                }]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
                "responseMimeType": "application/json"
            }
        }
        
        url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=15
        )
        
        print(f"📊 Gemini response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Gemini error: {response.text}")
            raise Exception(f"Gemini API error: {response.status_code}")
        
        response_data = response.json()
        
        if 'candidates' not in response_data or len(response_data['candidates']) == 0:
            raise Exception("No candidates in Gemini response")
        
        candidate = response_data['candidates'][0]
        finish_reason = candidate.get('finishReason', 'UNKNOWN')

        # Check for any finish reason that isn't STOP
        # Or if content is missing regardless of finish reason
        content = candidate.get('content', {})
        
        if 'parts' not in content or not content['parts']:
             print(f"⚠️ Grading content missing. Finish Reason: {finish_reason}")
             print(f"Full candidate: {candidate}")
             return generate_fallback_grade(
                 selected_option, 
                 user_text_input, 
                 error_details=f"No content generated (Reason: {finish_reason})"
             )

        response_text = content['parts'][0]['text'].strip()
        
        # Robust Clean up response
        # Find first '{' and last '}'
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            response_text = response_text[start_idx:end_idx+1]
        
        grade_data = json.loads(response_text)
        
        # Validate score range
        score = grade_data.get('score', 25)
        score = max(1, min(50, score))  # Ensure between 1-50
        
        grade_data['score'] = score
        
        print(f"✅ Gemini grading complete: {score}/50 ({grade_data.get('severity_level', 'moderate')})")
        
        return grade_data
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Response text: {response_text}")
        return generate_fallback_grade(selected_option, user_text_input, error_details=f"JSON Error: {str(e)}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return generate_fallback_grade(selected_option, user_text_input, error_details=f"Network Error: {str(e)}")
    except Exception as e:
        print(f"❌ Error in Gemini grading: {e}")
        import traceback
        print(traceback.format_exc())
        return generate_fallback_grade(selected_option, user_text_input, error_details=f"General Error: {str(e)}")


def generate_fallback_grade(selected_option, user_text_input, error_details=None):
    """Generate fallback grade if AI grading fails"""
    print("⚠️ Using fallback grading")
    
    if selected_option:
        # Scale 10/20/30/40 to 1-50 range
        # 10 -> 12, 20 -> 25, 30 -> 37, 40 -> 50
        score_mapping = {
            10: 12,
            20: 25,
            30: 37,
            40: 50
        }
        score = score_mapping.get(selected_option, 25)
        severity = 'mild' if score <= 12 else 'moderate' if score <= 25 else 'significant' if score <= 37 else 'severe'
    elif user_text_input:
        # Text only - assume moderate
        score = 25
        severity = 'moderate'
    else:
        score = 25
        severity = 'moderate'
    
    reasoning = 'Fallback scoring used due to AI grading unavailability'
    if error_details:
        reasoning += f" [DEBUG ERROR: {error_details}]"

    return {
        'score': score,
        'reasoning': reasoning,
        'severity_level': severity
    }


def build_conversation_context(conversation_history, initial_user_input=None, user_has_skipped=False):
    """Build conversation context with enhanced grading information"""
    context_parts = []
    
    if initial_user_input and not user_has_skipped:
        context_parts.append(
            f"📝 INITIAL USER INPUT (Question 0 - User's self-description):\n"
            f"\"{initial_user_input}\"\n"
            f"[Use this as PRIMARY CONTEXT for all questions. Reference specific concerns they mentioned.]"
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
        ai_graded_score = entry.get('ai_graded_score', None)  # NEW: AI-graded score
        
        response_summary = []
        
        if selected_option:
            response_summary.append(f"Selected option: '{selected_text}' (base: {selected_option}/40)")
        
        if user_text_input:
            response_summary.append(f"User wrote: \"{user_text_input}\"")
        
        if ai_graded_score:
            response_summary.append(f"AI-graded score: {ai_graded_score}/50")
            
            if ai_graded_score >= 37:
                high_stress_areas.append({
                    'question': question_number,
                    'question_text': question_text,
                    'response': selected_text or user_text_input[:100],
                    'severity': ai_graded_score
                })
        
        if user_text_input:
            key_text_insights.append({
                'question': question_number,
                'text': user_text_input,
                'context': question_text
            })
        
        context_entry = (
            f"Q{question_number}: {question_text}\n"
            f"  Response: {' | '.join(response_summary)}"
        )
        
        context_parts.append(context_entry)
    
    context = "\n\n".join(context_parts)
    
    if high_stress_areas:
        focus_areas = "\n".join([
            f"  • Q{area['question']}: {area['question_text']}\n"
            f"    High stress: {area['response']} (severity: {area['severity']}/50)"
            for area in high_stress_areas
        ])
        context += f"\n\n🚨 HIGH STRESS AREAS REQUIRING FOLLOW-UP:\n{focus_areas}"
    
    if key_text_insights:
        insights = "\n".join([
            f"  • Q{insight['question']}: \"{insight['text'][:100]}{'...' if len(insight['text']) > 100 else ''}\""
            for insight in key_text_insights
        ])
        context += f"\n\n💭 KEY USER-PROVIDED INSIGHTS:\n{insights}"
    
    return context


def generate_ai_question(context, question_number, total_questions, conversation_history, initial_user_input=None):
    """Generate AI question using Gemini API"""
    
    if question_number <= 3:
        phase = "initial_broad_assessment"
        if initial_user_input:
            instruction = (
                "The user already described their situation. Ask a focused question "
                "that builds on specific concerns they mentioned."
            )
        else:
            instruction = "Ask a general question to understand their overall mental state."
    elif question_number <= 7:
        phase = "deep_dive"
        instruction = (
            "Dive deeper into areas showing stress. If they provided text responses, "
            "build on what they shared."
        )
    else:
        phase = "wrap_up"
        instruction = (
            "Focus on coping mechanisms, support systems, or important uncovered aspects."
        )
    
    system_prompt = """You are a compassionate mental health assessment assistant generating personalized questions.

CRITICAL INSTRUCTIONS:
- Reference user's specific details from their text responses
- Build naturally on previous responses
- Be warm, non-judgmental, and supportive
- Ask one clear question at a time
- Focus on: sleep, work stress, relationships, self-care, emotions, physical symptoms

You must respond with ONLY valid JSON, no markdown formatting."""

    text_emphasis = ""
    if any(entry.get('user_text_input') for entry in conversation_history):
        text_emphasis = """
⚠️ IMPORTANT: The user has provided detailed text. You MUST:
1. Reference their specific words
2. Build directly on what they shared
3. Show you're listening
4. Personalize the conversation
"""

    user_prompt = f"""Generate question {question_number} of {total_questions}.
Phase: {phase}

{text_emphasis}

Previous Conversation:
{context}

Instructions: {instruction}

Return ONLY valid JSON:
{{
    "question": "Your empathetic question",
    "type": "scale",
    "options": [
        {{"value": 10, "text": "😊 [Positive/low stress]"}},
        {{"value": 20, "text": "😌 [Moderate/manageable]"}},
        {{"value": 30, "text": "😕 [High stress/concerning]"}},
        {{"value": 40, "text": "😰 [Severe/overwhelming]"}}
    ],
    "follow_up_areas": ["area1", "area2"]
}}"""

    try:
        print(f"🤖 Calling Gemini API for question {question_number}...")
        
        # ✅ CORRECT Gemini API format
        headers = {
            "Content-Type": "application/json"
        }
        
        # ✅ CORRECT Gemini payload structure
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"{system_prompt}\n\n{user_prompt}"
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048,
                "responseMimeType": "application/json"
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                }
            ]
        }
        
        url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"📊 Gemini response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Gemini error response: {response.text}")
            raise Exception(f"Gemini API error: {response.status_code}")
        
        response_data = response.json()
        
        # Check for valid response
        if 'candidates' not in response_data or len(response_data['candidates']) == 0:
            raise Exception("No candidates in Gemini response")
        
        candidate = response_data['candidates'][0]
        
        # Check if blocked by safety
        if candidate.get('finishReason') == 'SAFETY':
            print("⚠️ Response blocked by safety filters, using fallback")
            return generate_fallback_question(question_number, conversation_history)
        
        # Safer parsing of response structure
        content = candidate.get('content', {})
        if 'parts' in content:
            response_text = content['parts'][0]['text'].strip()
        else:
            print(f"⚠️ Unexpected structure in candidate content: {content}")
            raise KeyError("'parts' not found in content")

        # Robust Clean up response
        # Find first '{' and last '}'
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            response_text = response_text[start_idx:end_idx+1]
        
        question_data = json.loads(response_text)
        
        # Validate structure
        if not all(key in question_data for key in ['question', 'options']):
            raise ValueError("Invalid question structure")
        
        if 'type' not in question_data:
            question_data['type'] = 'scale'
        
        print(f"✅ Question generated successfully: \"{question_data['question'][:60]}...\"")
        
        return question_data
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Response text: {response_text if 'response_text' in locals() else 'N/A'}")
        return generate_fallback_question(question_number, conversation_history)
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return generate_fallback_question(question_number, conversation_history)
    except Exception as e:
        print(f"❌ Error generating AI question: {e}")
        import traceback
        print(traceback.format_exc())
        return generate_fallback_question(question_number, conversation_history)


def generate_fallback_question(question_number, conversation_history):
    """Generate fallback question if AI fails"""
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
            "question": "How well are you sleeping lately?",
            "options": [
                {"value": 10, "text": "😴 Sleeping soundly and refreshed"},
                {"value": 20, "text": "🌙 Decent with minor interruptions"},
                {"value": 30, "text": "😪 Poor sleep quality"},
                {"value": 40, "text": "😵 Severe insomnia"}
            ]
        },
        {
            "question": "How connected do you feel to people around you?",
            "options": [
                {"value": 10, "text": "❤️ Very connected and supported"},
                {"value": 20, "text": "🤝 Moderately connected"},
                {"value": 30, "text": "😔 Somewhat isolated"},
                {"value": 40, "text": "💔 Very lonely and disconnected"}
            ]
        },
        {
            "question": "How would you rate your ability to relax?",
            "options": [
                {"value": 10, "text": "😌 I relax easily"},
                {"value": 20, "text": "🙂 Can relax with effort"},
                {"value": 30, "text": "😕 Struggling to relax"},
                {"value": 40, "text": "😫 Unable to relax"}
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


@csrf_exempt
@require_http_methods(["GET"])
def test_gemini_connection(request):
    """Test Gemini API connection"""
    try:
        if not GEMINI_API_KEY:
            return JsonResponse({
                'success': False,
                'error': 'GEMINI_API_KEY not found in environment variables',
                'details': 'Please set GEMINI_API_KEY in your .env file'
            }, status=500)

        headers = {"Content-Type": "application/json"}
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": "Say 'Gemini connection successful!' in exactly those words."
                }]
            }]
        }
        
        url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            response_data = response.json()
            message = response_data['candidates'][0]['content']['parts'][0]['text']
            
            return JsonResponse({
                'success': True,
                'message': message,
                'api_working': True,
                'model': 'gemini-3-pro-preview'
            })
        else:
            return JsonResponse({
                'success': False,
                'error': f"API returned {response.status_code}",
                'details': response.text
            }, status=response.status_code)
            
    except Exception as e:
        import traceback
        return JsonResponse({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }, status=500)