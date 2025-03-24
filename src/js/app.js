import PathFinder from "./PathFinder.js";
import { select } from "./setting.js";

const app = {

  initPages: function(){

    const thisApp=this;

        //wszystkie strony
    thisApp.sections=document.querySelectorAll(select.allPages);
    //console.log(thisApp.sections);

      //wszystkie btn
    thisApp.allButton=document.querySelectorAll(select.navButton)

    const idFromHash=window.location.hash.replace('#/','');

    //console.log(idFromHash)

    let pageMatchingHash=thisApp.sections[0].id;

    //console.log(pageMatchingHash);


    for(let section of thisApp.sections){
      if(section.id===idFromHash){
          pageMatchingHash=section.id;
          break
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let button of thisApp.allButton){
      button.addEventListener('click', function(event){
          const clickedElement=this;
          event.preventDefault();

          const id=clickedElement.getAttribute('href').replace('#','');

          thisApp.activatePage(id);

          window.location.hash='#/'+id;
      })
    }

    window.addEventListener('hashchange', function(){
      thisApp.initPages();
    })
  },

  activatePage:function(sectionId){
    const thisApp=this;

    for(let section of thisApp.sections){
      section.classList.toggle(select.classNames.noActivePage, section.id!==sectionId);
    }

  },

  initPathFinder:function(){
    this.pathFinder=new PathFinder(document.querySelector(select.finderPage));
  },

  init() {

    app.initPages();

    app.initPathFinder();
  },

};

app.init();