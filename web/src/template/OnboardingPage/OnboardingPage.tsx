import { OnboardingCard } from '@/components';

const steps = [
  {
    description: 'Create Matchya assessment',
    link: '/assessments',
  },
  {
    description: 'See your candidates',
    link: '/candidates',
  },
  {
    description: 'Review your Interviews',
    link: '/interviews',
  },
];

interface CandidatesPageTemplateProps {
  companyName: string;
}

const CandidatesPageTemplate = ({
  companyName,
}: CandidatesPageTemplateProps) => {
  return (
    <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <div>
          <div className="w-full h-full mx-auto">
            <div className="justify-between items-center py-4">
              <div className="px-4 md:px-12 pt-8">
                <div className="mb-8 space-y-4">
                  <h3 className="text-4xl font-bold">Welcome, {companyName}</h3>
                </div>
                <div className="mt-16 gap-y-3 gap-x-6 flex flex-wrap">
                  {steps.map(({ description, link }) => (
                    <OnboardingCard
                      key={description}
                      title={description}
                      link={link}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesPageTemplate;
