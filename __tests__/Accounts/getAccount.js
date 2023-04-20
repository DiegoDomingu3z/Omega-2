const request = require('supertest')
const baseUrl = 'http://localhost:4000/account'
const tokens = ['4166XH7URM44TJ62L4W5YPMWHL5977', '9U978GO51DVU2F336YVU75SY5P9S2X', 'HV8UM3785FL9T27J780869JWL9RRDO', 'FIEZ8UB4O763YY05X53S39MZ98SM03']
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
                authToki: expect.any(String),
                authExpiration: expect.any(String),
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
        it('Should return (401) no account found', async () => {
            // Middleware will always check if user exists before it runs any apis
            expect(stat).toBe(401)

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