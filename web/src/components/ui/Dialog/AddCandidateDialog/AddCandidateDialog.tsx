import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

import { Button } from '../../Button/Button';
import { Input } from '../../Input/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../Dialog';

interface AddCandidateDialogProps {
  shouldOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (candidateInput: {
    firstName: string;
    lastName: string;
    githubUsername: string;
    email: string;
  }) => void;
}

export const AddCandidateDialog = ({
  shouldOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddCandidateDialogProps) => {
  const [candidateInput, setCandidateInput] = useState({
    firstName: '',
    lastName: '',
    githubUsername: '',
    email: '',
  });

  return (
    <Dialog open={shouldOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
          <DialogDescription>
            Add a new Candidate to be evaluated
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <div className="grid gap-1">
                <Label htmlFor="password">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Ben"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="none"
                  autoCorrect="off"
                  disabled={false}
                  value={candidateInput.firstName}
                  onChange={e =>
                    setCandidateInput({
                      ...candidateInput,
                      firstName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="none"
                  autoCorrect="off"
                  disabled={false}
                  value={candidateInput.lastName}
                  onChange={e =>
                    setCandidateInput({
                      ...candidateInput,
                      lastName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="githubUsername">Github Username</Label>
                <Input
                  id="githubUsername"
                  placeholder="Github Username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="none"
                  autoCorrect="off"
                  disabled={false}
                  value={candidateInput.githubUsername}
                  onChange={e =>
                    setCandidateInput({
                      ...candidateInput,
                      githubUsername: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="Email Address"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="none"
                  autoCorrect="off"
                  disabled={false}
                  value={candidateInput.email}
                  onChange={e =>
                    setCandidateInput({
                      ...candidateInput,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(candidateInput)}
            isLoading={isLoading}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
