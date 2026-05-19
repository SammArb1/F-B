// Reusable utility functions for roles, votes, dates, etc.

import type { ParcheRole, Plan, Parche } from '../types';

/** Sleep for a random duration between min and max ms */
export const sleep = (min = 400, max = 800): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, min + Math.random() * (max - min)));

/** Simulate a random network failure (5% chance) */
export const maybeNetworkError = (): boolean => Math.random() < 0.05;

/** Check if user has OWNER or MODERATOR role */
export const canManagePlans = (role: ParcheRole | null): boolean =>
  role === 'OWNER' || role === 'MODERATOR';

/** Check if user is OWNER */
export const isOwner = (role: ParcheRole | null): boolean =>
  role === 'OWNER';

/** Check if current time is within a plan's date window */
export const isInDateWindow = (plan: Plan): boolean => {
  const now = new Date();
  return now >= new Date(plan.dateWindow.start) && now <= new Date(plan.dateWindow.end);
};

/** Get user role in a parche */
export const getUserRole = (parche: Parche, userId: string): ParcheRole | null => {
  const member = parche.members.find(m => m.userId === userId);
  return member?.role ?? null;
};

/** Format a date string to locale */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

/** Generate a random ID */
export const genId = (): string => Math.random().toString(36).slice(2, 10);
