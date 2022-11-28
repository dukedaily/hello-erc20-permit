// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "hardhat/console.sol";

contract VerifySignature2 {
    function getMessageHash(uint256 _tokenId)
        public
        view
        returns (bytes32, bytes32)
    {
        bytes32 msgHash = keccak256(abi.encodePacked(address(this), _tokenId));

        bytes32 ethMsgHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash)
        );
        return (msgHash, ethMsgHash);
    }

    // 我们要做的是：给定vrs，给定hash原始内容，解析出来这个vrs的签名者地址是谁
    // 这个demo与no1的区别是，此处将多个步骤写在一起了，这也是在uniswap的展示形式
    function verify(
        address signer,
        uint256 tokenId,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (bool) {
        // 这就是整个verify动作了
        address signerRecovered = ecrecover( //3. 使用v,r,s做签名校验，获取sender
            keccak256( // 2.生成verify需要的hash（加上prefix）
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32", //这是个标准，必须是这个字符串
                    keccak256(abi.encodePacked(this, tokenId)) // 1.对内容hash
                )
            ),
            v,
            r,
            s
        );

        console.log("signerRecovered:", signerRecovered);
        return signer == signerRecovered;
    }
}
