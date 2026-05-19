// Componente para mostrar estados vacíos, de carga o de error.
// Mismo patrón que ConcertHub's StateMessage.
import Button from './Button';

type Props = {
  title: string;
  type: 'empty' | 'loading' | 'error';
  description?: string;
  actionText?: string;
  onAction?: () => void;
};

export default function StateMessage({ title, type, description, actionText, onAction }: Props) {
  const icons = {
    empty: '📋',
    loading: '⏳',
    error: '⚠️',
  };

  return (
    <div className="empty-state">
      <span className="empty-icon">{icons[type]}</span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
