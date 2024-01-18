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
    <div className="bg-macha-200 h-full min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <div>
          <div className="w-full h-full mx-auto">
            <div className="justify-between items-center py-4">
              <div className="px-12 pt-8">
                <div className="mb-8 space-y-4">
                  <h3 className="text-4xl font-bold">Welcome, {companyName}</h3>
                  <p className="">Let's get started</p>
                </div>
                <div className="flex flex-wrap gap-6">
                  {steps.map(({ description, link }) => (
                    <OnboardingCard key={description} title={description} link={link} />
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
