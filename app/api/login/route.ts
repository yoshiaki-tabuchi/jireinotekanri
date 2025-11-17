import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "ユーザーが存在しません" }, { status: 404 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "パスワードが違います" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET,
            { expiresIn: "1h" }
        );

        const res = NextResponse.json({ message: "ログイン成功" });
        res.cookies.set("token", token, { httpOnly: true, path: "/" });

        return res;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
    }
}
