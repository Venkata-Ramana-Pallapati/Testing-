import React from "react";
//import { DataItem }  from "/home/sigmoid/Pictures/project/src/types"; // Adjust the path accordingly


interface Trend {
  value: string;
  direction: string;
}

interface CategoryStatsProps {
  category: string;
  categoryData: any[];
  data: any[];

  colorMap: { [key: string]: string };
  color?: string; // Add this optional prop


  title: string;
  value: string | number; // Accept both numbers and strings
  icon: string;
  trend: { value: string; direction: string };
}

interface DataItem {
    name: string; // Example fields
    value: number;
    yhat?: number; // Optional property to avoid further type errors

  }
  
const CategoryStats: React.FC<CategoryStatsProps> = ({
  category,
  categoryData,
  colorMap,
}) => {
  if (categoryData.length === 0) return null;
  
  const firstValue = categoryData[0]?.yhat || 0;
  const lastValue = categoryData[categoryData.length - 1]?.yhat || 0;
  const growthPercent = firstValue > 0 
    ? ((lastValue - firstValue) / firstValue * 100).toFixed(1)
    : "N/A";
  
  const isPositive = parseFloat(growthPercent) > 0;
  const growthColor = isPositive ? '#4CAF50' : '#F44336';
  
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-md"
      style={{ borderLeft: `4px solid ${colorMap[category]}` }}
    >
      <h4 className="font-medium text-sm mb-2">{category}</h4>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-500">Growth:</span>
        <span className="font-bold text-sm" style={{ color: growthColor }}>
          {growthPercent !== "N/A" ? `${growthPercent}%` : "N/A"}
          {isPositive && growthPercent !== "N/A" ? ' ↑' : growthPercent !== "N/A" ? ' ↓' : ''}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="h-2 rounded-full" 
          style={{ 
            width: `${Math.min(100, Math.max(0, parseFloat(growthPercent) + 100) / 2)}%`,
            backgroundColor: colorMap[category]
          }}>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-500">Initial:</span>
          <div className="font-medium">{firstValue.toFixed(1)}</div>
        </div>
        <div>
          <span className="text-gray-500">Final:</span>
          <div className="font-medium">{lastValue.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;