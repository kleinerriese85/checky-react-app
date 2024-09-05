import React, { useState } from 'react';
import { Mic, ArrowLeft, Settings } from 'lucide-react';

// API und Sprachausgabefunktionen hier
const API_KEY = "app-brf1CEkSLwAxtTsgKqBtNR4U";
const BASE_URL = "http://dify-u21003.vm.elestio.app/v1";

const askDify = async (question) => {
  try {
    const response = await fetch(`${BASE_URL}/your-endpoint`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: question
      })
    });
    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Fehler beim Abrufen der Antwort:", error);
    return "Entschuldigung, ich habe das nicht verstanden.";
  }
};

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE'; // Deutsch als Sprache
  speechSynthesis.speak(utterance);
};

// Web Speech API zur Spracherkennung
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.lang = 'de-DE'; // Setze die Sprache auf Deutsch
recognition.interimResults = false; // Nur endgültige Ergebnisse verwenden
recognition.maxAlternatives = 1;

const CheckyInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMicClick = () => {
    setIsListening(true);
    recognition.start(); // Starte die Spracherkennung

    recognition.onresult = async (event) => {
      const speechResult = event.results[0][0].transcript; // Erkanntes Wort/Satz
      setIsListening(false);
      setIsProcessing(true);
      
      // API-Anfrage an Dify
      const answer = await askDify(speechResult); 
      speak(answer); // Antwort aussprechen
      setIsProcessing(false);
    };

    recognition.onerror = (event) => {
      console.error("Spracherkennung Fehler: ", event.error);
      setIsListening(false);
      setIsProcessing(false);
    };
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-200 to-purple-200 p-4">
      <div className="flex justify-between mb-4">
        <ArrowLeft className="text-blue-600" size={24} />
        <h1 className="text-blue-600 text-2xl font-bold">Checky</h1>
        <Settings className="text-blue-600" size={24} />
      </div>
      
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="bg-white bg-opacity-70 rounded-lg p-4 my-8 max-w-xs text-center">
          <p className="text-xl font-semibold text-blue-600">
            {isListening ? "Ich höre..." : isProcessing ? "Ich denke nach..." : "Was möchtest du wissen?"}
          </p>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <button 
          onClick={handleMicClick}
          className={`bg-gradient-to-r from-pink-400 to-yellow-400 hover:from-pink-500 hover:to-yellow-500 text-white rounded-full p-6 shadow-lg transform hover:scale-105 transition-all duration-200 ${isListening ? 'animate-pulse' : ''}`}
        >
          <Mic size={48} />
        </button>
      </div>
    </div>
  );
};

export default CheckyInterface;
