import { useState, useEffect } from 'react';

import { GenerateCriteriaDialog } from '../GenerateCriteriaDialog/GenerateCriteriaDialog';
import { Icons } from '../Icons/Icons';

import { Button } from '@/components/ui/Button/Button';
import { axiosInstance } from '@/helper';
import { cn } from '@/lib/utils';
import { useCompanyStore } from '@/store/useCompanyStore';

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  onGenerateCriteriaClick: () => void;
}

export function MainNav({ className, ...props }: MainNavProps) {
  const [shouldOpen, setShouldOpen] = useState(false);
  const { selectedPosition, setSelectedPositionDetail } = useCompanyStore();
  const [status, setStatus] = useState<'generate' | 'scheduled' | 'done'>(
    'generate'
  );
  const handleClose = () => setShouldOpen(false);

  const handleStatusUpdate = status => setStatus(status);

  useEffect(() => {
    if (status === 'scheduled') {
      const interval = setInterval(async () => {
        const response = await axiosInstance.get(
          `/positions/status/${selectedPosition?.id}`
        );
        if (response.data.payload.checklist_status === 'succeeded') {
          setStatus('done');
          console.log('ENTERED1');
          clearInterval(interval);
        }
      }, 5000);
      return () => clearInterval(interval);
    } else if (status === 'done') {
      const done = async () => {
        await setSelectedPositionDetail();
      };
      done();
    }
  }, [status]);

  useEffect(() => {
    console.log('ENTERED4', selectedPosition);
    if (selectedPosition?.checklists) {
      alert(JSON.stringify(selectedPosition.checklists));
    }
  }, [selectedPosition]);

  const getMessage = () => {
    if (status === 'scheduled') {
      return 'Generating Criteria...';
    } else if (status === 'generate') {
      return 'Generate Criteria';
    } else {
      return 'Generated Criteria';
    }
  };

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {/* This is an example if we happen to need links... */}
      {/* <Link
        to="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
     */}
      <Button onClick={() => setShouldOpen(!shouldOpen)}>
        {status === 'scheduled' && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        {status === 'done' && <Icons.react className="mr-2 h-4 w-4" />}
        {getMessage()}
      </Button>
      <GenerateCriteriaDialog
        shouldOpen={shouldOpen}
        onClose={handleClose}
        onUpdateStatus={handleStatusUpdate}
      />
    </nav>
  );
}
