
country_search=["A","B"];



function openFilter() {
		  var nav = document.getElementById("FilterNav");
		  if (nav.style.width == "0px") {
		    nav.style.width = "12%";
		    nav.style.display = "inline";
		    document.getElementById("filtrage").style.left = "10%";
		    document.getElementById("filtrage").style.top = "30%";
		    document.getElementById("filtrage").style.opacity = "0.5";
			document.getElementById("filtrage").className = "fa fa-close";
		  } else {
		    nav.style.width = "0px";
		    nav.style.display = "none";
		    document.getElementById("filtrage").style.left = "0%";
		    document.getElementById("filtrage").style.top = "50%";
		    document.getElementById("filtrage").style.opacity = "1";
		    document.getElementById("filtrage").className = "fa fa-filter";
		  }	  
}

function openSideBar() {
		  var nav = document.getElementById("MySidebar");
		  if (nav.style.width == "0px") {
		    nav.style.width = "15%";
		    nav.style.display = "inline";
		    document.getElementById("info").style.right = "3%";
		    document.getElementById("info").style.top = "13%";
		    document.getElementById("info").style.opacity = "0.5";
		    document.getElementById("info").className = "fa fa-close";
		  } else {
		    nav.style.width = "0px";
		    nav.style.display = "none";
		    document.getElementById("info").style.right = "2%";
		    document.getElementById("info").style.top = "50%";
		    document.getElementById("info").style.opacity = "1";
		    document.getElementById("info").className = "fa fa-info-circle";
		  }	 
}

function scrollFunction() {
    document.getElementById("MyHeader").style.backgroundColor="#222";
}

window.onscroll = scrollFunction;


function SearchActive(){
	v=document.getElementById("Search").value.toUpperCase().replace(/\s/g, '');
	ul=document.getElementById("myUL");
	ul.style.visibility = "visible";
	ul.innerHTML = "";

	for (i = 0; i < country_search.length; i++) {
     	tab=country_search[i].toUpperCase();
        if (tab.startsWith(v)) {
            var li = document.createElement("li");
	  		li.appendChild(document.createTextNode(tab));
	  		ul.appendChild(li);
	  		li.setAttribute("id", tab);
	  		li.setAttribute("class", "hint");
	  		li.setAttribute("onclick", "SearchChange(this.id);");
        }
    }
}


function Search(){
	v=document.getElementById("Search").value.toUpperCase();
	document.getElementById("myUL").style.visibility = "hidden";
	searching(v);
}

function SearchChange(v){
	document.getElementById("Search").value=v;
	document.getElementById("myUL").style.visibility = "hidden";
	searching(v);
}

function searching(v){
	document.getElementById("myUL").innerHTML = "";
	console.log("searching: "+v);
	//document.getElementById("ANGOLA").d3Click();
	d3.select('#'+v).dispatch('click');
}