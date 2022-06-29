const dialogflow = require("@google-cloud/dialogflow");
const sessionClient = new dialogflow.SessionsClient();
const api = require('./api.js');

let role = {
    student: ["Дробышевский Иван Александрович"],
    scientific_supervisor: ["Пальчунов Дмитрий Евгеньевич"],
    secretary: ["Олейник Алина Олеговна"],
}
let roleName = {
    student: "студент",
    scientific_supervisor: "научный руководитель",
    secretary: "секретарь",
    none: "none"
}

let nowRole = roleName.none;
let nowName = null
function getRole(name){
    for (let i in role.student){
        if (role.student[i].toUpperCase() === name.toUpperCase()){
            nowName = role.student[i];
            return roleName.student
        }
    }
    for (let i in role.scientific_supervisor){
        if (role.scientific_supervisor[i].toUpperCase() === name.toUpperCase()){
            nowName = role.scientific_supervisor[i];
            return roleName.scientific_supervisor
        }
    }
    for (let i in role.secretary){
        if (role.secretary[i].toUpperCase() === name.toUpperCase()){
            nowName = role.secretary[i];
            return roleName.secretary
        }
    }
    nowName = null;
    return roleName.none
}
module.exports.intent = async function (projectId, sessionId, message, languageCode){
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );
    let contexts;
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message.text,
                languageCode: languageCode,
            },
        },
    };
    if (contexts && contexts.length > 0) {
        request.queryParams = {
            contexts: contexts,
        };

    }

    const responses = await sessionClient.detectIntent(request);
    let out = responses[0].queryResult.fulfillmentText;
    console.log(out)
    let myIntent = responses[0].queryResult.intent.displayName;
    contexts = responses[0].queryResult.parameters;
    if (nowRole === 'none' && myIntent!=='Default Fallback Intent' && myIntent!=='Default Welcome Intent' && myIntent!=='getRole' && myIntent!=='Goodbye'){
        out = 'У вас нет прав. Сначала представтесь.'
        return out;
    }
    if (myIntent === 'getRole'){
        let name = contexts.fields.name.stringValue;

        nowRole = getRole(name)
        if (nowRole !== roleName.none){
            out = `Добро пожаловать, ${nowRole}: ${nowName}!`
            return out
        } else {
            out = `В моих списках вас нет. Проверьте правильность данных.`
            return out
        }
    }
    if (myIntent === 'getPossibility'){
        if (nowRole === roleName.student){
            out = `Вы можете узнать тему своего диплома, дату защиты, полное имя своего научного руководителя, а также получить шаблоны требуемых документов.`
            return out
        }
        if (nowRole === roleName.scientific_supervisor){
            out = `Вы можете узнать дату защиты дипломной работы, список своиз студентов, а также темы их работ.`
            return out
        }
        if (nowRole === roleName.secretary){
            out = `Вы можете узнать дату защиты дипломной работы, получить шаблоны требуемых документов, а также изменять информацию.`
            return out
        }
    }
    if (myIntent === 'getTimeDefend'){
        out = `Дата защиты дипломной работы: ${api.getStudentTimeDefend(nowName)}`
        return out
    }
    if (myIntent === 'setTimeDefend'){
        /*if (nowRole === roleName.secretary){
            if (contexts.fields.date.listValue.values.length>0){
                defendTime = contexts.fields.date.listValue.values[0].stringValue.substring(0,10);
            }
        } else {*/
            out = 'Мне очень жаль, но у вас нет прав.'
            return out;
        //}
    }
    if (myIntent === 'getSupervisorName') {
        if (nowRole === roleName.student){
            out = `${api.getStudentSupervisorName(nowName)}`
            return out
        } else {
            out = 'Мне очень жаль, но у вас нет прав.'
            return out;
            }
    }
    if (myIntent === 'getDegreeTheme') {
        if (nowRole === roleName.student){
            out = `Тема вашей ВКР: ${api.getStudentDegreeTheme(nowName)}`
            return out
        } else {
            out = 'Мне очень жаль, но у вас нет прав.'
            return out;
        }
    }
    if (myIntent === 'getStudentsList') {
        if (nowRole === roleName.scientific_supervisor){
            out = api.getSupervisorStudentList(nowName)
            return out
        } else {
            out = 'Мне очень жаль, но у вас нет прав.'
            return out;
        }
    }

    if (myIntent === 'Goodbye'){
        nowRole = roleName.none
        nowName = null
    }

    return out
}