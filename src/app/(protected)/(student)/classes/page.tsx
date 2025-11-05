import { Protect } from "@clerk/nextjs";

export default function ClassesPage() {
  return (
    <Protect>
      <div>
        <h1 className="text-3xl font-bold mb-4">Classes</h1>
        <p className="text-muted-foreground">
          View and manage your classes here.
        </p>
      </div>
    </Protect>
  );
}
