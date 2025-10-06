import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Topic } from '@/types/database';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); export interface GeneratedQuestion {
    question_text: string;
    question_type: 'multiple_choice' | 'short_answer' | 'calculation';
    difficulty: string;
    correct_answer: string;
    answer_options?: Record<string, string>;
    explanation: string;
    marks: number;
}

/**
 * Generate practice questions using OpenAI based on a topic
 */
export async function generateQuestions(
    topic: Topic,
    count: number = 5,
    difficulty?: string
): Promise<GeneratedQuestion[]> {
    const difficultyLevel = difficulty || topic.difficulty_level || 'intermediate';

    const prompt = `You are an expert educational content creator. Generate ${count} high-quality practice questions for the following topic:

Topic: ${topic.name}
${topic.description ? `Description: ${topic.description}` : ''}
Difficulty Level: ${difficultyLevel}

Requirements:
1. Create a mix of question types: multiple choice, short answer, and calculation questions
2. Ensure questions are appropriate for ${difficultyLevel} level
3. Each question should test understanding, not just memorization
4. Provide detailed explanations for correct answers
5. For multiple choice, provide 4 options (A, B, C, D)
6. Assign appropriate marks (1-5 marks per question)

Return ONLY a valid JSON array with this structure:
[
  {
    "question_text": "The question text here",
    "question_type": "multiple_choice" | "short_answer" | "calculation",
    "difficulty": "${difficultyLevel}",
    "correct_answer": "The correct answer",
    "answer_options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"} (only for multiple_choice),
    "explanation": "Detailed explanation of why this is correct",
    "marks": 3
  }
]

Generate exactly ${count} questions now.`;

    try {
        const fullPrompt = `You are an expert educational content creator specializing in STEM subjects. You generate high-quality, curriculum-aligned practice questions.

${prompt}

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks.`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const content = response.text();

        if (!content) {
            throw new Error('No content received from Gemini');
        }

        // Clean the response - remove markdown code blocks if present
        let cleanedContent = content.trim();
        if (cleanedContent.startsWith('```json')) {
            cleanedContent = cleanedContent.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanedContent.startsWith('```')) {
            cleanedContent = cleanedContent.replace(/^```\n?/, '').replace(/\n?```$/, '');
        }

        // Parse the response
        const parsed = JSON.parse(cleanedContent);        // Handle different response formats
        let questions: GeneratedQuestion[];
        if (Array.isArray(parsed)) {
            questions = parsed;
        } else if (parsed.questions && Array.isArray(parsed.questions)) {
            questions = parsed.questions;
        } else {
            throw new Error('Unexpected response format from OpenAI');
        }

        // Validate questions
        questions.forEach((q, index) => {
            if (!q.question_text || !q.question_type || !q.correct_answer) {
                throw new Error(`Invalid question at index ${index}`);
            }
        });

        return questions;
    } catch (error) {
        console.error('Error generating questions:', error);
        throw new Error('Failed to generate questions. Please try again.');
    }
}

/**
 * Generate a hint for a specific question using AI
 */
export async function generateHint(
    questionText: string,
    topicName: string
): Promise<string> {
    try {
        const prompt = `You are a helpful tutor. Provide a helpful hint without giving away the complete answer.

Topic: ${topicName}

Question: ${questionText}

Provide a helpful hint to guide the student without revealing the full answer. Be concise (max 2-3 sentences).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text() || 'Unable to generate hint at this time.';
    } catch (error) {
        console.error('Error generating hint:', error);
        throw new Error('Failed to generate hint.');
    }
}/**
 * Evaluate a student's answer using AI (for open-ended questions)
 */
export async function evaluateAnswer(
    questionText: string,
    correctAnswer: string,
    studentAnswer: string,
    topicName: string
): Promise<{ isCorrect: boolean; feedback: string; score: number }> {
    try {
        const prompt = `You are an expert examiner. Evaluate student answers fairly and provide constructive feedback.

Topic: ${topicName}

Question: ${questionText}

Correct Answer: ${correctAnswer}

Student's Answer: ${studentAnswer}

Evaluate the student's answer and provide:
1. Whether it's correct (true/false)
2. Constructive feedback
3. A score from 0-100

Return ONLY valid JSON (no markdown) with this structure:
{
  "isCorrect": true/false,
  "feedback": "Your feedback here",
  "score": 0-100
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let content = response.text().trim();

        // Clean markdown formatting
        if (content.startsWith('```json')) {
            content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        } else if (content.startsWith('```')) {
            content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
        }

        if (!content) {
            throw new Error('No response from AI evaluator');
        }

        return JSON.parse(content);
    } catch (error) {
        console.error('Error evaluating answer:', error);
        throw new Error('Failed to evaluate answer.');
    }
}