import { Protect } from "@clerk/nextjs";

export default function OverviewPage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your overview page. This is a protected route.
        </p>
      </div>
    </Protect>
  );
}
