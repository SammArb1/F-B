// Componente fila de ranking.
// Muestra posición, avatar, nombre, y scores de un usuario.
type Props = {
  position: number;
  fullName: string;
  avatarUrl: string;
  organizerScore: number;
  ghostScore: number;
};

export default function RankingRow({ position, fullName, avatarUrl, organizerScore, ghostScore }: Props) {
  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="ranking-row">
      <span className="rank-pos">#{position}</span>
      <div className="member-avatar rank-avatar">{initials}</div>
      <span className="rank-name">{fullName}</span>
      <span className="rank-score organizer-score">{organizerScore} pts</span>
      <span className="rank-score ghost-score">{ghostScore} 👻</span>
    </div>
  );
}
