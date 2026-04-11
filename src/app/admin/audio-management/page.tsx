"use client";
import React, { useState, useEffect } from "react";
import Loader from '@/components/Common/Loader';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaTrash, FaPlay, FaDownload, FaInfo } from "react-icons/fa";

interface AudioFile {
  public_id: string;
  secure_url: string;
  created_at: string;
  bytes: number;
  duration: number;
  format: string;
}

const AudioManagementPage = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.role !== "admin") {
      router.push("/admin");
      return;
    }
    fetchAudioFiles();
  }, [session, router]);

  const fetchAudioFiles = async () => {
    try {
      const response = await fetch("/api/audio/management?action=list");
      const data = await response.json();

      if (data.success) {
        setAudioFiles(data.files);
      } else {
        console.error("Failed to fetch audio files:", data.error);
      }
    } catch (error) {
      console.error("Error fetching audio files:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAudioFile = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this audio file?")) {
      return;
    }

    setDeleting(publicId);
    try {
      const response = await fetch(
        `/api/audio/management?publicId=${publicId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        setAudioFiles((prev) =>
          prev.filter((file) => file.public_id !== publicId)
        );
        alert("Audio file deleted successfully");
      } else {
        alert("Failed to delete audio file");
      }
    } catch (error) {
      console.error("Error deleting audio file:", error);
      alert("Error deleting audio file");
    } finally {
      setDeleting(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-screen">
          <Loader message="Loading audios..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-6">Audio File Management</h1>

            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-lg">Total Files: {audioFiles?.length}</p>
                <p className="text-sm text-gray-600">
                  Total Size:{" "}
                  {formatBytes(
                    audioFiles?.reduce((sum, file) => sum + file.bytes, 0)
                  )}
                </p>
              </div>
              <button onClick={fetchAudioFiles} className="btn btn-primary">
                Refresh
              </button>
            </div>

            {audioFiles?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No audio files found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Size</th>
                      <th>Duration</th>
                      <th>Format</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audioFiles?.map((file) => (
                      <tr key={file.public_id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <FaPlay className="text-primary" />
                            <span className="font-mono text-sm">
                              {file.public_id.split("/").pop()}
                            </span>
                          </div>
                        </td>
                        <td>{formatBytes(file.bytes)}</td>
                        <td>{formatDuration(file.duration)}</td>
                        <td>{file.format.toUpperCase()}</td>
                        <td>
                          {new Date(file.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                window.open(file.secure_url, "_blank")
                              }
                              className="btn btn-sm btn-outline"
                              title="Play"
                            >
                              <FaPlay />
                            </button>
                            <a
                              href={file.secure_url}
                              download
                              className="btn btn-sm btn-outline"
                              title="Download"
                            >
                              <FaDownload />
                            </a>
                            <button
                              onClick={() => deleteAudioFile(file.public_id)}
                              className="btn btn-sm btn-error"
                              disabled={deleting === file.public_id}
                              title="Delete"
                            >
                              {deleting === file.public_id ? (
                                <Loader message="" className="!w-4 !h-4 !border-2" />
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioManagementPage;
