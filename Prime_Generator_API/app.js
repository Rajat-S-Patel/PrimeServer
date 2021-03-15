const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const db=require('./database');
const {Worker,workerData}= require('worker_threads');

// const {fork}=require('child_process');

// create an express app
const app=express();

// using morgan middleware for printing logging request details
app.use(morgan('dev'));

// using bodyparser middleware for parsing post request body
app.use(bodyParser.json());

// disabling caching
app.set('etag',false);

// allowing CORS, API can be called from any URL using POST and GET request
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','POST,GET');
        return res.status(200).json({});
    }
    next();
});

// handling GET request on /prime end point
app.get('/prime',(req,res)=>{
    run(req,res).catch(err=>console.log(err));
});

// handling POST request on /prime end point
app.post('/prime',(req,res)=>{
  run(req,res).catch(err=>console.log(err));  
});

// handling GET request on /view end point
app.get('/view',(req,res)=>{
    db.selectData(res);
});

// middleware for handling unsupported endpoints
app.use((req,res,next)=>{
    const err=new Error('Not supported');
    err.status=404;
    next(err);
});

// middleware for handling errors and sending back the response with 
// appropriate http status code
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    console.log('test');
    res.json({
        error:{
            message:err.message
        }
    });
});

// handling errors generated while computation
const errorHandle=(res,err)=>{
    res.status(err.status).json({
        error:{
            message:err.message
        }
    });
}

// using worker_thread mechanism to generate new thread
// each time the api is called for computation to prevent blocking of main thread
const compute=(workerData)=>{
    return new Promise((resolve,reject)=>{
        const worker=new Worker('./functions.js',{workerData});
        worker.on('message',resolve);
        worker.on('error',reject);
    });
}

const run=async(req,res)=>{
    const result=await compute({start:req.query.start,end:req.query.end,algo:req.query.algo});
    if(result.error){
        // if error is thrown during computation
        errorHandle(res,result.error);
    }
    else {
        // store the data in the database and send back the results of computation
        data=[req.query.start,req.query.end,result[1],result[2],result[0].length];
        db.insertData(data);
        res.status(200).json(result[0]);
    }
}

module.exports=app;