import { OnboardingCard } from '@/components';

const steps = [
  {
    description: 'Complete your Profile',
  },
  {
    description: 'Create your first Matchya tests',
  },
  {
    description: 'Invite your first Candidate',
  },
  {
    description: 'Review your first Interview',
  },
];

const CandidatesPageTemplate = () => {
  return (
    <div className="bg-macha-200 h-full min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <div>
          <div className="w-full h-full mx-auto">
            <div className="justify-between items-center py-4">
              <div className="px-12 pt-8">
                <div className="mb-8 space-y-4">
                  <h3 className="text-4xl font-bold">Welcome, Ken</h3>
                  <p className="">Let's get started</p>
                </div>
                <div className="flex flex-wrap gap-6">
                  {steps.map(({ description }) => (
                    <OnboardingCard title={description} />
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
