import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Separator,
} from '@/components';
import { Candidate } from '@/types';

const CandidateRow = ({
  initial,
  name,
  email,
  score,
}: {
  initial: string;
  name: string;
  email: string;
  score?: number;
}) => {
  return (
    <div className="flex items-between justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Avatar altName={initial} imageUrl="/avatars/03.png" />
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      {score ? (
        <div>
          <p className="mr-10">{score.toFixed(1)}</p>
        </div>
      ) : (
        <Button className="bg-macha-600 hover:bg-macha-700 font-bold text-white">
          Resend Email
        </Button>
      )}
    </div>
  );
};

interface InviteCardProps {
  candidates: Candidate[];
}
const InviteCard = ({ candidates }: InviteCardProps) => {
  return (
    <Card className="bg-orange-50">
      <CardHeader>
        <CardTitle>Invite Candidates</CardTitle>
        <CardDescription>
          Invite candidates to take the assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input value="" placeholder="Name" />
          <Input value="" placeholder="Email" />
          <Button
            variant="secondary"
            className="shrink-0 bg-macha-500 hover:bg-macha-600 text-white font-bold"
          >
            Invite
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Filter: none Sort: evaluated</h4>
          <div className="grid gap-6">
            {candidates.map(candidate => (
              <CandidateRow
                initial={candidate.first_name[0] + candidate.last_name[0]}
                name={candidate.first_name + ' ' + candidate.last_name}
                email={candidate.email}
                score={candidate.assessment.total_score}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCard;
