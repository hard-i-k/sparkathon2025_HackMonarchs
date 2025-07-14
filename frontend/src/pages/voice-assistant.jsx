import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { api } from "../services/api";
import { Mic, MicOff, Volume2, Sparkles, AlertCircle } from "lucide-react";

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [assistantReply, setAssistantReply] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // Text-to-Speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a more natural voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Alex') ||
        voice.gender === 'female'
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // Enhanced voice query processing
  const processVoiceQuery = async (transcript) => {
    try {
      // Call the enhanced backend API
      const response = await fetch('http://localhost:5000/api/voiceAssistant/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcript }),
      });

      if (response.ok) {
        const data = await response.json();
        setAssistantReply(data.reply);
        
        // Speak the response
        speakText(data.reply);
        
        // If products are returned, show them
        if (data.products && data.products.length > 0) {
          const formattedProducts = data.products.map(p => ({
            id: p.name.toLowerCase().replace(/\s+/g, '-'),
            name: p.name,
            price: p.price,
            carbonScore: p.carbon,
            image: `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300`,
            reason: "Eco-friendly and sustainable choice"
          }));
          setRecommendations(formattedProducts);
        } else {
          // Fallback to existing recommendation system
          const recs = await api.getRecommendations(transcript);
          setRecommendations(recs);
        }
      } else {
        throw new Error('Backend API error');
      }
    } catch (error) {
      console.error("Enhanced voice query failed, using fallback:", error);
      // Fallback to existing system
      const recs = await api.getRecommendations(transcript);
      setRecommendations(recs);
      setAssistantReply("I found some great eco-friendly recommendations for you!");
      speakText("I found some great eco-friendly recommendations for you!");
    }
  };

  // Simulate voice input for offline/demo mode
  const simulateVoiceInput = () => {
    setIsListening(true);
    setLoading(true);
    
    setTimeout(() => {
      const demoQueries = [
        "Show me eco-friendly phones",
        "Find sustainable laptops under $1000",
        "I need organic food products",
        "Recommend low carbon footprint electronics"
      ];
      
      const randomQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)];
      setTranscription(randomQuery);
      
      // Simulate getting recommendations
      api.getRecommendations(randomQuery).then(setRecommendations).catch(() => {
        setError("Demo mode: Unable to load real recommendations.");
      }).finally(() => {
        setIsListening(false);
        setLoading(false);
      });
    }, 2000);
  };

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Optimize settings for better recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;
      
      // Try to work offline if possible
      if ('serviceWorker' in navigator) {
        recognitionRef.current.serviceURI = '';
      }

      recognitionRef.current.onresult = async (event) => {
        // Get the final result (not interim)
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.trim();
          console.log("Final transcript:", transcript);
          setTranscription(transcript);
          setIsListening(false);
          setLoading(true);

          try {
            // Use enhanced voice processing
            await processVoiceQuery(transcript);
          } catch (error) {
            console.error("Error processing voice query:", error);
            setError("Failed to process your request. Please try again.");
          } finally {
            setLoading(false);
          }
        } else {
          // Show interim results
          const interimTranscript = lastResult[0].transcript;
          console.log("Interim transcript:", interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        let errorMessage = "";
        
        switch(event.error) {
          case 'network':
            errorMessage = "Voice recognition needs internet connection. Try the demo buttons below!";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone permissions or use demo mode.";
            break;
          case 'no-speech':
            errorMessage = "No speech detected. Please speak clearly or try demo mode.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone not working. Please check your microphone or use demo mode.";
            break;
          case 'service-not-allowed':
            errorMessage = "Voice recognition blocked. Try Chrome/Edge browser or use demo mode.";
            break;
          case 'aborted':
            // Don't show error for aborted, just reset
            setIsListening(false);
            setLoading(false);
            return;
          default:
            errorMessage = `Voice recognition error. No worries - try the demo buttons below!`;
        }
        
        setError(errorMessage);
        setIsListening(false);
        setLoading(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = async () => {
    if (!speechSupported) {
      setError("Speech recognition is not supported in your browser. Please use the demo buttons below!");
      return;
    }

    setError("");
    setIsListening(true);
    setLoading(false);

    try {
      // Simple start without complex restart logic
      recognitionRef.current.start();
    } catch (error) {
      console.error("Start recognition error:", error);
      setError("Voice recognition failed to start. Please use the demo buttons below!");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearResults = () => {
    setTranscription("");
    setRecommendations([]);
    setError("");
    setAssistantReply("");
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-bentonville-blue mb-4">Voice Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Use your voice to find eco-friendly products. Ask for recommendations, 
            search by category, or inquire about carbon footprints.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-sm text-blue-700">
              <strong>💡 Tips:</strong> Say "Show me eco-friendly phones", "Find laptops under $1000", or "I need organic food"
            </p>
          </div>
        </div>

        {!speechSupported && (
          <Card className="max-w-2xl mx-auto border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-orange-700 mb-3">
                Speech recognition is not supported in your browser. 
                Please use Chrome, Edge, or Safari for voice features.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setOfflineMode(true);
                }}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Use Demo Mode
              </Button>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 mb-3">{error}</p>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setError("");
                    // Force enable speech recognition
                    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                      startListening();
                    }
                  }}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setError("");
                    // Use one of the demo queries
                    const demoQuery = "Show me eco-friendly phones";
                    setTranscription(demoQuery);
                    setLoading(true);
                    api.getRecommendations(demoQuery).then(setRecommendations).finally(() => setLoading(false));
                  }}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  Try Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Button
                onClick={toggleListening}
                disabled={loading}
                className={`w-24 h-24 rounded-full ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-true-blue hover:bg-true-blue/90'
                }`}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold text-bentonville-blue">
                {isListening ? "Listening..." : "Click to speak"}
              </p>
              <p className="text-sm text-gray-500">
                {isListening 
                  ? "Speak now, I'm listening for your request" 
                  : "Ask me about eco-friendly products, pricing, or carbon scores"
                }
              </p>
            </div>

            {loading && (
              <div className="mt-4">
                <Badge variant="outline" className="animate-pulse">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Processing your request...
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {transcription && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                You said:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic text-gray-700 mb-4">"{transcription}"</p>
              
              {assistantReply && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 mb-1">Assistant:</p>
                      <p className="text-blue-700">{assistantReply}</p>
                      {isSpeaking && (
                        <p className="text-xs text-blue-600 mt-2 italic">🔊 Speaking...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearResults}
                >
                  Clear Results
                </Button>
                {assistantReply && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => speakText(assistantReply)}
                    disabled={isSpeaking}
                  >
                    {isSpeaking ? 'Speaking...' : '🔊 Repeat'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-bentonville-blue text-center">
              Recommended Products
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-bentonville-blue">{rec.name}</h3>
                      <p className="text-sm text-gray-600">{rec.reason}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-true-blue">
                          ${rec.price}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`${
                            rec.carbonScore <= 3 ? 'border-green-500 text-green-700' :
                            rec.carbonScore <= 6 ? 'border-yellow-500 text-yellow-700' :
                            'border-red-500 text-red-700'
                          }`}
                        >
                          Carbon: {rec.carbonScore}/10
                        </Badge>
                      </div>

                      <Button className="w-full bg-true-blue hover:bg-true-blue/90">
                        View Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Try asking:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => {
                    setTranscription("Show me eco-friendly phones");
                    api.getRecommendations("Show me eco-friendly phones").then(setRecommendations);
                  }}
                >
                  "Show me eco-friendly phones"
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => {
                    setTranscription("Find sustainable laptops under $1000");
                    api.getRecommendations("Find sustainable laptops under $1000").then(setRecommendations);
                  }}
                >
                  "Find sustainable laptops under $1000"
                </Button>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => {
                    setTranscription("I need organic food products");
                    api.getRecommendations("I need organic food products").then(setRecommendations);
                  }}
                >
                  "I need organic food products"
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => {
                    setTranscription("Recommend low carbon footprint electronics");
                    api.getRecommendations("Recommend low carbon footprint electronics").then(setRecommendations);
                  }}
                >
                  "Recommend low carbon footprint electronics"
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}