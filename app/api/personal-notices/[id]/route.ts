import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: any) {
    try {
        // context.params は Promise の可能性があるので await
        const params = await context.params;
        console.log("Unwrapped params:", params);

        const id = Number(params.id);
        console.log("Parsed id:", id);

        if (isNaN(id)) {
            console.error("Invalid ID detected:", params.id);
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const notice = await prisma.personalNotice.findUnique({
            where: { id },
        });
        console.log("DB result:", notice);

        if (!notice) {
            console.warn("Notice not found for ID:", id);
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(notice);
    } catch (err) {
        console.error("Caught exception in GET /personal-notices/[id]:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest, context: any) {
    console.log("---- PATCH /personal-notices/[id] called ----");

    try {
        // context.params を解凍
        const params = await context.params;
        console.log("Unwrapped params:", params);

        const id = Number(params.id);
        console.log("Parsed id:", id);

        if (isNaN(id)) {
            console.error("Invalid ID detected:", params.id);
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const body = await req.json();
        console.log("Request body:", body);

        const updatedNotice = await prisma.personalNotice.update({
            where: { id },
            data: body,
        });

        console.log("Updated notice:", updatedNotice);
        return NextResponse.json(updatedNotice);
    } catch (err: any) {
        console.error("Caught exception in PATCH /personal-notices/[id]:", err);

        // Prisma の validation エラーも捕捉
        if (err.code === "P2025") {
            return NextResponse.json({ error: "Notice not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: any) {
    console.log("---- DELETE /personal-notices/[id] called ----");

    try {
        // context.params を解凍
        const params = await context.params;
        console.log("Unwrapped params:", params);

        const id = Number(params.id);
        console.log("Parsed id:", id);

        if (isNaN(id)) {
            console.error("Invalid ID detected:", params.id);
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // delete_flag を true にしてソフト削除
        const deletedNotice = await prisma.personalNotice.update({
            where: { id },
            data: { delete_flag: true },
        });

        console.log("Soft deleted notice:", deletedNotice);
        return NextResponse.json({ success: true, notice: deletedNotice });
    } catch (err: any) {
        console.error("Caught exception in DELETE /personal-notices/[id]:", err);

        // Prisma の P2025 エラー（対象が存在しない場合）
        if (err.code === "P2025") {
            return NextResponse.json({ error: "Notice not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
