import { useLogbookStore } from '@/components/Logbook/useLogbookStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useMounted } from '@/utils/hooks/useMounted';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const authFormSchema = z.object({
  nim: z.string().regex(/[0-9]{10}/, {
    message: 'NIM must be exactly 10 digits number',
  }),
  password: z.string(),
});

export function LogbookAuthComponent() {
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      nim: '',
      password: '',
    },
  });

  const isMounted = useMounted();
  const [jwt, setJwt] = useLogbookStore((state) => [state.jwt, state.setJwt]);

  const [errMessage, setErrMessage] = useState('');
  const logbookAuth = trpc.logbook.auth.useMutation();

  if (!isMounted) return null;

  function handleOnSubmit(values: z.infer<typeof authFormSchema>) {
    logbookAuth.mutate(values, {
      onSuccess: (data) => {
        setJwt(data.accessToken);
        setErrMessage('');
      },
      onError: (error) => {
        setJwt('');
        setErrMessage(error.message);
      },
    });
  }

  return (
    <Card className='w-[22rem] md:w-[28rem]'>
      <CardHeader>
        <span className='block text-center text-2xl font-bold'>Authentication</span>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <div className='space-y-5'>
              <FormField
                control={form.control}
                name='nim'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student&apos;s NIM</FormLabel>
                    <FormControl>
                      <Input placeholder='NIM' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant='secondary' type='submit' className='w-full normal-case'>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        {jwt.length > 0 && (
          <div className='grid w-full gap-2'>
            <Label htmlFor='jwt'>
              <div className='font-bold'>Your token</div>
            </Label>
            <Textarea
              id='jwt'
              className='h-52 text-muted-foreground'
              readOnly={true}
              value={jwt}
            />
          </div>
        )}

        {errMessage.length > 0 && (
          <div className='w-full rounded-lg bg-destructive px-4 py-2 text-destructive-foreground'>
            <p className='font-bold'>Error message</p>
            <p>{errMessage}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
