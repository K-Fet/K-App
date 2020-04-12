import { environment } from '../../../environments/environment';

export function toURL(action: string): string {
  const apiHostname = environment['API_HOSTNAME'];
  if (!apiHostname) return `/api/${action}`;
  return `https://${apiHostname}/${action}`;
}
