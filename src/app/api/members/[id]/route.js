import { connectDB } from "@/lib/db";
import { Member } from "@/models/member";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const member = await Member.findById(id).lean();

    if (!member) {
      return Response.json({ error: "Member not found" }, { status: 404 });
    }

    const data = {
      id: member._id.toString(),
      attributes: {
        name: member.name,
        email: member.email,
        phone: member.phone,
        position: member.position,
        department: member.department,
        role: member.role,
        about: member.about,
        bio: member.bio,
        qualifications: member.qualifications,
        specialization: member.specialization,
        researchList: member.researchList || [],
        projectList: member.projectList || [],
        profilePhoto: {
          data: member.profilePhoto
            ? {
                attributes: { url: member.profilePhoto },
              }
            : null,
        },
        resume: member.resume
          ? {
              data: {
                attributes: { url: member.resume },
              },
            }
          : null,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        publishedAt: member.publishedAt,
      },
    };

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching member by id:", error);
    return Response.json(
      { error: "Failed to fetch member", details: error.message },
      { status: 500 }
    );
  }
}
