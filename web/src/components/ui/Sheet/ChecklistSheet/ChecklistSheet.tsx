import { ChecklistTable } from '../../Table/ChecklistTable/ChecklistTable';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../Sheet';

import { useCompanyStore } from '@/store/useCompanyStore';

export const ChecklistSheet = () => {
  const { selectedPosition } = useCompanyStore();

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
        <ChecklistTable checklist={selectedPosition?.checklists[0].criteria} />
      </div>
      {/* <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Regenerate</Button>
        </SheetClose>
      </SheetFooter> */}
    </SheetContent>
  );
};
