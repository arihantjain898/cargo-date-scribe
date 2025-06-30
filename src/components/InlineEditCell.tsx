
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

interface InlineEditCellProps {
  value: string | boolean;
  onSave: (value: string | boolean) => void;
  isBoolean?: boolean;
  isDate?: boolean;
  placeholder?: string;
  className?: string;
  options?: string[];
  dateColorOptions?: boolean;
}

const InlineEditCell: React.FC<InlineEditCellProps> = ({
  value,
  onSave,
  isBoolean = false,
  isDate = false,
  placeholder = "Click to edit",
  className = "",
  options = [],
  dateColorOptions = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const [dateColor, setDateColor] = useState<string>('gray');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Parse stored date color from value if it exists
    const storedValue = String(value);
    if (storedValue.includes('|color:')) {
      const [dateValue, colorPart] = storedValue.split('|color:');
      setEditValue(dateValue);
      setDateColor(colorPart);
    } else {
      setEditValue(storedValue);
      setDateColor('gray');
    }
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      if (isDate) {
        inputRef.current?.focus();
      } else {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }
    }
  }, [isEditing, isDate]);

  const handleSave = () => {
    if (isBoolean) {
      onSave(editValue === 'true');
    } else if (isDate && dateColorOptions) {
      // Save date with color information
      const valueWithColor = editValue ? `${editValue}|color:${dateColor}` : '';
      onSave(valueWithColor);
    } else {
      onSave(editValue);
    }
    setIsEditing(false);
    setShowColorPicker(false);
  };

  const handleCancel = () => {
    const storedValue = String(value);
    if (storedValue.includes('|color:')) {
      const [dateValue, colorPart] = storedValue.split('|color:');
      setEditValue(dateValue);
      setDateColor(colorPart);
    } else {
      setEditValue(storedValue);
      setDateColor('gray');
    }
    setIsEditing(false);
    setShowColorPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleClick = () => {
    if (isBoolean) {
      onSave(!value);
    } else if (options.length > 0) {
      // Cycle through options
      const currentIndex = options.indexOf(String(value));
      const nextIndex = (currentIndex + 1) % options.length;
      onSave(options[nextIndex]);
    } else {
      setIsEditing(true);
    }
  };

  const handleSelectChange = (newValue: string) => {
    onSave(newValue);
    setIsEditing(false);
  };

  const handleColorChange = (color: string) => {
    setDateColor(color);
    setShowColorPicker(false);
  };

  const getDateColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isEditing && !isBoolean && options.length === 0) {
    return (
      <div className="w-full min-h-[24px] p-1">
        {isDate ? (
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              type="date"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full text-xs border-blue-500 focus:border-blue-600 focus:ring-blue-500"
            />
            {dateColorOptions && (
              <div className="relative">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="h-8 w-8 p-0"
                >
                  <Palette className="h-3 w-3" />
                </Button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-50 p-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleColorChange('gray')}
                        className="w-6 h-6 bg-gray-300 rounded border hover:scale-110"
                        title="Gray (Default)"
                      />
                      <button
                        onClick={() => handleColorChange('green')}
                        className="w-6 h-6 bg-green-300 rounded border hover:scale-110"
                        title="Green"
                      />
                      <button
                        onClick={() => handleColorChange('yellow')}
                        className="w-6 h-6 bg-yellow-300 rounded border hover:scale-110"
                        title="Yellow"
                      />
                      <button
                        onClick={() => handleColorChange('red')}
                        className="w-6 h-6 bg-red-300 rounded border hover:scale-110"
                        title="Red"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[60px] text-xs border-blue-500 focus:border-blue-600 focus:ring-blue-500 resize-none"
            placeholder={placeholder}
          />
        )}
      </div>
    );
  }

  if (isEditing && options.length > 0) {
    return (
      <div className="w-full min-h-[24px] p-1">
        <Select value={String(value)} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full text-xs border-blue-500 focus:border-blue-600 focus:ring-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Parse display value for dates with colors
  let displayValue = String(value);
  let currentColor = 'gray';
  
  if (isDate && dateColorOptions && displayValue.includes('|color:')) {
    const [dateValue, colorPart] = displayValue.split('|color:');
    displayValue = dateValue;
    currentColor = colorPart;
  }

  if (isBoolean) {
    displayValue = value ? 'Yes' : 'No';
  } else if (!displayValue) {
    displayValue = placeholder;
  }

  const getStatusColor = (val: string) => {
    if (val === 'Yes' || val === 'Done') return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (val === 'Pending') return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    if (val === 'N/A') return 'bg-green-100 text-green-800 hover:bg-green-200'; // N/A counts as complete
    return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const displayClasses = isBoolean || options.length > 0
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
        options.length > 0 ? getStatusColor(String(value)) :
        value 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`
    : `w-full min-h-[24px] p-1 text-xs cursor-pointer hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-all duration-200 ${
        value ? 'text-gray-800' : 'text-gray-400 italic'
      } ${isDate && value ? `px-1 py-0.5 rounded text-[10px] ${getDateColorClass(currentColor)}` : ''}`;

  return (
    <div
      className={`${displayClasses} ${className}`}
      onClick={handleClick}
      title="Click to edit"
    >
      <span className={isDate && value ? 'px-1 py-0.5 rounded text-[10px]' : 'break-words whitespace-pre-wrap'}>
        {displayValue}
      </span>
    </div>
  );
};

export default InlineEditCell;
