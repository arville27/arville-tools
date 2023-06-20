import { useMounted } from '@/utils/hooks/useMounted';
import * as dfs from 'date-fns';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/Select';
import { Skeleton } from '../ui/Skeleton';
import { useLogbookStore } from './useLogbookStore';

type DailyCardProps = {
  uid: string;
  clockIn: string;
  clockOut: string;
  activity: string;
  description: string;
  dateFilled: string;
};

function LogbookDailyCard(props: DailyCardProps) {
  const setCurrentLogbook = useLogbookStore((state) => state.setCurrentLogbook);
  const setActiveTab = useLogbookStore((state) => state.setActiveTab);

  const { clockIn, clockOut, activity, description } = props;

  const dateFilled = dfs.parse(props.dateFilled, 'yyyy-MM-dd', new Date());

  return (
    <Card
      onClick={() => {
        setCurrentLogbook(props);
        setActiveTab('logbook-edit');
      }}
      className='flex w-[22rem] cursor-pointer flex-col justify-start rounded-xl text-left md:w-[30rem]'>
      <CardHeader>
        <div className='bg-base-200 flex w-full items-center justify-between rounded-t-xl p-4'>
          <div>
            <div className='font-bold'>{dfs.format(dateFilled, 'eeee')}</div>
            <div className='font-bold'>{dfs.format(dateFilled, 'dd MMMM yyyy')}</div>
            <span className='text-base-content/80 text-sm'>{props.dateFilled}</span>
          </div>
          <div className='text-accent-content max-w-fit rounded-full bg-accent px-4 py-2 text-sm font-medium'>
            {clockIn.length == 0 && clockOut.length == 0
              ? 'None'
              : `${clockIn} - ${clockOut}`}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex w-full flex-col gap-4 p-4'>
          <div>
            <div className='mb-1 font-bold'>Activity</div>
            <div className='text-sm'>{activity.length == 0 ? 'None' : activity}</div>
          </div>
          <div>
            <div className='mb-1 font-bold'>Description</div>
            <div className='text-sm'>
              {description.length == 0 ? 'None' : description}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const MONTH_SELECT_LIST = {
  '1': {
    monthIndexBinus: 1,
    content: 'September 2022',
  },
  '2': {
    monthIndexBinus: 2,
    content: 'October 2022',
  },
  '3': {
    monthIndexBinus: 3,
    content: 'November 2022',
  },
  '4': {
    monthIndexBinus: 4,
    content: 'December 2022',
  },
  '0': {
    monthIndexBinus: 0,
    content: 'January 2023',
  },
} as const;

export type LogbookMonthIndex = keyof typeof MONTH_SELECT_LIST;
export type LogbookMonth = (typeof MONTH_SELECT_LIST)[LogbookMonthIndex];

export function LogbookListComponent() {
  const isMounted = useMounted();

  const jwt = useLogbookStore((s) => s.jwt);
  const setJwt = useLogbookStore((s) => s.setJwt);
  const setCurrentLogbook = useLogbookStore((s) => s.setCurrentLogbook);

  const [selectedMonth, setSelectedMonth] = useState<LogbookMonth>({
    monthIndexBinus: 0,
    content: 'January 2023',
  });

  const {
    data: logbookData,
    isError,
    error,
  } = trpc.logbook.getLogbookData.useQuery({ jwt }, { enabled: Boolean(jwt) });

  if (!isMounted) return null;

  if (!jwt) {
    setCurrentLogbook(null);
    return <div>No JWT 😭</div>;
  }

  if (isError) {
    setJwt('');
    return (
      <div className='rounded-lg bg-destructive px-4 py-2 text-destructive-foreground'>
        <p className='font-bold'>Error message</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!logbookData) {
    return (
      <div className='flex flex-col items-center gap-3'>
        <Skeleton className='h-8 w-2/5 rounded-md' />
        <div className='mb-10 flex w-full flex-col gap-3 lg:grid lg:grid-cols-2'>
          <Skeleton className='flex h-[20rem] w-[22rem] rounded-xl md:w-[30rem]' />
          <Skeleton className='flex h-[20rem] w-[22rem] rounded-xl md:w-[30rem]' />
          <Skeleton className='flex h-[20rem] w-[22rem] rounded-xl md:w-[30rem]' />
          <Skeleton className='flex h-[20rem] w-[22rem] rounded-xl md:w-[30rem]' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-3'>
      <Select
        onValueChange={(value) =>
          setSelectedMonth(MONTH_SELECT_LIST[value as LogbookMonthIndex])
        }
        defaultValue={String(selectedMonth.monthIndexBinus)}>
        <SelectTrigger className='w-2/5 text-lg font-bold'>
          {selectedMonth.content}
        </SelectTrigger>
        <SelectContent>
          {Object.entries(MONTH_SELECT_LIST).map(([key, value]) => (
            <SelectItem
              key={key}
              className='text-lg'
              value={String(value.monthIndexBinus)}>
              {value.content}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className='mb-10 flex w-full flex-col gap-3 lg:grid lg:grid-cols-2'>
        {logbookData.data[selectedMonth.monthIndexBinus].log_book_month_details.map(
          (dailyLogbook) => (
            <LogbookDailyCard
              key={dailyLogbook.uid}
              uid={dailyLogbook.uid}
              activity={dailyLogbook.activity}
              clockIn={dailyLogbook.clock_in}
              clockOut={dailyLogbook.clock_out}
              dateFilled={dailyLogbook.date_filled}
              description={dailyLogbook.description}
            />
          )
        )}
      </div>
    </div>
  );
}
