import Link from "next/link";

export default function FooterSimple() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container max-w-6xl mx-auto flex h-10 items-center justify-between px-4 sm:px-6">
        <div className="text-xs text-muted-foreground">
          &copy; {currentYear} Oknum. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy-policy"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-conditions"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
