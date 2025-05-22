const socket = io();
//socket - locking in server

//text scaling
function text_scalling(){
    const buttons = document.querySelectorAll('td button');
    const dpr = window.devicePixelRatio || 1;
  
    buttons.forEach(button => {
      // Reset styles first
      button.style.fontSize = '50';
      button.style.lineHeight = '1';
      button.style.whiteSpace = 'normal';
      button.style.overflow = 'hidden';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.textAlign = 'center';
      button.style.padding = '1vw';
      let fontSize = 20;
  
      button.style.fontSize = fontSize + 'px';
  
      const parent = button.parentElement;
      const maxWidth = parent.clientWidth;
      const maxHeight = parent.clientHeight;
  
      while (
        (button.scrollWidth > maxWidth|| button.scrollHeight > maxHeight) &&
        fontSize > 5
      ) {
        fontSize -= 4;
        button.style.fontSize = fontSize + 'px';
      }
    });
  }

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
        bingo_button.style.cssText = 'width: 18vw; aspect-ratio: 1/1; border: none; border-radius: 100%; background-color: #ffffff;'
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
            let performer = row.split(' ')[0]
            socket.emit('bingo_button_click', update_button_data)
            made_event_data = [currentUser, performer]
            socket.emit('event_made', made_event_data)

        })
        td.appendChild(bingo_button)
        tr.appendChild(td)
    
    })
    table1.appendChild(tr)
    text_scalling()
})


//top_scorers
let intervalId = setInterval(function() {
    x = 'True'
    socket.emit('toplistupdater', x)
},3000)

socket.on('top_table', (top_scorers) =>{
    document.getElementById('t3').innerHTML = '<tr><td colspan="2" >BEST SCORES</td></tr>'
    const score_table = document.getElementById('t3')
    top_scorers.forEach(row=>{

        let tr = document.createElement('tr')
        let td_name = document.createElement('td')
        let td_score = document.createElement('td')
        td_name.textContent = row['Name']
        td_score.textContent = row['Score']
        tr.appendChild(td_name)
        tr.appendChild(td_score)
        score_table.appendChild(tr)
    })
})


//actual events table updater
socket.on('events_table_update', (made_event_data) => {
    const text_input = made_event_data[1] + ' wykonał zadanie dla ' + made_event_data[0];
    const event_table = document.getElementById('t4');
    const event_table_rows = event_table.getElementsByTagName('tr');

    const new_tr = document.createElement('tr');
    const new_td = document.createElement('td');
    new_td.textContent = text_input;
    new_tr.appendChild(new_td);

    if (event_table_rows.length >= 3) {
        // Remove the last row (oldest)
        event_table.removeChild(event_table_rows[event_table_rows.length - 1]);
    }

    // Always insert the new row at the top
    event_table.insertBefore(new_tr, event_table_rows[0] || null); // fallback if table is empty
});



socket.on('login-failed', () => {
    alert('Nieprawidłowy login');
});

