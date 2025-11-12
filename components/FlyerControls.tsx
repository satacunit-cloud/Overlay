import React from 'react';
import { IconFileText } from './Icons';

interface FlyerControlsProps {
  onMakeFlyer: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

export const FlyerControls: React.FC<FlyerControlsProps> = ({ onMakeFlyer, isDisabled, isLoading }) => {
  return (
    <button
      onClick={onMakeFlyer}
      disabled={isDisabled || isLoading}
      className="flex items-center gap-2 px-3 py-2 rounded-md bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-sm"
      aria-label="Make matching flyer"
    >
       {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <IconFileText className="w-4 h-4" />
        )}
      Create Flyer
    </button>
  );
};