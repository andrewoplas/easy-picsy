import { Button } from '@/components/ui/button';
import { DollarSign, RefreshCw } from 'lucide-react';
import { Transaction, PaymentStatus, PaymentMethod } from '@org/commons';

interface TransactionItemProps {
  transaction: Transaction;
  onRefund: (id: string) => void;
}

export function TransactionItem({ transaction, onRefund }: TransactionItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPaymentMethod = (method: PaymentMethod): string => {
    switch (method) {
      case PaymentMethod.GCASH:
        return 'GCash';
      case PaymentMethod.GRABPAY:
        return 'GrabPay';
      case PaymentMethod.PAYMAYA:
        return 'PayMaya';
      default:
        return method;
    }
  };

  const formatPaymentStatus = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'Completed';
      case PaymentStatus.PENDING:
        return 'Pending';
      case PaymentStatus.FAILED:
        return 'Failed';
      case PaymentStatus.REFUNDED:
        return 'Refunded';
      default:
        return status;
    }
  };

  const canRefund = transaction.status === PaymentStatus.COMPLETED;

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-green-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      
      <div className="relative flex items-center justify-between p-4 rounded-lg border border-dash-gray/20 hover:border-green-200 transition-all duration-200 hover:shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors duration-200">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-dash-navy">
                Payment received via {formatPaymentMethod(transaction.paymentMethod)}
              </span>
              <div className="px-2 py-1 bg-green-500 text-white rounded-md text-sm font-medium">
                {formatCurrency(transaction.amount)}
              </div>
            </div>
            <p className="text-sm text-dash-navy/60">
              {formatTime(transaction.timestamp)} • Session {transaction.sessionId} • Status: {formatPaymentStatus(transaction.status)}
            </p>
          </div>
        </div>

        {canRefund && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRefund(transaction.id)}
            className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 hover:border-red-300 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            REFUND
          </Button>
        )}
      </div>
    </div>
  );
}