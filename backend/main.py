import os
import json
import random
import httpx
import traceback
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import FastAPI, Form, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pymupdf  

load_dotenv()
BHARATCODE_API_KEY = os.getenv("BHARATCODE_API_KEY")

app = FastAPI(title="OfferLens AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class KPIStats(BaseModel):
    total_scans: int
    high_risk_detected: int
    phishing_urls: int
    active_alerts: int

class ScanItem(BaseModel):
    id: str
    asset_name: str
    source: str
    risk_score: float
    flags: int

class EmailRequest(BaseModel):
    email: str

# --- API Endpoints for Frontend Dashboard ---

@app.get("/api/dashboard/kpis", response_model=KPIStats)
async def get_kpis():
    return {"total_scans": 11256, "high_risk_detected": 1525, "phishing_urls": 2056, "active_alerts": 264}

@app.get("/api/dashboard/severity-donut")
async def get_severity_data():
    return [
        {"name": "High Risk", "value": 45, "fill": "#EF4444"},   
        {"name": "Medium Risk", "value": 35, "fill": "#22C55E"}, 
        {"name": "Low Risk", "value": 20, "fill": "#3B82F6"}     
    ]

@app.get("/api/dashboard/status-donut")
async def get_status_data():
    return [
        {"name": "Fraudulent", "value": 40, "fill": "#8B5CF6"},  
        {"name": "Suspicious", "value": 20, "fill": "#EC4899"},  
        {"name": "Safe", "value": 12, "fill": "#10B981"}         
    ]

@app.get("/api/dashboard/trend-chart")
async def get_trend_data():
    trends = []
    base_date = datetime.today() - timedelta(days=7)
    for i in range(7):
        date_str = (base_date + timedelta(days=i)).strftime("%b %d")
        trends.append({"date": date_str, "scams_detected": random.randint(100, 800)})
    return trends

@app.get("/api/dashboard/recent-risks", response_model=List[ScanItem])
async def get_recent_risks():
    return [
        {"id": "scn_001", "asset_name": "TCS_Offer_Letter_2026.pdf", "source": "WhatsApp", "risk_score": 9.2, "flags": 5},
        {"id": "scn_002", "asset_name": "careers-google-portal.com", "source": "SMS Link", "risk_score": 8.7, "flags": 3}
    ]

# --- BharatCode Integration ---

async def analyze_with_bharatcode(extracted_text: str):
    if not BHARATCODE_API_KEY:
        raise HTTPException(status_code=500, detail="BHARATCODE_API_KEY missing in .env file")

    headers = {
        "Authorization": f"Bearer {BHARATCODE_API_KEY}",
        "Content-Type": "application/json"
    }
    
    bharatcode_url = "https://bharatcode.ai/api/model/v1/chat/completions"
    
    payload = {
        "model": "qwen-3.8-27b",
        "messages": [
            {
                "role": "system",
                "content": "You are a cybersecurity AI. Return your analysis STRICTLY as a JSON object with exactly these 4 keys: 'score' (integer 0-100), 'severity' (string: Low, Medium, High, or Critical), 'analysis' (2-3 sentences), 'flags' (list of strings). Do not include markdown blocks."
            },
            {
                "role": "user",
                "content": f"Analyze this text for recruitment fraud:\n\n{extracted_text}"
            }
        ],
        "reasoning_effort": "none",
        "max_tokens": 4000 
    }

    async with httpx.AsyncClient(timeout=90.0) as client:
        try:
            response = await client.post(bharatcode_url, json=payload, headers=headers)
            
            if response.status_code != 200:
                raise HTTPException(status_code=502, detail="BharatCode API rejected the request.")
                
            result = response.json()
            ai_text = result["choices"][0]["message"]["content"].strip()
            
            if ai_text.startswith("```json"):
                ai_text = ai_text[7:-3].strip()
            elif ai_text.startswith("```"):
                ai_text = ai_text[3:-3].strip()
                
            return json.loads(ai_text)
            
        except httpx.ReadTimeout:
            raise HTTPException(status_code=504, detail="BharatCode API timed out.")
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Internal API Error: {str(e)}")

@app.post("/api/scan/file")
async def scan_document(file: UploadFile = File(...)):
    content = await file.read()
    extracted_text = ""
    
    try:
        if file.filename.lower().endswith('.pdf'):
            doc = pymupdf.open(stream=content, filetype="pdf")
            for page in doc:
                extracted_text += page.get_text()
            doc.close()
        else:
            raise HTTPException(status_code=400, detail="Currently only PDF files are supported.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in the PDF.")

    ai_data = await analyze_with_bharatcode(extracted_text)

    return {
        "status": "success",
        "filename": file.filename,
        "overall_score": ai_data.get("score", 75),
        "severity": ai_data.get("severity", "High"),
        "analysis": ai_data.get("analysis", "BharatCode analysis complete."),
        "flags": ai_data.get("flags", ["Suspicious patterns detected"])
    }

@app.post("/api/scan/text")
async def scan_suspicious_text(text: str = Form(...)):
    ai_data = await analyze_with_bharatcode(text)
    return {
        "status": "success",
        "filename": "Pasted Text Analysis",
        "overall_score": ai_data.get("score", 75),
        "severity": ai_data.get("severity", "High"),
        "analysis": ai_data.get("analysis", "BharatCode analysis complete."),
        "flags": ai_data.get("flags", ["Suspicious patterns detected"])
    }

# --- Settings: Test Email Alert Endpoint ---

@app.post("/api/settings/test-email")
async def send_test_email(req: EmailRequest):
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")

    if not sender_email or not sender_password:
        return {"status": "mock_success", "message": "Email credentials missing in .env"}

    try:
        msg = EmailMessage()
        msg.set_content(
            "Hello!\n\n"
            "This is a real-time security alert from OfferLens AI.\n"
            "Your email notifications are now active and being monitored by our systems.\n\n"
            "Stay protected,\nThe OfferLens Team"
        )
        msg['Subject'] = "OfferLens AI - Security Alert Active"
        msg['From'] = sender_email
        msg['To'] = req.email

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        
        return {"status": "success"}
    except Exception as e:
        print(f"SMTP Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")