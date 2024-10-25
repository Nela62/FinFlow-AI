// menu on the left and top
// main content area in the middle
// tabs with ai chat, pdf viewer on the right

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
