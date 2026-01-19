from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os

app = FastAPI()

# 1. SECURITY & CONNECTION: Allow your Next.js frontend to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. CLIENT SETUP: Use your 'gsk_' key here
# Replace the string below with your actual Groq API Key
import os
GROQ_API_KEY = os.getenv("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") # This is the safe way to handle API keys
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable not set")
client = Groq(api_key=GROQ_API_KEY)

# 3. DATA STRUCTURE: Matches your frontend 'formData'
class TriageRequest(BaseModel):
    symptoms: str
    specialty: str
    temp: str = ""
    bp: str = ""

@app.get("/")
def home():
    return {"status": "MediConnect Backend is Online and Ready"}

@app.post("/api/analyze")
async def analyze_symptoms(data: TriageRequest):
    if not data.symptoms or len(data.symptoms) < 5:
        return {"suggestion": "Please enter more detailed symptoms for AI analysis."}

    try:
        # 4. CLINICAL PROMPT: Instructing the AI to act like a Nigerian Medical Specialist
        # We use Llama 3.3 70b because it is extremely smart but still responds in < 1 second
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a Clinical AI Assistant for Nigerian healthcare professionals. "
                        "Task: Provide a rapid triage assessment. "
                        "Format: Use 3 clear bullet points. "
                        "Context: Consider local Nigerian health realities (e.g., malaria, typhoid, maternal health). "
                        "Tone: Professional, urgent, and concise to save time."
                    )
                },
                {
                    "role": "user",
                    "content": f"Ward: {data.specialty}. Vitals: BP {data.bp}, Temp {data.temp}. Symptoms: {data.symptoms}"
                }
            ],
            temperature=0.2, # Low temperature ensures medical accuracy over creativity
            max_tokens=150   # Keeps responses short to save data and time
        )
        
        # 5. RESPONSE: Send the AI's advice back to the frontend
        suggestion = response.choices[0].message.content
        return {"suggestion": suggestion}

    except Exception as e:
        # Log the actual error to your terminal so you can see it
        print(f"Detailed Error: {e}")
        return {"suggestion": "AI connection blip. Please follow standard hospital triage protocols."}

# To run: python -m uvicorn main:app --reload