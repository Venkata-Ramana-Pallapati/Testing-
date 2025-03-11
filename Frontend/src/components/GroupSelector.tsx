import React, { useState } from "react";

interface GroupSelectorProps {
    groupName: string; // Make sure this is included

  groupColumn: string;
  groupValues: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  groupColumn,
  groupValues,
  selectedValues,
  groupName,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  
  const handleValueToggle = (value: string) => {
    let newValues;
    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter(v => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    onChange(newValues);
  };
  
  const removeValue = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== value));
  };

  return (
    <div className="w-full relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{groupColumn}</label>
      <div 
        className="w-full border border-gray-300 rounded-md p-2 min-h-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer flex flex-wrap items-center"
        onClick={toggleOpen}
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-500">Select {groupColumn}...</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedValues.map(value => (
              <span 
                key={value} 
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md flex items-center"
              >
                {value}
                <button 
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={(e) => removeValue(value, e)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-1 border-b border-gray-200">
            <div 
              className="cursor-pointer py-1 px-2 hover:bg-blue-50 text-sm rounded"
              onClick={() => { onChange([]); setIsOpen(false); }}
            >
              Clear all
            </div>
          </div>
          {groupValues.map(value => (
            <div 
              key={value} 
              className="cursor-pointer py-1 px-2 hover:bg-blue-50 text-sm"
              onClick={() => handleValueToggle(value)}
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedValues.includes(value)}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupSelector;