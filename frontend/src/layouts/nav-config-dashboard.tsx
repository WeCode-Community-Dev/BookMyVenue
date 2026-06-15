import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navDataUser = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Product',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];

export const navDataAdmin = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/admin/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Venues',
    path: '/admin/venues',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
];


export const navDataVenueOwner = [
  {
    title: 'Dashboard',
    path: '/owner',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/owner/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Bookings',
    path: '/owner/bookings',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
];
