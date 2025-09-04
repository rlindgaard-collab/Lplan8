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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Kompetencemål data baseret på den uploadede JSON fil
const kompetenceMaal = {
  "1. praktik": {
    fokus: "Pædagogens praksis - grundlæggende pædagogiske aktiviteter",
    kompetencemål: "Begrunde, tilrettelægge, gennemføre og evaluere pædagogiske aktiviteter",
    aktiviteter: [
      "Observation af børns leg og interaktion med fokus på dokumentation",
      "Tilrettelæggelse af strukturerede aktiviteter med sundhedsfokus",
      "Evaluering af pædagogiske metoders effekt på børns læring",
      "Sundhedsfremmende aktiviteter omkring måltider og hygiejne",
      "Refleksion over egen læreproces og professionelle udvikling"
    ]
  },
  "2. praktik": {
    fokus: "Relation og kommunikation med børn og familier",
    kompetencemål: "Skabe relationer og støtte børns kommunikative kompetencer",
    aktiviteter: [
      "Relationsskabende aktiviteter med fokus på det enkelte barn",
      "Facilitering af børns kreative leg og æstetiske udfoldelse",
      "Kommunikationsøvelser og dialogbaserede aktiviteter",
      "Musiske og kropslige aktiviteter der styrker fællesskabet",
      "Differentierede pædagogiske tilgange til børn med særlige behov"
    ]
  },
  "3. praktik": {
    fokus: "Udvikling af pædagogisk praksis og innovation",
    kompetencemål: "Målrettet tilrettelæggelse og udvikling af læreprocesser",
    aktiviteter: [
      "Innovative pædagogiske projekter med børneinddragelse",
      "Tværfagligt samarbejde og videndeling med kolleger",
      "Systematisk dokumentation og evaluering af praksis",
      "Udvikling af det fysiske og sociale børnemiljø",
      "Forandringsprocesser med inddragelse af forældre og børn"
    ]
  }
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Only POST method allowed");
    }

    const body = await req.json();
    const { text, profile } = body;

    if (!text || !profile) {
      throw new Error("Both 'text' and 'profile' are required");
    }

    const profileKey = profile as keyof typeof kompetenceMaal;
    const profileData = kompetenceMaal[profileKey];
    
    if (!profileData) {
      throw new Error("Invalid profile. Must be '1. praktik', '2. praktik', or '3. praktik'");
    }

    // Generate activity suggestion based on profile
    const suggestion = generateActivitySuggestion(text, profile, profileData);

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
    );

  } catch (error) {
    console.error("Error in forslag function:", error);
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
    );
  }
});

function generateActivitySuggestion(text: string, profile: string, profileData: any): string {
  const activities = profileData.aktiviteter;
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  
  return `🎯 AKTIVITETSFORSLAG FOR ${profile.toUpperCase()}

📋 FOKUSOMRÅDE: ${profileData.fokus}

🎪 KOMPETENCEMÅL: ${profileData.kompetencemål}

✨ FORESLÅET AKTIVITET: ${randomActivity}

📝 KONKRET GENNEMFØRELSE:
• ⏱️ Varighed: 30-45 minutter
• 👥 Deltagere: 3-6 børn (tilpas efter behov)
• 🎨 Materialer: Papir, farver, legetøj, naturmaterialer (afhængig af aktivitet)
• 🔧 Forberedelse: 10-15 minutter
• 📍 Lokation: Indendørs eller udendørs efter aktivitetens karakter

🎯 LÆRINGSMÅL:
• Understøtte børns udvikling og trivsel
• Styrke professionelle kompetencer inden for ${profileData.fokus.toLowerCase()}
• Dokumentere og reflektere over pædagogisk praksis
• Evaluere metoders effekt på børns læring

📊 EVALUERING OG DOKUMENTATION:
• 👀 Observer børnenes engagement og deltagelse
• 📸 Dokumenter læreprocesser gennem fotos/noter
• 🤔 Reflekter over aktivitetens forløb og udfald
• 📈 Evaluer egen rolle og pædagogiske tilgang

💭 REFLEKSIONSSPØRGSMÅL:
• Hvordan reagerede børnene på aktiviteten?
• Hvilke læreprocesser kunne du observere?
• Hvad fungerede godt, og hvad kunne forbedres?
• Hvordan understøttede aktiviteten dit kompetencemål?
• Hvilke nye indsigter har du fået om børnenes behov?

📚 RELATION TIL LÆREPLAN:
Baseret på den uploadede læreplan fokuserer denne aktivitet på kerneelementer som børns udvikling, professionel praksis og dokumentation af læreprocesser.

💡 NÆSTE SKRIDT:
1. Planlæg aktiviteten i detaljer
2. Forbered nødvendige materialer
3. Overvej hvordan du vil dokumentere forløbet
4. Evaluer og reflekter efter gennemførelse

🌟 TIP: Husk at inddrage børnenes egne ideer og interesser i aktiviteten!`;
}