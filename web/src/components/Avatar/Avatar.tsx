import ShadcnAvatar from './Avatar.shadcn';

interface AvatarProps {
  altName?: string;
  imageUrl?: string;
  size?: number;
}

const Avatar = ({
  altName = 'KO',
  imageUrl = '/avatars/01.png',
  size = 8,
}: AvatarProps) => (
  <ShadcnAvatar altName={altName} imageUrl={imageUrl} size={size} />
);

export default Avatar;
