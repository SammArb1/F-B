// Componente individual de tarjeta de Parche.
// Mismo patrón que ConcertCard en ConcertHub: recibe un objeto por props y renderiza.
import { Link } from 'react-router-dom';
import type { Parche, ParcheRole } from '../../types';
import Badge, { roleBadgeVariant } from '../ui/Badge';
import { FiUsers } from 'react-icons/fi';

type Props = {
  parche: Parche;
  userRole: ParcheRole;
};

export default function ParcheCard({ parche, userRole }: Props) {
  return (
    <Link to={`/parches/${parche.id}`} className="parche-card">
      <div
        className="parche-card-cover"
        style={{ background: `linear-gradient(135deg, hsl(${parche.id.charCodeAt(1) * 30}, 70%, 45%), hsl(${parche.id.charCodeAt(1) * 30 + 60}, 80%, 35%))` }}
      />
      <div className="parche-card-body">
        <div className="parche-card-header">
          <h3>{parche.name}</h3>
          <Badge variant={roleBadgeVariant(userRole)}>{userRole}</Badge>
        </div>
        <p className="parche-card-desc">{parche.description}</p>
      </div>
      <div className="parche-card-footer">
        <FiUsers /> {parche.members.length} miembros
      </div>
    </Link>
  );
}
