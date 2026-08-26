'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface TinyEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  label?: string;
  placeholder?: string;
  height?: number | string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export const TinyEditor: React.FC<TinyEditorProps> = ({
  value = '',
  onChange,
  label,
  placeholder = 'Write institutional content, clinical notes, or announcements...',
  height = 360,
  disabled = false,
  error,
  helperText,
  className,
}) => {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'm85agaz3vhr9rehhi24b7jt6k06re3c4bk9ohhp4obfdymsu';

  if (!isClient) {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div
          style={{ height }}
          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-400 gap-2 text-xs"
        >
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span>Loading TinyMCE Rich Text Editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div
        className={cn(
          'rounded-2xl overflow-hidden border transition-all duration-200 shadow-xs dark:shadow-none',
          error
            ? 'border-rose-500 ring-1 ring-rose-500/30'
            : 'border-slate-300 dark:border-slate-700/80 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/40',
        )}
      >
        <Editor
          apiKey={apiKey}
          value={value}
          disabled={disabled}
          onEditorChange={(content) => onChange?.(content)}
          init={{
            height,
            menubar: 'file edit view insert format tools table help',
            plugins: [
              // Free plugins baseline
              'accordion', 'advlist', 'anchor', 'autolink', 'autoresize', 'autosave',
              'charmap', 'code', 'codesample', 'directionality', 'emoticons', 'fullscreen',
              'help', 'image', 'importcss', 'insertdatetime', 'link', 'lists', 'media',
              'nonbreaking', 'pagebreak', 'preview', 'quickbars', 'save', 'searchreplace',
              'table', 'visualblocks', 'visualchars', 'wordcount',

              // Premium plugins — selected for Healthcare & Clinical Education ERP
              'a11ychecker',       // Accessibility Checker — Ensure clinical content meets WCAG standards for patient materials
              'revisionhistory',   // Audit trail — maintain version history for regulatory compliance
              'tinymcespellchecker',// Catch medical terminology and clinical documentation errors
              'exportpdf',         // Generate compliant PDF documents and reports
              'tinymceai',         // Accelerate clinical notes, syllabus creation, and notices
            ],
            toolbar:
              'undo redo | tinymceai-quickactions tinymceai-chat | formatselect | bold italic underline strikethrough | ' +
              'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
              'link image media table | a11ycheck spellchecker revisionhistory exportpdf | code fullscreen preview help',
            skin: resolvedTheme === 'dark' ? 'oxide-dark' : 'oxide',
            content_css: resolvedTheme === 'dark' ? 'dark' : 'default',
            placeholder,
            branding: false,
            promotion: false,
            content_style:
              'body { font-family: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Roboto, sans-serif; font-size: 14px; line-height: 1.6; }',
            // Mandatory callback for Revision History
            revisionhistory_fetch: () => Promise.resolve([]),
            // Mandatory callback for TinyMCE AI Trial
            tinymceai_token_provider: async () => {
              await fetch(
                `https://demo.api.tiny.cloud/1/${apiKey}/auth/random`,
                { method: 'POST', credentials: 'include' },
              );
              return {
                token: await fetch(
                  `https://demo.api.tiny.cloud/1/${apiKey}/jwt/tinymceai`,
                  { credentials: 'include' },
                ).then((r) => r.text()),
              };
            },
          }}
        />
      </div>

      {error && <span className="text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>
      )}
    </div>
  );
};
