import { useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';

import { trackEvent } from '@/lib/rudderstack';
import { Answer, Interview } from '@/types';

interface InterviewDetailPageTemplateProps {
  interviewData: Interview;
}

const InterviewDetailPageTemplateCopy = ({
  interviewData,
}: InterviewDetailPageTemplateProps) => {
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(
    interviewData.answers[0]
  );
  const handleSelectVideo = (answer: Answer) => {
    if (!interviewData || !interviewData.answers.length) return;
    const id = answer.quiz.id;
    trackEvent({ eventName: 'select_video', properties: { id } });
    setCurrentAnswer(answer);
  };
  return (
    <div className="h-[calc(100vh-64px)] overflow-y-scroll">
      <div className="w-full mx-auto">
        <div className="justify-between items-center py-12">
          <div className="px-4 md:px-12">
            <div className="w-full space-y-8">
              <div className="lg:flex lg:mb-0">
                <div className="items-center lg:pr-4 lg:relative lg:top-[5px] mb-6 lg:mb-0">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="space-y-4">
                      <Link to="/interviews">
                        <div className="w-full flex justify-start">
                          <p className="text-xl font-bold text-matcha-800">
                            ← Back
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <p className="text-3xl font-bold">
                    {interviewData.candidate.name}
                  </p>
                  <p className="text-md text-gray-600 mb-8">
                    {interviewData.assessment.name} -{' '}
                    {interviewData.createdAt.substring(0, 10)}
                  </p>
                  <div className="lg:flex-grow-0 lg:flex-shrink-0 mb-4">
                    <ReactPlayer
                      url={currentAnswer?.videoUrl}
                      controls={true}
                      width={'100%'}
                      height={'auto'}
                    />
                  </div>
                  <div className="space-y-2 pr-4 lg:ml-0 mb-8 lg:mb-0">
                    <p className="text-lg font-bold">Question</p>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-matcha-500">
                        {currentAnswer?.quiz.topic}
                      </h3>
                      <p className="text-md">
                        Score:{' '}
                        <span className="text-matcha-700">
                          {currentAnswer?.score}
                        </span>{' '}
                        %
                      </p>
                    </div>
                    <p className="text-sm mb-6">
                      {currentAnswer?.quiz.description}
                    </p>
                    <p className="text-sm">{currentAnswer?.feedback}</p>
                  </div>
                </div>
                <div className="lg:pl-4 w-full">
                  <div className="overflow-hidden w-full rounded-lg border border-gray-200">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-2xl font-bold">Questions</p>
                    </div>
                    <div className=" h-full max-h-[300px] lg:max-h-[600px] overflow-y-scroll">
                      {interviewData.answers.map(answer => (
                        <div
                          className={`w-full flex cursor-pointer hover:bg-orange-100 p-3`}
                          key={answer.quiz.id}
                          onClick={() => handleSelectVideo(answer)}
                        >
                          <ReactPlayer
                            url={answer.videoUrl}
                            controls={false}
                            playing={false}
                            width={320}
                            height={'100%'}
                          />
                          <div className="w-full p-2">
                            <p
                              className={`text-md font-bold ${
                                currentAnswer?.quiz.id === answer.quiz.id &&
                                'text-matcha-500'
                              }`}
                            >
                              {answer.quiz.topic}
                            </p>
                            <p className="text-xs">
                              {answer.quiz.description + '...'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded space-y-3">
                <div className="space-y-1">
                  <h3 className="text-matcha-500 text-2xl font-bold">
                    Review By Matchya AI
                  </h3>
                  <p className="text-xl">
                    Total Score:{' '}
                    <span className="text-macha-700">
                      {interviewData.totalScore}
                    </span>{' '}
                    %
                  </p>
                </div>
                <p className="text-md">{interviewData.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailPageTemplateCopy;
