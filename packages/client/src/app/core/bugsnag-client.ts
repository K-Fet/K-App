// tslint:disable-next-line:import-name
import bugsnag from '@bugsnag/js';
import { environment } from '../../environments/environment';
import { Barman, isUserBarman, isUserGuest, isUserServiceAccount, ServiceAccount, User } from '../shared/models';
import { versions } from '../../environments/versions';

const BUGSNAG_KEY = environment.BUGSNAG_KEY;

function computeName(user: User): string {
  if (isUserBarman(user)) return `${(user.account as Barman).firstName} ${(user.account as Barman).lastName}`;
  if (isUserGuest(user)) return 'Guest';
  if (isUserServiceAccount(user)) return (user.account as ServiceAccount).description;
  return 'Unknown';
}

function computeRoles(user: User): null | string[] {
  if (isUserBarman(user)) return (user.account as Barman).roles as string[];
  return null;
}

export const bugsnagClient = BUGSNAG_KEY ? bugsnag({
  apiKey: BUGSNAG_KEY,
  appVersion: versions.version,
  releaseStage: environment.RELEASE_STAGE,
  filters: [
    'token',
    /^password$/i,
    /^oldPassword$/i,
  ],
}) : null;

export function setBugsnagUser(user: User): void {
  if (bugsnagClient) {
    bugsnagClient.user = {
      id: user._id,
      name: computeName(user),
      email: user.email,
    };

    bugsnagClient.metaData = {
      user: {
        roles: computeRoles(user),
      },
    };
  }
}

export function clearBugsnagUser(): void {
  if (bugsnagClient) {
    bugsnagClient.user = null;
  }
}
