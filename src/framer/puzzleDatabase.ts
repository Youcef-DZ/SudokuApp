const NOTION_API_URL = 'https://notion-dgmd-cc.vercel.app/api/query?d=2a34ffe6f70c809fa74dca478af13756&r=true&n=a';

export interface PuzzleData {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  puzzle: number[][];
  solution: number[][];
}

const stringToBoard = (str: string): number[][] => {
  const board: number[][] = [];
  for (let i = 0; i < 9; i++) {
    const row: number[] = [];
    for (let j = 0; j < 9; j++) {
      const char = str[i * 9 + j];
      row.push(parseInt(char));
    }
    board.push(row);
  }
  return board;
};

let puzzleCache: PuzzleData[] | null = null;

export const fetchPuzzlesFromNotion = async (): Promise<PuzzleData[]> => {
  if (puzzleCache) return puzzleCache;
  
  try {
    const response = await fetch(NOTION_API_URL);
    const data = await response.json();
    
    if (data.QUERY_RESPONSE_KEY_SUCCESS) {
      const blocks = data.QUERY_RESPONSE_KEY_RESULT.PRIMARY_DATABASE.BLOCKS;
      const fetchedPuzzles = blocks.map((block: any) => ({
        id: parseInt(block.PROPERTIES.ID.VALUE),
        difficulty: block.PROPERTIES.Difficulty.VALUE as 'easy' | 'medium' | 'hard',
        puzzle: stringToBoard(block.PROPERTIES.Puzzle.VALUE),
        solution: stringToBoard(block.PROPERTIES.Solution.VALUE)
      }));
      puzzleCache = fetchedPuzzles;
      return fetchedPuzzles;
    }
  } catch (error) {
    console.error('Failed to fetch puzzles from Notion:', error);
  }
  
  return [];
};

export const getRandomPuzzle = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<PuzzleData | null> => {
  const puzzles = await fetchPuzzlesFromNotion();
  const filtered = puzzles.filter(p => p.difficulty === difficulty);
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

export const getPuzzlesByDifficulty = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<PuzzleData[]> => {
  const puzzles = await fetchPuzzlesFromNotion();
  return puzzles.filter(p => p.difficulty === difficulty);
};

export const getPuzzleById = async (id: number): Promise<PuzzleData | null> => {
  const puzzles = await fetchPuzzlesFromNotion();
  return puzzles.find(p => p.id === id) || null;
};
