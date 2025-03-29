import { select } from './setting.js';

class PathFinder {
  constructor(element) {

    const thisFinder=this;

    thisFinder.element=element;
    thisFinder.step=1;
    thisFinder.grid={};
    thisFinder.startPoint=null;
    thisFinder.endPoint=null;
    thisFinder.shortestPath=[];
    thisFinder.highlightedCells=[];

    thisFinder.directions = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1]   // right
    ];

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
    const gridContainer = thisFinder.element.querySelector('.grid-container');
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

    if (newStep === 2) {
      thisFinder.getElements();
      thisFinder.gridItems.forEach(cell => {
        cell.classList.remove(select.classNames.highlighted);
      });
    }
  }

  getElements(){
    const thisFinder=this;

    thisFinder.submitButton=thisFinder.element.querySelector(select.submitButton);
    //console.log(thisFinder.submitButton)
    thisFinder.gridContainer=thisFinder.element.querySelector(select.gridContainer);

    thisFinder.gridItems=thisFinder.element.querySelectorAll(select.gridItem);
  }

  initAction(){

    const thisFinder=this;

    if (thisFinder.submitButton) {
      thisFinder.submitButton.replaceWith(thisFinder.submitButton.cloneNode(true));
    }

    if (thisFinder.gridContainer) {
      thisFinder.gridContainer.replaceWith(thisFinder.gridContainer.cloneNode(true));
    }

    // get new references after change
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
        if(e.target.classList.contains(select.classNames.gridItem)){
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

    thisFinder.element.querySelector(select.gridContainer).addEventListener('mouseover', (e) => {
      if (e.target.classList.contains(select.classNames.gridItem)) {
        thisFinder.highlightAvailableMoves();
      }});
  }

  toggleField(gridItem){
    const thisFinder=this;

    //position of gridItem
    const row=parseInt(gridItem.getAttribute('data-row'));
    const col=parseInt(gridItem.getAttribute('data-col'));

    if(thisFinder.grid[row][col]){
      thisFinder.grid[row][col]=false;
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

  highlightAvailableMoves(){
    const thisFinder=this;

    if (thisFinder.step === 2 || thisFinder.step===3) return;

    thisFinder.gridItems.forEach(cell=>{
      const row=parseInt(cell.getAttribute('data-row'));
      const col=parseInt(cell.getAttribute('data-col'));

      if(!thisFinder.grid[row][col] && thisFinder.checkAdjacent(row,col)){
        cell.classList.add(select.classNames.highlighted);
      } else {
        cell.classList.remove(select.classNames.highlighted);
      }
    });
  }

  checkAdjacent(row,col){
    const thisFinder=this;

    for (const [dx,dy] of thisFinder.directions){
      const newRow=row+dx;
      const newCol=col+dy;
      //console.log(newRow,newCol)
      if (newRow>=1 && newRow <=10 && newCol>=1 && newCol<=10 && thisFinder.grid[newRow][newCol]){
        return true;
      }
    }
    return false;
    //if new clicked is not adjacent
  }

  selectStartandEnd(gridItem){
    const thisFinder=this;

    if (!gridItem.classList.contains('grid-item')) return;

    const row = parseInt(gridItem.getAttribute('data-row'));
    const col = parseInt(gridItem.getAttribute('data-col'));

    if(!thisFinder.startPoint){
      thisFinder.startPoint={row,col};
      gridItem.classList.add(select.classNames.start);
    } else if (!thisFinder.endPoint){
      thisFinder.endPoint={row,col};
      gridItem.classList.add(select.classNames.end);
    }

  }

  findShortestPath() {
    const thisFinder = this;

    thisFinder.grid[thisFinder.startPoint.row][thisFinder.startPoint.col] = true;
    thisFinder.grid[thisFinder.endPoint.row][thisFinder.endPoint.col] = true;

    const queue = [{ row: thisFinder.startPoint.row, col: thisFinder.startPoint.col, path: [] }];
    const visited = new Set();
    visited.add(`${thisFinder.startPoint.row},${thisFinder.startPoint.col}`);

    while (queue.length > 0) {
      const { row, col, path } = queue.shift();
      const newPath = [...path, { row, col }];

      //console.log(`Checking row: ${row}, col: ${col}`);

      for (const [dx, dy] of thisFinder.directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        const key = `${newRow},${newCol}`;

        if (
          newRow >= 1 && newRow <= 10 &&
                  newCol >= 1 && newCol <= 10 &&
                  thisFinder.grid[newRow] && thisFinder.grid[newRow][newCol] === true && !visited.has(key)
        ) {
          visited.add(key);
          queue.push({ row: newRow, col: newCol, path: newPath });
        }
      }

      if (row === thisFinder.endPoint.row && col === thisFinder.endPoint.col) {
        //console.log('Path found!', newPath);
        thisFinder.shortestPath = newPath;
        thisFinder.markShortestPath();
        thisFinder.showSummary();
        return;
      }
    }
    alert('No path found! Check if your path is continuous and try again.');
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

  showSummary(){
    const thisFinder=this;

    if (document.getElementById('summaryModal')) {
      return;
    }

    const fullRouteCount = Object.values(thisFinder.grid)
      .map(row => Object.values(row))
      .flat()
      .filter(Boolean)
      .length;

    const shortestRouteCount=thisFinder.shortestPath.length;

    const summaryData= {
      full:fullRouteCount,
      shortest:shortestRouteCount,
    };

    const source=document.getElementById('summary-template').innerHTML;
    const template=Handlebars.compile(source);
    const generatedHTML=template(summaryData);

    document.body.insertAdjacentHTML('beforeend', generatedHTML);

    document.getElementById('summaryModal').style.display='flex';

    document.getElementById('closeModal').addEventListener('click', function(){
      document.getElementById('summaryModal').remove();
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

    const modal = document.getElementById('summaryModal');
    if (modal) {
      modal.remove();
    }

    thisFinder.render();
  }
}

export default PathFinder;