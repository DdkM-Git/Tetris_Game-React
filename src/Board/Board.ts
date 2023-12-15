import CoordinatesType from "../figures/CoordinatesType";
import Figure from "../figures/Figure";
import FigureCoordinatesType from "../figures/FigureCoordinatesType";
import LeftPipeFigure from "../figures/LeftPipeFigure";
import RectangleFigure from "../figures/RectangleFigure";
import RightPipeFigure from "../figures/RightPipeFigure";
import SquareFigure from "../figures/SquareFigure";
import getRandomInt from "../utils/getRandomInt";

class Board {
  _rows = 16;
  _columns = 10;
  //_matrix = new Array<number[]>();
  _figures = new Array<Figure>();
  _error = false;

  moveFigure(): Board {
    if (this._figures.length === 0) {
      const newFigure = this.getRandomFigure([0, 3]);
      !!newFigure && this.addFigure(newFigure);
    } else {
      let tmpFigure = this._figures[this._figures.length - 1];
      tmpFigure._coordinates = tmpFigure._coordinates.map((co) => {
        return [co[0] + 1, co[1]];
      }) as FigureCoordinatesType;

      if (this.checkMove(tmpFigure)) {
        this._figures[this._figures.length - 1]._coordinates = tmpFigure._coordinates;
      } else {
        const newFigure = this.getRandomFigure([0, 4]);
        if (newFigure) {
          this.addFigure(newFigure);
        } else this.setError();
      }
    }
    return this;
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

  private addFigure(newFigure: Figure): Board {
    if (this.checkMove(newFigure)) {
      this._figures.push(newFigure);
    } else {
      this.setError();
    }
    return this;
  }

  private checkMove(figureToCheck: Figure): boolean {
    const lowestCoordinates = figureToCheck.getLowestCoordinates();
    let allCoordinates = new Array<CoordinatesType>();
    console.log("lowestCoordinates", lowestCoordinates);

    console.log("asd", this._figures.length);
    for (let i = 0; i < this._figures.length - 1; i++) {
      console.log("i", i);
      console.log("this._figures[i]._coordinates", this._figures[i]._coordinates);
      console.log("allCoordinates", allCoordinates);
      console.log("_coordinates", this._figures[i]._coordinates);
      allCoordinates = allCoordinates.concat(this._figures[i]._coordinates);
    }

    console.log("allCoordinates", allCoordinates);
    console.log("lowestCoordinates", lowestCoordinates);
    lowestCoordinates.forEach((lco) => {
      console.log("asdasdasdasdasdasdasdasdasd");
      console.log("lco[0]", lco[0]);
      console.log("lco[1]", lco[1]);
    });


    if (allCoordinates.length === 0) {
      return lowestCoordinates.every((lco) => {
        return lco[0] !== 15;
      });
    }
    else {
      return allCoordinates.every((co) => {
        return lowestCoordinates.every((lco) => {
          return co[0] !== lco[0] && co[1] !== lco[1] && lco[0] !== 15;
        });
      });
    }
  }

  private getRandomFigure(startCoordinates: CoordinatesType): Figure | undefined {
    //return new SquareFigure(startCoordinates);
    switch (getRandomInt(4)) {
      case 0:
        return new SquareFigure(startCoordinates);
      case 1:
        return new RectangleFigure(startCoordinates);
      case 2:
        return new LeftPipeFigure(startCoordinates);
      case 3:
        return new RightPipeFigure(startCoordinates);
      default:
        return undefined;
    }
  }

  /*setError(coordinates: CoordinatesType) {*/
  private setError() {
    this._error = true;
    //this._matrix[coordinates[0]][coordinates[1]] = -1;
  }
}

export default Board;
