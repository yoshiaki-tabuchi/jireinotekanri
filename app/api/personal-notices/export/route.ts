import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const where: any = {};
    if (searchParams.has("employee_id")) {
        where.employee_id = { contains: searchParams.get("employee_id") || "" };
    }

    const data = await prisma.personalNotice.findMany({
        where,
        orderBy: { date: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("PersonalNotices");

    sheet.columns = [
        { header: "ID", key: "id", width: 5 },
        { header: "日付", key: "date", width: 12 },
        { header: "社員番号", key: "employee_id", width: 8 },
        { header: "氏名", key: "name", width: 15 },
        { header: "種類", key: "category", width: 12 },
        { header: "変更前", key: "before_change", width: 20 },
        { header: "変更後", key: "after_change", width: 20 },
        { header: "備考", key: "note", width: 30 },
    ];

    data.forEach((n: any) => {
        sheet.addRow({
            id: n.id,
            date: n.date.toISOString().slice(0, 10),
            employee_id: n.employee_id,
            name: n.name,
            category: n.category,
            before_change: n.before_change,
            after_change: n.after_change,
            note: n.note,
        });
    });

    // ヘッダーを太字 + 罫線
    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // データ行にも罫線
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; // ヘッダーはすでに設定済み
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            };
        });
    });

    // ArrayBuffer に書き込む
    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Disposition": 'attachment; filename="personal_notices.xlsx"',
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });
}
