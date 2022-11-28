const { expect } = require("chai")
const { ethers, web3 } = require("hardhat")

describe("VerifySignature2 Top", () => {
    let accounts
    let signer
    let prefix = "\x19Ethereum Signed Message:\n32"

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        signer = accounts[0]
        // console.log('--> signer:', signer.address);
    })

    async function getSignature(signer, address, tokenId) {
        console.log('signer:', signer.address, 'this:', address, 'tokenId:', tokenId);

        //1. 获取this + tokenid的哈希值 msgHash，这个会被私钥签名
        let msgHash = ethers.utils.solidityKeccak256(
            ["address", "uint256"], [address, tokenId]
        )
        console.log('msgHash:', msgHash);

        //2. 获取加上前缀后的哈希值 ethMsgHash，这个仅用于verify，不会使用私钥对其进行签名
        // 此处这里 ethMsgHash是为了对比显示，不会使用
        let ethMsgHash = ethers.utils.solidityKeccak256(
            ["string", "bytes32"], [prefix, msgHash]
        )
        console.log('自己追加prefix后得到的hash，ethMsgHash:', ethMsgHash);

        //2. 获取对msgHash的签名，没有自动添加prefix
        const sig = await signer.signMessage(ethers.utils.arrayify(msgHash))
        console.log('signature:', sig);

        return ethers.utils.splitSignature(sig)
    }

    describe("VerifySignature2", function () {
        it("Check Signature2", async function () {
            const accounts = await ethers.getSigners(1)
            const signer = accounts[0]

            const Token = await ethers.getContractFactory("VerifySignature2")
            const token = await Token.deploy()
            await token.deployed()

            let tokenId = 4
            let [msgHash, ethMsgHash] = await token.getMessageHash(tokenId)
            console.log('从合约读取的数据:\nmsgHash:', msgHash, '\nethMsgHash:', ethMsgHash);

            console.log('\n从链下生成的数据:');
            const { v, r, s } = await getSignature(signer, token.address, tokenId)
            console.log('v:', v);
            console.log('r:', r);
            console.log('s:', s);

            expect(await token.verify(signer.address, tokenId, v, r, s)).to.equal(true)
        })
    })
})