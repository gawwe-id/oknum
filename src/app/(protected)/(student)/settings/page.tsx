import { Protect } from "@clerk/nextjs";

export default function SettingPage() {
  return (
    <Protect>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-muted-foreground">
        Manage your account settings here.
      </p>
    </Protect>
  );
}
