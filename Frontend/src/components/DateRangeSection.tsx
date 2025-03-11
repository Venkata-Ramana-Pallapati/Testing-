import React from "react";

interface DateRangeSectionProps {
  startDate: string;
  endDate: string;
  handleStartDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateRangeSection: React.FC<DateRangeSectionProps> = ({
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
}) => (
  <div className="md:col-span-4 grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
      />
    </div>
  </div>
);

export default DateRangeSection;