interface OnboardingCardProps {
  title: string;
}

const OnboardingCard = ({ title }: OnboardingCardProps) => {
  return (
    <div className="w-full max-w-[200px] h-[125px] p-3 flex items-end rounded-xl bg-macha-50">
      <h4 className="text-sm font-bold w-[120px] leading-4">{title}</h4>
    </div>
  );
};

export default OnboardingCard;
