const getCrafts=async()=>{
    try{
        return(await fetch("api/crafts/")).json();
    } catch(error){
        console.log(error);
    }
};

const showCrafts=async()=>{
    let crafts=await getCrafts();
    let craftsDiv=document.getElementById("craft-list");
    craftsDiv.innerHTML="";
    crafts.forEach((craft)=>{
    const section=document.createElement("section");
    section.classList.add("craft");
    craftsDiv.append(section);

    const a=document.createElement("a");
    a.href="#";
    section.append(a);

    const h3=document.createElement("h3");
    h3.innerHTML=craft.name;
    a.append(h3);

    const img=document.createElement("img");
    img.src=craft.img;
    a.append(img);

    a.onclick=(e)=>{
        e.preventDefault();
        displayDetails(craft);
        };
    });
};

const displayDetails=(craft)=>{
    openDialog("craft-details");
    const craftDetails=document.getElementById("craft-details");
    craftDetails.innerHTML="";
    craftDetails.classList.remove("hidden");

    const h3=document.createElement("h3");
    h3.innerHTML=craft.name;
    craftDetails.append(h3);

    const dlink=document.createElement("a");
    dlink.innerHTML="	&#9249;";
    craftDetails.append(dlink);
    dlink.id="delete-link";

    const elink=document.createElement("a");
    elink.innerHTML="&#9998;";
    craftDetails.append(elink);
    elink.id="edit-link";

    const p=document.createElement("p");
    craftDetails.append(p);
    p.innerHTML=craft.description;

    const ul=document.createElement("ul");
    craftDetails.append(ul);
    console.log(craft.supplies);
    craft.supplies.forEach((supply)=>{
        const li=document.createElement("li");
        ul.append(li);
        li.innerHTML=supply;
    });

const spoon=document.createElement("section");
spoon.classList.add("spoon");
craftDetails.append(spoon);

elink.onclick=showCraftForm;
dlink.onclick=deleteCraft.bind(this,craft);

populateEditForm(craft);
};

const populateEditForm=(craft)=>{
    const form=document.getElementById("craft-form");
    form._id.value=craft._id;
    form.name.value=craft.name;
    form.description.value=craft.description;
    document.getElementById("img-prev").src=craft.img;
    //add supplies
    populateSupplies(craft.supplies);
};

const populateSupplies=(supplies)=>{
    const section=document.getElementById("supply-boxes");
    supplies.forEach((supply)=>{
    const input=document.createElement("input");
    input.type="text";
    input.value=supply;
    section.append(input);
 });
};

const addeditCraft=async(e)=>{
    e.preventDefault();
    const form=document.getElementById("craft-form");
    const formData=new FormData(form);
    let response;
    formData.append("supplies",getSupplies());

    console.log(...formData);


    if(form._id.value.trim()==""){
        console.log("in post");
        response=await fetch("/api/crafts",{
            method: "POST",
            body:formData,
        });
    } else {

        console.log("in put");
        response=await fetch(`/ap/recipies/${form._id.value}`,{
        method:"PUT",
        body:formData    
        });
    }


    if (response.status!=200){
        console.log("Error adding /editing");
    }

    await response.json();
    resetForm();
    document.getElementById("dialog").style.display="none";
    showCrafts();
};

const getSupplies=()=>{
    const inputs=document.querySelectorAll("#supply-boxes input");
    let supplies=[];

    inputs.forEach((input)=>{
        supplies.push(input.value);
    });

    return supplies
};

const resetForm=()=>{
    const form=document.getElementById("craft-form");
    form.reset();
    form._id.value="";
    document.getElementById("supply-boxes").innerHTML="";
    document.getElementById("img-prev").src="";
};

const showCraftForm=(e)=>{
    openDialog("craft-form");
    console.log(e.target);
    if(e.target.getAttribute("id") !="edit-link"){
    resetForm();
    }
};

const deleteCraft=async(craft)=>{
    let response=await fetch(`/api/crafts/${craft._id}`,{
        method:"DELETE",
        headers:{
        "Content-Type":"application/json;charset=utf=8",
        },
    });

    if(response.status!=200){
        console.log("error deleting");
        return;
    }

    let result=await response.json();
    resetForm();
    showCrafts();
    document.getElementById("dialog").style.display="none";
};

const addsupply=(e)=>{
    e.preventDefault();
    const section=document.getElementById("supply-boxes");
    const input=document.createElement("input");
    input.type="text";
    section.append(input);
};

const openDialog=(id)=>{
    document.getElementById("dialog").style.display="block";
    document.querySelectorAll("#dialog-details> *").forEach((item)=>{
        item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
};


showCrafts();
document.getElementById("craft-element").onsubmit=addeditCraft;
document.getElementById("add-link").onclick=showCraftForm;
document.getElementById("add-supply").onclick=addsupply;

document.getElementById("img").onchange=(e)=>{
    if(!e.target.files.length){
        document.getElementById("img-prev").src="";
        return;
    }
    document.getElementById("img-prev").src=URL.createObjectURL(
        e.target.files.item(0)
    );
};