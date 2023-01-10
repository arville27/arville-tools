import { useRef } from "react";
import { useLocale } from "@react-aria/i18n";
import {
  TimeFieldStateOptions,
  useTimeFieldState,
} from "@react-stately/datepicker";
import { useTimeField } from "@react-aria/datepicker";
import DateSegment from "./DateSegment";

const TimeField: React.FC<TimeFieldStateOptions> = (props) => {
  let { locale } = useLocale();
  let state = useTimeFieldState({
    ...props,
    locale,
  });

  const ref = useRef(null);
  const { labelProps, fieldProps } = useTimeField(props, state, ref);

  return (
    <div className="flex flex-col items-start">
      <span {...labelProps} className="sr-only">
        {props.label}
      </span>
      <div
        {...fieldProps}
        ref={ref}
        className={`flex rounded-md py-1 px-2 focus-within:border-secondary hover:border-secondary focus-within:hover:border-secondary ${
          props.isDisabled ? "bg-base-200" : "border border-secondary"
        }`}
      >
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    </div>
  );
};

export default TimeField;
