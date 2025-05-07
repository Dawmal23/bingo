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
    document.getElementById('napis').textContent = 'Gracz: '+currentUser;
    socket.emit('table_fill', currentUser)
});

//users bingo table creation
socket.on('table_row', (full_tab_data) =>{
    let cells = full_tab_data[0]
    let completed = full_tab_data[1]
    const table1 = document.getElementById('tabeleczka')
    let tr = document.createElement('tr')
    
    
    cells.forEach(row=>{
        let td = document.createElement('td')
        let bingo_button = document.createElement('button')
        bingo_button.textContent = row
        
        if(completed.shift()==1){
            bingo_button.style.backgroundColor = rgb(133, 255, 188)
            bingo_button.disabled = True
        }
        bingo_button.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 10%; background-color: #ffffff;'

        td.appendChild(bingo_button)
        tr.appendChild(td)
    })
    console.log(tr)
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
