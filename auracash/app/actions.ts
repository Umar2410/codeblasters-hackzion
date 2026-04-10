'use server';

import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase-server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Helper to wait for the database trigger to finish creating the user profile
async function waitForUser(email: string, retries = 5, delay = 500) {
  for (let i = 0; i < retries; i++) {
    const user = await db.getUser(email);
    if (user) return user;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  return null;
}

export async function signUp(email: string, password?: string, fullName?: string) {
  if (!password) return { success: false, error: 'Password is required' };
  const supabase = await createClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split('@')[0],
      }
    }
  });

  if (signUpError) {
    return { success: false, error: signUpError.message };
  }

  // Poll for the user profile (Postgres trigger might be delayed)
  const user = await waitForUser(email);
  
  if (user?.id) {
    // Check if balance exists, if not initialize it
    if (user.balance === 0) {
      const randomBalance = Math.floor(Math.random() * 500000) + 50000;
      await db.initializeBalance(user.id, randomBalance);
    }
    return { success: true, user: await db.getUser(email), isNewUser: true };
  }

  // Fallback: If trigger is exceptionally slow, return success but flag that profile is pending
  return { 
    success: true, 
    user: { email, balance: 0, transactions: [] }, 
    isNewUser: true,
    warning: 'Profile initialization taking longer than expected. Please refresh in a moment.'
  };
}

export async function signIn(email: string, password?: string) {
  if (!password) return { success: false, error: 'Password is required' };
  const supabase = await createClient();

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    // Map common errors to friendly messages
    if (signInError.message.includes('Invalid login credentials')) {
      return { success: false, error: 'Incorrect email or password. Please try again.' };
    }
    if (signInError.message.includes('Email not confirmed')) {
      return { success: false, error: 'Please confirm your email before logging in. Check your inbox or disable email confirmation in Supabase.' };
    }
    return { success: false, error: signInError.message };
  }

  // Try to get user profile
  let user = await db.getUser(email);

  // If auth succeeded but no profile exists (trigger may not have run),
  // create the profile now so the user can proceed
  if (!user && signInData.user) {
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({ id: signInData.user.id, email, full_name: email.split('@')[0] });
    
    if (!upsertError) {
      // Wait briefly for the upsert to settle then initialize balance
      await new Promise(resolve => setTimeout(resolve, 300));
      user = await db.getUser(email);
      if (user?.id && user.balance === 0) {
        const randomBalance = Math.floor(Math.random() * 500000) + 50000;
        await db.initializeBalance(user.id, randomBalance);
        user = await db.getUser(email);
      }
    }
  }

  return { success: true, user, isNewUser: false };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, url: data.url };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function updateMobileNumber(email: string, mobile: string) {
  try {
    const updatedUser = await db.updateMobile(email, mobile);
    const user = await db.getUser(email);
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function linkBankAccount(email: string, bankDetails: { holderName: string; accountNumber: string; bankName: string }) {
  try {
    const supabase = await createClient();

    // Step 1: Look up user by email (same pattern as updateMobileNumber — works without session)
    const { data: userRow, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userRow) {
      return { success: false, error: `User not found for email: ${email}. Ensure the migration was run.` };
    }

    // Step 2: Try INSERT
    const { error: insertError } = await supabase.from('bank_accounts').insert({
      user_id: userRow.id,
      bank_name: bankDetails.bankName,
      account_number: bankDetails.accountNumber,
      holder_name: bankDetails.holderName,
    });

    if (insertError) {
      if (insertError.code === '23505') {
        // Duplicate — UPDATE existing row
        const { error: updateError } = await supabase
          .from('bank_accounts')
          .update({
            bank_name: bankDetails.bankName,
            account_number: bankDetails.accountNumber,
            holder_name: bankDetails.holderName,
          })
          .eq('user_id', userRow.id);

        if (updateError) return { success: false, error: `Update failed: ${updateError.message}` };
      } else {
        return { success: false, error: `Insert failed: ${insertError.message} [${insertError.code}]` };
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserData(email: string) {
  return await db.getUser(email);
}

export async function getAllUsersData() {
  return await db.getAllUsers();
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  // Try to get the existing profile
  let profile = await db.getUser(authUser.email!);

  // If auth exists but profile doesn't (trigger may not have run), upsert it now
  if (!profile) {
    const { error } = await supabase
      .from('users')
      .upsert(
        {
          id: authUser.id,
          email: authUser.email!,
          full_name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
        },
        { onConflict: 'id' }
      );

    if (!error) {
      await new Promise(resolve => setTimeout(resolve, 300));
      profile = await db.getUser(authUser.email!);

      // Seed initial balance for brand-new profile
      if (profile?.id && profile.balance === 0) {
        const randomBalance = Math.floor(Math.random() * 500000) + 50000;
        await db.initializeBalance(profile.id, randomBalance);
        profile = await db.getUser(authUser.email!);
      }
    }
  }

  return profile;
}

// Ensures a user profile row exists in public.users — used as a fallback during onboarding
export async function ensureProfile(email: string) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        id: authUser.id,
        email: authUser.email!,
        full_name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
      },
      { onConflict: 'id' }
    );

  if (error) return null;
  await new Promise(resolve => setTimeout(resolve, 300));
  return await db.getUser(email);
}

// ── Twilio OTP Logic ──────────────────────────────────────────

export async function sendOTP(email: string, phone: string) {
  if (!twilioClient) {
    console.warn('Twilio credentials missing in environment variables');
    return { success: false, error: 'SMS service not configured. Please check .env.local' };
  }

  // Normalize phone number to E.164 format (e.g., +919876543210)
  let normalizedPhone = phone.replace(/\D/g, ''); // Strip non-numeric
  if (normalizedPhone.length === 10) {
    normalizedPhone = `+91${normalizedPhone}`; // Default to India (+91)
  } else if (!phone.startsWith('+')) {
    normalizedPhone = `+${normalizedPhone}`; // Add + if missing
  } else {
    normalizedPhone = phone; // Already has +
  }

  // Generate a random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  try {
    const supabase = await createClient();
    
    // 1. Store/Upsert OTP in database with 5-minute expiration
    const { error: dbError } = await supabase
      .from('otps')
      .upsert({
        email,
        code: otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      }, { onConflict: 'email' });

    if (dbError) throw dbError;

    // 2. Send SMS via Twilio
    await twilioClient.messages.create({
      body: `Your AuraCash OTP is ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: normalizedPhone,
    });

    console.log(`OTP ${otp} sent to ${phone}`);
    return { success: true };
  } catch (error: any) {
    console.error('Twilio/DB Error:', error);
    return { success: false, error: error.message || 'Failed to send OTP' };
  }
}

export async function verifyOTP(email: string, code: string) {
  try {
    const supabase = await createClient();
    
    // 1. Fetch OTP for this user
    const { data, error } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return { success: false, error: 'OTP not found. Please resend.' };

    // 2. Check if expired
    if (new Date(data.expires_at) < new Date()) {
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    // 3. Verify matching code
    if (data.code !== code) {
      return { success: false, error: 'Invalid OTP code. Please try again.' };
    }

    // 4. Success — Cleanup OTP from DB
    await supabase.from('otps').delete().eq('email', email);
    
    return { success: true };
  } catch (error: any) {
    console.error('OTP Verification Error:', error);
    return { success: false, error: 'Verification failed' };
  }
}
// ── Investment Logic ──────────────────────────────────────────

export async function investPlanStocks(planId: string, planText: string) {
  try {
    const supabase = await createClient();
    
    // Simple parser: Look for symbols in parentheses or common stock names
    // Example: "Invest Rs. 50,000 in Reliance Industries (RELIANCE) and HDFC Bank (HDFCBANK)"
    const stockRegex = /([A-Z\s]+)\(([A-Z]+)\)/g;
    const matches = [...planText.matchAll(stockRegex)];
    
    const stocks = matches.map(match => ({
      name: match[1].trim(),
      symbol: match[2],
      count: Math.floor(Math.random() * 50) + 5, // Simulated count
      price: Math.floor(Math.random() * 2000) + 100
    }));

    if (stocks.length === 0) {
      // Fallback: Just take some common names if regex fails
      if (planText.toLowerCase().includes('reliance')) stocks.push({ name: 'Reliance Industries', symbol: 'RELIANCE', count: 10, price: 2500 });
      if (planText.toLowerCase().includes('hdfc')) stocks.push({ name: 'HDFC Bank', symbol: 'HDFCBANK', count: 15, price: 1600 });
    }

    // Since we don't have a table yet, we'll store this in a mock metadata field in initial_plan
    // OR just return it to the caller to show "Success" UI
    const { error } = await supabase
      .from('initial_plan')
      .update({ 
        user_response: 'approve',
        notification_status: 'processed_approve'
      })
      .eq('id', planId);

    if (error) throw error;
    
    return { success: true, investedStocks: stocks };
  } catch (error: any) {
    console.error('Investment failed:', error);
    return { success: false, error: error.message };
  }
}
