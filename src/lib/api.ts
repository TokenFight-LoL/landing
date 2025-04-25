// api.ts - API wrapper for Firebase functions
import { 
  createOrUpdateUser as firebaseCreateOrUpdateUser,
  getUserByPrivyId as firebaseGetUserByPrivyId,
  trackReferral as firebaseTrackReferral,
  getUserReferrals as firebaseGetUserReferrals,
  getReferrerByUserId as firebaseGetReferrerByUserId,
  getUserByReferralCode as firebaseGetUserByReferralCode,
  isUserAlreadyReferred as firebaseIsUserAlreadyReferred,
  getGenesisUsersCount as firebaseGetGenesisUsersCount,
  GENESIS_SPOTS,
  type User,
  type Referral
} from './firebase';

// Export the types and constants
export type { User, Referral };
export { GENESIS_SPOTS };

// Export API functions
export async function createOrUpdateUser(
  privyUserId: string, 
  referralCode: string,
  email?: string,
  twitterUsername?: string,
  twitterProfilePic?: string,
): Promise<User | null> {
  return firebaseCreateOrUpdateUser(privyUserId, referralCode, email, twitterUsername, twitterProfilePic);
}

export async function getUserByPrivyId(privyUserId: string): Promise<User | null> {
  return firebaseGetUserByPrivyId(privyUserId);
}

export async function trackReferral(referrerCode: string, referredUserId: string): Promise<boolean> {
  return firebaseTrackReferral(referrerCode, referredUserId);
}

export async function getUserReferrals(userId: string): Promise<Referral[]> {
  return firebaseGetUserReferrals(userId);
}

export async function getReferrerByUserId(userId: string): Promise<User | null> {
  return firebaseGetReferrerByUserId(userId);
}

export async function getUserByReferralCode(referralCode: string): Promise<User | null> {
  return firebaseGetUserByReferralCode(referralCode);
}

export async function isUserAlreadyReferred(userId: string): Promise<boolean> {
  return firebaseIsUserAlreadyReferred(userId);
}

export async function getGenesisUsersCount(): Promise<number> {
  return firebaseGetGenesisUsersCount();
} 