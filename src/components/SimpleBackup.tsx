'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function SimpleBackup() {
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // 主要テーブルのデータを取得
      const tables = [
        'projects',
        'customers',
        'craftsmen',
        'quotations',
        'invoices',
        'project_payables',
        'craftsman_schedules',
        'calendar_memos',
        'calendar_important_notes',
      ];

      const backup: any = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {},
      };

      // 各テーブルのデータを取得
      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('*');

          if (error) {
            backup.data[table] = {
              error: error.message,
              count: 0,
              records: []
            };
          } else {
            backup.data[table] = {
              count: data?.length || 0,
              records: data || [],
            };
          }
        } catch (err) {
          backup.data[table] = {
            error: String(err),
            count: 0,
            records: []
          };
        }
      }

      // JSONファイルとしてダウンロード
      const filename = `backup_${new Date().toISOString().split('T')[0]}.json`;
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // 成功メッセージ
      const totalRecords = Object.values(backup.data).reduce(
        (sum: number, table: any) => sum + (table.count || 0),
        0
      );
      toast.success(`バックアップ完了: ${totalRecords}件のレコードをエクスポートしました`);
    } catch (error) {
      toast.error(`バックアップエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBackup}
      disabled={loading}
      size="lg"
      className="w-full md:w-auto"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          バックアップ作成中...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          バックアップを作成してダウンロード
        </>
      )}
    </Button>
  );
}
