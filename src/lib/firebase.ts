import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  updateDoc,
  increment,
  DocumentData,
  getCountFromServer
} from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Genesis users constant - first 500 users
export const GENESIS_SPOTS = 500;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzRksr9EZA8z6vweLBT1-h-FmQa1rWbyk",
  authDomain: "tokenfight-f1cbf.firebaseapp.com",
  projectId: "tokenfight-f1cbf",
  storageBucket: "tokenfight-f1cbf.firebasestorage.app",
  messagingSenderId: "683093527335",
  appId: "1:683093527335:web:47b522ad5cbefc7b32f702",
  measurementId: "G-4Y5VXB5G0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics conditionally (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  // Only initialize analytics in browser environment
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

// Export analytics for use in other components if needed
export { analytics };

// Define types for our database models
export type Referral = {
  id: string;
  created_at: string | Date;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed';
  referred?: {
    user_id: string;
    twitter_username?: string;
    twitter_profile_pic?: string;
    email?: string;
  };
};

export type User = {
  id: string;
  created_at: string | Date;
  user_id: string; // Privy user ID
  referral_code: string;
  invite_count: number;
  email?: string;
  twitter_username?: string;
  twitter_profile_pic?: string;
  is_genesis?: boolean; // Genesis user flag
};

// Helper functions for working with users and referrals
export async function createOrUpdateUser(
  privyUserId: string, 
  referralCode: string,
  email?: string,
  twitterUsername?: string,
  twitterProfilePic?: string
): Promise<User | null> {
  try {
    console.log(`DEBUG - Creating/updating user ${privyUserId} with provided referral code: ${referralCode}`);
    
    const userRef = doc(db, 'users', privyUserId);
    const userSnap = await getDoc(userRef);
    
    // Check if this user already has a referral code
    let finalReferralCode = referralCode;
    if (userSnap.exists() && userSnap.data().referral_code) {
      // Keep the existing referral code unless explicitly told to update it
      finalReferralCode = userSnap.data().referral_code;
      console.log(`DEBUG - Preserving existing referral code: ${finalReferralCode} for user: ${privyUserId}`);
    } else {
      // New referral code - check if it's already in use by another user
      console.log(`DEBUG - Checking if referral code is already in use: ${referralCode}`);
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('referral_code', '==', referralCode));
      const querySnapshot = await getDocs(q);
      
      // If this code is already in use and not by this user, make it unique by adding a number
      if (!querySnapshot.empty && !querySnapshot.docs.some(doc => doc.id === privyUserId)) {
        console.log(`DEBUG - Referral code ${referralCode} is already in use, making it unique`);
        // Add a random number to make it unique
        finalReferralCode = `${referralCode}_${Math.floor(Math.random() * 1000)}`;
        console.log(`DEBUG - Generated unique referral code: ${finalReferralCode}`);
      } else {
        console.log(`DEBUG - Setting new referral code: ${finalReferralCode} for user: ${privyUserId}`);
      }
    }
    
    // Check for Genesis user status (only if user doesn't already have genesis status)
    let isGenesis = userSnap.exists() ? userSnap.data().is_genesis : false;
    
    // If not already a Genesis user, check if we still have spots available
    // IMPORTANT: All Genesis spots are taken, so we're hardcoding this to false for new users
    if (!isGenesis) {
      // All 500 Genesis spots are already claimed - no new Genesis users
      isGenesis = false;
      console.log(`DEBUG - All Genesis spots are taken, user ${privyUserId} is not a Genesis user`);
    }
    
    // Create user data object
    const userData: Record<string, unknown> = {
      user_id: privyUserId,
      referral_code: finalReferralCode,
      invite_count: userSnap.exists() ? userSnap.data().invite_count : 0,
      created_at: userSnap.exists() ? userSnap.data().created_at : serverTimestamp(),
      is_genesis: isGenesis
    };
    
    // Only add defined fields
    if (email) userData.email = email;
    if (twitterUsername) userData.twitter_username = twitterUsername;
    if (twitterProfilePic) userData.twitter_profile_pic = twitterProfilePic;
    
    await setDoc(userRef, userData, { merge: true });
    console.log(`DEBUG - User ${privyUserId} created/updated with final referral code ${finalReferralCode} and Genesis status: ${isGenesis}`);
    
    // Get the updated user data
    const updatedUserSnap = await getDoc(userRef);
    if (!updatedUserSnap.exists()) {
      console.log(`DEBUG - Error: User ${privyUserId} not found after update`);
      return null;
    }
    
    const user = updatedUserSnap.data() as User;
    console.log(`DEBUG - Final check: User ${privyUserId} has referral code ${user.referral_code}`);
    
    return {
      ...user,
      id: updatedUserSnap.id,
      created_at: user.created_at instanceof Date ? user.created_at.toISOString() : user.created_at as string
    };
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return null;
  }
}

export async function isUserAlreadyReferred(userId: string): Promise<boolean> {
  try {
    // Check if there are any referrals where this user is the referred_id
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('referred_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if user is already referred:', error);
    return false;
  }
}

export async function trackReferral(referrerCode: string, referredUserId: string): Promise<boolean> {
  try {
    console.log(`DEBUG - Attempting to track referral: code="${referrerCode}", userId=${referredUserId}`);
    
    // First check if user has already been referred
    const alreadyReferred = await isUserAlreadyReferred(referredUserId);
    if (alreadyReferred) {
      console.log(`DEBUG - User ${referredUserId} has already been referred, skipping referral`);
      return false;
    }
    
    // Find user with this referral code
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referral_code', '==', referrerCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error(`DEBUG - No user found with referral code: "${referrerCode}"`);
      return false;
    }
    
    const referrerDoc = querySnapshot.docs[0];
    const referrerId = referrerDoc.id;
    const referrerData = referrerDoc.data();
    console.log(`DEBUG - Found referrer with ID: ${referrerId}, username: ${referrerData.twitter_username || 'unnamed'}`);
    
    // Create a referral record
    const referralId = `${referrerId}_${referredUserId}`;
    const referralRef = doc(db, 'referrals', referralId);
    
    await setDoc(referralRef, {
      referrer_id: referrerId,
      referred_id: referredUserId,
      referral_code: referrerCode,
      status: 'completed',
      created_at: serverTimestamp()
    });
    console.log(`DEBUG - Created referral record with ID: ${referralId}`);
    
    // Increment the referrer's invite count
    const referrerRef = doc(db, 'users', referrerId);
    await updateDoc(referrerRef, {
      invite_count: increment(1)
    });
    console.log(`DEBUG - Incremented invite count for referrer: ${referrerId}`);
    
    return true;
  } catch (error) {
    console.error('Error tracking referral:', error);
    return false;
  }
}

export async function getUserReferrals(userId: string): Promise<Referral[]> {
  try {
    console.log(`DEBUG - Fetching referrals for user: ${userId}`);
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('referrer_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    console.log(`DEBUG - Found ${querySnapshot.size} referrals for user: ${userId}`);
    
    const referrals: Referral[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const referral = docSnapshot.data() as Referral;
      console.log(`DEBUG - Processing referral: ${docSnapshot.id}, referred user: ${referral.referred_id}`);
      
      // Get referred user details
      const referredUserRef = doc(db, 'users', referral.referred_id);
      const referredUserSnap = await getDoc(referredUserRef);
      
      if (referredUserSnap.exists()) {
        const referredUser = referredUserSnap.data() as DocumentData;
        console.log(`DEBUG - Retrieved referred user data: ${JSON.stringify({
          id: referral.referred_id,
          username: referredUser.twitter_username || 'Anonymous',
          has_profile_pic: !!referredUser.twitter_profile_pic
        })}`);
        
        referral.referred = {
          user_id: referredUser.user_id || '',
          ...(referredUser.twitter_username && { twitter_username: referredUser.twitter_username }),
          ...(referredUser.twitter_profile_pic && { twitter_profile_pic: referredUser.twitter_profile_pic }),
          ...(referredUser.email && { email: referredUser.email })
        };
        
        // Only log the referred data if it exists
        if (referral.referred) {
          console.log(`DEBUG - Final referred data: ${JSON.stringify({
            user_id: referral.referred.user_id,
            username: referral.referred.twitter_username || 'Anonymous',
            has_profile_pic: !!referral.referred.twitter_profile_pic,
            profile_pic_url: referral.referred.twitter_profile_pic || 'none'
          })}`);
        }
      } else {
        console.log(`DEBUG - No user found for referred_id: ${referral.referred_id}`);
      }
      
      referrals.push({
        ...referral,
        id: docSnapshot.id,
        created_at: referral.created_at instanceof Date ? referral.created_at.toISOString() : referral.created_at as string
      });
    }
    
    return referrals;
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    return [];
  }
}

export async function getUserByPrivyId(privyUserId: string): Promise<User | null> {
  try {
    console.log(`DEBUG - Getting user by Privy ID: ${privyUserId}`);
    const userRef = doc(db, 'users', privyUserId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log(`DEBUG - No user found with Privy ID: ${privyUserId}`);
      return null;
    }
    
    const user = userSnap.data() as User;
    console.log(`DEBUG - Found user ${privyUserId} with referral code: ${user.referral_code}`);
    
    return {
      ...user,
      id: userSnap.id,
      created_at: user.created_at instanceof Date ? user.created_at.toISOString() : user.created_at as string
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getReferrerByUserId(userId: string): Promise<User | null> {
  try {
    // First, find referrals where this user is the referred_id
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('referred_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    // If no referrals found, then this user wasn't referred
    if (querySnapshot.empty) {
      return null;
    }
    
    // Get the first referral (assuming a user is only referred once)
    const referral = querySnapshot.docs[0].data();
    const referrerId = referral.referrer_id;
    
    // Now get the referrer's info
    const referrerRef = doc(db, 'users', referrerId);
    const referrerSnap = await getDoc(referrerRef);
    
    if (!referrerSnap.exists()) {
      return null;
    }
    
    const referrer = referrerSnap.data() as User;
    return {
      ...referrer,
      id: referrerSnap.id,
      created_at: referrer.created_at instanceof Date ? referrer.created_at.toISOString() : referrer.created_at as string
    };
  } catch (error) {
    console.error('Error fetching referrer:', error);
    return null;
  }
}

export async function getUserByReferralCode(referralCode: string): Promise<User | null> {
  try {
    console.log(`DEBUG - Looking up user with referral code: "${referralCode}"`);
    
    // Skip debug listing of all users as it can be verbose
    
    // Look up directly by referral code
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referral_code', '==', referralCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn(`DEBUG - No user found with exact referral code: "${referralCode}"`);
      return null;
    }
    
    console.log(`DEBUG - Found ${querySnapshot.docs.length} users with referral code: "${referralCode}"`);
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as User;
    
    console.log(`DEBUG - User found: ${userDoc.id}, username: ${userData.twitter_username || 'unnamed'}, referral code: "${userData.referral_code}"`);
    
    return {
      ...userData,
      id: userDoc.id,
      created_at: userData.created_at instanceof Date ? userData.created_at.toISOString() : userData.created_at as string
    };
  } catch (error) {
    console.error('Error fetching user by referral code:', error);
    return null;
  }
}

// New function to get count of Genesis users
export async function getGenesisUsersCount(): Promise<number> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('is_genesis', '==', true));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting Genesis users count:', error);
    return 0;
  }
} 