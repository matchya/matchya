import { Link } from 'react-router-dom';

interface OnboardingCardProps {
  title: string;
  link: string;
}

const OnboardingCard = ({ title, link }: OnboardingCardProps) => {
  return (
    <Link
      to={link}
      className="w-full max-w-[300px] h-[185px] px-10 py-5 flex items-end rounded-xl bg-white shadow-md hover:shadow-xl"
    >
      <h4 className="text-lg text-matcha-900 font-bold w-[140px] leading-6">
        {title}
      </h4>
    </Link>
  );
};

export default OnboardingCard;
