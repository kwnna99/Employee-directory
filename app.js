let userList=document.querySelector('.user-list');
let usermodal= document.querySelector('.modal-body');
let modal=document.querySelector('.modal');
let clickedUser;
let employees=[];
let current=[];
let userEmail;

let previousButton=document.querySelector('.previous');
let nextButton=document.querySelector('.next');

async function getProfiles(){
    const response = await fetch('https://randomuser.me/api/?results=12');
    const responsejson = await response.json();
    const profiles = responsejson.results;
    return Promise.all(profiles);
}

function createAndAppendChild(item,itemType,parent,itemClass=null){
    let child=document.createElement(itemType);
    child.innerHTML=item;
    if(itemClass!=null){
      child.className=itemClass;
    }
    parent.appendChild(child);
    return child;
  }

function createAndDisplayCards(data){
    current=data;
    let itemHTML='';
    if(data.length===0){
        itemHTML='<span>No results.</span>';
        createAndAppendChild(itemHTML,'p',userList,'item');
    }
    data.forEach(user => {
      itemHTML=`<div class='card user-item'><img class="avatar" src="${user.picture.medium}" alt="A picture of ${user.name.first} ${user.name.last}"><div class="user-details">
      <h3>${user.name.first} ${user.name.last}</h3><p class="detail email">${user.email}</p><p class="detail">${user.location.city}, ${user.location.state}, ${user.location.country}</p>
    </div></div>`;  
    createAndAppendChild(itemHTML,'li',userList,'item');
    });
    eventListenersForcards();
}

function updateModal(results){
    cell=results.cell.replace(/[^0-9.]/g, '');
    usermodal.innerHTML=`<img class="avatar" src="${results.picture.large}" alt="A picture of ${results.name.first} ${results.name.last}"><div class="user-details">
    <h3>${results.name.first} ${results.name.last}</h3><p class="detail email">${results.email}</p><p class="detail city">${results.location.city}</p>
    <p class="detail cell">${(cell.length>=10)?cell.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"):cell.replace(/(\d{3})(\d{4})(\d{1})/, "$1-$2-$3")}</p>
    <p class='detail'>${results.location.street.number} ${results.location.street.name},${results.location.city}, ${results.location.state}, ${results.location.postcode}</p>
  </div>`;
  modal.classList.add('opened');
}

function eventListenersForcards(){
    let profileElements=document.querySelectorAll('.user-list .user-item');
    let parent;
    let result;
    let cell;
    profileElements.forEach((element)=>{
        element.addEventListener('click',(e)=>{
            parent=e.target.closest('.user-list .user-item');
            userEmail=parent.querySelector('.email').textContent;
            result = employees.filter(employee => employee.email === userEmail)[0];
            updateModal(result);
        });
    });
}


document.querySelector('.btn-close').addEventListener('click',(e)=>{
    modal.classList.remove('opened');
    usermodal.innerHTML='';
});

modal.addEventListener('click',(e)=>{
    if(e.target.classList.contains('opened')){
        modal.classList.remove('opened');
        usermodal.innerHTML='';
    }
});

function addSearchBar(){
    const searchBar=createAndAppendChild(`
    <input id="search" placeholder="Search by name...">
    <button type="button"><img src="img/icn-search.svg" alt="Search icon"></button>`,'label',document.querySelector('.searchbar'),'employee-search');
    const searchInput=document.querySelector('.employee-search');
    searchBar.htmlFor='search';
    searchInput.addEventListener('keyup',(e)=>{
      handleSearch(e.target.value, employees);
    });
  }

function handleSearch(input,list){
    let matches=[];
    var re = new RegExp(input,'i');
    for(let i=0; i<list.length; i++){
      if(re.test(list[i]['name']['first']) || re.test(list[i]['name']['last']) || re.test(list[i]['name']['first']+" "+list[i]['name']['last']) ){
        matches.push(list[i]);
      }
    }
    userList.innerHTML='';
    createAndDisplayCards(matches);
  }
  
previousButton.addEventListener('click',(e)=>{
    let index=0;
    for(let i=0; i<current.length; i++){
        if(current[i].email===userEmail){
            index=i;
            break;
        }
    }
    if(index>0){
        updateModal(current[index-1]);
        userEmail=current[index-1].email;
    }   
});


nextButton.addEventListener('click',(e)=>{
    let index=0;
    for(let i=0; i<current.length; i++){
        if(current[i].email===userEmail){
            index=i;
            break;
        }
    }
    if(index<(current.length-1)){
        updateModal(current[index+1]);
        userEmail=current[index+1].email;
    } 
});
getProfiles().then((data)=> employees=data).then(createAndDisplayCards).then(addSearchBar);