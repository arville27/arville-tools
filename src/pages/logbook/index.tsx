import { Layout } from '@/components/Layout';
import { LogbookAuthComponent } from '@/components/Logbook/LogbookAuthComponent';
import { LogbookEditComponent } from '@/components/Logbook/LogbookEditComponent';
import { LogbookListComponent } from '@/components/Logbook/LogbookListComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useState } from 'react';

export default function LogbookPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Layout
      pageTitle='Logbook'
      className='container mx-auto mt-12 flex flex-col items-center'>
      <Tabs defaultValue='auth' className='w-full'>
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
            <LogbookListComponent onDailyLogbookCardClick={setSelectedIndex} />
          </TabsContent>
          <TabsContent value='logbook-edit'>
            <LogbookEditComponent />
          </TabsContent>
        </div>
      </Tabs>
    </Layout>
  );
}
