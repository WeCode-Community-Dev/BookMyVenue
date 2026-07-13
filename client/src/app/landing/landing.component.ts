import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  readonly categories = ['Weddings', 'Corporate Events', 'Birthday Parties', 'Conferences', 'Social Gatherings', 'Product Launches'];

  readonly stats = [
    { value: '500+', label: 'Premium Venues' },
    { value: '10K+', label: 'Events Hosted' },
    { value: '50+', label: 'Cities Covered' },
    { value: '4.8★', label: 'Average Rating' },
  ];

  readonly featuredVenues = [
    { name: 'The Grand Ballroom', category: 'Banquet Hall', district: 'Ernakulam', capacity: 500, price: '₹25,000/slot', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80' },
    { name: 'Skyline Rooftop Terrace', category: 'Rooftop', district: 'Thrissur', capacity: 150, price: '₹12,000/slot', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80' },
    { name: 'Garden Pavilion', category: 'Outdoor', district: 'Kozhikode', capacity: 300, price: '₹18,000/slot', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80' },
  ];

  readonly features = [
    {
      title: 'Smart Search',
      desc: 'Filter venues by city, capacity, price range, and amenities to find your perfect match instantly.',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    },
    {
      title: 'Instant Booking',
      desc: 'Book your venue in minutes with our streamlined checkout. No phone calls, no waiting.',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Transparent Pricing',
      desc: 'See real-time per-slot pricing with zero hidden charges. Compare venues side by side.',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Verified Venues',
      desc: 'Every venue is verified by our team. Read genuine reviews from past event organizers.',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    },
    {
      title: 'Real-time Availability',
      desc: 'Check slot availability instantly. No more back-and-forth calls with venue managers.',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      title: 'Vendor Dashboard',
      desc: 'Vendors get powerful analytics, booking management, and revenue tracking tools built in.',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
  ];

  readonly steps = [
    { number: '01', title: 'Search & Discover', desc: 'Browse hundreds of venues. Filter by location, capacity, budget, and event type.' },
    { number: '02', title: 'Compare & Choose', desc: 'View photos, amenities, reviews, and pricing. Pick the venue that fits your vision.' },
    { number: '03', title: 'Book & Celebrate', desc: 'Confirm your slot, complete the booking, and get ready for your perfect event.' },
  ];
}
