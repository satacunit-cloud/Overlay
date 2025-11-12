import React from 'react';
import type { AspectRatio } from '../types';
import {
  IconAspectRatio16x9,
  IconAspectRatio9x16,
  IconAspectRatio4x3,
  IconAspectRatio1x1,
} from './Icons';

interface AspectRatioControlsProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
}

const ratios: { value: AspectRatio; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { value: '16:9', label: 'Landscape', icon: IconAspectRatio16x9 },
  { value: '9:16', label: 'Portrait', icon: IconAspectRatio9x16 },
  { value: '4:3', label: 'Classic', icon: IconAspectRatio4x3 },
  { value: '1:1', label: 'Square', icon: IconAspectRatio1x1 },
];

export const AspectRatioControls: React.FC<AspectRatioControlsProps> = ({ selectedRatio, onRatioChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-300 mb-3">Design Settings</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ratios.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => onRatioChange(value)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
              selectedRatio === value
                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                : 'bg-gray-700/50 border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-200'
            }`}
            aria-pressed={selectedRatio === value}
          >
            <Icon className="w-7 h-7 mb-1" />
            <span className="text-xs font-medium">{value}</span>
            <span className="text-xs text-gray-500">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};