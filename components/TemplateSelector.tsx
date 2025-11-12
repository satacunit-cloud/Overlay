import React from 'react';
import type { Template } from '../types';
import { IconGrid } from './Icons';

interface TemplateSelectorProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
        <IconGrid className="w-5 h-5 mr-2 text-gray-400" />
        Start with a Template
      </h3>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="px-3 py-2 rounded-md text-sm font-semibold bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};