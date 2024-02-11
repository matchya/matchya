import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button, Icons } from '@/components';
import { caseSensitiveAxiosInstance } from '@/lib/axios';
import { Assessment, Candidate } from '@/types';

interface InviteCandidateDialogProps {
  assessments: Assessment[];
  addCandidate: (candidate: Candidate) => void;
}

const InviteCandidateDialog = ({
  assessments,
  addCandidate,
}: InviteCandidateDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInvite = async () => {
    try {
      setIsLoading(true);
      const data = {
        name,
        email,
        assessment_id: assessmentId,
      };
      const response = await caseSensitiveAxiosInstance.post(
        '/candidates',
        data
      );
      if (response.data.status === 'success') {
        const candidate: Candidate = response.data.payload.candidate;
        candidate.assessment = {
          id: assessmentId,
          name:
            assessments.find(assessment => assessment.id === assessmentId)
              ?.name || '',
          interviewStatus: 'PENDING',
          createdAt: new Date().toISOString(), // TODO: this should be interview created at
        };
        addCandidate(candidate);
        setName('');
        setEmail('');
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger asChild onClick={() => setOpen(true)}>
        <Button
          className="py-6 bg-matcha-400 hover:bg-matcha-500 text-white"
          onClick={() => {}}
        >
          <Icons.personAdd className="h-5 w-5 mr-2" />
          Invite Candidate
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 bg-white bg-opacity-60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Invite Candidate
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Invite a candidate to take an assessment
          </Dialog.Description>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label
              className="text-violet11 w-[90px] text-right text-[15px]"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="name"
              placeholder="Pedro Duarte"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label
              className="text-violet11 w-[90px] text-right text-[15px]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="email"
              placeholder="peduarte@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </fieldset>
          {/* drop down selection of assessments ['Assessment1', 'Assessment2'] */}
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label
              className="text-violet11 w-[90px] text-right text-[15px]"
              htmlFor="assessment"
            >
              Assessment
            </label>
            <select
              className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="assessment"
              value={assessmentId}
              onChange={e => setAssessmentId(e.target.value)}
            >
              <option value="">Select an assessment</option>
              {assessments.map(assessment => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.name}
                </option>
              ))}
            </select>
          </fieldset>
          <div className="mt-[25px] flex justify-end">
            <button
              className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
              onClick={handleInvite}
            >
              {isLoading ? (
                <Icons.spinner className="spinner h-5 w-5" />
              ) : (
                'Invite'
              )}
            </button>
          </div>
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

export default InviteCandidateDialog;
