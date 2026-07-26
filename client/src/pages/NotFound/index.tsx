import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { FiHome, FiArrowLeft, FiAlertOctagon } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="relative mb-6">
        {/* Animated Background Ring */}
        <div className="absolute inset-0 rounded-full bg-[var(--bg-green)]/10 scale-150 blur-xl animate-pulse"></div>
        <div className="w-24 h-24 bg-[var(--bg-green)]/10 text-[var(--bg-green)] rounded-full flex items-center justify-center relative z-10 mx-auto">
          <FiAlertOctagon className="text-5xl" />
        </div>
      </div>

      <h1 className="text-8xl font-black text-[var(--bg-green)] tracking-wider mb-2">404</h1>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Page Not Found</h2>

      <p className="text-[var(--text-secondary)] max-w-md mb-8 text-sm md:text-base leading-relaxed">
        The venue you are looking for, or the page you requested, might have been moved, deleted, or
        is temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto px-6 py-5 rounded-xl border-[var(--bg-grey)] text-[var(--text-primary)] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--bg-grey)] transition-all cursor-pointer"
        >
          <FiArrowLeft className="text-lg" /> Go Back
        </Button>
        <Button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-6 py-5 rounded-xl bg-[var(--bg-green)] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[var(--bg-green)]/90 shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          <FiHome className="text-lg" /> Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
