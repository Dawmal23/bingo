const socket = io();
//socket - locking in server


//main table clearing
socket.on('clr_table', (val =>{
    document.getElementById('tabeleczka').innerHTML = ''
}))

//logging table setting
socket.on('nicks', (nick =>{
    
    const table1 = document.getElementById('tabeleczka')
    let tr = document.createElement('tr')
    let td = document.createElement('td')
    td.classList.add('login_content')
    td.textContent = nick
    td.addEventListener('click', ()=>
        socket.emit('tab_creation', nick)
    )
    tr.appendChild(td)
    table1.appendChild(tr)
}))

//user setting
socket.on('currentUser', (currentUser) => {
    let user_menu = document.getElementById('napis')
    user_menu.textContent = 'Gracz: '+currentUser;
    user_menu.dataset.tag = currentUser
    document.getElementById('stylesheet').href = 'style-gra.css'
    socket.emit('table_fill', currentUser)
});

//users bingo table creation/edition
socket.on('table_row', (full_tab_data) =>{
    let cells = full_tab_data[0]
    let completed = full_tab_data[1]
    let events_ids = full_tab_data[2]

    const table1 = document.getElementById('tabeleczka')
    let tr = document.createElement('tr')
    
    
    cells.forEach(row=>{
        let td = document.createElement('td')
        let bingo_button = document.createElement('button')
        bingo_button.textContent = row
        bingo_button.setAttribute('id', events_ids.shift())
        let block_id = completed.shift()
        console.log(block_id)
        bingo_button.style.cssText = 'width: 20vw; aspect-ratio: 1/1; border: none; border-radius: 100%; background-color: #ffffff;'
        if(block_id==1){
            bingo_button.disabled = 'True'
            bingo_button.style.backgroundColor = 'rgb(133, 255, 188)'
            
        }
        bingo_button.addEventListener('click', () => {
            bingo_button.style.backgroundColor = 'rgb(133, 255, 188)'
            bingo_button.disabled = 'True'
            let completion_click = 1
            let completion_id = bingo_button.id
            let currentUser = document.getElementById('napis').dataset.tag
            let update_button_data = []
            update_button_data.push(completion_click)
            update_button_data.push(completion_id)
            update_button_data.push(currentUser)
            socket.emit('bingo_button_click', update_button_data)

        })
        td.appendChild(bingo_button)
        tr.appendChild(td)
    })
    table1.appendChild(tr)
})


//W.I.P.
socket.on('update-punkty', (punkty) => {
    document.getElementById('punkty').textContent = punkty;
});

socket.on('update-licznik', (licznik) => {
    document.getElementById('licznik').textContent = licznik;
});

socket.on('login-failed', () => {
    alert('Nieprawidłowy login');
});
