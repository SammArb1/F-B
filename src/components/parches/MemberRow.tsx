// Componente para mostrar un miembro del parche con su rol e acciones.
import type { ParcheRole } from '../../types';
import Badge, { roleBadgeVariant } from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { FiStar, FiShield, FiUser, FiArrowUp, FiArrowDown, FiTrash2 } from 'react-icons/fi';

type Props = {
  userId: string;
  fullName: string;
  email: string;
  role: ParcheRole;
  isCurrentUser: boolean;
  canManage: boolean;
  isLoading?: boolean;
  onPromote: (userId: string) => void;
  onDemote: (userId: string) => void;
  onRemove: (userId: string) => void;
};

export default function MemberRow({ userId, fullName, email, role, isCurrentUser, canManage, isLoading = false, onPromote, onDemote, onRemove }: Props) {
  const roleIcon = (r: ParcheRole) => {
    if (r === 'OWNER') return <FiStar aria-hidden="true" />;
    if (r === 'MODERATOR') return <FiShield aria-hidden="true" />;
    return <FiUser aria-hidden="true" />;
  };

  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="member-row">
      <div className="member-avatar">{initials}</div>
      <div className="member-info">
        <span className="member-name">
          {fullName} {isCurrentUser && <span className="you-badge">(tú)</span>}
        </span>
        <span className="member-email">{email}</span>
      </div>
      <Badge variant={roleBadgeVariant(role)}>
        {roleIcon(role)} {role}
      </Badge>
      {canManage && !isCurrentUser && (
        <div className="member-actions">
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              {role === 'MEMBER' && (
                <button
                  onClick={() => onPromote(userId)}
                  className="btn-icon"
                  title="Promover a Moderador"
                  aria-label={`Promover a ${fullName} a Moderador`}
                >
                  <FiArrowUp />
                </button>
              )}
              {role === 'MODERATOR' && (
                <button
                  onClick={() => onDemote(userId)}
                  className="btn-icon"
                  title="Degradar a Miembro"
                  aria-label={`Degradar a ${fullName} a Miembro`}
                >
                  <FiArrowDown />
                </button>
              )}
              <button
                onClick={() => onRemove(userId)}
                className="btn-icon btn-icon-danger"
                title="Expulsar"
                aria-label={`Expulsar a ${fullName}`}
              >
                <FiTrash2 />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
