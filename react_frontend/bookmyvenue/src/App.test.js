import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { getFeaturedVenues, getVenueBySlug, getVenues } from './api/venueApi';
import {
  addFavorite,
  getFavorites,
  hasAccessToken,
  removeFavorite,
} from './api/favoriteApi';
import {
  getCurrentUser,
  hasAuthSession,
  loginUser,
  logoutUser,
  signupUser,
} from './api/authApi';
import { createBooking } from './api/bookingApi';

jest.mock('./api/venueApi', () => ({
  getFeaturedVenues: jest.fn(),
  getVenueBySlug: jest.fn(),
  getVenues: jest.fn(),
}));

jest.mock('./api/favoriteApi', () => ({
  addFavorite: jest.fn(),
  getFavorites: jest.fn(),
  hasAccessToken: jest.fn(),
  removeFavorite: jest.fn(),
}));

jest.mock('./api/authApi', () => ({
  AUTH_CHANGED_EVENT: 'bookmyvenue:auth-changed',
  getCurrentUser: jest.fn(),
  hasAuthSession: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  signupUser: jest.fn(),
}));

jest.mock('./api/bookingApi', () => ({
  createBooking: jest.fn(),
}));

const createVenue = (id, name) => ({
  id,
  name,
  slug: name.toLowerCase().replaceAll(' ', '-'),
  city: 'Kochi',
  max_capacity: 200,
  base_price_per_day: '25000.00',
  cover_image: null,
  amenities: [],
});

const createVenueDetail = (id, name) => ({
  ...createVenue(id, name),
  venue_type_display: 'Wedding Hall',
  description: 'A venue used by the detail page test.',
  address: 'Test Road',
  state: 'Kerala',
  postal_code: '682001',
  country: 'India',
  contact_phone: '+91 90000 10001',
  contact_email: 'venue@example.com',
  is_verified: true,
  amenities: [
    {
      id: 1,
      name: 'Parking',
      slug: 'parking',
      icon: 'bi bi-p-circle',
    },
  ],
  images: [],
  packages: [],
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  hasAccessToken.mockImplementation(() => Boolean(localStorage.getItem('accessToken')));
  hasAuthSession.mockImplementation(() => Boolean(
    localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')
  ));
  getCurrentUser.mockResolvedValue({
    id: 1,
    username: 'alan',
    fullname: 'Alan Thomas',
    email: 'alan@example.com',
    account_type: 'venue_user',
  });
  loginUser.mockResolvedValue({
    access: 'test-access-token',
    refresh: 'test-refresh-token',
  });
  signupUser.mockResolvedValue({ id: 1, username: 'alan' });
  logoutUser.mockImplementation(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  });
  getFavorites.mockResolvedValue([]);
  addFavorite.mockImplementation(async (venueId) => ({ id: 100 + venueId }));
  removeFavorite.mockResolvedValue(undefined);
  createBooking.mockResolvedValue({ id: 1, status: 'pending' });
});

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter
      initialEntries={initialEntries}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>
  );
}

test('loads and appends featured venues', async () => {
  getFeaturedVenues
    .mockResolvedValueOnce({
      count: 4,
      next: 'http://api.test/venues/featured/?page=2',
      previous: null,
      results: [
        createVenue(1, 'Alpha Hall'),
        createVenue(2, 'Bravo Hall'),
        createVenue(3, 'Charlie Hall'),
      ],
    })
    .mockResolvedValueOnce({
      count: 4,
      next: null,
      previous: 'http://api.test/venues/featured/?page=1',
      results: [createVenue(4, 'Delta Hall')],
    });

  renderApp();

  expect(await screen.findByText('Alpha Hall')).toBeInTheDocument();
  expect(getFeaturedVenues).toHaveBeenCalledWith(1);

  fireEvent.click(screen.getByRole('button', { name: /load more/i }));

  expect(await screen.findByText('Delta Hall')).toBeInTheDocument();
  expect(screen.getByText('Alpha Hall')).toBeInTheDocument();
  expect(getFeaturedVenues).toHaveBeenCalledWith(2);
  expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
});

test('shows the user name and sign out instead of login links when authenticated', async () => {
  localStorage.setItem('accessToken', 'test-access-token');
  getFeaturedVenues.mockResolvedValue({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  renderApp();

  const nameLink = await screen.findByRole('link', { name: 'Alan Thomas' });
  expect(nameLink).toHaveAttribute('href', '#profile');
  expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'SignUp' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

  expect(logoutUser).toHaveBeenCalled();
  expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'SignUp' })).toBeInTheDocument();
});

test('redirects to the homepage after a successful login', async () => {
  getFeaturedVenues.mockResolvedValue({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  renderApp(['/login']);

  fireEvent.change(screen.getByLabelText('Username'), {
    target: { value: 'alan' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'test-password' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));

  await waitFor(() => {
    expect(loginUser).toHaveBeenCalledWith({
      username: 'alan',
      password: 'test-password',
    });
  });
  expect(await screen.findByRole('heading', {
    name: /find and book the right venue/i,
  })).toBeInTheDocument();
});

test('returns to the venue detail page after login when booking was attempted', async () => {
  getVenueBySlug.mockResolvedValue(createVenueDetail(1, 'Alpha Hall'));
  renderApp([{
    pathname: '/login',
    state: { returnTo: '/venues/alpha-hall' },
  }]);

  fireEvent.change(screen.getByLabelText('Username'), {
    target: { value: 'alan' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'test-password' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));

  expect(await screen.findByRole('heading', { name: 'Alpha Hall' })).toBeInTheDocument();
  expect(getVenueBySlug).toHaveBeenCalledWith('alpha-hall');
});

test('redirects a guest from Book Now to login and preserves signup access', async () => {
  getVenueBySlug.mockResolvedValue(createVenueDetail(1, 'Alpha Hall'));
  renderApp(['/venues/alpha-hall']);

  fireEvent.click(await screen.findByRole('button', { name: /book now/i }));

  expect(await screen.findByRole('heading', { name: 'Login' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Sign Up' }));
  expect(await screen.findByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
});

test('preserves the venue destination through signup and the following login', async () => {
  getVenueBySlug.mockResolvedValue(createVenueDetail(1, 'Alpha Hall'));
  renderApp([{
    pathname: '/signup',
    state: { returnTo: '/venues/alpha-hall' },
  }]);

  fireEvent.change(screen.getByLabelText('Full Name'), {
    target: { value: 'Alan Thomas' },
  });
  fireEvent.change(screen.getByLabelText('Email Address'), {
    target: { value: 'alan@example.com' },
  });
  fireEvent.change(screen.getByLabelText('User Name'), {
    target: { value: 'alan' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'test-password' },
  });
  fireEvent.change(screen.getByLabelText('Confirm Password'), {
    target: { value: 'test-password' },
  });
  fireEvent.click(screen.getByLabelText(/i agree to/i));
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  expect(await screen.findByRole('heading', { name: 'Login' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Username'), {
    target: { value: 'alan' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'test-password' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));

  expect(await screen.findByRole('heading', { name: 'Alpha Hall' })).toBeInTheDocument();
});

test('prevents a venue owner from booking', async () => {
  localStorage.setItem('accessToken', 'test-access-token');
  getCurrentUser.mockResolvedValue({
    id: 2,
    username: 'owner',
    fullname: 'Venue Owner',
    account_type: 'venue_owner',
  });
  getVenueBySlug.mockResolvedValue(createVenueDetail(1, 'Alpha Hall'));

  renderApp(['/venues/alpha-hall']);

  expect(await screen.findByText(/venue-owner accounts cannot book venues/i))
    .toBeInTheDocument();
  expect(screen.getByRole('button', { name: /book now/i })).toBeDisabled();
  expect(createBooking).not.toHaveBeenCalled();
});

test('allows a venue user to send a booking request', async () => {
  localStorage.setItem('accessToken', 'test-access-token');
  getVenueBySlug.mockResolvedValue(createVenueDetail(1, 'Alpha Hall'));
  renderApp(['/venues/alpha-hall']);

  await waitFor(() => expect(getCurrentUser).toHaveBeenCalled());
  fireEvent.change(screen.getByLabelText(/event date/i), {
    target: { value: '2099-01-01' },
  });
  fireEvent.change(screen.getByLabelText(/number of guests/i), {
    target: { value: '120' },
  });
  fireEvent.click(screen.getByRole('button', { name: /book now/i }));

  await waitFor(() => {
    expect(createBooking).toHaveBeenCalledWith({
      venue_id: 1,
      event_date: '2099-01-01',
      event_type: 'wedding',
      guest_count: 120,
      message: '',
    });
  });
  expect(screen.getByRole('status')).toHaveTextContent(/sent successfully/i);
});

test('opens the selected featured venue detail', async () => {
  localStorage.setItem('accessToken', 'test-access-token');
  getFeaturedVenues.mockResolvedValue({
    count: 1,
    next: null,
    previous: null,
    results: [createVenue(1, 'Alpha Hall')],
  });
  getVenueBySlug.mockResolvedValue(createVenueDetail(1, 'Alpha Hall'));

  renderApp();

  fireEvent.click(await screen.findByRole('link', { name: /view details/i }));

  await waitFor(() => {
    expect(getVenueBySlug).toHaveBeenCalledWith('alpha-hall');
  });

  expect(await screen.findByRole('button', { name: /book now/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/event type/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
  expect(screen.getByText('Parking').querySelector('i')).toHaveClass('bi-p-circle');
  expect(screen.queryByText(/fast owner response/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /contact venue/i })).not.toBeInTheDocument();

  const favoriteButton = screen.getByRole('button', {
    name: /add alpha hall to favorites/i,
  });
  await waitFor(() => expect(getFavorites).toHaveBeenCalled());
  fireEvent.click(favoriteButton);
  await waitFor(() => {
    expect(addFavorite).toHaveBeenCalledWith(1);
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
  });

  fireEvent.click(favoriteButton);
  await waitFor(() => {
    expect(removeFavorite).toHaveBeenCalledWith(101);
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
  });

  fireEvent.click(screen.getByRole('button', { name: /contact details/i }));

  expect(screen.getByText('+91 90000 10001')).toBeInTheDocument();
  expect(screen.getByText('venue@example.com')).toBeInTheDocument();
});

test('loads and removes a saved favorite from the venue listing', async () => {
  const venue = createVenue(1, 'Alpha Hall');
  localStorage.setItem('accessToken', 'test-access-token');
  getVenues.mockResolvedValue({
    count: 1,
    next: null,
    previous: null,
    results: [venue],
  });
  getFavorites.mockResolvedValue([{ id: 42, venue }]);

  renderApp(['/venues']);

  const favoriteButton = await screen.findByRole('button', {
    name: /remove alpha hall from favorites/i,
  });
  expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(favoriteButton);

  await waitFor(() => {
    expect(removeFavorite).toHaveBeenCalledWith(42);
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
  });
});

test('loads a venue detail directly from its URL', async () => {
  getVenueBySlug.mockResolvedValue(createVenueDetail(1, 'Alpha Hall'));

  renderApp(['/venues/alpha-hall']);

  expect(await screen.findByRole('heading', { name: 'Alpha Hall' })).toBeInTheDocument();
  expect(getVenueBySlug).toHaveBeenCalledWith('alpha-hall');
  const breadcrumb = screen.getByLabelText('breadcrumb');
  expect(breadcrumb.querySelector('a[href="/"]')).toBeInTheDocument();
  expect(breadcrumb.querySelector('a[href="/venues"]')).toBeInTheDocument();
});

test('shows a not-found page for an unknown URL', () => {
  renderApp(['/does-not-exist']);

  expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/');
});
