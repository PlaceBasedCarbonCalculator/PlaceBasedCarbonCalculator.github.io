function closewelcome() {
  var x = document.getElementById("welcome-modal");
  var checkBox1 = document.getElementById("Consentcheckbox");
  var checkBox2 = document.getElementById("Cookiescheckbox");
  var namebox = document.getElementById("namebox");
  if(checkBox1.checked === true & checkBox2.checked === true & namebox.value.length > 3){
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
      document.getElementById("overlay").style.display = "none";
    }
  } else {
    alert("You can't view the map until you complete the form")
  }
  
  
}

