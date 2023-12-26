import { useCallback, useRef, useState } from 'react';

import { Button } from '../../Button/Button';
import { Icons } from '../../Icons/Icons';
import { MultiSelect } from '../../MultiSelect/MultiSelect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../Dialog';

import { axiosInstance } from '@/lib';
import { useCompanyStore, usePositionStore } from '@/store/store';
import { CustomError } from '@/types';

interface GenerateCriteriaDialogProps {
  shouldOpen: boolean;
  onClose: () => void;
}

export const GenerateCriteriaDialog = ({
  shouldOpen,
  onClose,
}: GenerateCriteriaDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { repository_names } = useCompanyStore();
  const { selectedPosition } = usePositionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleUnselect = useCallback((framework: string) => {
    setSelected(prev => prev.filter(s => s !== framework));
  }, []);

  const handleGenerateCriteria = async () => {
    setErrorMessage('');
    if (!selectedPosition || selected.length === 0) {
      setErrorMessage('Select at least one repository');
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
        selectedPosition.checklist_status = 'scheduled';
        onClose();
        setErrorMessage('');
      }
    } catch (error) {
      const err = error as CustomError;
      if (err.response.status === 400) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
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

  const handleAddItem = (item: string) => {
    setSelected((prev: string[]) => [...prev, item]);
  };

  return (
    <Dialog
      open={shouldOpen}
      onOpenChange={() => {
        onClose();
        setErrorMessage('');
      }}
    >
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
        <div className="text-red-500 text-sm">{errorMessage}</div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setErrorMessage('');
            }}
          >
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
