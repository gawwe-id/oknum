import { Protect } from "@clerk/nextjs";

export default function AdminRoomPage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Admin Room</h1>
        <p className="text-muted-foreground">
          Welcome to your admin room page. This is a protected route.
        </p>
      </div>
    </Protect>
  );
}
