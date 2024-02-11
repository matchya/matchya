import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button, Icons } from '@/components';

interface DeleteAssessmentDialogProps {
  assessmentName: string;
  handleDelete: () => void;
}

const DeleteAssessmentDialog = ({
  assessmentName,
  handleDelete,
}: DeleteAssessmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger asChild onClick={() => setOpen(true)}>
        <Button variant="ghost" className="hover:bg-gray-50">
          <Icons.trash className="h-4 w-4 rounded-md hover:bg-gray-200" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 bg-white bg-opacity-60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Delete assessment
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Are you sure you want to delete this assessment:{' '}
            <strong>{assessmentName}</strong>?
          </Dialog.Description>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="hover:bg-gray-50"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-gray-50"
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true);
                await handleDelete();
                setIsDeleting(false);
                setOpen(false);
              }}
            >
              {isDeleting ? (
                <Icons.spinner className="spinner h-4 w-4" />
              ) : (
                'Delete'
              )}
            </Button>
          </div>
          <Dialog.Close asChild onClick={() => setOpen(false)}>
            <button
              className="text-violet11 hover:bg-violet4 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
              aria-label="Close"
              disabled={isDeleting}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteAssessmentDialog;
