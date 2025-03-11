import React from "react";
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Payload<number, string>[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  
  return (
    <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
      <p className="font-medium text-sm">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          <span className="font-medium">{entry.name}: </span>
          <span>{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;