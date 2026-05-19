import { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { useToast } from '../components/ui/Toast';
import { apiUpdateProfile } from '../services/api';
import Spinner from '../components/ui/Spinner';
import { FiUser, FiMail, FiBook, FiEdit3, FiCheck, FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
    const store = useStore();
    const { showToast } = useToast();
    const { currentUser, logout, parches } = store;
    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState(currentUser?.fullName ?? '');
    const [major, setMajor] = useState(currentUser?.major ?? '');
    const [saving, setSaving] = useState(false);

    if (!currentUser) return null;

    const userParches = parches.filter(p => p.members.some(m => m.userId === currentUser.id));

    const handleSave = async () => {
        setSaving(true);
        const result = await apiUpdateProfile(store, { fullName, major });
        if (result.ok) {
            showToast('Perfil actualizado', 'success');
            setEditing(false);
        } else {
            showToast(result.error, 'error');
        }
        setSaving(false);
    };

    const initials = currentUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar-large">
                    {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.fullName} />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>
                {editing ? (
                    <div className="profile-edit-form">
                        <label htmlFor="profile-name" className="sr-only">Nombre completo</label>
                        <input
                            id="profile-name"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Nombre completo"
                            className="profile-input"
                            disabled={saving}
                        />
                        <label htmlFor="profile-major" className="sr-only">Programa</label>
                        <input
                            id="profile-major"
                            value={major}
                            onChange={e => setMajor(e.target.value)}
                            placeholder="Programa"
                            className="profile-input"
                            disabled={saving}
                        />
                        <button
                            onClick={handleSave}
                            className={`btn-primary btn-sm ${saving ? 'btn-loading' : ''}`}
                            disabled={saving}
                        >
                            {saving ? <><Spinner size="sm" /> Guardando...</> : <><FiCheck /> Guardar</>}
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="profile-name">{currentUser.fullName}</h1>
                        <p className="profile-major"><FiBook aria-hidden="true" /> {currentUser.major}</p>
                        <p className="profile-email"><FiMail aria-hidden="true" /> {currentUser.email}</p>
                        <button
                            onClick={() => setEditing(true)}
                            className="btn-ghost btn-sm"
                            aria-label="Editar perfil"
                        >
                            <FiEdit3 /> Editar perfil
                        </button>
                    </>
                )}
            </div>

            <div className="profile-section">
                <h2>Mis Parches ({userParches.length})</h2>
                <div className="parche-chips">
                    {userParches.map(p => {
                        const role = p.members.find(m => m.userId === currentUser.id)?.role;
                        return (
                            <div key={p.id} className="parche-chip">
                                <span className="parche-chip-name">{p.name}</span>
                                <span className={`role-badge role-${role?.toLowerCase()}`}>{role}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={logout}
                className="btn-danger"
                aria-label="Cerrar sesión"
            >
                <FiLogOut /> Cerrar sesión
            </button>
        </div>
    );
}
