'use client';

import { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface DateRangeFilterProps {
  onDateChange: (range: DateRange | undefined) => void;
}

export function DateRangeFilter({ onDateChange }: DateRangeFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    to: new Date(),
  });

  const handleDateUpdate = (values: { range: DateRange; rangeCompare?: DateRange }) => {
    setDateRange(values.range);
    onDateChange(values.range);
  };

  return (
    <DateRangePicker
      onUpdate={handleDateUpdate}
      initialDateFrom={dateRange?.from}
      initialDateTo={dateRange?.to}
      align="end"
      locale="en-US"
      showCompare={false}
    />
  );
}
