import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Teal Corner Cool Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle 600px at 0% 200px, #a7f3d0, transparent),
            radial-gradient(circle 600px at 100% 200px, #a7f3d0, transparent)
          `,
        }}
      />
      
      {/* Your Content Here */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

