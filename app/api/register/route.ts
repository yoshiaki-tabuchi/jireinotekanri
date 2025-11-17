import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });

        return NextResponse.json({ message: "登録成功", user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
    }
}
