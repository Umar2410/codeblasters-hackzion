-- Table for storing the users balance amount daily
CREATE TABLE IF NOT EXISTS balance_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    balance NUMERIC(15, 2) NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by user and date
CREATE INDEX IF NOT EXISTS idx_balance_snapshots_user_date ON balance_snapshots(user_id, fetched_at);
