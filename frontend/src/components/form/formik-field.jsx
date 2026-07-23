import { useField } from 'formik';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/utils/cn';

export function FormikTextField({ label, className, ...props }) {
  const [field, meta] = useField(props);
  const showError = meta.touched && meta.error;

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <Label htmlFor={props.id || props.name} className="text-brand-text">
          {label}
        </Label>
      ) : null}
      <Input
        id={props.id || props.name}
        aria-invalid={showError ? 'true' : 'false'}
        className={showError ? 'border-destructive focus-visible:ring-destructive' : ''}
        {...field}
        {...props}
      />
      {showError ? <p className="text-sm text-destructive">{meta.error}</p> : null}
    </div>
  );
}

export function FormikSelectField({ label, children, className, ...props }) {
  const [field, meta] = useField(props);
  const showError = meta.touched && meta.error;

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <Label htmlFor={props.id || props.name} className="text-brand-text">
          {label}
        </Label>
      ) : null}
      <select
        id={props.id || props.name}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          showError && 'border-destructive focus-visible:ring-destructive',
        )}
        {...field}
        {...props}
      >
        {children}
      </select>
      {showError ? <p className="text-sm text-destructive">{meta.error}</p> : null}
    </div>
  );
}

export function FormikCheckboxField({ label, className, ...props }) {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  const showError = meta.touched && meta.error;

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <input
        id={props.id || props.name}
        type="checkbox"
        className="mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        {...field}
        {...props}
        checked={Boolean(field.value)}
      />
      <div className="space-y-1">
        {label ? (
          <Label htmlFor={props.id || props.name} className="font-normal text-brand-text">
            {label}
          </Label>
        ) : null}
        {showError ? <p className="text-sm text-destructive">{meta.error}</p> : null}
      </div>
    </div>
  );
}
