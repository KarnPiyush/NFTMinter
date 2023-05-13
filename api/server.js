const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const app = express();

require('dotenv').config();
const port = process.env.port || 5000;
const api_key = process.env.api_key;


app.use(express.json());

const upload = multer({
    limits:{
        fileSize:1000000
    }
})

//code to connect with starton
// using this we will make all the calls to the blockchain
const starton = axios.create({
    baseURL : "https://api.starton.io/v3",
    headers: {
        "x-api-key" :api_key,
    },
})

app.post('/upload', cors(), upload.single('file'), async(req,res)=>{
    //handling the file
    let data = new FormData();
    const blob = new Blob([req.file.buffer],{type:req.file.mimetype});
    data.append("file",blob,{filename:req.file.originalname})
    data.append("isSync","true");

    async function uploadImageOnIpfs(){
        
        const ipfsImg = await starton.post("/ipfs/file", data, {
            headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}` },
        })
        return ipfsImg.data;

    }

    async function uploadMetadataOnIpfs(imgCid){
        
        const metadataJson = {
            name:'A wonderful NFT',
            description : 'Probably the most awesome NFT ever',
            image:`ipfs://ipfs/${imgCid}`
        }

        const ipfsMetadata = await starton.post('/ipfs/json',{
            name:"My NFT metadata JSON",
            content:metadataJson,
            isSync : true
        })
        return ipfsMetadata.data;

    }

    const SMART_CONTRACT_NETWORK= process.env.SMART_CONTRACT_NETWORK
    const SMART_CONTRACT_ADDRESS = process.env.SMART_CONTRACT_ADDRESS
    const WALLET_IMPORTED_ON_STARTON =process.env.WALLET_IMPORTED_ON_STARTON
    async function mintNFT(receiverAddress,metadataCid){
        const nft = await starton.post(`/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`, {
            functionName: "mint",
            signerWallet: WALLET_IMPORTED_ON_STARTON,
            speed: "low",
            params: [receiverAddress, metadataCid],
        })
        return nft.data;
    }
    
    const receiverAddress = "0x3eF15BaD5709cd8b0Acf46929f0D156f99D2c4Ae";

    const ipfsImgData = await uploadImageOnIpfs();
    const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);
    const nft = await mintNFT(receiverAddress, ipfsMetadata.cid);
    
    // console.log(ipfsImgData,ipfsMetadata);    

    res.status(201).json({
        transactionHash:nft.transactionHash,
        cid:ipfsImgData.cid
    })
})


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})