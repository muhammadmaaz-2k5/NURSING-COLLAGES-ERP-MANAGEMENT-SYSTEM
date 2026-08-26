'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, CheckCircle2, Film, Image as ImageIcon, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface MediaUploaderProps {
  label?: string;
  accept?: 'image/*' | 'video/*' | 'image/*,video/*' | string;
  folder?: string;
  value?: string;
  onChange?: (url: string) => void;
  helperText?: string;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label = 'Upload Media (Images & Documents)',
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
  const [storageProvider, setStorageProvider] = useState<'cloudinary' | 'local' | 'data_url' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(value);
    if (value) {
      if (value.includes('cloudinary.com') || value.includes('res.cloudinary')) {
        setStorageProvider('cloudinary');
      } else if (value.startsWith('/uploads/')) {
        setStorageProvider('local');
      } else if (value.startsWith('data:')) {
        setStorageProvider('data_url');
      }
    }
  }, [value]);

  const isVideo = previewUrl?.match(/\.(mp4|mov|webm|avi|mkv)/i) || previewUrl?.includes('/video/upload/');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(20);

    let uploadSuccess = false;
    let uploadedUrl = '';

    // STRATEGY 1: Upload via Backend NestJS API Endpoint
    try {
      const formData = new FormData();
      formData.append('file', file);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${API_BASE}/storage/upload?folder=${encodeURIComponent(folder)}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        uploadedUrl = data.url || data.secure_url;
        if (uploadedUrl) {
          uploadSuccess = true;
          setStorageProvider(data.provider === 'local' ? 'local' : 'cloudinary');
          setProgress(100);
        }
      }
    } catch (apiErr: any) {
      console.warn('Backend storage upload error, trying direct client upload:', apiErr?.message);
    }

    // STRATEGY 2: Direct Client-Side Cloudinary Upload (if backend failed/unavailable)
    if (!uploadSuccess) {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'pmvlk7fs';
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nursemanagement';

      if (cloudName) {
        try {
          setProgress(50);
          const directForm = new FormData();
          directForm.append('file', file);
          directForm.append('upload_preset', uploadPreset);
          directForm.append('folder', `nursing_college/${folder}`);

          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            {
              method: 'POST',
              body: directForm,
            },
          );

          if (cloudRes.ok) {
            const cloudData = await cloudRes.json();
            uploadedUrl = cloudData.secure_url || cloudData.url;
            if (uploadedUrl) {
              uploadSuccess = true;
              setStorageProvider('cloudinary');
              setProgress(100);
            }
          }
        } catch (directErr: any) {
          console.warn('Direct Cloudinary upload error:', directErr?.message);
        }
      }
    }

    // STRATEGY 3: Local In-Memory Base64 Data URL (Always succeeds offline/local)
    if (!uploadSuccess) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setPreviewUrl(dataUrl);
          onChange?.(dataUrl);
          setStorageProvider('data_url');
          setProgress(100);
          setIsUploading(false);
        };
        reader.onerror = () => {
          throw new Error('Failed to read local file');
        };
        return;
      } catch (readErr: any) {
        setError('Unable to load file preview. Please try another image.');
      }
    }

    if (uploadSuccess && uploadedUrl) {
      setPreviewUrl(uploadedUrl);
      onChange?.(uploadedUrl);
    }

    setIsUploading(false);
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    setStorageProvider(null);
    onChange?.('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {previewUrl ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 max-w-md shadow-sm">
          {isVideo ? (
            <video src={previewUrl} controls className="w-full h-44 object-cover rounded-xl" />
          ) : (
            <img
              src={previewUrl}
              alt="Uploaded Asset"
              className="w-full h-44 object-cover rounded-xl"
            />
          )}

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Remove media"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between mt-2 px-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {storageProvider === 'cloudinary'
                  ? 'Cloudinary CDN Ready'
                  : storageProvider === 'local'
                  ? 'Local Storage Ready'
                  : 'Ready'}
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<RefreshCw className="w-3 h-3" />}
            >
              Replace
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all cursor-pointer text-center group',
            isUploading ? 'opacity-70 pointer-events-none' : '',
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>

          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {isUploading ? 'Uploading file...' : 'Click or Drag file to upload'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            PNG, JPG, WebP, PDF or MP4 (Up to 25MB)
          </p>

          {isUploading && (
            <div className="w-48 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
