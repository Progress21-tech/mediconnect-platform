import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# 1. INITIALIZE ENVIRONMENT
load_dotenv()
GROQ_API_KEY = os.getenv("=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")

# 2. INITIALIZE GROQ CLIENT
# It will use the key we loaded from .env
client = Groq(api_key=GROQ_API_KEY)

app = FastAPI()

# 3. CORS CONFIGURATION
# This allows your Next.js frontend to talk to this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. DATA MODEL
# This MUST match the names in your React frontend exactly
class TriageRequest(BaseModel):
    name: str
    symptoms: str
    specialty: str
    temp: str = ""
    bp: str = ""

@app.get("/")
def home():
    return {"status": "MediConnect Backend is Live"}

@app.post("/api/analyze")
async def analyze_symptoms(data: TriageRequest):
    print(f"--- Processing Triage for: {data.name} ---")
    try:
        # The AI Request
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a clinical assistant in a Nigerian hospital. Provide 3 rapid triage bullet points. Focus on urgency and potential local risks like malaria or hypertension."
                },
                {
                    "role": "user", 
                    "content": f"Patient: {data.name}. Vitals: BP {data.bp}, Temp {data.temp}. Symptoms: {data.symptoms}"
                }
            ],
            temperature=0.2,
            max_tokens=150
        )
        
        suggestion = response.choices[0].message.content
        print("AI successfully generated suggestion.")
        return {"suggestion": suggestion}

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return {"suggestion": "AI is currently offline. Please follow manual hospital protocols."}