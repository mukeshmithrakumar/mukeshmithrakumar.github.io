/* -------------------------------------- Document -------------------------------------- */

$(document).ready(function () {

    /* -------------------------------------- Navigation Bar ----------------------------------- */

    $('#nav-toggle').click(function () {
        $(this).toggleClass('open');
        $(".global-nav").toggleClass('full');
        $(".itemMenu").toggleClass('appear');
    });


    $('.itemMenu').click(function () {
        $('#nav-toggle').toggleClass('open');
        $(".global-nav").toggleClass('full');
        $(".itemMenu").toggleClass('full');
        $(".itemMenu").toggleClass('appear');
    });

    /* -------------------------------------- CV Button -------------------------------------- */

    $(".cvbutton").wrapInner('<div class=cvbuttontext></div>');
    $(".cvbuttontext").clone().appendTo($(".cvbutton"));
    $(".cvbutton").append('<span class="cvbuttontwist"></span><span class="cvbuttontwist"></span><span class="cvbuttontwist"></span><span class="cvbuttontwist"></span>');
    $(".cvbuttontwist").css("width", "25%").css("width", "+=3px");

    /* -------------------------------------- HIRE Button -------------------------------------- */

    $(".hirebutton").wrapInner('<div class=hirebuttontext></div>');
    $(".hirebuttontext").clone().appendTo($(".hirebutton"));
    $(".hirebutton").append('<span class="hirebuttontwist"></span><span class="hirebuttontwist"></span><span class="hirebuttontwist"></span><span class="hirebuttontwist"></span>');
    $(".hirebuttontwist").css("width", "25%").css("width", "+=3px");


    /* -------------------------------------- Full Page -------------------------------------- */

    $('#fullpage').fullpage({
        sectionSelector: '.section',
        slideSelector: '.testimonials-scrolling',
        navigation: true,
        navigationTooltips: ['Home', 'About', 'Work', 'Blog', 'Testimonials', 'Contact'],
        // showActiveTooltip: true,
        slidesNavigation: true,
        controlArrows: false,
        anchors: ['Home', 'About', 'Work', 'Blog', 'Testimonials', 'Contact'],
        menu: '.menu',

        // For Work Mobile Screens
        responsiveWidth: 661,

        // For Work Page Owl Carousal
        afterRender: function () {
            var $grid = $('.img-grid').isotope({
                itemSelector: '.card-container',
                resizable: false, // disable normal resizing

            });

            var filterFns = {
                numberGreaterThan50: function () {}
            };

            $('#filter-btn').on('click', 'button', function () {
                var filterValue = $(this).attr('data-filter');
                filterValue = filterFns[filterValue] || filterValue;
                $grid.isotope({
                    filter: filterValue
                });
            });

            // For Matrix in Work
            let c = document.getElementById("canvas");
            let ctx = c.getContext("2d");

            c.height = window.innerHeight;
            c.width = window.innerWidth;

            let floatChar = [0, 1];
            let font_size = 10;
            let col = c.width / font_size;
            let charDrops = [];
            for (let i = 0; i < col; i++)
                charDrops[i] = 1;

            let putPixel = () => {
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.fillStyle = "#FFC107";
                ctx.font = font_size + "px Consolas";
                for (let i = 0; i < charDrops.length; i++) {
                    let txt = floatChar[Math.floor(Math.random() * floatChar.length)];
                    ctx.fillText(txt, i * font_size, charDrops[i] * font_size);
                    if (charDrops[i] * font_size > c.height && Math.random() > 0.975)
                        charDrops[i] = 0;

                    charDrops[i]++;
                }
            }
            setInterval(putPixel, 33);

            // https://stackoverflow.com/questions/8747714/how-to-make-the-browser-back-button-disregard-hash-tags
            var counter = 0;
            window.onhashchange = function () {
                window.history.replaceState({
                        visited: ++counter
                    }, "visited page",

                    window.location.search + window.location.hash);
            }

            window.onpopstate = function (event) {
                if (event.state.visited && counter > event.state.visited) {
                    counter -= 2;
                    window.history.go(-1 * event.state.visited);
                } else {
                    counter = event.state.visited;
                }
            }

        }
    });

});


/* -------------------------------------- Particle Page -------------------------------------- */

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 250,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ca1414"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 1,
                "color": "#ca1414"
            },
            "polygon": {
                "nb_sides": 5
            },

        },
        "opacity": {
            "value": 0.9,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 8,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ca1414",
            "opacity": 0.6,
            "width": 2
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "right",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});
