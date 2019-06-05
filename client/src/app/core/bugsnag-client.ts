// tslint:disable-next-line:import-name
import bugsnag from '@bugsnag/js';
import { environment } from '../../environments/environment';
import { ConnectedUser } from '../shared/models';
import { versions } from '../../environments/versions';

const BUGSNAG_KEY = environment.BUGSNAG_KEY;

function computeName(user: ConnectedUser) {
  if (user.isBarman()) return `${user.barman.firstName} ${user.barman.lastName}`;
  if (user.isGuest()) return 'Guest';
  return user.specialAccount.description;
}

function computeRoles(user: ConnectedUser) {
  if (user.isBarman()) return user.barman.roles.map(r => r.name);
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

export function setBugsnagUser(user: ConnectedUser) {
  if (bugsnagClient) {
    bugsnagClient.user = {
      id: user.getConnection().id,
      name: computeName(user),
      email: user.email,
    };

    bugsnagClient.metaData['user'] = {
      roles: computeRoles(user),
    };
  }
}

export function clearBugsnagUser() {
  if (bugsnagClient) {
    bugsnagClient.user = null;
  }
}
