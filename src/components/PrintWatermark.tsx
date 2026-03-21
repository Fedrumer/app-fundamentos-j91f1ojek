import { cn } from '@/lib/utils'

export function PrintWatermark({ locked }: { locked: boolean }) {
  return (
    <div className="hidden print:flex fixed inset-0 items-center justify-center pointer-events-none z-[100]">
      <div
        className={cn(
          'text-[120px] font-black uppercase tracking-widest rotate-[-45deg] opacity-[0.08]',
          locked ? 'text-emerald-500' : 'text-slate-500',
        )}
      >
        {locked ? 'FECHADO' : 'RASCUNHO'}
      </div>
    </div>
  )
}
