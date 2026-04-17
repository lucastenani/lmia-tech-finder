import { useEffect, useState } from "react"
import { toast } from "sonner"
import { loadAllData } from "@/lib/data-loader"
import type { LoadResult } from "@/types"

type State =
  | { status: "loading"; data: null; error: null }
  | { status: "ready"; data: LoadResult; error: null }
  | { status: "error"; data: null; error: Error }

// Module-level cache: survives StrictMode double-render and remounts.
let cache: Promise<LoadResult> | null = null

function getData(): Promise<LoadResult> {
  if (!cache) {
    cache = loadAllData()
  }
  return cache
}

export function useLMIAData(): State {
  const [state, setState] = useState<State>({
    status: "loading",
    data: null,
    error: null,
  })

  useEffect(() => {
    let mounted = true
    getData()
      .then((data) => {
        if (!mounted) {
          return
        }
        setState({ status: "ready", data, error: null })

        if (data.sources.length === 0) {
          toast.info("No data files found", {
            description:
              "Drop YYYY_Q{1-4}.xlsx files into public/data/ and run `npm run manifest`.",
          })
        } else if (data.errors.length > 0) {
          toast.warning(
            `Loaded with ${data.errors.length} parse warning${
              data.errors.length > 1 ? "s" : ""
            }`,
            {
              description: data.errors
                .slice(0, 3)
                .map((e) => `${e.source}: ${e.message}`)
                .join("\n"),
            }
          )
        }
      })
      .catch((err: Error) => {
        if (!mounted) {
          return
        }
        cache = null
        setState({ status: "error", data: null, error: err })
        toast.error("Failed to load data", { description: err.message })
      })

    return () => {
      mounted = false
    }
  }, [])

  return state
}
