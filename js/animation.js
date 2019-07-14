setTimeout(function(){ 
		document.getElementById("title-entrance").style.display = "none";
		document.getElementById("landing-svg").style.display = "block";
    }, 9000);

setTimeout(function(){ 
    document.getElementById("landing-options").classList.toggle('fade');
    document.getElementById("viz-button").classList.toggle('hovered');
    }, 9000);

var title = theaterJS({minSpeed: {
    "erase": 130,
    "type": 80
    },"maxSpeed": {
    "erase": 130,
    "type":450
     }})

title
.on('type:start, erase:start', function () {
        title.getCurrentActor().$element.classList.add('actor__content--typing')
        })
.on('type:end, erase:end', function () {
        title.getCurrentActor().$element.classList.remove('actor__content--typing')
})
.on('type:start, erase:start', function () {
        document.body.classList.add('dark')
})
title
.addActor('title', { speed: 0.4, accuracy: 0.8 })
.addScene("title:Call of Duty",800)
.addScene(-12, 100);