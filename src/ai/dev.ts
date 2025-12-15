import { config } from 'dotenv';
config();

import '@/ai/flows/explain-rental-prediction.ts';
import '@/ai/flows/describe-room-from-images.ts';
import '@/ai/flows/merge-detections-from-multiple-images.ts';