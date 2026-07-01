export default function RoadmapBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* dot grid */}
            <div
                className="absolute inset-0 opacity-[0.12] dark:opacity-[0.06]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, var(--color-alpha) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* glow blobs */}
            <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-alpha/10 blur-3xl" />
            <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-alpha/10 blur-3xl" />
            <div className="absolute bottom-20 -right-16 h-64 w-64 rounded-full bg-alpha/10 blur-3xl" />

            {/* topographic contour lines */}
            <svg
                className="absolute inset-0 h-full w-full text-foreground opacity-[0.04] dark:opacity-[0.07]"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="roadmap-topo"
                        x="0"
                        y="0"
                        width="240"
                        height="240"
                        patternUnits="userSpaceOnUse"
                    >
                        <ellipse
                            cx="120"
                            cy="120"
                            rx="100"
                            ry="60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <ellipse
                            cx="120"
                            cy="120"
                            rx="72"
                            ry="42"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <ellipse
                            cx="120"
                            cy="120"
                            rx="46"
                            ry="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <ellipse
                            cx="120"
                            cy="120"
                            rx="22"
                            ry="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#roadmap-topo)" />
            </svg>
        </div>
    );
}
