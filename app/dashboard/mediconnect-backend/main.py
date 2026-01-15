from fastapi import FastAPI
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Enable CORS so your Next.js app can talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration (Use your Hugging Face Token here)
API_URL = "https://api-inference.huggingface.co/models/google/med-gamma-2b"
HEADERS = {"Authorization": "Bearer YOUR_HUGGING_FACE_TOKEN_HERE"}

class TriageInput(BaseModel):
    symptoms: str
    specialty: str

@app.post("/analyze")
async def analyze_clinical(data: TriageInput):
    # Professional Clinical Prompt for Med-Gemma
    prompt = f"<|system|>You are a clinical assistant. Use Med-Gemma logic.<|user|>Patient Specialty: {data.specialty}. Symptoms: {data.symptoms}. Provide 1 critical clinical alert for the nurse.<|assistant|>"
    
    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 150, "temperature": 0.2}
    }
    
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        # Clean up the output to only show the assistant's response
        full_text = result[0].get('generated_text', "")
        suggestion = full_text.split("<|assistant|>")[-1].strip()
        return {"suggestion": suggestion}
    else:
        return {"suggestion": "Clinical analysis currently unavailable. Check vitals manually."}

# RUN COMMAND: uvicorn main:app --reload