-- 1. Create Mock User
INSERT INTO users (id, full_name, email, phone_number) 
VALUES (
    'd290f1ee-6c54-4b01-90e6-d701748f0851', 
    'Rahul Sharma', 
    'rahul.sharma@example.com', 
    '+91 98765 43210'
) ON CONFLICT (email) DO NOTHING;

-- 2. Create Mock Bank Account
INSERT INTO bank_accounts (id, user_id, bank_name, account_number)
VALUES (
    'b1111111-1111-1111-1111-111111111111',
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    'HDFC Bank',
    '•••• 4291'
) ON CONFLICT DO NOTHING;

-- 3. Create 1 Week of Daily Balance Data (7 Days)
-- Assuming today is 2026-04-09
INSERT INTO balance_snapshots (user_id, bank_account_id, balance, fetched_at) VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'b1111111-1111-1111-1111-111111111111', 45000.00, '2026-04-03 10:00:00+05:30'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'b1111111-1111-1111-1111-111111111111', 42500.00, '2026-04-04 10:00:00+05:30'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'b1111111-1111-1111-1111-111111111111', 41000.00, '2026-04-05 10:00:00+05:30'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'b1111111-1111-1111-1111-111111111111', 40000.00, '2026-04-06 10:00:00+05:30'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'b1111111-1111-1111-1111-111111111111', 55000.00, '2026-04-07 10:00:00+05:30'), -- Salary/Deposit?
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'b1111111-1111-1111-1111-111111111111', 52000.00, '2026-04-08 10:00:00+05:30'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'b1111111-1111-1111-1111-111111111111', 50000.00, '2026-04-09 10:00:00+05:30');

-- 4. Create 1 Weekly Summary Insight
-- Avg balance: ~46,500
-- 30% Surplus: 13,950
INSERT INTO weekly_insights (user_id, week_start, total_amount, surplus_30_percent, analysis_text)
VALUES (
    'd290f1ee-6c54-4b01-90e6-d701748f0851',
    '2026-04-03',
    46500.00,
    13950.00,
    'Your balance showed a healthy upward trend this week with a significant deposit on Tuesday. Your minimum balance stayed above ₹40,000, identifying a safe investable surplus of ₹13,950 (30% of your average). We recommend moving this to a Liquid Fund for better returns.'
) ON CONFLICT (user_id, week_start) DO NOTHING;
