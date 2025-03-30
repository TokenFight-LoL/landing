import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define interfaces for our data
interface CreateUserData {
  privyUserId: string;
  referralCode: string;
  email?: string;
  twitterUsername?: string;
  twitterProfilePic?: string;
}

interface TrackReferralData {
  referrerCode: string;
  referredUserId: string;
}

interface GetReferralsData {
  userId: string;
}

interface AddDummyReferralData {
  userId: string;
  dummyUsername: string;
  dummyAvatar: string;
}

type ActionData = CreateUserData | TrackReferralData | GetReferralsData | AddDummyReferralData;

interface RequestBody {
  action: 'createUser' | 'trackReferral' | 'getUserReferrals' | 'addDummyReferral';
  [key: string]: any;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body || '{}') as RequestBody;
    const { action, ...data } = body;

    let result;

    // Route to the appropriate action
    switch (action) {
      case 'createUser':
        result = await createOrUpdateUser(data as CreateUserData);
        break;
      case 'trackReferral':
        result = await trackReferral(data as TrackReferralData);
        break;
      case 'getUserReferrals':
        result = await getUserReferrals(data as GetReferralsData);
        break;
      case 'addDummyReferral':
        result = await addDummyReferral(data as AddDummyReferralData);
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};

// Helper functions
async function createOrUpdateUser({ 
  privyUserId, 
  referralCode, 
  email, 
  twitterUsername, 
  twitterProfilePic 
}: CreateUserData) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      user_id: privyUserId,
      referral_code: referralCode,
      email,
      twitter_username: twitterUsername,
      twitter_profile_pic: twitterProfilePic,
      invite_count: 0,
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function trackReferral({ referrerCode, referredUserId }: TrackReferralData) {
  // First, find the referrer by their code
  const { data: referrer, error: referrerError } = await supabase
    .from('users')
    .select('id, invite_count')
    .eq('referral_code', referrerCode)
    .single();

  if (referrerError || !referrer) {
    throw new Error('Referrer not found');
  }

  // Create the referral record
  const { error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrer.id,
      referred_id: referredUserId,
      referral_code: referrerCode,
      status: 'completed',
    });

  if (error) throw error;

  // Increment the referrer's invite count
  const { data: updatedReferrer, error: updateError } = await supabase
    .from('users')
    .update({ invite_count: referrer.invite_count + 1 })
    .eq('id', referrer.id)
    .select()
    .single();

  if (updateError) throw updateError;
  return updatedReferrer;
}

async function getUserReferrals({ userId }: GetReferralsData) {
  const { data, error } = await supabase
    .from('referrals')
    .select(`
      *,
      referred:referred_id(user_id, twitter_username, twitter_profile_pic, email)
    `)
    .eq('referrer_id', userId);

  if (error) throw error;
  return data;
}

// Function to add a dummy referral for testing
async function addDummyReferral({ userId, dummyUsername, dummyAvatar }: AddDummyReferralData) {
  // Create a dummy user first
  const { data: dummyUser, error: dummyUserError } = await supabase
    .from('users')
    .insert({
      user_id: `dummy_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referral_code: `DUMMY${Math.random().toString(36).toUpperCase().substring(2, 8)}`,
      twitter_username: dummyUsername,
      twitter_profile_pic: dummyAvatar,
      invite_count: 0
    })
    .select()
    .single();

  if (dummyUserError) throw dummyUserError;

  // Get the referrer
  const { data: referrer, error: referrerError } = await supabase
    .from('users')
    .select('id, invite_count, referral_code')
    .eq('id', userId)
    .single();

  if (referrerError || !referrer) {
    throw new Error('Referrer not found');
  }

  // Create the referral record
  const { error: referralError } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrer.id,
      referred_id: dummyUser.id,
      referral_code: referrer.referral_code,
      status: 'completed',
    });

  if (referralError) throw referralError;

  // Increment the referrer's invite count
  const { data: updatedReferrer, error: updateError } = await supabase
    .from('users')
    .update({ invite_count: referrer.invite_count + 1 })
    .eq('id', referrer.id)
    .select()
    .single();

  if (updateError) throw updateError;
  
  // Return a combined result
  return {
    success: true,
    dummyUser,
    referrer: updatedReferrer
  };
}

export { handler }; 