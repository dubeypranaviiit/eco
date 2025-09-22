
import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConfig";
import { Report } from "@/database/models/reportSchema";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
  console.log(id);
    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
