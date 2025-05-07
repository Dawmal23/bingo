const socket = io();




socket.on('clr_table', (val =>{
    document.getElementById('tabeleczka').innerHTML = ''
}))

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

socket.on('currentUser', (currentUser) => {
    document.getElementById('napis').textContent = 'Gracz: '+currentUser;
    console.log(currentUser)
});
socket.on('table_row', (cells) =>{
    const table1 = document.getElementById('tabeleczka')
    let tr = document.createElement('tr')
    
    console.log(cells)
    cells.forEach(row=>{
        let td = document.createElement('td')
        td.textContent = row
        tr.appendChild(td)
    })
    console.log(tr)
    table1.appendChild(tr)
}
)

socket.on('update-punkty', (punkty) => {
    document.getElementById('punkty').textContent = punkty;
});

socket.on('update-licznik', (licznik) => {
    document.getElementById('licznik').textContent = licznik;
});

socket.on('login-failed', () => {
    alert('Nieprawidłowy login');
});
