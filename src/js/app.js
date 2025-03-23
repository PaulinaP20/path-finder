import PathFinder from "./PathFinder.js";
import Navigation from "./Navigation.js";
import { select } from "./setting.js";

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