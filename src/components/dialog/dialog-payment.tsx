'use client';

import * as React from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ButtonPrimary } from '@/components/ui/button-primary';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentMethod {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

interface DialogPaymentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: Id<'bookings'>;
  classData: {
    title: string;
    price: number;
    currency: string;
  };
  onSuccess?: () => void;
}

type PaymentCategory = 'qris' | 'ewallet' | 'va';

// Payment method categories
const QRIS_METHODS = ['GQ', 'LQ', 'SP'];
const E_WALLET_METHODS = ['DA', 'SA', 'OV'];
const VA_METHODS = ['BV', 'BR', 'BC', 'M2', 'I1'];

const categorizePaymentMethods = (methods: PaymentMethod[]) => {
  return {
    qris: methods.filter((m) => QRIS_METHODS.includes(m.paymentMethod)),
    ewallet: methods.filter((m) => E_WALLET_METHODS.includes(m.paymentMethod)),
    va: methods.filter((m) => VA_METHODS.includes(m.paymentMethod))
  };
};

export function DialogPayment({
  open,
  onOpenChange,
  bookingId,
  classData,
  onSuccess
}: DialogPaymentProps) {
  const createPayment = useMutation(api.payments.createPayment);
  const currentUser = useQuery(api.users.getCurrentUserQuery, {});
  const payment = useQuery(api.payments.getPaymentByBooking, { bookingId });
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(
    []
  );
  const [selectedMethod, setSelectedMethod] = React.useState<string | null>(
    null
  );
  const [isLoadingMethods, setIsLoadingMethods] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<PaymentCategory>('qris');
  const [isPaymentInitiated, setIsPaymentInitiated] = React.useState(false);
  const [paymentDetails, setPaymentDetails] = React.useState<{
    vaNumber?: string;
    qrString?: string;
    reference: string;
    paymentUrl?: string;
  } | null>(null);
  const [copiedVaNumber, setCopiedVaNumber] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);

  // Check payment status
  React.useEffect(() => {
    if (payment && payment.status === 'success') {
      setPaymentSuccess(true);
      setIsPaymentInitiated(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [payment, onSuccess]);

  // Poll payment status if payment is initiated (for QRIS/VA)
  React.useEffect(() => {
    if (!open || !isPaymentInitiated || paymentSuccess) return;

    const interval = setInterval(() => {
      // The payment query will automatically update via Convex reactivity
      if (payment && payment.status === 'success') {
        setPaymentSuccess(true);
        setIsPaymentInitiated(false);
        clearInterval(interval);
        if (onSuccess) {
          onSuccess();
        }
      } else if (
        payment &&
        (payment.status === 'failed' || payment.status === 'expired')
      ) {
        clearInterval(interval);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [open, isPaymentInitiated, payment, paymentSuccess, onSuccess]);

  // Fetch payment methods when dialog opens
  React.useEffect(() => {
    if (open) {
      if (paymentMethods.length === 0) {
        fetchPaymentMethods();
      }
      // Reset selection and tab when dialog opens
      setSelectedMethod(null);
      setActiveTab('qris');
      setIsPaymentInitiated(false);
      setPaymentDetails(null);
      setCopiedVaNumber(false);
      setPaymentSuccess(false);
    }
  }, [open]);

  // Reset selected method if it's not in the current tab
  React.useEffect(() => {
    if (paymentMethods.length > 0 && selectedMethod) {
      const categorized = categorizePaymentMethods(paymentMethods);
      const currentMethods = categorized[activeTab];
      if (!currentMethods.some((m) => m.paymentMethod === selectedMethod)) {
        setSelectedMethod(null);
      }
    }
  }, [activeTab, paymentMethods, selectedMethod]);

  const fetchPaymentMethods = async () => {
    setIsLoadingMethods(true);
    try {
      const response = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: classData.price
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch payment methods');
      }

      const data = await response.json();
      setPaymentMethods(data.paymentMethods || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to load payment methods'
      );
    } finally {
      setIsLoadingMethods(false);
    }
  };

  const handlePay = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!currentUser) {
      toast.error('User information not available. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    try {
      // Step 1: Create payment in Convex
      const paymentId = await createPayment({
        bookingId,
        amount: classData.price,
        currency: classData.currency,
        paymentMethod: selectedMethod
      });

      // Step 2: Initiate payment via API
      const initiateResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId,
          customerName: currentUser.name,
          customerEmail: currentUser.email,
          customerPhone: currentUser.phone
        })
      });

      if (!initiateResponse.ok) {
        const error = await initiateResponse.json();
        throw new Error(error.error || 'Failed to initiate payment');
      }

      const paymentData = await initiateResponse.json();

      // Check if it's E-wallet (needs redirect)
      const isEWallet = E_WALLET_METHODS.includes(selectedMethod);

      if (isEWallet) {
        // For E-wallet: redirect to payment URL
        if (!paymentData.paymentUrl) {
          throw new Error('Payment URL not received');
        }
        toast.success('Redirecting to payment page...');
        onOpenChange(false);
        window.open(paymentData.paymentUrl, '_blank');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // For QRIS/VA: show payment details in dialog
        setIsPaymentInitiated(true);
        setPaymentDetails({
          vaNumber: paymentData.vaNumber,
          qrString: paymentData.qrString,
          reference: paymentData.reference,
          paymentUrl: paymentData.paymentUrl
        });
        toast.success('Payment initiated successfully!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to process payment. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyVaNumber = async () => {
    if (paymentDetails?.vaNumber) {
      await navigator.clipboard.writeText(paymentDetails.vaNumber);
      setCopiedVaNumber(true);
      toast.success('VA Number copied to clipboard!');
      setTimeout(() => setCopiedVaNumber(false), 2000);
    }
  };

  // Show loading if currentUser is not loaded yet
  if (currentUser === undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Select your preferred payment method to complete enrollment
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error if currentUser is not available
  if (!currentUser) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Select your preferred payment method to complete enrollment
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              User information not available. Please refresh the page.
            </p>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Select your preferred payment method to complete enrollment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="shadow-none border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Class</span>
                  <span className="font-medium">{classData.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-semibold text-lg">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: classData.currency || 'IDR'
                    }).format(classData.price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          {paymentSuccess && (
            <Card className="shadow-none border border-emerald-200 bg-emerald-50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="size-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                      Pembayaran Berhasil!
                    </h3>
                    <p className="text-sm text-emerald-700">
                      Pembayaran Anda telah berhasil diproses. Terima kasih
                      telah mendaftar di kelas ini.
                    </p>
                  </div>
                  <ButtonPrimary
                    onClick={() => {
                      onOpenChange(false);
                      window.location.href = '/enrollments';
                    }}
                    className="mt-4"
                  >
                    Lihat Enrollments
                  </ButtonPrimary>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Instructions (shown after payment initiated) */}
          {isPaymentInitiated && paymentDetails && !paymentSuccess && (
            <Card className="shadow-none border">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Payment Instructions
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Reference:{' '}
                      <span className="font-mono">
                        {paymentDetails.reference}
                      </span>
                    </p>
                  </div>

                  {/* QRIS Display */}
                  {paymentDetails.qrString && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Scan QR Code</p>
                      <div className="flex justify-center p-4 bg-white rounded-lg border">
                        <QRCodeSVG
                          value={paymentDetails.qrString}
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Scan this QR code with your mobile banking app or
                        e-wallet
                      </p>
                    </div>
                  )}

                  {/* VA Number Display */}
                  {paymentDetails.vaNumber && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">
                        Virtual Account Number
                      </p>
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <span className="font-mono text-lg flex-1 text-center">
                          {paymentDetails.vaNumber}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyVaNumber}
                          className="shrink-0"
                        >
                          {copiedVaNumber ? (
                            <Check className="size-4" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Transfer the exact amount to this Virtual Account number
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Payment status will be updated automatically once payment
                      is confirmed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Methods */}
          {!isPaymentInitiated && !paymentSuccess && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Select Payment Method</h3>

              {isLoadingMethods ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No payment methods available</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchPaymentMethods}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    if (!isPaymentInitiated) {
                      setActiveTab(value as PaymentCategory);
                    }
                  }}
                >
                  <div className="w-full border-b">
                    <TabsList className="w-fit justify-start h-auto p-0 bg-transparent border-0 rounded-none gap-0">
                      <TabsTrigger
                        value="qris"
                        disabled={isPaymentInitiated}
                        className={cn(
                          'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground',
                          isPaymentInitiated && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        QRIS
                      </TabsTrigger>
                      <TabsTrigger
                        value="ewallet"
                        disabled={isPaymentInitiated}
                        className={cn(
                          'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground',
                          isPaymentInitiated && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        E-Wallet
                      </TabsTrigger>
                      <TabsTrigger
                        value="va"
                        disabled={isPaymentInitiated}
                        className={cn(
                          'rounded-none border-0 border-b-2 border-transparent px-4 py-3 -mb-[2px] data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground',
                          isPaymentInitiated && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        Virtual Account
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {(() => {
                    const categorized =
                      categorizePaymentMethods(paymentMethods);
                    const currentMethods = categorized[activeTab];

                    return (
                      <TabsContent value={activeTab} className="mt-6">
                        {currentMethods.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No payment methods available in this category</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {currentMethods.map((method) => (
                              <button
                                key={method.paymentMethod}
                                type="button"
                                onClick={() =>
                                  setSelectedMethod(method.paymentMethod)
                                }
                                disabled={isPaymentInitiated}
                                className={cn(
                                  'cursor-pointer flex flex-col items-center gap-3 p-4 border rounded-lg transition-all',
                                  'hover:border-primary hover:bg-accent/50',
                                  selectedMethod === method.paymentMethod &&
                                    'border-primary bg-accent ring-2 ring-primary ring-offset-2',
                                  isPaymentInitiated &&
                                    'opacity-50 cursor-not-allowed'
                                )}
                              >
                                {method.paymentImage && (
                                  <div className="relative w-20 h-12">
                                    <Image
                                      src={method.paymentImage}
                                      alt={method.paymentName}
                                      fill
                                      className="object-contain"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                <div className="text-center w-full">
                                  <p className="font-medium text-xs">
                                    {method.paymentName}
                                  </p>
                                  {method.totalFee &&
                                    parseFloat(method.totalFee) > 0 && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Fee:{' '}
                                        {new Intl.NumberFormat('id-ID', {
                                          style: 'currency',
                                          currency: classData.currency || 'IDR'
                                        }).format(parseFloat(method.totalFee))}
                                      </p>
                                    )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    );
                  })()}
                </Tabs>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {paymentSuccess ? (
            <ButtonPrimary
              onClick={() => {
                onOpenChange(false);
                window.location.href = '/enrollments';
              }}
            >
              Lihat Enrollments
            </ButtonPrimary>
          ) : isPaymentInitiated ? (
            <ButtonPrimary onClick={() => onOpenChange(false)}>
              Close
            </ButtonPrimary>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <ButtonPrimary
                onClick={handlePay}
                disabled={
                  !selectedMethod ||
                  isLoadingMethods ||
                  isProcessing ||
                  paymentMethods.length === 0
                }
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </ButtonPrimary>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
