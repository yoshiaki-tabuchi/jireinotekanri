
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const schema = z.object({
    date: z.string().optional(),
    employee_id: z.string().optional(),
    name: z.string().optional(),
    category: z.string().optional(),
    before_change: z.string().optional(),
    after_change: z.string().optional(),
    note: z.string().optional(),
    show_deleted: z.string().optional(),
    page: z.string().optional(), // 追加
    per_page: z.string().optional(), // 追加
    sort_order: z.enum(["asc", "desc"]).optional(),
    sort_by: z.string().optional(),

});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const filters = Object.fromEntries(searchParams.entries());
        const parsed = schema.parse(filters);

        console.log("sort_order:", parsed.sort_order);
        const sortBy = parsed.sort_by ?? "date";
        const sortOrder: "asc" | "desc" = parsed.sort_order === "asc" ? "asc" : "desc";
        const where: any = {};
        if (!parsed.show_deleted) where.delete_flag = false;
        if (parsed.date) where.date = new Date(parsed.date);
        if (parsed.employee_id) where.employee_id = { contains: parsed.employee_id };
        if (parsed.name) where.name = { contains: parsed.name };
        if (parsed.category) where.category = Number(parsed.category);
        if (parsed.before_change) where.before_change = { contains: parsed.before_change };
        if (parsed.after_change) where.after_change = { contains: parsed.after_change };
        if (parsed.note) where.note = { contains: parsed.note };

        const page = Number(parsed.page) || 1;
        const perPage = Number(parsed.per_page) || 20;

        const total = await prisma.personalNotice.count({ where });

        let orderBy: Prisma.PersonalNoticeOrderByWithRelationInput[];

        if (sortBy === "date") {
            // 日付でソートする場合は単独
            orderBy = [{ date: sortOrder }];
        } else {
            // それ以外は「指定カラム → 日付 desc」
            orderBy = [
                { [sortBy]: sortOrder } as Prisma.PersonalNoticeOrderByWithRelationInput,
                { date: "desc" },
            ];
        }

        const notices = await prisma.personalNotice.findMany({
            where,
            orderBy,
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return NextResponse.json({
            data: notices,
            pagination: {
                page,
                perPage,
                total,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}


export async function POST(req: Request) {
    const data = await req.json();

    const validated = schema.extend({
        date: z.coerce.date(),
        employee_id: z.string().min(4).max(4),
        name: z.string().max(20),
        category: z.coerce.number(),
    }).parse(data);

    const today = new Date();

    const notice = await prisma.personalNotice.create({
        data: {
            ...validated,
            registration_date: today,
            last_updated: today,
        },
    });

    return NextResponse.json({ success: true, notice });
}



