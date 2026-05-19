// Componente de lista de parches.
// Mismo patrón que ConcertList: recibe un arreglo y renderiza ParcheCard por cada elemento.
import type { Parche, ParcheRole } from '../../types';
import ParcheCard from './ParcheCard';

type Props = {
  parches: Parche[];
  currentUserId: string;
};

export default function ParcheList({ parches, currentUserId }: Props) {
  return (
    <section className="parches-grid">
      {parches.map((p) => {
        const member = p.members.find(m => m.userId === currentUserId);
        const role: ParcheRole = member?.role ?? 'MEMBER';
        return <ParcheCard key={p.id} parche={p} userRole={role} />;
      })}
    </section>
  );
}
