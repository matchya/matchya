import React from 'react';

import matchyaSticker from '@/assets/matchya-sticker.png';

const CandidateAssessmentPageTemplate = () => {
  return (
    <div className="w-full h-screen bg-macha-200 flex flex-col justify-between">
      <div>
        {/* Header for Candidate Assessment Page */}
        <div className="w-full h-16 bg-macha-500 flex items-center px-10">
          <div className="flex items-center space-x-4 px-4 cursor-pointer">
            <img src={matchyaSticker} alt="logo" className="w-48" />
          </div>
          <div className="ml-auto flex items-center space-x-4 hidden sm:block">
            <p className="text-lg">Welcome, Takeshi Hashimoto</p>
          </div>
          <div className="ml-auto flex items-center space-x-4 hidden sm:block">
            <p className="text-lg">Apple - SWE Test</p>
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
              Explain the importance of branching strategies in Git, and discuss
              how a well-defined branching model contributes to collaboration,
              code quality, and release management in a software development
              team.
            </p>
          </div>

          <div className="w-full flex flex-wrap justify-center items-center pt-10">
            <div className="p-4 w-60 h-24 bg-orange-50 m-2 overflow-y-scroll">
              <p className="text-md text-center">
                {' '}
                Understanding of branching strategies in Git
              </p>
            </div>
            <div className="p-4 w-60 h-24 bg-orange-50 m-2 overflow-y-scroll">
              <p className="text-md text-center">
                {' '}
                Understanding of release management and version control
              </p>
            </div>
            <div className="p-4 w-60 h-24 bg-orange-50 m-2 overflow-y-scroll">
              <p className="text-md text-center">
                {' '}
                Impact of branching strategies on collaboration and code quality
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Recording Button */}
      <div className="flex justify-center w-full items-center py-20">
        <button className="bg-macha-500 hover:bg-macha-700 text-white font-bold py-2 px-4 rounded-full">
          Start Recording
        </button>
      </div>
    </div>
  );
};

export default CandidateAssessmentPageTemplate;
