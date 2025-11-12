import React, { useState } from 'react';
import { Header } from '../components/Header';
import { GeneratedImageDisplay } from '../components/GeneratedImageDisplay';
import { RefinementControls } from '../components/RefinementControls';
import { AspectRatioControls } from '../components/AspectRatioControls';
import { DjPersonalization } from '../components/DjPersonalization';
import { useHistory } from '../hooks/useHistory';
import { generateFlyer } from '../services/geminiService';
import type { AspectRatio, OverlayTransform, AppState } from '../types';
import html2canvas from 'html2canvas';

interface FlyerPageProps {
  initialDjName: string;
  initialPrompt: string;
  initialStyleKeywords: string[];
  onBack: () => void;
}

const INITIAL_TRANSFORM: OverlayTransform = {
  scaleX: 1,
  scaleY: 1,
  position: { x: 0, y: 0 },
};

const INITIAL_STATE: AppState = {
    generatedImage: null,
    transform: INITIAL_TRANSFORM
};

export const FlyerPage: React.FC<FlyerPageProps> = ({
  initialDjName,
  initialPrompt,
  initialStyleKeywords,
  onBack,
}) => {
    const { state, set, undo, redo, canUndo, canRedo } = useHistory<AppState>(INITIAL_STATE);
    const [prompt, setPrompt] = useState<string>(initialPrompt);
    const [djName, setDjName] = useState<string>(initialDjName);
    const [styleKeywords, setStyleKeywords] = useState<string[]>(initialStyleKeywords);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);

    const handleGenerateFlyer = async () => {
        setIsLoading(true);
        try {
            const fullPrompt = `Create a promotional event flyer with a full background.
            CRITICAL REQUIREMENTS:
            - Aspect Ratio: ${aspectRatio === '16:9' ? '16:9 landscape' : '9:16 portrait'}.
            - The design MUST have a full, complete background and feel like a professional event poster.
            
            CREATIVE DIRECTION:
            - Main theme: "${prompt}".
            - Style keywords: ${styleKeywords.join(', ')}.
            - Prominently feature the DJ Name: "${djName}".
            - The design should be artistic and visually balanced, leaving some space for other text to be added later.
            - Do NOT add any other placeholder text like dates, venues, or event names.`;

            const image = await generateFlyer(fullPrompt);
            set({ generatedImage: image, transform: INITIAL_TRANSFORM });

        } catch (error) {
            console.error("Flyer generation failed:", error);
            alert("Sorry, there was an error generating the flyer. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleTransformChange = (transform: OverlayTransform) => {
        set(prev => ({ ...prev, transform }));
    };

    const handleExport = () => {
        setIsExporting(true);
        const displayElement = document.querySelector<HTMLElement>('.w-full.relative.overflow-hidden .absolute.top-0.left-0');
        if (displayElement) {
            html2canvas(displayElement, {
                backgroundColor: '#111827', // Use a dark background for flyers
                logging: false,
                useCORS: true,
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'dj-flyer.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(err => {
                console.error("Export failed:", err);
                alert("Could not export the image.");
            }).finally(() => {
                setIsExporting(false);
            });
        } else {
             alert("Could not find the element to export.");
             setIsExporting(false);
        }
    };

    return (
        <div className="bg-gray-800 text-gray-200 min-h-screen font-sans">
            <Header 
                viewMode="flyer"
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onExport={handleExport}
                isExporting={isExporting}
                isImageGenerated={!!state.generatedImage}
                onMakeFlyer={() => {}} // No-op
                onBack={onBack}
            />
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <GeneratedImageDisplay
                        generatedImage={state.generatedImage}
                        transform={state.transform}
                        isLoading={isLoading}
                        isInitialState={!state.generatedImage}
                        aspectRatio={aspectRatio}
                        onTransformChange={handleTransformChange}
                    />
                </div>
                <aside className="lg:col-span-1 bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 space-y-8 h-fit sticky top-24">
                    <h2 className="text-xl font-bold text-white -mb-4">Flyer Controls</h2>
                    <AspectRatioControls selectedRatio={aspectRatio} onRatioChange={setAspectRatio} />
                    <DjPersonalization djName={djName} onDjNameChange={setDjName} />
                    <RefinementControls
                        prompt={prompt}
                        setPrompt={setPrompt}
                        styleKeywords={styleKeywords}
                        setStyleKeywords={setStyleKeywords}
                        onGenerate={handleGenerateFlyer}
                        isLoading={isLoading}
                        hasGenerated={!!state.generatedImage}
                    />
                </aside>
            </main>
        </div>
    );
};