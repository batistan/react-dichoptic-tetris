import {GameStateAction} from "./logic/GameState.ts";
import {Dispatch, RefObject, useState, SyntheticEvent, useEffect} from "react";

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

export type UseKeyboardControlsCleanupCallback = () => void;

export default function useKeyboardControls(
  ref: RefObject<Element>,
  dispatch: Dispatch<GameStateAction>
): void {
  useEffect(() => {
    if (!ref.current) { return () => {} }

    const eventHandler = (event) => {
      event.preventDefault()
      if (event instanceof KeyboardEvent) {
        handleKeyDown(event, dispatch)
      }
    }

    ref.current.addEventListener("keydown", eventHandler)
    console.log("Added handler")

    return () => { if (ref.current) ref.current.removeEventListener("keydown", eventHandler) }
  }, [ref, dispatch]);
}