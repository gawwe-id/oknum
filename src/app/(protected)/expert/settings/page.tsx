import { Protect } from "@clerk/nextjs";

export default function ExpertSettingsPage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Expert Settings</h1>
        <p className="text-muted-foreground">
          Welcome to your expert settings page. This is a protected route.
        </p>
      </div>
    </Protect>
  );
}
