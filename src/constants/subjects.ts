export const DAT_SUBJECTS = [
  "General Chem",
  "Organic Chem",
  "Biology",
  "Perceptual Ability",
  "Reading Comprehension",
  "Quantitative Reasoning",
] as const;

export type SubjectId = (typeof DAT_SUBJECTS)[number];
