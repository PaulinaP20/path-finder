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

new App();
