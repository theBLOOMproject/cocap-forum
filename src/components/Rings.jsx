export default function Rings({
  style,
  stroke = "rgba(0,103,177,0.06)",
  width = 34,
  radii = [140, 210, 280, 350, 420],
}) {
  const max = radii[radii.length - 1] + width;
  return (
    <svg
      className="ucg-rings"
      style={style}
      width={max * 2}
      height={max * 2}
      viewBox={`0 0 ${max * 2} ${max * 2}`}
      aria-hidden="true"
    >
      {radii.map((r) => (
        <circle key={r} cx={max} cy={max} r={r} stroke={stroke} strokeWidth={width} />
      ))}
    </svg>
  );
}
