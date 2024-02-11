// import { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';

// import { axiosInstance } from '@/lib/axios';
import { QuestionsListTemplate } from '@/template';
import { Quiz } from '@/types';

interface QuestionListProps {
  quizzes: Quiz[] | null;
}

const QuestionsList = ({ quizzes }: QuestionListProps) => {
  // const params = useParams<{ id: string }>();
  // const [isLoading, setIsLoading] = useState(true);
  // const [questions, setQuestions] = useState<Question[] | null>(
  //   initialQuestions
  // );
  // const intervalId = useRef<NodeJS.Timeout | null>(null);
  // useEffect(() => {
  //   if (questions && questions.length > 0) {
  //     setIsLoading(false);
  //     return;
  //   }
  //   // this should only get triggered when we are generating the questions
  //   // for the first time

  //   intervalId.current = setInterval(fetchQuestions, 10000); // Fetch every 5 seconds

  //   // Clean up function
  //   return () => {
  //     if (intervalId.current) {
  //       clearInterval(intervalId.current); // Stop the interval when the component unmounts
  //     }
  //   };
  // }, []);

  // const fetchQuestions = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `/assessments/${params.id}/questions`
  //     );
  //     if (response.data.status === 'success') {
  //       const questionsData: Question[] = response.data.payload.questions;

  //       // If questions data is successfully fetched, clear the interval
  //       if (questionsData.length > 0) {
  //         setQuestions(questionsData);
  //         setIsLoading(false);
  //         if (intervalId.current) {
  //           clearInterval(intervalId.current);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return <QuestionsListTemplate isLoading={false} quizzes={quizzes} />;
};

export default QuestionsList;
