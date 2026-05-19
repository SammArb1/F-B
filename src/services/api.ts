import type {
  User, Parche, Plan, Vote, Attendance,
  ParcheRole, AttendanceStatus,
} from '../types';
import { fetchClient } from './fetchClient';

export type ApiErrorType = 'UNAUTHORIZED' | 'VALIDATION' | 'NETWORK' | 'NOT_FOUND';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; type: ApiErrorType };

function success<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

function fail<T>(error: string, type: ApiErrorType): ApiResult<T> {
  return { ok: false, error, type };
}

// Helper to decode JWT
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export interface StoreAccessor {
  currentUser: User | null;
  // Solo usaremos esto para disparar actualizaciones en el Store
  refreshData: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
}

// ─── API Functions ──────────────────────────────────────────────

export async function apiLogin(
  store: StoreAccessor,
  email: string,
  password: string
): Promise<ApiResult<User>> {
  try {
    const data = await fetchClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    sessionStorage.setItem("authTokenJWT", data.token);
    
    // Parse JWT to get user basic info
    const decoded = parseJwt(data.token);
    const user: User = {
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        fullName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        email: email,
        password: '',
        major: '',
        avatarUrl: ''
    };
    
    store.setCurrentUser(user);
    await store.refreshData();
    return success(user);
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
        return fail('El correo o la contraseña son incorrectos.', 'VALIDATION');
    }
    return fail(err.message || 'Error al iniciar sesión', 'VALIDATION');
  }
}

export async function apiRegister(
  store: StoreAccessor,
  data: Omit<User, 'id'>
): Promise<ApiResult<User>> {
  try {
    await fetchClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ FullName: data.fullName, Email: data.email, Major: data.major, Password: data.password })
    });
    
    // Auto login after register
    return await apiLogin(store, data.email, data.password);
  } catch (err: any) {
    return fail(err.message || 'Error al registrar', 'VALIDATION');
  }
}

export async function apiCreateParche(
  store: StoreAccessor,
  name: string,
  description: string,
  coverUrl: string
): Promise<ApiResult<Parche>> {
  try {
    const data = await fetchClient('/parche', {
      method: 'POST',
      body: JSON.stringify({ name, description, coverUrl })
    });
    await store.refreshData();
    // Mapeo simple
    return success({
        id: data.id_parche,
        name: data.name,
        description: data.description,
        coverUrl: data.coverUrl,
        inviteCode: data.inviteCode,
        createdAt: data.createdAt,
        members: []
    });
  } catch (err: any) {
    return fail(err.message, 'VALIDATION');
  }
}

export async function apiJoinParche(
  store: StoreAccessor,
  code: string
): Promise<ApiResult<Parche>> {
  try {
    const data = await fetchClient(`/parche/join/${code}`, {
      method: 'POST'
    });
    await store.refreshData();
    return success({
        id: data.id_parche,
        name: data.name,
        description: data.description,
        coverUrl: data.coverUrl,
        inviteCode: data.inviteCode,
        createdAt: data.createdAt,
        members: []
    });
  } catch (err: any) {
    return fail(err.message, 'VALIDATION');
  }
}

export async function apiLeaveParche(
  store: StoreAccessor,
  parcheId: string
): Promise<ApiResult<boolean>> {
  try {
    await fetchClient(`/parche/${parcheId}/leave`, {
      method: 'POST'
    });
    await store.refreshData();
    return success(true);
  } catch (err: any) {
    return fail(err.message, 'VALIDATION');
  }
}

export async function fetchUsers(): Promise<ApiResult<User[]>> {
    try {
        const data = await fetchClient('/auth/users');
        return success(data.map((u: any) => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            major: u.major,
            avatarUrl: u.avatarUrl
        })));
    } catch (err: any) {
        return fail(err.message, 'VALIDATION');
    }
}

export async function fetchMyParches(): Promise<ApiResult<Parche[]>> {
    try {
        const data = await fetchClient('/parche/my-parches');
        return success(data.map((p: any) => ({
            id: p.id_parche,
            name: p.name,
            description: p.description,
            coverUrl: p.coverUrl,
            inviteCode: p.inviteCode,
            createdAt: p.createdAt,
            members: p.members || []
        })));
    } catch (err: any) {
        return fail(err.message, 'VALIDATION');
    }
}

export async function fetchPlansByParche(parcheId: string): Promise<ApiResult<Plan[]>> {
    try {
        const data = await fetchClient(`/plan/parche/${parcheId}`);
        return success(data.map((p: any) => ({
            id: p.id_plan,
            parcheId: p.id_parche,
            title: p.title,
            description: p.description,
            dateWindow: { start: p.dateWindow_start, end: p.dateWindow_end },
            state: p.state,
            winningOptionId: p.winningOptionId,
            createdBy: p.createdBy,
            createdAt: p.createdAt,
            options: p.options ? p.options.map((o: any) => ({
                id: o.id_plan_option,
                place: o.place,
                time: o.time,
                votesCount: o.votesCount
            })) : []
        })));
    } catch (err: any) {
        return fail(err.message, 'VALIDATION');
    }
}

export async function fetchVotesByPlan(planId: string): Promise<ApiResult<Vote[]>> {
    try {
        const data = await fetchClient(`/vote/plan/${planId}`);
        return success(data.map((v: any) => ({
            id: v.id_vote,
            planId: v.id_plan,
            userId: v.id_user,
            optionId: v.id_option
        })));
    } catch (err: any) {
        return fail(err.message, 'VALIDATION');
    }
}

export async function fetchAttendancesByPlan(planId: string): Promise<ApiResult<Attendance[]>> {
    try {
        const data = await fetchClient(`/attendance/plan/${planId}`);
        return success(data.map((a: any) => ({
            id: a.id_attendance,
            planId: a.id_plan,
            userId: a.id_user,
            status: a.status as AttendanceStatus,
            checkedIn: a.checkedIn
        })));
    } catch (err: any) {
        return fail(err.message, 'VALIDATION');
    }
}

export async function apiCreatePlan(
  store: StoreAccessor,
  parcheId: string,
  title: string,
  description: string,
  dateWindow: { start: string; end: string },
  options: { place: string; time: string }[]
): Promise<ApiResult<Plan>> {
  try {
    const data = await fetchClient('/plan', {
      method: 'POST',
      body: JSON.stringify({
          ParcheId: parcheId,
          Title: title,
          Description: description,
          DateWindowStart: dateWindow.start,
          DateWindowEnd: dateWindow.end,
          Options: options.map(o => ({ Place: o.place, Time: o.time }))
      })
    });
    await store.refreshData();
    return success({
        id: data.id_plan,
        parcheId: data.id_parche,
        title: data.title,
        description: data.description,
        dateWindow: { start: data.dateWindow_start, end: data.dateWindow_end },
        state: data.state,
        options: [],
        winningOptionId: data.winningOptionId,
        createdBy: data.createdBy,
        createdAt: data.createdAt
    });
  } catch (err: any) {
    return fail(err.message, 'VALIDATION');
  }
}

export async function apiTransitionPlanState(
  store: StoreAccessor,
  planId: string
): Promise<ApiResult<Plan>> {
  try {
    const data = await fetchClient(`/plan/${planId}/transition`, {
      method: 'PATCH'
    });
    await store.refreshData();
    return success({
        id: data.id_plan,
        parcheId: data.id_parche,
        title: data.title,
        description: data.description,
        dateWindow: { start: data.dateWindow_start, end: data.dateWindow_end },
        state: data.state,
        options: [],
        winningOptionId: data.winningOptionId,
        createdBy: data.createdBy,
        createdAt: data.createdAt
    });
  } catch (err: any) {
    return fail(err.message, 'VALIDATION');
  }
}

export async function apiCastVote(
  store: StoreAccessor,
  planId: string,
  optionId: string
): Promise<ApiResult<Vote>> {
  try {
    const data = await fetchClient('/vote', {
      method: 'POST',
      body: JSON.stringify({ PlanId: planId, OptionId: optionId })
    });
    await store.refreshData();
    return success({
        id: data.id_vote,
        planId: data.id_plan,
        userId: data.id_user,
        optionId: data.id_option
    });
  } catch (err: any) {
    return fail(err.message, 'VALIDATION');
  }
}

export async function apiSetAttendance(
  store: StoreAccessor,
  planId: string,
  status: AttendanceStatus
): Promise<ApiResult<Attendance>> {
  try {
    const data = await fetchClient('/attendance', {
      method: 'POST',
      body: JSON.stringify({ PlanId: planId, Status: status })
    });
    await store.refreshData();
    return success({
        id: data.id_attendance,
        planId: data.id_plan,
        userId: data.id_user,
        status: data.status as AttendanceStatus,
        checkedIn: data.checkedIn
    });
  } catch (err: any) {
    return fail(err.message, 'VALIDATION');
  }
}

export async function apiCheckIn(
  store: StoreAccessor,
  planId: string
): Promise<ApiResult<Attendance>> {
  try {
    const data = await fetchClient(`/attendance/${planId}/checkin`, {
      method: 'PATCH'
    });
    await store.refreshData();
    return success({
        id: data.id_attendance,
        planId: data.id_plan,
        userId: data.id_user,
        status: data.status as AttendanceStatus,
        checkedIn: data.checkedIn
    });
  } catch (err: any) {
    return fail(err.message, 'VALIDATION');
  }
}

export async function apiSetMemberRole(
  store: StoreAccessor,
  parcheId: string,
  targetUserId: string,
  role: ParcheRole
): Promise<ApiResult<boolean>> {
    try {
        await fetchClient(`/parche/${parcheId}/member/${targetUserId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role })
        });
        await store.refreshData();
        return success(true);
    } catch (err: any) {
        return fail(err.message, 'VALIDATION');
    }
}

export async function apiRemoveMember(
  store: StoreAccessor,
  parcheId: string,
  targetUserId: string
): Promise<ApiResult<boolean>> {
    try {
        await fetchClient(`/parche/${parcheId}/member/${targetUserId}`, {
            method: 'DELETE'
        });
        await store.refreshData();
        return success(true);
    } catch (err: any) {
        return fail(err.message, 'VALIDATION');
    }
}
export async function apiUpdateProfile(
  store: StoreAccessor,
  data: Partial<User>
): Promise<ApiResult<User>> {
    return success({ ...store.currentUser, ...data } as User);
}
