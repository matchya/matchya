import { Link } from 'react-router-dom';

import interviewMock from '@/assets/interview-mock.png';

const InterviewDetailPage = ({ testName = 'random test' }) => {
  return (
    <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <div className="w-full h-full mx-auto">
          <div className="justify-between items-center py-12">
            <div className="px-6 lg:px-12">
              <div className="mb-8 flex justify-between items-center">
                <div className="space-y-4">
                  <Link to="/interviews" className="text-lg font-bold">
                    Back to Interview List
                  </Link>
                </div>
              </div>
              <div className="flex space-x-3">
                <p>Takeshi Hashimoto</p>
                <p>{testName}</p>
              </div>
              <div className="lg:flex">
                <div className="lg:flex-grow-0 lg:flex-shrink-0 lg:w-1/2">
                  <img
                    src={interviewMock}
                    className="w-full h-full max-h-[1087px] object-cover"
                  />
                </div>
                <div className="lg:flex-grow lg:w-1/2 lg:pl-8">
                  <h3>Review by Matchya AI</h3>
                  <p>
                    The candidate has demonstrated a strong understanding of
                    various technical concepts, including microservices
                    architecture, SQL JOIN operations, React state, and
                    Dockerfile components. Their answers are comprehensive and
                    clear, showcasing a good grasp of the subject matter.
                    Strengths include providing detailed explanations and
                    examples, as well as demonstrating knowledge of relevant
                    strategies and optimizations. However, there is room for
                    improvement in discussing real-world examples, advanced
                    scenarios, and potential pitfalls. Overall, the candidate's
                    performance is commendable, with a consistent score range
                    indicating a solid technical foundation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailPage;
