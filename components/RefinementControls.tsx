import React from 'react';
import { IconPalette, IconSparkles } from './Icons';

interface RefinementControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  styleKeywords: string[];
  setStyleKeywords: (keywords: string[]) => void;
  onGenerate: () => void;
  isLoading: boolean;
  hasGenerated: boolean;
}

const availableStyles = ['Neon', 'Minimalist', 'Retro', 'Tribal', 'Abstract', 'Cyberpunk', 'Futuristic'];

export const RefinementControls: React.FC<RefinementControlsProps> = ({
  prompt,
  setPrompt,
  styleKeywords,
  setStyleKeywords,
  onGenerate,
  isLoading,
  hasGenerated,
}) => {

  const handleStyleToggle = (style: string) => {
    const lowerCaseStyle = style.toLowerCase();
    const newKeywords = styleKeywords.includes(lowerCaseStyle)
      ? styleKeywords.filter(k => k !== lowerCaseStyle)
      : [...styleKeywords, lowerCaseStyle];
    setStyleKeywords(newKeywords);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
            <IconPalette className="w-5 h-5 mr-2 text-gray-500" />
            Style Keywords
        </label>
        <div className="flex flex-wrap gap-2">
            {availableStyles.map(style => (
                <button
                    key={style}
                    onClick={() => handleStyleToggle(style)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        styleKeywords.includes(style.toLowerCase())
                        ? 'bg-indigo-500 text-white shadow-md ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-800'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                >
                    {style}
                </button>
            ))}
        </div>
      </div>
       <div>
        <label htmlFor="prompt-textarea" className="block text-sm font-medium text-gray-400 mb-2">Detailed Prompt</label>
        <textarea
          id="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Change the color to electric blue, make the logo bigger..."
          rows={4}
          className="w-full p-3 bg-gray-900/70 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-gray-200 placeholder-gray-500"
        />
      </div>
      <div className="mt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-bold text-base"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <IconSparkles className="w-5 h-5" />
              <span>{hasGenerated ? 'Regenerate' : 'Generate Overlay'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};