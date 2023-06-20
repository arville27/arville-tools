import { useDateSegment } from '@react-aria/datepicker';
import { DateFieldState, DateSegment } from '@react-stately/datepicker';
import clsx from 'clsx';
import { useRef } from 'react';

type Props = {
  segment: DateSegment;
  state: DateFieldState;
};

export const TimeSegment: React.FC<Props> = ({ segment, state }) => {
  let ref = useRef(null);
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        minWidth:
          segment.maxValue != null ? String(segment.maxValue).length + 'ch' : 'auto',
      }}
      className={clsx(
        'rounded-sm px-0.5 text-right tabular-nums outline-none ring-ring focus:bg-accent focus:ring-2',
        {
          'text-muted-foreground': !segment.isEditable,
        }
      )}>
      <span
        aria-hidden='true'
        className='block w-full text-center italic text-gray-500 group-focus:text-white'
        style={{
          visibility: segment.isPlaceholder ? 'visible' : 'hidden',
          height: segment.isPlaceholder ? '' : 0,
          pointerEvents: 'none',
        }}>
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? '' : segment.text}
    </div>
  );
};
