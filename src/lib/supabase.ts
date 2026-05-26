import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lffdhbknxygetngzzdq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZmRmaGJrbnh5Z2V0bmd6emRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDkxNzMsImV4cCI6MjA5NTIyNTE3M30.KSngIicxjjqotLZvwNQPZkQbEzLOD7nyZ3aVBiIljUU'   // ← Yahan apna full Anon Key daal do

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
