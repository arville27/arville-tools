import { logbookPerMonth } from "../../server/trpc/routers/logbook";
import { trpc } from "../../utils/trpc";
import useLogbookStateStore from "./useLogbookStore";
import { format, parse } from "date-fns";
import { z } from "zod";

type DailyCardProps = {
  uid: string;
  clockIn: string;
  clockOut: string;
  activity: string;
  description: string;
  dateFilled: string;
  onClick: (tabIndex: number) => void;
};

const LogbookDailyCard: React.FC<DailyCardProps> = (props) => {
  const setCurrentLogbook = useLogbookStateStore(
    (state) => state.setCurrentLogbook
  );

  const { clockIn, clockOut, activity, description, onClick } = props;

  const dateFilled = parse(props.dateFilled, "yyyy-MM-dd", new Date());

  return (
    <button
      onClick={() => {
        setCurrentLogbook(props);
        onClick(2);
      }}
      className="flex w-[22rem] flex-col justify-start rounded-xl bg-base-100 text-left shadow-sm outline-primary-focus md:w-[30rem]"
    >
      <div className="flex w-full items-center justify-between rounded-t-xl bg-base-200 p-4">
        <div>
          <div className="text-lg font-bold">
            {format(dateFilled, "eeee, dd MMMM yyyy")}
          </div>
          <span className="text-sm text-base-content/80">
            {props.dateFilled}
          </span>
        </div>
        <div className="max-w-fit rounded-full bg-accent py-2 px-4 text-sm font-medium text-accent-content">
          {clockIn.length == 0 && clockOut.length == 0
            ? "None"
            : `${clockIn} - ${clockOut}`}
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 p-4">
        <div>
          <div className="mb-1 font-bold">Activity</div>
          <div className="text-sm">
            {activity.length == 0 ? "None" : activity}
          </div>
        </div>
        <div>
          <div className="mb-1 font-bold">Description</div>
          <div className="text-sm">
            {description.length == 0 ? "None" : description}
          </div>
        </div>
      </div>
    </button>
  );
};

type Props = {
  onDailyLogbookCardClick: (tabIndex: number) => void;
};

const LogbookListComponent: React.FC<Props> = ({ onDailyLogbookCardClick }) => {
  const jwt = useLogbookStateStore((state) => state.jwt);
  const setJwt = useLogbookStateStore((state) => state.setJwt);
  const setCurrentLogbook = useLogbookStateStore(
    (state) => state.setCurrentLogbook
  );

  const logbookData = trpc.logbook.getLogbookData.useQuery(
    { jwt },
    { enabled: Boolean(jwt) }
  );

  if (!jwt) {
    setCurrentLogbook(null);
    return <div>No JWT 😭</div>;
  }

  let content = null;

  if (!logbookData.data) {
    content = (
      <div className="min-w-full py-4">
        <progress className="progress progress-primary"></progress>
      </div>
    );
  } else {
    if (logbookData.data.success) {
      content = (
        <div>
          {/* <div className="relative">
            <Example />
          </div> */}
          <div>
            {(logbookData.data.data as z.infer<typeof logbookPerMonth>[])
              .slice(-1)
              .map((logbookMonth, index) => (
                <div className="flex flex-col items-center" key={index}>
                  <p className="mb-4 text-2xl font-bold">
                    {format(
                      parse(
                        `${logbookMonth.month} - ${logbookMonth.year}`,
                        "M - yyyy",
                        new Date()
                      ),
                      "MMMM yyyy"
                    )}
                  </p>
                  <div className="mb-10 flex flex-col gap-3 lg:grid lg:grid-cols-2">
                    {logbookMonth.log_book_month_details.map((dailyLogbook) => (
                      <LogbookDailyCard
                        onClick={onDailyLogbookCardClick}
                        key={dailyLogbook.uid}
                        uid={dailyLogbook.uid}
                        activity={dailyLogbook.activity}
                        clockIn={dailyLogbook.clock_in}
                        clockOut={dailyLogbook.clock_out}
                        dateFilled={dailyLogbook.date_filled}
                        description={dailyLogbook.description}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    } else {
      setJwt("");
      content = (
        <div className="rounded-lg bg-error py-2 px-4 text-error-content">
          <p className="font-bold">Error message</p>
          <p>{logbookData.data.data as string}</p>
        </div>
      );
    }
  }

  return content;
};

export default LogbookListComponent;
