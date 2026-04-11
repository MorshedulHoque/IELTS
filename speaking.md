📄 Project Description: IELTS Speaking Practice Section
🧠 Goal
To build an interactive IELTS Speaking practice section where users can choose from real IELTS-style tests, record their responses, and receive instant feedback in the form of transcripts and filler word analysis — without relying on AI models or human reviewers.

🎯 Key Features
1. Tabbed Interface
The speaking section will be divided into four tabs:

Full Test: All three parts (Part 1 → 2 → 3) in sequence

Part 1: Short personal questions

Part 2: Cue card with 1-minute prep + 2-minute answer

Part 3: Discussion-style follow-up questions

Each tab allows users to select or start a speaking test related to that part.

2. Test List Per Tab
Each tab will fetch a list of available speaking tests via backend API.

Tests will include:

Test title

Full question or cue card content

Unique test ID

Users can click “Start Test” to begin.

3. Speaking Test Interface
When a user starts a test:

The test question/cue card is shown

A countdown timer appears:

Part 2: 1 minute prep, 2 minutes answer

Others: fixed speaking duration

Buttons:

🎙️ Start Recording

⏹️ Stop Recording

▶️ Play Recorded Answer

4. Post-Test Output
Once the recording ends:

Audio is uploaded to the server

The backend uses Whisper (self-hosted) to transcribe audio into text

The transcript is analyzed to:

Detect and count filler words (e.g., "um", "uh", "like", "you know")

Prepare a simple feedback report

5. Speaking Test Report (Shown to User)
After a few seconds of processing, show:

✅ Transcript of what the user said

✅ Filler Word Stats

"um": 3 times

"like": 2 times

"uh": 0 times

✅ Fluency Tip

“Try to reduce filler words to improve your fluency.”

Optional:

Allow audio + transcript + report to be saved to the user's dashboard

🧠 NLP Feedback Logic
Use simple Python + NLP logic (e.g., nltk or spaCy) to:

Tokenize transcript

Count usage of specific filler words: "um", "uh", "like", "you know", "basically", etc.

Generate a feedback report with totals and recommendations

✅ Summary of the User Flow
User opens the Speaking page and selects a tab (Part 1, 2, 3, or Full Test)

A list of tests is fetched and displayed

User selects a test → recording interface opens

User records their answer with a timer

After stopping the recording:

Audio is uploaded

Transcript is generated

Filler words are detected

Final report is shown to the user