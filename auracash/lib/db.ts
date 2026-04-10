import { createClient } from './supabase-server';

export interface User {
  id?: string;
  email: string;
  mobile?: string;
  bankDetails?: {
    holderName: string;
    accountNumber: string;
    bankName: string;
  };
  balance: number;
  transactions: any[];
}

export const db = {
  getUser: async (email: string): Promise<User | null> => {
    const supabase = await createClient();

    // 1. Fetch User Profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) return null;

    // 2. Fetch Bank Details
    const { data: bankData } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    // 3. Fetch Latest Balance
    const { data: balanceData } = await supabase
      .from('balance_snapshots')
      .select('balance')
      .eq('user_id', userData.id)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    return {
      id: userData.id,
      email: userData.email,
      mobile: userData.phone_number,
      bankDetails: bankData ? {
        holderName: bankData.holder_name || '',
        accountNumber: bankData.account_number,
        bankName: bankData.bank_name
      } : undefined,
      balance: balanceData ? parseFloat(balanceData.balance) : 0,
      transactions: []
    };
  },

  initializeBalance: async (userId: string, amount: number) => {
    const supabase = await createClient();
    await supabase.from('balance_snapshots').insert({
      user_id: userId,
      balance: amount
    });
  },

  updateMobile: async (email: string, mobile: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .update({ phone_number: mobile })
      .eq('email', email)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateBankDetails: async (email: string, details: NonNullable<User['bankDetails']>) => {
    const supabase = await createClient();

    // First get the user id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !user) throw new Error('User not found when linking bank account');

    const { error } = await supabase
      .from('bank_accounts')
      .upsert({
        user_id: user.id,
        bank_name: details.bankName,
        account_number: details.accountNumber,
        holder_name: details.holderName,
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return true;
  },

  getAllUsers: async () => {
    const supabase = await createClient();
    const { data } = await supabase.from('users').select('*');
    return data || [];
  }
};
