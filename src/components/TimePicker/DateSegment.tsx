import { useRef } from "react";
import { useDateSegment } from "@react-aria/datepicker";
import { DateFieldState, DateSegment } from "@react-stately/datepicker";

type Props = {
  segment: DateSegment;
  state: DateFieldState;
};

const DateSegment: React.FC<Props> = ({ segment, state }) => {
  let ref = useRef(null);
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        minWidth:
          segment.maxValue != null
            ? String(segment.maxValue).length + "ch"
            : "auto",
      }}
      className={`group box-content rounded-sm px-0.5 text-right tabular-nums outline-none focus:bg-secondary-focus/20 focus:text-base-content ${
        !segment.isEditable ? "text-gray-500" : "text-base-content"
      }`}
    >
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <span
        aria-hidden="true"
        className="block w-full text-center italic text-gray-500 group-focus:text-white"
        style={{
          visibility: segment.isPlaceholder ? "visible" : "hidden",
          height: segment.isPlaceholder ? "" : 0,
          pointerEvents: "none",
        }}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? "" : segment.text}
    </div>
  );
};

export default DateSegment;
