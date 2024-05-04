var mode = function(){
    const default_mode = {
        tipus: "normal",
        temps_i: 200
    };

    var mode = JSON.parse(localStorage.mode||JSON.stringify(default_mode));
    localStorage.mode = JSON.stringify(default_mode);

    return { 
        applyChanges: function(val){
            mode.tipus=val;
            console.log(val)
            localStorage.mode = JSON.stringify(mode);
        }
    }
}();

$('#normal').on('click',function(){
    mode.applyChanges("normal");
    window.location.assign("../html/phasergame.html");
});

$('#infinit').on('click',function(){
    mode.applyChanges("infinit");
    localStorage.setItem("pairs",2);
    localStorage.setItem("resta",1);
    localStorage.setItem("temps",1000);
    window.location.assign("../html/phasergame.html");
});
