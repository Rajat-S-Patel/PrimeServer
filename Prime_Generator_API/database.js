const sqlite3=require('sqlite3').verbose();

// creating a new database connection
const db=new sqlite3.Database('./db/sample.db',(err)=>{
    if(err) 
        return console.error(err.message);
    console.log('connected');
});

// creating new table USERS if it doesn't exists
db.run('CREATE TABLE IF NOT EXISTS USERS(ID INTEGER PRIMARY KEY AUTOINCREMENT,'+
'TIMESTAMP DATETIME DEFAULT CURRENT_TIMESTAMP,START INTEGER,'+
'END INTEGER,TIMEELAPSED REAL,ALGORITHM TEXT,TOTALPRIMES INTEGER);',(err)=>{
    if(err)
        console.log(err.message);
    console.log('table created');
});

/**
 * Inserting data in the database 
 * @param {Array} data
 */
var insertData=(data)=>{
    data[0]=Number(data[0]);
    data[1]=Number(data[1]);
    let insert=db.prepare(`INSERT INTO USERS (START,END,TIMEELAPSED,ALGORITHM,TOTALPRIMES) VALUES(?,?,?,?,?)`);
    insert.run(data,(err)=>{
        if(err)
            console.log(err.message);
        else console.log('row inserted');
    });
    insert.finalize((err)=>{
        if(err)
            console.log(err.message);
    });
    
};

/**
 * Sending all data from USERS table to the client
 * @param {Object} res http response object 
 */
var selectData=(res)=>{
    let rows=[];
    db.each(`SELECT *FROM USERS`,(err,row)=>{
        if(err)
            console.log(err.message);
        rows.push(row);
    },(err,count)=>{
        res.status(200).json(rows);
    });
}

module.exports={
    insertData,
    selectData
}