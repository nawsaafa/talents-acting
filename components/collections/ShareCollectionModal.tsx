'use client';

import { useState, useEffect, useTransition } from 'react';
import { Link2, Copy, Check, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Modal, Button, Select } from '@/components/ui';
import { generateShareLink, getShareLinks, revokeShareLink } from '@/lib/collections/actions';
import type { CollectionShareInfo } from '@/lib/collections/types';

interface ShareCollectionModalProps {
  collectionId: string;
  collectionName: string;
  onClose: () => void;
}

const EXPIRY_OPTIONS = [
  { value: '0', label: 'Never expires' },
  { value: '1', label: '1 day' },
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

export function ShareCollectionModal({
  collectionId,
  collectionName,
  onClose,
}: ShareCollectionModalProps) {
  const [shareLinks, setShareLinks] = useState<CollectionShareInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiryDays, setExpiryDays] = useState('7');
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadShareLinks();
  }, [collectionId]);

  const loadShareLinks = async () => {
    setLoading(true);
    try {
      const links = await getShareLinks(collectionId);
      setShareLinks(links);
    } catch {
      setError('Failed to load share links');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = () => {
    setError(null);
    startTransition(async () => {
      const days = parseInt(expiryDays, 10);
      const result = await generateShareLink(collectionId, days || undefined);

      if (result.success && result.shareLink) {
        setShareLinks((prev) => [result.shareLink!, ...prev]);
      } else {
        setError(result.error || 'Failed to generate share link');
      }
    });
  };

  const handleRevokeLink = (shareId: string) => {
    startTransition(async () => {
      const result = await revokeShareLink(shareId);
      if (result.success) {
        setShareLinks((prev) => prev.filter((link) => link.id !== shareId));
      } else {
        setError(result.error || 'Failed to revoke link');
      }
    });
  };

  const handleCopyLink = async (token: string, shareId: string) => {
    const url = `${window.location.origin}/collections/share/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(shareId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError('Failed to copy link');
    }
  };

  const getShareUrl = (token: string) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/collections/share/${token}`;
  };

  const isExpired = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <Modal isOpen onClose={onClose} title={`Share "${collectionName}"`} size="lg">
      {/* Generate New Link Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Generate New Share Link</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <Select
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
              disabled={isPending}
              options={EXPIRY_OPTIONS}
            />
          </div>
          <Button onClick={handleGenerateLink} disabled={isPending}>
            <Link2 className="w-4 h-4 mr-2" />
            {isPending ? 'Generating...' : 'Generate Link'}
          </Button>
        </div>
      </div>

      {/* Existing Links Section */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Active Share Links</h3>

        {loading ? (
          <div className="py-4 text-center text-gray-500">Loading...</div>
        ) : shareLinks.length > 0 ? (
          <div className="space-y-3">
            {shareLinks.map((link) => {
              const expired = isExpired(link.expiresAt);

              return (
                <div
                  key={link.id}
                  className={`p-3 border rounded-lg ${expired ? 'bg-gray-50 opacity-60' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      readOnly
                      value={getShareUrl(link.token)}
                      className="flex-1 text-sm bg-gray-100 px-3 py-1.5 rounded border-0 text-gray-700"
                    />
                    <button
                      onClick={() => handleCopyLink(link.token, link.id)}
                      disabled={expired}
                      className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                      aria-label="Copy link"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleRevokeLink(link.id)}
                      disabled={isPending}
                      className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                      aria-label="Revoke link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Created {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {link.expiresAt ? (
                        expired ? (
                          <span className="text-red-600">Expired</span>
                        ) : (
                          <>
                            Expires{' '}
                            {formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}
                          </>
                        )
                      ) : (
                        'Never expires'
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No share links yet. Generate one above to share this collection.
          </div>
        )}
      </div>

      {error && <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
