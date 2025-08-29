# VoyageAI - AI-Powered Travel Itinerary Planner

A beautiful, modern travel planning application that uses AI to generate personalized itineraries.

## Features

- **Landing Page**: Attractive hero section with call-to-action
- **Travel Form**: Comprehensive form to capture travel preferences
- **AI Generation**: Powered by Google's Gemini AI for intelligent itinerary creation
- **Beautiful Display**: Day-by-day itinerary with timeline layout
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Error Handling**: Robust error handling and loading states

## Setup

1. **Get your Gemini API key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a free API key
   - Add it to your `.env.local` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## How It Works

1. **Landing Page** (`/`): Beautiful introduction to VoyageAI
2. **Form Page** (`/form`): Collect travel details including:
   - Destination
   - Travel dates
   - Budget level (low/medium/high)
   - Travel pace (relaxed/balanced/fast)
   - Interests (food, history, nightlife, etc.)
3. **AI Processing**: Form data is sent to Gemini AI via `/api/generate-itinerary`
4. **Results Page** (`/itinerary`): Display the generated day-by-day itinerary

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **Type Safety**: TypeScript

## API Integration

The app integrates with Google's Gemini API to generate travel itineraries. The AI is prompted to return structured JSON with days and activities, ensuring consistent formatting for the frontend display.

Example Gemini prompt structure:
```
You are a professional travel planner. Create a detailed X-day itinerary for [destination].
[Include budget, pace, and interest considerations]
Return ONLY valid JSON in the specified format.
```

## Error Handling

- Form validation for required fields and date logic
- API error handling for Gemini service issues
- JSON parsing validation for AI responses
- User-friendly error messages with retry options
- Loading states throughout the application

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Optimized layouts for all screen sizes
- Touch-friendly interface elements
- Performance optimized for all devices