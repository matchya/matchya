import { useCompanyStore } from '@/store/useCompanyStore';
import { ChecklistTable } from '../ChecklistTable/ChecklistTable';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../Sheet/Sheet';

export const ChecklistSheet = () => {
  const { selectedPosition } = useCompanyStore();
  const checklist = [
    {
      keywords: ['react', 'typescript', 'firebase', 'yo'],
      description: 'This is a description for the first item in the checklist',
    },
    {
      keywords: ['react', 'typescript'],
      description: 'This is a description for the second item in the checklist',
    },
    {
      keywords: ['react', 'typescript'],
      description: 'This is a description for the third item in the checklist',
    },
    {
      keywords: ['react', 'typescript'],
      description: 'This is a description for the fourth item in the checklist',
    },
    {
      keywords: ['react', 'typescript'],
      description: 'This is a description for the fifth item in the checklist',
    },
  ];

  if (selectedPosition?.checklist_status !== 'succeeded') {
    return null;
  }

  console.log('YOOO: ');
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Checklist</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you're done.
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
