"use client";
import { useState } from "react";

export default function ImageUploader({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);
    setPreview(data.url);
    onUploaded(data.url);
  };

  return (
    <div className="mt-2">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p className="text-sm">Uploading...</p>}
      {preview && (
        <img src={preview} alt="Preview" className="w-48 mt-2 border rounded" />
      )}
    </div>
  );
}
