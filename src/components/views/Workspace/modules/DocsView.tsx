import React, { useState } from 'react';
import { ArrowLeft, AlignLeft, AlignCenter } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { cn } from '@/utils';

export const DocsView: React.FC = () => {
  const { setWorkspaceSubView } = useWorkspaceStore();
  const [font, setFont] = useState<'sans' | 'serif'>('sans');
  const [align, setAlign] = useState<'left' | 'center'>('left');
  const [blockType, setBlockType] = useState('Body');
  const [fontSize, setFontSize] = useState(16);

  const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36];

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Header */}
      <div className="px-6 md:px-8 py-5 bg-white border-b border-stone-100 flex-shrink-0">
        <button
          onClick={() => setWorkspaceSubView('dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-full transition-colors mb-6 w-fit"
        >
          <ArrowLeft size={16} />
          Dashboard
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2 outline-none" contentEditable suppressContentEditableWarning>
          Untitled Note
        </h1>
        <p className="text-stone-500 outline-none text-lg" contentEditable suppressContentEditableWarning>
          Linear thought process
        </p>
      </div>

      {/* Toolbar */}
      <div className="px-6 md:px-8 py-3 bg-white border-b border-stone-200 flex items-center gap-6 overflow-x-auto hide-scrollbar sticky top-0 z-10">
        {/* Block Type */}
        <select 
          className="text-sm font-medium outline-none bg-transparent cursor-pointer text-stone-700"
          value={blockType}
          onChange={(e) => {
            setBlockType(e.target.value);
            handleCommand('formatBlock', e.target.value === 'Body' ? 'P' : e.target.value);
          }}
        >
          <option value="Body">Body</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
        </select>

        <div className="w-px h-5 bg-stone-200" />

        {/* Font Style */}
        <div className="flex items-center gap-1 text-stone-600">
          <button onClick={() => handleCommand('bold')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-stone-100 font-serif font-bold text-lg">B</button>
          <button onClick={() => handleCommand('italic')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-stone-100 font-serif italic text-lg">I</button>
          <button onClick={() => handleCommand('underline')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-stone-100 font-serif underline text-lg">U</button>
        </div>

        <div className="w-px h-5 bg-stone-200" />

        {/* Font Family & Size */}
        <div className="flex items-center gap-3 text-stone-600">
          <button 
            onClick={() => setFont(f => f === 'sans' ? 'serif' : 'sans')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100 font-medium"
          >
            <span className="font-serif text-lg">T</span>
            <span className="font-sans text-sm">M</span>
          </button>
          <select 
            className="text-sm outline-none bg-transparent cursor-pointer"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            {FONT_SIZES.map(sz => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
        </div>

        <div className="w-px h-5 bg-stone-200" />

        {/* Alignment */}
        <div className="flex items-center gap-1 text-stone-600">
          <button 
            onClick={() => { setAlign('left'); handleCommand('justifyLeft'); }}
            className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-stone-100", align === 'left' && "bg-stone-100 text-stone-900")}
          >
            <AlignLeft size={18} />
          </button>
          <button 
            onClick={() => { setAlign('center'); handleCommand('justifyCenter'); }}
            className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-stone-100", align === 'center' && "bg-stone-100 text-stone-900")}
          >
            <AlignCenter size={18} />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
          <div 
            className={cn(
              "w-full min-h-[50vh] outline-none text-stone-800",
              font === 'serif' ? "font-serif" : "font-sans",
              align === 'center' ? "text-center" : "text-left"
            )}
            style={{ fontSize: `${fontSize}px` }}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Start typing... tap toolbar to format"
            onFocus={(e) => {
              if (e.currentTarget.textContent === '') {
                e.currentTarget.innerHTML = '<p><br></p>';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
