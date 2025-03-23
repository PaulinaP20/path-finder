import { select } from "./setting.js";

class PathFinder {
    constructor(element) {

      const thisFinder=this;

      thisFinder.element=element;
      thisFinder.step=1;
      thisFinder.grid={};
      thisFinder.startPoint=null;
      thisFinder.endPoint=null;
      thisFinder.shortestPath=[];

      //create grid with information about each field
      for(let row=1;row<=10;row++){
        thisFinder.grid[row]={};
        for(let col=1; col<=10;col++){
          //when apliccation started all field are not selected
          thisFinder.grid[row][col]=false;
        }
      }

      //for the first time
      thisFinder.render();
      thisFinder.getElements();
    }

    render(){
      //determine that title and button content should be render
      const thisFinder=this;

      let pageData=null;

      switch(thisFinder.step){
      case 1:
        pageData={title: 'Draw routes', btnText:'Finish drawing'};
        break;
      case 2:
        pageData={title:'Pick start and finish', btnText:'Compute'};
        break;
      case 3:
        pageData={title:'The best route is', btnText:'Start again'};
        break;
      }

      //generate view from template and set it as page content
      thisFinder.element.querySelector('.finder-text h1').textContent = pageData.title;
      thisFinder.element.querySelector('.btn-warning').textContent = pageData.btnText;

      //generate 100 fields for grid
      const gridContainer = this.element.querySelector('.grid-container');
      gridContainer.innerHTML='';

      for(let i=0;i<100; i++){
        const gridItem=document.createElement('div');

        const row=Math.floor(i/10)+1;
        const col=(i%10)+1;

        gridItem.classList.add('grid-item');
        gridItem.setAttribute('data-id',i);
        gridItem.setAttribute('data-row', row);
        gridItem.setAttribute('data-col', col);

        if (thisFinder.grid[row][col]) {
          gridItem.classList.add(select.classNames.selected);
        }

        gridContainer.appendChild(gridItem);
      }

      thisFinder.initAction();
    }

    changeStep(newStep){
      const thisFinder=this;
      thisFinder.step=newStep;
      thisFinder.render();

    }

    getElements(){
      const thisFinder=this;

      thisFinder.submitButton=thisFinder.element.querySelector(select.submitButton);
      //console.log(thisFinder.submitButton)
      thisFinder.gridContainer=thisFinder.element.querySelector(select.gridContainer);
    }

    initAction(){

      const thisFinder=this;

      thisFinder.submitButton?.replaceWith(thisFinder.submitButton.cloneNode(true));
      thisFinder.gridContainer?.replaceWith(thisFinder.gridContainer.cloneNode(true));

      // Pobranie nowych referencji po zamianie
      thisFinder.getElements();

      if(thisFinder.step===1){
        //step 1: draw the route
        thisFinder.element.querySelector(select.submitButton).addEventListener('click', (e)=>{
          e.preventDefault();
          thisFinder.changeStep(2); //switch to step 2
        });

        thisFinder.element.querySelector(select.gridContainer).addEventListener('click', (e)=>{
          e.preventDefault();
          if(e.target.classList.contains('grid-item')){
            thisFinder.toggleField(e.target);
          }
        });
      }
      if (thisFinder.step===2){
        //step 2: pick start and finish

        thisFinder.element.querySelector(select.submitButton).addEventListener('click', (e)=> {
          e.preventDefault();
          if(thisFinder.startPoint && thisFinder.endPoint){
            thisFinder.changeStep(3);
            thisFinder.findShortestPath();
          } else {
            return;
          }
        });

        thisFinder.element.querySelector(select.gridContainer).addEventListener('click', (e)=>{
          e.preventDefault();
          if(e.target.classList.contains('grid-item')){
            thisFinder.selectStartandEnd(e.target);
          }
        });
      }

      if(thisFinder.step===3){
        // step3: compute the best routes
        thisFinder.element.querySelector(select.submitButton).addEventListener('click', (e)=>{
          e.preventDefault();
          thisFinder.changeStep(1);
          thisFinder.reset();

        });
      }
    }

    toggleField(gridItem){
      const thisFinder=this;

      //position of gridItem
      const row=parseInt(gridItem.getAttribute('data-row'));
      const col=parseInt(gridItem.getAttribute('data-col'));

      if(thisFinder.grid[row][col]){
        thisFinder.grid[row][col]=false;
        gridItem.classList.remove(select.classNames.selected);
      } else {

        //first click, allow selection
        if(thisFinder.step===1 && Object.values(thisFinder.grid).every(row=>Object.values(row).every(cell=>!cell))){
          thisFinder.grid[row][col]=true;
          gridItem.classList.add(select.classNames.selected);
        } else if(thisFinder.step===1){
          //next clicks
          const adjacent=thisFinder.checkAdjacent(row,col);
          if(adjacent){
            thisFinder.grid[row][col]=true;
            gridItem.classList.add('selected');
          } else {
            alert('This field is not adjacent to a selected field!! Choose the other one');
          }
        }
      }
    }

    checkAdjacent(row,col){
      const thisFinder=this;

      const directions= [
        [-1,0], //up
        [1,0],//down
        [0,-1],//left
        [0,1]//right
      ];

      for (const [dx,dy] of directions){
        const newRow=row+dx;
        const newCol=col+dy;

        if (newRow>=1 && newRow <=10 && newCol>=1 && newCol<=10 && thisFinder.grid[newRow][newCol]){
          return true; //if new clicked field is adjacent
        }
      }

      return false; //if new clicked is not adjacent
    }

    selectStartandEnd(gridItem){
      const thisFinder=this;

      if (!gridItem.classList.contains('grid-item')) return;

      const row = parseInt(gridItem.getAttribute('data-row'));
      const col = parseInt(gridItem.getAttribute('data-col'));

      if(!thisFinder.startPoint){
        thisFinder.startPoint={row,col};
        gridItem.classList.add(select.classNames.start); //mark start
      } else if (!thisFinder.endPoint){
        thisFinder.endPoint={row,col};
        gridItem.classList.add(select.classNames.end);
      }

    }

    findShortestPath() {
      const thisFinder = this;

      thisFinder.grid[thisFinder.startPoint.row][thisFinder.startPoint.col] = true;
      thisFinder.grid[thisFinder.endPoint.row][thisFinder.endPoint.col] = true;

      //console.log('Start:', thisFinder.startPoint);
      //console.log('End:', thisFinder.endPoint);
      //console.log('Grid:', thisFinder.grid);

      const queue = [{ row: thisFinder.startPoint.row, col: thisFinder.startPoint.col, path: [] }];
      const visited = new Set();
      visited.add(`${thisFinder.startPoint.row},${thisFinder.startPoint.col}`);

      const directions = [
        [-1, 0],  // góra
        [1, 0],   // dół
        [0, -1],  // lewo
        [0, 1]    // prawo
      ];

      while (queue.length > 0) {
        const { row, col, path } = queue.shift();
        const newPath = [...path, { row, col }];

        //console.log(`Checking row: ${row}, col: ${col}`);

        if (row === thisFinder.endPoint.row && col === thisFinder.endPoint.col) {
          //console.log('Path found!', newPath);
          thisFinder.shortestPath = newPath;
          thisFinder.markShortestPath();
          return;
        }

        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
          const key = `${newRow},${newCol}`;

          if (
            newRow >= 1 && newRow <= 10 &&
                  newCol >= 1 && newCol <= 10 &&
                  thisFinder.grid[newRow] && thisFinder.grid[newRow][newCol] === true && !visited.has(key)
          ) {
            //console.log(`Adding row: ${newRow}, col: ${newCol} to queue`);
            visited.add(key);
            queue.push({ row: newRow, col: newCol, path: newPath });
          }
        }
      }
      //console.log("No path found! Check if your path is continuous.");
      alert('No path found! Check if your path is continuous.');
    }

    markShortestPath() {
      const thisFinder = this;
      thisFinder.shortestPath.forEach(({ row, col }) => {
        const cell = thisFinder.element.querySelector(`.grid-item[data-row='${row}'][data-col='${col}']`);
        if (cell) {
          cell.classList.add(select.classNames.shortestPath);
        }
      });
    }

    reset() {
      const thisFinder = this;

      for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 10; col++) {
          thisFinder.grid[row][col] = false;
        }
      }

      thisFinder.startPoint = null;
      thisFinder.endPoint = null;
      thisFinder.shortestPath = [];


      const gridItems = thisFinder.element.querySelectorAll('.grid-item');
    gridItems.forEach((gridItem) => {
      gridItem.classList.remove(select.classNames.selected);
      gridItem.classList.remove(select.classNames.start);
      gridItem.classList.remove(select.classNames.end);
      gridItem.classList.remove(select.classNames.shortestPath);
    });

    //console.log(thisFinder.startPoint)
    //console.log(thisFinder.endPoint)
    //console.log(thisFinder.shortestPath)
    //console.log(thisFinder.grid)

    thisFinder.render();
    }
  }

  export default PathFinder;