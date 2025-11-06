import { Protect } from "@clerk/nextjs";

export default function AdminStudentsPage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Admin Students</h1>
        <p className="text-muted-foreground">
          Welcome to your admin students page. This is a protected route.
        </p>
      </div>
    </Protect>
  );
}
