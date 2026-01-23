'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui';
import { generateCSV, generateExportFilename } from '@/lib/collections/export';
import type { CollectionWithTalents } from '@/lib/collections/types';

interface SharedCollectionExportProps {
  collection: CollectionWithTalents;
}

export function SharedCollectionExport({ collection }: SharedCollectionExportProps) {
  const handleExport = () => {
    const csv = generateCSV(collection);
    const filename = generateExportFilename(collection.name);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={collection.talents.length === 0}>
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  );
}
