import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Key, Mail, CreditCard, Eye, EyeOff, Save, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { platformApi } from '@/api/platform';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/shared/Skeleton';
import toast from 'react-hot-toast';

const SETTING_CATEGORIES = [
  { id: 'paystack', label: 'Paystack', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'smtp', label: 'Email (SMTP)', icon: <Mail className="h-4 w-4" /> },
  { id: 'korapay', label: 'KoraPay', icon: <Key className="h-4 w-4" /> },
];

export default function PlatformSettingsPage() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState('');
  const [editModal, setEditModal] = useState<{ key: string; description: string; category: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showValues, setShowValues] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['platform-settings', activeCategory],
    queryFn: () => platformApi.getSettings(activeCategory || undefined).then((r) => r.data),
  });

  const updateSetting = useMutation({
    mutationFn: (data: { key: string; value: string; description: string; category: string }) =>
      platformApi.setSetting(data.key, data.value, data.description, data.category),
    onSuccess: () => {
      toast.success('Setting updated');
      queryClient.invalidateQueries({ queryKey: ['platform-settings'] });
      setEditModal(null);
      setEditValue('');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteSetting = useMutation({
    mutationFn: (key: string) => platformApi.deleteSetting(key),
    onSuccess: () => {
      toast.success('Setting removed');
      queryClient.invalidateQueries({ queryKey: ['platform-settings'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage API keys and credentials (AES-256 encrypted at rest)</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          onClick={() => setShowValues(!showValues)}
        >
          {showValues ? 'Hide values' : 'Show values'}
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeCategory === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {SETTING_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Card><TableSkeleton /></Card>
      ) : !settings?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Settings className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No settings configured yet</p>
            <p className="text-xs text-slate-400 mt-1">Use the API to set credentials: PUT /platform/settings/:key</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Configured Settings</h2>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Key</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Value</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {settings.map((setting) => (
                  <tr key={setting.key} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-mono text-xs text-slate-900">{setting.key}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 capitalize">
                        {setting.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-slate-600">
                      {showValues ? (setting.masked_value || '—') : '••••••••'}
                    </td>
                    <td className="px-6 py-3">
                      {setting.is_set ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" /> Configured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                          <XCircle className="h-3.5 w-3.5" /> Not set
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditModal({ key: setting.key, description: setting.description, category: setting.category });
                            setEditValue('');
                          }}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${setting.key}?`)) deleteSetting.mutate(setting.key);
                          }}
                          className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        open={editModal !== null}
        onClose={() => setEditModal(null)}
        title={`Update: ${editModal?.key}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">{editModal?.description || 'Enter the new value for this setting.'}</p>
          <Input
            label="New Value"
            type="password"
            placeholder="Enter new value..."
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditModal(null)}>Cancel</Button>
            <Button
              icon={<Save className="h-4 w-4" />}
              loading={updateSetting.isPending}
              onClick={() => {
                if (editModal && editValue) {
                  updateSetting.mutate({
                    key: editModal.key,
                    value: editValue,
                    description: editModal.description,
                    category: editModal.category,
                  });
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
