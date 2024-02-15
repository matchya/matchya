import { Icons } from '@/components';

const InterviewCompletedPageTemplate = () => (
  <div className="flex flex-col items-center justify-center w-full min-h-screen py-12 text-center">
    <div className="space-y-3 mb-3">
      <div className="flex justify-center">
        <Icons.check className="h-[100px] w-[100px]" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Interview Completed!{' '}
          <span className="block">Thank you for participating.</span>
        </h1>
        <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          We will review your interview and get back to you soon.
        </p>
      </div>
    </div>
    <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center"></div>
  </div>
);

export default InterviewCompletedPageTemplate;
