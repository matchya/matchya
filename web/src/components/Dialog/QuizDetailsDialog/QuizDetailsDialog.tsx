import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

import { Button } from '@/components';

const QuizDetailsDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          className="text-xs text-black bg-transparent hover:underline hover:bg-transparent"
        >
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
            “You are a software engineer working on a collaborative project
            using Git for version control. Your team is distributed, and
            efficient collaboration is crucial. The project involves multiple
            features, and you are responsible for ensuring smooth integration of
            changes while maintaining code quality. Your task is to implement a
            robust Git and collaboration strategy to streamline development
            workflows and avoid conflicts.”
          </Dialog.Description>

          <Dialog.Title className="mt-6 text-center text-mauve12 m-0 text-[17px] font-medium">
            Questions
          </Dialog.Title>
          <Dialog.Description className=" text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            <p className="my-4 text-sm">
              1. How would you implement a cost optimization strategy for an AWS
              infrastructure supporting a large-scale web application,
              considering factors such as resource utilization, reserved
              instances, and pricing models?
            </p>

            <p className="my-4 text-sm">
              2. What if you identify that a specific AWS service is
              contributing significantly to the overall cost without a
              proportional impact on performance? Describe how you would analyze
              and adjust the configuration or usage of that service to optimize
              costs while minimizing any adverse effects on the application.
            </p>

            <p className="my-4 text-sm">
              3. Describe your experience with AWS cost monitoring tools and how
              you've used them to identify cost inefficiencies or potential
              areas for optimization in a real-world scenario. Additionally,
              elaborate on any automated processes or scripts you've implemented
              to enforce cost-saving measures within the AWS environment.
            </p>
          </Dialog.Description>

          <Dialog.Close asChild>
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
