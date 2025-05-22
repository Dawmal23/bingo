//data manipulation variables
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));


//database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bingo'
});

//client-website connection scripts
io.on('connection', (socket) => {

    //login table creation
    console.log('Nowe połączenie:', socket.id);
    let val=''
    socket.emit('clr_table', val)
    db.query("SELECT Name FROM players", (err, rows) => {
        if (rows.length > 0) {
            let nicks = ''
            rows.forEach(nick=>{
                socket.emit('nicks', nick['Name'])
            })


        } else {
            socket.emit('login-failed');
        }
    })

    //bingo table creation and filling
    socket.on('tab_creation', (currentUser) => {
        db.query('CALL `bingo`.`Create_Bingo_Card`(?)', [currentUser])
        db.query('SELECT COUNT(*) as counter from '+currentUser.toLowerCase(), (err, if_made)=>{
            if(if_made[0].counter<=0){
                db.query('CALL `bingo`.`Fill_Bingo_Card`(?)', [currentUser])
            }
            socket.emit('currentUser', currentUser)
        })
    });
    socket.on('table_fill', (currentUser) =>{

        db.query("SELECT EventId FROM "+currentUser.toLowerCase()+" ORDER BY id ASC", (err, tab_files)=>{
            socket.emit('clr_table', val)
            const completed_array = []
            db.query("SELECT Completed from "+currentUser.toLowerCase(), (err, results)=>{
                const Completed_list = results
                Completed_list.forEach(completion=>{
                    completed_array.push(completion['Completed'])
            })
            let cells = []
            let completed = []
            let events_ids = []

            if(tab_files.length > 0){
                tab_files.forEach(EventId=>{
                    db.query("SELECT players.Name, events.Event, events.EventId FROM players JOIN events ON players.PlayerId = events.PerformerId WHERE events.EventId = ?", [EventId['EventId']], (err, events)=>{
                        if(cells.length<5){
                            event_string = ''+events[0].Name+' '+events[0].Event
                            cells.push(event_string)
                            let event_id = events[0].EventId
                            events_ids.push(event_id)
                            completed.push(completed_array.shift())
                        }else{
                            full_tab_data = [cells, completed, events_ids]
                            socket.emit('table_row', full_tab_data)
                            cells = []
                            completed = []
                            events_ids = []
                            event_string = ''+events[0].Name+' '+events[0].Event
                            cells.push(event_string)
                            let event_id = events[0].EventId
                            events_ids.push(event_id)
                            completed.push(completed_array.shift())
                            
                        }
                        if(completed_array.length==0){
                            full_tab_data = [cells, completed, events_ids]
                            socket.emit('table_row', full_tab_data)
                        }
                })

            })
            }
        })

        
        });
    });

    //button update functions
    socket.on('bingo_button_click', (update_button_data) =>{
        let completion_click = update_button_data[0]
        let completion_id = update_button_data[1]
        let currentUser = update_button_data[2]
        db.query("UPDATE "+currentUser.toLowerCase()+" SET Completed=1 WHERE EventId="+completion_id)
        db.query("UPDATE players SET Score=(SELECT COUNT(*) FROM "+currentUser.toLowerCase()+" WHERE Completed=1) WHERE Name='"+currentUser+"'")
    })


    //toplist update function
    socket.on('toplistupdater', (x) =>{
        db.query("SELECT Name, Score FROM players ORDER BY Score DESC LIMIT 3;", (err, top_scorers)=>{
            socket.emit('top_table', top_scorers)
    })})


    //events performed
    socket.on('event_made', (made_event_data)=>{
        io.emit('events_table_update', made_event_data)
    })



   
    
});


server.listen(3000, () => {
    console.log('Serwer działa na http://localhost:3000');
})
