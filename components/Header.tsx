import React from 'react';
import { HistoryControls } from './HistoryControls';
import { ExportControls } from './ExportControls';
import { FlyerControls } from './FlyerControls';
import { RemoveBackgroundControl } from './RemoveBackgroundControl';
import { IconArrowLeft } from './Icons';

interface HeaderProps {
    viewMode: 'overlay' | 'flyer';
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onExport: () => void;
    isExporting: boolean;
    isImageGenerated: boolean;
    onMakeFlyer: () => void;
    onRemoveBackground?: () => void;
    isRemovingBackground?: boolean;
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    viewMode,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onExport,
    isExporting,
    isImageGenerated,
    onMakeFlyer,
    onRemoveBackground,
    isRemovingBackground,
    onBack,
}) => {
  return (
    <header className="p-4 bg-gray-900 border-b border-gray-700/50 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {viewMode === 'flyer' && onBack && (
            <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-white font-semibold text-sm">
                <IconArrowLeft className="w-4 h-4" />
                <span>Back to Overlay</span>
            </button>
        )}
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center font-bold text-white text-lg">G</div>
            <h1 className="text-xl font-bold text-white">
                {viewMode === 'overlay' ? 'DJ Overlay Generator' : 'Flyer Generator'}
            </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {viewMode === 'overlay' && (
            <>
                <FlyerControls onMakeFlyer={onMakeFlyer} isDisabled={false} isLoading={false} />
                <RemoveBackgroundControl onRemoveBackground={onRemoveBackground!} isDisabled={!isImageGenerated} isLoading={isRemovingBackground!} />
            </>
        )}
        <HistoryControls canUndo={canUndo} canRedo={canRedo} onUndo={onUndo} onRedo={onRedo} />
        <ExportControls onExport={onExport} isDisabled={!isImageGenerated} isExporting={isExporting} />
      </div>
    </header>
  );
};