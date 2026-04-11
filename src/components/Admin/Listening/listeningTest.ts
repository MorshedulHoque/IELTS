export type QuestionGroup =
  | FillBlanksGroup
  | MCQGroup
  | MCQGroupWithInstruction
  | MultipleMCQGroup
  | MapGroup
  | BoxMatchingGroup;

export interface ListeningTest {
  title: string;
  type: "academic" | "general";
  duration: number;
  audioUrl: string;
  cloudinaryPublicId?: string;
  audioDuration?: number;
  audioFormat?: string;
  audioSize?: number;
  parts: TestPart[];
}

export interface TestPart {
  title: string;
  questions: QuestionGroup[];
}

// Fill in the Blanks Type
export interface FillBlanksGroup {
  instruction?: string;
  fill_in_the_blanks_with_subtitle: {
    title?: string;
    subtitle?: string;
    extra: string[];
    questions: {
      question_number: number;
      answer: string;
      input_type: string;
    }[];
  }[];
}

export interface FillQuestion {
  question_number: number;
  answer: string;
  input_type: string;
}

// MCQ Type
export interface MCQGroup {
  mcq: MCQItem[];
}

// New MCQ structure with instruction
export interface MCQGroupWithInstruction {
  instruction: string;
  questions: MCQItem[];
}

export interface MCQItem {
  question_number: number;
  question: string;
  answer: string;
  options: {
    label: string;
    value: string;
  }[];
  input_type: string;
  min_selection: number;
  max_selection: number;
}

// Multiple MCQ Type
export interface MultipleMCQGroup {
  multiple_mcq: MultipleMCQItem[];
}

export interface MultipleMCQItem {
  question_numbers: number[];
  question: string;
  options: {
    label: string;
    value: string;
  }[];
  input_type: string;
  min_selection: number;
  max_selection: number;
  correct_mapping: string[];
}

// Map Type
export interface MapGroup {
  map: MapItem[];
}

export interface MapItem {
  title: string;
  image: string;
  instructions: string;
  labels: string[];
  questions: {
    question_number: number;
    question: string;
    answer: string;
    input_type: string;
    min_selection: number;
    max_selection: number;
  }[];
}

export interface MapQuestion {
  question_number: number;
  question: string;
  answer: string;
  input_type: string;
  min_selection: number;
  max_selection: number;
}

// Box Matching Type
export interface BoxMatchingGroup {
  box_matching: BoxMatchingItem[];
}

export interface BoxMatchingItem {
  instructions?: string;
  options_title?: string;
  question_title?: string;
  options: {
    label: string;
    value: string;
  }[];
  questions: {
    question_number: number;
    topic: string;
    answer: string;
  }[];
}

// Fill in the Blanks Type
export interface FillBlanksItem {
  title?: string;
  subtitle?: string;
  extra: string[];
  questions: {
    question_number: number;
    answer: string;
    input_type: string;
  }[];
}
