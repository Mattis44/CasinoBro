import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import CreateView from 'src/pages/forum/createView';

import { LoadingScreen } from 'src/components/loading-screen';
import ForumIdView from 'src/pages/forum/id/view';
import ForumAdminView from 'src/pages/forum/admin/view';

// ----------------------------------------------------------------------

const DashboardPage = lazy(() => import('src/pages/dashboard/view'));
const WalletPage = lazy(() => import('src/pages/wallet/view'));
const ForumPage = lazy(() => import('src/pages/forum/view'));
const Profile = lazy(() => import('src/pages/profile/view'));
// const ReferralPage = lazy(() => import('src/pages/referral/view'));
// const SettingsPage = lazy(() => import('src/pages/settings/view'));
// const SupportPage = lazy(() => import('src/pages/support/view'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'app',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <DashboardPage />, index: true },
      {
        path: 'wallet',
        element: <WalletPage />,
      },
      {
        path: 'forum',
        children: [
          {
            element: <ForumPage />,
            index: true,
          },
          {
            path: ':id',
            element: <ForumIdView />,
          },
          {
            path: 'add',
            element: <CreateView />,
          },
          {
            path: 'admin',
            element: <ForumAdminView />,
          }
        ],
      },
      {
        path: 'profile',
        children: [
          {
            element: <Profile />,
            index: true,
          },
          {
            path: ":id",
            element: <Profile />,
          }
        ]
      }
      // {
      //   path: 'referral',
      //   element: <ReferralPage />,
      // },
      // {
      //   path: 'settings',
      //   element: <SettingsPage />,
      // },
      // {
      //   path: 'support',
      //   element: <SupportPage />,
      // },
    ],
  },
];
