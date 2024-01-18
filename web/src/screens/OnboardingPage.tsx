import { useCompanyStore } from '@/store/store';
import OnboardingPageTemplate from '@/template/OnboardingPage/OnboardingPage';

const OnboardingPage = () => {
  const { name } = useCompanyStore();
  return <OnboardingPageTemplate companyName={name} />;
};

export default OnboardingPage;
