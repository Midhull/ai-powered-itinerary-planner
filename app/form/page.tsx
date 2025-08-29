'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, Clock, Heart, Loader2, MapPin } from 'lucide-react';

interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  pace: string;
  interests: string[];
}

const budgetOptions = [
  { value: 'low', label: 'Budget-friendly (Under $100/day)', icon: '💰' },
  { value: 'medium', label: 'Moderate ($100-300/day)', icon: '💳' },
  { value: 'high', label: 'Luxury ($300+/day)', icon: '✨' },
];

const paceOptions = [
  { value: 'relaxed', label: 'Relaxed (2-3 activities/day)', icon: '🧘' },
  { value: 'balanced', label: 'Balanced (4-5 activities/day)', icon: '⚖️' },
  { value: 'fast', label: 'Fast-paced (6+ activities/day)', icon: '⚡' },
];

const interestOptions = [
  { value: 'food', label: 'Food & Cuisine', icon: '🍜' },
  { value: 'history', label: 'History & Culture', icon: '🏛️' },
  { value: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'outdoors', label: 'Nature & Outdoors', icon: '🌲' },
];

export default function FormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    pace: '',
    interests: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget || !formData.pace) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const itinerary = await response.json();
      
      // Store in sessionStorage for the itinerary page
      sessionStorage.setItem('travelItinerary', JSON.stringify({
        itinerary,
        formData
      }));
      
      router.push('/itinerary');
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Plan Your Trip</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
            {/* Destination */}
            <div className="mb-6">
              <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <MapPin className="h-5 w-5 mr-2 text-sky-600" />
                Where do you want to go? *
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="e.g., Tokyo, Japan or Paris, France"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <Calendar className="h-5 w-5 mr-2 text-sky-600" />
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <Calendar className="h-5 w-5 mr-2 text-sky-600" />
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Budget */}
            <div className="mb-6">
              <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <DollarSign className="h-5 w-5 mr-2 text-sky-600" />
                Budget Level *
              </label>
              <div className="grid gap-3">
                {budgetOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-sky-50 ${
                      formData.budget === option.value
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value={option.value}
                      checked={formData.budget === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{option.icon}</span>
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pace */}
            <div className="mb-6">
              <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <Clock className="h-5 w-5 mr-2 text-sky-600" />
                Travel Pace *
              </label>
              <div className="grid gap-3">
                {paceOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-sky-50 ${
                      formData.pace === option.value
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pace"
                      value={option.value}
                      checked={formData.pace === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, pace: e.target.value }))}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{option.icon}</span>
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-8">
              <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <Heart className="h-5 w-5 mr-2 text-sky-600" />
                What interests you? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-sky-50 ${
                      formData.interests.includes(option.value)
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.interests.includes(option.value)}
                      onChange={() => handleInterestToggle(option.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-2">{option.icon}</span>
                    <span className="text-sm font-medium text-gray-900 text-center">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Generating Your Itinerary...
                </span>
              ) : (
                'Generate My Itinerary'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}