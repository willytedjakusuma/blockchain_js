const SHA256  = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash(); 
    this.randomInt = 0; // To Tamper data that not actually modifiying the data, so its a random integer. Aka Nonce
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.randomInt).toString();    
  }

  mineBlock(level) {
    while(this.hash.substring(0, level) !== Array(level + 1).join('0')){
      this.randomInt++;
      this.hash = this.calculateHash();
    }

    console.log("Block has been mined: " + this.hash);
    
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.level = 5;
  }

  createGenesisBlock() {
    return new Block(0, '12/06/1993', 'Adam', '0') 
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.level);
    this.chain.push(newBlock);
  }

  isChainValid(){
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Make sure data is not tempered with comparing hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      
      // Make sure data is not tempered with comparing with hash from previous Block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}


let myBlockChain = new BlockChain();
console.log('Mining first data ....')
myBlockChain.addBlock( new Block(1, Date.now(), { amount: 5 }))
console.log('Mining second data ....')
myBlockChain.addBlock( new Block(2, Date.now(), { amount: 3 }))

// // console.log(JSON.stringify(myBlockChain, null, 2));
// console.log('is my block chain valid ? ' + myBlockChain.isChainValid() + '\n')
// myBlockChain.chain[1].data = { amount: 500 };
// myBlockChain.chain[1].hash = myBlockChain.chain[1].calculateHash();
// console.log('is my block chain valid ? ' + myBlockChain.isChainValid() + '\n')

