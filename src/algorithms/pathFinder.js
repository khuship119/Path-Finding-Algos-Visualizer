// @flow

import { BOARD_ROW, BOARD_COL, ITEM_SHORTEST } from 'constants.js';

export type ConstructorType = {
  begin: {| x: number, y: number |},
  end: {| x: number, y: number |},
  updateItem: (number, number, string, ?number) => void,
  board: Array<Array<string>>,
};

export default class PathFinder {

  begin: {| x: number, y: number |};
  end: {| x: number, y: number |};
  updateItem: (number, number, string, ?number) => void;
  board: Array<Array<string>>;

  dist: Array<Array<number>>;
  prev: Array<Array<{| x: number, y: number |}>>;
  
  static dx : Array<number>;
  static dy : Array<number>;
  static timers : Array<number>;

  constructor({ begin, end, updateItem, board } : ConstructorType){
    this.begin = begin;
    this.end = end;
    this.updateItem = updateItem;
    this._init();
    this.board = board;
  }

  static dx = [-1,1,0,0];
  static dy = [0,0,-1,1];
  static timers = [];

  _init = () => {
    this.dist = new Array(BOARD_ROW);
    this.prev = new Array(BOARD_ROW);
    for(let i=0; i<BOARD_ROW; i++) {
      this.dist[i] = [];
      this.prev[i] = [];
      for(let j=0; j<BOARD_COL; j++) {
        this.dist[i][j] = Infinity;
        this.prev[i][j] = { x: -1, y: -1 };
      }
    }
    this.dist[this.begin.x][this.begin.y] = 0;
  }

  clearTimers() {
    PathFinder.timers.forEach((timer : TimeoutID) => { clearTimeout(timer); });
    PathFinder.timers = [];
  }

  paintShortestPath = () => {
    const { begin, end, prev, updateItem } = this;

    const path : Array<{| x: number, y: number |}> = [];
    let x : number = end.x;
    let y : number = end.y;

    while(prev[x][y].x !== -1 && prev[x][y].y !== -1) {
      path.push({ x, y });
      const tempX = x, tempY = y;
      x = prev[tempX][tempY].x;
      y = prev[tempX][tempY].y;
    }
    path.push({ x: begin.x, y: begin.y });

    for(let i=path.length-1; i>=0; i--) {
      x = path[i].x;
      y = path[i].y;
      updateItem(x, y, ITEM_SHORTEST, path.length-i);
    }
  }
}