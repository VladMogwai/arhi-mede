/** Project facts in brackets: [ 180 M² ] [ CORBEANCA ] [ 2018 ]. Empty values are skipped. */
export function Facts({ items, className = "" }: { items: (string | number | null | undefined)[]; className?: string }) {
  const visible = items.filter((item) => item !== null && item !== undefined && item !== "");
  if (visible.length === 0) return null;
  return (
    <ul className={`caption flex flex-wrap gap-x-5 gap-y-1 ${className}`}>
      {visible.map((item) => (
        <li key={String(item)}>[ {item} ]</li>
      ))}
    </ul>
  );
}
