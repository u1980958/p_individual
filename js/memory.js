export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, temps);
        },
        goFront: function (){
            this.current = this.front;
            this.clickable = false;
            this.callback();
        }
    };

    var lastCard;
    var pairs = 2;
    var points = 100;
    var resta = 25;
    var temps = 1000;

    return {
        init: function (call){
            var op = localStorage.getItem("options");
            op = JSON.parse(op);
            console.log(op.pairs)
            pairs= parseInt(op.pairs);
            console.log(op.difficulty);
            if(op.difficulty=="easy") resta=10;
            else if (op.difficulty=="normal") temps=500;
            else {
                resta = 40;
                temps = 500;
            }
            var items = resources.slice(); // Copiem l'array
            items.sort(() => Math.random() - 0.5); // Aleatòria
            items = items.slice(0, pairs); // Agafem els primers
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
        },
        click: function (card){
            if (!card.clickable) return;
            card.goFront();
            if (lastCard){ // Segona carta
                if (card.front === lastCard.front){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=resta;
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // Primera carta
        }
    }
}();