// Renders one or more JSON-LD blocks. Server component (no client JS).
export default function JsonLd({ items }) {
  const arr = Array.isArray(items) ? items : [items];
  return (
    <>
      {arr.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
