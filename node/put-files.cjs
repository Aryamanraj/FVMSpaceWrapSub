const { Web3Storage, getFilesFromPath } = require('web3.storage')
const express = require('express')
const axios = require('axios');

const querystring = require('querystring');

const app = express()


async function getCID (_data) {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRGRTAzMkJmRTE4RTg0Q2EyMGE3OGI1NUY5ODQzNDZGNzgzRTYzOTQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzQ5MjIyOTkzMjEsIm5hbWUiOiJ0ZXN0MiJ9.MirqvwsJEumZPh0AZc2KBegODAiNSsPqWpeFnN4APZk'
  const storage = new Web3Storage({ token })
  const files = await getFilesFromPath(_data)

  var cid = await storage.put(files);
  //console.log(cid)
  //module.exports['cid']=cid; 
  return cid;
}


async function encrypting(args) {
  const url = "http://192.168.61.8:6117/encrypting?"
  const encodedArgs = args;
  console.log(`encoded args = ${encodedArgs}`); 
  const response = await axios.get(`${url}${encodedArgs}`);
  console.log(`${url}${encodedArgs}`)
  console.log(response.data);
  return response.data;
}

async function decrypting(args) {
  const url = "http://192.168.61.8:6117/decrypting?"
  const encodedArgs = args;
  console.log(`encoded args = ${encodedArgs}`);
  console.log(`${url}${encodedArgs}`)
  const response = await axios.get(`${url}${encodedArgs}`);
  console.log(`${url}${encodedArgs}`)
  console.log(response.data);
  return response.data;
}

async function sendToFVM(args) {
  const url = "http://localhost:5223/"
  const encodedArgs = args;
  console.log(`encoded args = ${encodedArgs}`);
  const response = await axios.get(`${url}${encodedArgs}`);
  console.log(`${url}${encodedArgs}`)
  console.log(response.data);
  return response.data;
}

async function getLast(args) {
  const url = "http://localhost:5223/"
  const encodedArgs = args;
  console.log(`encoded args = ${encodedArgs}`);
  const response = await axios.get(`${url}${encodedArgs}`);
  console.log(`${url}${encodedArgs}`)
  console.log(response.data);
  return response.data;
}

async function retrieve (cid) {
  const client = makeStorageClient()
  const res = await client.get(cid)
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`)
  }
   
  async function getData() {
    let link = 'https://'+cid+'.ipfs.w3s.link/b.json';
    const response = await fetch(link);
    const result = await response.json();
    return result;
}
    let beta = await getData();
    console.log(beta)
    fs.writeFile(`b.txt`,JSON.stringify(beta),()=>{console.log('running')});
}


app.get('/cid', async (req, res) => {
  //const _from = req.query;
  //From_date=5&From_hour=10&To_date=5&To_hour=14&From_mins=0&From_secs=0&To_mins=0&To_secs=0&Data=Hello
  const _from_date = req.query.From_date
  const _from_hour = req.query.From_hour
  const _from_mins = req.query.From_mins
  const _from_secs = req.query.From_secs
  const _to_date = req.query.To_date
  const _to_hour = req.query.To_hour
  const _to_mins = req.query.To_mins
  const _to_secs = req.query.To_secs
  const _data = req.query.Data
  const _to = req.query.To
  console.log(_data)
  
  const cid = await getCID(_data);
  console.log(cid)
  const Qstring = `From_date=${_from_date}&From_hour=${_from_hour}&To_date=${_to_date}&To_hour=${_to_hour}&From_mins=${_from_mins}&From_secs=${_from_secs}&To_mins=${_to_mins}&To_secs=${_to_secs}&Data=${cid}`
  console.log(Qstring);
  const cipherText = await encrypting(Qstring);
  console.log(cipherText["ciphertext"]);
  //http://localhost:5223/ipfsupload?cipherText=a&recID=abc
  const Q_string =  `ipfsupload?cipherText=${cipherText["ciphertext"]}&recID=${_to}`
  const ipfs = await sendToFVM(Q_string);
  res.send(ipfs);
})

app.get('/getmessage', async (req, res) => {
  //const _from = req.query;
  //From_date=5&From_hour=10&To_date=5&To_hour=14&From_mins=0&From_secs=0&To_mins=0&To_secs=0&Data=Hello
  //const _cipher_text = req.query.cipher
  const _i = req.query.i;
  // console.log(_cipher_text)
  const Q_string =  `getlast?i=${_i}`;
  const ipfs = await getLast(Q_string);
  
  const Qstring_decrypt = `cipher=${ipfs}`
  // console.log(Qstring_decrypt);
  const _decipherText = await decrypting(Qstring_decrypt);
  console.log(_decipherText);
  const mesg = await retrieve(_decipherText); 

  
  res.send(mesg);
})

app.get('/testing', async (req, res) => {
  res.send("Hello");
})

app.listen(3000, () => {
  console.log('API is running on http://localhost:3000')
})