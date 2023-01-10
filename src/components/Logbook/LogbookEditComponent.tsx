import { trpc } from "../../utils/trpc";
import TimeField from "../TimePicker/TimeField";
import useLogbookStateStore from "./useLogbookStore";
import { Time } from "@internationalized/date";
import { TimeValue } from "@react-types/datepicker";
import { format, parse } from "date-fns";
import { FormEvent, useState } from "react";

export default function LogbookEditComponent() {
  const updateLogbook = trpc.logbook.updateLogbook.useMutation();
  const [respMessage, setRespMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    clock: string;
    activity: string;
    description: string;
  }>({
    clock: "",
    activity: "",
    description: "",
  });

  const currentLogbook = useLogbookStateStore((state) => state.currentLogbook);
  const jwt = useLogbookStateStore((state) => state.jwt);
  const setCurrentLogbook = useLogbookStateStore(
    (state) => state.setCurrentLogbook
  );
  const [isOffEntry, setIsOffEntry] = useState(false);

  if (!jwt) {
    setCurrentLogbook(null);
    return <div>No JWT 😭</div>;
  }

  if (!currentLogbook) {
    return (
      <div className="text-medium w-[22rem] md:w-[30rem]">
        No logbook data, please generate a token then choose a logbook to edit
      </div>
    );
  }

  const [clockInHour, clockInMinute] = currentLogbook.clockIn
    .split(":")
    .map((n) => parseInt(n));

  const [clockOutHour, clockOutMinute] = currentLogbook.clockOut
    .split(":")
    .map((n) => parseInt(n));

  const clockIn = new Time(clockInHour, clockInMinute);
  const clockOut = new Time(clockOutHour, clockOutMinute);

  const dateFilled = parse(currentLogbook.dateFilled, "yyyy-MM-dd", new Date());

  function convertTimeToString(time: TimeValue) {
    return time ? time.toString().slice(0, -3) : "";
  }

  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentLogbook) return;

    let isError = false;
    if (currentLogbook.activity.length <= 1) {
      setErrors((v) => ({ ...v, activity: "Activity cannot be empty" }));
      isError = true;
    }
    if (currentLogbook.description.length <= 1) {
      setErrors((v) => ({ ...v, description: "Description cannot be empty" }));
      isError = true;
    }
    if (
      currentLogbook.clockIn.length == 0 ||
      currentLogbook.clockOut.length == 0
    ) {
      setErrors((v) => ({
        ...v,
        clock: "Clock in and clock out cannot be empty",
      }));
      isError = true;
    }

    if (isError) return;

    setErrors({ activity: "", clock: "", description: "" });

    if (isOffEntry) {
      setCurrentLogbook({
        ...currentLogbook,
        activity: "OFF",
        description: "OFF",
        clockIn: "OFF",
        clockOut: "OFF",
      });
    }

    const resp = await updateLogbook.mutateAsync({
      jwt,
      logbookData: currentLogbook,
    });

    setCurrentLogbook(null);
    setRespMessage({
      success: resp.success,
      message: resp.data,
    });
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <p className="mb-4 block text-center text-2xl font-bold">Edit logbook</p>
      <div className="flex w-[22rem] flex-col gap-4 rounded-xl bg-base-100 shadow-sm md:w-[30rem]">
        <div className="w-full rounded-t-xl bg-base-200 p-4">
          <div className="text-lg font-bold">{format(dateFilled, "eeee")}</div>
          <div className="text-lg font-bold">
            {format(dateFilled, "dd MMMM yyyy")}
          </div>
          <span className="text-sm text-base-content/80">
            {currentLogbook.dateFilled}
          </span>
        </div>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex-start form-control flex">
            <label className="flex cursor-pointer items-center gap-3">
              <span className="label-text">Set this log book entry to OFF</span>
              <input
                type="checkbox"
                className="checkbox-primary checkbox"
                onChange={(e) => setIsOffEntry(e.target.checked)}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="activity">
              <div className="label-text font-bold">Activity</div>
            </label>
            <textarea
              id="activity"
              disabled={isOffEntry}
              className={`textarea-bordered textarea-secondary textarea h-24 ${
                errors && errors.activity.length > 0 ? "border-error" : ""
              }`}
              defaultValue={currentLogbook.activity}
              onChange={(e) =>
                setCurrentLogbook({
                  ...currentLogbook,
                  activity: e.target.value,
                })
              }
            ></textarea>
            {errors && errors.activity.length > 0 && (
              <label className="label" htmlFor="activity">
                <div className="label-text text-error">{errors.activity}</div>
              </label>
            )}
          </div>
          <div className="form-control">
            <label className="label" htmlFor="description">
              <div className="label-text font-bold">Description</div>
            </label>
            <textarea
              id="description"
              disabled={isOffEntry}
              className={`textarea-bordered textarea-secondary textarea h-24 ${
                errors && errors.description.length > 0 ? "border-error" : ""
              }`}
              defaultValue={currentLogbook.description}
              onChange={(e) =>
                setCurrentLogbook({
                  ...currentLogbook,
                  description: e.target.value,
                })
              }
            ></textarea>
            {errors && errors.description.length > 0 && (
              <label className="label" htmlFor="activity">
                <div className="label-text text-error">
                  {errors.description}
                </div>
              </label>
            )}
          </div>
          <div>
            <div className="label">
              <span
                className={`label-text font-bold ${
                  errors && errors.clock.length > 0 ? "text-error" : ""
                }`}
              >
                Clock in - Clock out
              </span>
            </div>
            <div className="flex items-center gap-3">
              <TimeField
                label="clockIn"
                isDisabled={isOffEntry}
                defaultValue={clockIn}
                onChange={(time) =>
                  setCurrentLogbook({
                    ...currentLogbook,
                    clockIn: convertTimeToString(time),
                  })
                }
                locale="en-US"
                hourCycle={24}
              />
              <span>-</span>
              <TimeField
                label="clockOut"
                isDisabled={isOffEntry}
                defaultValue={clockOut}
                onChange={(time) =>
                  setCurrentLogbook({
                    ...currentLogbook,
                    clockOut: convertTimeToString(time),
                  })
                }
                locale="en-US"
                hourCycle={24}
              />
            </div>
            {errors && errors.clock.length > 0 && (
              <div className="label">
                <span className="label-text text-error">{errors.clock}</span>
              </div>
            )}
          </div>
          <button className="btn-secondary btn mt-6 w-full normal-case">
            Update
          </button>
          {respMessage && respMessage.success && (
            <div className="mt-4 rounded-xl bg-success px-4 py-2 text-success-content">{`Successfully update logbook (${respMessage.message})`}</div>
          )}
          {respMessage && !respMessage.success && (
            <div className="mt-4 rounded-xl bg-error px-4 py-2 text-error-content">{`Update logbook failed (${respMessage.message})`}</div>
          )}
        </div>
      </div>
    </form>
  );
}
