const request = require('supertest')
const baseUrl = 'http://localhost:4000/account'
const tokens = []
const correctLogins = [
    {
        email: 'DavidRodriguez@gmail.com',
        password: '123Testing'
    },
    {
        email: 'EvelynWilson@gmail.com',
        password: '123Testing'
    },
    {
        email: 'LilyMoore@gmail.com',
        password: '123Testing'
    }
]


// logout
// should return a 200 if good
// make test to try and get account with old auth token, should return 401 "THINKS USER DOESN't exist since token is deleted"
async function login(data) {
    const res = await request(baseUrl)
        .post('/login').send(data)
    return res
}

async function logout(token) {
    const res = await request(baseUrl)
        .delete('/logout')
        .set('Authorization', token)
    return res
}


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
describe('Successful Login (200)', () => {
    for (let account = 0; account < correctLogins.length; account++) {
        const data = correctLogins[account];
        let res;
        beforeAll(async () => {
            res = await login(data)
            tokens.push(res.text)
        })
        it("Should return token (200)", async () => {
            expect(res.text).toEqual(expect.any(String))
        })
    }
    afterAll(async () => {
        for (let account = 0; account < tokens.length; account++) {
            const el = tokens[account];
            res = await logout(el)
            expect(res.status).toBe(200)
        }
        for (let account = 0; account < tokens.length; account++) {
            const el = tokens[account];
            res = await getUserAccount(el)
            stat = res.status
            expect(stat).toBe(401)
        }

    })
})












// else should return 400