import { connectDB } from "@/lib/db";
import { ResearchSection } from "@/models/research-section";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    
    // Handle populate query parameter for thumbnail
    const url = new URL(req.url);
    const populate = url.searchParams.get("populate");
    
    let query = ResearchSection.find();
    
    // If populate[Thumbnail] is requested, we'll return the Thumbnail field as is
    const researchSections = await query
      .sort({ createdAt: -1 })
      .lean();
    
    // Format response to match Strapi-like structure expected by frontend
    const formattedData = researchSections.map((item) => ({
      id: item._id,
      attributes: {
        ResearchTitle: item.ResearchTitle || "",
        ResearchSubTitle: item.ResearchSubTitle || "",
        Description: item.Description || "",
        Thumbnail: item.Thumbnail ? {
          data: {
            attributes: {
              url: item.Thumbnail
            }
          }
        } : null,
        Themes: item.Themes || [],
        Members: item.Members || [],
        PapersPublished: item.PapersPublished || [],
        AimAndSummary: item.AimAndSummary || [],
        ReasearchContent: item.ReasearchContent || [],
        publishedAt: item.publishedAt || null
      }
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("Error fetching research sections:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const {
      ResearchTitle,
      ResearchSubTitle,
      Description,
      Thumbnail,
      Themes,
      Members,
      PapersPublished,
      AimAndSummary,
      ReasearchContent,
      publishedAt
    } = body;
    
    if (!ResearchTitle || !Description || !Thumbnail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: ResearchTitle, Description, Thumbnail" },
        { status: 400 }
      );
    }
    
    const researchSection = new ResearchSection({
      ResearchTitle,
      ResearchSubTitle,
      Description,
      Thumbnail,
      Themes: Themes || [],
      Members: Members || [],
      PapersPublished: PapersPublished || [],
      AimAndSummary: AimAndSummary || [],
      ReasearchContent: ReasearchContent || [],
      publishedAt: publishedAt || new Date()
    });
    
    await researchSection.save();
    
    return NextResponse.json(
      { success: true, data: researchSection },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating research section:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
