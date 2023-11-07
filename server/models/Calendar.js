var db = require('../database/dbConection');

class Calendar {
    constructor(){
        db.serialize(() => {
            try{
                db.run('BEGIN TRANSACTION');
            
                db.run(`
                    CREATE TABLE IF NOT EXISTS event 
                        (
                            id INT PRIMARY KEY AUTOINCREMENT, 
                            title TEXT,
                            description TEXT
                            date DATE,
                            time TIME
                        )
                `);
                
                db.run('COMMIT');
                resolve();
            } catch(e){
                db.run('ROLLBACK');
                reject();
            }
        });
    }

    static getCalendarEvent(){
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM event', (err, rows) => {
                if (err) {
                    reject(err)
                }
                resolve(rows)
            });
        })
    }

    static setCalendarEvent(event){
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                try{
                    db.run('BEGIN TRANSACTION');
                
                    db.run(`
                        INSERT INTO event 
                            (id, title, description, date, time)
                        VALUES 
                            (?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            title = ?,
                            description = ?,
                            date = ?,
                            time = ?
                        `, [
                            event.id,
                            event.title,
                            event.description,
                            event.date,
                            event.time,
                            event.title,
                            event.description,
                            event.date,
                            event.time,
                        ]
                    );
                    
                    db.run('COMMIT');
                    resolve();
                } catch(e){
                    db.run('ROLLBACK');
                    reject();
                }
            });
            resolve();
        })
    } 
}
module.exports = Calendar;