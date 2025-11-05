import { Protect } from "@clerk/nextjs";

export default function ConsultantPage() {
  return (
    <Protect>
      <h1 className="text-3xl font-bold mb-4">Consultant</h1>
      <p className="text-muted-foreground">
        Find and connect with consultants here.
      </p>
    </Protect>
  );
}
