import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { cn } from '@/utils';

// Helper to convert index to letter (0 -> A, 1 -> B, ..., 26 -> AA)
const getColumnLabel = (index: number) => {
  let label = '';
  let i = index;
  while (i >= 0) {
    label = String.fromCharCode(65 + (i % 26)) + label;
    i = Math.floor(i / 26) - 1;
  }
  return label;
};

export const DatabaseView: React.FC = () => {
  const { setWorkspaceSubView } = useWorkspaceStore();
  
  // Basic spreadsheet state: 10 columns, 20 rows
  const [cols] = useState(10);
  const [rows] = useState(20);
  const [data, setData] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [formulaValue, setFormulaValue] = useState('');

  const handleCellSelect = (r: number, c: number) => {
    const cellId = `${r},${c}`;
    setActiveCell(cellId);
    setFormulaValue(data[cellId] || '');
  };

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaValue(e.target.value);
    if (activeCell) {
      setData({ ...data, [activeCell]: e.target.value });
    }
  };

  // Very basic formula evaluation (e.g. "=10+20" or plain text)
  const evaluateCell = (value: string) => {
    if (!value) return '';
    if (value.startsWith('=')) {
      try {
        // Only evaluate safe basic math for this demo
        const expr = value.substring(1).replace(/[^0-9+\-*/(). ]/g, '');
        // eslint-disable-next-line no-new-func
        return new Function('return ' + expr)();
      } catch {
        return '#ERROR';
      }
    }
    return value;
  };

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Header */}
      <div className="px-6 md:px-8 py-5 bg-white flex-shrink-0">
        <button
          onClick={() => setWorkspaceSubView('dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-full transition-colors mb-6 w-fit"
        >
          <ArrowLeft size={16} />
          Dashboard
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2 outline-none" contentEditable suppressContentEditableWarning>
          Untitled Table
        </h1>
        <p className="text-stone-500 outline-none text-lg" contentEditable suppressContentEditableWarning>
          Structure and track your work
        </p>

        {/* Formula Bar */}
        <div className="mt-8 flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-2.5 shadow-sm max-w-4xl">
          <span className="font-serif italic font-bold text-[#8b5a46] select-none">fx</span>
          <div className="w-px h-5 bg-stone-200" />
          <input 
            type="text" 
            placeholder="Select a cell to edit" 
            value={formulaValue}
            onChange={handleFormulaChange}
            className="flex-1 outline-none text-stone-700 bg-transparent text-sm font-medium placeholder-stone-400"
            disabled={!activeCell}
          />
        </div>
      </div>

      {/* Spreadsheet Grid Area */}
      <div className="flex-1 overflow-auto bg-white border-t border-stone-200">
        <div className="inline-block min-w-full pb-24">
          <table className="w-full border-collapse select-none">
            <thead>
              <tr>
                {/* Top-Left Corner */}
                <th className="w-12 h-10 border-b border-r border-stone-200 bg-stone-50/50 sticky top-0 left-0 z-20"></th>
                {/* Column Headers */}
                {Array.from({ length: cols }).map((_, c) => (
                  <th key={c} className="min-w-[120px] h-10 border-b border-r border-stone-200 bg-stone-50/50 text-[#8b5a46] font-semibold text-sm sticky top-0 z-10">
                    {getColumnLabel(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, r) => (
                <tr key={r}>
                  {/* Row Header */}
                  <td className="w-12 h-10 border-b border-r border-stone-200 bg-stone-50/50 text-stone-500 font-medium text-xs text-center sticky left-0 z-10">
                    {r + 1}
                  </td>
                  {/* Cells */}
                  {Array.from({ length: cols }).map((_, c) => {
                    const cellId = `${r},${c}`;
                    const isActive = activeCell === cellId;
                    const value = data[cellId] || '';
                    const displayValue = isActive ? value : evaluateCell(value);

                    return (
                      <td 
                        key={c} 
                        onClick={() => handleCellSelect(r, c)}
                        className={cn(
                          "h-10 border-b border-r border-stone-100 px-3 py-1 text-sm text-stone-700 cursor-cell truncate transition-colors",
                          isActive && "bg-[#8b5a46]/5 ring-1 ring-inset ring-[#8b5a46]"
                        )}
                      >
                        {displayValue ? (
                          <span>{displayValue}</span>
                        ) : (
                          <span className="text-stone-300">...</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
