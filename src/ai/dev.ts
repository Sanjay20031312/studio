import { config } from 'dotenv';
config();

// Ensure only BlockPay relevant flows are imported.
// If intelligent-amount-prompt.ts and transaction-summary.ts are intended for BlockPay,
// they should remain. Any e-commerce specific flows like product-recommendations
// or trending-products should be removed (they are not present in the initial file list).

import '@/ai/flows/intelligent-amount-prompt.ts';
import '@/ai/flows/transaction-summary.ts';
