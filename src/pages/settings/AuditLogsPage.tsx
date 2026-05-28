import { useState } from 'react';
import { ScrollText } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useApi';
import { formatDateTime } from '@/utils/date';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { TableSkeleton } from '@/components/shared/Skeleton';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs(page);

  const logs = data?.audit_logs || [];
  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  if (isLoading) return <Card><TableSkeleton /></Card>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Audit Logs</h1>

      {!logs.length ? (
        <Card>
          <EmptyState
            icon={<ScrollText className="h-12 w-12" />}
            title="No audit logs yet"
            description="Activity will be logged here as your team uses PayFlow."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Action</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Resource</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">User</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {log.resource_type} #{log.resource_id}
                    </td>
                    <td className="px-6 py-3 text-slate-600 max-w-xs truncate">{log.description}</td>
                    <td className="px-6 py-3 text-slate-600">User #{log.user_id}</td>
                    <td className="px-6 py-3 text-slate-500 text-xs">{formatDateTime(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </Card>
      )}
    </div>
  );
}
