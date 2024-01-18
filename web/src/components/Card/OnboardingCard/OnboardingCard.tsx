import { Link } from 'react-router-dom';

interface OnboardingCardProps {
  title: string;
  link: string;
}

const OnboardingCard = ({ title, link }: OnboardingCardProps) => {
  return (
    <Link
      to={link}
      className="w-full max-w-[300px] h-[185px] px-10 py-5 flex items-end rounded-xl bg-orange-50 hover:shadow-md"
    >
      <h4 className="text-lg font-bold w-[120px] leading-6">{title}</h4>
    </Link>
  );
};

export default OnboardingCard;
