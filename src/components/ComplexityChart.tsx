import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';

interface Props {
    data: {
        name: string;
        value: number;
        fullMark: number;
    }[];
}

export const ComplexityRadarChart: React.FC<Props> = ({ data }) => {
    return (
        <div className="h-[300px] w-full bg-slate-900/50 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
            <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Complexity Signature</h3>
            <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Radar
                        name="Metrics"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                        itemStyle={{ color: '#8b5cf6' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
