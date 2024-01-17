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

const InviteCard = () => {
  return (
    <Card>
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
          <Button variant="secondary" className="shrink-0">
            Invite
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Filter: none Sort: evaluated</h4>
          <div className="grid gap-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar altName="OM" imageUrl="/avatars/03.png" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">m@example.com</p>
                </div>
              </div>
              <div>9.0</div>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar imageUrl="/avatars/05.png" altName="IN" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                  <p className="text-sm text-muted-foreground">b@example.com</p>
                </div>
              </div>
              <Button>Resend Email</Button>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar altName="SD" imageUrl="/avatars/01.png" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">p@example.com</p>
                </div>
              </div>
              <Button>Resend Email</Button>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar altName="SD" imageUrl="/avatars/01.png" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">p@example.com</p>
                </div>
              </div>
              <Button>Resend Email</Button>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar altName="SD" imageUrl="/avatars/01.png" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">p@example.com</p>
                </div>
              </div>
              <Button>Resend Email</Button>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar altName="SD" imageUrl="/avatars/01.png" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">p@example.com</p>
                </div>
              </div>
              <Button>Resend Email</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCard;
