import React from "react";

interface InsightCardProps {
    title: string;
    value: string;
    metric: string;
    category: string; // New Prop
    categoryData: any[]; // New Prop (adjust the type based on your data)
    colorMap: Record<string, string>; // New Prop (color mapping)
    growth: string;  // ✅ Add this line
    color: string; // ✅ Add this line
    insight: string; // Add this line
    description: string;
    chartType?: string; // Add this optional prop
    fullMark: number; // Required property

    direction: string;
    children?: React.ReactNode; // This allows child elements to be passed
    chartData?: { name: any; value: number; fullMark: number; actualValue?: string; average?: string }[]; // Add chartData prop


    
  }
  
const InsightCard: React.FC<InsightCardProps> = ({  title,
    value,
    metric,
    description, children,
    category,
    categoryData,
    colorMap, }) => {
  if (categoryData.length === 0) return null;
  
  const values = categoryData.map(d => d.yhat);
  const lastThreeValues = values.slice(-3);
  const isRising = lastThreeValues[2] > lastThreeValues[0];
  const isSteady = Math.abs(lastThreeValues[2] - lastThreeValues[0]) < 0.05 * lastThreeValues[0];
  
  let recommendation = '';
  let insight = '';
  
  if (isRising) {
    insight = `${category} shows positive growth trend.`;
    recommendation = "Consider increasing inventory and marketing investment.";
  } else if (isSteady) {
    insight = `${category} is showing stable performance.`;
    recommendation = "Maintain current strategy while monitoring for changes.";
  } else {
    insight = `${category} has a declining trend.`;
    recommendation = "Analyze causes and consider promotional activities.";
  }
  
  return (
    <div 
      className="p-3 rounded-lg border"
      style={{ borderLeft: `4px solid ${colorMap[category]}` }}
    >
      <h4 className="font-medium text-sm mb-1">{category}</h4>
      <p className="text-sm text-gray-600 mb-2">{insight}</p>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-medium text-blue-600">{recommendation}</span>
      </div>
    </div>
  );
};

export default InsightCard;