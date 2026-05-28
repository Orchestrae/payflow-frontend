import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Send } from 'lucide-react';
import { useCreateBatchTransfer } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { NIGERIAN_BANKS } from '@/utils/banks';
import type { SingleTransferRequest } from '@/types';

interface TransferRow {
  amount: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  narration: string;
}

const emptyRow = (): TransferRow => ({
  amount: '',
  bank_code: '',
  account_number: '',
  account_name: '',
  narration: '',
});

export default function BatchTransferPage() {
  const navigate = useNavigate();
  const batchTransfer = useCreateBatchTransfer();
  const [rows, setRows] = useState<TransferRow[]>([emptyRow(), emptyRow()]);

  function updateRow(index: number, field: keyof TransferRow, value: string) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(index: number) {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    const valid = rows.filter(
      (r) => r.amount && r.bank_code && r.account_number && r.account_name
    );
    if (!valid.length) return;

    const transfers: SingleTransferRequest[] = valid.map((r) => ({
      amount: r.amount,
      bank_code: r.bank_code,
      account_number: r.account_number,
      account_name: r.account_name,
      narration: r.narration || undefined,
    }));

    batchTransfer.mutate(
      { transfers },
      { onSuccess: () => navigate('/transfers') }
    );
  }

  const bankOptions = NIGERIAN_BANKS.map((b) => ({
    value: b.code,
    label: `${b.name}`,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Batch Transfer</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Transfer Recipients</h2>
            <Button variant="ghost" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addRow}>
              Add row
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2">
                <Input
                  placeholder="Account name"
                  value={row.account_name}
                  onChange={(e) => updateRow(i, 'account_name', e.target.value)}
                />
                <Select
                  placeholder="Bank"
                  options={bankOptions}
                  value={row.bank_code}
                  onChange={(e) => updateRow(i, 'bank_code', e.target.value)}
                />
                <Input
                  placeholder="Account no."
                  value={row.account_number}
                  onChange={(e) => updateRow(i, 'account_number', e.target.value)}
                />
                <Input
                  placeholder="Amount (NGN)"
                  value={row.amount}
                  onChange={(e) => updateRow(i, 'amount', e.target.value)}
                />
                <Input
                  placeholder="Narration"
                  value={row.narration}
                  onChange={(e) => updateRow(i, 'narration', e.target.value)}
                />
              </div>
              {rows.length > 1 && (
                <button onClick={() => removeRow(i)} className="p-2 text-slate-400 hover:text-red-500 mt-0.5 cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => navigate('/transfers')}>Cancel</Button>
        <Button loading={batchTransfer.isPending} icon={<Send className="h-4 w-4" />} onClick={handleSubmit}>
          Send {rows.filter((r) => r.amount && r.account_number).length} transfers
        </Button>
      </div>
    </div>
  );
}
