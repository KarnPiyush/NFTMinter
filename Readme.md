Client side Functions:

    retrieveFile() --> To store the data of the selected file
    handleSubmit() --> Send a request along with the file to the server


Server side Functions:

    uploadImageOnIPFS() --> To upload an image on IPFS
    uploadMetadataOnIPFS(imageCid) --> To upload meta data of an image on ipfs
    mintNFT(reciever address , metadataCid ) --> To mint an NFT 


FileUpload Component
This is a React component that allows the user to upload a file, which is then processed and minted as an NFT using the Starton blockchain.

Prerequisites
Before running this code, you need to set up the following:

Node.js installed on your local machine.
Starton API Key
.env file in the project root directory with the following keys:

SMART_CONTRACT_NETWORK=
SMART_CONTRACT_ADDRESS=
WALLET_IMPORTED_ON_STARTON=
api_key=

How to Use
Clone the repository to your local machine.
Install dependencies using npm install.
Run the application using npm start.
Navigate to http://localhost:3000 in your web browser.
Select a file using the "Choose File" button.
Click the "Nft Minter" button to process and mint the file as an NFT.
Libraries and Frameworks Used
React.js
Express.js
Multer
Cors
Axios
License
This project is licensed under the MIT License - see the LICENSE file for details.