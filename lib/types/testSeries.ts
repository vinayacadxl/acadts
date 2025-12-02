// lib/types/testSeries.ts
import type { Timestamp } from "firebase/firestore";

export interface TestSeriesDoc {
  title: string;
  description: string;
  thumbnail?: string; // URL to thumbnail image (optional for now)
  testIds: string[]; // Array of test document IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // Admin UID
}

export interface TestSeries extends TestSeriesDoc {
  id: string;
}

export interface TestSeriesInput {
  title: string;
  description: string;
  thumbnail?: string;
  testIds: string[];
}


