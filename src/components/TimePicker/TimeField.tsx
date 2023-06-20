import { useTimeField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { TimeFieldStateOptions, useTimeFieldState } from '@react-stately/datepicker';
import clsx from 'clsx';
import { useRef } from 'react';
import { TimeSegment } from './TimeSegment';

export const TimeField: React.FC<TimeFieldStateOptions> = (props) => {
  let { locale } = useLocale();
  let state = useTimeFieldState({
    ...props,
    locale,
  });

  const ref = useRef(null);
  const { labelProps, fieldProps } = useTimeField(props, state, ref);

  return (
    <div className='flex flex-col items-start'>
      <span {...labelProps} className='sr-only'>
        {props.label}
      </span>
      <div
        {...fieldProps}
        ref={ref}
        className={clsx('flex rounded-md border p-1', {
          'bg-muted text-muted-foreground': props.isDisabled,
        })}>
        {state.segments.map((segment, i) => (
          <TimeSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    </div>
  );
};
