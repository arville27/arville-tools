import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Textarea } from '@/components/ui/Textarea';
import { useMounted } from '@/utils/hooks/useMounted';
import { zodResolver } from '@hookform/resolvers/zod';
import { Time } from '@internationalized/date';
import { Label } from '@radix-ui/react-label';
import { TimeValue } from '@react-aria/datepicker';
import { format, parse } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import { TimeField } from '../TimePicker/TimeField';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/Form';
import { LogbookDataSchema, useLogbookStore } from './useLogbookStore';

const logbookDataFormSchema = z.object({
  description: z.string(),
  activity: z.string(),
  clock: z.string(),
});

type LogbookDataForm = z.infer<typeof logbookDataFormSchema>;

export function LogbookEditComponent() {
  const isMounted = useMounted();

  const form = useForm<LogbookDataForm>({
    resolver: zodResolver(LogbookDataSchema),
  });

  const updateLogbook = trpc.logbook.updateLogbook.useMutation();
  const [respMessage, setRespMessage] = useState<{
    success: boolean;
    message: string;
  }>();

  const currentLogbook = useLogbookStore((state) => state.currentLogbook);
  const jwt = useLogbookStore((state) => state.jwt);
  const setCurrentLogbook = useLogbookStore((state) => state.setCurrentLogbook);
  const [isOffEntry, setIsOffEntry] = useState(false);

  if (!isMounted) return null;

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

  const clockIn = new Time(clockInHour, clockInMinute);
  const clockOut = new Time(clockOutHour, clockOutMinute);

  const dateFilled = parse(currentLogbook.dateFilled, 'yyyy-MM-dd', new Date());

  function convertTimeToString(time: TimeValue) {
    return time ? time.toString().slice(0, -3) : '';
  }

  async function handleOnSubmit(values: LogbookDataForm) {
    // if (isOffEntry) {
    //   setCurrentLogbook({
    //     ...currentLogbook,
    //     activity: 'OFF',
    //     description: 'OFF',
    //     clockIn: 'OFF',
    //     clockOut: 'OFF',
    //   });
    // }
    // const resp = await updateLogbook.mutateAsync({
    //   jwt,
    //   logbookData: currentLogbook,
    // });
    // setCurrentLogbook(null);
    // setRespMessage({
    //   success: true,
    //   message: resp.data,
    // });
  }

  return (
    <Card>
      <CardHeader>
        <p className='block text-center text-2xl font-bold'>Edit logbook</p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
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
                          typeof e.valueOf() === 'string'
                            ? false
                            : (e.valueOf() as boolean)
                        )
                      }
                    />
                    Set this log book entry to OFF
                  </Label>
                </div>

                <FormField
                  control={form.control}
                  name='activity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity</FormLabel>
                      <FormControl>
                        <Textarea disabled={isOffEntry} {...field} />
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
                <FormField
                  control={form.control}
                  name='clock'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clock in - Clock out</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-3'>
                          <TimeField
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
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant='secondary' className='mt-6 w-full normal-case'>
                  Update
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        {respMessage && respMessage.success && (
          <div className='mt-4 rounded-xl px-4 py-2'>{`Successfully update logbook (${respMessage.message})`}</div>
        )}
        {respMessage && !respMessage.success && (
          <div className='mt-4 rounded-xl bg-destructive px-4 py-2 text-destructive-foreground'>{`Update logbook failed (${respMessage.message})`}</div>
        )}
      </CardFooter>
    </Card>
  );
}
