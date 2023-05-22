import { trpc } from '../../utils/trpc';
// import TimeField from '../TimePicker/TimeField';
import { format, parse } from 'date-fns';
import { FormEvent, useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import useLogbookStateStore from './useLogbookStore';

export function LogbookEditComponent() {
  const updateLogbook = trpc.logbook.updateLogbook.useMutation();
  const [respMessage, setRespMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    clock: string;
    activity: string;
    description: string;
  }>({
    clock: '',
    activity: '',
    description: '',
  });

  const currentLogbook = useLogbookStateStore((state) => state.currentLogbook);
  const jwt = useLogbookStateStore((state) => state.jwt);
  const setCurrentLogbook = useLogbookStateStore((state) => state.setCurrentLogbook);
  const [isOffEntry, setIsOffEntry] = useState(false);

  if (!jwt) {
    setCurrentLogbook(null);
    return <div>No JWT 😭</div>;
  }

  if (!currentLogbook) {
    return (
      <div className='text-medium w-[22rem] md:w-[30rem]'>
        No logbook data, please generate a token then choose a logbook to edit
      </div>
    );
  }

  const [clockInHour, clockInMinute] = currentLogbook.clockIn
    .split(':')
    .map((n) => parseInt(n));

  const [clockOutHour, clockOutMinute] = currentLogbook.clockOut
    .split(':')
    .map((n) => parseInt(n));

  // const clockIn = new Time(clockInHour, clockInMinute);
  // const clockOut = new Time(clockOutHour, clockOutMinute);

  const dateFilled = parse(currentLogbook.dateFilled, 'yyyy-MM-dd', new Date());

  // function convertTimeToString(time: TimeValue) {
  //   return time ? time.toString().slice(0, -3) : '';
  // }

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentLogbook) return;

    let isError = false;
    if (currentLogbook.activity.length <= 1) {
      setErrors((v) => ({ ...v, activity: 'Activity cannot be empty' }));
      isError = true;
    }
    if (currentLogbook.description.length <= 1) {
      setErrors((v) => ({ ...v, description: 'Description cannot be empty' }));
      isError = true;
    }
    if (currentLogbook.clockIn.length == 0 || currentLogbook.clockOut.length == 0) {
      setErrors((v) => ({
        ...v,
        clock: 'Clock in and clock out cannot be empty',
      }));
      isError = true;
    }

    if (isError) return;

    setErrors({ activity: '', clock: '', description: '' });

    if (isOffEntry) {
      setCurrentLogbook({
        ...currentLogbook,
        activity: 'OFF',
        description: 'OFF',
        clockIn: 'OFF',
        clockOut: 'OFF',
      });
    }

    const resp = await updateLogbook.mutateAsync({
      jwt,
      logbookData: currentLogbook,
    });

    setCurrentLogbook(null);
    setRespMessage({
      success: resp.success,
      message: resp.data,
    });
  }

  return (
    <Card>
      <CardHeader>
        <p className='block text-center text-2xl font-bold'>Edit logbook</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleOnSubmit}>
          <div className='flex w-[22rem] flex-col gap-4 rounded-xl md:w-[30rem]'>
            <div className='w-full rounded-t-xl p-4'>
              <div className='text-lg font-bold'>{format(dateFilled, 'eeee')}</div>
              <div className='text-lg font-bold'>
                {format(dateFilled, 'dd MMMM yyyy')}
              </div>
              <span className='text-sm'>{currentLogbook.dateFilled}</span>
            </div>
            <div className='flex flex-col gap-4 px-4 pb-4'>
              <div className='flex-start form-control flex'>
                <Label className='flex cursor-pointer items-center gap-3'>
                  <Checkbox
                    onCheckedChange={(e) =>
                      setIsOffEntry(
                        typeof e.valueOf() === 'string' ? false : (e.valueOf() as boolean)
                      )
                    }
                  />
                  Set this log book entry to OFF
                </Label>
              </div>
              <div>
                <Label htmlFor='activity'>
                  <div className='font-bold'>Activity</div>
                </Label>
                <Textarea
                  id='activity'
                  disabled={isOffEntry}
                  className={`h-24 ${
                    errors && errors.activity.length > 0 ? 'border-destructive' : ''
                  }`}
                  defaultValue={currentLogbook.activity}
                  onChange={(e) =>
                    setCurrentLogbook({
                      ...currentLogbook,
                      activity: e.target.value,
                    })
                  }></Textarea>
                {errors && errors.activity.length > 0 && (
                  <Label htmlFor='activity' className='text-destructive'>
                    {errors.activity}
                  </Label>
                )}
              </div>
              <div>
                <Label htmlFor='description' className='font-bold'>
                  Description
                </Label>
                <Textarea
                  id='description'
                  disabled={isOffEntry}
                  className={`textarea-bordered textarea-secondary textarea h-24 ${
                    errors && errors.description.length > 0 ? 'border-error' : ''
                  }`}
                  defaultValue={currentLogbook.description}
                  onChange={(e) =>
                    setCurrentLogbook({
                      ...currentLogbook,
                      description: e.target.value,
                    })
                  }
                />
                {errors && errors.description.length > 0 && (
                  <Label htmlFor='activity' className='text-destructive'>
                    {errors.description}
                  </Label>
                )}
              </div>
              <div>
                <Label
                  className={`font-bold ${
                    errors && errors.clock.length > 0 ? 'text-error' : ''
                  }`}>
                  Clock in - Clock out
                </Label>
                <div className='flex items-center gap-3'>
                  {/* <TimeField
                label='clockIn'
                isDisabled={isOffEntry}
                defaultValue={clockIn}
                onChange={(time) =>
                  setCurrentLogbook({
                    ...currentLogbook,
                    clockIn: convertTimeToString(time),
                  })
                }
                locale='en-US'
                hourCycle={24}
              />
              <span>-</span>
              <TimeField
                label='clockOut'
                isDisabled={isOffEntry}
                defaultValue={clockOut}
                onChange={(time) =>
                  setCurrentLogbook({
                    ...currentLogbook,
                    clockOut: convertTimeToString(time),
                  })
                }
                locale='en-US'
                hourCycle={24}
              /> */}
                </div>
                {errors && errors.clock.length > 0 && (
                  <Label className='label text-destructive'>{errors.clock}</Label>
                )}
              </div>
              <Button variant='secondary' className='mt-6 w-full normal-case'>
                Update
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        {respMessage && respMessage.success && (
          <div className='bg-success text-success-content mt-4 rounded-xl px-4 py-2'>{`Successfully update logbook (${respMessage.message})`}</div>
        )}
        {respMessage && !respMessage.success && (
          <div className='bg-error text-error-content mt-4 rounded-xl px-4 py-2'>{`Update logbook failed (${respMessage.message})`}</div>
        )}
      </CardFooter>
    </Card>
  );
}
