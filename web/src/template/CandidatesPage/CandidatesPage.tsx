import { CandidatesTable } from '@/components';
import { Candidate } from '@/types';

interface CandidatesPageTemplateProps {
  candidates: Candidate[];
  isLoading: boolean;
}

const CandidatesPageTemplate = ({
  candidates,
  isLoading,
}: CandidatesPageTemplateProps) => {

  return (
    <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden bg-macha-200">
      <div className="w-full h-full mx-auto">
        <div>
          <div className="w-full h-full mx-auto">
            <div className="justify-between items-center py-12">
              <div className="px-12">
                <div className="mb-8 flex justify-between items-center">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-bold">Candidates</h3>
                  </div>
                </div>
                {!isLoading && <CandidatesTable candidates={candidates} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesPageTemplate;
