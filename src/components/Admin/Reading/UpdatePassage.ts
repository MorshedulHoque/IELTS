// Handle passage type change
export const updatePassageType = (
  passageIndex: number,
  passageType: "type1" | "type2",
  test: any,
  setTest: any
) => {
  const updatedParts = [...test.parts];

  // If changing to type2, ensure the passage is in the correct structure
  if (
    passageType === "type2" &&
    Array.isArray(updatedParts[passageIndex].passage)
  ) {
    const passageArray = updatedParts[passageIndex].passage as string[];
    updatedParts[passageIndex].passage = passageArray.reduce(
      (acc: Record<string, string>, para, idx) => {
        const key = String.fromCharCode(65 + idx); // A, B, C...
        acc[key] = para;
        return acc;
      },
      {}
    );
  }

  // If changing to type1, ensure the passage is an array
  if (
    passageType === "type1" &&
    typeof updatedParts[passageIndex].passage !== "object"
  ) {
    updatedParts[passageIndex].passage = Object.values(
      updatedParts[passageIndex].passage
    );
  }

  updatedParts[passageIndex].passageType = passageType;
  setTest({ ...test, parts: updatedParts });
};

// Update any passage field (e.g., title, instructions, etc.)
export const updatePassageField = (
  passageIndex: number,
  field: keyof any,
  value: any,
  test: any,
  setTest: any
) => {
  const updatedParts = [...test.parts];
  updatedParts[passageIndex][field] = value;
  setTest({ ...test, parts: updatedParts });
};

// Update paragraph based on passage type
export const updateParagraph = (
  passageIndex: number,
  paraIndex: number,
  value: string,
  test: any,
  setTest: any
) => {
  const updatedParts = [...test.parts];
  const passage = updatedParts[passageIndex].passage;

  if (Array.isArray(passage)) {
    passage[paraIndex] = value; // Type 1: Array of paragraphs
  } else {
    const paragraphKey = String.fromCharCode(65 + paraIndex); // 'A', 'B', 'C'...
    passage[paragraphKey] = value; // Type 2: Object with keys
  }

  setTest({ ...test, parts: updatedParts });
};
