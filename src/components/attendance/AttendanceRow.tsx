// Componente fila de asistencia.
// Mismo patrón que CartItemRow: muestra un usuario con su estado de asistencia.
import type { AttendanceStatus } from '../../types';

type Props = {
  fullName: string;
  status: AttendanceStatus;
  checkedIn: boolean;
};

export default function AttendanceRow({ fullName, status, checkedIn }: Props) {
  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2);
  const statusEmoji = { YES: '✅', NO: '❌', MAYBE: '🤔' };

  return (
    <div className="attendance-row">
      <div className="member-avatar">{initials}</div>
      <span className="attendance-name">{fullName}</span>
      <span className="attendance-status">{statusEmoji[status]} {status}</span>
      {checkedIn && <span className="checkin-badge">📍 Check-in</span>}
    </div>
  );
}
