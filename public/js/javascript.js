function mySearch(){
  var searchInput = document.querySelector(".form-control");
  var filter = searchInput.value.toUpperCase();
  var res = document.querySelectorAll(".reserv");

  for (var i = 0; i < res.length; i++){
    txt = res[i].textContent || res[i].innerText;
    if (txt.toUpperCase().indexOf(filter) > -1){
      res[i].style.display = "";
    } else {
      res[i].style.display = "none";
    }
  }
}

function toggleArtcle(e){
  var dots = document.querySelectorAll(".dots");
  var showMore = document.querySelectorAll(".show-more");
  var btnText = document.querySelectorAll(".btn-link");

  for (var i = 0; i < dots.length; i++){
    if (i === e) {
      if (dots[i].style.display === "none"){
        dots[i].style.display = "inline";
        btnText[i].innerHTML = "Read more";
        showMore[i].style.display = "none";
      } else {
        dots[i].style.display = "none";
        btnText[i].innerHTML = "Read less";
        showMore[i].style.display = "inline";
      }
    }
  }
}

function leftSeatsCheck(){
  var link = document.querySelector('link[rel="import"]');
  var content = link.import;
  var leftSeats = content.querySelectorAll(".lseats");
  var day = document.querySelector(".day-number").value;
  var number = document.querySelector(".seats-number").value;

 for (var i = 0; i < leftSeats.length; i++){
    if (i + 1 === parseFloat(day)){
      if (parseFloat(leftSeats[i].innerHTML) < number){
        alert("There aren't so many seats left on this day. Please pick another day or a smaller number of seats!")
        location.reload();
      }
    }
  }
}
