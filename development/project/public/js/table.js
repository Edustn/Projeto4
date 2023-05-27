//This is only a test script that doesn't have any importance or link with our project

function addTableRows(){

let table = document.querySelector(".table-body");
for (let index = 0; index < 8; index++) {
    let row = table.insertRow(-1);

    let c0 = row.insertCell(0);
    let c1 = row.insertCell(1);
    let c2 = row.insertCell(2);
    let c3 = row.insertCell(3);
    let c4 = row.insertCell(4);
    let c5 = row.insertCell(5);
    let c6 = row.insertCell(6);
    let c7 = row.insertCell(7);
    let c8 = row.insertCell(8);
    let c9 = row.insertCell(9);

    c0.innerHTML="a"
    c1.innerHTML="b"
    c2.innerHTML="c"
    c3.innerHTML="d"
    c4.innerHTML="e"
    c5.innerHTML="f"
    c6.innerHTML="g"
    c7.innerHTML="h"
    c8.innerHTML="i"
    c9.innerHTML="j"
}

}

