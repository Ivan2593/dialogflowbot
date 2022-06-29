const fetch = require('node-fetch');
let url = 'http://10.2.90.96:8080/1-1.0-SNAPSHOT'

function get_student_info(name){
    return fetch(`${url}/student/getInfo?name=${name}`, {
        headers: {
            'type-content': 'application/json',
            'Accept': 'application/json'
        },
        method: 'GET'
    }).then(r => r.json()).then(r => r);
}
module.exports.getStudentSupervisorName = function (name){
    return get_student_info(name).result[0].supervisor_name;
}

module.exports.getStudentDegreeTheme = function (name){
    return get_student_info(name).result[0].topic;
}

module.exports.getStudentTimeDefend = function (name){
    return get_student_info(name).result[0].date;
}

function get_supervisor_info(name){
    return fetch(`${url}/supervisor/getInfo?name=${name}`,{
        headers:{
            'type-content': 'application/json',
            'Accept': 'application/json'
        },
        method: 'GET'
    }).then(r=> r.json()).then(r=>r);
}

module.exports.getSupervisorTimeDefend = function (name){
    return get_supervisor_info(name).result[0].date;
}

module.exports.getSupervisorStudentList = function (name){
    let s = "Список студентов с темами их работ:\n";
    for (let i = 0; i<get_supervisor_info(name).result[0].students.length; i++){
        s = s + `${i+1}. ${get_supervisor_info(name).result[0].students[i].student_name} (${get_supervisor_info(name).result[0].students[i].topic})\n`
    }
    return s;
}