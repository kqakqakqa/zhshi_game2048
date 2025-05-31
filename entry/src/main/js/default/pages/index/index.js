import app from '@system.app';
import storage from '@system.storage';
import router from '@system.router';

export default {
  data: {
    showLeftSideSwipe: false,
    showTopSideSwipe:false,
    leftSideSwipeTimeout:undefined,
    topSideSwipeTimeout: undefined,
    grid: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    score: 0,
    highScore: 0,
    getCellBgColor(n) {
      return {
        "0":"#ccc0b4",
        "2":"#eee4da",
        "4":"#ede0c8",
        "8":"#f2b179",
        "16":"#f59563",
        "32":"#f67c5f",
        "64":"#f65e3b",
        "128":"#edcf72",
        "256":"#edcc61",
        "512":"#edc850",
        "1024":"#edc53f",
        "2048":"#edc22e",
        "4096":"#edbf1d",
        "8192":"#edbc0c",
        "16384":"#edb900",
        "32768":"#edb600",
        "65536":"#edb300",
        "131072":"#edb000",
      }[n];
    },
    getCellColor(n){
      return (n>4)?"#f9f6f2":"#776e65";
    },
    getCellFontSize(n){
      if(n<16) return "30px";
      if(n<128) return "30px;"
      if(n<1024) return "26px;"
      if(n<16384) return "26px;"
      return "22px;"
    },
    newGrid(){
      let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      grid = this.addCellNumber(grid);
      grid = this.addCellNumber(grid);
      return grid;
    },
    addCellNumber(grid){
      if(this.isGridFull(grid)) return grid;
      let idx = Math.floor(Math.random() * 16);
      while(1) {
        for(let i in grid){
          for(let j in grid[i]){
            if(grid[i][j]===0) idx -= 1;
            if(idx < 0) {
              grid[i][j] = Math.random() < 0.9 ? 2 : 4;
              return grid;
            }
          }
        }
      }
    },
    isGridFull(grid){
      for(let i in grid){
        for(let j in grid[i]){
          if(grid[i][j]===0) return false;
        }
      }
      return true;
    },
    moveGrid(grid, direction) {
      const newGrid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

      let mergeCount = 0;
      for (let i = 0; i < 4; i++) {
        const isRow = (direction === 'left' || direction === 'right');
        const isReverse = (direction === 'down' || direction === 'right');

        // 根据方向提取一行或一列
        let line = [];
        if (isRow) {
          line = grid[i];
        } else {
          for (let j = 0; j < 4; j++) line.push(grid[j][i]);
        }
        line = line.filter(val => val !== 0);

        if(isReverse) line.reverse();

        // 处理合并
        let newLine = [];
        while (line.length) {
          if (line[1] && line[0] === line[1]) {
            line.shift();
            line[0] *= 2;
            mergeCount += line[0];
          }
          newLine.push(line.shift());
        }

        // 填充空白
        while (newLine.length < 4) newLine.push(0);

        if (isReverse) newLine.reverse();

        // 更新到新格子
        for (let j = 0; j < 4; j++) {
          if (isRow) {
            newGrid[i][j] = newLine[j];
          } else {
            newGrid[j][i] = newLine[j];
          }
        }
      }

      return {
        grid: newGrid,
        mergeCount: mergeCount
      };
    },
    saveProgress(){
      storage.set({
        key: "grid",
        value: JSON.stringify(this.grid)
      });
      storage.set({
        key: "score",
        value: JSON.stringify(this.score)
      });
      storage.set({
        key: "highScore",
        value: JSON.stringify(this.highScore)
      });
    }
  },
  onInit() {
    storage.get({
      key: "grid",
      default: JSON.stringify(this.newGrid()),
      success: str => { this.grid = JSON.parse(str) }
    });
    storage.get({
      key: "score",
      default: "0",
      success: str => { this.score = JSON.parse(str) }
    });
    storage.get({
      key: "highScore",
      default: "0",
      success: str => { this.highScore = JSON.parse(str) }
    });
  },
  onLeftSideSwipe(e) {
    if (e.direction === "right"){
      if(this.showLeftSideSwipe){
        app.terminate();
      } else{
        this.showLeftSideSwipe = true;
        this.leftSideSwipeTimeout = setTimeout(()=>{
          this.showLeftSideSwipe = false;
        },1200);
      }
    }
  },
  onTopSideSwipe(e){
    if (e.direction === "down"){
      if(this.showTopSideSwipe){
        // if (this.sideSwipeTimeout) clearTimeout(this.sideSwipeTimeout);
        router.replace({uri: "/pages/about/about"});
      } else{
        this.showTopSideSwipe = true;
        this.topSideSwipeTimeout = setTimeout(()=>{
          this.showTopSideSwipe = false;
        },1200);
      }
    }
  },
  onGridSwipe(e){
    let { grid, mergeCount } = this.moveGrid(this.grid,e.direction);
    if(JSON.stringify(grid)!==JSON.stringify(this.grid)){
      grid = this.addCellNumber(grid);
      this.grid = grid;
      this.score += mergeCount;
    }
    this.saveProgress();
  },
  onReplaySwipe(e){
    if (e.direction === "right") {
      this.highScore = Math.max(this.highScore, this.score);
      this.score = 0;
      this.grid = this.newGrid();
      this.saveProgress();
    }
  },
}