const request = require('supertest')
const baseUrl = 'http://localhost:4000/account'
const tokens = ['87MI36S088JQGVD38RJS21O8K004EA', 'A868ZLA26576GVX8G4TR0BBWT022N3', 'N123QWTF4WAP46R51HVV39603W3JK4', 'D1D8JJL71RMB820KS7E7G6901P14IQ']
const badTokens = ['asr4qcrq32w2xdrq32w', 'qa3232cqasewaxd34']

async function getUserAccount(token) {
    if (token) {
        const res = request(baseUrl)
            .get('/myaccount')
            .set('Authorization', token)
        return res
    } else {
        const res = request(baseUrl)
            .get('/myaccount')
        return res
    }

}



// Test for healthy token
describe("Should return account data (200)", () => {
    for (let account = 0; account < tokens.length; account++) {
        const toki = tokens[account];
        let res;
        let stat;
        beforeAll(async () => {
            data = await getUserAccount(toki)
            res = JSON.parse(data.text)
            stat = data.status
        })
        it("Return (200) with user information", async () => {
            expect(res).toMatchObject({
                email: expect.any(String),
                password: expect.any(String),
                createdAt: expect.any(String),
                firstName: expect.any(String),
                lastName: expect.any(String),
                age: expect.any(Number),
                lastName: expect.any(String),
                _id: expect.any(String),
                updatedAt: expect.any(String),
                id: expect.any(String)


            });
            expect(stat).toBe(200)
        })
    }

})


// test for bad token
describe("Should return NO ACCOUNT FOUND ", () => {
    for (let account = 0; account < badTokens.length; account++) {
        const toki = badTokens[account];
        console.log(toki)
        beforeAll(async () => {
            data = await getUserAccount(toki)
            stat = data.status
        })
        it('Should return (400) no account found', async () => {
            // Middleware will always check if user exists before it runs any apis
            expect(stat).toBe(400)

        })

    }
})


// Test for no token
describe("Should return NO ACCOUNT FOUND ", () => {
    beforeAll(async () => {
        data = await getUserAccount()
        stat = data.status
    })
    it('Should return (401) NO TOKEN SENT', async () => {
        // Middleware will always check if user exists before it runs any apis
        expect(stat).toBe(401)

    })
})