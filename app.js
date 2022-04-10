let userList=document.querySelector('.user-list');

async function getProfiles(){
    const response = await fetch('https://randomuser.me/api/?results=12');
    const responsejson = await response.json();
    const profiles = responsejson.results;
    console.log(profiles);
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
    let itemHTML='';
    data.forEach(user => {
      itemHTML=`<div class='card user-item'><img class="avatar" src="${user.picture.medium}" alt="A picture of ${user.name.first} ${user.name.last}"><div class="user-details">
      <h3>${user.name.first} ${user.name.last}</h3><p class="detail"S>${user.email}</p><p class="detail">${user.location.city}, ${user.location.state}, ${user.location.country}</p>
    </div></div>`;  
    createAndAppendChild(itemHTML,'li',userList,'item');
    });
}

getProfiles().then(createAndDisplayCards);