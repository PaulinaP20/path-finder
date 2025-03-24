
class Navigation {
    constructor(){

        const thisNavigation=this;

        thisNavigation.sections=document.querySelectorAll(select.allPages);
    }

    showSection(sectionId){
        const thisNavigation=this;

        sectionId=sectionId.replace('#','');

        thisNavigation.sections.forEach(section=>section.classList.add(select.classNames.noActivePage));

        const activateSection=document.getElementById(sectionId);

        if(activateSection){
            activateSection.classList.remove(select.classNames.noActivePage);
        }
    }
}

const app = {

    navigation:null,

    pathFinder:null,

    initPages: function(){
        this.navigatio=new Navigation();

        const hash=window.location.hash.replace('#/','') || select.homePage;

        this.navigation.showSection(hash);

        document.querySelectorAll(select.navButton).forEach(button=>{
            button.addEventListener('click', (event)=>this.handleNavClick(event))
        })

        window.addEventListener('hashchange', ()=>this.handleHashChange());
    },

    handleNavClick(event){
        event.preventDefault()
        const sectionId=event.target.getAttribute('data-section').replace('#/','');

        window.location.hash=`#/${sectionId}`;

        this.navigation.showSection(sectionId);
    },

    handleHashChange(){
        const hash=window.location.hash ? window.location.hash.replace('#/',''):select.homePage.replace('#/','');

        this.navigation.showSection(hash);
    }


}