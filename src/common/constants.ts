import { User, UserRole } from 'src/users/dtos/user.dto';

export const UUID_NAMESPACE = 'dd6eb088-ee10-53de-b91b-4800453c4746';

export const isOwner = (user: User): boolean => {
  return user?.role === UserRole.Owner;
};
