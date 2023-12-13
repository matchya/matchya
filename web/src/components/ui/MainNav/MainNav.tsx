import { useState, useEffect, useRef } from 'react';

import { ChecklistSheet } from '../ChecklistSheet/ChecklistSheet';
import { GenerateCriteriaDialog } from '../GenerateCriteriaDialog/GenerateCriteriaDialog';
import { Icons } from '../Icons/Icons';
import { Sheet, SheetTrigger } from '../Sheet/Sheet';

import { Button } from '@/components/ui/Button/Button';
import { axiosInstance } from '@/helper';
import { cn } from '@/lib/utils';
import { useCompanyStore } from '@/store/useCompanyStore';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [shouldOpen, setShouldOpen] = useState(false);
  const { selectedPosition, setSelectedPositionDetail } = useCompanyStore();
  const [status, setStatus] = useState<
    'generate' | 'scheduled' | 'failed' | 'done'
  >('generate');
  const handleClose = () => setShouldOpen(false);

  const handleStatusUpdate = status => setStatus(status);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let interval;

    const fetchStatus = async () => {
      try {
        const response = await axiosInstance.get(
          `/positions/status/${selectedPosition?.id}`
        );
        if (response.data.payload.checklist_status === 'succeeded') {
          setSelectedPositionDetail();
          setStatus('done');
          clearInterval(interval);
        }
        if (response.data.payload.checklist_status === 'failed') {
          setStatus('failed');
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
        // handle error appropriately
      }
    };

    if (status === 'scheduled') {
      interval = setInterval(fetchStatus, 10000);
    }

    return () => clearInterval(interval);
  }, [status]);

  const getMessage = () => {
    if (status === 'scheduled') {
      return 'Generating Criteria...';
    } else if (status === 'generate') {
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
        {['generate', 'scheduled'].includes(status) ? (
          <Button
            disabled={status !== 'generate'}
            onClick={() => setShouldOpen(!shouldOpen)}
          >
            {status === 'scheduled' && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {getMessage()}
          </Button>
        ) : null}
        {status === 'done' ? (
          <SheetTrigger asChild>
            <Button variant="outline">See Checklist</Button>
          </SheetTrigger>
        ) : null}
        <ChecklistSheet />
        <GenerateCriteriaDialog
          shouldOpen={shouldOpen}
          onClose={handleClose}
          onUpdateStatus={handleStatusUpdate}
        />
      </nav>
    </Sheet>
  );
}
