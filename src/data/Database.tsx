// Cosmos DB is now used for all data
// Puzzles and Scores are fetched via /api endpoints in server.js

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
    const response = await fetch('/api/puzzles');
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
    const response = await fetch(`/api/puzzles/random?difficulty=${difficulty}`);
    if (!response.ok) {
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
