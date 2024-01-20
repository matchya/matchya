import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';

import interviewMock from '@/assets/interview-mock.png';

interface InterviewDetailPageTemplateProps {
  questionId: string;
  interviewId: string;
  testName?: string;
}

const InterviewDetailPageTemplate = ({
  questionId,
  interviewId,
  testName,
}: InterviewDetailPageTemplateProps) => {
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
                    <p className="text-3xl font-bold">Takeshi Hashimoto</p>
                    <p className="text-2xl">{testName} - Jan 3, 2024</p>
                  </div>
                  <div className="w-full">
                    <div className="lg:flex-grow-0 lg:flex-shrink-0">
                      <ReactPlayer
                        url={`https://dev-data-question-response-video.s3.amazonaws.com/${interviewId}/${questionId}.webm`}
                        controls={true}
                        className="w-full h-full max-h-[1087px] object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-1/3 pl-6 pt-3">
                  <div className="max-h-[60vh] overflow-y-scroll bg-orange-50 rounded-lg mb-6 pb-4">
                    <p className="text-2xl pt-3 pl-3 font-bold ml-3 my-3">
                      Questions
                    </p>
                    <div className="w-full flex items-center cursor-pointer hover:bg-orange-100">
                      <img src={interviewMock} className="w-1/3 pl-3" />
                      <div className="w-2/3 p-4">
                        <p className="text-xl font-bold">Docker</p>
                        <p className="text-xs">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex items-center cursor-pointer  hover:bg-orange-100">
                      <img src={interviewMock} className="w-1/3 pl-3" />
                      <div className="w-2/3 p-4">
                        <p className="text-xl font-bold">AWS</p>
                        <p className="text-xs">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex items-center cursor-pointer hover:bg-orange-100">
                      <img src={interviewMock} className="w-1/3 pl-3" />
                      <div className="w-2/3 p-4">
                        <p className="text-xl font-bold">React</p>
                        <p className="text-xs">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit....
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex items-center cursor-pointer hover:bg-orange-100">
                      <img src={interviewMock} className="w-1/3 pl-3" />
                      <div className="w-2/3 p-4">
                        <p className="text-xl font-bold">Microservices</p>
                        <p className="text-xs">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit....
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex items-center cursor-pointer hover:bg-orange-100">
                      <img src={interviewMock} className="w-1/3 pl-3" />
                      <div className="w-2/3 p-4">
                        <p className="text-xl font-bold">Database Design</p>
                        <p className="text-xs">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit....
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex items-center cursor-pointer hover:bg-orange-100">
                      <img src={interviewMock} className="w-1/3 pl-3" />
                      <div className="w-2/3 p-4">
                        <p className="text-xl font-bold">Matchya</p>
                        <p className="text-xs">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit....
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-orange-50 rounded-lg mb-12">
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-macha-800">
                        Review by Matchya AI
                      </h3>
                      <p className="text-md">
                        Score:{' '}
                        <span className="text-xl font-bold text-macha-700 ml-1">
                          7.6
                        </span>{' '}
                        / 10
                      </p>
                    </div>
                    <p className="indent-4 text-sm">
                      The candidate has demonstrated a strong understanding of
                      various technical concepts, including microservices
                      architecture, SQL JOIN operations, React state, and
                      Dockerfile components. Their answers are comprehensive and
                      clear, showcasing a good grasp of the subject matter.
                      Strengths include providing detailed explanations and
                      examples, as well as demonstrating knowledge of relevant
                      strategies and optimizations. However, there is room for
                      improvement in discussing real-world examples, advanced
                      scenarios, and potential pitfalls. Overall, the
                      candidate's performance is commendable, with a consistent
                      score range indicating a solid technical foundation.
                    </p>
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
