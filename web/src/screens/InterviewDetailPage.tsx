import Template from '../template/InterviewDetailPage/InterviewDetailPage';

function InterviewDetailPage() {
  const interviewId = '123';
  const questionId = '456';
  const testName = 'random test';
  return (
    <Template
      questionId={questionId}
      interviewId={interviewId}
      testName={testName}
    />
  );
}

export default InterviewDetailPage;
