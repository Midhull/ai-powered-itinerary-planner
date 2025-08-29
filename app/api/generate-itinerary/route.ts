import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  pace: string;
  interests: string[];
}

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

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();
    
    // Validate required fields
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget || !formData.pace) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate number of days
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayCount <= 0) {
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
    }

    // Generate dates array
    const dates = [];
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Create prompt for Gemini
    const prompt = `You are a professional travel planner. Create a detailed ${dayCount}-day itinerary for ${formData.destination}.

Trip Details:
- Destination: ${formData.destination}
- Dates: ${formData.startDate} to ${formData.endDate} (${dayCount} days)
- Budget: ${formData.budget}
- Pace: ${formData.pace}
- Interests: ${formData.interests.join(', ')}

Create activities appropriate for the budget level:
- Low budget: Free/cheap activities, local food, public transport
- Medium budget: Mix of paid attractions, good restaurants, some tours
- High budget: Premium experiences, fine dining, private tours

Activity count per day based on pace:
- Relaxed: 2-3 activities per day
- Balanced: 4-5 activities per day  
- Fast: 6+ activities per day

CRITICAL: You MUST respond with ONLY valid JSON in this exact format (no other text):
{
  "days": [
    {
      "date": "${dates[0]}",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity Name",
          "description": "Detailed description of the activity"
        }
      ]
    }
  ]
}

Include realistic times (use 24-hour format like "09:00", "14:30"). Make sure each day has activities from morning to evening. Include specific locations, restaurants, and attractions in ${formData.destination}.`;

    // Call Gemini API
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY || 'demo-key', // Will need to be set by user
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!geminiResponse.ok) {
      let errorDetails = '';
      try {
        errorDetails = await geminiResponse.text();
      } catch (e) {
        errorDetails = 'Could not read error details.';
      }
      console.error('Gemini API error:', geminiResponse.status, geminiResponse.statusText, errorDetails);
      return NextResponse.json({ error: 'AI service unavailable', status: geminiResponse.status, details: errorDetails }, { status: 503 });
    }

    const geminiData = await geminiResponse.json();
    const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      console.error('No response from AI. Gemini raw response:', geminiData);
      return NextResponse.json({ error: 'No response from AI', details: geminiData }, { status: 500 });
    }

    // Parse JSON response
    let itinerary: Itinerary;
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanedText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      itinerary = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('AI response text:', aiText);
      return NextResponse.json({ error: 'Invalid AI response format', details: aiText, parseError: String(parseError) }, { status: 500 });
    }

    // Validate the itinerary structure
    if (!itinerary.days || !Array.isArray(itinerary.days)) {
      console.error('Invalid itinerary structure:', itinerary);
      return NextResponse.json({ error: 'Invalid itinerary structure', details: itinerary }, { status: 500 });
    }

  return NextResponse.json(itinerary);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}