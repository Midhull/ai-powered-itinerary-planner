'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, RefreshCw, MapPin, AlertTriangle } from 'lucide-react';

interface Activity {
  time: string;
  title: string;
  description: string;
}

interface Day {
  date: string;
  activities: Activity[];
}

interface Itinerary {
  days: Day[];
}

interface StoredData {
  itinerary: Itinerary;
  formData: {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    pace: string;
    interests: string[];
  };
}

export default function ItineraryPage() {
  const [data, setData] = useState<StoredData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('travelItinerary');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
      } catch (err) {
        setError('Invalid itinerary data');
      }
    } else {
      setError('No itinerary found');
    }
    setIsLoading(false);
  }, []);

  const regenerateItinerary = async () => {
    if (!data?.formData) return;
    
    setIsRegenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.formData),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate itinerary');
      }

      const newItinerary = await response.json();
      const newData = { ...data, itinerary: newItinerary };
      setData(newData);
      sessionStorage.setItem('travelItinerary', JSON.stringify(newData));
    } catch (err) {
      setError('Failed to regenerate itinerary. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="flex items-center mb-8">
            <Link href="/form" className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Your Itinerary</h1>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/form">
              <button className="px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-indigo-700 transition-all duration-300">
                Try Again
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/form" className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Itinerary</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{data.formData.destination}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={regenerateItinerary}
            disabled={isRegenerating}
            className="flex items-center px-4 py-2 bg-white/70 text-gray-700 border border-gray-200 rounded-xl hover:bg-white transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>

        {/* Trip Overview */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.ceil((new Date(data.formData.endDate).getTime() - new Date(data.formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{data.formData.budget}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pace</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{data.formData.pace}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interests</p>
              <p className="text-lg font-semibold text-gray-900">{data.formData.interests.length} selected</p>
            </div>
          </div>
        </div>

        {/* Itinerary Days */}
        <div className="space-y-6">
          {data.itinerary.days?.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-3 rounded-full mr-4">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Day {dayIndex + 1}</h2>
                  <p className="text-gray-600">{formatDate(day.date)}</p>
                </div>
              </div>

              <div className="space-y-4">
                {day.activities?.map((activity, activityIndex) => (
                  <div key={activityIndex} className="flex items-start p-4 bg-white/50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-center w-16 h-16 bg-sky-100 text-sky-600 rounded-lg mr-4 flex-shrink-0">
                      <Clock className="h-5 w-5" />
                      <span className="sr-only">{activity.time}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        <span className="text-sm font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <Link href="/form">
            <button className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Plan Another Trip
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}