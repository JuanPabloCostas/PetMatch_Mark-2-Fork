import { NextRequest, NextResponse} from "next/server";
import db from "@/libs/db"

export async function GET(request: NextRequest, { params } : { params : { name : string } }) {
    const name = params.name;
    console.log(name);

    try {
        const users = await db.user.findFirst({
            where: {
                name: String(name),
                isAdmin: true,
            },
            select : { isAdmin : true}
        });

        return NextResponse.json(users);
        // Hacer algo con los usuarios encontrados
    } catch (error) {
        return NextResponse.json({
            message: "User not found",
        }, {
            status: 404,
        });
    }
}