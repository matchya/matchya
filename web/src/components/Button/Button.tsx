import ShadcnButton from './Button.shadcn';

interface ButtonProps {
  variant?:
    | 'ghost'
    | 'secondary'
    | 'default'
    | 'destructive'
    | 'outline'
    | null
    | undefined;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button = ({
  variant,
  className,
  onClick,
  disabled,
  children,
}: ButtonProps) => (
  <ShadcnButton
    variant={variant}
    className={className}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </ShadcnButton>
);

export default Button;
