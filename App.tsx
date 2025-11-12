import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { RefinementControls } from './components/RefinementControls';
import { DjPersonalization } from './components/DjPersonalization';
import { AspectRatioControls } from './components/AspectRatioControls';
import { TemplateSelector } from './components/TemplateSelector';
import { LayerManager } from './components/LayerManager';
import { FlyerPage } from './pages/FlyerPage';
import { useHistory } from './hooks/useHistory';
import { generateDjOverlay, removeImageBackground } from './services/geminiService';
import { generateId } from './utils/generateId';
import type { AspectRatio, OverlayTransform, Template, Layer } from './types';
import html2canvas from 'html2canvas';

const templates: Template[] = [
    { id: 't1', name: 'Neon Night', prompt: 'a vibrant neon sign for a DJ booth, glowing lines, dark background, futuristic font', styleKeywords: ['neon', 'futuristic'] },
    { id: 't2', name: 'Minimalist Groove', prompt: 'a clean, minimalist DJ logo, simple geometric shapes, monochrome, modern typography', styleKeywords: ['minimalist'] },
    { id: 't3', name: 'Retro Funk', prompt: 'a 70s inspired DJ graphic, retro color palette (orange, brown, yellow), funky bold font, vinyl record motif', styleKeywords: ['retro'] },
    { id: 't4', name: 'Tribal Beats', prompt: 'a DJ overlay with tribal patterns, earthy tones, bold and raw aesthetic, inspired by african art', styleKeywords: ['tribal'] },
    { id: 't5', name: 'Cyber Stream', prompt: 'a cyberpunk themed overlay, glitch effects, neon pink and blue, digital artifacts, tech-wear inspired font', styleKeywords: ['cyberpunk'] },
    { id: 't6', name: 'Hip Hop Vibe', prompt: 'a gritty, urban DJ overlay with graffiti elements, brick wall textures, and high-contrast lighting', styleKeywords: ['hiphop', 'urban', 'street'] },
    { id: 't7', name: 'Smooth R&B', prompt: 'an elegant and sensual DJ overlay with soft, warm lighting, silk or velvet textures, and a classy cursive font', styleKeywords: ['r&b', 'smooth', 'elegant'] },
    { id: 't8', name: 'Rock On', prompt: 'a raw, energetic rock music overlay with distorted textures, metallic elements, lightning bolts, and a bold, aggressive font', styleKeywords: ['rock', 'metal', 'grunge'] },
    { id: 't9', name: 'Glitch Hop', prompt: 'a chaotic digital glitch art overlay, with distorted pixels, VHS effects, and a fragmented, futuristic aesthetic', styleKeywords: ['glitch', 'digital', 'abstract'] },
    { id: 't10', name: 'Lofi Chill', prompt: 'a cozy and relaxing lofi inspired overlay, with pastel colors, soft animated rain or steam, and a cute, friendly font', styleKeywords: ['lofi', 'chill', 'cozy'] },
    { id: 't11', name: 'Cosmic', prompt: 'a futuristic, deep space themed overlay, with nebulas, stars, planets, and a high-tech holographic interface feel', styleKeywords: ['space', 'cosmic', 'futuristic'] },
    { id: 't12', name: "Old School '88", prompt: "an 80s old school hip hop block party aesthetic, boombox, graffiti art, vibrant neon colors on a black background, retro geometric patterns", styleKeywords: ['retro', 'hiphop', '80s'] },
    { id: 't13', name: 'Horror Fest', prompt: 'a horror movie themed overlay, dripping blood effect, scratched film texture, dark and moody with crimson red highlights, creepy font', styleKeywords: ['horror', 'dark', 'grunge'] },
    { id: 't14', name: 'Comedy Club', prompt: 'a funny, cartoon-style DJ overlay, bright primary colors, comic book "pow" graphics, goofy and playful font', styleKeywords: ['funny', 'cartoon', 'playful'] },
    { id: 't15', name: 'Birthday Bash', prompt: 'a birthday party celebration overlay, balloons, confetti, streamers, vibrant and celebratory colors, fun and festive font', styleKeywords: ['birthday', 'party', 'celebration'] },
    { id: 't16', name: 'Halloween Haunt', prompt: 'a spooky Halloween themed DJ overlay, with jack-o-lanterns, spider webs, eerie purple and orange glow, gothic font', styleKeywords: ['halloween', 'spooky', 'horror'] },
    { id: 't17', name: 'Winter Wonderland', prompt: 'a Christmas and winter holiday themed overlay, snowflakes, sparkling lights, festive red and green with gold accents, elegant script font', styleKeywords: ['christmas', 'winter', 'holiday'] },
    { id: 't18', name: "New Year's Countdown", prompt: "a New Year's Eve party overlay, exploding fireworks, champagne glasses, clock counting down to midnight, glamorous gold and silver theme", styleKeywords: ['new year', 'party', 'glam'] },
    { id: 't19', name: 'Hyper Realistic', prompt: 'a hyper-realistic, photorealistic DJ overlay, with chrome and brushed metal textures, realistic lighting and shadows, 3D elements, high-end professional studio look', styleKeywords: ['realistic', 'photorealistic', '3d', 'metal'] },
];

const INITIAL_TRANSFORM: OverlayTransform = {
  scaleX: 1,
  scaleY: 1,
  position: { x: 0, y: 0 },
};

const App: React.FC = () => {
    const [viewMode, setViewMode] = useState<'overlay' | 'flyer'>('overlay');

    // Overlay State
    const { state: layers, set: setLayers, undo, redo, canUndo, canRedo } = useHistory<Layer[]>([]);
    const [prompt, setPrompt] = useState<string>('');
    const [djName, setDjName] = useState<string>('');
    const [styleKeywords, setStyleKeywords] = useState<string[]>([]);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
    
    const activeLayer = useMemo(() => layers.find(l => l.isVisible), [layers]);

    const handleSelectTemplate = (template: Template) => {
        setPrompt(template.prompt);
        setStyleKeywords(template.styleKeywords);
    };

    const handleGenerateOverlay = async () => {
        setIsLoading(true);
        try {
            const fullPrompt = `Create a DJ overlay graphic.
            CRITICAL INSTRUCTION: The final image MUST be a border/frame ONLY. The entire central area MUST be 100% transparent. Do NOT put any colors, gradients, or patterns in the middle.
            Main theme: "${prompt}".
            Style keywords: ${styleKeywords.join(', ')}.
            ${djName ? `Include the text "${djName}".` : ''}
            The overlay should have a transparent background so it can be placed over a video feed.
            Generate only the graphic elements, no background.
            The image should be high resolution.`;

            const image = await generateDjOverlay(fullPrompt);
            const newLayer: Layer = {
                id: generateId(),
                name: prompt.substring(0, 20) || `Layer ${layers.length + 1}`,
                isVisible: true,
                opacity: 1,
                generatedImage: image,
                transform: INITIAL_TRANSFORM,
            };

            setLayers(prev => [...prev.map(l => ({...l, isVisible: false})), newLayer]);

        } catch (error) {
            console.error("Generation failed:", error);
            alert("Sorry, there was an error generating the overlay. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleTransformChange = (transform: OverlayTransform) => {
        setLayers(prev => {
            if (prev.length === 0) return prev;
            const newLayers = [...prev];
            const activeLayerIndex = newLayers.findIndex(l => l.isVisible);
            if (activeLayerIndex > -1) {
                 const updatedLayer = { ...newLayers[activeLayerIndex], transform };
                 newLayers[activeLayerIndex] = updatedLayer;
            }
            return newLayers;
        });
    };

    const handleRemoveBackground = async () => {
         if (!activeLayer || !activeLayer.generatedImage) {
            alert("Please select a layer with an image.");
            return;
        }
        setIsRemovingBg(true);
        try {
            const imageWithoutBg = await removeImageBackground(activeLayer.generatedImage);
            setLayers(prev => {
                const newLayers = [...prev];
                const activeLayerIndex = newLayers.findIndex(l => l.isVisible);
                if (activeLayerIndex > -1) {
                     const updatedLayer = { ...newLayers[activeLayerIndex], generatedImage: imageWithoutBg };
                     newLayers[activeLayerIndex] = updatedLayer;
                }
                return newLayers;
            });
        } catch (error) {
             console.error("Background removal failed:", error);
             alert("Sorry, there was an error removing the background.");
        } finally {
            setIsRemovingBg(false);
        }
    };

    const handleExport = () => {
        setIsExporting(true);
        const displayElement = document.querySelector<HTMLElement>('.w-full.relative.overflow-hidden .absolute.top-0.left-0');
        if (displayElement) {
            html2canvas(displayElement, {
                backgroundColor: null, 
                logging: false,
                useCORS: true,
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'dj-overlay.png';
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

    const currentImage = activeLayer?.generatedImage || null;
    const currentTransform = activeLayer?.transform || INITIAL_TRANSFORM;

    if (viewMode === 'flyer') {
        return <FlyerPage 
            initialDjName={djName}
            initialPrompt={prompt}
            initialStyleKeywords={styleKeywords}
            onBack={() => setViewMode('overlay')}
        />;
    }

    return (
        <div className="bg-gray-800 text-gray-200 min-h-screen font-sans">
            <Header 
                viewMode="overlay"
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onExport={handleExport}
                isExporting={isExporting}
                isImageGenerated={!!currentImage}
                onMakeFlyer={() => setViewMode('flyer')}
                onRemoveBackground={handleRemoveBackground}
                isRemovingBackground={isRemovingBg}
            />
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <GeneratedImageDisplay
                        generatedImage={currentImage}
                        transform={currentTransform}
                        isLoading={isLoading}
                        isInitialState={layers.length === 0}
                        aspectRatio={aspectRatio}
                        onTransformChange={handleTransformChange}
                    />
                </div>
                <aside className="lg:col-span-1 bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 space-y-8 h-fit sticky top-24">
                    <TemplateSelector templates={templates} onSelectTemplate={handleSelectTemplate} />
                    <AspectRatioControls selectedRatio={aspectRatio} onRatioChange={setAspectRatio} />
                    <DjPersonalization djName={djName} onDjNameChange={setDjName} />
                    <LayerManager layers={layers} setLayers={setLayers} />
                    <RefinementControls
                        prompt={prompt}
                        setPrompt={setPrompt}
                        styleKeywords={styleKeywords}
                        setStyleKeywords={setStyleKeywords}
                        onGenerate={handleGenerateOverlay}
                        isLoading={isLoading}
                        hasGenerated={layers.length > 0}
                    />
                </aside>
            </main>
        </div>
    );
};

export default App;