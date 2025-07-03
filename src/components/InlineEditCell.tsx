
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface InlineEditCellProps {
  value: string | boolean;
  onSave: (value: string | boolean) => void;
  isBoolean?: boolean;
  isDate?: boolean;
  placeholder?: string;
  className?: string;
  options?: string[];
  isThreeStateBoolean?: boolean;
  isPoaColumn?: boolean;
  isBondColumn?: boolean;
}

const InlineEditCell: React.FC<InlineEditCellProps> = ({
  value,
  onSave,
  isBoolean = false,
  isDate = false,
  placeholder = "Click to edit",
  className = "",
  options = [],
  isThreeStateBoolean = false,
  isPoaColumn = false,
  isBondColumn = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(String(value));
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
    if (isBoolean || isThreeStateBoolean) {
      onSave(editValue === 'true');
    } else {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
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
    if (isBondColumn) {
      // Bond column cycling logic - only between Continuous and Single Entry
      if (value === 'Continuous') {
        onSave('Single Entry');
      } else {
        onSave('Continuous');
      }
    } else if (isPoaColumn) {
      // POA column cycling logic
      if (value === 'Select Value') {
        onSave('Pending');
      } else if (value === 'Pending') {
        onSave('Yes');
      } else if (value === 'Yes') {
        onSave('No');
      } else {
        onSave('Pending');
      }
    } else if (isThreeStateBoolean) {
      // Cycle through: unset -> true -> false -> unset
      if (value === '') {
        onSave(true);
      } else if (value === true) {
        onSave(false);
      } else {
        onSave('');
      }
    } else if (isBoolean) {
      onSave(!value);
    } else if (options.length > 0) {
      // Cycle through options for any column with options
      const currentIndex = options.indexOf(String(value));
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % options.length;
      onSave(options[nextIndex]);
    } else {
      setIsEditing(true);
    }
  };

  if (isEditing && !isBoolean && !isThreeStateBoolean && !isPoaColumn && !isBondColumn && options.length === 0) {
    return (
      <div className="w-full min-h-[24px] p-1">
        {isDate ? (
          <Input
            ref={inputRef}
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full text-xs border-blue-500 focus:border-blue-600 focus:ring-blue-500"
          />
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

  const getPoaDisplay = () => {
    if (value === 'Select Value') {
      return { text: 'Select Value', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    } else if (value === 'Pending') {
      return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' };
    } else if (value === 'Yes') {
      return { text: 'Yes', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
    } else if (value === 'No') {
      return { text: 'No', color: 'bg-red-100 text-red-800 hover:bg-red-200' };
    } else {
      return { text: 'Select Value', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    }
  };

  const getBondDisplay = () => {
    if (value === 'Continuous') {
      return { text: 'Continuous', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
    } else if (value === 'Single Entry') {
      return { text: 'Single Entry', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' };
    } else {
      return { text: 'Continuous', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
    }
  };

  const getThreeStateBooleanDisplay = () => {
    if (value === '' || value === null || value === undefined) {
      return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' };
    } else if (value === true) {
      return { text: 'Yes', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
    } else {
      return { text: 'No', color: 'bg-red-100 text-red-800 hover:bg-red-200' };
    }
  };

  const displayValue = isBondColumn
    ? getBondDisplay().text
    : isPoaColumn
    ? getPoaDisplay().text
    : isThreeStateBoolean 
    ? getThreeStateBooleanDisplay().text
    : isBoolean 
    ? (value ? 'Yes' : 'No')
    : (String(value) || placeholder);

  const getStatusColor = (val: string) => {
    if (val === 'Yes' || val === 'Done') return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (val === 'Pending') return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    if (val === 'N/A') return 'bg-green-100 text-green-800 hover:bg-green-200';
    return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const displayClasses = isBondColumn
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getBondDisplay().color}`
    : isPoaColumn
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getPoaDisplay().color}`
    : isThreeStateBoolean
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getThreeStateBooleanDisplay().color}`
    : (isBoolean || options.length > 0)
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
        options.length > 0 ? getStatusColor(String(value)) :
        value 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`
    : `w-full min-h-[24px] p-1 text-xs cursor-pointer hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-all duration-200 ${
        value ? 'text-gray-800' : 'text-gray-400 italic'
      } ${isDate && value ? 'text-blue-700 bg-blue-50' : ''}`;

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
