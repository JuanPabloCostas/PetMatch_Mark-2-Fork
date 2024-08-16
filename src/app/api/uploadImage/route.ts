import { ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import NameGenerator from "../../../utils/nameGenerator";

const Bucket = process.env.S3_BUCKET_NAME;
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
    region: process.env.S3_REGION as string, // Asegúrate de tener la región configurada.
});

export async function GET() {
    try {
        const response = await s3.send(new ListObjectsCommand({ Bucket }));
        return NextResponse.json(response?.Contents ?? [], { status: 200 });
    } catch (error) {
        console.error("Error fetching objects from S3:", error);
        return NextResponse.json({ code: 500, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("image") as File;

        if (!file || file.size === 0) {
            return NextResponse.json({ code: 400, message: "No file provided" }, { status: 400 });
        }

        const Key = NameGenerator();
        const Body = (await file.arrayBuffer()) as Buffer;

        const uploadResponse = await s3.send(
            new PutObjectCommand({
                Bucket,
                Key,
                Body,
                ACL: "public-read",
                ContentType: file.type,
            })
        );

        console.log("Upload response:", uploadResponse);

        return NextResponse.json({ url: `https://${Bucket}.s3.amazonaws.com/${Key}` }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        return NextResponse.json({ code: 500, message: "Failed to upload image" }, { status: 500 });
    }
}
