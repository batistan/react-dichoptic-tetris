import Board from "./Board.tsx";
import Info from "./Info.tsx";
import {useState} from "react";

export default function Game({ fallingColorHex, landedColorHex }: { fallingColorHex: string; landedColorHex: string }) {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  function handleLineClear() {
    setScore(score);
  }

  return (<div>
    <Board fallingColorHex={fallingColorHex} landedColorHex={landedColorHex} handleLineClear={handleLineClear} />
    <Info nextBlock={"T"} blockColor={fallingColorHex} level={7} score={score}/>
  </div>)
}