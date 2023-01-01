import MainLayout from "../components/MainLayout";

export default function Home() {
  return (
    <MainLayout pageTitle="Arville Tools">
      <div className="container mx-auto mt-32 flex flex-col items-center">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl normal-case tracking-wider">
              arville tools
            </h1>
            <p className="py-6">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque
              eius incidunt accusantium impedit ut modi, vitae iure temporibus
              alias blanditiis fugit deleniti non qui asperiores mollitia
              delectus pariatur, autem excepturi.
            </p>
            <button className="btn-primary btn">Get Started</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
