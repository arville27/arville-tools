import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/Select';
import { LogbookMonthIndex, MONTH_SELECT_LIST, useListboxStore } from './useListBoxStore';

const ListBoxComponent = () => {
  const selectedMonth = useListboxStore((state) => state.selectedMonth);
  const setSelectedMonth = useListboxStore((state) => {
    return state.setSelectedMonth;
  });

  return (
    <Select
      onValueChange={(value) =>
        setSelectedMonth(MONTH_SELECT_LIST[value as LogbookMonthIndex].monthIndexBinus)
      }
      defaultValue={String(selectedMonth.monthIndexBinus)}>
      <SelectTrigger className='w-2/5 text-lg font-bold'>
        {selectedMonth.content}
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MONTH_SELECT_LIST).map(([key, value]) => (
          <SelectItem key={key} className='text-lg' value={String(value.monthIndexBinus)}>
            {value.content}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ListBoxComponent;
