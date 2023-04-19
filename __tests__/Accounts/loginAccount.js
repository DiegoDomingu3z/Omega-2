const request = require('supertest')
const baseUrl = 'http://localhost:4000/account'
const accounts = require('./CreateAcount')

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
const badLogins = [
    {
        email: 'LilyMoore@gmail.com',
        password: '123dTesting'
    },
    {
        "email": "LilyMoore@gmail.com",
        "password": "123dTesting"
    }
]

const badData = [
    {
        password: '123Testing'
    },
    {
        email: 'NoahMorris@gmail.com',
    }
]
const noAccount = [
    {
        email: 'alissa@gmail.com',
        password: '123Testing'
    },
    {
        email: 'soccer@gmail.com',
        password: '123Testing'
    }
]


async function login(data) {
    const res = await request(baseUrl)
        .post('/login').send(data)
    return res
}



describe('Successful Login (200)', () => {
    for (let account = 0; account < correctLogins.length; account++) {
        const data = correctLogins[account];
        let res;
        beforeAll(async () => {
            res = await login(data)
        })
        it("Should return token (200)", async () => {
            expect(res.text).toEqual(expect.any(String))
        })
    }
})

describe('No Data Sent (400)', () => {
    for (let account = 0; account < badData.length; account++) {
        const data = badData[account];
        let res;
        beforeAll(async () => {
            res = await login(data)
        })
        it("Should return token (400)", async () => {
            expect(res.text).toEqual(expect.any(String))
            expect(res.status).toBe(400)
        })
    }
})

describe('No Account Found (400)', () => {
    for (let account = 0; account < noAccount.length; account++) {
        const data = noAccount[account];
        let res;
        beforeAll(async () => {
            res = await login(data)
        })
        it("Should return token (400)", async () => {
            expect(res.status).toBe(400)
        })
    }
})

describe('Incorrect Password (403)', () => {
    for (let account = 0; account < badLogins.length; account++) {
        const data = badLogins[account];
        let res;
        beforeAll(async () => {
            res = await login(data)
        })
        it("Should return token (403)", async () => {
            expect(res.status).toBe(403)
        })
    }
})