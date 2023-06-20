import { Layout } from '@/components/Layout';
import { LogbookAuthComponent } from '@/components/Logbook/LogbookAuthComponent';
import { LogbookEditComponent } from '@/components/Logbook/LogbookEditComponent';
import { LogbookListComponent } from '@/components/Logbook/LogbookListComponent';
import { AvailableTab, useLogbookStore } from '@/components/Logbook/useLogbookStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useMounted } from '@/utils/hooks/useMounted';

export default function LogbookPage() {
  const activeTab = useLogbookStore((s) => s.activeTab);
  const setActiveTab = useLogbookStore((s) => s.setActiveTab);

  const isMounted = useMounted();

  if (!isMounted) return null;

  return (
    <Layout
      pageTitle='Logbook'
      className='container mx-auto mt-12 flex flex-col items-center'>
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as AvailableTab)}
        className='w-full'>
        <TabsList className='mx-auto grid w-[32rem] grid-cols-3'>
          <TabsTrigger value='auth'>Authentication</TabsTrigger>
          <TabsTrigger value='logbook-data'>Get logbook data</TabsTrigger>
          <TabsTrigger value='logbook-edit'>Update logbook</TabsTrigger>
        </TabsList>
        <div className='mt-10 flex justify-center'>
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
