import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

// --- Types ---

interface FileUploadSectionProps {
  file: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


interface DateRangeSectionProps {
  startDate: string;
  endDate: string;
  handleStartDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


interface ModelOption {
  value: string;
  label: string;
  description: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  handleModelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  modelOptions: ModelOption[];
}

interface CategoryStatsProps {
  category: string;
  categoryData: any[]; // Replace `any` with a specific type if available.
  colorMap: { [key: string]: string };
}

interface InsightCardProps {
  category: string;
  categoryData: any[]; // Replace `any` with a specific type if available.
  colorMap: { [key: string]: string };
}

interface DataItem {
  [key: string]: any;
  ds: string;
  value: number | undefined;
  yhat?: number | string;
  yhat_lower?: number | string;
  yhat_upper?: number | string;
  Category?: string;
  ProductName?: string;
}


interface FetchButtonProps {
  fetchPredictions: () => Promise<void>; // or () => void if it's synchronous
  loading: boolean;
  file: File | null;
}

interface ResultItem {
  ds: string;
  yhat: number;
  yhat_lower?: number;
  yhat_upper?: number;
  Category: string;
  ProductName: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Payload<number, string>[];
  label?: string;
}

// --- Sub-components ---
const FileUploadSection: React.FC<FileUploadSectionProps> = ({ file, handleFileChange }) => (
  <div className="md:col-span-4 text-center">
    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Product Data</label>
    <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <span className="text-sm text-gray-500 mb-2">CSV file with time series data</span>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="hidden" 
        id="file-upload" 
        accept=".csv"
      />
      <label htmlFor="file-upload" className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-medium cursor-pointer">
        Select File
      </label>
      {file && <p className="mt-2 text-xs text-gray-500">{file.name}</p>}
    </div>
  </div>
);


const DateRangeSection: React.FC<DateRangeSectionProps> = ({
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
}) => (  <div className="md:col-span-4 grid grid-cols-2 gap-3">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />
    </div>
  </div>
);

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  handleModelChange,
  modelOptions,
}) => (  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Model</label>
    <select
      value={selectedModel}
      onChange={handleModelChange}
      className="w-full border border-gray-300 rounded-md p-2 text-sm appearance-none bg-gradient-to-r from-green-50 to-blue-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
      style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", backgroundSize: "8px 10px" }}
    >
      {modelOptions.map(model => (
        <option key={model.value} value={model.value}>
          {model.label}
        </option>
      ))}
    </select>
  </div>
);

const FetchButton: React.FC<FetchButtonProps> = ({ fetchPredictions, loading, file }) => (
  <div className="md:col-span-2">
    <button 
      onClick={fetchPredictions} 
      disabled={loading || !file}
      className="w-full py-2 rounded-md font-medium text-white text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      style={{ 
        background: !loading ? "linear-gradient(to right, #4CAF50, #2196F3)" : "#ccc",
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <span>Generate Forecast</span>
      )}
    </button>
  </div>
);

const CategoryStats: React.FC<CategoryStatsProps> = ({
  category,
  categoryData,
  colorMap,
}) => {  if (categoryData.length === 0) return null;
  
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

const InsightCard: React.FC<InsightCardProps> = ({ category, categoryData, colorMap }) => {
  if (categoryData.length === 0) return null;
  
  // Calculate trends
  const values = categoryData.map(d => d.yhat);
  const lastThreeValues = values.slice(-3);
  const isRising = lastThreeValues[2] > lastThreeValues[0];
  const isSteady = Math.abs(lastThreeValues[2] - lastThreeValues[0]) < 0.05 * lastThreeValues[0];
  
  // Generate insights based on pattern
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

// --- Main Component ---
const TimeseriesPredictionChart: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupingColumns, setGroupingColumns] = useState<string[]>([]);
  const [metricColumns, setMetricColumns] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("Prophet");
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  
  // Model options with their display information
  const modelOptions = [
    { value: "Prophet", label: "Prophet", description: "Facebook's time series forecasting model" },
    { value: "XGBoost", label: "XGBoost", description: "Gradient boosting optimized for speed and performance" },
    { value: "ARIMA", label: "ARIMA", description: "Statistical method for time series forecasting" }
  ];

  // Set default dates on first load
  useEffect(() => {
    const currentDate = new Date();
    
    // Set end date to 30 days from now
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 30);
    
    // Set start date to today
    setStartDate(currentDate.toISOString().split('T')[0]);
    setEndDate(futureDate.toISOString().split('T')[0]);
  }, []);

  // Enhanced color palette for better visualization
  const generateColorMap = (categories: string[]) => {
    const predefinedColors = [
      "#1E88E5", "#D81B60", "#8E24AA", "#43A047", 
      "#FB8C00", "#E53935", "#5E35B1", "#3949AB",
      "#039BE5", "#00ACC1", "#00897B", "#7CB342",
      "#FFD600", "#6D4C41", "#546E7A", "#F06292"
    ];
    
    const colorMap: { [key: string]: string } = {};

    categories.forEach((category, index) => {
      colorMap[category] = predefinedColors[index % predefinedColors.length];
    });
    
    return colorMap;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMetric(event.target.value);
  };
  
  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const fetchPredictions = async () => {
    if (!file || !startDate || !endDate) return;

    setLoading(true);
    setLastFetch(new Date());
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("model_name", selectedModel);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!result.error) {
        analyzeDataStructure(result);
        const processedData = preprocessData(result);
        setData(processedData);
        
        // Set default selected metric
        const metrics = getUniqueMetrics(processedData);
        if (metrics.length > 0 && typeof metrics[0] === 'string') {
          setSelectedMetric(metrics[0]);
        }
        
      } else {
        console.error("Error:", result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
      alert("Failed to fetch predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Preprocess data to ensure consistent structure
  const preprocessData = (rawData: DataItem[]) => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData.map(item => {
      // Standardize date format
      const dateObj = new Date(item.ds);
      const formattedDate = dateObj.toISOString().split('T')[0];
      
      // Ensure all number values are properly converted
      const processedItem = { ...item, ds: formattedDate };
      
      // Convert prediction values to numbers
      if (typeof item.yhat === 'string') {
        processedItem.yhat = parseFloat(item.yhat);
      }
      
      // Handle upper and lower bounds if present
      if (item.yhat_lower) {
        processedItem.yhat_lower = typeof item.yhat_lower === 'string' 
          ? parseFloat(item.yhat_lower) 
          : item.yhat_lower;
      }
      
      if (item.yhat_upper) {
        processedItem.yhat_upper = typeof item.yhat_upper === 'string' 
          ? parseFloat(item.yhat_upper) 
          : item.yhat_upper;
      }
      
      return processedItem;
    });
  };

  // Data structure analysis
  const analyzeDataStructure = (data: DataItem[]) => {
    if (!data || data.length === 0) return;
    
    const firstItem = data[0];
    const columns = Object.keys(firstItem);
    
    // Find grouping columns
    const potentialGroupingColumns = columns.filter(col => {
      // Access the sample value
      const sample = firstItem[col];
    
      // Ensure that sample is treated as a string for the tests
      if (typeof sample === 'string') {
        const isNotNumeric = !/^\d+(\.\d+)?$/.test(sample);
        const isNotDate = !/^\d{4}-\d{2}-\d{2}/.test(sample) && col !== 'ds';
        const isExplicitGroup = /^(group|category|segment|product|line|division)/i.test(col);
        
        return (Array.isArray(sample) || (isNotNumeric && isNotDate) || isExplicitGroup);
      }
    
      return false; // For non-string values
    });
    
    // Find metric columns
    const potentialMetricColumns = columns.filter(col => {
      return /^(metric|measure|indicator|type|kpi)/i.test(col);
    });
    
    setGroupingColumns(potentialGroupingColumns);
    setMetricColumns(potentialMetricColumns.length > 0 ? potentialMetricColumns : ['default']);
  };

  // Get unique metrics from the data
  const getUniqueMetrics = (dataSet = data) => {
    if (dataSet.length === 0) return [];
    
    // If we have explicit metric columns
    if (metricColumns.length > 0 && metricColumns[0] !== 'default') {
      const metricCol = metricColumns[0] as keyof DataItem;
      return Array.from(new Set(dataSet.map(item => item[metricCol])));
    }
    
    // If no explicit metrics, return product-focused names
    return ['Product Growth Forecast'];
  };

  // Get unique categories from grouping columns
  const getCategories = (metricName: string, dataSet: DataItem[] = data) => {
    if (dataSet.length === 0) return [];
    
    // Filter data by metric if applicable
    const filteredData = metricColumns[0] !== 'default'
      ? dataSet.filter(item => item[metricColumns[0] as keyof DataItem] === metricName)
      : dataSet;

    // Enhanced grouping logic
    if (groupingColumns.length > 0) {
      const groupCol = groupingColumns[0];
      
      // Handle array-type grouping
      if (filteredData.length > 0 && Array.isArray(filteredData[0][groupCol as keyof DataItem])) {
        const uniqueCategories = new Set();
        
        // Extract all unique category names
        filteredData.forEach(item => {
          const groupArray = item[groupCol as keyof DataItem];
          if (Array.isArray(groupArray)) {
            groupArray.forEach(value => {
              if (value) uniqueCategories.add(value.toString());
            });
          }
        });
        
        return Array.from(uniqueCategories) as string[];
      } 
      // Handle string-type grouping
      else {
        const categories = Array.from(
          new Set(
            filteredData.map(item => item[groupCol as keyof DataItem])
          )
        );
        // Sort categories for consistent display
        return categories.sort() as string[];
      }
    }
    
    // Default product-focused category
    return ['Product Trend'];
  };

  // Enhanced data retrieval for specific metric and category
  const getDataForMetricAndCategory = (metricName: string, category: string): ResultItem[] => {
    if (data.length === 0) return [];
    
    // Filter by metric if applicable
    const filteredByMetric = metricColumns[0] !== 'default'
      ? data.filter(item => item[metricColumns[0] as keyof DataItem] === metricName)
      : data;
    
    let result: ResultItem[] = [];
    
    // If we have grouping columns
    if (groupingColumns.length > 0) {
      const groupCol = groupingColumns[0];
      
      // Handle array-type grouping
      if (filteredByMetric.length > 0 && Array.isArray(filteredByMetric[0][groupCol as keyof DataItem])) {
        result = filteredByMetric
          .filter(item => {
            const groupColValue = item[groupCol as keyof DataItem];
            return Array.isArray(groupColValue) && groupColValue.includes(category);
          })
          .map(item => ({
            ds: item.ds,
            yhat: typeof item.yhat === 'number' ? item.yhat : parseFloat(String(item.yhat)) || 0,
            yhat_lower: item.yhat_lower
              ? typeof item.yhat_lower === 'number'
                ? item.yhat_lower
                : parseFloat(String(item.yhat_lower))
              : undefined,
            yhat_upper: item.yhat_upper
              ? typeof item.yhat_upper === 'number'
                ? item.yhat_upper
                : parseFloat(String(item.yhat_upper))
              : undefined,
            Category: category,
            ProductName: category,
            value: typeof item.yhat === 'number' ? item.yhat : parseFloat(String(item.yhat)) || 0
          }));
      } 
      // Handle string-type grouping
      else {
        result = filteredByMetric
          .filter(item => item[groupCol as keyof DataItem] === category)
          .map(item => ({
            ds: item.ds,
            yhat: typeof item.yhat === 'number' ? item.yhat : parseFloat(String(item.yhat)) || 0,
            yhat_lower: item.yhat_lower
              ? typeof item.yhat_lower === 'number'
                ? item.yhat_lower
                : parseFloat(String(item.yhat_lower))
              : undefined,
            yhat_upper: item.yhat_upper
              ? typeof item.yhat_upper === 'number'
                ? item.yhat_upper
                : parseFloat(String(item.yhat_upper))
              : undefined,
            Category: category,
            ProductName: category,
            value: typeof item.yhat === 'number' ? item.yhat : parseFloat(String(item.yhat)) || 0
          }));
      }
    } 
    // Default case - all data in one category
    else if (category === 'Product Trend') {
      result = filteredByMetric.map(item => ({
        ds: item.ds,
        yhat: typeof item.yhat === 'number' ? item.yhat : parseFloat(String(item.yhat)) || 0,
        yhat_lower: item.yhat_lower
          ? typeof item.yhat_lower === 'number'
            ? item.yhat_lower
            : parseFloat(String(item.yhat_lower))
          : undefined,
        yhat_upper: item.yhat_upper
          ? typeof item.yhat_upper === 'number'
            ? item.yhat_upper
            : parseFloat(String(item.yhat_upper))
          : undefined,
        Category: 'Product Trend',
        ProductName: 'Overall Trend',
        value: typeof item.yhat === 'number' ? item.yhat : parseFloat(String(item.yhat)) || 0
      }));
    }
    
    // Sort by date for smooth line rendering
    return result.sort((a, b) => new Date(a.ds).getTime() - new Date(b.ds).getTime());
  };

  const uniqueMetrics = getUniqueMetrics();
  const selectedMetricForDisplay = selectedMetric || (uniqueMetrics.length > 0 ? uniqueMetrics[0] : '');
  const categories = getCategories(typeof selectedMetricForDisplay === 'string' ? selectedMetricForDisplay : 'default');
  const colorMap = generateColorMap(categories);

  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: "#e8f5e9" }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Product Growth Forecast</h2>
      
      <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* File upload section */}
          <FileUploadSection file={file} handleFileChange={handleFileChange} />
          
          {/* Date range section */}
          <DateRangeSection 
            startDate={startDate} 
            endDate={endDate} 
            handleStartDateChange={handleStartDateChange} 
            handleEndDateChange={handleEndDateChange} 
          />
          
          {/* Model selector */}
          <ModelSelector 
            selectedModel={selectedModel} 
            handleModelChange={handleModelChange} 
            modelOptions={modelOptions} 
          />
          
          {/* Fetch button */}
          <FetchButton 
            fetchPredictions={fetchPredictions} 
            loading={loading} 
            file={file} 
          />
        </div>
        
        {/* Model info display */}
        {selectedModel && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Using {selectedModel}: {modelOptions.find(m => m.value === selectedModel)?.description}
          </div>
        )}
      </div>
      
      {/* Last fetch notification */}
      {lastFetch && !loading && (
        <div className="text-sm text-gray-500 mb-4 text-center">
          Last forecast generated: {lastFetch.toLocaleTimeString()}
        </div>
      )}

      {data.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main chart section */}
            <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                {selectedMetricForDisplay !== 'default' ? selectedMetricForDisplay : 'Product Growth Forecast'}
              </h3>
              
              {/* Legend display at the top */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {categories.map(category => (
                  <div key={category} className="flex items-center bg-gray-50 px-3 py-1 rounded-full shadow-sm border">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: colorMap[category] }}
                    />
                    <span className="text-xs font-medium">{category}</span>
                  </div>
                ))}
              </div>
              
              {/* Chart */}
              <ResponsiveContainer width="100%" height={400}>
                <LineChart margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="ds" 
                    tick={{ fontSize: 12 }} 
                    stroke="#666"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  
                  {categories.map((category) => (
                    <Line
                      key={category}
                      type="monotone"
                      data={getDataForMetricAndCategory(selectedMetricForDisplay, category)}
                      dataKey="yhat"
                      stroke={colorMap[category]}
                      strokeWidth={2}
                      name={category}
                      dot={{ r: 4, strokeWidth: 1 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      isAnimationActive={true}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Right sidebar with metric selector and stats */}
            <div className="md:col-span-1 space-y-4">
              {/* Metric selector if multiple metrics are available */}
              {uniqueMetrics.length > 1 && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric</label>
                  <select
                   value={selectedMetric}
                   onChange={handleMetricChange}
                   className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                 >
                   {uniqueMetrics.map(metric => (
                     <option key={metric} value={metric}>
                       {metric}
                     </option>
                   ))}
                 </select>
               </div>
             )}
             
             {/* Category statistics cards */}
             <div className="bg-white p-4 rounded-lg shadow-md">
               <h4 className="font-semibold text-sm mb-3 text-gray-700">Category Performance</h4>
               <div className="space-y-3">
                 {categories.map(category => (
                   <CategoryStats 
                     key={category}
                     category={category}
                     categoryData={getDataForMetricAndCategory(selectedMetricForDisplay, category)}
                     colorMap={colorMap}
                   />
                 ))}
               </div>
             </div>
           </div>
         </div>
         
         {/* Insights section */}
         <div className="bg-white p-4 rounded-lg shadow-md">
           <h3 className="text-lg font-semibold mb-4 text-gray-800">Insights & Recommendations</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             {categories.map(category => (
               <InsightCard 
                 key={category}
                 category={category}
                 categoryData={getDataForMetricAndCategory(selectedMetricForDisplay, category)}
                 colorMap={colorMap}
               />
             ))}
           </div>
         </div>
       </div>
     )}
     
     {/* Empty state */}
     {data.length === 0 && !loading && (
       <div className="bg-white p-8 rounded-lg shadow-md text-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
         </svg>
         <h3 className="text-lg font-medium text-gray-900 mb-2">No Forecast Data Yet</h3>
         <p className="text-gray-500 mb-4">Upload a CSV file with time series data and configure your forecast parameters to get started.</p>
       </div>
     )}
   </div>
 );
};

// Custom Tooltip Component
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
 if (!active || !payload || payload.length === 0) {
   return null;
 }

 // Format the date for display
 const formattedDate = new Date(label as string).toLocaleDateString('en-US', {
   weekday: 'short',
   year: 'numeric',
   month: 'short',
   day: 'numeric'
 });

 return (
   <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
     <p className="font-medium text-sm text-gray-700 mb-2">{formattedDate}</p>
     {payload.map((entry, index) => (
       <div key={`item-${index}`} className="flex items-center mb-1">
         <div
           className="w-3 h-3 rounded-full mr-2"
           style={{ backgroundColor: entry.stroke }}
         />
         <span className="text-sm text-gray-700">
           {entry.name}:<span className="font-semibold">{(Number(entry.value) || 0).toFixed(1)}</span>

         </span>
       </div>
     ))}
   </div>
 );
};

export default TimeseriesPredictionChart;