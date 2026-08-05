let express = require('express')
let path = require('path')
let app = express();
let fs = require('fs');
const PORT = process.env.PORT || 3001;
//let dataUser = []
//let dataUserObj = {
//  name: 'mohamed',
//  age: 25,
//  acount: 'exemple@gmail.com',
//  lastLevel: {
//    lastLevelIdx: 0
//  },
// "roby":0,
// "xp":0
//
//}
//
//dataUser.push(dataUserObj)
//fs.writeFileSync('dataUser.json', JSON.stringify(dataUser, null, 1), 'utf-8')


// Build the default (all-locked) level structure used to seed data.json the
// very first time the server runs. This used to also run unconditionally at
// the bottom of the file, which overwrote real player progress on every
// restart -- it is now only written when data.json does not exist yet.
if (!fs.existsSync('./data.json')) {
  const dataLevel = [];
  let levelnum = 7
  for (let i = 0; i < 1; i++) {

    let levelsArr = []

    for (let m = 0; m < levelnum; m++) {
      let levelname = 'level' + m;

      let levelObj = {
        [levelname]: {
          'status': 'locked',
          'progress': false,
          'xpAcquired': 50,
          'robyCode': 100
        }
      }
      levelsArr.push(levelObj)
    }

    let sectionName = 'section' + i;
    let dataObj = {
      [sectionName]: levelsArr,
      situation: 'locked',
      completion: false
    }
    dataLevel.push(dataObj);
  }

  fs.writeFileSync('./data.json', JSON.stringify(dataLevel, null, 2), 'utf-8');
}

let JSONImportData = require('./data.json');
let JSONImportDataUser = require('./dataUser.json');




// levels server
app.use(express.static(__dirname));
app.use(express.json());
const cors = require('cors');
const { request } = require('http');
app.use(cors({ origin: '*' }))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'CodeNest.html'))
})
const sectionName = 'section0';
const lastIdx = JSONImportDataUser[0].lastLevel.lastLevelIdx;

for (let i = 0; i < lastIdx; i++) {
  const levelName = 'level' + i;
  JSONImportData[0][sectionName][i][levelName].status = 'open';

}

fs.writeFileSync('data.json', JSON.stringify(JSONImportData, null, 2), 'utf-8');

// Also make sure the player's current level itself (not just the ones
// before it) is open.
{
  const currentLevelName = 'level' + lastIdx;
  if (JSONImportData[0][sectionName][lastIdx]) {
    JSONImportData[0][sectionName][lastIdx][currentLevelName].status = 'open';
  }
}
fs.writeFileSync('data.json', JSON.stringify(JSONImportData, null, 2), 'utf-8');

app.get('/api/levels', (request, response) => {

  const allStatus = []
  for (let i = 0; i < JSONImportData.length; i++) {
    const sectionName = 'section' + i;
    for (let m = 0; m < JSONImportData[i][sectionName].length; m++) {
      const levelName = 'level' + m;
      allStatus.push(JSONImportData[i][sectionName][m][levelName].status)
    }

  }

  response.json(allStatus)
})

app.get('/api/progress', (request, response) => {
  const allProgress = [];
  for (let i = 0; i < JSONImportData.length; i++) {
    const sectionName = 'section' + i;
    for (let m = 0; m < JSONImportData[i][sectionName].length; m++) {
      const levelName = 'level' + m;
      allProgress.push(JSONImportData[i][sectionName][m][levelName].progress);
    }
  }
  response.json(allProgress);
});

app.get('/api/completion/opened', (request, response) => {
  const openedComletion = [];
  for (let i = 0; i < JSONImportData.length; i++) {
    var sectionName = 'section' + i;
    openedComletion.push(JSONImportData[i].completion)
  }
  response.json(openedComletion);
})

// satage server
app.get('/api/last/level', (request, response) => {
  try {

    const JSONImportDataUser = require('./dataUser.json');
    const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
    const dataStage = 'levels/level' + levelLast + '.json';
    const JSONImportDataStage = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));

    let stageQuestion = []

    for (let i = 0; i < JSONImportDataStage.length; i++) {
      stageQuestion.push(JSONImportDataStage[i].question);


    }
    response.json(stageQuestion);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});
app.get('/api/last/level/id', (request, response) => {
  let lastLevelId = []
  const JSONImportDataUser = require('./dataUser.json');
  const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
  lastLevelId.push(levelLast)
  response.json(lastLevelId)

})
app.get('/api/comletionStage', (request, response) => {
  try {
    const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
    const levelLast = JSONImportDataUser[0]?.lastLevel?.lastLevelIdx;
    if (levelLast === undefined) {
      throw new Error('lastLevelIdx is missing in dataUser.json');
    }
    const dataStage = 'levels/level' + levelLast + '.json';
    if (!fs.existsSync(dataStage)) {
      throw new Error(`File not found: ${dataStage}`);
    }
    const JSONImportDataStage = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
    let completionStage = []
    for (let i = 0; i < JSONImportDataStage.length; i++) {
      completionStage.push(JSONImportDataStage[i].completionStage);

    }
    response.json(completionStage);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
})
app.post('/api/user/answer', (request, response) => {
  const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
  const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
  const dataStage = 'levels/level' + levelLast + '.json';
  const userAnswer = request.body;
  const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
  let nextIdx = 0;
  for (let i = 0; i < JSONImportDataStageUpdate.length; i++) {
    if (!JSONImportDataStageUpdate[i].completionStage) {
      nextIdx = i;
      break;
    }
  }
  if (JSONImportDataStageUpdate[nextIdx].completionStage) {
    return response.json({ message: 'كل المراحل مكتملة!' });
  }
  JSONImportDataStageUpdate[nextIdx].userAnswerDetect = userAnswer;
  fs.writeFileSync(dataStage, JSON.stringify(JSONImportDataStageUpdate, null, 1), 'utf-8')
  response.sendStatus(200)
})
app.post('/api/answer/correction', (request, response) => {
  const correctAnswer = request.body.correctIdx
  const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
  const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
  const levelIdx = levelLast;
  const lastLevelName = 'levels/level' + levelLast;
  const dataStage = 'levels/level' + levelLast + '.json';
  const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
  let nextIdx = 0;
  for (let i = 0; i < JSONImportDataStageUpdate.length; i++) {
    if (!JSONImportDataStageUpdate[i].completionStage) {
      nextIdx = i;
      break;
    }
  }
  if (JSONImportDataStageUpdate[nextIdx].completionStage) {
    return response.json({ message: 'كل المراحل مكتملة!' });
  }
  JSONImportDataStageUpdate[nextIdx].correction = correctAnswer;
  fs.writeFileSync(dataStage, JSON.stringify(JSONImportDataStageUpdate, null, 1), 'utf-8')
  if (JSONImportDataStageUpdate[nextIdx].correction === 'correct') {
    if (nextIdx === JSONImportDataStageUpdate.length - 1) {
      JSONImportDataStageUpdate[nextIdx].completionStage = true;
      JSONImportData[0]['section0'][levelIdx]['level' + levelIdx].progress = true//<-------
      if (JSONImportData[0]['section0'][levelIdx + 1]) {
        JSONImportData[0]['section0'][levelIdx + 1]['level' + (levelIdx + 1)].status = 'open';
      }
      JSONImportDataUser[0].lastLevel.lastLevelIdx = JSONImportDataUser[0].lastLevel.lastLevelIdx + 1;
      JSONImportData[0]['section0'][JSONImportDataUser[0].lastLevel.lastLevelIdx]['level' + JSONImportDataUser[0].lastLevel.lastLevelIdx].status = 'open';

      fs.writeFileSync('data.json', JSON.stringify(JSONImportData, null, 1), 'utf-8')
      fs.writeFileSync('dataUser.json', JSON.stringify(JSONImportDataUser, null, 1), 'utf-8')

    } else {
      JSONImportDataStageUpdate[nextIdx].completionStage = true;

    }
  }
  fs.writeFileSync(dataStage, JSON.stringify(JSONImportDataStageUpdate, null, 1), 'utf-8')
  response.sendStatus(200)


})
app.post('/api/answer/uncorrection', (request, response) => {
  try {
    const uncorrectAnswer = request.body.correctIdx;
    const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
    const levelLast = JSONImportDataUser[0]?.lastLevel?.lastLevelIdx;
    if (levelLast === undefined) throw new Error('lastLevelIdx is missing');
    const dataStage = 'levels/level' + levelLast + '.json';
    if (!fs.existsSync(dataStage)) throw new Error(`File not found: ${dataStage}`);
    const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
    let nextIdx = 0;
    for (let i = 0; i < JSONImportDataStageUpdate.length; i++) {
      if (!JSONImportDataStageUpdate[i].completionStage) {
        nextIdx = i;
        break;
      }
    }
    if (!Array.isArray(JSONImportDataStageUpdate) || !JSONImportDataStageUpdate[nextIdx]) throw new Error('Stage data missing');
    if (JSONImportDataStageUpdate[nextIdx].completionStage) {
      return response.json({ message: 'كل المراحل مكتملة!' });
    }
    JSONImportDataStageUpdate[nextIdx].correction = uncorrectAnswer;
    fs.writeFileSync(dataStage, JSON.stringify(JSONImportDataStageUpdate, null, 1), 'utf-8');
    if (JSONImportDataStageUpdate[nextIdx].correction === 'uncorrect') {
      JSONImportDataStageUpdate[nextIdx].completionStage = false;
    }
    fs.writeFileSync(dataStage, JSON.stringify(JSONImportDataStageUpdate, null, 1), 'utf-8')
    response.sendStatus(200);
  } catch (err) {

    response.status(500).json({ error: err.message });
  }
});
app.post('/api/Status/update', (request, response) => {
  const { sectionIndex, levelIndex, status, progress } = request.body;
  const sectionName = 'section' + sectionIndex;
  const levelName = 'level' + levelIndex;

  if (
    JSONImportData[sectionIndex] &&
    JSONImportData[sectionIndex][sectionName] &&
    JSONImportData[sectionIndex][sectionName][levelIndex] &&
    JSONImportData[sectionIndex][sectionName][levelIndex][levelName]
  ) {
    JSONImportData[sectionIndex][sectionName][levelIndex][levelName].status = status;
    //  JSONImportData[sectionIndex][sectionName][levelIndex][levelName].progress = progress;
    fs.writeFileSync('data.json', JSON.stringify(JSONImportData, null, 1), 'utf-8');
    response.sendStatus(200);
  } else {
    response.status(400).json({ error: 'Invalid section or level index' });
  }
})

app.post('/api/situation/update', (request, response) => {

  const { sectionIndexSituation, situation, completion } = request.body;
  // const sectionName = 'section' + sectionIndex;

  JSONImportData[sectionIndexSituation].situation = situation;

  fs.writeFileSync('data.json', JSON.stringify(JSONImportData, null, 1), 'utf-8')
  response.sendStatus(200);
})

app.post('/api/comletion/update', (request, response) => {

  const { sectionIndexSituation, situation, completion } = request.body;
  // const sectionName = 'section' + sectionIndex;


  JSONImportData[sectionIndexSituation].completion = completion;
  fs.writeFileSync('data.json', JSON.stringify(JSONImportData, null, 1), 'utf-8')
  response.sendStatus(200);
})

app.post('/api/open/one/level/in/sectionSelected', (request, response) => {
  const { sectionIndex, levelIndex, status, progress } = request.body
  const sectionName = 'section' + sectionIndex;
  const levelName = 'level' + levelIndex;

  JSONImportData[sectionIndex][sectionName][levelIndex][levelName].status = status;
  JSONImportData[sectionIndex][sectionName][levelIndex][levelName].progress = progress;
  fs.writeFileSync('data.json', JSON.stringify(JSONImportData, null, 2), 'utf-8')
  response.sendStatus(200);


})



app.get('/api/test/info', async (request, response) => {
  try {
    let info = [];
    const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
    const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
    const dataStage = 'levels/level' + levelLast + '.json';
    const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
    info.push(JSONImportDataUser, levelLast, dataStage, JSONImportDataStageUpdate);
    response.json(info);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});
app.get('/api/answer/editor', (req, response) => {
  try {
    const answerEditor = [];
    const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
    const levelLast = JSONImportDataUser[0]?.lastLevel?.lastLevelIdx;
    if (levelLast === undefined) {
      throw new Error('lastLevelIdx is missing in dataUser.json');
    }
    const stageFilePath = `levels/level${levelLast}.json`;
    if (!fs.existsSync(stageFilePath)) {
      throw new Error(`File not found: ${stageFilePath}`);
    }
    const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(stageFilePath, 'utf-8'));
    let nextIdx = 0;
    for (let i = 0; i < JSONImportDataStageUpdate.length; i++) {
      if (!JSONImportDataStageUpdate[i].completionStage) {
        nextIdx = i;
        break;
      }
    }
    if (JSONImportDataStageUpdate[nextIdx].completionStage) {
      return response.json({ message: 'كل المراحل مكتملة!' });
    }
    if (!Array.isArray(JSONImportDataStageUpdate) || !JSONImportDataStageUpdate[nextIdx]) {
      throw new Error('Stage data is missing or not an array');
    }
    if (typeof JSONImportDataStageUpdate[nextIdx].correctAnswerEditor === 'undefined') {
      throw new Error('correctAnswerEditor is missing in stage data');
    }
    answerEditor.push(JSONImportDataStageUpdate[nextIdx].correctAnswerEditor);
    response.json(answerEditor);
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});


app.get('/api/comparaition/correct/answer', (request, response) => {
  try {
    const correctAnswerConsoleArr = [];
    const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
    const levelLast = JSONImportDataUser[0]?.lastLevel?.lastLevelIdx;
    if (levelLast === undefined) {
      throw new Error('lastLevelIdx is missing in dataUser.json');
    }
    const dataStage = 'levels/level' + levelLast + '.json';
    if (!fs.existsSync(dataStage)) {
      throw new Error(`File not found: ${dataStage}`);
    }
    const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
    let nextIdx = 0;
    for (let i = 0; i < JSONImportDataStageUpdate.length; i++) {
      if (!JSONImportDataStageUpdate[i].completionStage) {
        nextIdx = i;
        break;
      }
    }
    if (JSONImportDataStageUpdate[nextIdx].completionStage) {
      return response.json({ message: 'كل المراحل مكتملة!' });
    }
    if (!Array.isArray(JSONImportDataStageUpdate) || !JSONImportDataStageUpdate[nextIdx]) {
      throw new Error('Stage data is missing or not an array');
    }
    if (typeof JSONImportDataStageUpdate[nextIdx].correctAnswerConsole === 'undefined') {
      throw new Error('correctAnswerConsole is missing in stage data');
    }
    correctAnswerConsoleArr.push(JSONImportDataStageUpdate[nextIdx].correctAnswerConsole);
    response.json(correctAnswerConsoleArr);
  } catch (err) {
    console.error('Error in /api/comparaition/correct/answer:', err.message);
    response.status(500).json({ error: err.message });
  }
});

app.get('/api/comparaition/user', (request, response) => {
  try {
    const userAnswerArr = [];
    const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
    const levelLast = JSONImportDataUser[0]?.lastLevel?.lastLevelIdx;
    if (levelLast === undefined) {
      throw new Error('lastLevelIdx is missing in dataUser.json');
    }
    const dataStage = 'levels/level' + levelLast + '.json';
    if (!fs.existsSync(dataStage)) {
      throw new Error(`File not found: ${dataStage}`);
    }
    const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
    let nextIdx = 0;
    for (let i = 0; i < JSONImportDataStageUpdate.length; i++) {
      if (!JSONImportDataStageUpdate[i].completionStage) {
        nextIdx = i;
        break;
      }
    }
    if (JSONImportDataStageUpdate[nextIdx].completionStage) {
      return response.json({ message: 'كل المراحل مكتملة!' });
    }
    const userAnswerDetect = JSONImportDataStageUpdate[nextIdx]?.userAnswerDetect;
    if (!userAnswerDetect || userAnswerDetect.userAnswer === undefined) {
      userAnswerArr.push(null);
    } else {
      userAnswerArr.push(userAnswerDetect.userAnswer);
    }
    response.json(userAnswerArr);
  } catch (err) {
    console.error('Error in /api/comparaition/user:', err.message);
    response.status(500).json({ error: err.message });
  }
});
app.get('/api/next/level/completionStage', (request, response) => {
  let comletionStageArr = []
  const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
  const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
  const dataStage = 'levels/level' + levelLast + '.json';
  const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
  comletionStageArr.push(JSONImportDataStageUpdate[JSONImportDataStageUpdate.length - 1].completionStage)
  response.json(comletionStageArr)
})

app.get('/api/character/dialog', (request, response) => {
  let dialog = []
  const JSONImportDataUser = require('./dataUser.json');
  const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
  const dataDialog = 'dialogs/dialog' + levelLast + '.json';
  const JSONImportDataDialog = JSON.parse(fs.readFileSync(dataDialog, 'utf-8'));
  const dataStage = 'levels/level' + levelLast + '.json';
  const JSONImportDataStage = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
  for (let i = 0; i < JSONImportDataStage.length; i++) {
    const stageId = JSONImportDataStage[i].stageId;
    let introId = 'intro' + i
    dialog.push(JSONImportDataDialog[introId])
  }
  response.json(dialog);

})
app.get('/api/character/img', (request, response) => {
  let characterimg = []
  const JSONImportDataUser = require('./dataUser.json');
  const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
  const dataDialog = 'dialogs/dialog' + levelLast + '.json';
  const JSONImportDataDialog = JSON.parse(fs.readFileSync(dataDialog, 'utf-8'));
  const dataStage = 'levels/level' + levelLast + '.json';
  const JSONImportDataStage = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
  for (let i = 0; i < JSONImportDataStage.length; i++) {
    const stageId = JSONImportDataStage[i].stageId;
    let introId = 'intro' + i
    const dialogArr = JSONImportDataDialog[introId];
    if (Array.isArray(dialogArr)) {
      dialogArr.forEach(item => {
        //console.log(item.emotion);
        characterimg.push(item.emotion)
      });
    }
    //characterimg.push(JSONImportDataDialog[introId])
    //console.log(JSONImportDataDialog[introId].emotion)
  }

  response.json(characterimg)
})

//app.get('/api/character/img', (request, response) => {
//  let characterimg = []
//  const JSONImportDataUser = require('./dataUser.json');
//  const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;  
//  const dataStage = 'levels/level' + levelLast + '.json';
//  const JSONImportDataStage = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
//  const dataDialog = 'dialogs/dialog' + levelLast + '.json';
//  const JSONImportDataCharacterImg = JSON.parse(fs.readFileSync(dataDialog, 'utf-8'))
//  for (let i = 0; i < JSONImportDataCharacterImg.length; i++) {
//    const idStage = JSONImportDataStage[i].stageId;
//    let introId = 'intro' + i;
//    console.log(JSONImportDataCharacterImg[introId].emotion)
//    characterimg.push(JSONImportDataCharacterImg[introId].emotion)
//    //JSONImportDataCharacterImg[introId].forEach(item => characterimg.push(item.emotion))
//  }
//
//  response.json(characterimg)
//})

app.get('/api/character/cutSeen', (request, response) => {
  let cutseenArr = []
  const JSONImportDataUser = JSON.parse(fs.readFileSync('dataUser.json', 'utf-8'));
  const levelLast = JSONImportDataUser[0].lastLevel.lastLevelIdx;
  const lastLevelName = 'levels/level' + levelLast;
  const dataStage = 'levels/level' + levelLast + '.json';
  const JSONImportDataStageUpdate = JSON.parse(fs.readFileSync(dataStage, 'utf-8'));
  for (let i = 0; i < JSONImportDataStageUpdate.length; i++) {
    cutseenArr.push(JSONImportDataStageUpdate[i].cutSeen)

  }

  response.json(cutseenArr)
})

app.get('/api/robyCode', (request, response) => {
  let robyArr = [];
  const sectionName = 'section0';
  const lastIdx = JSONImportDataUser[0].lastLevel.lastLevelIdx;

  for (let i = 0; i <= lastIdx; i++) {
    const levelName = 'level' + i;
    let roby = JSONImportData[0][sectionName][i][levelName].robyCode;
    robyArr.push(roby);

  }
  response.json(robyArr);
})
app.post('/api/store/roby', (request, response) => {
  const robyStore = request.body.robyReward;
  //fs.writeFileSync('dataUser.json', JSON.stringify(JSONImportDataUser, null, 1), 'utf-8')
  
  JSONImportDataUser[0].roby += robyStore;
  fs.writeFileSync('dataUser.json', JSON.stringify(JSONImportDataUser, null, 1), 'utf-8');
  response.sendStatus(200);

})
app.get('/api/roby/show', (request, response) => {
  let getRoby = [];
  let totalRoby = JSONImportDataUser[0].roby;
  getRoby.push(totalRoby);
  response.json(getRoby);
})
app.get('/api/XP', (request, response) => {
  const XPArr = [];
  const sectionName = 'section0';
  const lastIdx = JSONImportDataUser[0].lastLevel.lastLevelIdx;
 for(let i = 0; i<= lastIdx; i++){
  const levelName = 'level' +i;
  let XP = JSONImportData[0][sectionName][i][levelName].xpAcquired;
  XPArr.push(XP);

 }
 response.json(XPArr);
})
app.post('/api/store/XP', (request , response) =>{
  const XPStore = request.body.XPReward;
  
  JSONImportDataUser[0].xp += XPStore;
  
  fs.writeFileSync('dataUser.json', JSON.stringify(JSONImportDataUser, null, 1), 'utf-8');
  response.sendStatus(200);


})

// Error-handling middleware must be registered after all routes -- Express
// only routes errors to middleware defined after the route that threw.
app.use((err, req, res, next) => {
  console.error(' Express Uncaught Error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, "localhost", () => {
  console.log(`Server is running on port ${PORT}`);

  console.log('http://' + 'localhost' + ':' + PORT + '/CodeNest.html')
  console.log('http://' + 'localhost' + ':' + PORT + '/stage.html')

});