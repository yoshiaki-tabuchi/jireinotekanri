"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch("/api/me").then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                window.location.href = "/login";
            }
        });
    }, []);

    if (!user) return <p>読み込み中...</p>;

    return (
        <div className="p-6">
            <h1>ようこそ {user.email} さん！</h1>
        </div>
    );
}
