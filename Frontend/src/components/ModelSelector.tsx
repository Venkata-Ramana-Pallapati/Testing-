import React from "react";

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

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  handleModelChange,
  modelOptions,
}) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Model</label>
    <select
      value={selectedModel}
      onChange={handleModelChange}
      className="w-full border border-gray-300 rounded-md p-2 text-sm appearance-none bg-gradient-to-r from-indigo-50 to-blue-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
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

export default ModelSelector;