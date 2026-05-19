import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, Parche, Plan, Vote, Attendance, ParcheRole, PlanState, AttendanceStatus, UserRanking, ParcheMember } from '../types';
import { VALID_TRANSITIONS } from '../types';
import { 
    apiLogin as authApiLogin, 
    apiRegister as authApiRegister,
    fetchMyParches,
    fetchPlansByParche,
    fetchVotesByPlan,
    fetchAttendancesByPlan,
    apiCreateParche as doApiCreateParche,
    apiJoinParche as doApiJoinParche,
    apiLeaveParche as doApiLeaveParche,
    apiCreatePlan as doApiCreatePlan,
    apiTransitionPlanState as doApiTransitionPlanState,
    apiCastVote as doApiCastVote,
    apiSetAttendance as doApiSetAttendance,
    apiCheckIn as doApiCheckIn,
    apiSetMemberRole as doApiSetMemberRole,
    apiRemoveMember as doApiRemoveMember,
    apiUpdateProfile as doApiUpdateProfile
} from '../services/api';
import * as api from '../services/api';

interface StoreContextType {
    // Auth
    currentUser: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: Omit<User, 'id'>) => Promise<boolean>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;

    // Users
    users: User[];
    getUserById: (id: string) => User | undefined;

    // Parches
    parches: Parche[];
    createParche: (name: string, description: string, coverUrl: string) => Promise<Parche | null>;
    joinParche: (code: string) => Promise<boolean>;
    leaveParche: (parcheId: string) => Promise<void>;
    getParcheById: (id: string) => Parche | undefined;
    getMemberRole: (parcheId: string, userId: string) => ParcheRole | null;
    setMemberRole: (parcheId: string, targetUserId: string, role: ParcheRole) => Promise<boolean>;
    removeMember: (parcheId: string, targetUserId: string) => Promise<boolean>;

    // Plans
    plans: Plan[];
    createPlan: (parcheId: string, title: string, description: string, dateWindow: { start: string; end: string }, options: { place: string; time: string }[]) => Promise<Plan | null>;
    getPlansByParche: (parcheId: string) => Plan[];
    getPlanById: (id: string) => Plan | undefined;
    transitionPlanState: (planId: string) => Promise<boolean>;

    // Votes
    votes: Vote[];
    castVote: (planId: string, optionId: string) => Promise<boolean>;
    getUserVote: (planId: string, userId: string) => Vote | undefined;
    getVotesByPlan: (planId: string) => Vote[];

    // Attendance
    attendances: Attendance[];
    setAttendance: (planId: string, status: AttendanceStatus) => Promise<void>;
    checkIn: (planId: string) => Promise<void>;
    getAttendanceByPlan: (planId: string) => Attendance[];
    getUserAttendance: (planId: string, userId: string) => Attendance | undefined;

    // Rankings
    getRankings: (parcheId: string) => UserRanking[];

    refreshData: () => Promise<void>;
    setCurrentUser: (user: User | null) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore(): StoreContextType {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used within StoreProvider');
    return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [parches, setParches] = useState<Parche[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const raw = sessionStorage.getItem('pp_currentUser');
        return raw ? JSON.parse(raw) : null;
    });

    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('pp_currentUser', JSON.stringify(currentUser));
            refreshData();
        } else {
            sessionStorage.removeItem('pp_currentUser');
            setParches([]);
            setPlans([]);
            setVotes([]);
            setAttendances([]);
        }
    }, [currentUser]);

    const refreshData = useCallback(async () => {
        if (!currentUser) return;
        try {
            // 0. Fetch Users
            const uRes = await api.fetchUsers();
            if (uRes.ok) setUsers(uRes.data);

            // 1. Fetch Parches
            const pRes = await fetchMyParches();
            if (pRes.ok) {
                setParches(pRes.data);
                
                // 2. Fetch Plans for all those parches
                let allPlans: Plan[] = [];
                for (const p of pRes.data) {
                    const plRes = await fetchPlansByParche(p.id);
                    if (plRes.ok) {
                        allPlans = [...allPlans, ...plRes.data];
                    }
                }
                setPlans(allPlans);

                // 3. Fetch Votes & Attendances for all plans
                let allVotes: Vote[] = [];
                let allAttend: Attendance[] = [];
                for (const pl of allPlans) {
                    const vRes = await fetchVotesByPlan(pl.id);
                    if (vRes.ok) allVotes = [...allVotes, ...vRes.data];

                    const aRes = await fetchAttendancesByPlan(pl.id);
                    if (aRes.ok) allAttend = [...allAttend, ...aRes.data];
                }
                setVotes(allVotes);
                setAttendances(allAttend);
            }
        } catch (e) {
            console.error("Error refreshing data from backend", e);
        }
    }, [currentUser]);

    // Make this object accessible to api.ts functions that require StoreAccessor
    const storeAccessor = { currentUser, refreshData, setCurrentUser };

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        const res = await authApiLogin(storeAccessor, email, password);
        return res.ok;
    }, [storeAccessor]);

    const register = useCallback(async (data: Omit<User, 'id'>): Promise<boolean> => {
        const res = await authApiRegister(storeAccessor, data);
        return res.ok;
    }, [storeAccessor]);

    const logout = useCallback(() => {
        sessionStorage.removeItem("authTokenJWT");
        setCurrentUser(null);
    }, []);

    const updateProfile = useCallback(async (data: Partial<User>) => {
        const res = await doApiUpdateProfile(storeAccessor, data);
        if (res.ok) setCurrentUser(res.data);
    }, [storeAccessor]);

    const getUserById = useCallback((id: string) => users.find(u => u.id === id) || { id, fullName: 'User', email: '', password: '', major: '', avatarUrl: '' }, [users]);

    const createParche = useCallback(async (name: string, description: string, coverUrl: string): Promise<Parche | null> => {
        const res = await doApiCreateParche(storeAccessor, name, description, coverUrl);
        return res.ok ? res.data : null;
    }, [storeAccessor]);

    const joinParche = useCallback(async (code: string): Promise<boolean> => {
        const res = await doApiJoinParche(storeAccessor, code);
        return res.ok;
    }, [storeAccessor]);

    const leaveParche = useCallback(async (parcheId: string) => {
        await doApiLeaveParche(storeAccessor, parcheId);
    }, [storeAccessor]);

    const getParcheById = useCallback((id: string) => parches.find(p => p.id === id), [parches]);

    const getMemberRole = useCallback((parcheId: string, userId: string): ParcheRole | null => {
        const parche = parches.find(p => p.id === parcheId);
        if (!parche) return null;
        const member = parche.members.find(m => m.userId === userId);
        return member?.role ?? null;
    }, [parches]);

    const setMemberRole = useCallback(async (parcheId: string, targetUserId: string, role: ParcheRole): Promise<boolean> => {
        const res = await doApiSetMemberRole(storeAccessor, parcheId, targetUserId, role);
        return res.ok;
    }, [storeAccessor]);

    const removeMember = useCallback(async (parcheId: string, targetUserId: string): Promise<boolean> => {
        const res = await doApiRemoveMember(storeAccessor, parcheId, targetUserId);
        return res.ok;
    }, [storeAccessor]);

    const createPlan = useCallback(async (parcheId: string, title: string, description: string, dateWindow: { start: string; end: string }, options: { place: string; time: string }[]): Promise<Plan | null> => {
        const res = await doApiCreatePlan(storeAccessor, parcheId, title, description, dateWindow, options);
        return res.ok ? res.data : null;
    }, [storeAccessor]);

    const getPlansByParche = useCallback((parcheId: string) => plans.filter(p => p.parcheId === parcheId), [plans]);

    const getPlanById = useCallback((id: string) => plans.find(p => p.id === id), [plans]);

    const transitionPlanState = useCallback(async (planId: string): Promise<boolean> => {
        const res = await doApiTransitionPlanState(storeAccessor, planId);
        return res.ok;
    }, [storeAccessor]);

    const castVote = useCallback(async (planId: string, optionId: string): Promise<boolean> => {
        const res = await doApiCastVote(storeAccessor, planId, optionId);
        return res.ok;
    }, [storeAccessor]);

    const getUserVote = useCallback((planId: string, userId: string) => votes.find(v => v.planId === planId && v.userId === userId), [votes]);

    const getVotesByPlan = useCallback((planId: string) => votes.filter(v => v.planId === planId), [votes]);

    const setAttendance = useCallback(async (planId: string, status: AttendanceStatus) => {
        await doApiSetAttendance(storeAccessor, planId, status);
    }, [storeAccessor]);

    const checkIn = useCallback(async (planId: string) => {
        await doApiCheckIn(storeAccessor, planId);
    }, [storeAccessor]);

    const getAttendanceByPlan = useCallback((planId: string) => attendances.filter(a => a.planId === planId), [attendances]);

    const getUserAttendance = useCallback((planId: string, userId: string) => attendances.find(a => a.planId === planId && a.userId === userId), [attendances]);

    const getRankings = useCallback((parcheId: string): UserRanking[] => {
        // Simplified ranking calculation for now since users table is not fully synced
        const parche = parches.find(p => p.id === parcheId);
        if (!parche) return [];
        const parcheMembers: ParcheMember[] = parche.members;
        const parcherPlans = plans.filter(p => p.parcheId === parcheId);

        return parcheMembers.map(member => {
            const createdPlans = parcherPlans.filter(p => p.createdBy === member.userId);
            const scheduledPlans = createdPlans.filter(p => p.state === 'SCHEDULED');
            const organizerScore = createdPlans.length + scheduledPlans.length * 2;
            const scheduledPlanIds = parcherPlans.filter(p => p.state === 'SCHEDULED').map(p => p.id);
            const ghostScore = attendances.filter(
                a => scheduledPlanIds.includes(a.planId) && a.userId === member.userId && a.status === 'YES' && !a.checkedIn
            ).length;
            return {
                userId: member.userId,
                fullName: 'User',
                avatarUrl: '',
                organizerScore,
                ghostScore,
            };
        });
    }, [parches, plans, attendances]);

    const value: StoreContextType = {
        currentUser, login, register, logout, updateProfile,
        users, getUserById,
        parches, createParche, joinParche, leaveParche, getParcheById, getMemberRole, setMemberRole, removeMember,
        plans, createPlan, getPlansByParche, getPlanById, transitionPlanState,
        votes, castVote, getUserVote, getVotesByPlan,
        attendances, setAttendance, checkIn, getAttendanceByPlan, getUserAttendance,
        getRankings,
        refreshData, setCurrentUser
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
