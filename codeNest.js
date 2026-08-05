
//add new section 





let levelNum = 7

let dataLevels = []
const addSection = () => {
    for (let m = 0; m < 1; m++) {

        var newSection = `<div id="section${m}" class="section">
                
            </div>`;

        var page_new = document.getElementById('page_home')
        page_new.innerHTML += newSection


        for (let i = 0; i < levelNum; i++) {
            var newLevel = ` <div id="level${i}" class="level"  onclick="clickLevel(event)">
     
                  </div>`

            var level_new = document.getElementById('section' + m)
            level_new.innerHTML += newLevel



        }
    }



}

const levelDesign = () => {
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        const levels = section.querySelectorAll('.level');
        let y = 45, x = 45;
        let a = 33, b = 33;


        let maxN = Math.ceil(levels.length / 10);

        for (let n = 0; n < maxN; n++) {

            for (let i = 0; i <= 4; i++) {
                let idx = i + 10 * n;
                if (idx >= levels.length) break;
                if (i === 0) {
                    y = x;
                    levels[idx].style.marginLeft = '45%';
                    x = y - 4;
                } else if (i === 1) {
                    y = x;
                    levels[idx].style.marginLeft = '41%';
                    x = y - 4;
                } else if (i === 2) {
                    y = x;
                    levels[idx].style.marginLeft = '37%';
                    x = y - 4;
                } else if (i === 3) {
                    y = x;
                    levels[idx].style.marginLeft = '33%';
                    x = y - 4;
                } else if (i === 4) {
                    y = x;
                    levels[idx].style.marginLeft = '29%';
                    x = y - 4;
                }
            }

            a = 33; b = 33;
            for (let i = 5; i <= 9; i++) {
                let idx = i + 10 * n;
                if (idx >= levels.length) break;
                a = b;
                levels[idx].style.marginLeft = a + '%';
                b = a + 4;
            }
        }


        for (let i = 0; i < levels.length; i++) {
            levels[i].innerHTML = '<img src="icones Photos/iconLevel.png">';
        }
    });
}
function test(id) {

}
//style js

addSection();
levelDesign()
//Switch between pages ===> SBP
const displayOther = () => {
    var page_dis = document.querySelectorAll('.page')
    for (let i = 1; i < page_dis.length; i++) {
        page_dis[i].style.display = 'none'
    }
}
displayOther()


function SBP(page_id) {
    var pages = document.querySelectorAll('.page');

    for (let i = 0; i < pages.length; i++) {

        pages[i].style.display = 'none'
    }


    var target = document.getElementById(page_id);
    if (target !== null) {
        target.style.display = 'block'
    }
    var header = document.getElementById('header');
    var content = document.getElementById('content');

    if (page_id === 'page_pro' || page_id === 'page_mor') {
        header.style.display = 'none'
        content.style.height = "91vh"
    } else {
        header.style.display = 'flex'
    }

    const identificationFrame = document.getElementById('identification_frame');

    identificationFrame.style.display = 'none';

    if (page_id === 'page_home') {

        identificationFrame.style.display = 'flex';

    } else {
        identificationFrame.style.display = 'none';

    }

}
window.SBP = SBP;


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

bar.animate(0.9);
//progress line
var line = new ProgressBar.Line(progress_line, {
    strokeWidth: 2.5,
    easing: 'easeInOut',
    duration: 1400,
    color: '#00FF52',
    trailColor: '#006CFF',
    trailWidth: 2,
    svgStyle: {
        height: '100%',
        width: '93%',

    }
});
line.animate(0.5)

//tapes of the progress bare
const create_taps = () => {
    for (let i = 1; i <= 15; i++) {
        var numberLevels = document.getElementById('number_levels');

        let newtapes = `<div id="number_levels_S${i}" class=" numberLevels_S">
                                <div id="numbers${i}">
                                   ${i} 
                                </div>
                                <div id="tabs${i}">
                                   | 
                                </div>
                            </div>
                        
                        `


        numberLevels.innerHTML += newtapes
    }
}
create_taps()

//create projects
const create_project = () => {
    var userInfoProjects = document.getElementById('user_info_projects');

    for (let i = 1; i <= 61; i++) {
        var newProject = `        <div id="project_${i}" class="project">
                        <img class="imgProject" src="icones Photos/project_unlocked.png" >
                                <div id="star_1" class="star"><img  src="icones Photos/star_unlocked.png" class="imgStar"></div>
                                <div id="star_2" class="star"><img  src="icones Photos/star_unlocked.png" class="imgStar"></div>
                                 <div id="star_3" class="star"><img  src="icones Photos/star_unlocked.png"  class="imgStar"></div>

                            
                        </div>`

        userInfoProjects.innerHTML += newProject
    }
}
create_project()

//create_users

const create_users = () => {

    var userFrame = document.getElementById('user_frame');
    for (let i = 1; i <= 50; i++) {
        var newUser = `  <div id="user_${i}" class="user">
                        <div id="user_img_1" class="user_img">
                            
                        </div>
                        <div id="user_info_1" class="user_info">
                            <div id="user_info_name_1" class="user_info_name" >
                                
                            </div>
                            <div id="user_info_gmail_1" class="user_info_gmail">
                                
                            </div>
                        </div>
                        <div id="user_xp_1" class="user_xp">
                            
                        </div>
                    </div>`

        userFrame.innerHTML += newUser
    }
}
create_users()

const checkLevels = () => {
    fetch('/api/levels')
        .then(response => response.json())
        .then(status => {
            
                    status.forEach((statusValue, idx) => {
                        var levelAll = document.querySelectorAll('.level');
                        const sectionIdx = Math.floor(idx / 9);


                        if (statusValue === 'open') {
                            levelAll[idx].style.backgroundColor = ' rgb(0, 138, 18)';
                            levelAll[idx].style.borderColor = ' rgb(3, 99, 16)';
                            levelAll[idx].addEventListener('click', () => {
                                fetch('/api/last/level/id')
                                    .then(response => response.json())
                                    .then(lastLevelId => {
                                        if (navigator.onLine) {
                                           
                                            if (idx === lastLevelId[0]) {
                                            
                                            window.location.href = 'stage.html'
                                        } else {
                                          
                                        }
                                        } else {
                                           alert('البرنامج غير متصل بالإنترنت');
                                           
                                        }
                                       


                                    })

                            })
                           
                        } else if (statusValue === 'locked') {
                            //levelAll[idx].style.backgroundColor = 'red';
                        }
                    });
                
        });
}





checkLevels();

function clickLevel(e) {
    var id = e.target.id;
    

}
const checkProgress = (id) => {
    const idx = parseInt(id.replace('level', ''))

    const sectionIdx = Math.floor(idx / levelNum);
    var nextLevelIdx = idx + 1;
    if ((nextLevelIdx % levelNum) < levelNum && nextLevelIdx < levelNum) {
        fetch('/api/progress')
            .then(response => response.json())
            .then(progress => {

                if (progress[idx] === true) {

                    fetch('/api/Status/update',
                        {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                status: 'open',
                                // progress: true, // <-- dont forget change this n futur!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                sectionIndex: Math.floor(nextLevelIdx / levelNum),
                                levelIndex: nextLevelIdx

                            })
                        })
                        .then(response => {
                            if (response.ok) {
                                checkLevels()

                            }
                        })

                } else if (progress[idx] === false) {

                }

            })
    }
}

const oneLevels = (id) => {
    const idx = parseInt(id.replace('level', ''))

    const sectionIdx = Math.floor(idx / levelNum);


    var nextLevelIdx = idx + 1;
    if ((nextLevelIdx % levelNum) < levelNum && nextLevelIdx < levelNum) {
        fetch('/api/progress')
            .then(response => response.json())
            .then(progress => {

                if (idx % levelNum === 0) {

                    fetch('/api/Status/update',
                        {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                status: 'open',
                                // progress: true, // <-- dont forget change this n futur!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                sectionIndex: Math.floor(nextLevelIdx / levelNum),
                                levelIndex: idx

                            })
                        })
                        .then(response => {
                            if (response.ok) {
                                checkLevels()

                            }
                        })
                    fetch('/api/situation/update', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            situation: 'open',
                            sectionIndexSituation: Math.floor(nextLevelIdx / levelNum),

                        })
                    })

                }
                return progress[idx]
            })
        // checkSection(id);
    }
}


const changeSituation = (id) => {

   

            let idx = parseInt(id.replace('level', ''));
            let sectionIdx = Math.floor(idx / levelNum);
            var nextLevelIdx = idx
            fetch('/api/comletion/update', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    completion: true,
                    sectionIndexSituation: Math.floor(nextLevelIdx / levelNum),

                })

            })

        

}


const openSection = (id) => {
    fetch('/api/completion/opened')
        .then(response => response.json())
        .then(completion => {
            completion.forEach((completionValue) => {
                fetch('/api/levels')
                    .then(response => response.json())
                    .then(status => {

                                let idx = parseInt(id.replace('level', ''))
                                let sectionIdx = Math.floor(idx / levelNum);

                                if (completionValue === true) {
                                    fetch('/api/open/one/level/in/sectionSelected', {
                                        method: 'POST',
                                        headers: {
                                            'content-type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            sectionIndex: sectionIdx + 1,
                                            levelIndex: idx + 1,
                                            progress: true,
                                            status: 'open',
                                        })
                                    });

                                    //  openLevels(id)
                                } else if (completionValue === false) {
                                   
                                }
                            
                    })
            })
        })
}




var levelId = document.querySelectorAll('.level');
levelId.forEach(level => {
    oneLevels(level.id)
    checkProgress(level.id);
})

openSection()

//robyshow
showRoby()
let robyCodeTotal = document.getElementById("robyCodeTotal");
function showRoby(){
    fetch('/api/roby/show')
    .then(response => response.json())
    .then(totalRoby => {
       robyCodeTotal.innerHTML = totalRoby;
    })
}
//window.openLevels = openLevels
window.showRoby = showRoby;
window.openSection = openSection;
window.clickLevel = clickLevel;
window.oneLevels = oneLevels;
window.changeSituation = changeSituation;
window.checkProgress = checkProgress;

//window.checkSection = checkSection;

//version Beta 1