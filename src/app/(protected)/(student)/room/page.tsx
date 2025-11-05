import { Protect } from "@clerk/nextjs";

export default function RoomPage() {
  return (
    <Protect>
      <h1 className="text-3xl font-bold mb-4">Room</h1>
      <p className="text-muted-foreground">Access your rooms here.</p>
    </Protect>
  );
}
