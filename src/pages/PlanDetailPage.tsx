import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { useToast } from '../components/ui/Toast';
import { apiTransitionPlanState, apiCastVote, apiSetAttendance, apiCheckIn } from '../services/api';
import { VALID_TRANSITIONS } from '../types';
import type { PlanState, AttendanceStatus } from '../types';
import OptionCard from '../components/plans/OptionCard';
import AttendancePanel from '../components/attendance/AttendancePanel';
import AttendanceRow from '../components/attendance/AttendanceRow';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Badge, { planStateBadgeVariant } from '../components/ui/Badge';
import { FiArrowRight } from 'react-icons/fi';

const stateLabels: Record<PlanState, string> = {
    DRAFT: '📝 Borrador',
    VOTING_OPEN: '🗳️ Votación Abierta',
    VOTING_CLOSED: '🔒 Votación Cerrada',
    SCHEDULED: '📅 Programado',
};

const nextStateLabels: Record<PlanState, string> = {
    DRAFT: 'Abrir votación',
    VOTING_OPEN: 'Cerrar votación',
    VOTING_CLOSED: 'Programar plan',
    SCHEDULED: '',
};

export default function PlanDetailPage() {
    const { id: parcheId, planId } = useParams<{ id: string; planId: string }>();
    const store = useStore();
    const { showToast } = useToast();
    const {
        currentUser, getParcheById, getPlanById, getMemberRole,
        getUserVote, getAttendanceByPlan, getUserAttendance, getUserById,
    } = store;

    const [transitioning, setTransitioning] = useState(false);
    const [voting, setVoting] = useState(false);
    const [settingAttendance, setSettingAttendance] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);

    const parche = getParcheById(parcheId!);
    const plan = getPlanById(planId!);
    if (!parche || !plan || !currentUser) return <div className="empty-state"><h3>Plan no encontrado</h3><Link to={`/parches/${parcheId}`} className="btn-primary">Volver</Link></div>;

    const myRole = getMemberRole(parche.id, currentUser.id);
    // RBAC: only OWNER or MODERATOR can see the transition button
    const canTransition = (myRole === 'OWNER' || myRole === 'MODERATOR') && VALID_TRANSITIONS[plan.state] !== null;
    const userVote = getUserVote(plan.id, currentUser.id);
    const totalVotes = plan.options.reduce((s, o) => s + o.votesCount, 0);
    const attendanceRecords = getAttendanceByPlan(plan.id);
    const myAttendance = getUserAttendance(plan.id, currentUser.id);

    const isInWindow = () => {
        const now = new Date();
        return now >= new Date(plan.dateWindow.start) && now <= new Date(plan.dateWindow.end);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('es-CO', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleTransition = async () => {
        setTransitioning(true);
        const result = await apiTransitionPlanState(store, plan.id);
        if (result.ok) {
            showToast(`Plan cambiado a: ${stateLabels[result.data.state]}`, 'success');
        } else {
            showToast(result.error, 'error');
        }
        setTransitioning(false);
    };

    const handleVote = async (optionId: string) => {
        if (voting) return; // Prevent double click
        setVoting(true);
        const result = await apiCastVote(store, plan.id, optionId);
        if (result.ok) {
            showToast('¡Voto registrado!', 'success');
        } else {
            showToast(result.error, 'error');
        }
        setVoting(false);
    };

    const handleSetAttendance = async (status: AttendanceStatus) => {
        setSettingAttendance(true);
        const result = await apiSetAttendance(store, plan.id, status);
        if (result.ok) {
            const labels = { YES: 'Sí voy', NO: 'No voy', MAYBE: 'Tal vez' };
            showToast(`Asistencia: ${labels[status]}`, 'success');
        } else {
            showToast(result.error, 'error');
        }
        setSettingAttendance(false);
    };

    const handleCheckIn = async () => {
        if (checkingIn) return;
        setCheckingIn(true);
        const result = await apiCheckIn(store, plan.id);
        if (result.ok) {
            showToast('¡Check-in realizado!', 'success');
        } else {
            showToast(result.error, 'error');
        }
        setCheckingIn(false);
    };

    return (
        <div className="plan-detail">
            <Link to={`/parches/${parcheId}`} className="back-link" aria-label={`Volver a ${parche.name}`}>← {parche.name}</Link>

            {/* Header del plan */}
            <div className="plan-detail-header">
                <div className="plan-state-banner">
                    <Badge variant={planStateBadgeVariant(plan.state)}>
                        {stateLabels[plan.state]}
                    </Badge>
                </div>
                <h1>{plan.title}</h1>
                <p className="plan-detail-desc">{plan.description}</p>
            </div>

            {/* Botón de transición de estado — RBAC: only OWNER/MODERATOR */}
            {canTransition && (
                <Button
                    onClick={handleTransition}
                    disabled={transitioning}
                >
                    {transitioning ? (
                        <><Spinner size="sm" /> Cambiando estado...</>
                    ) : (
                        <><FiArrowRight /> {nextStateLabels[plan.state]}</>
                    )}
                </Button>
            )}

            {/* Opciones / Votación */}
            <div className="plan-section">
                <h2>Opciones{plan.state === 'VOTING_OPEN' && ' — ¡Vota!'}</h2>
                {voting && (
                    <div className="page-loading" style={{ padding: '1rem' }}>
                        <Spinner size="sm" />
                        <span>Registrando voto...</span>
                    </div>
                )}
                <div className="options-list">
                    {plan.options.map((opt, index) => {
                        const pct = totalVotes > 0 ? Math.round((opt.votesCount / totalVotes) * 100) : 0;
                        return (
                            <OptionCard
                                key={opt.id}
                                option={opt}
                                index={index}
                                isVoted={userVote?.optionId === opt.id}
                                isWinner={plan.winningOptionId === opt.id}
                                isVotable={plan.state === 'VOTING_OPEN' && !voting}
                                percentage={pct}
                                onVote={handleVote}
                                formatDate={formatDate}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Asistencia */}
            {(plan.state === 'SCHEDULED' || plan.state === 'VOTING_CLOSED') && (
                <div className="plan-section">
                    <h2>Asistencia</h2>
                    <AttendancePanel
                        myAttendance={myAttendance}
                        isScheduled={plan.state === 'SCHEDULED'}
                        isInWindow={isInWindow()}
                        isLoading={settingAttendance}
                        isCheckingIn={checkingIn}
                        onSetAttendance={handleSetAttendance}
                        onCheckIn={handleCheckIn}
                    />

                    <div className="attendance-list">
                        <h3>Confirmaciones ({attendanceRecords.length})</h3>
                        {attendanceRecords.map(a => {
                            const user = getUserById(a.userId);
                            if (!user) return null;
                            return (
                                <AttendanceRow
                                    key={a.id}
                                    fullName={user.fullName}
                                    status={a.status}
                                    checkedIn={a.checkedIn}
                                />
                            );
                        })}
                        {attendanceRecords.length === 0 && <p className="text-muted">Nadie ha confirmado aún</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
