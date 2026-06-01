'use client';

import { Button, Card, Chip, Dropdown, Label } from '@heroui/react';
import { Icon } from '@iconify/react';
import { MUSCLE_GROUPS, MUSCLE_GROUP_COLORS, type ExerciseRow } from '../types';

interface ExerciseCardProps {
  exercise: ExerciseRow;
  onEdit: (exercise: ExerciseRow) => void;
  onDelete: (exercise: ExerciseRow) => void;
  onViewDetails: (exercise: ExerciseRow) => void;
}

export function ExerciseCard({ exercise, onEdit, onDelete, onViewDetails }: ExerciseCardProps) {
  const muscleLabel =
    MUSCLE_GROUPS.find((g) => g.value === exercise.muscle_group)?.label ?? exercise.muscle_group;
  const chipColor = MUSCLE_GROUP_COLORS[exercise.muscle_group] ?? 'default';

  return (
    <Card className="h-full flex flex-col border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/20 group">
      {/* Image area */}
      <div className="relative">
        {exercise.image_url ? (
          <img
            src={exercise.image_url}
            alt={exercise.name}
            className="w-full h-44 object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-44 bg-surface-secondary rounded-t-xl flex items-center justify-center">
            <Icon icon="lucide:dumbbell" className="size-8 text-muted-foreground/50" />
          </div>
        )}

        {/* Inactivo badge */}
        {!exercise.is_active && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-danger/80 text-[10px] text-white font-semibold uppercase tracking-wider shadow-sm">
            Inactivo
          </div>
        )}

        {/* 3-dot menu (top-right) */}
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="size-7 min-w-0 bg-background/60 backdrop-blur-sm hover:bg-background/80"
            >
              <Icon icon="lucide:ellipsis-vertical" className="size-4" />
            </Button>
            <Dropdown.Popover placement="bottom right">
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === 'edit') onEdit(exercise);
                  if (key === 'delete') onDelete(exercise);
                }}
              >
                <Dropdown.Item id="edit" textValue="Editar">
                  <Icon icon="lucide:pencil" className="size-4 text-muted" />
                  <Label>Editar</Label>
                </Dropdown.Item>
                <Dropdown.Item id="delete" textValue="Eliminar" variant="danger">
                  <Icon icon="lucide:trash-2" className="size-4 text-danger" />
                  <Label>Eliminar</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      {/* Header: title */}
      <Card.Header className="pb-0 pt-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 size-5 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
            <Icon icon="lucide:dumbbell" className="size-3 text-accent" />
          </div>
          <span className="font-display font-semibold text-base leading-tight line-clamp-2">
            {exercise.name}
          </span>
        </div>
      </Card.Header>

      {/* Content */}
      <Card.Content className="flex-1 flex flex-col gap-1.5 pt-2">
        {exercise.description ? (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {exercise.description}
          </p>
        ) : (
          <div className="h-[1.25rem]" />
        )}

        <div className="flex flex-wrap items-center gap-1 text-xs mt-auto pt-1">
          <div className="flex items-center gap-1">
            <Icon icon="lucide:biceps-flexed" className="size-3.5 shrink-0 text-muted-foreground" />
            <Chip color={chipColor} variant="soft" size="sm" className="h-5">
              {muscleLabel}
            </Chip>
          </div>
          {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
            <>
              <span className="text-muted-foreground/40">•</span>
              {exercise.secondary_muscles.map((m, i) => (
                <span
                  key={`${m}-${i}`}
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] bg-accent/5 text-muted-foreground border border-border/50"
                >
                  {m}
                </span>
              ))}
            </>
          )}
        </div>

        {exercise.equipment && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon="lucide:wrench" className="size-3.5 shrink-0" />
            <span className="truncate">{exercise.equipment}</span>
          </div>
        )}
      </Card.Content>

      {/* Footer: view details */}
      <Card.Footer className="justify-end pt-0 pb-2 px-3">
        <button
          onClick={() => onViewDetails(exercise)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors font-medium cursor-pointer"
        >
          Ver detalles
          <Icon
            icon="lucide:arrow-right"
            className="size-3.5 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </Card.Footer>
    </Card>
  );
}
