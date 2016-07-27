var toggle_cool = false;
$(document).ready(function(){
  var i,d=document.getElementsByTagName("link");
  for(i=0;i<d.length;i++){
    if(d[i].title == "oldteam") d[i].disabled = false;
    if(d[i].title == "coolteam") d[i].disabled = true;
  }
});
function switch_style (){
  var i,d=document.getElementsByTagName("link"),f=document.getElementsByTagName("img");
  for(i=0;i<d.length;i++){
    if(d[i].title == "oldteam"){
      if(toggle_cool) d[i].disabled = false;
      else d[i].disabled = true;
    }
    if(d[i].title == "coolteam"){
      if(toggle_cool) d[i].disabled = true;
      else d[i].disabled = false;
    }
  }
  for(i=0;i<f.length;i++){
    var g = f[i].parentElement.parentElement.parentElement;
    if(g.classList=='bio-container'){
      if(toggle_cool)
        f[i].attributes['src'].value = f[i].attributes['src'].value.replace("cool-kids/","/");
      else 
        f[i].attributes['src'].value = f[i].attributes['src'].value.replace("team/","team/cool-kids/");
    }
  }
  toggle_cool=!toggle_cool;
}
