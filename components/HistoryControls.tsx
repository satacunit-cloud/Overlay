import React from 'react';
import { IconUndo, IconRedo } from './Icons';

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({ canUndo, canRedo, onUndo, onRedo }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Undo"
      >
        <IconUndo className="w-5 h-5 text-gray-300" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Redo"
      >
        <IconRedo className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  );
};
