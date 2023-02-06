const { Web3Storage } = require('web3.storage');
const fetch = require('node-fetch');
const fs = require('fs')

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

retrieve("bafybeig2msi6hwwkaavt4p7hbim7s5ca7frejrdnj6ozuj5pgkmsaxltdm")
