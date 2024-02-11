import { Link } from 'react-router-dom';

interface OnboardingCardProps {
  title: string;
  link: string;
}

const OnboardingCard = ({ title, link }: OnboardingCardProps) => {
  return (
    <Link
      to={link}
      className="w-[280px] h-[185px] px-5 py-5 flex items-end rounded-xl shadow hover:shadow-md hover:shadow-matcha-200 hover:border-1 border border-gray-300"
    >
      <h4 className="text-lg text-matcha-900 font-bold w-[140px] leading-6">
        {title}
      </h4>
    </Link>
  );
};

export default OnboardingCard;
