import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Send, Brain, Cpu, Zap, BarChart3, Network, Activity, CheckCircle } from 'lucide-react';
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
      color: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'border-orange-400/30',
      accentColor: 'text-orange-400',
      bgGlow: 'shadow-orange-500/20',
      icon: BarChart3,
      confidence: '94.7%'
    },
    {
      name: 'Steve Jobs',
      title: 'Apple Co-founder',
      avatar: 'SJ',
      color: 'from-slate-500/20 to-gray-500/20',
      borderColor: 'border-slate-400/30',
      accentColor: 'text-slate-400',
      bgGlow: 'shadow-slate-500/20',
      icon: Zap,
      confidence: '96.2%'
    },
    {
      name: 'Elon Musk',
      title: 'Tesla & SpaceX CEO',
      avatar: 'EM',
      color: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-400/30',
      accentColor: 'text-cyan-400',
      bgGlow: 'shadow-cyan-500/20',
      icon: Network,
      confidence: '92.8%'
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
      // Simulate AI processing
      setTimeout(() => {
        setIsLoading(false);
        setStep('advice');
      }, 3000);
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
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Header */}
      <header className="px-6 py-6 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-800/50"
            >
              <ArrowLeft className="w-5 h-5 text-blue-300" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-75"></div>
                <div className="relative p-2 bg-slate-900 border border-blue-500/30 rounded-lg">
                  <Brain className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  Innovation Board
                </h1>
                <div className="text-xs text-blue-300/50">Neural Advisory Session</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              variant={step === 'question' ? 'default' : 'secondary'} 
              className={`px-3 py-1 ${step === 'question' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              <Brain className="w-3 h-3 mr-1" />
              Query
            </Badge>
            <Badge 
              variant={step === 'probing' ? 'default' : 'secondary'} 
              className={`px-3 py-1 ${step === 'probing' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              <Cpu className="w-3 h-3 mr-1" />
              Analysis
            </Badge>
            <Badge 
              variant={step === 'advice' ? 'default' : 'secondary'} 
              className={`px-3 py-1 ${step === 'advice' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              <Network className="w-3 h-3 mr-1" />
              Synthesis
            </Badge>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Question Step */}
          {step === 'question' && (
            <Card className="p-10 border border-slate-800/50 shadow-2xl bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30"></div>
                    <div className="relative w-20 h-20 bg-slate-900 border border-blue-400/30 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="w-10 h-10 text-cyan-400" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3">
                    Initialize Neural Query
                  </h2>
                  <p className="text-blue-100/60 text-lg max-w-2xl mx-auto">
                    Share your strategic challenge. Our AI will analyze and connect you with the most relevant advisory insights.
                  </p>
                </div>
                
                <div className="space-y-8">
                  <div className="relative">
                    <Textarea
                      placeholder="e.g., I'm launching a new AI SaaS product but struggling with market positioning against established competitors. How should I approach differentiation?"
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      className="min-h-40 text-lg bg-slate-800/50 border-2 border-slate-700/50 focus:border-blue-500/50 rounded-xl text-white placeholder:text-slate-400 backdrop-blur-sm"
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                      {userQuestion.length}/500
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleQuestionSubmit}
                    disabled={!userQuestion.trim()}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="mr-3 w-5 h-5" />
                    Initiate Analysis
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Probing Questions Step */}
          {step === 'probing' && !isLoading && (
            <Card className="p-10 border border-slate-800/50 shadow-2xl bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
              
              <div className="relative z-10">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      Contextual Analysis
                    </h2>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="px-4 py-2 border-purple-400/30 text-purple-300">
                        {currentProbingIndex + 1} of {mockData.probingQuestions.length}
                      </Badge>
                      <div className="flex items-center space-x-2 text-sm text-blue-300/50">
                        <Activity className="w-3 h-3 animate-pulse" />
                        <span>Processing</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-blue-100/60 text-lg">
                    AI is gathering contextual data points to optimize advisory output
                  </p>
                </div>
                
                <div className="space-y-8">
                  <div className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                        <Cpu className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {mockData.probingQuestions[currentProbingIndex]}
                      </h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {mockData.probingOptions[currentProbingIndex]?.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleProbingAnswer(option)}
                          className="justify-start text-left p-6 h-auto bg-slate-800/30 border-slate-600/30 hover:bg-slate-700/50 hover:border-blue-400/50 text-blue-100 hover:text-white transition-all duration-300 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <span>{option}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="p-16 border border-slate-800/50 shadow-2xl bg-slate-900/50 backdrop-blur-sm text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-40 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-slate-900 border border-cyan-400/30 rounded-full flex items-center justify-center mx-auto">
                    <Activity className="w-12 h-12 text-cyan-400 animate-spin" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-4">
                  Neural Processing Active
                </h2>
                <p className="text-blue-100/60 text-lg mb-8">AI models are synthesizing insights from legendary innovators</p>
                
                <div className="flex justify-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-300/70">Pattern Recognition</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                    <span className="text-blue-300/70">Context Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                    <span className="text-blue-300/70">Insight Generation</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Advice Step */}
          {step === 'advice' && (
            <div className="space-y-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-400/20 rounded-full text-emerald-300 text-sm mb-6">
                  <CheckCircle className="w-4 h-4" />
                  <span>Analysis Complete</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-3">
                  Neural Advisory Output
                </h2>
                <p className="text-blue-100/60 text-lg">Personalized insights synthesized from legendary innovation patterns</p>
              </div>
              
              {innovators.map((innovator, index) => {
                const IconComponent = innovator.icon;
                return (
                  <Card key={index} className={`p-8 border border-slate-800/50 shadow-2xl ${innovator.bgGlow} bg-slate-900/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${innovator.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className={`w-20 h-20 bg-slate-800 ${innovator.borderColor} border-2 rounded-xl flex items-center justify-center mb-4`}>
                            <IconComponent className={`w-10 h-10 ${innovator.accentColor}`} />
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 uppercase tracking-wider">Confidence</div>
                            <div className={`text-lg font-mono font-bold ${innovator.accentColor}`}>{innovator.confidence}</div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-2xl font-bold text-white">{innovator.name}</h3>
                              <div className="flex items-center space-x-2 text-xs text-slate-400">
                                <div className={`w-2 h-2 ${innovator.accentColor.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                                <span>AI Model Active</span>
                              </div>
                            </div>
                            <p className={`${innovator.accentColor} font-medium text-lg`}>{innovator.title}</p>
                          </div>
                          
                          <div className={`p-6 rounded-xl bg-gradient-to-r ${innovator.color} border-l-4 ${innovator.borderColor} backdrop-blur-sm`}>
                            <p className="text-white leading-relaxed whitespace-pre-line text-lg">
                              {mockData.advice[index]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              <div className="text-center pt-12">
                <Button 
                  onClick={resetSession}
                  size="lg"
                  variant="outline"
                  className="px-12 py-6 text-lg font-semibold rounded-xl border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/50 text-white hover:text-cyan-300 transition-all duration-300"
                >
                  <Brain className="mr-3 w-5 h-5" />
                  Initialize New Session
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