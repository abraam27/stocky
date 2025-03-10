import { User, UserRole } from 'src/users/user.dto';

export const UUID_NAMESPACE = 'dd6eb088-ee10-53de-b91b-4800453c4746';

export const isOwner = (user: User): boolean => {
  return user?.role === UserRole.Owner;
};

export const isAdmin = (user: User): boolean => {
  return user?.role === UserRole.Owner || user?.role == UserRole.Admin;
};

export const isStoreItem = (
  item: {
    store_id: string;
  },
  user: User,
): boolean => {
  if (user?.role === UserRole.Owner) return true;
  return user?.role == UserRole.Admin && item.store_id == user.store_id;
};
