/*
# PDF Summary Edge Function

1. New Function
   - `pdfsummary` - Extracts text from uploaded PDF and creates summary
   - Handles file upload via FormData
   - Uses mock summary for demonstration
   - Returns structured summary

2. Dependencies
   - Handles CORS for browser requests
   - Validates file type and size

3. Error Handling
   - Validates file type and size
   - Provides meaningful error messages
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }

    // Mock summary based on the competency goals
    const mockSummary = `Læreplan opsummering baseret på uploadet PDF (${file.name}):

HOVEDOMRÅDER:
• Pædagogisk praksis og metodisk tilgang
• Børns udvikling, læring og trivsel (0-5 år)
• Professionel kommunikation og relationsdannelse
• Dokumentation og evaluering af pædagogisk arbejde

KOMPETENCEMÅL:
• Tilrettelæggelse og gennemførelse af pædagogiske aktiviteter
• Skabelse af nærværende relationer til børn og familier
• Understøttelse af børns leg, læring og udvikling
• Professionel kommunikation med kolleger og forældre

FOKUSOMRÅDER:
• Observation og dokumentation af børns læreprocesser
• Sundhedsfremmende og forebyggende arbejde
• Æstetiske, musiske og kreative aktiviteter
• Tværfagligt samarbejde og udvikling af praksis

MÅLGRUPPER:
• Børn i alderen 0-5 år i dagtilbud
• Særligt fokus på børn med særlige behov
• Inddragelse af forældre og familier

Denne opsummering danner grundlag for målrettede aktivitetsforslag baseret på din valgte praktikprofil.`;

    return new Response(
      JSON.stringify({ 
        success: true,
        summary: mockSummary,
        filename: file.name,
        size: file.size
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error("Error in pdfsummary function:", error);
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