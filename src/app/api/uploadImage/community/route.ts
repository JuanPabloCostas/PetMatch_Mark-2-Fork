import { formatImage, uploadImage } from "@/utils/fileHandlers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ code: 400, message: "No file provided" }, { status: 400 });
    }

    const Body = (await file.arrayBuffer()) as Buffer;


    const resizedImage = await formatImage(Body);

    if (!resizedImage) {
      ("Error resizing image");
      return NextResponse.json({ code: 500, message: "Failed to resize image" }, { status: 500 });
    }
    
    const uploadedImage = await uploadImage(resizedImage);

    if (!uploadedImage) {
      ("Error uploading image");
      return NextResponse.json({ code: 500, message: "Failed to upload image" }, { status: 500 });
    }

    return NextResponse.json({ url: uploadedImage }, { status: 200 });
    
  } catch (error) {
    (error);
    return NextResponse.json({ code: 500, message: "ERROR" });
  }
}