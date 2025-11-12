import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AspectRatio, OverlayTransform } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { IconImage } from './Icons';

interface GeneratedImageDisplayProps {
  generatedImage: string | null;
  transform: OverlayTransform;
  isLoading: boolean;
  isInitialState: boolean;
  aspectRatio: AspectRatio;
  onTransformChange: (transform: OverlayTransform) => void;
}

const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
        case '16:9': return 'aspect-video';
        case '9:16': return 'aspect-[9/16]';
        case '4:3': return 'aspect-[4/3]';
        case '1:1': return 'aspect-square';
        default: return 'aspect-video';
    }
};

const handles = [
    { position: 'top-left', cursor: 'cursor-nwse-resize', classes: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2' },
    { position: 'top-center', cursor: 'cursor-ns-resize', classes: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { position: 'top-right', cursor: 'cursor-nesw-resize', classes: 'top-0 right-0 translate-x-1/2 -translate-y-1/2' },
    { position: 'middle-left', cursor: 'cursor-ew-resize', classes: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2' },
    { position: 'middle-right', cursor: 'cursor-ew-resize', classes: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2' },
    { position: 'bottom-left', cursor: 'cursor-nwse-resize', classes: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2' },
    { position: 'bottom-center', cursor: 'cursor-ns-resize', classes: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { position: 'bottom-right', cursor: 'cursor-nesw-resize', classes: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2' },
];

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({
  generatedImage,
  transform,
  isLoading,
  isInitialState,
  aspectRatio,
  onTransformChange,
}) => {
  const aspectRatioClass = getAspectRatioClass(aspectRatio);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [interaction, setInteraction] = useState<{
    type: 'drag' | 'resize';
    handle?: string;
    startX: number;
    startY: number;
    startTransform: OverlayTransform;
    startRect: DOMRect;
  } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, type: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    
    setInteraction({
      type,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startTransform: transform,
      startRect: rect,
    });
  }, [transform]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interaction) return;

    const { type, handle, startX, startY, startTransform, startRect } = interaction;
    e.preventDefault();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (type === 'drag') {
      onTransformChange({
        ...startTransform,
        position: {
            x: startTransform.position.x + dx,
            y: startTransform.position.y + dy,
        },
      });
      return;
    }

    if (type === 'resize' && handle) {
        let { scaleX, scaleY, position: { x, y } } = startTransform;
        
        if (handle.includes('right')) {
            const newWidth = startRect.width + dx;
            scaleX = (newWidth / startRect.width) * startTransform.scaleX;
            x = startTransform.position.x + dx / 2;
        } else if (handle.includes('left')) {
            const newWidth = startRect.width - dx;
            scaleX = (newWidth / startRect.width) * startTransform.scaleX;
            x = startTransform.position.x + dx / 2;
        }
        if (handle.includes('bottom')) {
            const newHeight = startRect.height + dy;
            scaleY = (newHeight / startRect.height) * startTransform.scaleY;
            y = startTransform.position.y + dy / 2;
        } else if (handle.includes('top')) {
            const newHeight = startRect.height - dy;
            scaleY = (newHeight / startRect.height) * startTransform.scaleY;
            y = startTransform.position.y + dy / 2;
        }
        
        onTransformChange({
            scaleX: Math.max(0.1, scaleX),
            scaleY: Math.max(0.1, scaleY),
            position: { x, y },
        });
    }
  }, [interaction, onTransformChange]);

  const handleMouseUp = useCallback(() => {
    setInteraction(null);
  }, []);
  
  useEffect(() => {
    if (interaction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className={`w-full ${aspectRatioClass} bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-300 select-none`}>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
          <LoadingSpinner />
        </div>
      )}

      {isInitialState && !isLoading && (
         <div className="text-center text-gray-500">
            <IconImage className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">Your generated overlay will appear here.</p>
            <p className="text-sm">Select a template or provide a prompt to get started.</p>
        </div>
      )}
      
      {!isInitialState && (
        <div className="absolute inset-4 sm:inset-8 bg-black/30 rounded-md flex items-center justify-center pointer-events-none z-0">
            <div className="text-center text-white/50 border-2 border-dashed border-white/50 p-4 sm:p-8 rounded-lg">
                <p className="font-bold text-base sm:text-lg">CAMERA FEED AREA</p>
                <p className="text-xs sm:text-sm">({aspectRatio})</p>
            </div>
        </div>
      )}

      {generatedImage && (
        <div
            ref={imageRef}
            className="absolute top-0 left-0 w-full h-full cursor-move z-10"
            style={{
                transform: `translate(${transform.position.x}px, ${transform.position.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
        >
            <img
                src={`data:image/png;base64,${generatedImage}`}
                alt="Generated Overlay"
                className="w-full h-full object-contain"
                draggable={false}
            />
            <div className="absolute inset-0 border-2 border-indigo-500/70 pointer-events-none">
                {handles.map(handle => (
                    <div
                        key={handle.position}
                        className={`absolute w-3 h-3 bg-indigo-500 rounded-full border-2 border-gray-900 ${handle.classes} ${handle.cursor} z-30`}
                        onMouseDown={(e) => handleMouseDown(e, 'resize', handle.position)}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
