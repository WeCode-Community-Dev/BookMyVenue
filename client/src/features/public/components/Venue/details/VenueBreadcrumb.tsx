import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface VenueBreadcrumbProps {
  venueName: string;
}

export default function VenueBreadcrumb({ venueName }: VenueBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs text-muted">
      <Link to="/venues" className="hover:text-foreground transition-colors">
        Venues
      </Link>
      <ChevronRight size={12} />
      <span className="text-foreground font-medium truncate max-w-[200px]">{venueName}</span>
    </nav>
  );
}
