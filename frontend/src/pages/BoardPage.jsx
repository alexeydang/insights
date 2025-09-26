import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Send, MessageSquare, Lightbulb, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../utils/mock';

const BoardPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('question'); // 'question', 'probing', 'advice'
  const [userQuestion, setUserQuestion] = useState('');
  const [probingAnswers, setProbingAnswers] = useState({});
  const [currentProbingIndex, setCurrentProbingIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const innovators = [
    {
      name: 'Jeff Bezos',
      title: 'Amazon Founder',
      avatar: 'JB',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50'
    },
    {
      name: 'Steve Jobs',
      title: 'Apple Co-founder',
      avatar: 'SJ',
      color: 'from-gray-500 to-slate-600',
      bgColor: 'from-gray-50 to-slate-50'
    },
    {
      name: 'Elon Musk',
      title: 'Tesla & SpaceX CEO',
      avatar: 'EM',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50'
    }
  ];

  const handleQuestionSubmit = () => {
    if (!userQuestion.trim()) return;
    setStep('probing');
  };

  const handleProbingAnswer = (answer) => {
    const newAnswers = { ...probingAnswers, [currentProbingIndex]: answer };
    setProbingAnswers(newAnswers);
    
    if (currentProbingIndex < mockData.probingQuestions.length - 1) {
      setCurrentProbingIndex(currentProbingIndex + 1);
    } else {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
        setStep('advice');
      }, 2000);
    }
  };

  const resetSession = () => {
    setStep('question');
    setUserQuestion('');
    setProbingAnswers({});
    setCurrentProbingIndex(0);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Innovation Board</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={step === 'question' ? 'default' : 'secondary'} className="px-3 py-1">
              <MessageSquare className="w-3 h-3 mr-1" />
              Question
            </Badge>
            <Badge variant={step === 'probing' ? 'default' : 'secondary'} className="px-3 py-1">
              <Users className="w-3 h-3 mr-1" />
              Context
            </Badge>
            <Badge variant={step === 'advice' ? 'default' : 'secondary'} className="px-3 py-1">
              <Lightbulb className="w-3 h-3 mr-1" />
              Advice
            </Badge>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Question Step */}
          {step === 'question' && (
            <Card className="p-8 border-0 shadow-xl bg-white">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What's on Your Mind?</h2>
                <p className="text-gray-600 text-lg">
                  Share your challenge, opportunity, or question. Our advisory board is here to help.
                </p>
              </div>
              
              <div className="space-y-6">
                <Textarea
                  placeholder="e.g., I'm launching a new product but struggling with market positioning. How should I approach this?"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="min-h-32 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                />
                
                <Button 
                  onClick={handleQuestionSubmit}
                  disabled={!userQuestion.trim()}
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Continue
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </Card>
          )}

          {/* Probing Questions Step */}
          {step === 'probing' && !isLoading && (
            <Card className="p-8 border-0 shadow-xl bg-white">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Help Us Understand Better
                  </h2>
                  <Badge variant="outline" className="px-3 py-1">
                    {currentProbingIndex + 1} of {mockData.probingQuestions.length}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  A few quick questions to provide more targeted advice
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {mockData.probingQuestions[currentProbingIndex]}
                  </h3>
                  
                  <div className="grid gap-3">
                    {mockData.probingOptions[currentProbingIndex]?.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleProbingAnswer(option)}
                        className="justify-start text-left p-4 h-auto hover:bg-white hover:shadow-md transition-all duration-200"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="p-12 border-0 shadow-xl bg-white text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Consulting the Board...</h2>
              <p className="text-gray-600">Our innovators are crafting personalized advice for you</p>
            </Card>
          )}

          {/* Advice Step */}
          {step === 'advice' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Advisory Board Responds</h2>
                <p className="text-gray-600 text-lg">Personalized insights from three legendary minds</p>
              </div>
              
              {innovators.map((innovator, index) => (
                <Card key={index} className="p-8 border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${innovator.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-white font-bold text-lg">{innovator.avatar}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{innovator.name}</h3>
                        <p className="text-indigo-600 font-medium">{innovator.title}</p>
                      </div>
                      
                      <div className={`p-6 rounded-xl bg-gradient-to-r ${innovator.bgColor} border-l-4 border-l-gray-300`}>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                          {mockData.advice[index]}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="text-center pt-8">
                <Button 
                  onClick={resetSession}
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Ask Another Question
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;