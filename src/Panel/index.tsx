import { Box, Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Board from "../Board/Board";
import SquareFigure from "../figures/SquareFigure";

interface FigureInterface {
  rows: number[];
  columns: number[];
}

interface GameInterface {
  Figures: FigureInterface;
}

type FigureType = "LeftPipeFigure" | "RectangleFigure" | "RightPipeFigure" | "SquareFigure";

function Panel() {
  const gameBoard = useMemo(() => new Board(), []);
  const [currentMatrix, setCurrentMatrix] = useState<number[][]>(gameBoard.getMatrix());

  function makeMove(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") setCurrentMatrix(gameBoard.moveLeftFigure(gameBoard._figures).getMatrix());
    else if (e.key === "ArrowRight") setCurrentMatrix(gameBoard.moveRightFigure(gameBoard._figures).getMatrix());
    else if (e.key === "ArrowDown") setCurrentMatrix(gameBoard.moveDownFigure(gameBoard._figures).getMatrix());
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMatrix(gameBoard.moveDownFigure(gameBoard._figures).getMatrix());
    }, 1500);

    window.addEventListener("keydown", makeMove);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Box sx={{ width: "80%" }}>
        <Box
          sx={{
            width: "660px",
            height: "660px",
            background: "#A99",
            display: "grid",
            gridTemplate: "repeat(20, 40px) / repeat(10, 40px);",
            rowGap: "2px",
            columnGap: "2px",
            paddingTop: "20px",
            paddingLeft: "20px",
          }}
        >
          {currentMatrix.flat(Infinity).map((currentValue) => {
            if (currentValue == 1) {
              return <Box sx={{ background: "#b00" }}></Box>;
            } else {
              return <Box sx={{ background: "#0b0" }}></Box>;
            }
          })}
        </Box>
      </Box>
    </>
  );
}

export default Panel;
