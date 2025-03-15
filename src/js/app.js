class SectionManager {
  constructor(){
    this.sections=document.querySelectorAll('.page-section');
  }

  hideAllSections(){
    this.sections.forEach(section=> {
      section.classList.add('d-none');
    });
  }

  showSection(sectionId){
    this.hideAllSections();

    const activateSection=document.getElementById(sectionId);

    if(activateSection){
      activateSection.classList.remove('d-none');
    }
  }
}

class App {
  constructor(){
    this.sectionManager=new SectionManager();
    this.grid=new InteractiveGrid(document.querySelector('.grid-container'), 10, 10);

    this.init();
  }

  showSectionFromHash(){
    const hash=window.location.hash.replace('#/', '') || 'about';
    this.sectionManager.showSection(hash);
  }

  setupEventListener(){
    document.querySelectorAll('.nav-btn').forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
  }

  handleNavClick(event){
    event.preventDefault();
    const sectionId=event.target.getAttribute('data-section');

    window.location.hash=`#/${sectionId}`;

    this.sectionManager.showSection(sectionId);
  }

  init(){
    this.showSectionFromHash();
    this.setupEventListener();
    window.addEventListener('hashchange', this.showSectionFromHash.bind(this));
  }

}

class InteractiveGrid {
  constructor(element, rows, cols){
    this.element=element;
    this.rows=rows;
    this.cols=cols;
    this.gridItems=[];
    this.selectedCells=new Set();
    this.createGrid();

  }

  createGrid(){
    const totalCells=this.rows*this.cols;
    console.log(this.element);

    for(let i=0; i<totalCells; i++){
      const gridItem=document.createElement('div');
      console.log(gridItem);

      gridItem.classList.add('grid-item');
      gridItem.setAttribute('data-id', i);
      this.element.appendChild(gridItem);
      this.gridItems.push(gridItem);

      console.log(this.element);
    }

    this.element.style.display='grid';
    this.element.style.gridTemplateColumns=`repeat(${this.cols}, 45px)`;

    this.handleClick();
  }

  handleClick(){
    this.gridItems.forEach(gridItem=> {
      gridItem.addEventListener('click', () => this.toggleCellSelection(gridItem));
    });
  }

  toggleCellSelection(gridItem){
    const id=gridItem.getAttribute('data-id');
    //console.log(id);

    if(this.selectedCells.has(id)){
      this.selectedCells.delete(id);
      gridItem.classList.remove('selected');
    } else {
      this.selectedCells.add(id);
      gridItem.classList.add('selected');
    }

  }
}

new App();
