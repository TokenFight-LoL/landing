import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for our database tables
export type Referral = {
  id: string;
  created_at: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed';
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

// Helper functions for working with referrals
export async function createOrUpdateUser(
  privyUserId: string, 
  referralCode: string,
  email?: string,
  twitterUsername?: string,
  twitterProfilePic?: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      user_id: privyUserId,
      referral_code: referralCode,
      email,
      twitter_username: twitterUsername,
      twitter_profile_pic: twitterProfilePic,
      invite_count: 0
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Error creating/updating user:', error);
    return null;
  }
  
  return data as User;
}

export async function trackReferral(referrerCode: string, referredUserId: string): Promise<boolean> {
  // First, find the referrer by their code
  const { data: referrer } = await supabase
    .from('users')
    .select('id, invite_count')
    .eq('referral_code', referrerCode)
    .single();

  if (!referrer) {
    console.error('Referrer not found with code:', referrerCode);
    return false;
  }

  // Create the referral record
  const { error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrer.id,
      referred_id: referredUserId,
      referral_code: referrerCode,
      status: 'completed'
    });

  if (error) {
    console.error('Error creating referral:', error);
    return false;
  }

  // Increment the referrer's invite count
  await supabase
    .from('users')
    .update({ invite_count: referrer.invite_count + 1 })
    .eq('id', referrer.id);

  return true;
}

export async function getUserReferrals(userId: string): Promise<Referral[]> {
  const { data, error } = await supabase
    .from('referrals')
    .select(`
      *,
      referred:referred_id(user_id, twitter_username, twitter_profile_pic, email)
    `)
    .eq('referrer_id', userId);

  if (error) {
    console.error('Error fetching user referrals:', error);
    return [];
  }

  return data as Referral[];
}

export async function getUserByPrivyId(privyUserId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', privyUserId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data as User;
} 