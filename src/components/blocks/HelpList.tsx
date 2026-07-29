export function HelpList({ list }: { list: [string, string][] }) {
  return (
    <div className="out kv">
      {list.map(([name, desc]) => (
        <div key={name} className="contents">
          <span className="text-cyan">{name}</span>
          <span>{desc}</span>
        </div>
      ))}
    </div>
  );
}