import { useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/Tabs/Tabs';
import { trackEvent } from '@/lib/rudderstack';
import { Answer, Interview } from '@/types';

interface InterviewDetailPageTemplateProps {
  interviewData: Interview;
}

const InterviewDetailPageTemplate = ({
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
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-bold">{interviewData.candidate.name}</p>
        <p className="text-md ">{interviewData.candidate.email}</p>
        <p className="text-md text-gray-600">
          {interviewData.assessment.name} -{' '}
          {interviewData.createdAt.substring(0, 10)}
        </p>
      </div>
      <div className="mb-8">
        <p className="text-xl font-bold text-center">
          Overall feedback from Matchya AI
        </p>
        <p>{interviewData.summary}</p>
      </div>

      <Tabs defaultValue={interviewData.answers[0].quiz.id} className="mb-8">
        <TabsList>
          {interviewData.answers.map(answer => (
            <TabsTrigger value={answer.quiz.id}>
              {answer.quiz.subtopic}
            </TabsTrigger>
          ))}
        </TabsList>
        {interviewData.answers.map(answer => (
          <TabsContent value={answer.quiz.id}>
            <div>
              <div className="flex flex-row mb-4">
                <div>Graph</div>
                <div>Card</div>
              </div>
              <div>
                <p className="text-xl font-bold">Answer Summary & Feedback</p>
                <p>{answer.feedback}</p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="lg:flex-grow-0 lg:flex-shrink-0 mb-4">
        <ReactPlayer
          url={currentAnswer?.videoUrl}
          controls={true}
          width={'50%'}
          height={'auto'}
        />
      </div>
    </div>
  );
};

export default InterviewDetailPageTemplate;
