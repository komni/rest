process.title = 'node_restful';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.sqlite');

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('public'));
 
app.get('/movie/:movieId', async (req, res)=>{
	const q = `select movieId,title,genres from movies where movieId = ${req.params.movieId}`;
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
});

app.get('/ratings/:userId',async (req,res)=>{
	const q = `select rating, movies.movieId,title,genres from movies inner join ratings on movies.movieId = ratings.movieId where userId = ${req.params.userId}`;
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
});
/*
// post movies with certain keyword
app.post('/movie',(req,res)=>{
	const keyword = req.body;
	const q = `select movieId,title,genres from movies where movieId like '%keyword%'`;
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
	res.json(req.body);
});

// post ratings with {"movieList":[4,5,12]}
app.post('/ratings',(req,res)=>{
	const movieList = req.body;
	const q = `select movies.movieId,title,genres,rating from movies inner join ratings on movies.movieId = ratings.movieId where movieId = movieList`;
	try{
		const results = await query(q);
		res.json(results);
	}catch(err){
		console.error(err);
		res.append('status','500');
		res.send(err);
	}
	res.json(req.body);
});
*/

app.listen(8080);

function query(q){
	return new Promise(function(resolve, reject){
		db.all(q,(err,rows)=>{
			if(err){
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
}