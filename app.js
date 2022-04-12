let userList=document.querySelector('.user-list');
let usermodal= document.querySelector('.modal-body');
let modal=document.querySelector('.modal');
let clickedUser;
let employees=[];
let current=[];
let userEmail;
let previousButton=document.querySelector('.previous');
let nextButton=document.querySelector('.next');
const searchInput=document.querySelector('.employee-search');


/**
 * Asynchronous function that fetches data from the random user api
 * @returns a promise
 */
async function getProfiles(){
    const response = await fetch('https://randomuser.me/api/?results=12');
    const responsejson = await response.json();
    const profiles = responsejson.results;
    return Promise.all(profiles);
}

/**
 * Generic function to create and append a child element to a specified parent
 * @param {Element} item 
 * @param {string} itemType 
 * @param {Element} parent 
 * @param {string} itemClass optional, the classes to add to the new item
 * @returns the created element
 */
function createAndAppendChild(item,itemType,parent,itemClass=null){
    let child=document.createElement(itemType);
    child.innerHTML=item;
    if(itemClass!=null){
      child.className=itemClass;
    }
    parent.appendChild(child);
    return child;
  }

  /**
   * The function that creates and appends the available user cards to the user list. It also adds on click event listeners to the cards
   * @param {Array} data (an array of th available users)
   */
function createAndDisplayCards(data){
    current=data;
    let itemHTML='';
    let userCard;
    let result;

    if(data.length===0){
        itemHTML='<span>No results.</span>';
        createAndAppendChild(itemHTML,'p',userList,'item');
    }
    data.forEach(user => {
        itemHTML=`<div class='card user-item'><img class="avatar" src="${user.picture.medium}" alt="A picture of ${user.name.first} ${user.name.last}"><div class="user-details">
        <h3>${user.name.first} ${user.name.last}</h3><p class="detail email">${user.email}</p><p class="detail">${user.location.city}, ${user.location.state}, ${user.location.country}</p>
        </div></div>`;  
        userCard=createAndAppendChild(itemHTML,'li',userList,'item');
        //the email is a unique identifier so we identify the user clicked via the email shown in the card
        userCard.addEventListener('click',(e)=>{
            parent=e.target.closest('.user-list .user-item');
            userEmail=parent.querySelector('.email').textContent;
            result = employees.filter(employee => employee.email === userEmail)[0];
            updateModal(result);
        });
    });
}

/**
 * A function that creates the modal/popup window's content (depending on the user clicked)
 * @param {object} results 
 */

function updateModal(results){
    let dateOfBirth=new Date(results.dob.date);
    dateOfBirth=dateOfBirth.toJSON().slice(0,10).replace(/(\d{4})-(\d{2})-(\d{2})/,"$2/$3/$1")
    cell=results.cell.replace(/[^0-9.]/g, '');
    usermodal.innerHTML=`<img class="avatar" src="${results.picture.large}" alt="A picture of ${results.name.first} ${results.name.last}"><div class="user-details">
    <h3>${results.name.first} ${results.name.last}</h3><p class="detail email">${results.email}</p><p class="detail city">${results.location.city}</p>
    <p class="detail cell">${(cell.length>=10)?cell.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"):cell.replace(/(\d{3})(\d{4})(\d{1})/, "$1-$2-$3")}</p>
    <p class='detail'>${results.location.street.number} ${results.location.street.name},${results.location.city}, ${results.location.state}, ${results.location.postcode}</p>
    <p class='detail'>Birthday: ${dateOfBirth}</p>
  </div>`;
  modal.classList.add('opened');

}

/**
 * Compares the given string using regex to the first name and last name of the objects included in the array (also accomodates first+last name as a total string)
 * @param {String} input 
 * @param {Array} list 
 */
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

/**
 * Event listeners
 */
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

searchInput.addEventListener('keyup',(e)=>{
    handleSearch(e.target.value, employees);
});
  
/**
 * The following two event listeners are fired when the user clicks the navigation buttons of the modal
 * and the aim is to provide a circular (Carousel) view of the users of the directory (meaning that if you press next while
 * on the last user you will be taken to the first one and vice versa)
 */
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
    }else{
        updateModal(current[current.length-1]);
        userEmail=current[current.length-1].email;
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
    }else{
        updateModal(current[0]);
        userEmail=current[0].email;
    }
});

getProfiles().then((data)=> employees=data).then(createAndDisplayCards).catch(err => console.log(err));