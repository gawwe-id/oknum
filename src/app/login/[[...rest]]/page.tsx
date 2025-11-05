import { LoginForm } from "@/components/login-form";
import Navbar from "@/components/navbar";
import FooterSimple from "@/components/footer-simple";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col">
      <Navbar />
      {/* Teal Corner Cool Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle 600px at 0% 200px, #a7f3d0, transparent),
            radial-gradient(circle 600px at 100% 200px, #a7f3d0, transparent)
          `,
        }}
      />

      {/* Your Content Here */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10 pt-24">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      <FooterSimple />
    </div>
  );
}
