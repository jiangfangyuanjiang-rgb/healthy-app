import type { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  type?: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  unit?: string;
  disabled?: boolean;
}

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  unit,
  disabled = false,
}: InputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(val);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-transparent
                     focus:outline-none focus:bg-white focus:border-green-500
                     transition-all text-base
                     ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

