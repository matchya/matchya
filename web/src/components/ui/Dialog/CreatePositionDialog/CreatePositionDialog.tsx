import { Label } from '@radix-ui/react-label';

import { Button } from '../../Button/Button';
import { Input } from '../../Input/Input';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../Dialog';

export const CreatePositionDialog = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Position</DialogTitle>
        <DialogDescription>
          Add a new Position to manage products and customers.
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Position name</Label>
            <Input id="name" placeholder="Acme Inc." />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit">Continue</Button>
      </DialogFooter>
    </DialogContent>
  );
};
