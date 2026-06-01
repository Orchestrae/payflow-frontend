import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useImportEmployees } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { CSVImportResponse } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function ImportEmployeesPage() {
  const navigate = useNavigate();
  const importMutation = useImportEmployees();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<CSVImportResponse | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'text/csv' || file?.name.endsWith('.csv')) {
      setSelectedFile(file);
    }
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }

  function handleUpload() {
    if (!selectedFile) return;
    importMutation.mutate(selectedFile, {
      onSuccess: (data) => setResult(data),
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Import Employees</h1>

      <div className="max-w-2xl space-y-6">
        {!result ? (
          <>
            <Card>
              <CardContent>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors
                    ${dragActive ? 'border-[#22BC66] bg-emerald-50' : 'border-slate-300'}
                    ${selectedFile ? 'border-[#22BC66] bg-emerald-50/30' : ''}`}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <FileSpreadsheet className="h-10 w-10 text-[#22BC66] mb-3" />
                      <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-xs text-[#3B82F6] hover:underline mt-2 cursor-pointer"
                      >
                        Choose a different file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Drag and drop your CSV file here
                      </p>
                      <p className="text-xs text-slate-500 mb-4">or</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                        bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
                        Browse files
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-900">CSV Format</h3>
                  <a
                    href={`${API_BASE}/v1/employees/import/template`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                      text-[#3B82F6] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200
                      transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download CSV Template
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Your CSV should have these columns in the header row:
                </p>
                <code className="block text-xs bg-slate-50 p-3 rounded-lg text-slate-700 overflow-x-auto">
                  full_name,email,cadre_id,bank_name,bank_code,bank_account_number
                </code>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/employees')}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                loading={importMutation.isPending}
                disabled={!selectedFile}
                icon={<Upload className="h-4 w-4" />}
              >
                Upload and import
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-900">Import Results</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{result.created_count} imported</span>
                </div>
                {result.error_count > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{result.error_count} errors</span>
                  </div>
                )}
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left px-4 py-2 text-xs font-medium uppercase text-slate-500">Row</th>
                        <th className="text-left px-4 py-2 text-xs font-medium uppercase text-slate-500">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.map((err, i) => (
                        <tr key={i} className="border-b border-slate-50">
                          <td className="px-4 py-2 text-slate-700">{err.row}</td>
                          <td className="px-4 py-2 text-red-600">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <Button onClick={() => navigate('/employees')}>
                View all employees
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
