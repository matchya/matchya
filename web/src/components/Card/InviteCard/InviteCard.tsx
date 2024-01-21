import { useState } from 'react';

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
import { axiosInstance } from '@/lib/client';
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
  assessmentId: string | undefined;
}
const InviteCard = ({ candidates, assessmentId }: InviteCardProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    try {
      setIsLoading(true);
      const data = {
        first_name: name.split(' ')[0],
        last_name: name.split(' ')[1],
        email: email,
        github_username: '',
        assessment_id: assessmentId,
      };
      const response = await axiosInstance.post('/candidates', data);
      if (response.data.status === 'success') {
        console.log('success');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Button
            variant="secondary"
            onClick={handleInvite}
            disabled={isLoading}
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
                key={candidate.id}
                initial={candidate.firstName[0] + candidate.lastName[0]}
                name={candidate.firstName + ' ' + candidate.lastName}
                email={candidate.email}
                score={candidate.assessment.totalScore}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCard;
