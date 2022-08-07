
let inputbtn=document.getElementById("input-btn")
let deletebtn=document.getElementById("delete-btn")
let tabbtn=document.getElementById("tab-btn")
let ids=[]
let myleads=[]
const inputel=document.getElementById("input-el")
let ulel=document.getElementById("ul-el")

let leadsfromls=JSON.parse(localStorage.getItem("leads"))
if(leadsfromls)
{
    myleads=leadsfromls
    renderlead()
}

function renderlead(){
    let listitem=""
    let tempid=[]
    for(let i=0;i<myleads.length;i++)
    {
        // listitem+="<li>"+"<a href=\""+myleads[i]+"\" target=\"_blank\">"+myleads[i]+"</a></li>"
        listitem+=` <li> <a href="${myleads[i]}" target="_blank">${myleads[i]}</a> <i id="${i}" class="fa-solid fa-delete-left"></i></li> `
        
    }
    ulel.innerHTML=listitem
    for(let i=0;i<myleads.length;i++)
    {
        let is=""+i
        let te=document.getElementById(is)
        tempid.push(te.addEventListener('click',function(){
            myleads.splice(i,1)
            localStorage.setItem("leads",JSON.stringify(myleads))
            renderlead();
         }))
    }
    ids=tempid
}


inputbtn.addEventListener('click',function(){
     myleads.push(document.getElementById("input-el").value)
     document.getElementById("input-el").value=""
     localStorage.setItem("leads",JSON.stringify(myleads))
    //  localStorage.clear()
     renderlead()
})


tabbtn.addEventListener('click',function(){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        myleads.push(tabs[0].url)
        localStorage.setItem("leads",JSON.stringify(myleads))
        renderlead()
    })
})

deletebtn.addEventListener('click',function(){
   localStorage.clear()  
   myleads=[]
   renderlead()
   console.log("yes")
})



