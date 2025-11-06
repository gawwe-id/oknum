import { Protect } from "@clerk/nextjs";

export default function AdminComplainsPage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Admin Complains</h1>
        <p className="text-muted-foreground">
          Welcome to your admin complains page. This is a protected route.
        </p>
      </div>
    </Protect>
  );
}
