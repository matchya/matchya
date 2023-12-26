import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../Sheet';

import { ChecklistTable } from '@/components';
import { Position } from '@/types';

interface ChecklistSheetProps {
  selectedPosition: Position;
}

const ChecklistSheet = ({ selectedPosition }: ChecklistSheetProps) => (
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Checklist</SheetTitle>
      <SheetDescription>See below for the generated checklist</SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4">
      <ChecklistTable checklist={selectedPosition?.checklist} />
    </div>
    {/* not needed at this point in time */}
    {/* <SheetFooter>
  <SheetClose asChild>
    <Button type="submit">Regenerate</Button>
  </SheetClose>
</SheetFooter> */}
  </SheetContent>
);

export default ChecklistSheet;
