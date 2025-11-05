export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Each role has its own layout with sidebar and navbar
  // This layout just passes through children
  return <>{children}</>;
}
