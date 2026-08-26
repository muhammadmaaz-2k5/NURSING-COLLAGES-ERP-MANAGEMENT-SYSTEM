'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { TinyEditor } from '../../../components/ui/TinyEditor';
import { useToast } from '../../../context/ToastContext';
import { createNews } from '../services/portal.api';
import { CreateNewsDto, ContentStatus } from '../types/portal.types';

export interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateNewsDto>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    status: 'PUBLISHED',
  });

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setForm({ ...form, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error('Validation Error', 'Article title and body content are required.');
      return;
    }

    setIsLoading(true);
    try {
      await createNews(form);
      toast.success(
        'News Article Published',
        `"${form.title}" is now live on the public college portal.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Publishing Failed', err?.message || 'Could not publish article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish News Article / Press Release"
      description="Create public news content, event summaries, and official college announcements with TinyMCE rich text editor."
      size="xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Publish to Website
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Article Title *"
          placeholder="e.g. Annual Nursing Convocation 2026"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="URL Slug *"
            placeholder="annual-nursing-convocation-2026"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />

          <Select
            label="Publishing Status *"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
            options={[
              { value: 'PUBLISHED', label: 'Published Live' },
              { value: 'REVIEW', label: 'Under Review' },
              { value: 'DRAFT', label: 'Draft' },
            ]}
          />
        </div>

        <Input
          label="Short Excerpt"
          placeholder="Brief 1-2 sentence summary displayed on cards..."
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />

        <Input
          label="Cover Image URL"
          placeholder="https://images.unsplash.com/..."
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        <div className="space-y-1">
          <TinyEditor
            label="Article Body Content (Rich Text) *"
            placeholder="Compose rich article content with headings, images, quotes, and links..."
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
            height={320}
          />
        </div>
      </form>
    </Modal>
  );
};
