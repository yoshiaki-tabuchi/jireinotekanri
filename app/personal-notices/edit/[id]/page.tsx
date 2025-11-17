"use client";

import { useRouter, useParams } from "next/navigation"; // 修正: useParams を追加
import React, { useEffect, useState } from "react";

interface Notice {
    id: number;
    date: string;
    employee_id: string;
    name: string;
    category: number;
    before_change?: string;
    after_change?: string;
    note?: string;
    delete_flag?: boolean;
    registration_date?: string;
    last_updated?: string;
}

export default function EditPage() {
    const router = useRouter();
    const params = useParams(); // 修正: クライアントコンポーネントでは useParams() で取得
    const [form, setForm] = useState<Partial<Notice>>({});

    const hoge = params?.id; // 修正: params.id を useParams() から取得
    console.log("hoge:", hoge); // 確認用

    const url = `/api/personal-notices/${hoge}`; // 修正: params.id → hoge

    useEffect(() => {
        if (!hoge) return; // 修正: params.id → hoge

        const fetchNotice = async () => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
                const data = await res.json();
                setForm(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotice();
    }, [hoge, url]); // 修正: params.id → hoge

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hoge) return; // 安全策

        await fetch(`/api/personal-notices/${hoge}`, { // 修正: params.id → hoge
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        router.push("/personal-notices");
    };

    const formatDateForInput = (date: string | Date | undefined) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0"); // 0スタートなので +1
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h2 className="text-2xl mb-4">辞令ノート 編集</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label>日付</label>
                    <input type="date" name="date" value={formatDateForInput(form.date) || ""} onChange={handleChange} className="border p-1 w-full" />
                </div>
                <div>
                    <label>社員番号</label>
                    <input type="text" name="employee_id" value={form.employee_id || ""} onChange={handleChange} className="border p-1 w-full" />
                </div>
                <div>
                    <label>氏名</label>
                    <input type="text" name="name" value={form.name || ""} onChange={handleChange} className="border p-1 w-full" />
                </div>
                <div>
                    <label>種類</label>
                    <select name="category" value={form.category || ""} onChange={handleChange} className="border p-1 w-full">
                        <option value="">選択</option>
                        <option value="1">新卒入社</option>
                        <option value="2">中途入社</option>
                        <option value="3">昇格</option>
                        <option value="4">異動</option>
                        <option value="5">転勤</option>
                        <option value="6">駐在</option>
                        <option value="7">社員→契約</option>
                        <option value="8">契約→社員</option>
                    </select>
                </div>
                <div>
                    <label>変更前</label>
                    <input type="text" name="before_change" value={form.before_change || ""} onChange={handleChange} className="border p-1 w-full" />
                </div>
                <div>
                    <label>変更後</label>
                    <input type="text" name="after_change" value={form.after_change || ""} onChange={handleChange} className="border p-1 w-full" />
                </div>
                <div>
                    <label>備考</label>
                    <textarea name="note" value={form.note || ""} onChange={handleChange} className="border p-1 w-full" />
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="delete_flag" checked={form.delete_flag || false} onChange={handleChange} />
                        削除済み
                    </label>
                </div>

                <div className="mb-2">
                    <label htmlFor="registration_date" className="block text-sm font-medium text-gray-700">
                        初回登録日
                    </label>
                    <input
                        type="date"
                        id="registration_date"
                        name="registration_date"
                        value={form.registration_date?.slice(0, 10) || ""}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="last_updated" className="block text-sm font-medium text-gray-700">
                        更新日
                    </label>
                    <input
                        type="date"
                        id="last_updated"
                        name="last_updated"
                        value={form.last_updated?.slice(0, 10) || ""}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer">更新</button>

                <button
                    onClick={() => router.back()}
                    className="bg-gray-400 text-white px-4 py-1 rounded mb-4 cursor-pointer">
                    戻る
                </button>
            </form>
        </div>
    );
}
