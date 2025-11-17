"use client";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("ログイン成功！");
            window.location.href = "/personal-notices";
        } else {
            alert(data.error || "ログイン失敗");
        }
    };

    return (
        <div className="p-4 max-w-sm mx-auto">
            <h1 className="text-xl mb-4">ログイン</h1>
            <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block border p-2 mb-2 w-full"
            />
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block border p-2 mb-2 w-full"
            />
            <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded w-full">
                ログイン
            </button>
        </div>
    );
}
