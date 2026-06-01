import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, ScrollText, Key, Trash2, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useBusinessSettings, useUpdateBusinessSettings } from '@/hooks/useApi';
import { settingsApi } from '@/api/settings';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CardSkeleton } from '@/components/shared/Skeleton';

const PROVIDER_KEYS = [
  { provider: 'paystack', key: 'paystack_secret_key', label: 'Paystack Secret Key', placeholder: 'sk_live_...' },
  { provider: 'paystack', key: 'paystack_public_key', label: 'Paystack Public Key', placeholder: 'pk_live_...' },
  { provider: 'korapay', key: 'korapay_api_key', label: 'Korapay API Key', placeholder: 'sk_...' },
  { provider: 'korapay', key: 'korapay_encryption_key', label: 'Korapay Encryption Key', placeholder: 'enc_...' },
];

export default function BusinessSettingsPage() {
  const navigate = useNavigate();
  const { data: settings, isLoading } = useBusinessSettings();
  const updateSettings = useUpdateBusinessSettings();
  const queryClient = useQueryClient();
  const [showProviderKeys, setShowProviderKeys] = useState(false);
  const [keyValues, setKeyValues] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const { data: providerKeys } = useQuery({
    queryKey: ['provider-keys'],
    queryFn: () => settingsApi.getProviderKeys().then(r => r.data),
    enabled: showProviderKeys,
  });

  const setKeyMutation = useMutation({
    mutationFn: ({ provider, key, value }: { provider: string; key: string; value: string }) =>
      settingsApi.setProviderKey(provider, key, value),
    onSuccess: () => {
      toast.success('API key saved');
      queryClient.invalidateQueries({ queryKey: ['provider-keys'] });
      setKeyValues({});
    },
    onError: () => toast.error('Failed to save key'),
  });

  const deleteKeyMutation = useMutation({
    mutationFn: ({ provider, key }: { provider: string; key: string }) =>
      settingsApi.deleteProviderKey(provider, key),
    onSuccess: () => {
      toast.success('API key removed');
      queryClient.invalidateQueries({ queryKey: ['provider-keys'] });
    },
    onError: () => toast.error('Failed to remove key'),
  });

  function handleToggle(field: string, value: boolean) {
    updateSettings.mutate({ [field]: value });
  }

  function getExistingKey(provider: string, key: string) {
    return providerKeys?.find(k => k.provider === provider && k.setting_key === key);
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
        <div className="space-y-4 max-w-2xl">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Quick Links */}
        <div className="flex gap-3">
          <Button variant="outline" icon={<UserPlus className="h-4 w-4" />}
            onClick={() => navigate('/settings/invite')}>
            Invite user
          </Button>
          <Button variant="outline" icon={<Users className="h-4 w-4" />}
            onClick={() => navigate('/settings/team')}>
            Team members
          </Button>
          <Button variant="outline" icon={<ScrollText className="h-4 w-4" />}
            onClick={() => navigate('/settings/audit-logs')}>
            Audit logs
          </Button>
        </div>

        {/* Statutory Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Statutory Deductions</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enable or disable automatic statutory calculations for payroll
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <Toggle
              label="PAYE Tax"
              description="Calculate Pay-As-You-Earn income tax based on 2026 brackets"
              enabled={settings?.paye_enabled ?? true}
              onChange={(v) => handleToggle('paye_enabled', v)}
            />
            <Toggle
              label="Pension"
              description="8% employee + 10% employer of basic, housing, and transport"
              enabled={settings?.pension_enabled ?? false}
              onChange={(v) => handleToggle('pension_enabled', v)}
            />
            <Toggle
              label="NHF"
              description="2.5% of basic salary for National Housing Fund"
              enabled={settings?.nhf_enabled ?? false}
              onChange={(v) => handleToggle('nhf_enabled', v)}
            />
            <Toggle
              label="NSITF"
              description="1% of gross salary (employer-only contribution)"
              enabled={settings?.nsitf_enabled ?? false}
              onChange={(v) => handleToggle('nsitf_enabled', v)}
            />
          </CardContent>
        </Card>

        {/* Workflow Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Payroll Workflow</h2>
            <p className="text-xs text-slate-500 mt-1">
              Control how payroll runs are processed
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <Toggle
              label="Require approval"
              description="Payroll runs must be approved before they can be processed"
              enabled={settings?.payroll_requires_approval ?? true}
              onChange={(v) => handleToggle('payroll_requires_approval', v)}
            />
            <Toggle
              label="Auto-process"
              description="Automatically process payroll after approval (skip manual trigger)"
              enabled={settings?.payroll_auto_process ?? false}
              onChange={(v) => handleToggle('payroll_auto_process', v)}
            />
          </CardContent>
        </Card>

        {/* Provider API Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Key className="h-5 w-5 text-amber-600" />
                  Use Your Own API Keys
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Optionally use your own payment provider keys instead of platform defaults. Keys are AES-256 encrypted at rest.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProviderKeys(!showProviderKeys)}
              >
                {showProviderKeys ? 'Hide' : 'Configure'}
              </Button>
            </div>
          </CardHeader>
          {showProviderKeys && (
            <CardContent className="space-y-6">
              {['paystack', 'korapay'].map(provider => (
                <div key={provider}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 capitalize">{provider}</h3>
                  <div className="space-y-3">
                    {PROVIDER_KEYS.filter(k => k.provider === provider).map(keyDef => {
                      const existing = getExistingKey(keyDef.provider, keyDef.key);
                      const fieldId = `${keyDef.provider}_${keyDef.key}`;
                      const isVisible = visibleKeys[fieldId];
                      return (
                        <div key={fieldId} className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="text-xs font-medium text-slate-600 block mb-1">{keyDef.label}</label>
                            {existing && !keyValues[fieldId] ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded border">
                                  {existing.masked_value || '****'}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setKeyValues({ ...keyValues, [fieldId]: '' })}
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteKeyMutation.mutate({ provider: keyDef.provider, key: keyDef.key })}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <Input
                                    type={isVisible ? 'text' : 'password'}
                                    placeholder={keyDef.placeholder}
                                    value={keyValues[fieldId] || ''}
                                    onChange={e => setKeyValues({ ...keyValues, [fieldId]: e.target.value })}
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    onClick={() => setVisibleKeys({ ...visibleKeys, [fieldId]: !isVisible })}
                                  >
                                    {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                                <Button
                                  size="sm"
                                  disabled={!keyValues[fieldId]}
                                  loading={setKeyMutation.isPending}
                                  onClick={() => setKeyMutation.mutate({
                                    provider: keyDef.provider,
                                    key: keyDef.key,
                                    value: keyValues[fieldId],
                                  })}
                                >
                                  Save
                                </Button>
                                {existing && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newValues = { ...keyValues };
                                      delete newValues[fieldId];
                                      setKeyValues(newValues);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-400 border-t pt-3">
                When set, transfers will use your keys instead of the platform default. Remove a key to revert to platform defaults.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
