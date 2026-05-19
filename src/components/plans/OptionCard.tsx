// Componente individual de opción de votación.
// Recibe la opción, si tiene el voto del usuario, si es la ganadora, y el callback.
import type { PlanOption } from '../../types';
import { FiMapPin, FiClock, FiCheck, FiAward } from 'react-icons/fi';

type Props = {
  option: PlanOption;
  index: number;
  isVoted: boolean;
  isWinner: boolean;
  isVotable: boolean;
  percentage: number;
  onVote: (optionId: string) => void;
  formatDate: (iso: string) => string;
};

export default function OptionCard({ option, index, isVoted, isWinner, isVotable, percentage, onVote, formatDate }: Props) {
  const handleClick = () => {
    if (isVotable) onVote(option.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isVotable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onVote(option.id);
    }
  };

  return (
    <div
      className={`option-card ${isVoted ? 'voted' : ''} ${isWinner ? 'winner' : ''} ${isVotable ? 'votable' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isVotable ? 'button' : undefined}
      tabIndex={isVotable ? 0 : undefined}
      aria-label={isVotable ? `Votar por opción ${index + 1}: ${option.place}` : `Opción ${index + 1}: ${option.place}`}
      aria-pressed={isVotable ? isVoted : undefined}
    >
      {isWinner && <span className="winner-badge"><FiAward aria-hidden="true" /> Ganadora</span>}
      <div className="option-info">
        <span className="option-place"><FiMapPin aria-hidden="true" /> {option.place}</span>
        <span className="option-time"><FiClock aria-hidden="true" /> {formatDate(option.time)}</span>
      </div>
      <div className="option-votes">
        <div className="vote-bar-track" aria-hidden="true">
          <div className="vote-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
        <span className="vote-count">
          {option.votesCount} voto{option.votesCount !== 1 ? 's' : ''} ({percentage}%)
        </span>
      </div>
      {isVotable && (
        <div className="vote-action">
          {isVoted
            ? <span className="voted-label"><FiCheck aria-hidden="true" /> Tu voto</span>
            : <span className="vote-label">Votar</span>
          }
        </div>
      )}
    </div>
  );
}
