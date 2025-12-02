import { createStore } from "./store.ts"
import { useNotionData } from "./NotionHook.tsx"
import { useEffect } from "react"

const SCORES_DB_URL = 'https://notion-dgmd-cc.vercel.app/api/query?d=2bb4ffe6f70c80dfb0b8d0f4f06ce125&r=true&n=a';

// Store for scores database (only need this for writing)
export const useScoresStore = createStore({})

export default function ScoresDb() {
    const [store, setStore] = useScoresStore()

    // Scores database hook
    const scoresHook = useNotionData(SCORES_DB_URL)

    useEffect(() => {
        setStore({
            handleCreate: scoresHook.handleCreate,
            notionData: scoresHook.notionData,
        })
    }, [scoresHook.handleCreate, scoresHook.notionData])

    return <div style={{ display: 'none' }}></div>
}
