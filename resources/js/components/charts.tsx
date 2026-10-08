// Wrapper chart recharts yang ikut tema: warna dari CSS var (--chart-*),
// otomatis mengikuti light/dark tanpa kode tambahan.
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export interface ChartDataset {
    label?: string;
    data: number[];
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

const palette = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

function toRows(chart: ChartData) {
    return chart.labels.map((label, i) => {
        const row: Record<string, string | number> = { name: label };
        chart.datasets.forEach((ds, di) => {
            row[ds.label ?? `s${di}`] = ds.data[i] ?? 0;
        });
        return row;
    });
}

const tooltipStyle = {
    backgroundColor: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    fontSize: '12px',
    color: 'var(--popover-foreground)',
} as const;

export function AreaChartCard({
    data,
    height = 280,
}: {
    data: ChartData;
    height?: number;
}) {
    const rows = toRows(data);
    const keys = data.datasets.map((ds, i) => ds.label ?? `s${i}`);
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {keys.map((k, i) => (
                    <Area
                        key={k}
                        type="monotone"
                        dataKey={k}
                        stroke={palette[i % palette.length]}
                        fill={palette[i % palette.length]}
                        fillOpacity={0.18}
                        strokeWidth={2.5}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function BarChartCard({
    data,
    height = 280,
}: {
    data: ChartData;
    height?: number;
}) {
    const rows = toRows(data);
    const keys = data.datasets.map((ds, i) => ds.label ?? `s${i}`);
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {keys.map((k, i) => (
                    <Bar
                        key={k}
                        dataKey={k}
                        fill={palette[i % palette.length]}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={36}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

export function DonutChartCard({
    data,
    height = 260,
}: {
    data: ChartData;
    height?: number;
}) {
    const ds = data.datasets[0];
    const rows = data.labels.map((label, i) => ({
        name: label,
        value: ds.data[i] ?? 0,
    }));
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Pie
                    data={rows}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="58%"
                    outerRadius="85%"
                    paddingAngle={2}
                    strokeWidth={0}
                >
                    {rows.map((_, i) => (
                        <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
