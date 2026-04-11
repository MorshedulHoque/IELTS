import axios from "axios";

// Users

export async function getAllUsers() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSingleUser(paramsId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function postUser(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
  }
}

// services/data.ts
export const updateUser = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) throw new Error("Failed to update user");

    // Return the parsed JSON response
    return await response.json();
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

export async function deleteUser(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Onboarding Functions

export async function getOnboardingData(userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/onboarding/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching onboarding data:", error);
    throw error;
  }
}

export async function saveOnboardingData(userId: string, data: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/onboarding/${userId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    throw error;
  }
}

export async function updateOnboardingData(userId: string, updates: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/onboarding/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) throw new Error("Failed to update onboarding data");

    return await response.json();
  } catch (error) {
    console.error("Update onboarding error:", error);
    throw error;
  }
}

// Reading Questions

export async function getReadingQuestions(paramsId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getReadingTest() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteReadingTest(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// services/data.ts
export const editReadingTest = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update reading test");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in editReadingTest:", error);
    throw error;
  }
};

export async function getSingleReadingTest(paramsId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function submitReadingQuestions(formData: any) {
  try {
    console.log("Sending data to API:", formData);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API Response:", response.data);
    // return response.data;
    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Full error object:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error message:", error.message);
    throw error; // ← re‑throw or handle as needed
  }
}

// Writing Questions

export async function getWritingTest() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions/`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSingleWritingTest(paramsId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function submitWritingQuestions(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // return response.data;
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
  }
}

export async function getAllWritingAnswers(userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitWritingAnswers/getAllWritingAnswers/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching writing answers:", error);
    return { success: false, data: [] };
  }
}

export const updateWritingTest = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update writing test");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in Update Writing Test:", error);
    throw error;
  }
};

export async function deleteWritingTest(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Reading Submit Answers

export async function postSubmitReadingTest(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitReadingAnswers`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
  }
}

export async function getAllReadingAnswers(userId: any) {
  try {
    const response = await axios.get(
      `api/submitAnswers/submitReadingAnswers/getAllReadingAnswers/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getReadingAnswersById(testId: any) {
  try {
    const response = await axios.get(
      `api/submitAnswers/submitReadingAnswers/getReadingAnswers/${testId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSubmitReadingTest(testId: any, userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitReadingAnswers/${testId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Writing Submit Answers

export async function postSubmitWritingTest(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitWritingAnswers`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
  }
}

export async function getSubmitWritingTest(testId: any, userId: any) {
  try {
    console.log("Fetching writing test submission:", { testId, userId });
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitWritingAnswers/${testId}/${userId}`
    );
    console.log("Writing test submission response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching writing test submission:", error);
    if (error.response?.status === 404) {
      return { success: false, error: "Writing submission not found" };
    }
    return { success: false, error: "Failed to fetch writing submission" };
  }
}

export async function getWritingAnswersById(testId: any) {
  try {
    const response = await axios.get(
      `api/submitAnswers/submitWritingAnswers/getWritingAnswers/${testId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Listening Questions
export async function getListeningTests() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getListeningTestById(id: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function submitListeningQuestions(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // return response.data;
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
  }
}

export const editListeningTest = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update listening test");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in editListeningTest:", error);
    throw error;
  }
};

export async function deleteListeningTest(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Listening Submit Answers

export async function postSubmitListeningTest(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitListeningAnswers`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
  }
}

export async function getAllListeningAnswers(userId: any) {
  try {
    const response = await axios.get(
      `/api/submitAnswers/submitListeningAnswers/getAllListeningAnswers/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getListeningAnswersById(testId: any) {
  try {
    const response = await axios.get(
      `api/submitAnswers/submitListeningAnswers/getListeningAnswers/${testId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSubmitListeningTest(testId: any, userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitListeningAnswers/${testId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Speaking Questions
export async function getSpeakingTests() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSpeakingTestById(id: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function submitSpeakingQuestions(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editSpeakingTest = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update speaking test");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in editSpeakingTest:", error);
    throw error;
  }
};

export async function deleteSpeakingTest(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Speaking Submit Answers
export async function postSubmitSpeakingTest(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitSpeakingAnswers`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllSpeakingAnswers(userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitSpeakingAnswers?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getSubmitSpeakingTest(submissionId: any, userId?: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitSpeakingAnswers/${submissionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching speaking submission:", error);
    return { success: false, error: "Failed to fetch speaking submission" };
  }
}

// Speaking Audio Analysis
export async function analyzeSpeakingAudio(audioData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/speaking/analyze`,
      audioData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
