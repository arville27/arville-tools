import { format, parse } from 'date-fns';
import { z } from 'zod';
import { logbookPerMonth } from '../../server/trpc/routers/logbook';
import { trpc } from '../../utils/trpc';
import ListBoxComponent from '../Listbox/ListboxComponent';
import { useListboxStore } from '../Listbox/useListBoxStore';
import { Card, CardContent, CardHeader } from '../ui/Card';
import useLogbookStateStore from './useLogbookStore';

type DailyCardProps = {
  uid: string;
  clockIn: string;
  clockOut: string;
  activity: string;
  description: string;
  dateFilled: string;
  onClick: (tabIndex: number) => void;
};

function LogbookDailyCard(props: DailyCardProps) {
  const setCurrentLogbook = useLogbookStateStore((state) => state.setCurrentLogbook);

  const { clockIn, clockOut, activity, description, onClick } = props;

  const dateFilled = parse(props.dateFilled, 'yyyy-MM-dd', new Date());

  return (
    <Card
      onClick={() => {
        setCurrentLogbook(props);
        onClick(2);
      }}
      className='flex w-[22rem] cursor-pointer flex-col justify-start rounded-xl text-left md:w-[30rem]'>
      <CardHeader>
        <div className='bg-base-200 flex w-full items-center justify-between rounded-t-xl p-4'>
          <div>
            <div className='font-bold'>{format(dateFilled, 'eeee')}</div>
            <div className='font-bold'>{format(dateFilled, 'dd MMMM yyyy')}</div>
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

type Props = {
  onDailyLogbookCardClick: (tabIndex: number) => void;
};

export function LogbookListComponent({ onDailyLogbookCardClick }: Props) {
  const jwt = useLogbookStateStore((state) => state.jwt);
  const setJwt = useLogbookStateStore((state) => state.setJwt);
  const setCurrentLogbook = useLogbookStateStore((state) => state.setCurrentLogbook);

  const selectedMonth = useListboxStore((state) => state.selectedMonth);

  const logbookData = trpc.logbook.getLogbookData.useQuery(
    { jwt },
    { enabled: Boolean(jwt) }
  );

  if (!jwt) {
    setCurrentLogbook(null);
    return <div>No JWT 😭</div>;
  }

  let content = null;

  if (logbookData.data && logbookData.data.success) {
    content = (
      <div className='flex flex-col items-center gap-3'>
        <ListBoxComponent />
        <div className='mb-10 flex w-full flex-col gap-3 lg:grid lg:grid-cols-2'>
          {(
            logbookData.data.data[selectedMonth.monthIndexBinus] as z.infer<
              typeof logbookPerMonth
            >
          ).log_book_month_details.map((dailyLogbook) => (
            <LogbookDailyCard
              onClick={onDailyLogbookCardClick}
              key={dailyLogbook.uid}
              uid={dailyLogbook.uid}
              activity={dailyLogbook.activity}
              clockIn={dailyLogbook.clock_in}
              clockOut={dailyLogbook.clock_out}
              dateFilled={dailyLogbook.date_filled}
              description={dailyLogbook.description}
            />
          ))}
        </div>
      </div>
    );
  } else if (logbookData.data) {
    setJwt('');
    content = (
      <div className='bg-error text-error-content rounded-lg px-4 py-2'>
        <p className='font-bold'>Error message</p>
        <p>{logbookData.data.data as string}</p>
      </div>
    );
  }

  return content;
}
