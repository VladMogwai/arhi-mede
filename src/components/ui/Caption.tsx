/** "+" marker followed by a short monospace note, used beside section texts. */
export function Caption({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <span aria-hidden="true" className="mb-3 block text-lg leading-none font-light">
        +
      </span>
      <p className="caption max-w-[26ch]">{children}</p>
    </div>
  );
}
