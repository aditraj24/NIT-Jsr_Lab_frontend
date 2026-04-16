import { connectDB } from "@/lib/db";
import { Notice } from "@/models/notice";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        { error: "Notice ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await Notice.findById(id).lean();

    if (!item) {
      return Response.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }

    const data = {
      id: item._id.toString(),
      attributes: {
        Title: item.Title || "",
        Description: item.Description || "",
        Pdf: item.Pdf ? {
          data: {
            attributes: {
              url: item.Pdf
            }
          }
        } : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
      }
    };

    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching notice:", error);
    if (error.name === 'CastError') {
      return Response.json(
        { error: "Invalid notice ID format" },
        { status: 400 }
      );
    }
    return Response.json(
      { error: "Failed to fetch notice", details: error.message },
      { status: 500 }
    );
  }
}
