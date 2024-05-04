export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        waiting: false,
        isDone: false,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, temps);
        },
        goFront: function (last){
            if (last)
                this.waiting = last.waiting = false;
            else
                this.waiting = true;
            this.current = this.front;
            this.clickable = false;
            this.callback();
        },
        check: function (other){
            if (this.front === other.front)
                this.isDone = other.isDone = true;
            return this.isDone;
        }
    };

    var temps=1000;
    var lastCard;
    var pairs = 2;
    var pairs_r=2;
    var points = 0;
    var vida = 6;
    var resta = 1;
    var suma=20;
    var mode="n";
    var cards = []; // Llistat de cartes

    var mix = function(){
        var mod = localStorage.getItem("mode");
        mod = JSON.parse(mod);
        mode=mod.tipus;
        if(mode=="normal"){
             var op = localStorage.getItem("options");
               op = JSON.parse(op);
               pairs_r= parseInt(op.pairs);   
               if(op.difficulty=="easy") resta=1;
               else if (op.difficulty=="normal") temps=500;
               else {
                   resta = 2;
                   temps = 500;
               }
        }
        else{
            pairs=parseInt(localStorage.getItem("pairs"));
            pairs_r= parseInt(localStorage.getItem("pairs"));
            resta= parseInt(localStorage.getItem("resta"));
            temps= parseInt(localStorage.getItem("temps"));
            points= parseInt(localStorage.getItem("points"));
            console.log(pairs);
        }

        var items = resources.slice(); // Copiem l'array
        items.sort(() => Math.random() - 0.5); // Aleatòria
        items = items.slice(0, pairs_r); // Agafem els primers
        items = items.concat(items);
        return items.sort(() => Math.random() - 0.5); // Aleatòria
    }
    return {
        init: function (call){
            if (sessionStorage.save){ // Load game
                var op = localStorage.getItem("options");
                op = JSON.parse(op);
                pairs_r= parseInt(op.pairs);
                if(op.difficulty=="easy") resta=10;
                else if (op.difficulty=="normal") temps=500;
                else {
                    resta = 40;
                    temps = 500;
                }
                var items = resources.slice(); // Copiem l'array
                items.sort(() => Math.random() - 0.5); // Aleatòria
                items = items.slice(0, pairs_r); // Agafem els primers
                items = items.concat(items);
                items.sort(() => Math.random() - 0.5); // Aleatòria
                var arr_c = [];
                 items.map(item => {
                    let carta = Object.create(card, {front: {value:item}, callback: {value:call}});
                    carta.current= carta.front;
                    carta.clickable=false;
                    carta.goBack();
                    arr_c.push(carta);
                });
               
                return arr_c;
            }
            else return mix().map(item => { // New game
                //cards.push(Object.create(card, { front: {value:item}, callback: {value:call}}));
               // return cards[cards.length-1];
                let carta = Object.create(card, {front: {value:item}, callback: {value:call}});
                carta.current= carta.front;
                carta.clickable=false;
                carta.goBack();
                cards.push(carta);
               return cards[cards.length-1];
            });
        },
        click: function (card){
            if (!card.clickable) return;
            card.goFront(lastCard);
            if (lastCard){ // Segona carta
                if (card.check(lastCard)){
                    pairs_r--;
                    points=points+suma;
                    if (pairs_r <= 0){
                        if(mode=="infinit"){
                            if(pairs<6) pairs=pairs+1;
                            else if (resta<50)resta=resta+5;
                            else if (temps!=0) temps=temps-20;
                            localStorage.setItem("pairs",pairs);
                            localStorage.setItem("resta",resta);
                            localStorage.setItem("temps",temps);
                            localStorage.setItem("points", points);
                            window.location.reload();
                        }
                        else{
                            console.log(mode);
                            alert("Has guanyat amb " + points + " punts!");
                            window.location.replace("../");
                          
                        }
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    vida-=resta;
                    if (vida <= 0){
                        alert ("Has perdut amb "+points+" punts");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // Primera carta
        },
        save: function (){
            var partida = {
                uuid: localStorage.uuid,
                pairs: pairs_r,
                points: points,
                cards: []
            };
            cards.forEach(c=>{
                partida.cards.push({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                });
            });

            let json_partida = JSON.stringify(partida);

            fetch("../php/save.php",{
                method: "POST",
                body: json_partida,
                headers: {"content-type":"application/json; charset=UTF-8"}
            })
            .then(response=>response.json())
            .then(json => {
                console.log(json);
            })
            .catch(err=>{
                console.log(err);
                localStorage.save = json_partida;
                console.log(localStorage.save);
            })
            .finally(()=>{
                window.location.replace("../");
            });
        }
    }
}();