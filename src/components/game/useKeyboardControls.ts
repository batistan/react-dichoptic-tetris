import {GameStateAction} from "./logic/GameState.ts";
import {Dispatch, useEffect} from "react";

export function handleKeyDown(
  event: KeyboardEvent,
  dispatch: Dispatch<GameStateAction>
) {
  switch (event.code) {
    case "Escape":
      dispatch(GameStateAction.PAUSE)
      break;
    case "ArrowLeft":
    case "NumpadArrowLeft":
    case "A":
      dispatch(GameStateAction.MOVE_LEFT)
      break;
    case "ArrowRight":
    case "NumpadArrowRight":
    case "D":
      dispatch(GameStateAction.MOVE_RIGHT)
      break;
    case "ArrowDown":
    case "NumpadArrowDown":
    case "S":
      dispatch(GameStateAction.MOVE_DOWN)
      break;
    case "Space":
      dispatch(GameStateAction.HARD_DROP)
      break;
    case "Shift":
      dispatch(GameStateAction.HOLD)
      break;
    case "ArrowUp":
    case "W":
    case "NumpadArrowUp":
      dispatch(GameStateAction.ROTATE_CLOCKWISE)
      break;
  }
}

export default function useKeyboardControls(
  dispatch: Dispatch<GameStateAction>
): void {
  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      event.preventDefault()
      handleKeyDown(event, dispatch)
    }

    window.addEventListener("keydown", eventHandler)

    return () => { window.removeEventListener("keydown", eventHandler) }
  }, [dispatch]);
}