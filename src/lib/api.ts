// Types for our database models
export type Referral = {
  id: string;
  created_at: string;
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
  created_at: string;
  user_id: string; // Privy user ID
  referral_code: string;
  invite_count: number;
  email?: string;
  twitter_username?: string;
  twitter_profile_pic?: string;
};

// Base URL for API functions
const API_URL = '/.netlify/functions/referrals';

// Helper function to make API calls
async function callApi<T>(action: string, data: any = {}): Promise<T> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        ...data,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error(`Error calling ${action}:`, error);
    throw error;
  }
}

// API Functions
export async function createOrUpdateUser(
  privyUserId: string, 
  referralCode: string,
  email?: string,
  twitterUsername?: string,
  twitterProfilePic?: string
): Promise<User | null> {
  try {
    return await callApi<User>('createUser', {
      privyUserId,
      referralCode,
      email,
      twitterUsername,
      twitterProfilePic,
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return null;
  }
}

export async function trackReferral(referrerCode: string, referredUserId: string): Promise<boolean> {
  try {
    await callApi('trackReferral', {
      referrerCode,
      referredUserId,
    });
    return true;
  } catch (error) {
    console.error('Error tracking referral:', error);
    return false;
  }
}

export async function getUserReferrals(userId: string): Promise<Referral[]> {
  try {
    return await callApi<Referral[]>('getUserReferrals', { userId });
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    return [];
  }
}

export async function getUserByPrivyId(privyUserId: string): Promise<User | null> {
  // Use the users endpoint to get a user by their Privy ID
  // This is a simplified implementation - in a real app, you'd want a separate endpoint
  try {
    const users = await callApi<User[]>('getUsers', { 
      filter: { user_id: privyUserId } 
    });
    return users?.[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function addDummyReferral(userId: string): Promise<boolean> {
  try {
    // Create a random username with emojis for the dummy referral
    const emojis = ["🚀", "💎", "🔥", "🧠", "👻", "🤑", "👑", "🌈", "🦄", "🐱"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const adjectives = ["crypto", "defi", "nft", "eth", "web3", "token", "chain", "block", "bull", "bear"];
    const nouns = ["whale", "trader", "guru", "ninja", "wizard", "boss", "master", "legend", "hodler", "dev"];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    await callApi('addDummyReferral', {
      userId,
      dummyUsername: `${randomAdj}_${randomNoun}`,
      dummyAvatar: randomEmoji,
    });
    
    return true;
  } catch (error) {
    console.error('Error adding dummy referral:', error);
    return false;
  }
} 