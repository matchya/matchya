import Template from '../template/InterviewDetailPage/InterviewDetailPage';

function InterviewDetailPage() {
  const questionId = '123';
  const interviewId = '456';
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
