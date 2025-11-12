import React from 'react';
import { IconUser } from './Icons';

interface DjPersonalizationProps {
  djName: string;
  onDjNameChange: (name: string) => void;
}

export const DjPersonalization: React.FC<DjPersonalizationProps> = ({
  djName,
  onDjNameChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">DJ Name / Title (Optional)</h3>
        <div className="relative">
          <IconUser className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={djName}
            onChange={(e) => onDjNameChange(e.target.value)}
            placeholder="e.g., DJ Sparkle"
            className="w-full pl-10 p-3 bg-gray-900/70 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-gray-200 placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  );
};