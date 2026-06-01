'use client';

import { Button, Card, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { MUSCLE_GROUPS, MUSCLE_GROUP_COLORS, type ExerciseRow } from '../types';

interface ExerciseCardProps {
  exercise: ExerciseRow;
  onEdit: (exercise: ExerciseRow) => void;
  onDelete: (exercise: ExerciseRow) => void;
}

export function ExerciseCard({ exercise, onEdit, onDelete }: ExerciseCardProps) {
  const muscleLabel =
    MUSCLE_GROUPS.find((g) => g.value === exercise.muscle_group)?.label ?? exercise.muscle_group;
  const chipColor = MUSCLE_GROUP_COLORS[exercise.muscle_group] ?? 'default';

  return (
    <Card className="w-full">
      <div className="relative">
        {exercise.image_url ? (
          <img
            src={exercise.image_url}
            alt={exercise.name}
            className="w-full h-28 object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-24 bg-neutral-200 dark:bg-neutral-800 rounded-t-xl flex items-center justify-center">
            <Icon icon="lucide:dumbbell" className="size-8 text-muted-foreground" />
          </div>
        )}
        {!exercise.is_active && (
          <Chip color="danger" variant="primary" size="sm" className="absolute top-2 right-2">
            Inactivo
          </Chip>
        )}
      </div>
      <Card.Header className="pb-1">
        <span className="font-semibold text-sm leading-tight">{exercise.name}</span>
      </Card.Header>
      <Card.Content className="flex flex-col gap-1.5">
        {exercise.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{exercise.description}</p>
        )}
        <div className="flex items-center gap-1.5 text-xs">
          <Icon icon="lucide:target" className="size-3.5 shrink-0 text-muted-foreground" />
          <Chip color={chipColor} variant="soft" size="sm">
            {muscleLabel}
          </Chip>
          {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
            <span className="text-muted-foreground truncate">
              + {exercise.secondary_muscles.join(', ')}
            </span>
          )}
        </div>
        {exercise.equipment && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon="lucide:wrench" className="size-3.5 shrink-0" />
            <span>{exercise.equipment}</span>
          </div>
        )}
      </Card.Content>
      <Card.Footer className="justify-end gap-2 pt-1">
        <Button size="sm" variant="secondary" onPress={() => onEdit(exercise)}>
          <Icon icon="lucide:pencil" className="size-3.5" />
          Editar
        </Button>
        <Button size="sm" variant="danger" onPress={() => onDelete(exercise)}>
          <Icon icon="lucide:trash-2" className="size-3.5" />
          Eliminar
        </Button>
      </Card.Footer>
    </Card>
  );
}
