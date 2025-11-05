import { Protect } from "@clerk/nextjs";

export default function ContactUsPage() {
  return (
    <Protect>
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted-foreground">
        Get in touch with our support team.
      </p>
    </Protect>
  );
}
