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
  isFourStateBoolean?: boolean;
  isFiveStateBoolean?: boolean;
  isPoaColumn?: boolean;
  isBondColumn?: boolean;
  isTextColumn?: boolean;
  isNotesColumn?: boolean;
  onNextCell?: () => void;
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
  isFourStateBoolean = false,
  isFiveStateBoolean = false,
  isPoaColumn = false,
  isBondColumn = false,
  isTextColumn = false,
  isNotesColumn = false,
  onNextCell
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const [originalValue, setOriginalValue] = useState(String(value));
  const [shouldTabOnSave, setShouldTabOnSave] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(String(value));
    setOriginalValue(String(value));
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      // Set original value when editing starts
      setOriginalValue(String(value));
      setShouldTabOnSave(false);
      
      if (isDate || isTextColumn) {
        inputRef.current?.focus();
        if (!isDate) {
          inputRef.current?.select();
        }
      } else {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }
    }
  }, [isEditing, isDate, isTextColumn, value]);

  const handleSave = () => {
    if (isBoolean || isThreeStateBoolean) {
      onSave(editValue === 'true');
    } else {
      onSave(editValue);
    }
    setIsEditing(false);
    
    // Trigger navigation when Enter was pressed, regardless of value change
    if (onNextCell && shouldTabOnSave) {
      setTimeout(onNextCell, 0);
    }
    setShouldTabOnSave(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
    setShouldTabOnSave(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setShouldTabOnSave(true);
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleClick = () => {
    if (isBondColumn) {
      // Bond column cycling logic - start with Select, then Continuous and Single Entry
      if (value === 'Select') {
        onSave('Continuous');
      } else if (value === 'Continuous') {
        onSave('Single Entry');
      } else {
        onSave('Continuous');
      }
    } else if (isPoaColumn) {
      // POA column cycling logic - skip "Select" after first selection
      if (value === 'Select') {
        onSave('Pending');
      } else if (value === 'Pending') {
        onSave('Yes');
      } else if (value === 'Yes') {
        onSave('No');
      } else {
        onSave('Pending');
      }
     } else if (isFiveStateBoolean) {
      // Handle both boolean and string values for backward compatibility
      const currentValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
      console.log('Five-state boolean clicked:', { originalValue: value, currentValue });
      
      // Cycle through: Select -> Pending -> Yes -> N/A -> No -> Pending (skip Select after first use)
      if (currentValue === 'Select' || currentValue === '' || currentValue === undefined) {
        console.log('Setting to Pending');
        onSave('Pending');
      } else if (currentValue === 'Pending') {
        console.log('Setting to Yes');
        onSave('Yes');
      } else if (currentValue === 'Yes') {
        console.log('Setting to N/A');
        onSave('N/A');
      } else if (currentValue === 'N/A') {
        console.log('Setting to No');
        onSave('No');
      } else if (currentValue === 'No') {
        console.log('Setting to Pending');
        onSave('Pending');
      } else {
        console.log('Unknown value, setting to Pending');
        onSave('Pending');
      }
    } else if (isFourStateBoolean) {
      // Handle both boolean and string values for backward compatibility
      const currentValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
      console.log('Four-state boolean clicked:', { originalValue: value, currentValue });
      
      // Cycle through: Select -> Pending -> Yes -> N/A -> Pending (skip Select after first use)
      if (currentValue === 'Select' || currentValue === '' || currentValue === undefined) {
        console.log('Setting to Pending');
        onSave('Pending');
      } else if (currentValue === 'Pending') {
        console.log('Setting to Yes');
        onSave('Yes');
      } else if (currentValue === 'Yes') {
        console.log('Setting to N/A');
        onSave('N/A');
      } else if (currentValue === 'N/A') {
        console.log('Setting to Pending');
        onSave('Pending');
      } else {
        console.log('Unknown value, setting to Pending');
        onSave('Pending');
      }
    } else if (isThreeStateBoolean) {
      // Handle both boolean and string values for backward compatibility
      const currentValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
      
      // Cycle through: Select -> Pending -> Yes -> No -> Pending (skip Select after first use)
      if (currentValue === 'Select' || currentValue === '' || currentValue === undefined) {
        onSave('Pending');
      } else if (currentValue === 'Pending') {
        onSave('Yes');
      } else if (currentValue === 'Yes') {
        onSave('No');
      } else {
        onSave('Pending');
      }
    } else if (isBoolean) {
      onSave(!value);
    } else if (options.length > 0) {
      // For delivered and returned columns with options, cycle through Select -> Pending -> Yes -> No
      if (String(value) === 'Select') {
        onSave('Pending');
      } else if (String(value) === 'Pending') {
        onSave('Yes');
      } else if (String(value) === 'Yes') {
        onSave('No');
      } else if (String(value) === 'No') {
        onSave('Pending');
      } else {
        // Default to Pending if value is not recognized
        onSave('Pending');
      }
    } else {
      setIsEditing(true);
    }
  };

  if (isEditing && !isBoolean && !isThreeStateBoolean && !isFourStateBoolean && !isFiveStateBoolean && !isPoaColumn && !isBondColumn && options.length === 0) {
    const textInputWidth = isNotesColumn ? 'min-w-[160px]' : isTextColumn ? 'min-w-[100px]' : '';
    const textareaWidth = isNotesColumn ? 'min-w-[160px]' : 'min-w-[100px]';
    
    return (
      <div className={`w-full min-h-[24px] p-1 ${textInputWidth}`}>
        {isDate || isTextColumn ? (
          <Input
            ref={inputRef}
            type={isDate ? "date" : "text"}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full text-xs border-blue-500 focus:border-blue-600 focus:ring-blue-500 ${textInputWidth}`}
            placeholder={placeholder}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full min-h-[60px] text-xs border-blue-500 focus:border-blue-600 focus:ring-blue-500 resize-none ${textareaWidth}`}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  }

  const getPoaDisplay = () => {
    if (value === 'Select') {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    } else if (value === 'Pending') {
      return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' };
    } else if (value === 'Yes') {
      return { text: 'Yes', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
    } else if (value === 'No') {
      return { text: 'No', color: 'bg-red-100 text-red-800 hover:bg-red-200' };
    } else {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    }
  };

  const getBondDisplay = () => {
    if (value === 'Select') {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    } else if (value === 'Continuous') {
      return { text: 'Continuous', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
    } else if (value === 'Single Entry') {
      return { text: 'Single Entry', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' };
    } else {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    }
  };

  const getFiveStateBooleanDisplay = () => {
    // Handle both string and boolean values for backward compatibility
    const stringValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    
    if (stringValue === 'Select' || stringValue === '' || stringValue === undefined) {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    } else if (stringValue === 'Pending') {
      return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' };
    } else if (stringValue === 'Yes') {
      return { text: 'Yes', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
    } else if (stringValue === 'No') {
      return { text: 'No', color: 'bg-red-100 text-red-800 hover:bg-red-200' };
    } else if (stringValue === 'N/A') {
      return { text: 'N/A', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
    } else {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    }
  };

  const getFourStateBooleanDisplay = () => {
    // Handle both string and boolean values for backward compatibility
    const stringValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    
    if (stringValue === 'Select' || stringValue === '' || stringValue === undefined) {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    } else if (stringValue === 'Pending') {
      return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' };
    } else if (stringValue === 'Yes') {
      return { text: 'Yes', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
    } else if (stringValue === 'N/A') {
      return { text: 'N/A', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
    } else {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    }
  };

  const getThreeStateBooleanDisplay = () => {
    // Handle both string and boolean values for backward compatibility
    const stringValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    
    if (stringValue === 'Select' || stringValue === '' || stringValue === undefined) {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    } else if (stringValue === 'Pending') {
      return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' };
    } else if (stringValue === 'Yes') {
      return { text: 'Yes', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
    } else if (stringValue === 'No') {
      return { text: 'No', color: 'bg-red-100 text-red-800 hover:bg-red-200' };
    } else {
      return { text: 'Select', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' };
    }
  };

  const displayValue = isBondColumn
    ? getBondDisplay().text
    : isPoaColumn
    ? getPoaDisplay().text
    : isFiveStateBoolean
    ? getFiveStateBooleanDisplay().text
    : isFourStateBoolean
    ? getFourStateBooleanDisplay().text
    : isThreeStateBoolean 
    ? getThreeStateBooleanDisplay().text
    : isBoolean 
    ? (value ? 'Yes' : 'No')
    : (String(value) || placeholder);

  const getStatusColor = (val: string) => {
    if (val === 'Select') return 'bg-gray-100 text-gray-500 hover:bg-gray-200';
    if (val === 'Yes' || val === 'Done') return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (val === 'Pending') return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    if (val === 'No') return 'bg-red-100 text-red-800 hover:bg-red-200';
    if (val === 'N/A') return 'bg-green-100 text-green-800 hover:bg-green-200';
    return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const displayClasses = isBondColumn
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getBondDisplay().color}`
    : isPoaColumn
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getPoaDisplay().color}`
    : isFiveStateBoolean
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getFiveStateBooleanDisplay().color}`
    : isFourStateBoolean
    ? `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getFourStateBooleanDisplay().color}`
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
