require('@nomicfoundation/hardhat-toolbox');


module.exports = {
solidity: {
compilers: [
{ version: '0.8.19' }
]
},
paths: {
sources: './contracts',
artifacts: './artifacts'
}
};