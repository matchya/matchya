import { CandidatesTable, Icons } from '@/components';
import { Candidate } from '@/types';

interface CandidatesPageTemplateProps {
  candidates: Candidate[];
  isLoading: boolean;
}

const CandidatesPageTemplate = ({
  candidates,
  isLoading,
}: CandidatesPageTemplateProps) => {
  console.log(candidates)
  return (
    <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden bg-matcha-30">
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
                {isLoading && (
                  <div className="flex mt-48 justify-center items-center">
                    <Icons.spinner className="spinner h-8 w-8" />
                  </div>
                )}
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
