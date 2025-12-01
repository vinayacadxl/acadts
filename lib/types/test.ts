// lib/types/test.ts
import type { Timestamp } from "firebase/firestore";

/**
 * Question reference within a test
 * Contains only the question ID and scoring information
 */
export interface TestQuestion {
  questionId: string;      // Reference to question document ID
  marks: number;           // Marks for this question in this test
  negativeMarks: number;   // Negative marking for this question (0 if none)
  order: number;           // Order/position of question in the test
}

/**
 * Test document in Firestore
 */
export interface TestDoc {
  title: string;
  description: string;
  durationMinutes: number;
  questions: TestQuestion[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;      // admin UID
}

/**
 * Test with document ID included
 */
export interface Test extends TestDoc {
  id: string;
}

/**
 * Input type for creating/updating a test from forms (before timestamps)
 */
export interface TestInput {
  title: string;
  description: string;
  durationMinutes: number;
  questions: TestQuestion[];
}



