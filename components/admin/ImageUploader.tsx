"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageUploader({
  name = "image",
  defaultValue = "",
  label = "上傳圖片",
  folder = "uploads",
}: {
  name?: string;
  defaultValue?: string;
  label?: string;
  folder?: string;
}) {
  const [preview, setPreview] = useState<string>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("上傳失敗");
      const data = await res.json();
      setPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-start gap-4">
        {preview && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-50 flex-shrink-0">
            {/* 使用原生 img 避免 next/image 設定 domain */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="預覽" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-700 file:text-white hover:file:bg-brand-800 file:cursor-pointer file:disabled:opacity-50"
          />
          {uploading && <p className="text-xs text-gray-500 mt-2">上傳中…</p>}
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          {preview && (
            <button
              type="button"
              onClick={() => setPreview("")}
              className="text-xs text-red-600 hover:underline mt-2"
            >
              移除圖片
            </button>
          )}
          <input type="hidden" name={name} value={preview} />
        </div>
      </div>
    </div>
  );
}
