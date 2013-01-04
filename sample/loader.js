
$loader = null;
$loader_cap = null;
deferDat
    .load('lib/sonic.min.js')
    .success(function(){
        var square=new Sonic({width:100,height:50,padding:10,stepsPerFrame:4,trailLength:.4,pointDistance:.03,strokeColor:"#FFF",step:"fader",multiplier:2,setup:function(){this._.lineWidth=5},path:[["arc",10,10,10,-270,-90],["bezier",10,0,40,20,20,0,30,20],["arc",40,10,10,90,-90],["bezier",40,0,10,20,30,0,20,20]]});square.play();
        document.getElementById("loader").appendChild(square.canvas)
    })
    .load('lib/jquery.min.js')
    .success(function(){
        $loader = $("#loader");
        $loader_cap = $loader.find("figcaption");
        setTimeout(function(){
            $loader_cap.text("jQuery Here :)")
        }, 10)
    })

    .load([ // More scripts....
        'https://cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js'
        ,'https://cdnjs.cloudflare.com/ajax/libs/jade/0.27.7/jade.min.js'
    ])
    .success(function(){
        setTimeout(function(){
            $loader_cap.text("More Script !")
        }, 500);
    })


    .load([ // Moooore scripts....
        'https://cdnjs.cloudflare.com/ajax/libs/coffee-script/1.3.3/coffee-script.min.js'
        ,'https://cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/0.7.2/jquery.SPServices-0.7.2.min.js'
    ])
    .success(function(){
        setTimeout(function(){
            $loader_cap.text("Moooore Script !")
        }, 1500);
    })

    .happyEnd(function() {
        setTimeout(function(){
            $loader_cap.text("OK all done !");
            $loader.find(".sonic").hide(200);
        }, 2000);
    });