import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CaseInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg">
      <div
        className="flex items-center justify-between p-[0.5rem] cursor-pointer"
        onClick={() => setShowInstructions(!showInstructions)}
      >
        <h4 className="text-sm font-semibold text-blue-900">Table Features:</h4>
        {showInstructions ? (
          <ChevronUp className="w-5 h-5 text-blue-700" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-700" />
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showInstructions ? 'max-h-96 opacity-100 p-4 pt-0' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click any cell to edit inline (except Case Number)</li>
          <li>• Right-click for context menu with additional options</li>
          <li>• Use column headers to sort and filter data</li>
          <li>• Drag column borders to resize</li>
          <li>• Select multiple rows and use "Delete Selected" button</li>
          <li>• Case numbers are automatically generated</li>
        </ul>
      </div>
    </div>
  );
}