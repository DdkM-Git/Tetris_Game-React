import CoordinatesType from "../types/CoordinatesType";
import Figure from "./figures/Figure";
import FigureCoordinatesType from "../types/FigureCoordinatesType";
import LeftPipeFigure from "./figures/LeftPipeFigure";
import LeftPointedFigure from "./figures/LeftPointedFigure";
import LeftSnakeFigure from "./figures/LeftSnakeFigure";
import RectangleFigure from "./figures/RectangleFigure";
import RightPipeFigure from "./figures/RightPipeFigure";
import RightPointedFigure from "./figures/RightPointedFigure";
import RightSnakeFigure from "./figures/RightSnakeFigure";
import SquareFigure from "./figures/SquareFigure";
import getRandomInt from "../utils/getRandomInt";

class Board {
  _rows = 16;
  _columns = 10;
  _figures = new Array<Figure>();
  _isGameOver = false;
  _score = 0;

  moveDownFigure(): Board {
    const allFigures = this._figures;
    if (allFigures.length === 0) {
      this.addFigure(this.getRandomFigure([-1, 3]));
    } else {
      if (allFigures[allFigures.length - 1]._coordinates.length > 0) {
        const tmpFigure = allFigures[allFigures.length - 1].createClone().moveDown();
        if (this.checkVerticalMove(tmpFigure)) {
          allFigures[allFigures.length - 1].moveDown();
        } else {
          const scoreRows = this.checkScoringAPoint();
          if (scoreRows.length > 0) {
            this.makeAPoint(scoreRows);
          } else {
            this.addFigure(this.getRandomFigure([-1, 3]));
          }
        }
      } else {
        this.addFigure(this.getRandomFigure([-1, 3]));
      }
    }
    return this;
  }

  moveLeftFigure(): Board {
    const allFigures = this._figures;
    if (allFigures.length !== 0) {
      const tmpFigure = allFigures[allFigures.length - 1].createClone().moveLeft();
      if (this.checkHorizontalMove(tmpFigure)) {
        allFigures[allFigures.length - 1].moveLeft();
      }
    }
    return this;
  }

  moveRightFigure(): Board {
    const allFigures = this._figures;
    if (allFigures.length !== 0) {
      const tmpFigure = allFigures[allFigures.length - 1].createClone().moveRight();

      if (this.checkHorizontalMove(tmpFigure)) {
        allFigures[allFigures.length - 1].moveRight();
      }
    }
    return this;
  }

  rotateLeftFigure(): Board {
    const allFigures = this._figures;
    if (allFigures.length !== 0) {
      const tmpFigure = allFigures[allFigures.length - 1].createClone().rotateLeft();

      if (this.checkHorizontalMove(tmpFigure) && this.checkVerticalMove(tmpFigure)) {
        allFigures[allFigures.length - 1] = allFigures[allFigures.length - 1].createClone().rotateLeft();
      }
    }
    return this;
  }

  rotateRightFigure(): Board {
    const allFigures = this._figures;
    if (allFigures.length !== 0) {
      const tmpFigure = allFigures[allFigures.length - 1].createClone().rotateRight();

      if (this.checkHorizontalMove(tmpFigure) && this.checkVerticalMove(tmpFigure)) {
        allFigures[allFigures.length - 1] = allFigures[allFigures.length - 1].createClone().rotateRight();
      }
    }
    return this;
  }

  private addFigure(newFigure: Figure): Board {
    if (this.checkVerticalMove(newFigure)) {
      this._figures.push(newFigure);
    } else {
      this.setGameOver();
    }
    return this;
  }

  private checkVerticalMove(figureToCheck: Figure): boolean {
    const lowestCoordinates = figureToCheck.getLowestCoordinates();
    const allFigures = this._figures;

    let allCoordinates = new Array<CoordinatesType>();
    for (let i = 0; i < allFigures.length - 1; i++) {
      allCoordinates = allCoordinates.concat(allFigures[i]._coordinates);
    }

    if (allCoordinates.length === 0) {
      return lowestCoordinates.every((lco) => lco[0] < this._rows);
    } else {
      return allCoordinates.every((co) => lowestCoordinates.every((lco) => !(co[0] === lco[0] && co[1] === lco[1]) && lco[0] < this._rows));
    }
  }

  private checkHorizontalMove(figureToCheck: Figure): boolean {
    const lowestCoordinates = figureToCheck._coordinates;
    const allFigures = this._figures;

    let allCoordinates = new Array<CoordinatesType>();
    for (let i = 0; i < allFigures.length - 1; i++) {
      allCoordinates = allCoordinates.concat(allFigures[i]._coordinates);
    }

    if (allCoordinates.length === 0) {
      return lowestCoordinates.every((lco) => lco[1] !== -1 && lco[1] < this._columns);
    } else {
      return allCoordinates.every((co) => lowestCoordinates.every((lco) => !(co[0] === lco[0] && co[1] === lco[1]) && lco[1] !== -1 && lco[1] < this._columns));
    }
  }

  private checkScoringAPoint(): number[] {
    const allFigures = Array.from(this._figures);
    let rowsToRemove: number[] = [];

    let allRows: any[] = [];
    for (let i = 0; i < allFigures.length; i++) {
      allFigures[i]._coordinates.forEach((coor) => {
        allRows = allRows.concat(coor[0]);
      });
    }

    for (let i = 0; i < this._rows; i++) {
      const aaa = allRows.filter((bbb) => bbb === i);
      if (aaa.length === this._columns) {
        rowsToRemove.push(i);
      }
    }

    return rowsToRemove;
  }

  private makeAPoint(rowsToRemove: number[]): Board {
    const allFigures = Array.from(this._figures);
    this._score = this._score + rowsToRemove.length;

    for (let i = 0; i < allFigures.length; i++) {
      for (let j = 0; j < rowsToRemove.length; j++) {
        let www = allFigures[i]._coordinates.filter((coor) => coor[0] !== rowsToRemove[j]);
        www = www.map((coor) => {
          if (coor[0] <= rowsToRemove[j]) {
            return [coor[0] + 1, coor[1]];
          } else {
            return [coor[0], coor[1]];
          }
        });
        allFigures[i]._coordinates = www as FigureCoordinatesType;
      }
    }
    this._figures = allFigures;

    return this;
  }

  private getRandomFigure(startCoordinates: CoordinatesType): Figure {
    switch (getRandomInt(8)) {
      case 0:
        return new SquareFigure(startCoordinates);
      case 1:
        return new RectangleFigure(startCoordinates);
      case 2:
        return new LeftPipeFigure(startCoordinates);
      case 3:
        return new RightPipeFigure(startCoordinates);
      case 4:
        return new LeftSnakeFigure(startCoordinates);
      case 5:
        return new RightSnakeFigure(startCoordinates);
      case 6:
        return new LeftPointedFigure(startCoordinates);
      case 7:
        return new RightPointedFigure(startCoordinates);
      default:
        return this.getRandomFigure(startCoordinates);
    }
  }

  getMatrix(): number[][] {
    let tmpMatrix = new Array<number[]>();

    for (let i = 0; i < this._rows; i++) {
      let tmpArray = new Array<number>();

      for (let j = 0; j < this._columns; j++) {
        if (this._figures.some((fig) => fig._coordinates.some((co) => co[0] === i && co[1] === j))) {
          tmpArray.push(1);
        } else {
          tmpArray.push(0);
        }
      }

      tmpMatrix.push(tmpArray);
    }

    return tmpMatrix;
  }

  private setGameOver() {
    this._isGameOver = true;
  }

  reset() {
    this._rows = 16;
    this._columns = 10;
    this._figures = new Array<Figure>();
    this._isGameOver = false;
    this._score = 0;
  }
}

export default Board;
