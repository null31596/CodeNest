
   //showLoader(true)
    //charcter animation
    //time
    let timer = null;
    let startTime = 0;
    let isRunning = false;
    let elapsdTime = 0;


    const timeStart = () => {
        if (!isRunning) {
            startTime = Date.now();
            timer = setInterval(timeUpdate, 10)
            isRunning = true;


        }

    }
    const timeStop = () => {
        if (isRunning) {
            clearInterval(timer)
            elapsdTime = Date.now() - startTime;
            isRunning = false
        }
    }

    function timeUpdate() {
        elapsdTime = Date.now() - startTime


        let hour = Math.floor(elapsdTime / (1000 * 60 * 60))

        let minut = Math.floor(elapsdTime / (1000 * 60) % 60)
        let second = Math.floor(elapsdTime / 1000 % 60)
        let timeSave = `${hour}:${minut}:${second}`
        localStorage.setItem('timeKye', timeSave)
        localStorage.setItem('timeStatue', isRunning)
        document.getElementById('infoTimeContent').innerHTML = minut + ':' + second;

    }
    timeStart()

    //progress bar
    import * as acorn from "https://cdn.jsdelivr.net/npm/acorn@8.12.1/+esm";

    var stageline = new ProgressBar.Line(stageBar, {
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
    stageline.animate(0.5)

    // stage 1
    let editor;

    require(['vs/editor/editor.main'], function () {

        editor = monaco.editor.create(document.getElementById('editor'), {
            value: '',
            language: "javascript",
            theme: "vs-dark"

        });

    });
    let logs = ""
    const runSubmit = () => {

        const code = editor.getValue();
        const output = document.getElementById('output');
        output.textContent = "";

        const originalLog = console.log;
        console.log = function (...args) {
            originalLog.apply(console, args);
            let answer = args.join(" ");
            output.textContent += args.join(" ") + '\n';
            //logs;
            logs = answer


        };

        try {
            eval(code);
        } catch (err) {
            output.textContent += " error: " + err.message;
        }

        console.log = originalLog;
        //return logs
    };

    // //Switch between stages ===> SBS
    let i = 1;
    let stage_dis = document.querySelectorAll('.stage')
    for (let i = 0; i < stage_dis.length; i++) {
        if (i == 0) {
            stage_dis[i].style.display = 'flex'
        } else {
            stage_dis[i].style.display = 'none'
        }
    }
    async function fetchWithRetryGet(url, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                let response = await fetch(url);
                if (!response.ok) throw new Error("HTTP status " + response.status);
                const text = await response.text();
                try {
                    return JSON.parse(text);
                } catch (jsonErr) {
                    return text;
                }
            } catch (err) {
                console.error(` the try ${i + 1} is fable  ${err.message}`);
                if (i < retries - 1) {
                    console.log(` try again after ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                } else {
                    throw new Error(" All attempts to fetch failed");
                }
            }
        }
    }

    async function fetchWithRetryPost(url, options, retries = 3, delay = 200) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(" Server returned " + response.status);
                }
                const text = await response.text();
                try {
                    return JSON.parse(text);
                } catch (jsonErr) {
                    return text;
                }
            } catch (err) {
                if (i < retries - 1) {
                    console.warn(` Request failed. Retrying in ${delay}ms... (${retries - i - 1} left)`);
                    await new Promise(res => setTimeout(res, delay));
                } else {
                    throw err;
                }
            }
        }
    }
    function comparaitionSystem() {


        fetchWithRetryGet('/api/comparaition/correct/answer', 5, 50)
            .then(correctAnswerConsole => {
                fetchWithRetryGet('/api/comparaition/user', 5, 50)
                    .then(userAnswerImported => {
                        fetchWithRetryGet('/api/answer/editor', 5, 50)
                            .then(answerEditor => {
                                function sameCode(userCode, correctCode) {
                                    try {
                                        const userAST = acorn.parse(userCode, { ecmaVersion: 2020 });
                                        const correctAST = acorn.parse(correctCode, { ecmaVersion: 2020 });
                                        function normalizeAST(ast) {
                                            return JSON.stringify(ast, (key, value) => {
                                                if (key === 'start' || key === 'end') {
                                                    return undefined;
                                                }
                                                if (key === 'raw') {
                                                    return undefined;
                                                }

                                                if (typeof value === 'string') {
                                                    return value.replace(/\s+/g, ' ').trim().toLowerCase();
                                                }
                                                return value;
                                            });
                                        }
                                        let correctSound = new Audio('sounds/success_playful.wav');
                                        let errorSound = new Audio('sounds/error_soft.wav');
                                        correctSound.preload = 'auto';
                                        errorSound.preload = 'auto';


                                        document.body.addEventListener('click', function preloadSoundsOnce() {
                                            correctSound.play().then(() => {
                                                correctSound.pause();
                                                correctSound.currentTime = 0;
                                            }).catch(() => { });
                                            errorSound.play().then(() => {
                                                errorSound.pause();
                                                errorSound.currentTime = 0;
                                            }).catch(() => { });

                                            document.body.removeEventListener('click', preloadSoundsOnce);
                                        });
                                        const normUserAST = normalizeAST(userAST);
                                        const normCorrectAST = normalizeAST(correctAST);
                                        console.log(userCode[0])
                                        if (normUserAST === normCorrectAST) {
                                            fetchWithRetryPost('/api/answer/correction', {
                                                method: 'POST',
                                                headers: {
                                                    'content-type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    correctIdx: 'correct'
                                                })

                                            })

                                                .then(data => {

                                                    if (typeof data === 'string') {
                                                        console.log(' Response (text):', data)
                                                    } else {
                                                        console.log(' Response (json):', JSON.stringify(data))
                                                    }
                                                })
                                                .catch(err => console.error(' Error posting correction:', err.message));

                                            questionUpdate()
                                            answerAnimStart('good job', ' #62e268', 'I trust you can continue', '#62e268', correctSound)
                                            // openNextLevel()

                                        } else if (userCode[0] === "") {

                                            fetchWithRetryPost('/api/answer/correction', {
                                                method: 'POST',
                                                headers: {
                                                    'content-type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    correctIdx: 'correct'
                                                })


                                            })

                                                .then(data => {

                                                    if (typeof data === 'string') {
                                                        console.log(' Response (text):', data)
                                                    } else {
                                                        console.log(' Response (json):', JSON.stringify(data))
                                                    }
                                                })
                                                .catch(err => console.error(' Error posting correction:', err.message));
                                            stopCharacterMove()
                                            questionUpdate()

                                            /////////////////////////////////////////
                                        }
                                        else {

                                            fetchWithRetryPost('/api/answer/uncorrection', {
                                                method: 'POST',
                                                headers: {
                                                    'content-type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    correctIdx: 'uncorrect'
                                                })
                                            })
                                                .then(data => {
                                                    if (typeof data === 'string') {
                                                        console.log(' Response (text):', data)
                                                    } else {
                                                        console.log(' Response (json):', JSON.stringify(data))
                                                    }
                                                })
                                                .catch(err => console.error(' Error posting uncorrection:', err.message));
                                            questionUpdate()
                                            // openNextLevel()
                                            answerAnimStart('wrong answer', 'red', 'try again', 'red', errorSound)

                                        }
                                    } catch (e) {

                                    }
                                }
                                let test1 = answerEditor;
                                let test2 = editor.getValue();
                                sameCode(test1, test2)
                            })
                            .catch(err => console.error(' Error fetching /api/answer/editor:', err.message));
                    })
                    .catch(err => console.error(' Error fetching /api/comparaition/user:', err.message));
            })
            .catch(err => console.error(' Error fetching /api/comparaition/correct/answer:', err.message));



    }

    const setSubmit = () => {
        document.getElementById('submitText').style.display = 'none';
        document.getElementById('submitSpinner').style.display = 'inline-block';
        document.getElementById('stageSubmit').style.pointerEvents = 'none'
        document.getElementById('stageSubmit').style.opacity = '0.2';

        fetch('/api/user/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userAnswer: logs })
        })
        if (document.getElementById('submitText').textContent === 'Finish') {
            showLoader(true);
            addRoby();
            addXP();
        }




        fetch('/api/character/cutSeen')
            .then(response => response.json())
            .then(cutSeen => {

            })
        comparaitionSystem()


    }
    function hideSubmitSpinner() {
        document.getElementById('submitText').style.display = 'inline-block';
        document.getElementById('submitSpinner').style.display = 'none';
        document.getElementById('stageSubmit').style.pointerEvents = 'auto'
        document.getElementById('stageSubmit').style.opacity = '1';

    }
    function questionUpdate() {

        fetchWithRetryGet('/api/last/level', 5, 50)

            .then(stageQuestion => {

                fetchWithRetryGet('/api/comletionStage', 5, 50)

                    .then(completionStage => {
                        fetchWithRetryGet('/api/character/cutSeen', 5, 50)
                            .then(cutSeen => {

                                let found = false;
                                for (let i = 0; i < stageQuestion.length; i++) {

                                    if (i === 0 && !completionStage[i]) {

                                        // document.getElementById('question').textContent = stageQuestion[i]

                                        if (cutSeen[0] === true) {
                                            hideSubmitSpinner()
                                            characterMove();
                                            characterSystem(i)


                                        } else {

                                            stopCharacterMove();
                                        }
                                        found = true;
                                        break;


                                    } else if (completionStage[i - 1] === true && completionStage[i] === false) {
                                        //   document.getElementById('question').textContent = stageQuestion[i]
                                        if (cutSeen[i] === true) {
                                            hideSubmitSpinner()

                                            characterMove();
                                            characterSystem(i)

                                        } else {

                                            stopCharacterMove()
                                        }
                                        found = true;
                                        break
                                    }

                                }
                                if (!found) {
                                    document.getElementById('question').textContent = "كل المراحل مكتملة!";

                                    characterMove();
                                    characterSystem(i)

                                    window.location.href = 'CodeNest.html';
                                }

                            })
                    })
            })
    }
    function characterMove() {
        if (!window.endOfAnim) {
            let character_box = document.querySelector('.character_box');
            let character_dialog = document.querySelector('.character_dialog');
            if (character_box) character_box.classList.add('animation');
            if (character_dialog) character_dialog.classList.add('animation');
            document.getElementById('stageSubmit').style.pointerEvents = 'none';

            document.getElementById('stageSubmit').style.opacity = '0.5';
        }

    }

    function stopCharacterMove() {
        let character_box = document.querySelector('.character_box');
        let character_dialog = document.querySelector('.character_dialog');
        if (character_box) character_box.classList.remove('animation');
        if (character_dialog) character_dialog.classList.remove('animation');
        document.getElementById('stageSubmit').style.pointerEvents = 'auto';
        document.getElementById('stageSubmit').style.opacity = '1';
    }
    let dialog = [];
    let characterImg = [];
    let text = '';
    let index = 0;
    const speed = 20;
    let clickNum = 0;
    let endOfAnim = false;
    let currentStage = 0;

    let character_box = document.querySelector('.character_box');
    let dialog_box = document.querySelector('.character_pargraphe');
    let character_dialog = document.querySelector('.character_dialog');


    function characterSystem(i) {
        fetchWithRetryGet('/api/character/dialog', 5, 50)
            // .then(response => response.json())
            .then(dialogData => {

                dialog = dialogData;
                
                fetchWithRetryGet('/api/character/img', 5, 50)
                    //.then(response => response.json())
                    .then(imgData => {
                        characterImg = imgData;
                        clickNum = 0;
                        currentStage = i;
                        typeWriter(0);
                        changCharater(0);

                    });
            });
    }

    if (!window.bodyClickAdded) {
        document.getElementById('body').addEventListener('click', function () {
            clickNum++;
            if (dialog[currentStage] && clickNum < dialog[currentStage].length) {
                typeWriter(clickNum);
                changCharater(clickNum);


            }
            if (dialog[currentStage] && clickNum === dialog[currentStage].length) {
                endOfAnim = true;
                stopCharacterMove();
                fetchWithRetryGet('/api/last/level', 5, 50)
                    .then(stageQuestion => {
                        fetchWithRetryGet('/api/comletionStage', 5, 50)

                            .then(completionStage => {
                                for (i = 0; i < stageQuestion.length; i++) {
                                    console.log(i)
                                    if (i === 0 && !completionStage[i]) {
                                        document.getElementById('question').textContent = stageQuestion[i]
                                        if (i === completionStage.length - 1) { document.getElementById('submitText').textContent = 'Finish'; timeStop() }
                                    } else if (completionStage[i - 1] === true && completionStage[i] === false) {
                                        document.getElementById('question').textContent = stageQuestion[i]
                                        if (i === completionStage.length - 1) { document.getElementById('submitText').textContent = 'Finish'; timeStop() }
                                    }
                                }
                            })
                        //console.log('end of animation'+'--->'+JSON.stringify(stageQuestion));

                    })

            }
        });
        window.bodyClickAdded = true;
    }

    function changCharater(clickNum) {
        document.querySelector('.character_box img').src = '../character/' + dialog[currentStage][clickNum].emotion;

    }

    function typeWriter(clickNum) {
        text = dialog[currentStage][clickNum].text + ' ';
        index = 0;
        dialog_box.innerHTML = "";
        writeChar();
    }

    function writeChar() {
        if (index < text.length) {
            dialog_box.innerHTML = text.slice(0, index + 1);
            index++;
            setTimeout(writeChar, speed);
        }
    }

    //characterSystem(0);
    questionUpdate()

    function answerAnimStart(text1Content, text1Color, text2Content, text2Color, soundEffect) {
        let sound = soundEffect;
        let answerStatus = document.getElementById('answerStatus');
        let answerStatusText = document.getElementById('answerStatusText');
        let answerStatusText2 = document.getElementById('answerStatusText2');
        answerStatusText.innerHTML = text1Content;
        answerStatusText.style.color = text1Color;
        answerStatusText2.innerHTML = text2Content;
        answerStatusText2.style.color = text2Color;

        sound.volume = 1;
        sound.currentTime = 0;
        sound.play().catch(e => {
            console.warn('لم يتم تشغيل الصوت:', e.message);
        });

        answerStatus.classList.add('animation');
        setTimeout(() => {
            answerStatus.classList.remove('animation');
            answerStatus.classList.add('EndAnimation');
            setTimeout(() => {
                answerStatus.classList.remove('EndAnimation');
            }, 1000);
        }, 2000);
    }
    document.getElementById('stageExit').addEventListener('click', () => {
        window.location.href = 'CodeNest.html'
    })
    //document.addEventListener('click',() =>{
    //  let soundTest = new Audio('sounds/error_soft.wav')
    //  soundTest.currentTime = 0;
    //  soundTest.play()
    //})
    //window.openNextLevel = openNextLevel


    // add roby
    let robyContent = document.getElementById('infoRobyContent');

    
    function addRoby() {
        fetch('/api/robyCode')
            .then(response => response.json())
            .then(roby => {
                let robyReward = roby[roby.length - 1];
                //////////////////////////////////////////
                // her its be the roby discount function//
                //////////////////////////////////////////
                robyContent.innerHTML = JSON.stringify(robyReward);

                fetch('/api/store/roby', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({robyReward})
                })
            })

    }
    //add XP 
    
    let XPContent = document.getElementById('infoXPContent');
    function addXP(){
        
        fetch('/api/XP')
        .then(response => response.json())
        .then(XP => {
            let XPReward = XP[XP.length-1];
          
            /////////////////////////////////////////
            // her its be the XP discount function //
            /////////////////////////////////////////
          XPContent.innerHTML = JSON.stringify(XPReward)
          fetch('/api/store/XP',{
              method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({XPReward})
        
          })
        })
    }
    window.characterMove = characterMove
    window.comparaitionSystem = comparaitionSystem
    window.questionUpdate = questionUpdate
    window.runSubmit = runSubmit
    window.setSubmit = setSubmit

