// Componente reutilizable de botón con variantes.
// Mismo patrón que ConcertHub: recibe variant, onClick, disabled y children.
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
};

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
}: Props) {
  const base = 'btn';
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
