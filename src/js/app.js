
const select = {
  allPages:'.page-section',
  homePage:'#/about',
  navButton:'.nav-btn',
  finderPage:'#finder',
  gridContainer:'.grid-container',
  submitButton:'.btn-warning',

  classNames: {
    noActivePage:'d-none',
    selected:'selected',
    start:'start',
    end:'end',
    shortestPath:'shortestPath'
  }
};


//change the pages
class Navigation {
  constructor(){
    this.sections=document.querySelectorAll(select.allPages);
    //console.log(this.sections);
  }
  showSection(sectionId){
    sectionId=sectionId.replace('#/','');

    //hide all section
    this.sections.forEach(section=>section.classList.add(select.classNames.noActivePage));

    //active page with id
    const activateSection=document.getElementById(sectionId);
    //console.log(activateSection);

    if(activateSection){
      activateSection.classList.remove(select.classNames.noActivePage);
    }
  }
}

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

      if (thisFinder.startPoint && thisFinder.startPoint.row === row && thisFinder.startPoint.col === col) {
        gridItem.classList.add(select.classNames.start);
      }

      if (thisFinder.endPoint && thisFinder.endPoint.row === row && thisFinder.endPoint.col === col) {
        gridItem.classList.add(select.classNames.end);
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

  initAction(){

    const thisFinder=this;

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
          console.log(e.target);
        }
      });
    }
    else if (thisFinder.step===2){
      //step 2: pick start and finish
      thisFinder.element.querySelector(select.submitButton).addEventListener('click', (e)=> {
        e.preventDefault();
        thisFinder.changeStep(3); //switch to step 3
      });

      thisFinder.element.querySelector(select.gridContainer).addEventListener('click', (e)=>{
        e.preventDefault();
        if(e.target.classList.contains('grid-item')){
          thisFinder.selectStartandEnd(e.target);
        }
      });
    }

    else if(thisFinder.step===3){
      // step3: compute the best routes
      thisFinder.element.querySelector(select.submitButton).addEventListener('click', (e)=>{
        e.preventDefault();
        thisFinder.reset();
        thisFinder.changeStep(1);
      });

      thisFinder.findShortestPath();
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
    console.log('start');

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
    if (!thisFinder.startPoint || !thisFinder.endPoint) {
        alert("Please select both a start and an end point.");
        return;
    }

    thisFinder.grid[thisFinder.startPoint.row][thisFinder.startPoint.col] = true;
    thisFinder.grid[thisFinder.endPoint.row][thisFinder.endPoint.col] = true;

    console.log("Start:", thisFinder.startPoint);
    console.log("End:", thisFinder.endPoint);
    console.log("Grid:", thisFinder.grid);

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

        console.log(`Checking row: ${row}, col: ${col}`);

        if (row === thisFinder.endPoint.row && col === thisFinder.endPoint.col) {
            console.log("Path found!", newPath);
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
                thisFinder.grid[newRow]?.[newCol] === true &&
                !visited.has(key)
            ) {
                console.log(`Adding row: ${newRow}, col: ${newCol} to queue`);
                visited.add(key);
                queue.push({ row: newRow, col: newCol, path: newPath });
            }
        }
    }

    console.log("No path found! Check if your path is continuous.");
    alert("No path found! Check if your path is continuous.");
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

  reset(){
    const thisFinder=this;

    thisFinder.startPoint=null;
    thisFinder.endPoint=null;

    for(let row in thisFinder.grid){
      for(let col in thisFinder.grid[row]){
        thisFinder.grid[row][col]=false;
      }
    }

    const griditems=document.querySelectorAll('.grid-item');
    griditems.forEach(item=>{
      item.classList.remove(select.classNames.start, select.classNames.end, select.classNames.selected);
    })

    thisFinder.step=1;

    thisFinder.render();

    console.log(thisFinder.step);
    console.log(thisFinder.grid);
    console.log(thisFinder.startPoint);
    console.log(thisFinder.endPoint);
  }

}

//main logic
const app = {
  navigation:null,

  pathFinder:null,

  initPages: function(){

    this.navigation=new Navigation();

    const hash=window.location.hash.replace('#/','') || select.homePage;

    this.navigation.showSection(hash);

    document.querySelectorAll(select.navButton).forEach(link=>{
      link.addEventListener('click', (event)=>this.handleNavClick(event));
    });

    window.addEventListener('hashchange', ()=>this.handleHashChange());

  },

  handleNavClick(event){
    event.preventDefault();
    const sectionId=event.target.getAttribute('data-section').replace('#/','');
    //console.log(sectionId);

    window.location.hash=`#/${sectionId}`;

    this.navigation.showSection(sectionId);
  },

  handleHashChange(){
    const hash = window.location.hash ? window.location.hash.replace('#/', '') : select.homePage.replace('#/', '');

    this.navigation.showSection(hash);
  },

  initPathFinder:function(){
    this.pathFinder=new PathFinder(document.querySelector(select.finderPage));
    //console.log(select.finderPage);
  },

  init() {

    app.initPages();

    app.initPathFinder();
  },

};

app.init();