'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle2, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export interface MediaUploaderProps {
  label?: string;
  accept?: 'image/*' | 'video/*' | 'image/*,video/*';
  folder?: string;
  value?: string;
  onChange?: (url: string) => void;
  helperText?: string;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label = 'Upload Media (Images & Videos to Cloudinary)',
  accept = 'image/*,video/*',
  folder = 'nursemanagement',
  value,
  onChange,
  helperText,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = previewUrl?.match(/\.(mp4|mov|webm|avi|mkv)/i) || previewUrl?.includes('/video/upload/');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call backend Cloudinary upload endpoint
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${API_BASE}/storage/upload?folder=${encodeURIComponent(folder)}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed. Please check Cloudinary configuration.');
      }

      setProgress(90);
      const data = await res.json();
      const uploadedUrl = data.url || data.secure_url;

      setPreviewUrl(uploadedUrl);
      onChange?.(uploadedUrl);
      setProgress(100);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onChange?.('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>}

      {previewUrl ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/60 p-2 max-w-md">
          {isVideo ? (
            <video src={previewUrl} controls className="w-full h-48 object-cover rounded-xl" />
          ) : (
            <img src={previewUrl} alt="Uploaded Media" className="w-full h-48 object-cover rounded-xl" />
          )}

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 mt-2 px-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Uploaded to Cloudinary CDN</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700/80 hover:border-blue-500 rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 transition-all cursor-pointer text-center group',
            isUploading ? 'pointer-events-none opacity-60' : '',
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3 transition-transform">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <p className="text-sm font-semibold text-slate-200">
            {isUploading ? 'Uploading to Cloudinary...' : 'Click to select image or video'}
          </p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, MP4, MOV up to 100MB</p>

          {isUploading && (
            <div className="w-full max-w-xs mt-4 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
};
