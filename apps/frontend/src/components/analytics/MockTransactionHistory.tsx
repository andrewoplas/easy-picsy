import { Button } from '@/components/ui/card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, RefreshCw } from 'lucide-react';

// Mock data for demonstration - sorted by most recent first
const mockTransactions = [
  {
    id: '1',
    timestamp: '2024-01-15T10:40:00Z',
    amount: 250,
    type: 'payment',
    status: 'completed',
    sessionId: 'session_001'
  },
  {
    id: '2',
    timestamp: '2024-01-15T09:20:00Z',
    amount: 180,
    type: 'payment',
    status: 'completed',
    sessionId: 'session_002'
  },
  {
    id: '3',
    timestamp: '2024-01-15T08:15:00Z',
    amount: 320,
    type: 'payment',
    status: 'completed',
    sessionId: 'session_003'
  },
  {
    id: '4',
    timestamp: '2024-01-15T07:30:00Z',
    amount: 150,
    type: 'payment',
    status: 'completed',
    sessionId: 'session_004'
  }
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

interface Props {
  onRefund: (transactionId: string) => void;
}

export function MockTransactionHistory({ onRefund }: Props) {
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

  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <CardTitle className="text-lg font-normal text-dash-navy tracking-wide flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Log Transaction History
          <div className="ml-auto flex items-center space-x-2">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {formatCurrency(mockTransactions.reduce((sum, t) => sum + t.amount, 0))} total
            </div>
            <div className="text-dash-navy/60 text-sm">
              {mockTransactions.length} payments
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="group relative"
            >
              {/* Subtle Hover Background */}
              <div className="absolute inset-0 bg-green-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              {/* Main Transaction Card */}
              <div className="relative flex items-center justify-between p-4 rounded-lg border border-dash-gray/20 hover:border-green-200 transition-all duration-200 hover:shadow-sm">
                
                {/* Left Side - Payment Info */}
                <div className="flex items-center space-x-4">
                  {/* Success Icon */}
                  <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors duration-200">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  
                  {/* Payment Details */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-dash-navy">
                        Payment received
                      </span>
                      <div className="px-2 py-1 bg-green-500 text-white rounded-md text-sm font-medium">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    <p className="text-sm text-dash-navy/60">
                      {formatTime(transaction.timestamp)} • Session {transaction.sessionId} • Status: Completed
                    </p>
                  </div>
                </div>

                {/* Right Side - Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRefund(transaction.id)}
                  className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  REFUND
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
