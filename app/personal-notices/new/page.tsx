"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PersonalNoticeNewPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        date: "",
        employee_id: "",
        name: "",
        category: "",
        before_change: "",
        after_change: "",
        note: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const res = await fetch("/api/personal-notices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        setIsSubmitting(false);

        if (res.ok) {
            alert("新しい辞令を登録しました。");
            router.push("/personal-notices");
        } else {
            const err = await res.json();
            alert("登録に失敗しました：" + (err.error || "不明なエラー"));
        }
    };

    const kinds = {
        1: "新卒入社",
        2: "中途入社",
        3: "昇格",
        4: "異動",
        5: "転勤",
        6: "駐在",
        7: "社員→契約",
        8: "契約→社員",
    };

    // ★ 追加：種類に応じた placeholder を返す
    const getAfterPlaceholder = () => {
        switch (formData.category) {
            case "1": // 新卒入社
            case "2": // 中途入社
                return "例：)所属部署";
            case "3": // 昇格
                return "例：)新役職名";
            default:
                return "";
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl mb-4">辞令ノート新規作成</h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block mb-1">日付</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">社員番号</label>
                    <input
                        type="text"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        placeholder="例：0001"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">氏名</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">種類</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    >
                        <option value="">選択してください</option>
                        {Object.entries(kinds).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">変更前</label>
                    <input
                        type="text"
                        name="before_change"
                        value={formData.before_change}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block mb-1">変更後</label>
                    <input
                        type="text"
                        name="after_change"
                        value={formData.after_change}
                        onChange={handleChange}
                        placeholder={getAfterPlaceholder()}  // ★ この行追加
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block mb-1">備考</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div className="flex space-x-2 mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {isSubmitting ? "登録中..." : "登録"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/personal-notices")}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        戻る
                    </button>
                </div>
            </form>
        </div>
    );
}
