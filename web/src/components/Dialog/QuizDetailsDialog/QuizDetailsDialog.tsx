import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Button } from '@/components';
import { caseSensitiveAxiosInstance } from '@/lib/axios';
import { Quiz } from '@/types';

interface QuizDetailsDialogProps {
  quiz: Quiz;
}

const QuizDetailsDialog = ({ quiz }: QuizDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    if (!quiz.context || !quiz.questions) {
      fetchQuizDetails();
    } else {
      setIsLoading(false);
    }
  }, [open]);

  const fetchQuizDetails = async () => {
    setIsLoading(true);
    try {
      const response = await caseSensitiveAxiosInstance.get(
        `/quizzes/${quiz.id}`
      );
      if (response.data.status === 'success') {
        const quizData = response.data.payload.quiz;
        console.log('quizData', quizData);
        quiz.context = quizData.context;
        quiz.questions = quizData.questions;
      }
    } catch (error) {
      console.error('Error fetching quiz details', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog.Root open={open}>
        <Dialog.Trigger asChild onClick={() => setOpen(true)}>
          <Button className="text-xs text-black bg-transparent hover:underline hover:bg-transparent">
            See Details
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 bg-white bg-opacity-60" />
          <Dialog.Content className="w-3/4 py-10 px-32 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-center text-mauve12 m-0 text-[17px] font-medium">
              Context
            </Dialog.Title>
            <Dialog.Description className="text-center text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Loading...
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger asChild onClick={() => setOpen(true)}>
        <Button className="text-xs text-black bg-transparent hover:underline hover:bg-transparent">
          See Details
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 bg-white bg-opacity-60" />
        <Dialog.Content className="w-[95%] md:w-3/4 py-4 sm:py-10 lg:px-32 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-center text-mauve12 m-0 text-[17px] font-medium">
            Context
          </Dialog.Title>
          <Dialog.Description className="text-sm sm:text-md text-center text-mauve11 mt-[10px] mb-5 leading-normal">
            {quiz.context}
          </Dialog.Description>

          <Dialog.Title className="mt-6 text-center text-mauve12 m-0 text-[17px] font-medium">
            Questions
          </Dialog.Title>
          <Dialog.Description className=" text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            {quiz.questions?.map((question, index) => (
              <p key={question.id} className="my-4 text-xs sm:text-sm">
                {index + 1}. {question.text}
              </p>
            ))}
          </Dialog.Description>

          <Dialog.Close asChild onClick={() => setOpen(false)}>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default QuizDetailsDialog;
