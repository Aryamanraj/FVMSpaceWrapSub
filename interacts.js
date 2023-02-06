const { ethers } = require("ethers");
const express = require('express')
const axios = require('axios');
const app = express();

const furl = "https://api.hyperspace.node.glif.io/rpc/v1"
const networkInfo = {
	defaultNetwork: "hyperspace",
	networks: {
	  hyperspace: {
	    chainId: 3141,
	    url: "https://api.hyperspace.node.glif.io/rpc/v1",
	    accounts: ["1da8cd43728e610cd6f35f1eeb962288de12485c82218c7e517e4212e9cb4368"],
	  },
	},
    }
  
let provider = new ethers.providers.JsonRpcProvider(furl,networkInfo.networks.hyperspace);


const privateKey = "1da8cd43728e610cd6f35f1eeb962288de12485c82218c7e517e4212e9cb4368";

const signer = new ethers.Wallet(privateKey,provider)


const enigmaAddr = "0x2A16BE163F930f0dE5377f267F5356A1Dd741553";
const enigmaABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "cipherText",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "recID",
				"type": "string"
			}
		],
		"name": "ipfs",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "str",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "key",
				"type": "string"
			}
		],
		"name": "setUserAddr",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "reciever",
				"type": "address"
			}
		],
		"name": "extract_key",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "getLast",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "str",
				"type": "string"
			}
		],
		"name": "getUser",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "str",
				"type": "string"
			}
		],
		"name": "getUserKey",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const enigmaContract = new ethers.Contract(enigmaAddr, enigmaABI, signer);

async function newUser(userID, publicKey){
	const setUser = await enigmaContract.setUserAddr(userID, publicKey);
	return setUser;
}
async function ipfsUpload(cipherText, recID){
	const ipfs = await enigmaContract.ipfs(cipherText, recID);
	return ipfs;
}
async function getLast(i){
	const getLast = await enigmaContract.getLast(i);
	console.log(typeof(getLast))
	return getLast[0];
}
async function getUser(str){
	const getUser = await enigmaContract.getUser(str);
	return getUser;
}
async function getUserKey(str){
	const getUserKey = await enigmaContract.getUserKey(str);
	return getUserKey;
}



app.get('/newuser', async (req, res) => {
	const _userID = req.query.userID;
	const _publicKey = req.query.publicKey;
	const _res = await newUser(_userID,_publicKey);
	res.send(_res);
    })

app.get('/ipfsupload', async (req, res) => {
	const _cipherText = req.query.cipherText;
	const _recID = req.query.recID;
	const _res = await ipfsUpload(_cipherText,_recID);
	res.send(_res);
    })

app.get('/getlast', async (req, res) => {
	const _i = req.query.i;
	const _res = await getLast(_i);
	res.send(_res);
    })
app.get('/getuser', async (req, res) => {
	const _str = req.query.str;
	const _res = await getUser(_str);
	res.send(_res);
    })
app.get('/getuserkey', async (req, res) => {
	const _str = req.query.str;
	const _res = await getUserKey(_str);
	res.send(_res);
    })


app.listen(5223, () => {
	console.log('API is running on http://localhost:5223')
    })