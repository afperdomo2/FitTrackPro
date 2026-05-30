'use client';

import { Input } from '@heroui/react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  isDisabled?: boolean;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  isDisabled,
}: FormFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
        type={type}
        placeholder={placeholder}
        disabled={isDisabled}
      />
      {error && <p className="text-xs text-danger">{error.message}</p>}
    </div>
  );
}
