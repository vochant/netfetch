import {createWriteStream, readFileSync, writeFileSync} from 'fs';
import request from 'request';
import path from 'path'
import Express from 'express';
import BodyParser from 'body-parser';
import CORS from 'cors';
import {fileURLToPath} from 'url'

const app = Express();
app.use(BodyParser.json());
app.use(CORS());

var obj = {total: 0};

function download(url) {
	var Tp = url.split('.')[url.split('.').length - 1];
	if (Tp.split('/').length > 1) {
		Tp = "";
	} else {
		Tp = "." + Tp;
	}
	let s = createWriteStream("./static/" + obj.total.toString() + Tp);
	var e;
	request(url).pipe(s).on("close", function(err) {
		e = err;
		obj.total = obj.total + 1;
	});
	return e;
}

app.post("/create", (req, res) => {
	if (!req.body.url) {
		res.send('{"s":"e","m":"Cannot find the URL."}');
		return;
	}
	if (download(req.body.url)) {
		res.send('{"s":"e","m":"Server network error."}');
		return;
	} else {
		res.send(`{"s":"s","m":"Saved to ID ${obj.total - 1}"}`);
	}
});

app.use("/static", Express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'static')));

var index = readFileSync("index.html").toString();

app.get('/index', (req, res) => {
	res.type("html").send(index);
});

app.listen(8090, () => {
    console.log(`Port :8090 is opened`);
});