import { connectDB } from "@/lib/db";
import { Achievement } from "@/models/journal";
import { Member } from "@/models/member";
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.Title || !body.Description) {
      return Response.json(
        {
          error: "Missing required fields: Title, Description",
        },
        { status: 400 }
      );
    }

    // Create new achievement
    const achievement = await Achievement.create({
      Title: body.Title,
      Description: body.Description,
      AchivmentParagraph: body.AchivmentParagraph || [],
      Thumbnail: body.Thumbnail || "",
      Link: body.Link || "",
      Date: body.Date || new Date(),
      Pdf: body.Pdf || "",
      author: body.author || null,
      publishedAt: body.publishedAt || new Date(),
    });

    // Populate author if it exists
    if (body.author) {
      await achievement.populate("author", "name email");
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
        Pdf: achievement.Pdf,
        createdAt: achievement.createdAt,
        updatedAt: achievement.updatedAt,
        publishedAt: achievement.publishedAt,
      },
    };

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
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating achievement:", error);
    return Response.json(
      { error: "Failed to create achievement", details: error.message },
      { status: 500 }
    );
  }
}



export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const populate = url.searchParams.get("populate");

    // Get all published achievements, sorted by date descending
    let query = Achievement.find({
      publishedAt: { $exists: true, $ne: null },
    }).sort({ Date: -1 });

    // Populate author if requested
    if (populate === "author") {
      query = query.populate("author", "name email");
    }

    const achievements = await query.lean();

    // Transform to Strapi-like response format
    const data = achievements.map((achievement) => {
      const obj = {
        id: achievement._id.toString(),
        attributes: {
          Title: achievement.Title,
          Description: achievement.Description,
          AchivmentParagraph: achievement.AchivmentParagraph || [],
          Thumbnail: achievement.Thumbnail,
          Link: achievement.Link,
          Date: achievement.Date,
          Pdf: achievement.Pdf,
          createdAt: achievement.createdAt,
          updatedAt: achievement.updatedAt,
          publishedAt: achievement.publishedAt,
        },
      };

      // Include author if populated
      if (achievement.author) {
        obj.attributes.author = {
          data: {
            id: achievement.author._id?.toString() || achievement.author,
            attributes: {
              name: achievement.author.name || "",
              email: achievement.author.email || "",
            },
          },
        };
      }

      return obj;
    });

    return Response.json(
      {
        data,
        meta: {
          pagination: {
            start: 0,
            limit: data.length,
            total: data.length,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return Response.json(
      { error: "Failed to fetch achievements", details: error.message },
      { status: 500 }
    );
  }
}
