// Cosmos DB is now used for all data
// Puzzles and Scores are fetched via /api endpoints in server.js

// API Base URL - works for both web and mobile
// For mobile: Use your computer's IP address (find with: ipconfig getifaddr en0)
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    // In production (deployed), use relative URLs
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '';
    }
  }

  // For development on mobile/web, use environment variable or localhost
  const MOBILE_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  console.log('[Database] API Base URL:', MOBILE_API_URL);

  return MOBILE_API_URL;
};

const API_BASE_URL = getApiBaseUrl();
console.log('[Database] Using API_BASE_URL:', API_BASE_URL);

export interface PuzzleData {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  puzzle: number[][];
  solution: number[][];
}

export interface ScoreData {
  id: string;
  userName: string;
  time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  date: string;
}

let puzzleCache: PuzzleData[] | null = null;

export const fetchPuzzlesFromNotion = async (): Promise<PuzzleData[]> => {
  if (puzzleCache) return puzzleCache;

  try {
    const response = await fetch(`${API_BASE_URL}/api/puzzles`);
    if (!response.ok) {
      throw new Error(`Failed to fetch puzzles: ${response.statusText}`);
    }

    const data = await response.json();

    // Convert Cosmos DB format to PuzzleData format
    const fetchedPuzzles = data.map((item: any) => ({
      id: item.puzzleId, // Use numeric ID
      difficulty: item.difficulty as 'easy' | 'medium' | 'hard',
      puzzle: item.puzzle,
      solution: item.solution
    }));

    puzzleCache = fetchedPuzzles;
    return fetchedPuzzles;
  } catch (error) {
    console.error('Failed to fetch puzzles from Cosmos DB:', error);
    return [];
  }
};

export const getRandomPuzzle = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<PuzzleData | null> => {
  try {
    const url = `${API_BASE_URL}/api/puzzles/random?difficulty=${difficulty}`;
    console.log('[Database] Fetching random puzzle:', url);

    const response = await fetch(url);
    console.log('[Database] Response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('[Database] Fetch error body:', text);
      throw new Error(`Failed to fetch puzzle: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.puzzleId,
      difficulty: data.difficulty,
      puzzle: data.puzzle,
      solution: data.solution
    };
  } catch (error) {
    console.error('Failed to fetch random puzzle:', error);
    return null;
  }
};

// Scores are fetched via /api/scores endpoint
// See SudokuGame.tsx for usage
