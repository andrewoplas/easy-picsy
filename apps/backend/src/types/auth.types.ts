export interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
    supabaseId: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  supabaseId: string;
}
