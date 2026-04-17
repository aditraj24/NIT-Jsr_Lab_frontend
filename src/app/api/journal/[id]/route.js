import { connectDB } from "@/lib/db";
import { Achievement } from "@/models/journal";
import { Member } from "@/models/member";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    // Validate MongoDB ObjectId format
    if (!id || id.length !== 24) {
      return Response.json(
        { error: "Invalid journal ID" },
        { status: 400 }
      );
    }

    // Get single achievement and populate author
    const achievement = await Achievement.findById(id)
      .populate("author", "name email")
      .lean();

    if (!achievement) {
      return Response.json(
        { error: "Journal not found" },
        { status: 404 }
      );
    }

   
    const response = {
      id: achievement._id.toString(),
      attributes: {
        Title: achievement.Title,
        Description: achievement.Description,
        AchivmentParagraph: achievement.AchivmentParagraph || [],
        Thumbnail: achievement.Thumbnail,
        Link: achievement.Link,
        Date: achievement.Date,
        Pdf: achievement.Pdf ? achievement.Pdf.replace('/image/upload/', '/raw/upload/') : achievement.Pdf,
        createdAt: achievement.createdAt,
        updatedAt: achievement.updatedAt,
        publishedAt: achievement.publishedAt,
      },
    };

    // Include author if populated
    if (achievement.author) {
      response.attributes.author = {
        data: {
          id: achievement.author._id?.toString() || achievement.author,
          attributes: {
            name: achievement.author.name || "",
            email: achievement.author.email || "",
          },
        },
      };
    }

    return Response.json(
      {
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching journal:", error);
    return Response.json(
      { error: "Failed to fetch journal", details: error.message },
      { status: 500 }
    );
  }
}
