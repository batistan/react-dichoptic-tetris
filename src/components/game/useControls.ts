import {GameStateAction} from "./logic/GameState.ts";
import {Dispatch, useEffect, useState} from "react";

/**
 *
 * @param event
 * @param dispatch
 *
 * @return true if event was handled, false otherwise
 */
function handleKeyDown(
  event: KeyboardEvent,
  dispatch: Dispatch<GameStateAction>
): boolean {
  switch (event.code) {
    case "Escape":
      dispatch(GameStateAction.PAUSE)
      return true;
    case "ArrowLeft":
    case "NumpadArrowLeft":
    case "KeyA":
      dispatch(GameStateAction.MOVE_LEFT)
      return true;
    case "ArrowRight":
    case "NumpadArrowRight":
    case "KeyD":
      dispatch(GameStateAction.MOVE_RIGHT)
      return true;
    case "ArrowDown":
    case "NumpadArrowDown":
    case "KeyS":
      dispatch(GameStateAction.MOVE_DOWN)
      return true;
    case "Space":
      dispatch(GameStateAction.HARD_DROP)
      return true;
    case "ShiftLeft":
    case "ShiftRight":
      dispatch(GameStateAction.HOLD)
      return true;
    case "ArrowUp":
    case "KeyW":
    case "NumpadArrowUp":
      dispatch(GameStateAction.ROTATE_CLOCKWISE)
      return true;
    case "KeyC":
      dispatch(GameStateAction.ROTATE_ANTI_CLOCKWISE)
      return true;
    default:
      return false;
  }
}

function handleTouch(
  touch: SwipeType,
  dispatch: Dispatch<GameStateAction>
) {
  switch (touch) {
    case "down":
      dispatch(GameStateAction.MOVE_DOWN);
      break;
    case "up":
      dispatch(GameStateAction.ROTATE_CLOCKWISE);
      break;
    case "left":
      dispatch(GameStateAction.MOVE_LEFT);
      break;
    case "right":
      dispatch(GameStateAction.MOVE_RIGHT);
      break;
    case "tap":
      dispatch(GameStateAction.PAUSE);
      break;
    case "double":
      dispatch(GameStateAction.HARD_DROP);
      break;
  }
}

export default function useControls(
  dispatch: Dispatch<GameStateAction>,
  inputDisabled: boolean
): void {
  const [touchStartCoords, setTouchStartCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      // if we used the key to dispatch an action, disable default event behavior
      if (handleKeyDown(event, dispatch)) {
        event.preventDefault()
      }
    }

    const touchStartHandler = (event: TouchEvent) => {
      if ((event.target as Element).closest("#board")) {
        setTouchStartCoords(
          { x: event.touches[0].clientX, y: event.touches[0].clientY }
        )
      }
    }

    const touchEndHandler = (event: TouchEvent) => {
      if (touchStartCoords === null) return

      const touchType = swipeDir(
        touchStartCoords,
        { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
      )

      if (touchType == "tap" && event.changedTouches.length > 1) {
        handleTouch("double", dispatch)
      } else {
        handleTouch(touchType, dispatch)
      }
      setTouchStartCoords(null)

      event.preventDefault()
    }

    if (!inputDisabled) {
      window.addEventListener("keydown", keyHandler)
      window.addEventListener("touchstart", touchStartHandler)
      window.addEventListener("touchend", touchEndHandler)
    }

    return () => {
      window.removeEventListener("keydown", keyHandler)
      window.removeEventListener("touchstart", touchStartHandler)
      window.removeEventListener("touchend", touchEndHandler)
    }
  }, [dispatch, inputDisabled, touchStartCoords]);
}

interface Coordinates {
  x: number;
  y: number;
}

type SwipeType = "down" | "up" | "left" | "right" | "tap" | "double"

const MIN_SWIPE_DISTANCE_PX = 5;

function swipeDir(touchStart: Coordinates, touchEnd: Coordinates): SwipeType {
  const dx = touchEnd.x - touchStart.x;
  const dy = touchEnd.y - touchStart.y;
  const distance = Math.sqrt((dx * dx) + (dy * dy));

  if (distance < MIN_SWIPE_DISTANCE_PX) {
    return "tap"
  } else if (Math.abs(dx) >= Math.abs(dy)) {
    return (dx < 0) ? "left" : "right"
  } else {
    // higher y is closer to bottom
    return (dy < 0) ? "up" : "down"
  }
}
