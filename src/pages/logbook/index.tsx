import { Tab } from "@headlessui/react";
import { useState } from "react";
import LogbookAuthComponent from "../../components/Logbook/LogbookAuthComponent";
import LogbookEditComponent from "../../components/Logbook/LogbookEditComponent";
import LogbookListComponent from "../../components/Logbook/LogbookListComponent";
import MainLayout from "../../components/MainLayout";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LogbookPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <MainLayout pageTitle="Logbook">
      <div className="container mx-auto flex flex-col items-center">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex w-[23.5rem] space-x-1 rounded-lg bg-base-200 text-sm md:w-[40rem]">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-4 font-medium leading-5 text-base-content ring-primary-focus focus:outline-none focus:ring-2",
                  selected
                    ? "bg-primary text-primary-content shadow"
                    : "text-base-content hover:bg-base-100/90 hover:text-base-content"
                )
              }
            >
              Authentication
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-4 font-medium leading-5 text-base-content ring-primary-focus focus:outline-none focus:ring-2",
                  selected
                    ? "bg-primary text-primary-content shadow"
                    : "text-base-content hover:bg-base-100/90 hover:text-base-content"
                )
              }
            >
              Get logbook data
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-4 font-medium leading-5 text-base-content ring-primary-focus focus:outline-none focus:ring-2",
                  selected
                    ? "bg-primary text-primary-content shadow"
                    : "text-base-content hover:bg-base-100/90 hover:text-base-content"
                )
              }
            >
              Update logbook
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-12">
            <Tab.Panel className="outline-none">
              <LogbookAuthComponent />
            </Tab.Panel>
            <Tab.Panel className="outline-none">
              <LogbookListComponent
                onDailyLogbookCardClick={setSelectedIndex}
              />
            </Tab.Panel>
            <Tab.Panel className="outline-none">
              <LogbookEditComponent />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </MainLayout>
  );
}
