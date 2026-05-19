
import type { PlanState, ParcheRole } from '../../types';

type Props = {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'neutral' | 'warning' | 'info';
};

export default function Badge({ children, variant = 'neutral' }: Props) {
  const base = 'badge';
  const variants = {
    success: 'badge-success',
    danger: 'badge-danger',
    neutral: 'badge-neutral',
    warning: 'badge-warning',
    info: 'badge-info',
  };

  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}

// Helper para convertir un PlanState a su variante de badge
export function planStateBadgeVariant(state: PlanState): Props['variant'] {
  const map: Record<PlanState, Props['variant']> = {
    DRAFT: 'neutral',
    VOTING_OPEN: 'success',
    VOTING_CLOSED: 'warning',
    SCHEDULED: 'info',
  };
  return map[state];
}

// Helper para convertir un ParcheRole a su variante de badge
export function roleBadgeVariant(role: ParcheRole): Props['variant'] {
  const map: Record<ParcheRole, Props['variant']> = {
    OWNER: 'warning',
    MODERATOR: 'info',
    MEMBER: 'neutral',
  };
  return map[role];
}
