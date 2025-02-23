import { registerAs } from "@nestjs/config";

export default registerAs('contractService', () => {
    return {
        contractAddress: process.env.CONTRACT_ADDRESS,
        contractAbi: process.env.CONTRACT_ABI,
        adminSigner: process.env.ADMIN_SIGNER
    }
})