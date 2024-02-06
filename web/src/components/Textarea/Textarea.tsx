import ShadcnTextarea from './Textarea.shadcn';

interface TextareaProps {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = ({
  className,
  placeholder,
  value,
  onChange,
}: TextareaProps) => (
  <ShadcnTextarea
    className={className}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

export default Textarea;
