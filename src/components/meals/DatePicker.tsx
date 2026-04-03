// src/components/meals/DatePicker.tsx
import React from 'react';

type ViewMode = 'day' | 'week' | 'month' | 'year';

interface DatePickerProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  viewMode,
  onViewModeChange,
  currentDate,
  onDateChange,
}) => {
  const modes: { value: ViewMode; label: string }[] = [
    { value: 'day', label: '日' },
    { value: 'week', label: '周' },
    { value: 'month', label: '月' },
    { value: 'year', label: '年' },
  ];

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    onDateChange(newDate);
  };

  const formatDate = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    switch (viewMode) {
      case 'day':
        return `${month}月${day}日`;
      case 'week':
        return `第${getWeekNumber(currentDate)}周`;
      case 'month':
        return `${year}年${month}月`;
      case 'year':
        return `${year}年`;
      default:
        return '';
    }
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft">
      {/* 模式切换 */}
      <div className="flex gap-2 mb-4">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onViewModeChange(mode.value)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === mode.value
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* 日期导航 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="上一个"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-lg font-semibold text-gray-900">{formatDate()}</div>

        <button
          onClick={handleNext}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="下一个"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};