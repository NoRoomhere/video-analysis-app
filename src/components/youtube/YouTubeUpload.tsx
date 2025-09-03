import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  X,
  Eye,
  Lock,
  Globe,
  Users,
  Calendar,
  Clock,
  FileVideo,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { youtubeService } from '../../services';
import { VideoUploadData, VideoUploadProgress, VIDEO_VALIDATION } from '../../types/youtube';

interface YouTubeUploadProps {
  onUploadComplete?: (videoId: string) => void;
}

const YouTubeUpload: React.FC<YouTubeUploadProps> = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState<VideoUploadData>({
    title: '',
    description: '',
    tags: [],
    privacyStatus: 'private'
  });
  const [uploadProgress, setUploadProgress] = useState<VideoUploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > VIDEO_VALIDATION.MAX_SIZE) {
      setError(`File size must be less than ${VIDEO_VALIDATION.MAX_SIZE / (1024 * 1024 * 1024)}GB`);
      return;
    }

    // Check file type
    if (!VIDEO_VALIDATION.ALLOWED_TYPES.includes(file.type as any)) {
      setError('Invalid file type. Please select a valid video file.');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Auto-generate title from filename
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    setUploadData(prev => ({
      ...prev,
      title: fileName.length > VIDEO_VALIDATION.MAX_TITLE_LENGTH 
        ? fileName.substring(0, VIDEO_VALIDATION.MAX_TITLE_LENGTH) 
        : fileName
    }));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadData({
      title: '',
      description: '',
      tags: [],
      privacyStatus: 'private'
    });
    setError(null);
    setUploadProgress(null);
  };

  const handleInputChange = (field: keyof VideoUploadData, value: string | string[]) => {
    setUploadData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && uploadData.tags.length < VIDEO_VALIDATION.MAX_TAGS_COUNT) {
      const tag = currentTag.trim().substring(0, VIDEO_VALIDATION.MAX_TAG_LENGTH);
      if (!uploadData.tags.includes(tag)) {
        setUploadData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setUploadData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    if (!uploadData.title.trim()) {
      setError('Please enter a video title');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress({
      loaded: 0,
      total: selectedFile.size,
      percentage: 0,
      status: 'uploading'
    });

    try {
      const uploadedVideo = await youtubeService.uploadVideo(
        selectedFile,
        uploadData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setUploadProgress({
        loaded: selectedFile.size,
        total: selectedFile.size,
        percentage: 100,
        status: 'completed',
        videoId: uploadedVideo.id
      });

      onUploadComplete?.(uploadedVideo.id);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setUploadProgress({
        loaded: 0,
        total: selectedFile.size,
        percentage: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upload to YouTube</h3>
          <p className="text-sm text-gray-500">Upload and publish your videos</p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </motion.div>
      )}

      {/* File Upload Area */}
      <div className="mb-6">
        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-red-400 transition-colors"
          >
            <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Select Video File
            </h4>
            <p className="text-gray-500 mb-4">
              Choose a video file to upload (max 2GB)
            </p>
            <p className="text-sm text-gray-400">
              Supported formats: MP4, AVI, MOV, WMV, FLV, WebM, MKV
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileVideo className="w-8 h-8 text-red-500" />
                <div>
                  <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewUrl && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  controls
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Form */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={uploadData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              maxLength={VIDEO_VALIDATION.MAX_TITLE_LENGTH}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter video title..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {uploadData.title.length}/{VIDEO_VALIDATION.MAX_TITLE_LENGTH} characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={uploadData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              maxLength={VIDEO_VALIDATION.MAX_DESCRIPTION_LENGTH}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter video description..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {uploadData.description.length}/{VIDEO_VALIDATION.MAX_DESCRIPTION_LENGTH} characters
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={VIDEO_VALIDATION.MAX_TAG_LENGTH}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add a tag..."
              />
              <button
                onClick={handleAddTag}
                disabled={!currentTag.trim() || uploadData.tags.length >= VIDEO_VALIDATION.MAX_TAGS_COUNT}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            {uploadData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {uploadData.tags.length}/{VIDEO_VALIDATION.MAX_TAGS_COUNT} tags
            </p>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy Settings
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'private', label: 'Private', icon: Lock, description: 'Only you can see' },
                { value: 'unlisted', label: 'Unlisted', icon: Eye, description: 'Anyone with link' },
                { value: 'public', label: 'Public', icon: Globe, description: 'Everyone can see' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('privacyStatus', option.value as any)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    uploadData.privacyStatus === option.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <option.icon className="w-4 h-4" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {uploadProgress.status === 'completed' ? 'Upload Complete' : 'Uploading...'}
                </span>
                <span className="text-sm text-gray-500">
                  {uploadProgress.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    uploadProgress.status === 'completed'
                      ? 'bg-green-500'
                      : uploadProgress.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
              {uploadProgress.status === 'completed' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Video uploaded successfully!</span>
                </div>
              )}
              {uploadProgress.status === 'error' && uploadProgress.error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{uploadProgress.error}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !uploadData.title.trim()}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload to YouTube
              </>
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default YouTubeUpload; 