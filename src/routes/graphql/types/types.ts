export enum MemberIdBaseType {
  BASIC = 'BASIC',
  BUSINESS = 'BUSINESS',
}

export type MemberBaseType = {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
};

export type PostBaseType = {
  id: string;
  title: string;
  content: string;
};

export type ProfileBaseType = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberIdBaseType;
  memberType: MemberBaseType;
  userId: string;
};

export type UserBaseType = {
  id: string;
  name: string;
  balance: number;
  profile: ProfileBaseType;
  posts: PostBaseType[];
  userSubscribedTo: UserBaseType[];
  subscribedToUser: UserBaseType[];
};
