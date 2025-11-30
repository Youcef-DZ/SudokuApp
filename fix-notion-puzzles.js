const NOTION_API_KEY = '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';
const DATABASE_ID = '2a34ffe6f70c809fa74dca478af13756'; // Puzzle Database ID

// --- Sudoku Generator Logic ---
function generateSudoku() {
    const board = Array(9).fill().map(() => Array(9).fill(0));

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) return false;
            if (board[i][col] === num) return false;
            if (board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) return false;
        }
        return true;
    }

    function solve(board) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0) {
                    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (const num of nums) {
                        if (isValid(board, r, c, num)) {
                            board[r][c] = num;
                            if (solve(board)) return true;
                            board[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solve(board);
    return board;
}

function removeNumbers(solution, count) {
    const puzzle = solution.map(row => [...row]);
    let removed = 0;
    while (removed < count) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        if (puzzle[r][c] !== 0) {
            puzzle[r][c] = 0;
            removed++;
        }
    }
    return puzzle;
}

function boardToString(board) {
    return board.flat().join('');
}

const difficulties = {
    'easy': 30,
    'medium': 40,
    'hard': 50
};

// --- Notion API Logic ---
async function fixPuzzles() {
    console.log('Fetching pages from Notion...');

    try {
        // 1. Fetch all pages
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch pages');
        }

        const pages = data.results;
        console.log(`Found ${pages.length} puzzles to fix.`);

        // 2. Iterate and Update
        for (const page of pages) {
            const pageId = page.id;
            const idProp = page.properties.ID?.title?.[0]?.plain_text || 'Unknown';

            // Get difficulty (handle case sensitivity or missing)
            let difficulty = 'medium'; // Default
            if (page.properties.Difficulty?.select?.name) {
                difficulty = page.properties.Difficulty.select.name.toLowerCase();
            } else if (page.properties.Difficulty?.rich_text?.[0]?.plain_text) {
                difficulty = page.properties.Difficulty.rich_text[0].plain_text.toLowerCase();
            }

            const removeCount = difficulties[difficulty] || 40;

            console.log(`Fixing Puzzle ID: ${idProp} (${difficulty})...`);

            // Generate new valid puzzle
            const solutionBoard = generateSudoku();
            const puzzleBoard = removeNumbers(solutionBoard, removeCount);
            const solutionStr = boardToString(solutionBoard);
            const puzzleStr = boardToString(puzzleBoard);

            // Update Notion Page
            const updateResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-21',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    properties: {
                        'Puzzle': {
                            rich_text: [{ text: { content: puzzleStr } }]
                        },
                        'Solution': {
                            rich_text: [{ text: { content: solutionStr } }]
                        }
                    }
                })
            });

            if (!updateResponse.ok) {
                const err = await updateResponse.json();
                console.error(`Failed to update Puzzle ${idProp}:`, err.message);
            } else {
                console.log(`✅ Updated Puzzle ${idProp}`);
            }

            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        console.log('All done! Puzzles have been regenerated and updated.');

    } catch (error) {
        console.error('Error:', error);
    }
}

fixPuzzles();
