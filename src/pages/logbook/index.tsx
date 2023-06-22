import { Layout } from '@/components/Layout';
import { LogbookAuthComponent } from '@/components/Logbook/LogbookAuthComponent';
import { LogbookEditComponent } from '@/components/Logbook/LogbookEditComponent';
import { LogbookListComponent } from '@/components/Logbook/LogbookListComponent';
import { AvailableTab, useLogbookStore } from '@/components/Logbook/useLogbookStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useMounted } from '@/utils/hooks/useMounted';
import { BookIcon, FingerprintIcon, PencilIcon } from 'lucide-react';

export default function LogbookPage() {
  const activeTab = useLogbookStore((s) => s.activeTab);
  const setActiveTab = useLogbookStore((s) => s.setActiveTab);

  const isMounted = useMounted();

  if (!isMounted) return null;

  return (
    <Layout
      pageTitle='Logbook'
      className='container mx-auto mt-12 flex flex-col items-center px-[1rem]'>
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as AvailableTab)}
        className='w-full'>
        <TabsList className='mx-auto grid w-fit flex-1 grid-cols-3'>
          <TabsTrigger value='auth'>
            <div className='flex items-center gap-2'>
              <FingerprintIcon size={16} />
              <span className='hidden sm:block'>Authentication</span>
              <span className='block sm:hidden'>Auth</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value='logbook-data'>
            <div className='flex items-center gap-2'>
              <BookIcon size={16} />
              <span className='hidden sm:block'>Get logbook data</span>
              <span className='block sm:hidden'>List</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value='logbook-edit'>
            <div className='flex items-center gap-2'>
              <PencilIcon size={16} />
              <span className='hidden sm:block'>Update logbook</span>
              <span className='block sm:hidden'>Update</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <div className='mt-10'>
          <TabsContent value='auth'>
            <LogbookAuthComponent />
          </TabsContent>
          <TabsContent value='logbook-data'>
            <LogbookListComponent />
          </TabsContent>
          <TabsContent value='logbook-edit'>
            <LogbookEditComponent />
          </TabsContent>
        </div>
      </Tabs>
    </Layout>
  );
}
