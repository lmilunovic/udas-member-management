import type enCommon from '../locales/en/common.json';
import type enDashboard from '../locales/en/dashboard.json';
import type enLayout from '../locales/en/layout.json';
import type enLogin from '../locales/en/login.json';
import type enMembers from '../locales/en/members.json';
import type enUsers from '../locales/en/users.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof enCommon;
      layout: typeof enLayout;
      dashboard: typeof enDashboard;
      members: typeof enMembers;
      users: typeof enUsers;
      login: typeof enLogin;
    };
  }
}
