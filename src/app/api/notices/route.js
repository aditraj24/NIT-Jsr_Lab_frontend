import { connectDB } from "@/lib/db";
import { Notice } from "@/models/notice";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    
    const notices = await Notice.find()
      .sort({ publishedAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: notices
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
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
    const { Title, Description, Pdf, publishedAt } = body;
    
    if (!Title || !Description || !Pdf) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: Title, Description, Pdf" },
        { status: 400 }
      );
    }
    
    const notice = new Notice({
      Title,
      Description,
      Pdf,
      publishedAt: publishedAt || new Date()
    });
    
    await notice.save();
    
    return NextResponse.json(
      { success: true, data: notice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
