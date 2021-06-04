
const notes =  document.querySelector('#note');
const addnote = document.querySelector('#add-note');

//render notes
function renderNotes(doc){
    let li = document.createElement('li');
    let note = document.createElement('span');
    let time = document.createElement('span');
    let cross = document.createElement('div');
    
    li.setAttribute('data-id', doc.id);

    note.textContent = doc.data().note;
    time.textContent = doc.data().time;
    cross.textContent = 'x';

    li.appendChild(note);
    li.appendChild(time);
    li.appendChild(cross);

    notes.appendChild(li);

    //data remove
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('notes').doc(id).delete();
    })
}

//adding data
addnote.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('notes').add({
        note: addnote.note.value,
        time: addnote.time.value
    })
    addnote.note.value="";
    addnote.time.value="";
})

/*
//data fetch
db.collection('notes').orderBy('time').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderNotes(doc);
    })
})
*/

// real time fetch
db.collection('notes').orderBy('time').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderNotes(change.doc);
        }
        else if(change.type == 'removed'){
            let del = notes.querySelector('[data-id=' + change.doc.id + ']');
            notes.removeChild(del);
        }
    })
})