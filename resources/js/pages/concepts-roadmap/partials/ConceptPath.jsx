export default function ConceptPath({ from, to }) {
    const midY = (from.y + to.y) / 2;

    const d = `M ${from.x} ${from.y} C ${from.x} ${midY} ${to.x} ${midY} ${to.x} ${to.y}`;

    return (
        <path
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    );
}
