'use client';

import { useEffect } from 'react';
import { Button, Input, Label, Modal, Switch, TextField } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCreateClient, useUpdateClient } from '../api';
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientFormData,
  type UpdateClientFormData,
} from '../validators';
import type { ClientRow } from '../types';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client?: ClientRow;
}

export function ClientForm({ isOpen, onClose, client }: ClientFormProps) {
  const isEdit = !!client;
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const createForm = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      goal: '',
      fitness_level: '',
      weight: '',
      height: '',
      birth_date: '',
    },
  });

  const updateForm = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientSchema),
    mode: 'onChange',
    defaultValues: {
      name: client?.name ?? '',
      is_active: client?.is_active ?? true,
      goal: client?.goal ?? '',
      fitness_level: client?.fitness_level ?? '',
      weight: client?.weight ? String(client.weight) : '',
      height: client?.height ? String(client.height) : '',
      birth_date: client?.birth_date ?? '',
    },
  });

  const isActiveController = useController({
    control: updateForm.control,
    name: 'is_active',
  });

  useEffect(() => {
    if (isOpen) {
      createForm.reset({
        email: '',
        name: '',
        goal: '',
        fitness_level: '',
        weight: '',
        height: '',
        birth_date: '',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (client) {
      updateForm.reset({
        name: client.name,
        is_active: client.is_active,
        goal: client.goal ?? '',
        fitness_level: client.fitness_level ?? '',
        weight: client.weight ? String(client.weight) : '',
        height: client.height ? String(client.height) : '',
        birth_date: client.birth_date ?? '',
      });
    } else {
      updateForm.reset({
        name: '',
        is_active: true,
        goal: '',
        fitness_level: '',
        weight: '',
        height: '',
        birth_date: '',
      });
    }
  }, [client]);

  const handleCreate = async (data: CreateClientFormData) => {
    try {
      await createClient.mutateAsync(data);
      toast.success('Cliente creado correctamente');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear cliente';
      toast.error(message);
    }
  };

  const handleUpdate = async (data: UpdateClientFormData) => {
    if (!client) return;
    try {
      await updateClient.mutateAsync({ id: client.id, ...data });
      toast.success('Cliente actualizado correctamente');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar cliente';
      toast.error(message);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{isEdit ? 'Editar cliente' : 'Crear cliente'}</Modal.Heading>
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
                    <Label>Nombre <span className="text-danger ml-0.5">*</span></Label>
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

                  <TextField className="w-full" name="goal" variant="secondary">
                    <Label>Objetivo</Label>
                    <Input
                      placeholder="Ej. Pérdida de peso"
                      value={updateForm.watch('goal') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('goal', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="fitness_level" variant="secondary">
                    <Label>Nivel de condición física</Label>
                    <Input
                      placeholder="Ej. Principiante"
                      value={updateForm.watch('fitness_level') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('fitness_level', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </TextField>

                  <div className="grid grid-cols-2 gap-4">
                    <TextField className="w-full" name="weight" variant="secondary">
                      <Label>Peso (kg)</Label>
                      <Input
                        placeholder="Ej. 70"
                        value={updateForm.watch('weight') ?? ''}
                        onChange={(e) => updateForm.setValue('weight', e.target.value, { shouldValidate: true })}
                      />
                    </TextField>

                    <TextField className="w-full" name="height" variant="secondary">
                      <Label>Altura (cm)</Label>
                      <Input
                        placeholder="Ej. 175"
                        value={updateForm.watch('height') ?? ''}
                        onChange={(e) => updateForm.setValue('height', e.target.value, { shouldValidate: true })}
                      />
                    </TextField>
                  </div>

                  <TextField className="w-full" name="birth_date" type="date" variant="secondary">
                    <Label>Fecha de nacimiento</Label>
                    <Input
                      value={updateForm.watch('birth_date') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('birth_date', e.target.value, { shouldValidate: true })
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
                  <Button variant="secondary" slot="close">
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" isDisabled={updateForm.formState.isSubmitting}>
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
                    <Label>Email <span className="text-danger ml-0.5">*</span></Label>
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
                    <Label>Nombre <span className="text-danger ml-0.5">*</span></Label>
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

                  <TextField className="w-full" name="goal" variant="secondary">
                    <Label>Objetivo</Label>
                    <Input
                      placeholder="Ej. Pérdida de peso"
                      value={createForm.watch('goal') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('goal', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="fitness_level" variant="secondary">
                    <Label>Nivel de condición física</Label>
                    <Input
                      placeholder="Ej. Principiante"
                      value={createForm.watch('fitness_level') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('fitness_level', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </TextField>

                  <div className="grid grid-cols-2 gap-4">
                    <TextField className="w-full" name="weight" variant="secondary">
                      <Label>Peso (kg)</Label>
                      <Input
                        placeholder="Ej. 70"
                        value={createForm.watch('weight') ?? ''}
                        onChange={(e) => createForm.setValue('weight', e.target.value, { shouldValidate: true })}
                      />
                    </TextField>

                    <TextField className="w-full" name="height" variant="secondary">
                      <Label>Altura (cm)</Label>
                      <Input
                        placeholder="Ej. 175"
                        value={createForm.watch('height') ?? ''}
                        onChange={(e) => createForm.setValue('height', e.target.value, { shouldValidate: true })}
                      />
                    </TextField>
                  </div>

                  <TextField className="w-full" name="birth_date" type="date" variant="secondary">
                    <Label>Fecha de nacimiento</Label>
                    <Input
                      value={createForm.watch('birth_date') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('birth_date', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" slot="close">
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" isDisabled={createForm.formState.isSubmitting}>
                    <Icon icon="lucide:save" className="size-4" />
                    {createForm.formState.isSubmitting ? 'Creando…' : 'Crear cliente'}
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
