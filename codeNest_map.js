
let xp_required = 100;
let ALL_levels = 100;
let increase = []
let level = []
let level_xp = []
fetch('/api/convert/xp/to/LV')
    .then(response => response.json())
    .then(xp => {



        for (let lv = 1; lv <= ALL_levels; lv++) {



            if (lv >= 1 && lv <= 10) {
                increase.push(0.21); // 21%
                level.push(lv);
            }
            else if (lv > 10 && lv <= 20) {
                // 12%
                increase.push(0.12);
                level.push(lv);
            } else if (lv > 20 && lv <= 30) {
                // 10%
                increase.push(0.10);
                level.push(lv);
            }
            else if (lv > 30 && lv <= 80) {
                // 5%
                increase.push(0.05);
                level.push(lv);
            } else if (lv > 80 && lv <= 100) {
                increase.push(0.025);
                level.push(lv); // 2.5%
            }

        }
        let lev_xp = [];
        lev_xp.push(xp_required)
        for (let i = 1; i < ALL_levels; i++) {
            xp_required = xp_required * (1 + increase[i]);
            lev_xp.push(Math.floor(xp_required));

        }
         console.log(lev_xp)
         console.log(level)


        let userLV = 1;
        let current_xp = 0
        let next_xp = lev_xp[0];

        let i = 0


        while (xp > lev_xp[i]) {

            // console.log('--->'+i)
            userLV = level[i] + 1
            current_xp = lev_xp[i]
            next_xp = lev_xp[i + 1]

            i++
        }

        //console.log(userLV)
        document.getElementById('level').innerHTML = "LV "+userLV;
        fetch('/api/user/lv', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ userLV })
        })

        let user_distance = xp - current_xp
        let xp_distance = next_xp - current_xp
        let avreg = 0;
        if (xp_distance > 0) {
            avreg = user_distance / xp_distance;
        } else {
            avreg = 1;
        }

        //console.log('user xp its ' + xp);
        //console.log('curent xp its ' + current_xp);
        //console.log('next xp its ' + next_xp);
        //console.log('user_distance = ' + user_distance)
        //console.log('xp_distance = ' + xp_distance)
        //progress circle 

        var bar = new ProgressBar.Circle(progress_bar, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 1400,
            color: 'Green',
            trailColor: '#eee',
            trailWidth: 6,
            svgStyle: {
                height: '100%',
                width: '100%'
            }
        });
        bar.animate(avreg);
        document.getElementById('grade').innerHTML = userLV

    })
var level_user_div = document.getElementById('level');
fetch('/api/user/LV/show')
    .then(response => response.json())
    .then(LV_show => {
        level_user_div.innerHTML = 'lv ' + LV_show;
    })
     var line = new ProgressBar.Line(progress_line, {
            strokeWidth: 2.5,
            easing: 'easeInOut',
            duration: 1400,
            color: '#00FF52',
            trailColor: '#006CFF',
            trailWidth: 2,
            svgStyle: {
                height: '50%',
                width: '100%',

            }
        });
let rank;
let avregRP;
let nextRP;
let relativRP;
fetch('/api/convert/RP/to/rank')
    .then(response => response.json())
    .then(userRP => {
        console.log(userRP)
        if (userRP >= 0 && userRP < 1000) {
            avregRP = 1000 - 0;
            relativRP = userRP - 0;
            rank = 1;
        } else if (userRP >= 1000 && userRP < 5000) {
            avregRP = 5000 - 1000;
            relativRP = userRP - 1000;
            nextRP = 5000;
            rank = 2;
        } else if (userRP >= 5000 && userRP < 12000) {
            avregRP = 12000 - 5000;
            relativRP = userRP - 5000;
            nextRP = 12000;
            rank = 3;
        } else if (userRP >= 12000 && userRP < 22000) {
            avregRP = 22000 - 12000;
            relativRP = userRP - 12000;
            nextRP = 22000;
            rank = 4;
        } else if (userRP >= 22000 && userRP < 35000) {
            avregRP = 35000 - 22000;
            relativRP = userRP - 22000;
            nextRP = 35000;
            rank = 5;
        } else if (userRP >= 35000 && userRP < 45000) {
            avregRP = 45000 - 35000;
            relativRP = userRP - 35000;
            nextRP = 45000;
            rank = 6;
        } else if (userRP >= 45000 && userRP < 57000) {
            avregRP = 57000 - 45000;
            relativRP = userRP - 45000;
            nextRP = 57000;
            rank = 7;
        } else if (userRP >= 57000 && userRP < 70000) {
            avregRP = 70000 - 57000;
            relativRP = userRP - 57000;
            nextRP = 70000;
            rank = 8;
        } else if (userRP >= 70000 && userRP < 85000) {
            avregRP = 85000 - 70000;
            relativRP = userRP - 70000;
            nextRP = 85000;
            rank = 9;
        } else if (userRP >= 85000) {
            rank = 10;
            line.animate(0)
        }
        let barlineRP = relativRP / avregRP;
        
       
        line.animate(barlineRP)
        fetch('/api/user/rank', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ rank })
        })
        if (rank == 10) {
            document.getElementById('rank_img').src = `rank Photos/rank${rank}.png`;
            document.getElementById('current_level_img').src = `rank Photos/rank${rank}.png`
            document.getElementById('future_level_img').src = `rank Photos/rank${2}.png`
            document.getElementById('future_level_img').style.filter = 'brightness(0)';
        } else {
            document.getElementById('rank_img').src = `rank Photos/rank${rank}.png`;
            document.getElementById('current_level_img').src = `rank Photos/rank${rank}.png`
            document.getElementById('future_level_img').src = `rank Photos/rank${rank + 1}.png`
            document.getElementById('future_level_img').style.filter = 'brightness(0)';

        }

    })


