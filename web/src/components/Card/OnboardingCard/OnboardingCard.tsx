interface OnboardingCardProps {
  title: string;
}

const OnboardingCard = ({ title }: OnboardingCardProps) => {
  return (
    <div className="w-full max-w-[300px] h-[185px] px-10 py-5 flex items-end rounded-xl bg-orange-50 cursor-pointer hover:shadow-md">
      <h4 className="text-lg font-bold w-[120px] leading-6">{title}</h4>
    </div>
  );
};

export default OnboardingCard;
