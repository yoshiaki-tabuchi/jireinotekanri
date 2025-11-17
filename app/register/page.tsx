"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // フォームのリロード防止

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("登録成功！ログインしてください。");
                setEmail("");
                setPassword("");
                setName("");
            } else {
                setMessage(data.error || "登録に失敗しました");
            }
        } catch (err) {
            console.error(err);
            setMessage("サーバーエラーが発生しました");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow">
            <h1 className="text-2xl mb-4">ユーザー登録</h1>
            {message && <p className="mb-4 text-red-500">{message}</p>}

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block mb-1">名前</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="山田 太郎"
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">メールアドレス</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@example.com"
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="パスワード"
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    登録
                </button>
            </form>
        </div>
    );
}
