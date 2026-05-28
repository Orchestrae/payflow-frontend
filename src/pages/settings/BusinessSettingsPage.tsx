import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, ScrollText } from 'lucide-react';
import { useBusinessSettings, useUpdateBusinessSettings } from '@/hooks/useApi';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/shared/Skeleton';

export default function BusinessSettingsPage() {
  const navigate = useNavigate();
  const { data: settings, isLoading } = useBusinessSettings();
  const updateSettings = useUpdateBusinessSettings();

  function handleToggle(field: string, value: boolean) {
    updateSettings.mutate({ [field]: value });
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
      </div>
    </div>
  );
}
