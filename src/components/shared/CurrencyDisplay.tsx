import { formatNGN, formatTransferAmount } from '@/utils/currency';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
}

export function CurrencyDisplay({ amount, className = '' }: CurrencyDisplayProps) {
  return <span className={className}>{formatNGN(amount)}</span>;
}

interface TransferAmountDisplayProps {
  amount: string;
  className?: string;
}

export function TransferAmountDisplay({
  amount,
  className = '',
}: TransferAmountDisplayProps) {
  return <span className={className}>{formatTransferAmount(amount)}</span>;
}
