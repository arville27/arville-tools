import { TimeField } from '@/components/TimePicker/TimeField';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Textarea } from '@/components/ui/Textarea';
import { useMounted } from '@/utils/hooks/useMounted';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { Time } from '@internationalized/date';
import { Label } from '@radix-ui/react-label';
import { TimeValue } from '@react-aria/datepicker';
import * as dfs from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/Form';
import { useLogbookStore } from './useLogbookStore';

const logbookDataFormSchema = z.object({
  activity: z.string().nonempty('Activity cannot be empty'),
  description: z.string().nonempty('Description cannot be empty'),
});

type LogbookDataForm = z.infer<typeof logbookDataFormSchema>;

export function LogbookEditComponent() {
  const isMounted = useMounted();

  const updateLogbook = trpc.logbook.updateLogbook.useMutation();

  const [respMessage, setRespMessage] = useState('');
  const currentLogbook = useLogbookStore((state) => state.currentLogbook);
  const jwt = useLogbookStore((state) => state.jwt);
  const setCurrentLogbook = useLogbookStore((state) => state.setCurrentLogbook);
  const setActiveTab = useLogbookStore((state) => state.setActiveTab);

  const [isOffEntry, setIsOffEntry] = useState(false);
  const [clockErrorMsg, setClockErrorMsg] = useState('');

  const form = useForm<LogbookDataForm>({
    resolver: zodResolver(logbookDataFormSchema),
    defaultValues: {
      activity: currentLogbook?.activity,
      description: currentLogbook?.description,
    },
  });

  if (!isMounted) return null;

  if (!jwt) {
    setCurrentLogbook(null);
    return <div className='text-center text-muted-foreground'>No JWT 😭</div>;
  }

  if (!currentLogbook) {
    return (
      <div className='mx-auto max-w-sm text-center text-muted-foreground'>
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

  const clockIn = new Time(clockInHour, clockInMinute);
  const clockOut = new Time(clockOutHour, clockOutMinute);

  const dateFilled = dfs.parse(currentLogbook.dateFilled, 'yyyy-MM-dd', new Date());

  function convertTimeToString(time: TimeValue) {
    return time ? time.toString().slice(0, -3) : '';
  }

  function handleOnSubmit(values: LogbookDataForm) {
    if (!currentLogbook || clockErrorMsg.length > 0) return;

    if (currentLogbook.clockIn.length == 0 || currentLogbook.clockOut.length == 0) {
      setClockErrorMsg('Clock in and clock out cannot be empty');
      return;
    }

    const logbookData = {
      ...currentLogbook,
      activity: isOffEntry ? 'OFF' : values.activity,
      description: isOffEntry ? 'OFF' : values.description,
      clock_in: isOffEntry ? 'OFF' : currentLogbook.clockIn,
      clock_out: isOffEntry ? 'OFF' : currentLogbook.clockOut,
    };

    updateLogbook.mutate(
      {
        jwt,
        logbookData,
      },
      {
        onSuccess: () => {
          setActiveTab('logbook-data');
          setCurrentLogbook(null);
        },
        onError: (e) => setRespMessage(e.message),
      }
    );
  }

  return (
    <Card className='mx-auto max-w-[33rem]'>
      <CardHeader>
        <p className='block text-center text-2xl font-bold'>Edit logbook</p>
      </CardHeader>

      <CardContent className='px-4'>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isOffEntry) handleOnSubmit(form.getValues());
              else form.handleSubmit(handleOnSubmit)(e);
            }}>
            <div className='flex flex-col gap-4 rounded-xl'>
              <div className='w-full rounded-t-xl p-4'>
                <div className='text-lg font-bold'>{dfs.format(dateFilled, 'eeee')}</div>
                <div className='font-medium'>
                  {dfs.format(dateFilled, 'dd MMMM yyyy')}
                </div>
                <span className='text-sm text-muted-foreground'>
                  {currentLogbook.dateFilled}
                </span>
              </div>

              <div className='flex flex-col gap-4 px-4 pb-4'>
                <div className='flex items-center gap-3'>
                  <Checkbox
                    onCheckedChange={(e) => {
                      const isChecked =
                        typeof e.valueOf() === 'string'
                          ? false
                          : (e.valueOf() as boolean);
                      setIsOffEntry(isChecked);
                      if (isChecked) {
                        form.setValue('activity', 'OFF');
                        form.setValue('description', 'OFF');
                      } else {
                        form.setValue('activity', currentLogbook.activity);
                        form.setValue('description', currentLogbook.description);
                      }
                    }}
                  />
                  <Label className='text-sm'>Set this log book entry to OFF</Label>
                </div>

                <FormField
                  control={form.control}
                  name='activity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isOffEntry} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea disabled={isOffEntry} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Label>Clock in - Clock out</Label>
                <div className='flex items-center gap-3'>
                  <TimeField
                    label='clockIn'
                    isDisabled={isOffEntry}
                    defaultValue={clockIn}
                    onChange={(time) => {
                      const timeString = convertTimeToString(time);
                      if (timeString.length == 0 || currentLogbook.clockOut.length == 0)
                        setClockErrorMsg('Clock in and clock out cannot be empty');
                      else setClockErrorMsg('');
                      setCurrentLogbook({
                        ...currentLogbook,
                        clockIn: timeString,
                      });
                    }}
                    locale='en-US'
                    hourCycle={24}
                  />
                  <span>-</span>
                  <TimeField
                    label='clockOut'
                    isDisabled={isOffEntry}
                    defaultValue={clockOut}
                    onChange={(time) => {
                      const timeString = convertTimeToString(time);
                      if (timeString.length == 0 || currentLogbook.clockIn.length == 0)
                        setClockErrorMsg('Clock in and clock out cannot be empty');
                      else setClockErrorMsg('');
                      setCurrentLogbook({
                        ...currentLogbook,
                        clockOut: timeString,
                      });
                    }}
                    locale='en-US'
                    hourCycle={24}
                  />
                </div>
                {clockErrorMsg.length > 0 && (
                  <p className='text-sm font-medium text-destructive'>{clockErrorMsg}</p>
                )}
                <Button
                  type='submit'
                  variant='secondary'
                  className='mt-6 w-full normal-case'>
                  Update
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        {respMessage.length > 0 && (
          <div className='mt-4 flex flex-col rounded-xl bg-destructive px-4 py-2 text-destructive-foreground'>
            <span>Update logbook failed</span>
            <span>{respMessage}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
