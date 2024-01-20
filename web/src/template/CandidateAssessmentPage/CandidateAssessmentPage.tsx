import matchyaSticker from '@/assets/matchya-sticker.png';
import { Button, Icons } from '@/components';

const mockedQuestion = {
  question:
    'Explain the importance of branching strategies in Git, and discuss how a well-defined branching model contributes to collaboration, code quality, and release management in a software development team.',
  metrics: [
    'Understanding of branching strategies in Git',
    'Understanding of release management and version control',
    'Impact of branching strategies on collaboration and code quality',
  ],
};

const CandidateAssessmentPageTemplate = () => {
  return (
    <div className="w-full h-screen bg-macha-200 flex flex-col justify-between">
      <div>
        {/* Header for Candidate Assessment Page */}
        <div className="w-full h-16 bg-macha-500 flex justify-between items-center px-10">
          <div className="flex items-center space-x-4 px-4 cursor-pointer">
            <img src={matchyaSticker} alt="logo" className="w-48" />
          </div>
          <div className="flex w-1/2 justify-around">
            <div className="ml-auto flex items-center space-x-4 hidden sm:block">
              <p className="text-lg">Welcome, Takeshi Hashimoto</p>
            </div>
            <div className="ml-auto flex items-center space-x-4 hidden sm:block">
              <p className="text-lg">Apple - SWE Test</p>
            </div>
          </div>
        </div>

        {/* Time and Question count */}
        <div className="flex items-center justify-center px-20 pt-4 border-b-4 border-macha-700 pb-4">
          <div className="w-1/2">
            <p className="text-2xl font-bold">3:38</p>
          </div>
          <div className="flex justify-end w-1/2">
            <p className="text-2xl font-bold text-right">Question. 3</p>
          </div>
        </div>
      </div>

      <div>
        {/* Question */}
        <div className="flex flex-col justify-center items-center pt-10 w-2/3 mx-auto">
          <div className="px-20">
            <p className="text-2xl font-bold text-center">
              {mockedQuestion.question}
            </p>
          </div>

          <div className="w-full flex flex-wrap justify-center items-center pt-10">
            {mockedQuestion.metrics.map(metric => (
              <div
                key={metric}
                className="p-4 w-60 h-24 bg-orange-50 m-2 overflow-y-scroll"
              >
                <p className="text-md text-center"> {metric}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Recording Button */}
      <div className="flex justify-center w-full items-center py-20">
        <Button className="bg-macha-200 hover:bg-macha-300 text-orange-300 font-bold py-8 px-10 text-xl rounded-full border-2 border-orange-300">
          <Icons.circle className="h-6 w-6 mr-2" />
          Record
        </Button>
      </div>
    </div>
  );
};

export default CandidateAssessmentPageTemplate;
