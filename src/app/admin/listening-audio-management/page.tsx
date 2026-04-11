'use client';
import React, { useState, useEffect } from 'react';
import Loader from '@/components/Common/Loader';
import { toast } from 'react-toastify';

interface AudioFile {
  public_id: string;
  secure_url: string;
  duration: number;
  format: string;
  bytes: number;
  created_at: string;
  resource_type: string;
}

const ListeningAudioManagement = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const fetchAudioFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/audio/management?action=list&type=listening');
      const data = await response.json();
      
      if (data.success) {
        setAudioFiles(data.result.resources || []);
      } else {
        toast.error('Failed to fetch audio files');
      }
    } catch (error) {
      console.error('Error fetching audio files:', error);
      toast.error('Error fetching audio files');
    } finally {
      setLoading(false);
    }
  };

  const deleteAudioFile = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this audio file? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/audio/management?action=delete&publicId=${publicId}&type=listening`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Audio file deleted successfully');
        fetchAudioFiles(); // Refresh the list
      } else {
        toast.error('Failed to delete audio file');
      }
    } catch (error) {
      console.error('Error deleting audio file:', error);
      toast.error('Error deleting audio file');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader message="Loading listening audios..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Listening Audio Management</h1>
        <button 
          onClick={fetchAudioFiles}
          className="btn btn-primary"
        >
          Refresh
        </button>
      </div>

      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Total Audio Files</div>
          <div className="stat-value">{audioFiles.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Size</div>
          <div className="stat-value">
            {formatFileSize(audioFiles.reduce((sum, file) => sum + file.bytes, 0))}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Duration</div>
          <div className="stat-value">
            {formatDuration(audioFiles.reduce((sum, file) => sum + (file.duration || 0), 0))}
          </div>
        </div>
      </div>

      {audioFiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No listening audio files found</div>
          <p className="text-gray-400 mt-2">Audio files uploaded for listening tests will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {audioFiles.map((file) => (
            <div key={file.public_id} className="card bg-base-100 shadow-lg border">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">
                      {file.public_id.split('/').pop()?.replace('listening_', 'Listening Test ')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Duration:</span> {formatDuration(file.duration || 0)}
                      </div>
                      <div>
                        <span className="font-semibold">Format:</span> {file.format?.toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold">Size:</span> {formatFileSize(file.bytes)}
                      </div>
                      <div>
                        <span className="font-semibold">Uploaded:</span> {formatDate(file.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="btn btn-sm btn-outline"
                    >
                      Play
                    </button>
                    <a
                      href={file.secure_url}
                      download
                      className="btn btn-sm btn-outline"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => deleteAudioFile(file.public_id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audio Player Modal */}
      {selectedFile && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {selectedFile.public_id.split('/').pop()?.replace('listening_', 'Listening Test ')}
            </h3>
            <audio controls className="w-full mb-4">
              <source src={selectedFile.secure_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="modal-action">
              <button 
                className="btn" 
                onClick={() => setSelectedFile(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeningAudioManagement; 