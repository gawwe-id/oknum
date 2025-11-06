import { Protect } from "@clerk/nextjs";

export default function AdminRevenuePage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Admin Revenue</h1>
        <p className="text-muted-foreground">
          Welcome to your admin revenue page. This is a protected route.
        </p>
      </div>
    </Protect>
  );
}
