const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("VerifySignature", function () {
    it("Check signature", async function () {
        const accounts = await ethers.getSigners(2)

        const VerifySignature = await ethers.getContractFactory("VerifySignature")
        const contract = await VerifySignature.deploy()
        await contract.deployed()

        // const PRIV_KEY = "0x..."
        // const signer = new ethers.Wallet(PRIV_KEY)
        const signer = accounts[0]
        const to = accounts[1].address
        const amount = 999
        const message = "Hello"
        const nonce = 123

        // 第一种测试：生成hash的过程，还是通过合约来计算生成的
        const hash = await contract.getMessageHash(to, amount, message, nonce)
        const ethHash = await contract.getEthSignedMessageHash(hash)

        // signer签名的时候，仅对msgHash进行签名，不包括：\x19Ethereum Signed Message:\n32
        const sig = await signer.signMessage(ethers.utils.arrayify(hash))

        console.log("signer          ", signer.address)
        console.log("recovered signer", await contract.recoverSigner(ethHash, sig))

        // 上面的几步，于下面的verify函数是相同的逻辑，只不过是我们手动一步一步调用的。

        // Correct signature and message returns true
        expect(
            await contract.verify(signer.address, to, amount, message, nonce, sig)
        ).to.equal(true)

        // Incorrect message returns false
        expect(
            await contract.verify(signer.address, to, amount + 1, message, nonce, sig)
        ).to.equal(false)
    })
})
