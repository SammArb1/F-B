import { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { useToast } from '../components/ui/Toast';
import { apiCreateParche, apiJoinParche } from '../services/api';
import ParcheList from '../components/parches/ParcheList';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import StateMessage from '../components/ui/StateMessage';
import { FiPlus, FiLogIn } from 'react-icons/fi';

export default function ParchesPage() {
    const store = useStore();
    const { showToast } = useToast();
    const { currentUser, parches } = store;
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);

    if (!currentUser) return null;

    const myParches = parches.filter(p => p.members.some(m => m.userId === currentUser.id));

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        const result = await apiCreateParche(store, name, desc, coverUrl || '');
        if (result.ok) {
            showToast(`¡Parche "${result.data.name}" creado!`, 'success');
            setName(''); setDesc(''); setCoverUrl('');
            setShowCreate(false);
        } else {
            showToast(result.error, 'error');
        }
        setCreating(false);
    };

    const handleJoin = async () => {
        if (!inviteCode.trim()) {
            showToast('Ingresa un código de invitación', 'error');
            return;
        }
        setJoining(true);
        const result = await apiJoinParche(store, inviteCode.trim());
        if (result.ok) {
            showToast(`¡Te uniste al parche "${result.data.name}"!`, 'success');
        } else {
            showToast(result.error, 'error');
        }
        setInviteCode('');
        setJoining(false);
    };

    return (
        <div className="page-parches">
            <div className="page-header">
                <h1>Mis Parches</h1>
                <Button onClick={() => setShowCreate(!showCreate)}>
                    <FiPlus /> {showCreate ? 'Cancelar' : 'Crear parche'}
                </Button>
            </div>

            {/* Formulario de creación */}
            {showCreate && (
                <form className="create-form" onSubmit={handleCreate}>
                    <h3>Nuevo Parche</h3>
                    <div>
                        <label htmlFor="parche-name" className="form-label">Nombre del parche</label>
                        <input
                            id="parche-name"
                            className="form-input"
                            placeholder="Nombre del parche"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            disabled={creating}
                        />
                    </div>
                    <div>
                        <label htmlFor="parche-desc" className="form-label">Descripción</label>
                        <input
                            id="parche-desc"
                            className="form-input"
                            placeholder="Descripción"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            required
                            disabled={creating}
                        />
                    </div>
                    <div>
                        <label htmlFor="parche-cover" className="form-label">URL de portada (opcional)</label>
                        <input
                            id="parche-cover"
                            className="form-input"
                            placeholder="URL de portada (opcional)"
                            value={coverUrl}
                            onChange={e => setCoverUrl(e.target.value)}
                            disabled={creating}
                        />
                    </div>
                    <Button type="submit" disabled={creating}>
                        {creating ? <><Spinner size="sm" /> Creando...</> : 'Crear'}
                    </Button>
                </form>
            )}

            {/* Join con código */}
            <div className="join-section">
                <label htmlFor="invite-code" className="sr-only">Código de invitación</label>
                <input
                    id="invite-code"
                    className="form-input"
                    placeholder="Código de invitación"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    disabled={joining}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleJoin(); } }}
                />
                <Button variant="secondary" onClick={handleJoin} disabled={joining}>
                    {joining ? <><Spinner size="sm" /> Uniendo...</> : <><FiLogIn /> Unirse</>}
                </Button>
            </div>

            {/* Lista de parches del usuario */}
            {myParches.length === 0
                ? <StateMessage type="empty" title="No tienes parches" description="Crea uno o únete con un código de invitación" />
                : <ParcheList parches={myParches} currentUserId={currentUser.id} />
            }
        </div>
    );
}
