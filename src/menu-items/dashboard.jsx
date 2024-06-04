// src/menu-items/dashboard.js
import { DashboardOutlined, UserOutlined, CalendarOutlined, ApiOutlined, FileTextOutlined } from '@ant-design/icons';

const icons = {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  ApiOutlined,
  FileTextOutlined
};

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'event',
      title: 'Event',
      type: 'item',
      url: '/event',
      icon: icons.CalendarOutlined,
      breadcrumbs: false
    },
    {
      id: 'integration',
      title: 'Integration',
      type: 'item',
      url: '/integration',
      icon: icons.ApiOutlined,
      breadcrumbs: false
    },
    {
      id: 'logs',
      title: 'Log',
      type: 'item',
      url: '/log',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
