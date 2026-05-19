
export type ParcheRole = 'OWNER' | 'MODERATOR' | 'MEMBER';
export type PlanState = 'DRAFT' | 'VOTING_OPEN' | 'VOTING_CLOSED' | 'SCHEDULED';
export type AttendanceStatus = 'YES' | 'NO' | 'MAYBE';


export interface User {
  id: string;
  fullName: string;
  email: string;
  major: string;
  avatarUrl: string;
  password: string;
}

export interface ParcheMember {
  userId: string;
  role: ParcheRole;
}

export interface Parche {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  inviteCode: string;
  members: ParcheMember[];
  createdAt: string;
}

export interface PlanOption {
  id: string;
  place: string;
  time: string;
  votesCount: number;
}

export interface Plan {
  id: string;
  parcheId: string;
  title: string;
  description: string;
  dateWindow: { start: string; end: string };
  options: PlanOption[];
  state: PlanState;
  winningOptionId: string | null;
  createdBy: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  planId: string;
  userId: string;
  optionId: string;
}

export interface Attendance {
  id: string;
  planId: string;
  userId: string;
  status: AttendanceStatus;
  checkedIn: boolean;
}


export interface UserRanking {
  userId: string;
  fullName: string;
  avatarUrl: string;
  organizerScore: number;
  ghostScore: number;
}


export const VALID_TRANSITIONS: Record<PlanState, PlanState | null> = {
  DRAFT: 'VOTING_OPEN',
  VOTING_OPEN: 'VOTING_CLOSED',
  VOTING_CLOSED: 'SCHEDULED',
  SCHEDULED: null,
};
