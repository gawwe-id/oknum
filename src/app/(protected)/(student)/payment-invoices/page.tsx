import { Protect } from "@clerk/nextjs";

export default function PaymentInvoicesPage() {
  return (
    <Protect>
      <h1 className="text-3xl font-bold mb-4">Payment & Invoices</h1>
      <p className="text-muted-foreground">
        View your payment history and invoices here.
      </p>
    </Protect>
  );
}
