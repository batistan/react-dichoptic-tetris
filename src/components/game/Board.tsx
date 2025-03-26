import {GameState} from "./logic/GameState.ts";
import {getRotationArray, RotationArray} from "./logic/Blocks.ts";
import {Coordinates} from "./logic/Board.ts";
import {ReactNode, useContext} from "react";
import {settingsContext} from "../SettingsContext.ts";

interface BoardProps {
  gameState: GameState,
  handleRestart: () => void
}

function rotationArrayValue(
  boardRowIndex: number,
  boardColIndex: number,
  blockCoords: Coordinates,
  rotationArray: RotationArray
): number | null {
  const rotationRow = boardRowIndex - blockCoords.y;
  if (rotationRow < 0 || rotationRow > rotationArray.length - 1) return null;

  const rotationCol = boardColIndex - blockCoords.x;
  if (rotationCol < 0 || rotationCol > rotationArray[0].length - 1) return null;

  return rotationArray[rotationRow][rotationCol];
}

function getCellColor(
  isFallingBlock: boolean,
  isLandedBlock: boolean,
  isGhostBlock: boolean,
  showGhostBlock: boolean,
  fallingColorHex: string,
  landedColorHex: string
): string {
  return isFallingBlock ? fallingColorHex : (
    isLandedBlock ? landedColorHex : (
      (isGhostBlock && showGhostBlock) ? "rgba(50%, 50%, 50%, 50%)" : "transparent"
    )
  );
}

export default function Board({ gameState, handleRestart }: BoardProps) {
  const { fallingColorHex, landedColorHex, showGhost } = useContext(settingsContext);
  const fallingBlockPosition = gameState.currentBlockPosition;
  const currentBlockRotation = getRotationArray(gameState.nextBlocks[0]);

  return <div id="board" className="relative w-64 h-fit rounded-md md:rounded-none md:rounded-bl-md overflow-hidden bg-board-bg">
    <GameOverlay isOpen={gameState.isPaused}>
      <p className="text-center">Paused!</p>
      <p className="text-center">(ESC to resume)</p>
    </GameOverlay>
    <GameOverModal isOpen={gameState.isOver} handleRestart={handleRestart} />
    { gameState.board.rows.map((row, rowIndex) => {
      return <div key={row.id} className="flex flex-row overflow-hidden">
        {row.cells.map((cell, colIndex) => {
          const isCurrentCellInBlock = rotationArrayValue(
            rowIndex,
            colIndex,
            fallingBlockPosition,
            currentBlockRotation
          ) === 1

          const isCurrentCellGhostBlock = rotationArrayValue(
            rowIndex,
            colIndex,
            gameState.ghostBlockPosition,
            currentBlockRotation
          ) === 1

          const isEmptyCell = cell === null

          const color = getCellColor(
            isCurrentCellInBlock,
            !isEmptyCell,
            isCurrentCellGhostBlock,
            showGhost,
            fallingColorHex,
            landedColorHex
          )

          return <div key={`${row.id}-${colIndex}`} className="cell" style={{ backgroundColor: color }}/>
        })}
      </div>
    })}
  </div>
}

function GameOverlay({ isOpen, children }: { isOpen: boolean; children: ReactNode }) {
  return isOpen && (
    <div className="absolute top-0 left-0 w-full h-full bg-background/60 z-1 flex justify-center items-center">
      <div onClick={(e) => e.stopPropagation()}
           className="p-4 shadow-md rounded-md bg-header flex flex-col justify-center gap-2"
      >
        {children}
      </div>
    </div>
  )
}

function GameOverModal({isOpen, handleRestart}: { isOpen: boolean, handleRestart: () => void }) {
  return <GameOverlay isOpen={isOpen}>
      <p>Game Over!</p>
      <button onClick={handleRestart}
              className="bg-info-bg text-text-dark hover:bg-button-hover hover:text-button-hover-text shadow-md rounded-md p-1"
      >Restart</button>
  </GameOverlay>
}
