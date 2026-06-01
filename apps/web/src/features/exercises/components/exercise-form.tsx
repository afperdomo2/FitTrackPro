'use client';

import { useEffect } from 'react';
import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  Spinner,
  Switch,
  TextArea,
  TextField,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCreateExercise, useUpdateExercise, useExercise } from '../api';
import {
  createExerciseSchema,
  updateExerciseSchema,
  type CreateExerciseFormData,
  type UpdateExerciseFormData,
} from '../validators';
import { MUSCLE_GROUPS } from '../types';

interface ExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId?: string;
}

function MuscleGroupSelect({
  value,
  onChange,
  isInvalid,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  isInvalid?: boolean;
  label: string;
}) {
  return (
    <Select
      className="w-full"
      variant="secondary"
      selectedKey={value || null}
      onSelectionChange={(key) => onChange(key as string)}
      isInvalid={isInvalid}
    >
      <Label>
        {label} <span className="text-danger ml-0.5">*</span>
      </Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {MUSCLE_GROUPS.map((mg) => (
            <ListBox.Item key={mg.value} id={mg.value} textValue={mg.label}>
              {mg.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

export function ExerciseForm({ isOpen, onClose, exerciseId }: ExerciseFormProps) {
  const isEdit = !!exerciseId;
  const { data: exercise, isLoading } = useExercise(exerciseId ?? null);
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();

  const createForm = useForm<CreateExerciseFormData>({
    resolver: zodResolver(createExerciseSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      muscle_group: '',
      secondary_muscles: '',
      equipment: '',
      video_url: '',
      image_url: '',
    },
  });

  const updateForm = useForm<UpdateExerciseFormData>({
    resolver: zodResolver(updateExerciseSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      is_active: true,
      description: '',
      muscle_group: '',
      secondary_muscles: '',
      equipment: '',
      video_url: '',
      image_url: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      createForm.reset({
        name: '',
        description: '',
        muscle_group: '',
        secondary_muscles: '',
        equipment: '',
        video_url: '',
        image_url: '',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (exercise) {
      updateForm.reset({
        name: exercise.name,
        is_active: exercise.is_active,
        description: exercise.description ?? '',
        muscle_group: exercise.muscle_group,
        secondary_muscles: exercise.secondary_muscles?.join(', ') ?? '',
        equipment: exercise.equipment ?? '',
        video_url: exercise.video_url ?? '',
        image_url: exercise.image_url ?? '',
      });
    }
  }, [exercise]);

  const parseSecondaryMuscles = (value: string | undefined | null) => {
    if (!value) return undefined;
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleCreate = async (data: CreateExerciseFormData) => {
    try {
      await createExercise.mutateAsync({
        ...data,
        secondary_muscles: parseSecondaryMuscles(data.secondary_muscles),
      });
      toast.success('Ejercicio creado correctamente');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear ejercicio';
      toast.error(message);
    }
  };

  const handleUpdate = async (data: UpdateExerciseFormData) => {
    if (!exerciseId) return;
    try {
      await updateExercise.mutateAsync({
        id: exerciseId,
        ...data,
        secondary_muscles: parseSecondaryMuscles(data.secondary_muscles),
      });
      toast.success('Ejercicio actualizado correctamente');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar ejercicio';
      toast.error(message);
    }
  };

  const createMG = useController({ control: createForm.control, name: 'muscle_group' });
  const updateMG = useController({ control: updateForm.control, name: 'muscle_group' });
  const isActiveController = useController({ control: updateForm.control, name: 'is_active' });

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog className="animate-scale-in">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="font-display">
                {isEdit ? 'Editar ejercicio' : 'Crear ejercicio'}
              </Modal.Heading>
            </Modal.Header>

            {isEdit && isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner color="accent" size="lg" />
              </div>
            ) : isEdit ? (
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
                      placeholder="Ej. Press de banca"
                      value={updateForm.watch('name')}
                      onChange={(e) =>
                        updateForm.setValue('name', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>
                  {updateForm.formState.errors.name && (
                    <p className="text-xs text-danger -mt-3">
                      {updateForm.formState.errors.name.message?.toString()}
                    </p>
                  )}

                  <MuscleGroupSelect
                    value={updateMG.field.value}
                    onChange={(v) => updateMG.field.onChange(v)}
                    isInvalid={!!updateForm.formState.errors.muscle_group}
                    label="Grupo muscular"
                  />

                  <TextField className="w-full" name="description" variant="secondary">
                    <Label>Descripción</Label>
                    <TextArea
                      placeholder="Describe el ejercicio..."
                      rows={3}
                      value={updateForm.watch('description') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('description', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="secondary_muscles" variant="secondary">
                    <Label>Músculos secundarios</Label>
                    <Input
                      placeholder="Ej. tríceps, hombro anterior"
                      value={updateForm.watch('secondary_muscles') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('secondary_muscles', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="equipment" variant="secondary">
                    <Label>Equipamiento</Label>
                    <Input
                      placeholder="Ej. Barra, Mancuernas, Polea"
                      value={updateForm.watch('equipment') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('equipment', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="video_url" variant="secondary">
                    <Label>URL del video</Label>
                    <Input
                      placeholder="https://..."
                      value={updateForm.watch('video_url') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('video_url', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="image_url" variant="secondary">
                    <Label>URL de la imagen</Label>
                    <Input
                      placeholder="https://..."
                      value={updateForm.watch('image_url') ?? ''}
                      onChange={(e) =>
                        updateForm.setValue('image_url', e.target.value, { shouldValidate: true })
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
                    name="name"
                    variant="secondary"
                    isInvalid={!!createForm.formState.errors.name}
                  >
                    <Label>
                      Nombre <span className="text-danger ml-0.5">*</span>
                    </Label>
                    <Input
                      placeholder="Ej. Press de banca"
                      value={createForm.watch('name')}
                      onChange={(e) =>
                        createForm.setValue('name', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>
                  {createForm.formState.errors.name && (
                    <p className="text-xs text-danger -mt-3">
                      {createForm.formState.errors.name.message?.toString()}
                    </p>
                  )}

                  <MuscleGroupSelect
                    value={createMG.field.value}
                    onChange={(v) => createMG.field.onChange(v)}
                    isInvalid={!!createForm.formState.errors.muscle_group}
                    label="Grupo muscular"
                  />

                  <TextField className="w-full" name="description" variant="secondary">
                    <Label>Descripción</Label>
                    <TextArea
                      placeholder="Describe el ejercicio..."
                      rows={3}
                      value={createForm.watch('description') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('description', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="secondary_muscles" variant="secondary">
                    <Label>Músculos secundarios</Label>
                    <Input
                      placeholder="Ej. tríceps, hombro anterior"
                      value={createForm.watch('secondary_muscles') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('secondary_muscles', e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="equipment" variant="secondary">
                    <Label>Equipamiento</Label>
                    <Input
                      placeholder="Ej. Barra, Mancuernas, Polea"
                      value={createForm.watch('equipment') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('equipment', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="video_url" variant="secondary">
                    <Label>URL del video</Label>
                    <Input
                      placeholder="https://..."
                      value={createForm.watch('video_url') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('video_url', e.target.value, { shouldValidate: true })
                      }
                    />
                  </TextField>

                  <TextField className="w-full" name="image_url" variant="secondary">
                    <Label>URL de la imagen</Label>
                    <Input
                      placeholder="https://..."
                      value={createForm.watch('image_url') ?? ''}
                      onChange={(e) =>
                        createForm.setValue('image_url', e.target.value, { shouldValidate: true })
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
                    {createForm.formState.isSubmitting ? 'Creando…' : 'Crear ejercicio'}
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
