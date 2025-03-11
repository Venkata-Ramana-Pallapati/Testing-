import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Login } from './components/Login';
import DataAnalysisDashboard from './components/DataAnalysisDashboard';

const MultiGroupLineChart = ({ data, groupColumns, metricColumn, categories, colorMap, CustomTooltip }) => {
  const uniqueDates = Array.from(new Set(data.map(d => d.ds)));
  const transformedData = uniqueDates.map(date => {
    let obj: { [key: string]: any } = { ds: date };
    groupColumns.forEach(group => {
      const matchingRow = data.find(d => d.ds === date && d[group] !== undefined);
      if (matchingRow) {
        obj[group.toString()] = matchingRow[metricColumn];
      }
    });
    return obj;
  });

  if (!transformedData || transformedData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={transformedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="ds"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {categories.map((category) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category.toString()}
              name={category}
              stroke={colorMap[category.toString()] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const App = ({ data, groupColumns, metricColumn, categories, colorMap, CustomTooltip }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        <DataAnalysisDashboard />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
};

export default App;
