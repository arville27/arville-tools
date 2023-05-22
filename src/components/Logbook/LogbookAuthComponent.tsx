import useLogbookStateStore from '@/components/Logbook/useLogbookStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { trpc } from '@/utils/trpc';
import { Label } from '@radix-ui/react-label';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export function LogbookAuthComponent() {
  const [jwt, setJwtLocalComponent] = useState('');
  const jwtGlobal = useLogbookStateStore((state) => state.jwt);
  const setJwtGlobal = useLogbookStateStore((state) => state.setJwt);
  const [user, setUser] = useState({ nim: '', password: '' });
  const [errMessage, setErrMessage] = useState('');
  const logbookAuth = trpc.logbook.auth.useMutation();

  useEffect(() => setJwtLocalComponent(jwtGlobal), [jwtGlobal]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((v) => ({ ...v, [name]: value }));
  }

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await logbookAuth.mutateAsync({ ...user });

    if (response.success) {
      setErrMessage('');
      setJwtGlobal(response.data);
    } else {
      setErrMessage(JSON.stringify(response.data));
    }
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <Card className='w-[22rem] md:w-[28rem]'>
        <CardHeader>
          <span className='block text-center text-2xl font-bold'>Authentication</span>
        </CardHeader>
        <CardContent className='space-y-5'>
          <div className='grid grid-rows-2'>
            <Label htmlFor='nim' className='font-bold'>
              NIM
            </Label>
            <Input
              name='nim'
              onChange={handleInputChange}
              id='nim'
              type='text'
              placeholder='NIM'
              className='w-full'
            />
          </div>

          <div className='grid grid-rows-2'>
            <Label htmlFor='password' className='font-bold'>
              Password
            </Label>
            <Input
              name='password'
              onChange={handleInputChange}
              id='password'
              type='password'
              placeholder='Password'
              className='w-full'
            />
          </div>

          <Button variant='secondary' type='submit' className='w-full normal-case'>
            Submit
          </Button>
        </CardContent>
        <CardFooter>
          {jwt && jwt.length > 0 && (
            <div className='grid w-full gap-2'>
              <Label htmlFor='jwt'>
                <div className='label-text font-bold'>Your token</div>
              </Label>
              <Textarea
                id='jwt'
                className='h-52 text-muted-foreground'
                readOnly={true}
                value={jwt}
              />
            </div>
          )}

          {errMessage && errMessage.length > 0 && (
            <div className='rounded-lg bg-destructive px-4 py-2 text-destructive-foreground'>
              <p className='font-bold'>Error message</p>
              <p>{errMessage}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
