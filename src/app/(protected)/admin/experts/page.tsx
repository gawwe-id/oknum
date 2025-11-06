import { Protect } from "@clerk/nextjs";

export default function AdminExpertsPage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Admin Experts</h1>
        <p className="text-muted-foreground">
          Welcome to your admin experts page. This is a protected route.
        </p>
      </div>
    </Protect>
  );
}
