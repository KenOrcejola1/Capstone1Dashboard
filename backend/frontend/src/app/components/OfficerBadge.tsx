import { Award } from 'lucide-react';

// Same gold used across the theme (Sidebar, TopBar, RegisterPage, etc.)
const OFFICER_GOLD = '#c9a227';

interface OfficerBadgeProps {
  size?: number;
  className?: string;
}

/**
 * Small gold badge shown beside a name anywhere in the app to indicate the
 * person is a currently active, approved chapter officer. Driven by the
 * `is_officer` field the backend appends to every serialized User.
 */
export function OfficerBadge({ size = 14, className = '' }: OfficerBadgeProps) {
  return (
    <span title="Chapter Officer" className={`inline-flex shrink-0 ${className}`}>
      <Award size={size} style={{ color: OFFICER_GOLD }} aria-label="Chapter officer" />
    </span>
  );
}
