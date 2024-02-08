import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '../..';

const LoadingCard = () => {
  return (
    <Card className="rounded-lg shadow">
      <CardHeader className="grid items-start gap-4 space-y-0">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 mb-3">
            <CardTitle className="text-sm text-muted-foreground">
              <Skeleton className="rounded-full h-3 w-[50px]" />
            </CardTitle>
          </div>
          <CardDescription className="text-md text-black space-y-3">
            <Skeleton className="rounded-full h-4 w-3/4" />
            <Skeleton className="rounded-full h-4 w-1/2" />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <Skeleton className="rounded-full h-5 w-20" />
          <Skeleton className="rounded-full h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
