import { connectDB } from "@/lib/db";
import { ResearchSection } from "@/models/research-section";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        { error: "Research section ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await ResearchSection.findById(id).lean();

    if (!item) {
      return Response.json(
        { error: "Research section not found" },
        { status: 404 }
      );
    }

    // Format response to match Strapi-like structure expected by frontend
    const data = {
      id: item._id.toString(),
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
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
      }
    };

    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching research section:", error);
    // If the ID is an invalid MongoDB ObjectId, it throws a CastError
    if (error.name === 'CastError') {
      return Response.json(
        { error: "Invalid research section ID format" },
        { status: 400 }
      );
    }
    return Response.json(
      { error: "Failed to fetch research section", details: error.message },
      { status: 500 }
    );
  }
}
