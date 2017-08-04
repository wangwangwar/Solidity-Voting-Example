const fs = require('fs')
const solc = require('solc')
const Web3 = require('web3')
const express = require('express')

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
const code = fs.readFileSync('Voting.sol').toString()
const compiledCode = solc.compile(code)

const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface)
const VotingContract = web3.eth.contract(abiDefinition)
const byteCode = compiledCode.contracts[':Voting'].bytecode
var address = ''
var deployedContract = VotingContract.new(['Rama','Nick','Jose'],{data: byteCode, from: web3.eth.accounts[0], gas: 4700000}, function(data1, contract) {
    console.log(contract.address)
    address = contract.address
})

const app = express()
app.use(express.static('public'))
app.use(express.static('node_modules'))

app.get('/', function(req, res) {
    res.send('Index')
})

app.get('/contract_address', function(req, res) {
    res.send(address)
})

app.listen(3000, function() {
    console.log("Voting server is listening on port 3000")
})