// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kgrwunvrwlocvcnvavwd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtncnd1bnZyd2xvY3ZjbnZhdndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDk2NTMsImV4cCI6MjA2NDE4NTY1M30.ulb5LHvlEHvbhgEYVsLdwohznAUm9tc2UGQzqOsQPnI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
