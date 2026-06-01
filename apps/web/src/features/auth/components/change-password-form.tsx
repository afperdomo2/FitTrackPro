'use client';

import { Button, Card, Input, Label, TextField } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useChangePassword } from '../api';
import { changePasswordSchema, type ChangePasswordFormData } from '../validators';
import { useAuth } from '../hooks/use-auth';

export function ChangePasswordForm() {
  const { updateToken } = useAuth();
  const changePassword = useChangePassword();

  const { handleSubmit, watch, setValue, setError, reset, formState } =
    useForm<ChangePasswordFormData>({
      resolver: zodResolver(changePasswordSchema),
      mode: 'onChange',
      defaultValues: { old_password: '', new_password: '', confirm_password: '' },
    });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const result = await changePassword.mutateAsync({
        old_password: data.old_password,
        new_password: data.new_password,
      });
      updateToken(result.token);
      reset({ old_password: '', new_password: '', confirm_password: '' });
      toast.success('Contraseña actualizada correctamente');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar contraseña';
      setError('root', { message });
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md border border-border/50 shadow-sm">
      <Card.Header>
        <Card.Title className="font-display">Cambiar contraseña</Card.Title>
      </Card.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="flex flex-col gap-4">
          <div className="animate-fade-in-up delay-100">
            <TextField
              className="w-full"
              name="old_password"
              type="password"
              variant="secondary"
              isInvalid={!!formState.errors.old_password}
            >
              <Label>Contraseña actual</Label>
              <Input
                placeholder="••••••••"
                value={watch('old_password')}
                onChange={(e) => setValue('old_password', e.target.value, { shouldValidate: true })}
              />
            </TextField>
            {formState.errors.old_password && (
              <p className="text-xs text-danger -mt-3 animate-fade-in">
                {formState.errors.old_password.message}
              </p>
            )}
          </div>

          <div className="animate-fade-in-up delay-200">
            <TextField
              className="w-full"
              name="new_password"
              type="password"
              variant="secondary"
              isInvalid={!!formState.errors.new_password}
            >
              <Label>Nueva contraseña</Label>
              <Input
                placeholder="Mín. 8 caracteres"
                value={watch('new_password')}
                onChange={(e) => setValue('new_password', e.target.value, { shouldValidate: true })}
              />
            </TextField>
            {formState.errors.new_password && (
              <p className="text-xs text-danger -mt-3 animate-fade-in">
                {formState.errors.new_password.message}
              </p>
            )}
          </div>

          <div className="animate-fade-in-up delay-300">
            <TextField
              className="w-full"
              name="confirm_password"
              type="password"
              variant="secondary"
              isInvalid={!!formState.errors.confirm_password}
            >
              <Label>Confirmar nueva contraseña</Label>
              <Input
                placeholder="Repite la nueva contraseña"
                value={watch('confirm_password')}
                onChange={(e) =>
                  setValue('confirm_password', e.target.value, { shouldValidate: true })
                }
              />
            </TextField>
            {formState.errors.confirm_password && (
              <p className="text-xs text-danger -mt-3 animate-fade-in">
                {formState.errors.confirm_password.message}
              </p>
            )}
          </div>

          {formState.errors.root && (
            <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger animate-fade-in">
              <Icon icon="lucide:alert-circle" className="size-4 shrink-0" />
              <span>{formState.errors.root.message}</span>
            </div>
          )}
        </Card.Content>
        <Card.Footer className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            isDisabled={formState.isSubmitting}
            className="font-medium"
          >
            <Icon icon="lucide:key-round" className="size-4" />
            {formState.isSubmitting ? 'Cambiando…' : 'Cambiar contraseña'}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
}
