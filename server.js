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

//client-to-website connection scripts
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
        db.query("SELECT EventId FROM "+currentUser.toLowerCase(), (err, tab_files)=>{
            socket.emit('clr_table', val)
            const completed_array = []
            db.query("SELECT Completed from "+currentUser.toLowerCase(), (err, results)=>{
                const Completed_list = results
            
            console.log(Completed_list)
            Completed_list.forEach(completion=>{
                completed_array.push(Completed_list[0].Completed)
            })
            let cells = []
            let completed = []
            if(tab_files.length > 0){
                tab_files.forEach(EventId=>{
                    db.query("SELECT players.Name, events.Event FROM players JOIN events ON players.PlayerId = events.PerformerId WHERE events.EventId = ?", [EventId['EventId']], (err, events)=>{
                        if(cells.length<6){
                            event_string = ''+events[0].Name+' '+events[0].Event
                            cells.push(event_string)
                            completed.push(completed_array.shift())
                            console.log(completed)

                        }else{
                            full_tab_data = [cells, completed]
                            socket.emit('table_row', full_tab_data)
                            cells = []
                            completed = []
                    }})
            })
            }
        })

        
        });
    });



   
    
});


server.listen(3000, () => {
    console.log('Serwer działa na http://localhost:3000');
})
