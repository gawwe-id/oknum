import { Protect } from "@clerk/nextjs";

export default function AdminSettingsPage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Admin Settings</h1>
        <p className="text-muted-foreground">
          Welcome to your admin settings page. This is a protected route.
        </p>
      </div>
    </Protect>
  );
}
