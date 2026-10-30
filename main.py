import os
import cv2 # type: ignore
import dlib # type: ignore
import numpy as np # type: ignore
import subprocess
import whisper # type: ignore
from transformers import pipeline
from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi # type: ignore
import json

# Paths (dynamically set based on upload)
VIDEO_PATH = "temp/uploaded_video.mp4"
AUDIO_PATH = "temp/audio.wav"
TRANSCRIPTION_PATH = "temp/transcription.txt"
REPORT_PATH = "temp/engagement_report.txt"

# Initialize Dlib face and landmark detector
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

### Step 1: Extract Audio from Video
def extract_audio(video_path):
    if not os.path.exists(video_path):
        print(f"❌ Error: Video file '{video_path}' not found.")
        return False

    if os.path.exists(AUDIO_PATH):
        os.remove(AUDIO_PATH)

    try:
        command = ["ffmpeg", "-y", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", AUDIO_PATH]
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

        if not os.path.exists(AUDIO_PATH):
            print("❌ Error: Audio extraction failed.")
            return False

        print(f"✅ Audio extracted successfully: {AUDIO_PATH}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ FFmpeg Error: {e}")
        return False

### Step 2: Transcribe Audio using Whisper
def transcribe_audio():
    if not os.path.exists(AUDIO_PATH):
        print(f"❌ Error: Audio file '{AUDIO_PATH}' not found.")
        return ""

    print("🔍 Transcribing audio using Whisper...")
    model = whisper.load_model("base")
    result = model.transcribe(AUDIO_PATH)
    transcription = result["text"]

    # Optionally still write to file for debugging, but we'll return it directly
    with open(TRANSCRIPTION_PATH, "w", encoding="utf-8") as file:
        file.write(transcription)

    print(f"✅ Transcription saved: {TRANSCRIPTION_PATH}")
    return transcription

### Step 3: AI Content Analysis
def analyze_content(transcription):
    if not transcription:
        print("❌ No transcription available for analysis.")
        return []

    print("🤖 Analyzing content using Hugging Face NLP model...")
    sentiment_pipeline = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
    analysis_result = sentiment_pipeline(transcription[:512])  # Limit to 512 characters
    print("✅ AI Analysis Result:", analysis_result)
    return analysis_result

### Step 4: Eye Tracking and Engagement Analysis
def get_eye_region(landmarks, eye_points):
    return np.array([(landmarks.part(p).x, landmarks.part(p).y) for p in eye_points], np.int32)

def get_pupil_position(landmarks, eye_points, frame_gray):
    eye_region = get_eye_region(landmarks, eye_points)
    min_x, max_x = np.min(eye_region[:, 0]), np.max(eye_region[:, 0])
    min_y, max_y = np.min(eye_region[:, 1]), np.max(eye_region[:, 1])

    eye_frame = frame_gray[min_y:max_y, min_x:max_x]
    _, threshold_eye = cv2.threshold(cv2.GaussianBlur(eye_frame, (5, 5), 0), 55, 255, cv2.THRESH_BINARY_INV)

    contours, _ = cv2.findContours(threshold_eye, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        (cx, cy), _ = cv2.minEnclosingCircle(largest_contour)
        return int(cx) + min_x, int(cy) + min_y
    return None, None

def analyze_engagement(video_path):
    cap = cv2.VideoCapture(video_path)
    total_frames, engaged_frames = 0, 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        total_frames += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        if len(faces) > 0:
            for face in faces:
                landmarks = predictor(gray, face)
                left_pupil_x, _ = get_pupil_position(landmarks, range(36, 42), gray)
                right_pupil_x, _ = get_pupil_position(landmarks, range(42, 48), gray)
                if left_pupil_x is not None and right_pupil_x is not None:
                    engaged_frames += 1

    cap.release()
    engagement_percentage = (engaged_frames / total_frames) * 100 if total_frames > 0 else 0
    return total_frames, engaged_frames, engagement_percentage

# HTTP Server Handler
class VideoHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/upload":
            content_type, _ = cgi.parse_header(self.headers['Content-Type'])
            if content_type == 'multipart/form-data':
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST'}
                )
                file_item = form['file']

                # Save uploaded video
                os.makedirs("temp", exist_ok=True)
                with open(VIDEO_PATH, 'wb') as f:
                    f.write(file_item.file.read())

                # Process video
                if extract_audio(VIDEO_PATH):
                    transcription = transcribe_audio()
                    ai_analysis = analyze_content(transcription)
                    total_frames, engaged_frames, engagement_percentage = analyze_engagement(VIDEO_PATH)
                else:
                    self.send_error(500, "Audio extraction failed")
                    return

                # Prepare JSON response including transcription
                response = {
                    "ai_analysis": ai_analysis,
                    "total_frames": total_frames,
                    "engaged_frames": engaged_frames,
                    "engagement_percentage": engagement_percentage,
                    "transcription": transcription  # Add transcription to response
                }

                # Send JSON response
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))

                # Clean up
                for path in [VIDEO_PATH, AUDIO_PATH, TRANSCRIPTION_PATH]:
                    if os.path.exists(path):
                        os.remove(path)
            else:
                self.send_error(400, "Bad Request: Expected multipart/form-data")
        else:
            self.send_error(404, "Not Found")

def run(server_class=HTTPServer, handler_class=VideoHandler, port=8081):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run()