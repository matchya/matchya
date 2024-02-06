import ShadcnBadge from './Badge.shadcn';

interface BadgeProps {
  className?: string;
  variant?:
    | 'secondary'
    | 'default'
    | 'destructive'
    | 'outline'
    | null
    | undefined;
  children: React.ReactNode;
}

const Badge = ({ className, variant, children }: BadgeProps) => (
  <ShadcnBadge className={className} variant={variant}>
    {children}
  </ShadcnBadge>
);

export default Badge;
