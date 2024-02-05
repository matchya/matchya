import { Link } from 'react-router-dom';

interface OnboardingCardProps {
  title: string;
  link: string;
}

const OnboardingCard = ({ title, link }: OnboardingCardProps) => {
  return (
    <Link
      to={link}
      className="w-full h-[185px] px-5 py-5 flex items-end rounded-xl hover:shadow-md transition-shadow hover:border-1 border-2 border-gray-100"
    >
      <h4 className="text-lg text-matcha-900 font-bold w-[140px] leading-6">
        {title}
      </h4>
    </Link>
  );
};

export default OnboardingCard;
