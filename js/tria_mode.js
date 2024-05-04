document.getElementById('normal').addEventListener('click', 
    function(){
        sessionStorage.removeItem("save");
        window.location.assign("./html/phasergame.html");
    });

document.getElementById('infinit').addEventListener('click', 
    function(){
        sessionStorage.removeItem("save");
        window.location.assign("./html/phasergame.html");
    });