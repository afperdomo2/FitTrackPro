'use client';

import { Button, Chip, Modal, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { MUSCLE_GROUPS, MUSCLE_GROUP_COLORS, type ExerciseRow } from '../types';
import { useExercise } from '../api';

interface ExerciseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: string | null;
  onEdit?: (exercise: ExerciseRow) => void;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export function ExerciseDetailModal({
  isOpen,
  onClose,
  exerciseId,
  onEdit,
}: ExerciseDetailModalProps) {
  const { data: exercise, isLoading } = useExercise(exerciseId);

  const muscleLabel = exercise
    ? (MUSCLE_GROUPS.find((g) => g.value === exercise.muscle_group)?.label ?? exercise.muscle_group)
    : '';
  const chipColor = exercise
    ? (MUSCLE_GROUP_COLORS[exercise.muscle_group] ?? 'default')
    : 'default';

  const videoEmbedUrl = exercise?.video_url
    ? (getYouTubeEmbedUrl(exercise.video_url) ?? getVimeoEmbedUrl(exercise.video_url))
    : null;

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog className="animate-scale-in">
            <Modal.CloseTrigger />

            {isLoading || !exercise ? (
              <div className="flex items-center justify-center py-20">
                <Spinner color="accent" size="lg" />
              </div>
            ) : (
              <>
                <Modal.Header className="flex-col items-start gap-2 pb-0">
                  <div className="flex items-center gap-2 text-accent">
                    <Chip color="accent" variant="soft" size="sm">
                      {muscleLabel}
                    </Chip>
                    {!exercise.is_active && (
                      <Chip color="danger" variant="soft" size="sm">
                        Inactivo
                      </Chip>
                    )}
                  </div>
                  <Modal.Heading className="font-display text-xl">{exercise.name}</Modal.Heading>
                </Modal.Header>

                <Modal.Body className="flex flex-col gap-5 pt-4">
                  {/* Image */}
                  {exercise.image_url ? (
                    <img
                      src={exercise.image_url}
                      alt={exercise.name}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-44 bg-surface-secondary rounded-xl flex items-center justify-center">
                      <Icon icon="lucide:dumbbell" className="size-10 text-muted-foreground/50" />
                    </div>
                  )}

                  {/* Description */}
                  {exercise.description && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                        Descripción
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {exercise.description}
                      </p>
                    </div>
                  )}

                  {/* Secondary muscles */}
                  {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                        Músculos secundarios
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {exercise.secondary_muscles.map((m) => (
                          <Chip key={m} variant="soft" size="sm">
                            {m}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Equipment & details row */}
                  <div className="grid grid-cols-2 gap-4">
                    {exercise.equipment && (
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                          Equipamiento
                        </p>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Icon icon="lucide:wrench" className="size-3.5 text-muted-foreground" />
                          <span>{exercise.equipment}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                        Estado
                      </p>
                      <Chip
                        color={exercise.is_active ? 'success' : 'danger'}
                        variant="soft"
                        size="sm"
                      >
                        {exercise.is_active ? 'Activo' : 'Inactivo'}
                      </Chip>
                    </div>
                  </div>

                  {/* Video embed */}
                  {videoEmbedUrl && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                        Video
                      </p>
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-secondary">
                        <iframe
                          src={videoEmbedUrl}
                          title="Exercise video"
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    </div>
                  )}

                  {/* Video link fallback */}
                  {exercise.video_url && !videoEmbedUrl && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5">
                        Video
                      </p>
                      <a
                        href={exercise.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                      >
                        <Icon icon="lucide:external-link" className="size-3.5" />
                        Ver video externo
                      </a>
                    </div>
                  )}
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="tertiary" slot="close">
                    Cerrar
                  </Button>
                  {onEdit && (
                    <Button
                      variant="primary"
                      onPress={() => {
                        onClose();
                        onEdit(exercise);
                      }}
                    >
                      <Icon icon="lucide:pencil" className="size-4" />
                      Editar ejercicio
                    </Button>
                  )}
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
