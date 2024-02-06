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
import { axiosInstance, caseSensitiveAxiosInstance } from '@/lib/axios';
import { Candidate } from '@/types';

interface CandidateRowProps {
  id: string;
  initial: string;
  name: string;
  email: string;
  score?: number;
  assessmentId: string | undefined;
}

const CandidateRow = ({
  id,
  initial,
  name,
  email,
  score,
  assessmentId,
}: CandidateRowProps) => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendInvitation = async () => {
    try {
      setIsLoading(true);
      const data = {
        assessment_id: assessmentId,
      };
      const response = await axiosInstance.post(
        `/candidates/invite/${id}`,
        data
      );
      if (response.data.status === 'success') {
        console.log('success');
        setEmailSent(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-between justify-between space-x-4">
      <div className="flex justify-center items-center space-x-4">
        <Avatar altName={initial} imageUrl="/avatars/03.png" />
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      {score ? (
        <div>
          <p className="mr-12">{score.toFixed(1)}</p>
        </div>
      ) : (
        <Button
          variant="outline"
          className="bg-black text-white hover:bg-gray-800 hover:text-white font-bold px-3"
          onClick={sendInvitation}
          disabled={emailSent || isLoading}
        >
          {emailSent ? 'Email Sent!' : 'Resend Email'}
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
        name,
        email,
        assessment_id: assessmentId,
      };
      const response = await caseSensitiveAxiosInstance.post(
        '/candidates',
        data
      );
      if (response.data.status === 'success') {
        setName('');
        setEmail('');
        candidates.push(response.data.payload.candidate);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
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
            variant="outline"
            onClick={handleInvite}
            disabled={isLoading}
            className="shrink-0 bg-matcha-400 hover:bg-matcha-500 hover:text-white text-white font-bold"
          >
            Invite
          </Button>
        </div>
        {candidates.length > 0 ? <Separator className="my-4" /> : null}
        <div className="space-y-4">
          {/* TODO: Implement filtering/sorting later */}
          {/* <h4 className="text-sm font-medium">Filter: none Sort: evaluated</h4> */}
          <div className="grid gap-6">
            {candidates.map(candidate => (
              <CandidateRow
                key={candidate.id}
                id={candidate.id}
                initial={candidate.name[0].toUpperCase()}
                name={candidate.name}
                email={candidate.email}
                score={candidate.assessment?.totalScore}
                assessmentId={assessmentId}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCard;
