import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowRight, Lightbulb, Users, MessageSquare } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const innovators = [
    {
      name: 'Jeff Bezos',
      title: 'Founder of Amazon',
      expertise: 'Customer obsession, long-term thinking, operational excellence',
      color: 'from-orange-100 to-amber-50'
    },
    {
      name: 'Steve Jobs',
      title: 'Co-founder of Apple',
      expertise: 'Design thinking, product perfectionism, user experience',
      color: 'from-gray-100 to-slate-50'
    },
    {
      name: 'Elon Musk',
      title: 'CEO of Tesla & SpaceX',
      expertise: 'First principles thinking, ambitious goals, innovation at scale',
      color: 'from-blue-100 to-cyan-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <header className="relative px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Innovation Board
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl">
            Get personalized advice from history's greatest innovators
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Seek Wisdom from
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Legendary Minds
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Whether you're facing a business challenge, seeking innovation insights, or need leadership guidance, 
            our virtual board of advisors is here to help with thought-provoking perspectives.
          </p>
          
          <Button 
            onClick={() => navigate('/board')}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Session
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Innovators Grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Your Advisory Board</h3>
            <p className="text-gray-600 text-lg">Each brings unique perspectives and proven methodologies</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {innovators.map((innovator, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${innovator.color} opacity-50`}></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Users className="w-8 h-8 text-gray-700" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{innovator.name}</h4>
                  <p className="text-indigo-600 font-semibold mb-4">{innovator.title}</p>
                  <p className="text-gray-600 leading-relaxed">{innovator.expertise}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-16 bg-gradient-to-r from-gray-50 to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-600 text-lg">Simple steps to unlock powerful insights</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">1. Ask Your Question</h4>
              <p className="text-gray-600">Share your challenge, opportunity, or area where you need guidance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">2. Get Probing Questions</h4>
              <p className="text-gray-600">We'll ask follow-up questions to better understand your context</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">3. Receive Insights</h4>
              <p className="text-gray-600">Get personalized advice from all three innovation legends</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            Innovation Board - Connecting you with the wisdom of legendary entrepreneurs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;