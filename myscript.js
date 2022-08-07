var saveINP = document.querySelector('#input-btn');
var saveTAB = document.querySelector('#tab-btn');
var deleteALL = document.querySelector('#delete-btn');
var popup = document.querySelector('.popup');
var valid = document.querySelector('.valid');
var submit = document.querySelector('#submit');
var cancel = document.querySelector('#cancel');
var okdelete = document.querySelector('#okdelete');
var cancelvalid = document.querySelector('#cancelvalid');
var tagVAL = document.querySelector('#Tags');
var siteVAL = document.querySelector('#sites');
var errorINP = document.querySelector('#errorINP');
var container = document.querySelector('.container');
var toast = document.querySelector('.toast');
var searchBTN = document.querySelector('#searchBTN');
var searchINP = document.querySelector('#searchString');

let site_data=[];
let site_objects=[];
let flag_del=-1;
let flag_edit=-1;

tagVAL.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submit.click();
  }
});

siteVAL.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submit.click();
    }
});

let sitefromls=JSON.parse(localStorage.getItem("sites"));
if(sitefromls)
{
    site_data=sitefromls;
    render();
}

saveINP.addEventListener('click',()=>{
    errorINP.textContent="";
    popup.style.transform="translateY(0)";
});

saveTAB.addEventListener('click',()=>{
    errorINP.textContent="";
    popup.style.transform="translateY(0)"
});

cancel.addEventListener('click',()=>{
    siteVAL.value="";
    tagVAL.value="";
    flag_edit=-1;
    popup.style.transform="translateY(-180px)";
});

deleteALL.addEventListener('click',function(){
    flag_del=-9999;
    valid.style.transform="translateY(0)";
 });

okdelete.addEventListener('click',function(){
    if(flag_del===-9999)
    {
    localStorage.clear();  
    site_data=[];
    }
    else
    {
        site_data.splice(flag_del,1);
        localStorage.setItem("sites",JSON.stringify(site_data));
    }
    flag_del=-1;
    render();
    valid.style.transform="translateY(-180px)";
});

cancelvalid.addEventListener('click',()=>{
    valid.style.transform="translateY(-180px)";
});


submit.addEventListener('click',()=>{
    if(tagVAL.value && siteVAL.value)
    {
        if(flag_edit!=-1)
        {
            site_data.splice(flag_edit,1);
            flag_edit=-1;
        }
        if(check(tagVAL.value))
        {
        site_data.push([tagVAL.value,siteVAL.value]);
        popup.style.transform="translateY(-180px)";
        localStorage.setItem("sites",JSON.stringify(site_data));
        render();
        tagVAL.value="";
        siteVAL.value="";
        errorINP.textContent="";
        }
        else 
        {
            errorINP.textContent="Tag already exist, enter an unique tag.";
        }
    }
    else
    {
        errorINP.textContent="Fill required inputs.";
    }
})

function check(ele){
      for(let i=0;i<site_data.length;i++)
      {
          if(site_data[i][0]==ele)
           return false;
      }
    return true;
}

function render(){
    let listitem="";
    let tempid=[];
    let tempStr;
    site_data.sort((a, b) => a[0].localeCompare(b[0], undefined, {sensitivity: 'base'}))
    for(let i=0;i<site_data.length;i++)
    {
        tempStr = site_data[i][1].replace(/^https?:\/\//, '');
        tempStr = tempStr.toLowerCase();
        if(tempStr.length>30)
        tempStr = tempStr .substring(0,30)+"...";
        listitem+=`
        <div class="value-con">
        <a href="${site_data[i][1]}" target="_blank">
         <div class="row">
            <input type="text" readonly class="tag" value="${site_data[i][0]}">
            <input type="text" readonly class="site" value="${tempStr}">
         </div>
         </a>
           <div class="tools">
             <i class="fa-solid fa-pen-to-square" id="edit${i}" ></i>
             <i class="fa-solid fa-trash-can" id="delete${i}" ></i>
             <div class="copy" id="ele${i}">
             <i class="fa-solid fa-copy"></i>
             </div>
           </div>
         </div>
      `;
    }
    container.innerHTML=listitem;
    for(let i=0;i<site_data.length;i++)
    {
        let task="ele"+i;
        let task_obj=document.getElementById(task);
        tempid.push(task_obj.addEventListener('click',function(){
            navigator.clipboard.writeText(site_data[i][1]);
            show_toast("Site Copied");
         }))
         task = "edit"+i;
         task_obj=document.getElementById(task);
         tempid.push(task_obj.addEventListener('click',function(){
            tagVAL.value = site_data[i][0];
            siteVAL.value = site_data[i][1];
            popup.style.transform="translateY(0)";
            flag_edit=i;
         }))
         task = "delete"+i;
         task_obj=document.getElementById(task);
         tempid.push(task_obj.addEventListener('click',function(){
            valid.style.transform="translateY(0)";
            flag_del=i;
         }))
    }
    site_objects=tempid;
    // console.log(site_objects);
}

saveTAB.addEventListener('click',function(){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        siteVAL.value = tabs[0].url;
        popup.style.transform="translateY(0)";
    })
})

searchINP.addEventListener('input',()=>{
    var check = searchINP.value.toUpperCase();
    var data = JSON.parse(localStorage.getItem("sites"));
    var listitem = ``,tempStr;
    data.forEach(ele => {
        if (ele[0].toUpperCase().indexOf(check) > -1) {
            tempStr = ele[1].replace(/^https?:\/\//, '');
            tempStr = tempStr.toLowerCase();
            if(tempStr.length>30)
            tempStr = tempStr .substring(0,30)+"...";

            listitem+=`
            <div class="value-con">
            <a href="${ele[1]}" target="_blank">
             <div class="row">
                <input type="text" readonly class="tag" value="${ele[0]}">
                <input type="text" readonly class="site" value="${tempStr}">
             </div>
             </a>
               </div>
             </div>
          `;
        }
        })
        if(listitem === ``){
            listitem+=`
            <div class="value-con">
             <div class="row">
                <input type="text" readonly class="tag" value="!! Not Found !!">
                <input type="text" readonly class="site" value="Entered tag may not exist.">
             </div>
               </div>
             </div>
          `;
        }
        container.innerHTML=listitem;
})

searchBTN.addEventListener('focusout',()=>{
    searchINP.value = "";
    setTimeout(() => {
        render();
    }, 500);
    // console.log("happen");
})


let toasttime;
const show_toast=(msg)=>{
  toast.innerText=msg
  toast.style.transform="translateY(0)"
  clearTimeout(toasttime)
  toasttime= setTimeout(()=>{
  toast.style.transform="translateY(+60px)"
  },1500)
}



