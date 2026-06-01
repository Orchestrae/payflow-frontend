import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dashboardApi } from '@/api/dashboard';
import { employeesApi } from '@/api/employees';
import { cadresApi } from '@/api/cadres';
import { deductionsApi } from '@/api/deductions';
import { payrollApi } from '@/api/payroll';
import { transfersApi } from '@/api/transfers';
import { walletApi } from '@/api/wallet';
import { settingsApi } from '@/api/settings';
import { auditApi } from '@/api/audit';
import type {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  CreateCadreRequest,
  CreateDeductionRuleRequest,
  CreatePayrollRunRequest,
  SingleTransferRequest,
  BatchTransferRequest,
  BusinessSettings,
} from '@/types';

// === Dashboard ===
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getSummary().then((r) => r.data),
    staleTime: 30_000,
  });
}

// === Employees ===
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesApi.list().then((r) => r.data),
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeesApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeeRequest) =>
      employeesApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee added successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmployeeRequest }) =>
      employeesApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeactivateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employeesApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deactivated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useImportEmployees() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => employeesApi.importCSV(file).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['employees'] });
      toast.success(`Imported ${data.created_count} employees`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// === Cadres ===
export function useCadres() {
  return useQuery({
    queryKey: ['cadres'],
    queryFn: () => cadresApi.list().then((r) => r.data),
  });
}

export function useCadre(id: number) {
  return useQuery({
    queryKey: ['cadres', id],
    queryFn: () => cadresApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateCadre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCadreRequest) =>
      cadresApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cadres'] });
      toast.success('Salary grade created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCadre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateCadreRequest }) =>
      cadresApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cadres'] });
      toast.success('Salary grade updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCadre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cadresApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cadres'] });
      toast.success('Salary grade deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// === Deduction Rules ===
export function useDeductionRules() {
  return useQuery({
    queryKey: ['deduction-rules'],
    queryFn: () => deductionsApi.list().then((r) => r.data),
  });
}

export function useCreateDeductionRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeductionRuleRequest) =>
      deductionsApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deduction-rules'] });
      toast.success('Deduction rule created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateDeductionRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDeductionRuleRequest }) =>
      deductionsApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deduction-rules'] });
      toast.success('Deduction rule updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteDeductionRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deductionsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deduction-rules'] });
      toast.success('Deduction rule deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// === Payroll ===
export function usePayrollRuns() {
  return useQuery({
    queryKey: ['payroll-runs'],
    queryFn: () => payrollApi.list().then((r) => r.data),
  });
}

export function usePayrollRun(id: number) {
  return useQuery({
    queryKey: ['payroll-runs', id],
    queryFn: () => payrollApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreatePayrollRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePayrollRunRequest) =>
      payrollApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
      toast.success('Payroll run created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSubmitPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.submit(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
      toast.success('Payroll submitted for approval');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useApprovePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.approve(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
      toast.success('Payroll approved');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRejectPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      payrollApi.reject(id, reason).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
      toast.success('Payroll rejected');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useProcessPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.processNow(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
      toast.success('Payroll is being processed');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAmendPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.amend(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
      toast.success('Payroll recalculated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReversePayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      payrollApi.reverse(id, reason).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
      toast.success('Payroll reversed');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// === Transfers ===
export function useTransfers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['transfers', { page, limit }],
    queryFn: () => transfersApi.list(page, limit).then((r) => r.data),
  });
}

export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SingleTransferRequest) =>
      transfersApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transfers'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Transfer initiated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCreateBatchTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BatchTransferRequest) =>
      transfersApi.createBatch(data).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['transfers'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
      toast.success(
        `${data.successful_transfers} of ${data.total_transfers} transfers successful`
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRetryTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => transfersApi.retry(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer retry initiated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// === Wallet ===
export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletApi.getWallet().then((r) => r.data),
  });
}

export function useWalletTransactions(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['wallet-transactions', { page, limit }],
    queryFn: () => walletApi.getTransactions(page, limit).then((r) => r.data),
  });
}

// === Ledger ===
export function useLedgerEntries(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['ledger-entries', { page, limit }],
    queryFn: () => walletApi.getLedgerEntries(page, limit).then((r) => r.data),
  });
}

export function useReconciliation() {
  return useQuery({
    queryKey: ['reconciliation'],
    queryFn: () => walletApi.getReconciliation().then((r) => r.data),
  });
}

// === Settings ===
export function useBusinessSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getSettings().then((r) => r.data),
  });
}

export function useUpdateBusinessSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BusinessSettings) =>
      settingsApi.updateSettings(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings saved');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// === Audit Logs ===
export function useAuditLogs(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['audit-logs', { page, limit }],
    queryFn: () => auditApi.list(page, limit).then((r) => r.data),
  });
}
