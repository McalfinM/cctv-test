import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const User = Loadable(lazy(() => import('pages/user/index')));
const Event = Loadable(lazy(() => import('pages/event/index')));
const Integration = Loadable(lazy(() => import('pages/integration/index')));
const Log = Loadable(lazy(() => import('pages/log/index')));

// ==============================|| MAIN ROUTING ||============================== //
let baseUrl = import.meta.env.VITE_APP_BASE_URL;

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault baseUrl={baseUrl} />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          element: <DashboardDefault baseUrl={baseUrl} />
        }
      ]
    },
    {
      path: 'user',
      element: <User baseUrl={baseUrl} />
    },
    {
      path: 'event',
      element: <Event baseUrl={baseUrl} />
    },
    {
      path: 'integration',
      element: <Integration baseUrl={baseUrl} />
    },
    {
      path: 'log',
      element: <Log baseUrl={baseUrl} />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;
