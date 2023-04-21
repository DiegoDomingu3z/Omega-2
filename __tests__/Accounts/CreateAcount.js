const request = require('supertest')
const baseUrl = 'http://localhost:4000'

const firstNames = ['Emily', 'Ethan', 'Emma', 'Noah', 'Olivia', 'Liam', 'Ava', 'William', 'Sophia', 'Mason', 'Isabella', 'James', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Michael', 'Harper', 'Alexander', 'Evelyn', 'Elijah', 'Abigail', 'Daniel', 'Emily', 'Matthew', 'Elizabeth', 'Aiden', 'Sofia', 'Henry', 'Ella', 'Joseph', 'Madison', 'Samuel', 'Scarlett', 'David', 'Avery', 'Carter', 'Grace', 'Jackson', 'Chloe', 'Luke', 'Victoria', 'Lily', 'Eleanor', 'Gabriel', 'Hazel', 'Julia', 'Penelope', 'Nathan', 'Riley', 'Isaac', 'Zoe'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Taylor', 'Anderson', 'Wilson', 'Moore', 'Jackson', 'Martin', 'Lee', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Cooper'];
const min = 21;
const max = 30;


/**
* Generates random name to enter into database
 @returns {Object} random account info
*/

async function generateRandomName() {
    const randomFirstNameIndex = Math.floor(Math.random() * firstNames.length);
    const randomLastNameIndex = Math.floor(Math.random() * lastNames.length);
    return {
        email: `${firstNames[randomFirstNameIndex]}${lastNames[randomLastNameIndex]}@gmail.com`,
        firstName: `${firstNames[randomFirstNameIndex]}`,
        lastName: `${lastNames[randomLastNameIndex]}`
    }
}





/**
* Generates random number between 21 and 30
 @returns {Number} random number for age
*/


async function randomAge() {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return Promise.resolve(randomNumber)
}

/**
* Generates and compiles account data to send to DB
@param {Number}  number for age
@returns {Object} accountData
*/

async function generateData(accountAge) {
    let data = await generateRandomName()
    const data3 = {
        email: data.email,
        password: "123Testing",
        firstName: data.firstName,
        lastName: data.lastName,
        age: accountAge
    }
    return Promise.resolve(data3)
}





/**
* Sends data to api 
@param {Object} accountData
@returns {String} accounts Access Token
*/

async function sendData(data) {
    const res = await request(baseUrl)
        .post('/account').send(data)
    return Promise.resolve(res)
}

describe('Account Creation', () => {

    let res;
    let data;
    beforeAll(async () => {
        age = await randomAge()
        data = await generateData(age)
        res = await sendData(data)
    })
    it("Should return token string (200)", async () => {
        expect(res.text).toEqual(expect.any(String))
    })
    it("Should return 'EMAIL ALREADY EXISTS' (401)", async () => {
        const res = await sendData(data)
        expect(res.text).toEqual('EMAIL ALREADY EXISTS')
        expect(res.status).toBe(401)
    })

})

describe('Valid Age', () => {
    let res;
    let data;
    beforeAll(async () => {
        age = await randomAge()
        data = await generateData(age)
        res = await sendData(data)
    })
    it("SHOULD BE VALID AGE (200)", async () => {
        expect(res.status).toBe(200)
    })
    it("SHOULD BE INVALID AGE (401)", async () => {
        const data = await generateData(17)
        const res = await sendData(data)
        expect(res.status).toBe(401)
        expect(res.text).toEqual('INVALID AGE')
    })


})
