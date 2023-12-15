import { ChecklistTable } from '../../Table/ChecklistTable/ChecklistTable';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../Sheet';

import { usePositionStore } from '@/store/usePositionStore';

export const ChecklistSheet = () => {
  const { selectedPosition } = usePositionStore();

  if (selectedPosition?.checklist_status !== 'succeeded') {
    return null;
  }

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Checklist</SheetTitle>
        <SheetDescription>
          See below for the generated checklist
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        <ChecklistTable checklist={selectedPosition?.checklist.criteria} />
      </div>
      {/* <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Regenerate</Button>
        </SheetClose>
      </SheetFooter> */}
    </SheetContent>
  );
};
