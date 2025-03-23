import { select } from "./setting.js";

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

  export default Navigation