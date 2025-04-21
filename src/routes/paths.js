// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/app',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
      register: `${ROOTS.AUTH}/register`,
    },
    discord: {
      root: `https://discord.com/oauth2/authorize?client_id=1218929281321930872&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3031%2Fauth%2Fdiscord&scope=identify+email`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    general: {
      wallet: `${ROOTS.DASHBOARD}/wallet`,
      forum: `${ROOTS.DASHBOARD}/forum`,
      formation: `${ROOTS.DASHBOARD}/formation`,
      profile: `${ROOTS.DASHBOARD}/profile`,
      // referral: `${ROOTS.DASHBOARD}/referral`,
      // settings: `${ROOTS.DASHBOARD}/settings`,
      // support: `${ROOTS.DASHBOARD}/support`,
    },
  },
};
