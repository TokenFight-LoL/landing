export function getReferralCode(userId: string): string {
  // In a real implementation, this would be a unique code stored in a database
  // For this example, we'll just use a hash of the user ID
  return btoa(userId).substring(0, 8)
}

/**
 * Track a referral when someone signs up using a referral link
 */
export function trackReferral(referralCode: string, newUserId: string): void {
  // In a real implementation, this would make an API call to record the referral
  console.log(`User ${newUserId} was referred by code ${referralCode}`)

  // You would typically:
  // 1. Look up which user owns this referral code
  // 2. Increment their referral count
  // 3. Record that this new user was referred
}

/**
 * Calculate a user's referral score
 * Score = (Referrals × 100 points) + Early Signup Bonus
 */
export function calculateReferralScore(referralCount: number, signupTimestamp: number): number {
  // Early signup bonus calculation (example)
  const launchDate = new Date("2023-01-01").getTime()
  const userSignupDate = signupTimestamp
  const daysSinceLaunch = Math.floor((userSignupDate - launchDate) / (1000 * 60 * 60 * 24))

  // Earlier signups get higher bonuses (max 500 points)
  const earlySignupBonus = Math.max(0, 500 - daysSinceLaunch * 10)

  // Calculate total score
  return referralCount * 100 + earlySignupBonus
}

