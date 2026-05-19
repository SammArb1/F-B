import type { Plan } from '../../types';
import PlanCard from './PlanCard';

type Props = {
  plans: Plan[];
  parcheId: string;
};

export default function PlanList({ plans, parcheId }: Props) {
  if (plans.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📅</span>
        <h3>No hay planes activos</h3>
        <p>Aún no se ha propuesto ningún plan para este parche.</p>
      </div>
    );
  }

  return (
    <div className="plans-list">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} parcheId={parcheId} />
      ))}
    </div>
  );
}