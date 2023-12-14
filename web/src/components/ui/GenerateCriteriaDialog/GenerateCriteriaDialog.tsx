import { useCallback, useRef, useState } from 'react';

import { Button } from '../Button/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../Dialog/Dialog';
import { Icons } from '../Icons/Icons';
import { MultiSelect } from '../MultiSelect/MultiSelect';

import { axiosInstance } from '@/helper';
import { useCompanyStore } from '@/store/useCompanyStore';
import { CustomError } from '@/types';

interface GenerateCriteriaDialogProps {
  shouldOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (status: 'done' | 'scheduled' | 'done') => void;
}

export const GenerateCriteriaDialog = ({
  shouldOpen,
  onClose,
  onUpdateStatus,
}: GenerateCriteriaDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedPosition, repository_names } = useCompanyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<any>([]);

  const handleUnselect = useCallback((framework: any) => {
    setSelected(prev => prev.filter(s => s.value !== framework.value));
  }, []);

  const handleGenerateCriteria = async () => {
    if (!selectedPosition || selected.length === 0) {
      console.error('Need to meet requirements');
      return;
    }
    const userData = {
      position_id: selectedPosition.id,
      repository_names: selected,
    };
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        '/checklists/generate',
        userData
      );
      if (response.data.status == 'success') {
        console.log('success');
        onUpdateStatus('scheduled');
        onClose();
        // setMessage(
        //   'Criteria generation is scheduled successfully. It may take a few minutes to finish.'
        // );
      }
    } catch (error) {
      const err = error as CustomError;
      // setMessageType('error');
      if (err.response.status === 400) {
        console.log(err.response.data.message);
      } else {
        console.log('Something went wrong. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected(prev => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    []
  );

  const handleAddItem = item => {
    setSelected(prev => [...prev, item]);
  };

  return (
    <Dialog open={shouldOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Criteria</DialogTitle>
          <DialogDescription>Let's get started...</DialogDescription>
        </DialogHeader>
        <div>
          <MultiSelect
            options={repository_names}
            placeholder="Repositories"
            onUnselect={handleUnselect}
            onKeyDown={handleKeyDown}
            selected={selected}
            onAddItem={handleAddItem}
            inputRef={inputRef}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button onClick={handleGenerateCriteria}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
