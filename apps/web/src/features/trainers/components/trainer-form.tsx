'use client';

import { useEffect } from 'react';
import { Button, Input, Label, Modal, Switch, TextField } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCreateTrainer, useUpdateTrainer } from '../api';
import {
  createTrainerSchema,
  updateTrainerSchema,
  type CreateTrainerFormData,
  type UpdateTrainerFormData,
} from '../validators';
import type { TrainerRow } from '../types';

interface TrainerFormProps {
  isOpen: boolean;
  onClose: () => void;
  trainer?: TrainerRow;
}

export function TrainerForm({ isOpen, onClose, trainer }: TrainerFormProps) {
  const isEdit = !!trainer;
  const createTrainer = useCreateTrainer();
  const updateTrainer = useUpdateTrainer();

  const createForm = useForm<CreateTrainerFormData>({
    resolver: zodResolver(createTrainerSchema),
    mode: 'onChange',
    defaultValues: { email: '', name: '', speciality: '' },
  });

  const updateForm = useForm<UpdateTrainerFormData>({
    resolver: zodResolver(updateTrainerSchema),
    mode: 'onChange',
    defaultValues: {
      name: trainer?.name ?? '',
      is_active: trainer?.is_active ?? true,
      speciality: trainer?.speciality ?? '',
    },
  });

  const isActiveController = useController({
    control: updateForm.control,
    name: 'is_active',
  });

  useEffect(() => {
    if (isOpen) {
      createForm.reset({ email: '', name: '', speciality: '' });
    }
  }, [isOpen]);

  useEffect(() => {
    if (trainer) {
      updateForm.reset({
        name: trainer.name,
        is_active: trainer.is_active,
        speciality: trainer.speciality ?? '',
      });
    } else {
      updateForm.reset({ name: '', is_active: true, speciality: '' });
    }
  }, [trainer]);

  const handleCreate = async (data: CreateTrainerFormData) => {
    try {
      await createTrainer.mutateAsync(data);
      toast.success('Entrenador creado correctamente');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear entrenador';
      toast.error(message);
    }
  };

  const handleUpdate = async (data: UpdateTrainerFormData) => {
    if (!trainer) return;
    try {
      await updateTrainer.mutateAsync({ id: trainer.id, ...data });
      toast.success('Entrenador actualizado correctamente');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar entrenador';
      toast.error(message);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="animate-scale-in">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="font-display">
                {isEdit ? 'Editar entrenador' : 'Crear entrenador'}
              </Modal.Heading>
            </Modal.Header>

            {isEdit ? (
              <form onSubmit={updateForm.handleSubmit(handleUpdate)}>
                <Modal.Body className="flex flex-col gap-4">
                  <TextField
                    className="w-full"
                    name="name"
                    variant="secondary"
                    isInvalid={!!updateForm.formState.errors.name}
                  >
                    <Label>
                      Nombre <span className="text-danger ml-0.5">*</span>
                    </Label>
                    <Input
                      placeholder="Nombre completo"
                      value={updateForm.watch('name')}
                      onChange={(e) =>
                        updateForm.setValue('name', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>
                  {updateForm.formState.errors.name && (
                    <p className="text-xs text-danger -mt-3">
                      {updateForm.formState.errors.name.message}
                    </p>
                  )}

                  <TextField className="w-full" name="speciality" variant="secondary">
                    <Label>Especialidad</Label>
                    <Input
                      placeholder="Ej. Nutrición deportiva"
                      value={updateForm.watch('speciality') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('speciality', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <Switch
                    isSelected={isActiveController.field.value}
                    onChange={(v) => isActiveController.field.onChange(v)}
                  >
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Content>
                      <Label className="text-sm">Activo</Label>
                    </Switch.Content>
                  </Switch>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="tertiary" slot="close">
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isDisabled={updateForm.formState.isSubmitting}
                  >
                    <Icon icon="lucide:save" className="size-4" />
                    {updateForm.formState.isSubmitting ? 'Actualizando…' : 'Actualizar'}
                  </Button>
                </Modal.Footer>
              </form>
            ) : (
              <form onSubmit={createForm.handleSubmit(handleCreate)}>
                <Modal.Body className="flex flex-col gap-4">
                  <TextField
                    className="w-full"
                    name="email"
                    type="email"
                    variant="secondary"
                    isInvalid={!!createForm.formState.errors.email}
                  >
                    <Label>
                      Email <span className="text-danger ml-0.5">*</span>
                    </Label>
                    <Input
                      placeholder="correo@ejemplo.com"
                      value={createForm.watch('email')}
                      onChange={(e) =>
                        createForm.setValue('email', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>
                  {createForm.formState.errors.email && (
                    <p className="text-xs text-danger -mt-3">
                      {createForm.formState.errors.email.message}
                    </p>
                  )}

                  <TextField
                    className="w-full"
                    name="name"
                    variant="secondary"
                    isInvalid={!!createForm.formState.errors.name}
                  >
                    <Label>
                      Nombre <span className="text-danger ml-0.5">*</span>
                    </Label>
                    <Input
                      placeholder="Nombre completo"
                      value={createForm.watch('name')}
                      onChange={(e) =>
                        createForm.setValue('name', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>
                  {createForm.formState.errors.name && (
                    <p className="text-xs text-danger -mt-3">
                      {createForm.formState.errors.name.message}
                    </p>
                  )}

                  <TextField className="w-full" name="speciality" variant="secondary">
                    <Label>Especialidad</Label>
                    <Input
                      placeholder="Ej. Nutrición deportiva"
                      value={createForm.watch('speciality') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('speciality', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="tertiary" slot="close">
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isDisabled={createForm.formState.isSubmitting}
                  >
                    <Icon icon="lucide:save" className="size-4" />
                    {createForm.formState.isSubmitting ? 'Creando…' : 'Crear entrenador'}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
