// Componente panel de asistencia.
// Encapsula la lógica de asistencia y check-in del plan.
import type { Attendance, AttendanceStatus } from '../../types';
import Spinner from '../ui/Spinner';
import { FiCheck, FiX, FiHelpCircle } from 'react-icons/fi';

type Props = {
  myAttendance: Attendance | undefined;
  isScheduled: boolean;
  isInWindow: boolean;
  isLoading?: boolean;
  isCheckingIn?: boolean;
  onSetAttendance: (status: AttendanceStatus) => void;
  onCheckIn: () => void;
};

export default function AttendancePanel({ myAttendance, isScheduled, isInWindow, isLoading = false, isCheckingIn = false, onSetAttendance, onCheckIn }: Props) {
  return (
    <div className="attendance-actions-panel">
      <h3>Tu asistencia</h3>
      <div className="attendance-actions">
        {(['YES', 'NO', 'MAYBE'] as AttendanceStatus[]).map(status => {
          const icons = { YES: <FiCheck aria-hidden="true" />, NO: <FiX aria-hidden="true" />, MAYBE: <FiHelpCircle aria-hidden="true" /> };
          const labels = { YES: 'Sí voy', NO: 'No voy', MAYBE: 'Tal vez' };
          const isActive = myAttendance?.status === status;
          return (
            <button
              key={status}
              onClick={() => onSetAttendance(status)}
              className={`btn-attendance att-${status.toLowerCase()} ${isActive ? 'active' : ''}`}
              disabled={isLoading}
              aria-label={`Confirmar asistencia: ${labels[status]}`}
              aria-pressed={isActive}
            >
              {isLoading && isActive ? <Spinner size="sm" /> : icons[status]} {labels[status]}
            </button>
          );
        })}
      </div>

      {isScheduled && (
        <button
          onClick={onCheckIn}
          className={`btn-checkin ${myAttendance?.checkedIn ? 'checked' : ''}`}
          disabled={myAttendance?.checkedIn || !isInWindow || isCheckingIn}
          aria-label={myAttendance?.checkedIn ? 'Check-in ya realizado' : 'Hacer check-in'}
        >
          {isCheckingIn ? (
            <><Spinner size="sm" /> Realizando check-in...</>
          ) : myAttendance?.checkedIn ? (
            '✅ Check-in realizado'
          ) : isInWindow ? (
            '📍 Hacer Check-in'
          ) : (
            '⏳ Check-in no disponible aún'
          )}
        </button>
      )}
    </div>
  );
}
