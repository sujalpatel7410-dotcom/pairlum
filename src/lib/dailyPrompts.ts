// A rotating bank of daily connection questions. The question shown "today" is
// picked deterministically from the UTC calendar date, so every device shows
// the same question without needing a server to schedule it.

export const DAILY_QUESTIONS: string[] = [
  'What is one tiny thing about us that you felt grateful for today?',
  'What moment today made you smile and think of me?',
  'If we were together right now, what would we be doing?',
  'What is a small thing I do that makes you feel loved?',
  'What song has been reminding you of us lately?',
  'What is something you are looking forward to when we are next together?',
  'What is your favorite memory of us from this past month?',
  'What is a habit of mine you have grown to love?',
  'What is something you want to tell me but keep forgetting to?',
  'What made today hard, and how can I help carry it?',
  'What is a place you would love for us to visit together one day?',
  'What is something small I did recently that meant more than I probably know?',
  'What is a dream you have not told me about yet?',
  'What do you miss most about being close to me right now?',
  'What is one word for how you are feeling about us today?',
  'What is something you are proud of yourself for this week?',
  'What is a promise you want us to make to each other?',
  'What is your favorite thing to imagine about our future?',
  'What is something that made you laugh today?',
  'What is a way I could make your week a little easier?',
  'What is a memory from before we met that you wish I had been there for?',
  'What is something about "us" that feels different now than it did a year ago?',
  'What is one thing you would want in a letter from me right now?',
  'What is a small tradition you would want us to start?'
];

export function getTodayDateKey(): string {
  // UTC calendar date (e.g. "2026-09-04") so both partners resolve the same
  // "today" regardless of which timezone each of them is in.
  return new Date().toISOString().slice(0, 10);
}

export function pickQuestionForDate(dateKey: string): string {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return DAILY_QUESTIONS[hash % DAILY_QUESTIONS.length];
}
