export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-[var(--container-content)] px-6 ${className}`}>{children}</div>;
}
