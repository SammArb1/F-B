import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
    const { currentUser, logout } = useStore();
    const navigate = useNavigate();
    if (!currentUser) return null;

    const handleLogout = () => {
        logout();
        navigate('/parches', { replace: true });
    };

    const initials = currentUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <span className="brand-icon">🎯</span>
                <span className="brand-text">ParchePlan U</span>
            </div>
            <div className="nav-links">
                <NavLink to="/parches" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><FiHome /> Parches</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><FiUser /> Perfil</NavLink>
            </div>
            <div className="nav-user">
                <div className="nav-avatar">{initials}</div>
                <span className="nav-username">{currentUser.fullName.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-icon nav-logout" title="Cerrar sesión"><FiLogOut /></button>
            </div>
        </nav>
    );
}
