import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export async function GET(req: Request) {
    const token = req.headers.get("cookie")?.split("token=")[1];
    if (!token) return NextResponse.json({ error: "未認証" }, { status: 401 });

    try {
        const decoded = jwt.verify(token, SECRET);
        return NextResponse.json({ user: decoded });
    } catch {
        return NextResponse.json({ error: "トークンが無効" }, { status: 401 });
    }
}
