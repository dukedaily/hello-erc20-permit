# Hello ERC20 Permit

```shell
npm i

# Test signature verification(generate Hash onchain)
npx hardhat test test/verify-signature.js

# Test signature2 verification(generate Hash offchain)
npx hardhat test test/verify-signature2.js

# Test ERC20 Permit
npx hardhat test test/erc20-permit.js

```

### Links

1. https://docs.ethers.io/v5/api/signer/#Signer-signMessage

2. https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/draft-IERC20Permit.sol

3. https://github.com/Uniswap/v3-periphery/blob/main/test/shared/permit.ts

### Related EIP
1. [EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712，)
2. [EIP-2612: permit – 712-signed approvals](https://eips.ethereum.org/EIPS/eip-2612)
3. https://eips.ethereum.org/EIPS/eip-191


### structure


| stage    | details                                                      | ethers.js               |
| -------- | ------------------------------------------------------------ | ----------------------- |
| initial  | encode(Tx: T) = RLP_encode(Tx)                               |                         |
| normal   | encode(message) = "\x19Ethereum Signed Message:\n" \|\| len(message)\|\|message | signer.sigMessage(hash) |
| EIP-712  | encode(domainSeparator, message) = "\x19\x01"\|\|domainSeparator\|\|hashStruct(message) | signer._signTypeData()  |
| EIP-2612 | special case for EIP-712                                     |                         |

