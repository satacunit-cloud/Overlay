import React from 'react';
import type { Layer } from '../types';
import { IconEye, IconEyeOff, IconTrash } from './Icons';

interface LayerManagerProps {
  layers: Layer[];
  setLayers: (updater: (prevLayers: Layer[]) => Layer[]) => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({ layers, setLayers }) => {

  const toggleVisibility = (id: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, isVisible: !layer.isVisible } : layer
      )
    );
  };

  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
  };
  
  const moveLayerUp = (index: number) => {
    if (index === 0) return;
    setLayers(prev => {
      const newLayers = [...prev];
      [newLayers[index - 1], newLayers[index]] = [newLayers[index], newLayers[index - 1]];
      return newLayers;
    });
  };

  const moveLayerDown = (index: number) => {
    if (index === layers.length - 1) return;
    setLayers(prev => {
      const newLayers = [...prev];
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
      return newLayers;
    });
  };
  
  const handleOpacityChange = (id: string, opacity: number) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, opacity } : layer
      )
    );
  };

  return (
    <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Layers</h3>
        {layers.length === 0 ? (
            <div className="text-center text-gray-500 bg-gray-800/50 p-4 rounded-md">
                No layers generated yet.
            </div>
        ) : (
            <ul className="space-y-3">
                {layers.map((layer, index) => (
                    <li
                        key={layer.id}
                        className="p-3 rounded-md bg-gray-700/50"
                    >
                        <div className="flex items-center justify-between">
                            {/* Fix: Provide a fallback for the optional layer name. */}
                            <span className="flex-grow text-gray-200 truncate font-medium pr-4">{layer.name || layer.id}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button onClick={() => moveLayerDown(index)} disabled={index === layers.length - 1} aria-label="Move layer down" className="p-1 text-gray-400 hover:text-white disabled:opacity-50">▲</button>
                                <button onClick={() => moveLayerUp(index)} disabled={index === 0} aria-label="Move layer up" className="p-1 text-gray-400 hover:text-white disabled:opacity-50">▼</button>
                                <button onClick={() => toggleVisibility(layer.id)} aria-label={layer.isVisible ? 'Hide layer' : 'Show layer'} className="p-1 text-gray-400 hover:text-white">
                                    {layer.isVisible ? <IconEye className="w-5 h-5"/> : <IconEyeOff className="w-5 h-5"/>}
                                </button>
                                <button onClick={() => deleteLayer(layer.id)} aria-label="Delete layer" className="p-1 text-gray-400 hover:text-red-500">
                                    <IconTrash className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <label htmlFor={`opacity-${layer.id}`} className="sr-only">Opacity</label>
                          <input
                              id={`opacity-${layer.id}`}
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              // Fix: Provide a default value for opacity to prevent an uncontrolled component.
                              value={layer.opacity ?? 1}
                              onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                          {/* Fix: Provide a default value for displaying opacity percentage. */}
                          <span className="text-sm text-gray-400 w-12 text-right">{Math.round((layer.opacity ?? 1) * 100)}%</span>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
  );
};