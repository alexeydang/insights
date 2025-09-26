import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowRight, Brain, Cpu, Zap, BarChart3, Network, Sparkles } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const innovators = [
    {
      name: 'Jeff Bezos',
      title: 'Amazon Founder',
      expertise: 'Customer obsession, long-term thinking, operational excellence',
      metrics: '1.7M+ decisions analyzed',
      color: 'from-orange-400/20 to-amber-400/20',
      borderColor: 'border-orange-400/30',
      icon: BarChart3
    },
    {
      name: 'Steve Jobs',
      title: 'Apple Co-founder', 
      expertise: 'Design thinking, product perfectionism, user experience',
      metrics: '500K+ design patterns',
      color: 'from-slate-400/20 to-gray-400/20',
      borderColor: 'border-slate-400/30',
      icon: Sparkles
    },
    {
      name: 'Elon Musk',
      title: 'Tesla & SpaceX CEO',
      expertise: 'First principles thinking, ambitious goals, innovation at scale',
      metrics: '2.3M+ innovation vectors',
      color: 'from-cyan-400/20 to-blue-400/20', 
      borderColor: 'border-cyan-400/30',
      icon: Zap
    }
  ];

  const dataPoints = [
    { label: 'Neural Networks', value: '12.4M' },
    { label: 'Decision Trees', value: '847K' },
    { label: 'Pattern Recognition', value: '3.2M' },
    { label: 'Predictive Models', value: '156K' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
      <div className="absolute bottom-32 left-32 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      {/* Header */}
      <header className="relative px-6 py-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-75"></div>
              <div className="relative p-3 bg-slate-900 border border-blue-500/30 rounded-xl">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                Innovation Board
              </h1>
              <div className="flex items-center space-x-2 text-sm text-blue-300/70">
                <Cpu className="w-3 h-3" />
                <span>AI-Powered Advisory System</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm mb-6">
              <Network className="w-4 h-4" />
              <span>Neural Advisory Network Active</span>
            </div>
            
            <h2 className="text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Seek Wisdom from
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Legendary Minds
              </span>
            </h2>
            
            <p className="text-xl text-blue-100/70 mb-12 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered advisory system analyzes millions of decision patterns, strategic frameworks, 
              and innovation methodologies to deliver personalized insights from history's greatest minds.
            </p>
          </div>
          
          {/* Data metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            {dataPoints.map((point, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                  {point.value}
                </div>
                <div className="text-sm text-blue-300/60">{point.label}</div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => navigate('/board')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 border border-blue-400/30"
          >
            Initialize Advisory Session
            <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="px-6 py-20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-300 text-sm mb-6">
              <Brain className="w-4 h-4" />
              <span>Advisory Neural Network</span>
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
              Meet Your AI Advisory Board
            </h3>
            <p className="text-blue-100/60 text-lg">Each persona powered by advanced machine learning models and behavioral analysis</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {innovators.map((innovator, index) => {
              const IconComponent = innovator.icon;
              return (
                <Card key={index} className="relative p-8 bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/80 transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm overflow-hidden group">
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${innovator.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 bg-slate-800 ${innovator.borderColor} border rounded-xl`}>
                        <IconComponent className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-blue-300/50 uppercase tracking-wider">Neural Score</div>
                        <div className="text-lg font-mono font-bold text-cyan-400">{innovator.metrics}</div>
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-2">{innovator.name}</h4>
                    <p className="text-blue-300 font-medium mb-4">{innovator.title}</p>
                    <p className="text-blue-100/70 leading-relaxed mb-6">{innovator.expertise}</p>
                    
                    {/* AI Processing indicator */}
                    <div className="flex items-center space-x-2 text-xs text-blue-300/50">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span>AI Model Active</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works - Tech Focused */}
      <section className="px-6 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
              Advanced AI Processing Pipeline
            </h3>
            <p className="text-blue-100/60 text-lg">Powered by neural networks and behavioral pattern recognition</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-30"></div>
                <div className="relative w-20 h-20 bg-slate-900 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">1. Neural Analysis</h4>
              <p className="text-blue-100/70 leading-relaxed">Advanced NLP processes your query through contextual understanding algorithms</p>
            </div>
            
            <div className="text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                <div className="relative w-20 h-20 bg-slate-900 border border-blue-400/30 rounded-full flex items-center justify-center mx-auto">
                  <Network className="w-10 h-10 text-blue-400" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">2. Pattern Matching</h4>
              <p className="text-blue-100/70 leading-relaxed">Machine learning models identify optimal response patterns from millions of data points</p>
            </div>
            
            <div className="text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-30"></div>
                <div className="relative w-20 h-20 bg-slate-900 border border-purple-400/30 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-10 h-10 text-purple-400" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">3. Insight Generation</h4>
              <p className="text-blue-100/70 leading-relaxed">AI synthesizes personalized advice using behavioral models of legendary innovators</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-slate-900 border border-blue-500/30 rounded-lg">
                <Brain className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-semibold">Innovation Board</div>
                <div className="text-blue-300/50 text-sm">AI-Powered Strategic Advisory</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-blue-300/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
              <div>v2.1.0</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;