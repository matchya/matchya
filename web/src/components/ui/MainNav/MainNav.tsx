import { useState, useEffect, useRef } from 'react';

import { GenerateCriteriaDialog } from '../Dialog/GenerateCriteriaDialog/GenerateCriteriaDialog';
import { Icons } from '../Icons/Icons';
import { ChecklistSheet } from '../Sheet/ChecklistSheet/ChecklistSheet';
import { Sheet, SheetTrigger } from '../Sheet/Sheet';

import { Button } from '@/components/ui/Button/Button';
import { axiosInstance } from '@/helper';
import { cn } from '@/lib/utils';
import { usePositionStore } from '@/store/usePositionStore';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [shouldOpen, setShouldOpen] = useState(false);
  const { selectedPosition, setPositionDetail } = usePositionStore();
  const handleClose = () => setShouldOpen(false);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        if (!selectedPosition) {
          return;
        }
        const response = await axiosInstance.get(
          `/positions/status/${selectedPosition?.id}`
        );
        if (response.data.payload.checklist_status === 'succeeded') {
          setPositionDetail(selectedPosition.id);
          selectedPosition.checklist_status = 'succeeded';
          clearInterval(interval);
        }
        if (response.data.payload.checklist_status === 'failed') {
          selectedPosition.checklist_status = 'failed';
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
        // handle error appropriately
      }
    };

    if (selectedPosition?.checklist_status === 'scheduled') {
      interval = setInterval(fetchStatus, 10000);
    }

    return () => clearInterval(interval);
  }, [selectedPosition?.checklist_status]);

  const getMessage = () => {
    if (selectedPosition?.checklist_status === 'scheduled') {
      return 'Generating Criteria...';
    } else if (selectedPosition?.checklist_status === 'unscheduled') {
      return 'Generate Criteria';
    } else {
      return 'Refresh the page!';
    }
  };

  return (
    <Sheet>
      <nav
        className={cn('flex items-center space-x-4 lg:space-x-6', className)}
        {...props}
      >
        {['unscheduled', 'scheduled'].includes(selectedPosition ? selectedPosition.checklist_status : '') ? (
          <Button
            disabled={selectedPosition?.checklist_status !== 'unscheduled'}
            onClick={() => setShouldOpen(!shouldOpen)}
          >
            {selectedPosition?.checklist_status === 'scheduled' && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {getMessage()}
          </Button>
        ) : null}
        {selectedPosition?.checklist_status === 'succeeded' ? (
          <SheetTrigger asChild>
            <Button variant="outline">See Checklist</Button>
          </SheetTrigger>
        ) : null}
        <ChecklistSheet />
        <GenerateCriteriaDialog
          shouldOpen={shouldOpen}
          onClose={handleClose}
        />
      </nav>
    </Sheet>
  );
}
