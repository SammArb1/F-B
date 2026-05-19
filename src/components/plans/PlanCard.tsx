// Componente individual de tarjeta de Plan.
// Mismo patrón que ConcertCard: recibe un plan por props y renderiza la tarjeta.
import { Link } from 'react-router-dom';
import type { Plan, PlanState } from '../../types';
import Badge, { planStateBadgeVariant } from '../ui/Badge';

type Props = {
  plan: Plan;
  parcheId: string;
};

const stateLabels: Record<PlanState, string> = {
  DRAFT: '📝 Borrador',
  VOTING_OPEN: '🗳️ Votación abierta',
  VOTING_CLOSED: '🔒 Votación cerrada',
  SCHEDULED: '📅 Programado',
};

export default function PlanCard({ plan, parcheId }: Props) {
  const totalVotes = plan.options.reduce((s, o) => s + o.votesCount, 0);

  return (
    <Link to={`/parches/${parcheId}/plans/${plan.id}`} className="plan-card">
      <div className="plan-card-state">
        <Badge variant={planStateBadgeVariant(plan.state)}>
          {stateLabels[plan.state]}
        </Badge>
      </div>
      <h3>{plan.title}</h3>
      <p className="plan-desc">{plan.description}</p>
      <div className="plan-card-meta">
        <span>{plan.options.length} opciones</span>
        <span>{totalVotes} votos</span>
      </div>
    </Link>
  );
}
