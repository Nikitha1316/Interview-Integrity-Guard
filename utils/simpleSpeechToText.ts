const startSimpleSpeechToText = (onTranscriptUpdate: (text: string) => void) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      console.error("❌ Web Speech API is not supported in this browser.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Show partial results
    recognition.lang = "en-US"; // Set language
  
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      onTranscriptUpdate(transcript.trim()); // Update transcript
    };
  
    recognition.onerror = (event: any) => {
      console.error("❌ Speech Recognition Error:", event.error);
    };
  
    recognition.onend = () => {
      console.log("⏸️ Speech recognition stopped. Restarting...");
      recognition.start(); // Auto-restart (optional)
    };
  
    recognition.start();
    console.log("🎤 Simple Speech-to-Text started...");
  };
  
  // ✅ Fix: Add default export
  export default startSimpleSpeechToText;
  