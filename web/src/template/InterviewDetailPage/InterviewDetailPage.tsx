import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';

import interviewMock from '@/assets/interview-mock.png';
import { Interview } from '@/types';

interface InterviewDetailPageTemplateProps {
  currentAnswer: any;
  interview: Interview;
  onSelectVideo: (answer: any) => void;
}

const InterviewDetailPageTemplate = ({
  currentAnswer,
  interview,
  onSelectVideo,
}: InterviewDetailPageTemplateProps) => {
  console.log(interview);
  return (
    <div className="h-[calc(100vh-64px)] overflow-y-scroll bg-macha-200">
      <div className="w-full mx-auto">
        <div className="w-full mx-auto">
          <div className="justify-between items-center pt-6">
            <div className="px-6 lg:px-12">
              <div className="w-full flex">
                <div className="w-2/3">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="space-y-4">
                      <Link
                        to="/interviews"
                        className="text-lg font-bold text-macha-700"
                      >
                        ← Back to Interviews
                      </Link>
                    </div>
                  </div>
                  <div className="w-full ml-3 flex justify-around mb-3 items-center">
                    <p className="text-3xl font-bold">
                      {interview.candidate.name}
                    </p>
                    <p className="text-2xl">
                      {interview.assessment.name} -{' '}
                      {interview.createdAt.substring(0, 10)}
                    </p>
                  </div>
                  <div className="w-full flex flex-col items-center justify-center">
                    <div className="lg:flex-grow-0 lg:flex-shrink-0">
                      <ReactPlayer
                        url={`https://dev-data-question-response-video.s3.amazonaws.com/${interview.id}/${currentAnswer.questionId}.webm`}
                        controls={true}
                        className="w-full h-full max-h-[1087px] object-contain"
                      />
                    </div>
                    <div className="w-4/5 mt-8 bg-orange-50 p-10 mx-20 rounded">
                      <div className="flex px-10 justify-around">
                        <h3 className="text-2xl font-bold text-macha-800">
                          Review By Matchya AI
                        </h3>
                        <p className="text-lg">
                          Total Score:{' '}
                          <span className="text-2xl font-bold text-macha-700 ml-1">
                            {interview.totalScore}
                          </span>{' '}
                          / 10
                        </p>
                      </div>
                      <p className="text-lg pt-3 pl-3 ml-3">
                        {interview.summary}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-1/3 pl-6 pt-3">
                  <div className="max-h-[60vh] overflow-y-scroll bg-orange-50 rounded-lg mb-6 pb-4">
                    <p className="text-2xl pt-3 pl-3 font-bold ml-3 my-3">
                      Questions
                    </p>

                    {interview.answers.map(answer => (
                      <div
                        className="w-full flex items-center cursor-pointer hover:bg-orange-100"
                        key={answer.questionId}
                        onClick={() => onSelectVideo(answer)}
                      >
                        <img src={interviewMock} className="w-1/3 pl-3" />
                        <div className="w-2/3 p-4">
                          <p className="text-xl font-bold">
                            {answer.questionTopic}
                          </p>
                          <p className="text-xs">
                            {answer.questionText.substring(0, 100) + '...'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-orange-50 rounded-lg mb-12">
                    <p className="text-2xl text-center font-bold text-black mb-4">
                      Question
                    </p>
                    <div className="flex justify-around mb-2">
                      <h3 className="text-xl font-bold text-macha-800">
                        {currentAnswer.questionTopic}
                      </h3>
                      <p className="text-md">
                        Score:{' '}
                        <span className="text-xl font-bold text-macha-700 ml-1">
                          {currentAnswer.score}
                        </span>{' '}
                        / 10
                      </p>
                    </div>
                    <p className="indent-4 text-sm mb-6">
                      {currentAnswer.questionText}
                    </p>
                    <p className="text-2xl text-center font-bold text-black mb-4">
                      Feedback
                    </p>
                    <p className="text-sm">{currentAnswer.feedback}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailPageTemplate;
