"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams, useRouter } from "next/navigation";


export default function PersonalNoticePage() {

    const router = useRouter();
    const [filters, setFilters] = useState({
        date: "",
        employee_id: "",
        name: "",
        category: "",
        before_change: "",
        after_change: "",
        note: "",
        show_deleted: false,
    });
    const [data, setData] = useState([]);
    const perPage = 20;
    const [totalPages, setTotalPages] = useState(1);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page") || 1);

    // ページ番号の初期化
    const savedPage = localStorage.getItem("personalNoticePage");
    const [page, setPage] = useState(savedPage ? Number(savedPage) : 1);

    // データ取得
    const fetchData = async (pageNum: number) => {
        setPage(pageNum);
        localStorage.setItem("personalNoticePage", pageNum.toString()); // ページ番号を保存

        const query = new URLSearchParams(
            Object.fromEntries(
                Object.entries({ ...filters, page: pageNum.toString(), per_page: perPage })
                    .filter(([_, v]) => v)
            ) as Record<string, string>
        );

        const res = await fetch(`/api/personal-notices?${query}`);
        const json = await res.json();
        setData(json.data);
        setTotalPages(json.pagination.totalPages);
    };


    useEffect(() => {
        const savedPage = localStorage.getItem("personalNoticePage");
        const initialPage = savedPage ? Number(savedPage) : 1;
        fetchData(initialPage);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // チェックボックスの場合は checked を使用
        let val: string | boolean = value;
        if (type === "checkbox" && "checked" in e.target) {
            val = e.target.checked;
        }

        setFilters({ ...filters, [name]: val });
    };


    const handleDelete = async (id: number) => {
        if (!confirm("本当に削除しますか？")) return;

        try {
            const res = await fetch(`/api/personal-notices/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("削除しました");
                fetchData(); // 削除後に再読み込み
            } else {
                alert("削除に失敗しました");
            }
        } catch (error) {
            console.error(error);
            alert("エラーが発生しました");
        }
    };


    const kinds: Record<number, string> = {
        1: '新卒入社',
        2: '中途入社',
        3: '昇格',
        4: '降格',
        5: '異動',
        6: '転勤',
        7: '駐在',
        8: '社員→契約',
        9: '契約→社員',
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl mb-4">辞令ノート管理画面</h2>

            {/* ✅ 新規作成ボタン */}
            <button
                onClick={() => router.push("/personal-notices/new")}
                className="bg-yellow-500 text-white px-4 py-1 rounded  cursor-pointer">
                新規作成
            </button>
            <div className="mt-6 p-4 bg-gray-50 rounded shadow-md">
                <h3 className="text-lg font-semibold mb-4">検索条件</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* 日付 */}
                    <div className="flex flex-col">
                        <label htmlFor="date" className="mb-1 text-sm font-medium">日付</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={filters.date}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* 社員番号 */}
                    <div className="flex flex-col">
                        <label htmlFor="employee_id" className="mb-1 text-sm font-medium">社員番号</label>
                        <input
                            type="text"
                            name="employee_id"
                            id="employee_id"
                            placeholder="社員番号"
                            value={filters.employee_id}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* 氏名 */}
                    <div className="flex flex-col">
                        <label htmlFor="name" className="mb-1 text-sm font-medium">氏名</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="氏名"
                            value={filters.name}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* 種類 */}
                    <div className="flex flex-col">
                        <label htmlFor="category" className="mb-1 text-sm font-medium">種類</label>
                        <select
                            name="category"
                            id="category"
                            value={filters.category}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 focus:ring focus:ring-blue-300"
                        >
                            <option value="">種類</option>
                            {Object.entries(kinds).map(([key, val]) => (
                                <option key={key} value={key}>{val}</option>
                            ))}
                        </select>
                    </div>

                    {/* 変更前 */}
                    <div className="flex flex-col">
                        <label htmlFor="before_change" className="mb-1 text-sm font-medium">変更前データ</label>
                        <input
                            type="text"
                            name="before_change"
                            id="before_change"
                            placeholder="変更前データ"
                            value={filters.before_change}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* 変更後 */}
                    <div className="flex flex-col">
                        <label htmlFor="after_change" className="mb-1 text-sm font-medium">変更後データ</label>
                        <input
                            type="text"
                            name="after_change"
                            id="after_change"
                            placeholder="変更後データ"
                            value={filters.after_change}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* 備考 */}
                    <div className="flex flex-col col-span-1 md:col-span-2">
                        <label htmlFor="note" className="mb-1 text-sm font-medium">備考</label>
                        <textarea
                            name="note"
                            id="note"
                            placeholder="備考"
                            value={filters.note}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 focus:ring focus:ring-blue-300"
                            rows={1}
                        />
                    </div>

                    {/* 削除データも対象 */}
                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            name="show_deleted"
                            id="show_deleted"
                            checked={filters.show_deleted}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="show_deleted" className="text-sm font-medium">削除データも対象</label>
                    </div>
                </div>

                {/* ボタン */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => fetchData()}
                        className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-600"
                    >
                        検索
                    </button>
                    <a
                        href="/api/personal-notices/export"
                        className="bg-green-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-green-600"
                    >
                        Excelエクスポート
                    </a>
                </div>
            </div>


            <div className="flex justify-center mt-6 space-x-1">
                {/* 前へボタン */}
                <button
                    onClick={() => fetchData(page - 1)}
                    disabled={page <= 1}
                    className={`px-3 py-1 rounded-md border transition-colors ${page <= 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-blue-100"
                        }`}
                >
                    前へ
                </button>

                {/* ページ番号 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => fetchData(p)}
                        className={`px-3 py-1 rounded-md border transition-colors ${p === page
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                            }`}
                    >
                        {p}
                    </button>
                ))}

                {/* 次へボタン */}
                <button
                    onClick={() => fetchData(page + 1)}
                    disabled={page >= totalPages}
                    className={`px-3 py-1 rounded-md border transition-colors ${page >= totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-blue-100"
                        }`}
                >
                    次へ
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse border border-gray-300">
                <colgroup>
                    <col className="w-12" />  {/* ID */}
                    <col className="w-32" />  {/* 日付 */}
                    <col className="w-24" />  {/* 社員番号 */}
                    <col className="w-32" />  {/* 氏名 */}
                    <col className="w-32" />  {/* 種類 */}
                    <col className="w-40" />  {/* 変更前 */}
                    <col className="w-40" />  {/* 変更後 */}
                    <col className="w-64" />  {/* 備考 */}
                </colgroup>

                <thead className="bg-blue-100">
                    <tr>
                        <th className="border p-2 text-center">ID</th>
                        <th className="border p-2 text-center">日付</th>
                        <th className="border p-2 text-center">社員番号</th>
                        <th className="border p-2 text-left">氏名</th>
                        <th className="border p-2 text-left">種類</th>
                        <th className="border p-2 text-left">変更前</th>
                        <th className="border p-2 text-left">変更後</th>
                        <th className="border p-2 text-left">備考</th>
                        <th className="border p-1 w-6 text-left">編集</th>
                        <th className="border p-1 w-6 text-left">削除</th>


                    </tr>
                </thead>

                <tbody>
                    {data.map((n: any) => (
                        <tr key={n.id} className="border hover:bg-gray-50">
                            <td className="border p-2 text-center">{n.id}</td>
                            <td className="border p-2 text-center">{n.date?.slice(0, 10)}</td>
                            <td className="border p-2 text-center">{n.employee_id.toString().padStart(4, "0")}</td>
                            <td className="border p-2 text-left">{n.name}</td>
                            <td className="border p-2 text-left">{kinds[n.category as number] ?? ''}</td>
                            <td className="border p-2 text-left break-words">{n.before_change}</td>
                            <td className="border p-2 text-left break-words">{n.after_change}</td>
                            <td className="border p-2 text-left break-words">{n.note}</td>

                            {/* 編集ボタン */}
                            <td className="text-center">
                                <button
                                    onClick={() => router.push(`/personal-notices/edit/${n.id}`)}
                                    className="border text-blue-500 hover:text-blue-700 cursor-pointer p-1 w-6"
                                    title="編集"
                                >
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                            </td>

                            {/* 削除ボタン */}
                            <td className="text-center">
                                <button
                                    onClick={() => handleDelete(n.id)}
                                    className="border text-red-500 hover:text-red-700 cursor-pointer p-1 w-6"
                                    title="削除"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>


                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td className="border p-2 text-center" colSpan={8}>
                                該当データがありません
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
