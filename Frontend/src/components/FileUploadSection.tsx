import React from "react";

interface FileUploadSectionProps {
  file: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ file, handleFileChange }) => (
  <div className="md:col-span-4 text-center">
    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Product Data</label>
    <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-all duration-300 hover:shadow-lg bg-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <span className="text-sm text-gray-500 mb-3">CSV file with time series data</span>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="hidden" 
        id="file-upload" 
        accept=".csv"
      />
      <label htmlFor="file-upload" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:shadow-md">
        Select File
      </label>
      {file && <p className="mt-2 text-xs text-gray-500">{file.name}</p>}
    </div>
  </div>
);

export default FileUploadSection;