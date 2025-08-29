import Link from 'next/link';
import { Plane, MapPin, Calendar, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-sky-600" />
            <span className="text-2xl font-bold text-gray-900">VoyageAI</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full blur opacity-75"></div>
              <div className="relative bg-white p-3 rounded-full">
                <Sparkles className="h-12 w-12 text-sky-600" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI Travel
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent"> Planner</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            Create personalized travel itineraries in seconds. Just tell us your destination, 
            dates, and preferences—our AI will craft the perfect trip for you.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/90 transition-all duration-300">
              <MapPin className="h-8 w-8 text-sky-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Destinations</h3>
              <p className="text-gray-600">AI-powered recommendations based on your interests and budget</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/90 transition-all duration-300">
              <Calendar className="h-8 w-8 text-sky-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect Timing</h3>
              <p className="text-gray-600">Optimized schedules that match your preferred travel pace</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/90 transition-all duration-300">
              <Sparkles className="h-8 w-8 text-sky-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Planning</h3>
              <p className="text-gray-600">Generate complete itineraries in under 30 seconds</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/form">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-lg font-semibold rounded-full hover:from-sky-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <span className="flex items-center space-x-2">
                <span>Plan Your Trip</span>
                <Plane className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center">
        <p className="text-gray-500">Powered by AI • Built for travelers</p>
      </footer>
    </div>
  );
}