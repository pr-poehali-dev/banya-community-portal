import { authService } from './auth';

const PROFILE_URL = 'https://functions.poehali.dev/21013f35-a90f-46b7-9e10-62a0bb23666f';

export interface UserProfile {
  bio: string | null;
  city: string | null;
  birth_date: string | null;
  gender: string | null;
  avatar_url: string | null;
  social_telegram: string | null;
  social_instagram: string | null;
  social_vk: string | null;
}

export interface UserRole {
  role: 'participant' | 'master' | 'partner' | 'admin';
  is_active: boolean;
  requested_at: string;
  approved_at: string | null;
}

export interface DashboardData {
  user: {
    id: number;
    email: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    telegram_id: string | null;
  };
  profile: UserProfile | null;
  roles: UserRole[];
  permissions: {
    is_master: boolean;
    is_partner: boolean;
    is_admin: boolean;
  };
}

export interface MasterProfile {
  specialization: string | null;
  experience_years: number | null;
  description: string | null;
  services: string | null;
  price_range: string | null;
  certificates: string | null;
  is_published: boolean;
}

export interface PartnerProfile {
  banya_name: string | null;
  banya_address: string | null;
  banya_description: string | null;
  banya_phone: string | null;
  banya_website: string | null;
  working_hours: string | null;
  amenities: string | null;
  price_range: string | null;
  is_published: boolean;
}

async function apiCall(action: string, method = 'GET', body?: Record<string, unknown>) {
  const token = authService.getToken();
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${PROFILE_URL}?action=${action}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
}

export const profileApi = {
  getDashboard: (): Promise<DashboardData> => apiCall('dashboard'),
  getProfile: () => apiCall('profile'),
  updateProfile: (data: Record<string, unknown>) => apiCall('profile', 'PUT', data),
  getRoles: () => apiCall('roles'),
  requestRole: (role: string) => apiCall('request-role', 'POST', { role }),
  getMasterProfile: (): Promise<{ master_profile: MasterProfile }> => apiCall('master-profile'),
  updateMasterProfile: (data: Record<string, unknown>) => apiCall('master-profile', 'PUT', data),
  getPartnerProfile: (): Promise<{ partner_profile: PartnerProfile }> => apiCall('partner-profile'),
  updatePartnerProfile: (data: Record<string, unknown>) => apiCall('partner-profile', 'PUT', data),
  getAdminUsers: () => apiCall('admin-users'),
  approveRole: (roleId: number, approve: boolean) => apiCall('approve-role', 'POST', { role_id: roleId, approve }),
};

export default profileApi;
