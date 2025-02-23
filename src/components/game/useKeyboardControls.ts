import {GameStateAction} from "./logic/GameState.ts";
import {Dispatch, useEffect} from "react";

/**
 *
 * @param event
 * @param dispatch
 *
 * @return true if event was handled, false otherwise
 */
export function handleKeyDown(
  event: KeyboardEvent,
  dispatch: Dispatch<GameStateAction>
): boolean {
  switch (event.code) {
    case "Escape":
      dispatch(GameStateAction.PAUSE)
      return true;
    case "ArrowLeft":
    case "NumpadArrowLeft":
    case "A":
      dispatch(GameStateAction.MOVE_LEFT)
      return true;
    case "ArrowRight":
    case "NumpadArrowRight":
    case "D":
      dispatch(GameStateAction.MOVE_RIGHT)
      return true;
    case "ArrowDown":
    case "NumpadArrowDown":
    case "S":
      dispatch(GameStateAction.MOVE_DOWN)
      return true;
    case "Space":
      dispatch(GameStateAction.HARD_DROP)
      return true;
    case "Shift":
      dispatch(GameStateAction.HOLD)
      return true;
    case "ArrowUp":
    case "W":
    case "NumpadArrowUp":
      dispatch(GameStateAction.ROTATE_CLOCKWISE)
      return true;
    default:
      return false;
  }
}

export default function useKeyboardControls(
  dispatch: Dispatch<GameStateAction>
): void {
  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      if (handleKeyDown(event, dispatch)) {
        event.preventDefault()
      }
    }

    window.addEventListener("keydown", eventHandler)

    return () => { window.removeEventListener("keydown", eventHandler) }
  }, [dispatch]);
}