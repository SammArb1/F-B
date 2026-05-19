import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { useToast } from '../components/ui/Toast';
import { apiCreatePlan } from '../services/api';
import Spinner from '../components/ui/Spinner';
import { FiPlus, FiTrash2, FiMapPin, FiClock } from 'react-icons/fi';

export default function CreatePlanPage() {
    const { id: parcheId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const store = useStore();
    const { showToast } = useToast();
    const { getParcheById, currentUser, getMemberRole } = store;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [options, setOptions] = useState([
        { place: '', time: '' },
        { place: '', time: '' },
        { place: '', time: '' },
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Mínima fecha permitida (ahora local)
    const minDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const parche = getParcheById(parcheId!);
    if (!parche || !currentUser) return null;
    const role = getMemberRole(parche.id, currentUser.id);
    if (role !== 'OWNER' && role !== 'MODERATOR') return <div className="empty-state"><h3>Sin permisos</h3><Link to={`/parches/${parcheId}`} className="btn-primary">Volver</Link></div>;

    const addOption = () => setOptions(prev => [...prev, { place: '', time: '' }]);
    const removeOption = (i: number) => { if (options.length <= 3) return; setOptions(prev => prev.filter((_, idx) => idx !== i)); };
    const updateOption = (i: number, field: 'place' | 'time', value: string) => {
        setOptions(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: value } : o));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (new Date(startDate) < new Date()) {
            setError('La fecha de inicio no puede ser en el pasado');
            showToast('La fecha de inicio no puede ser en el pasado', 'error');
            return;
        }
        if (new Date(endDate) <= new Date(startDate)) {
            setError('La fecha de fin debe ser posterior a la de inicio');
            showToast('La fecha de fin debe ser posterior a la de inicio', 'error');
            return;
        }

        setLoading(true);

        const result = await apiCreatePlan(store, parcheId!, title, description, { start: startDate, end: endDate }, options);
        if (result.ok) {
            showToast('¡Plan creado exitosamente!', 'success');
            navigate(`/parches/${parcheId}`);
        } else {
            setError(result.error);
            showToast(result.error, 'error');
        }
        setLoading(false);
    };

    return (
        <div className="create-plan-page">
            <Link to={`/parches/${parcheId}`} className="back-link" aria-label={`Volver a ${parche.name}`}>← Volver a {parche.name}</Link>
            <h1>Nuevo Plan</h1>

            <form onSubmit={handleSubmit} className="create-plan-form" noValidate>
                <div className="form-section">
                    <label htmlFor="plan-title">Título del plan</label>
                    <input
                        id="plan-title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Ej: Hamburgueseada de viernes"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-section">
                    <label htmlFor="plan-description">Descripción</label>
                    <textarea
                        id="plan-description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe el plan..."
                        rows={3}
                        disabled={loading}
                    />
                </div>
                <div className="form-row">
                    <div className="form-section">
                        <label htmlFor="plan-start-date">Fecha inicio</label>
                        <input
                            id="plan-start-date"
                            type="datetime-local"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            min={minDateTime}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-section">
                        <label htmlFor="plan-end-date">Fecha fin</label>
                        <input
                            id="plan-end-date"
                            type="datetime-local"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            min={startDate || minDateTime}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label>Opciones (mínimo 3)</label>
                    {options.map((opt, i) => (
                        <div key={i} className="option-row">
                            <div className="option-fields">
                                <div className="input-group">
                                    <label htmlFor={`option-place-${i}`} className="sr-only">Lugar opción {i + 1}</label>
                                    <FiMapPin className="input-icon" aria-hidden="true" />
                                    <input
                                        id={`option-place-${i}`}
                                        placeholder="Lugar"
                                        value={opt.place}
                                        onChange={e => updateOption(i, 'place', e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor={`option-time-${i}`} className="sr-only">Fecha y hora opción {i + 1}</label>
                                    <FiClock className="input-icon" aria-hidden="true" />
                                    <input
                                        id={`option-time-${i}`}
                                        type="datetime-local"
                                        value={opt.time}
                                        onChange={e => updateOption(i, 'time', e.target.value)}
                                        min={startDate || minDateTime}
                                        max={endDate || undefined}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            {options.length > 3 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(i)}
                                    className="btn-icon btn-icon-danger"
                                    aria-label={`Eliminar opción ${i + 1}`}
                                    disabled={loading}
                                >
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOption}
                        className="btn-ghost btn-sm"
                        disabled={loading}
                        aria-label="Agregar otra opción"
                    >
                        <FiPlus /> Agregar opción
                    </button>
                </div>

                {error && <p className="auth-error" role="alert" aria-live="polite">{error}</p>}

                <div className="modal-actions">
                    <Link to={`/parches/${parcheId}`} className="btn-ghost">Cancelar</Link>
                    <button
                        type="submit"
                        className={`btn-primary ${loading ? 'btn-loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? <><Spinner size="sm" /> Creando...</> : 'Crear plan como borrador'}
                    </button>
                </div>
            </form>
        </div>
    );
}
