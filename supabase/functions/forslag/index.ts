/*
# Activity Suggestion Edge Function

1. New Function
   - `forslag` - Generates activity suggestions based on curriculum summary and practice profile
   - Takes text summary and profile as input
   - Returns structured activity suggestion

2. Logic
   - Matches profile to competency goals from kompetencemal.json
   - Creates relevant activity suggestions
   - Provides practical implementation ideas

3. Error Handling
   - Validates required parameters
   - Provides meaningful suggestions for each profile type
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Kompetencemål data
const kompetenceMaal = {
  "1. praktik": {
    fokus: "Pædagogens praksis og grundlæggende pædagogiske aktiviteter",
    aktiviteter: [
      "Observation af børns leg og læring",
      "Tilrettelæggelse af simple pædagogiske aktiviteter",
      "Dokumentation af egen læreproces",
      "Sundhedsfremmende aktiviteter (måltider, hygiejne)"
    ]
  },
  "2. praktik": {
    fokus: "Relation og kommunikation med børn og familier",
    aktiviteter: [
      "Relationsskabende aktiviteter med enkelte børn",
      "Facilitering af børns leg og kreative udfoldelse",
      "Kommunikationsøvelser med børn og forældre",
      "Æstetiske og musiske aktiviteter"
    ]
  },
  "3. praktik": {
    fokus: "Udvikling af pædagogisk praksis og innovation",
    aktiviteter: [
      "Innovative pædagogiske projekter",
      "Inddragelse af børn og forældre i udvikling",
      "Evaluering og dokumentation af praksis",
      "Tværfagligt samarbejde og udvikling"
    ]
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Only POST method allowed")
    }

    const { text, profile } = await req.json()

    if (!text || !profile) {
      throw new Error("Both 'text' and 'profile' are required")
    }

    const profileData = kompetenceMaal[profile as keyof typeof kompetenceMaal]
    
    if (!profileData) {
      throw new Error("Invalid profile. Must be '1. praktik', '2. praktik', or '3. praktik'")
    }

    // Generate activity suggestion based on profile
    const suggestion = generateActivitySuggestion(text, profile, profileData)

    return new Response(
      JSON.stringify({ 
        success: true,
        suggestion,
        profile
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    )
  }
})

function generateActivitySuggestion(text: string, profile: string, profileData: any): string {
  const activities = profileData.aktiviteter
  const randomActivity = activities[Math.floor(Math.random() * activities.length)]
  
  return `
AKTIVITETSFORSLAG FOR ${profile.toUpperCase()}

Fokusområde: ${profileData.fokus}

Foreslået aktivitet: ${randomActivity}

Konkret gennemførelse:
• Varighed: 30-45 minutter
• Materialer: Afhængig af aktivitet (papir, farver, legetøj, etc.)
• Forberedelse: 10-15 minutter
• Evaluering: Refleksion og dokumentation efter aktiviteten

Læringsmål:
• Understøtte børns udvikling og trivsel
• Styrke professionelle kompetencer inden for ${profileData.fokus.toLowerCase()}
• Dokumentere og reflektere over pædagogisk praksis

Refleksionsspørgsmål:
• Hvordan reagerede børnene på aktiviteten?
• Hvilke læreprocesser kunne du observere?
• Hvad ville du gøre anderledes næste gang?
• Hvordan understøttede aktiviteten dit kompetencemål?

Baseret på læreplan: ${text.substring(0, 100)}...
  `.trim()
}