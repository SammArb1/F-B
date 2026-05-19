type Props = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = { sm: 16, md: 24, lg: 40 };

export default function Spinner({ size = 'md', className = '' }: Props) {
  const s = sizes[size];
  return (
    <span
      className={`spinner ${className}`}
      style={{ width: s, height: s }}
      role="status"
      aria-label="Cargando"
    >
      <span className="sr-only">Cargando...</span>
    </span>
  );
}
