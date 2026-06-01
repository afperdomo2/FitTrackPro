import { Icon } from '@iconify/react';

export function BrandPanel() {
  return (
    <aside className="relative hidden lg:flex lg:w-[45%] flex-col items-center justify-center bg-[#0c0c0a] p-12 overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/8 to-transparent" />
      <div className="absolute -top-48 -right-48 size-96 rounded-full bg-accent/8 blur-3xl" />
      <div className="absolute -bottom-48 -left-48 size-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex items-center justify-center size-16 rounded-2xl bg-accent shadow-lg shadow-accent/20">
          <Icon icon="lucide:dumbbell" className="size-8 text-accent-foreground" />
        </div>
        <h1
          className="text-4xl font-display font-bold tracking-tight text-white mb-3"
          style={{ animation: 'fade-in-up 0.6s ease-out both' }}
        >
          FitTrackPro
        </h1>
        <p
          className="text-lg text-white/60 max-w-xs leading-relaxed"
          style={{ animation: 'fade-in-up 0.6s ease-out 0.15s both' }}
        >
          Entrena. Gestiona. Crece.
        </p>

        <div
          className="mt-12 flex flex-col gap-3 text-sm text-white/40"
          style={{ animation: 'fade-in 0.6s ease-out 0.3s both' }}
        >
          {[
            { icon: 'lucide:user-check', text: 'Gestión de clientes' },
            { icon: 'lucide:activity', text: 'Planes de entrenamiento' },
            { icon: 'lucide:bar-chart-3', text: 'Seguimiento de progreso' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <Icon icon={item.icon} className="size-4 text-accent/60" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
