import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# 1. Load the environment variables FIRST
load_dotenv()

# 2. Grab the key and check if it actually exists
GROQ_API_KEY = os.getenv("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")

if not GROQ_API_KEY:
    print("CRITICAL ERROR: GROQ_API_KEY not found in .env file!")
    # We don't crash here, but we will handle it in the function
else:
    print("SUCCESS: Groq API Key loaded successfully.")

# 3. Initialize the Client
client = Groq(api_key=GROQ_API_KEY)

app = FastAPI()

# 4. Standard CORS setup for your Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TriageRequest(BaseModel):
    name: str        # This allows the backend to accept the name field
    symptoms: str
    specialty: str
    temp: str = ""
    bp: str = ""
@app.post("/api/analyze")
async def analyze_symptoms(data: TriageRequest):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a Nigerian clinical assistant. Give 3 quick triage points."},
                {"role": "user", "content": f"Patient: {data.name}. Symptoms: {data.symptoms}"}
            ]
        )
        return {"suggestion": response.choices[0].message.content}
    except Exception as e:
        print(f"API Error: {e}")
        return {"suggestion": "AI is momentarily unavailable. Follow manual protocol."}