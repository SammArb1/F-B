import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { useToast } from '../components/ui/Toast';
import { apiSetMemberRole, apiRemoveMember } from '../services/api';
import PlanList from '../components/plans/PlanList';
import MemberRow from '../components/parches/MemberRow';
import RankingRow from '../components/rankings/RankingRow';
import Button from '../components/ui/Button';
import { FiPlus, FiUsers, FiClipboard, FiTrendingUp, FiCopy, FiCheck } from 'react-icons/fi';

export default function ParcheDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const store = useStore();
    const { showToast } = useToast();
    const { currentUser, getParcheById, getPlansByParche, getUserById, getMemberRole, getRankings } = store;
    const [tab, setTab] = useState<'plans' | 'members' | 'rankings'>('plans');
    const [copied, setCopied] = useState(false);
    const [loadingMember, setLoadingMember] = useState<string | null>(null);

    const parche = getParcheById(id!);
    if (!parche || !currentUser) return <div className="empty-state"><h3>Parche no encontrado</h3><Link to="/parches" className="btn-primary">Volver</Link></div>;

    const plans = getPlansByParche(parche.id);
    const myRole = getMemberRole(parche.id, currentUser.id);
    const isOwner = myRole === 'OWNER';
    const canCreatePlan = myRole === 'OWNER' || myRole === 'MODERATOR';

    const copyCode = () => {
        navigator.clipboard.writeText(parche.inviteCode);
        setCopied(true);
        showToast('Código copiado al portapapeles', 'info');
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePromote = async (userId: string) => {
        setLoadingMember(userId);
        const result = await apiSetMemberRole(store, parche.id, userId, 'MODERATOR');
        if (result.ok) {
            showToast('Miembro promovido a Moderador', 'success');
        } else {
            showToast(result.error, 'error');
        }
        setLoadingMember(null);
    };

    const handleDemote = async (userId: string) => {
        setLoadingMember(userId);
        const result = await apiSetMemberRole(store, parche.id, userId, 'MEMBER');
        if (result.ok) {
            showToast('Miembro degradado a Miembro', 'success');
        } else {
            showToast(result.error, 'error');
        }
        setLoadingMember(null);
    };

    const handleRemove = async (userId: string) => {
        setLoadingMember(userId);
        const result = await apiRemoveMember(store, parche.id, userId);
        if (result.ok) {
            showToast('Miembro expulsado del parche', 'success');
        } else {
            showToast(result.error, 'error');
        }
        setLoadingMember(null);
    };

    // Rankings data
    const rankings = getRankings(parche.id);
    const sortedByOrganizer = [...rankings].sort((a, b) => b.organizerScore - a.organizerScore);
    const sortedByGhost = [...rankings].sort((a, b) => b.ghostScore - a.ghostScore);

    return (
        <div className="parche-detail">
            {/* Header con gradiente */}
            <div className="parche-detail-header" style={{ background: `linear-gradient(135deg, hsl(${parche.id.charCodeAt(1) * 30}, 70%, 45%), hsl(${parche.id.charCodeAt(1) * 30 + 60}, 80%, 35%))` }}>
                <Link to="/parches" className="back-link" aria-label="Volver a mis parches">← Volver</Link>
                <h1>{parche.name}</h1>
                <p>{parche.description}</p>
                <div className="parche-meta">
                    <span><FiUsers aria-hidden="true" /> {parche.members.length} miembros</span>
                    <button
                        onClick={copyCode}
                        className="copy-code-btn-light"
                        aria-label={`Copiar código de invitación: ${parche.inviteCode}`}
                    >
                        {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />} {parche.inviteCode}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs" role="tablist">
                <button
                    className={tab === 'plans' ? 'active' : ''}
                    onClick={() => setTab('plans')}
                    role="tab"
                    aria-selected={tab === 'plans'}
                    aria-label="Ver planes"
                >
                    <FiClipboard aria-hidden="true" /> Planes ({plans.length})
                </button>
                <button
                    className={tab === 'members' ? 'active' : ''}
                    onClick={() => setTab('members')}
                    role="tab"
                    aria-selected={tab === 'members'}
                    aria-label="Ver miembros"
                >
                    <FiUsers aria-hidden="true" /> Miembros
                </button>
                <button
                    className={tab === 'rankings' ? 'active' : ''}
                    onClick={() => setTab('rankings')}
                    role="tab"
                    aria-selected={tab === 'rankings'}
                    aria-label="Ver rankings"
                >
                    <FiTrendingUp aria-hidden="true" /> Rankings
                </button>
            </div>

            {/* Tab: Planes — RBAC: hide "Create Plan" for MEMBER */}
            {tab === 'plans' && (
                <div className="plans-tab">
                    {canCreatePlan && (
                        <Button onClick={() => navigate(`/parches/${parche.id}/create-plan`)}>
                            <FiPlus /> Crear nuevo plan
                        </Button>
                    )}
                    <PlanList plans={plans} parcheId={parche.id} />
                </div>
            )}

            {/* Tab: Miembros — RBAC: only OWNER sees manage actions */}
            {tab === 'members' && (
                <div className="members-list">
                    {parche.members.map(m => {
                        const user = getUserById(m.userId);
                        if (!user) return null;
                        return (
                            <MemberRow
                                key={m.userId}
                                userId={m.userId}
                                fullName={user.fullName}
                                email={user.email}
                                role={m.role}
                                isCurrentUser={m.userId === currentUser.id}
                                canManage={isOwner}
                                isLoading={loadingMember === m.userId}
                                onPromote={handlePromote}
                                onDemote={handleDemote}
                                onRemove={handleRemove}
                            />
                        );
                    })}
                </div>
            )}

            {/* Tab: Rankings */}
            {tab === 'rankings' && (
                <div className="rankings-section">
                    <div className="ranking-card">
                        <h3>🏆 Organizer Score</h3>
                        <p className="ranking-subtitle">+1 plan creado, +2 plan programado</p>
                        <div className="ranking-list">
                            {sortedByOrganizer.map((r, i) => (
                                <RankingRow key={r.userId} position={i + 1} fullName={r.fullName} avatarUrl={r.avatarUrl} organizerScore={r.organizerScore} ghostScore={r.ghostScore} />
                            ))}
                        </div>
                    </div>
                    <div className="ranking-card ghost-card">
                        <h3>👻 Ghost Score</h3>
                        <p className="ranking-subtitle">Confirmó YES pero no hizo check-in</p>
                        <div className="ranking-list">
                            {sortedByGhost.map((r, i) => (
                                <RankingRow key={r.userId} position={i + 1} fullName={r.fullName} avatarUrl={r.avatarUrl} organizerScore={r.organizerScore} ghostScore={r.ghostScore} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
