export function getAuthToken(): string {
  return localStorage.getItem('token') || '';
}