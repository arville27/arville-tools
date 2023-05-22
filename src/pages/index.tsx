import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <Layout
      pageTitle='Arville Tools'
      className='container mx-auto mt-32 flex flex-col items-center'>
      <div className='text-center'>
        <div className='max-w-md'>
          <h1 className='text-5xl normal-case tracking-wider'>arville tools</h1>
          <p className='py-6'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque eius incidunt
            accusantium impedit ut modi, vitae iure temporibus alias blanditiis fugit
            deleniti non qui asperiores mollitia delectus pariatur, autem excepturi.
          </p>
          <Button className='btn-primary btn'>Get Started</Button>
        </div>
      </div>
    </Layout>
  );
}
