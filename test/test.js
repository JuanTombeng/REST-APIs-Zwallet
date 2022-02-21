const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const fs = require('fs')
chai.use(chaiHttp);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxLnp3YWxsZXRAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJhY3RpdmUiOjEsImlhdCI6MTY0NDgwNzQ2NiwiZXhwIjoxNjQ0ODExMDY2LCJpc3MiOiJ6d2FsbGV0In0.Z1jtdQbR-lZYaWP0uKRTWzj7Ry9hnenH_dVakRY7-S4'

const baseLoginUnit = (route) => {
    // return chai.request('https://zwallet-app.herokuapp.com/v2/users').post(`/${route}`).send(
    return chai.request('http://localhost:4000/v2/users').post(`/${route}`).send(
        {
            "email" : "user1.zwallet@gmail.com",
            "password" : "password123"
        }
    )
}

const baseSignUpUnit = (route) => {
    return chai.request('http://localhost:4000/v2').post(`/${route}`).send({
        "username" : "user5zwallet",
        "email" : "user5.zwallet@gmail.com",
        "password" : "password123",
        "pin" : 123123
    })
}

const baseSignUpEmailVerificationUnit = (route) => {
    return chai.request('http://localhost:4000/v2').post(`/${route}`)
}

const baseGetUnit = (route) => {
    return chai.request('http://localhost:4000/v2').get(`/${route}`).auth(token, {type : 'bearer'})
}

const baseGetWithParamUnit = (route) => {
    return chai.request('http://localhost:4000/v2').get(`/${route}`).auth(token, {type : 'bearer'}).query({search: 'Marin'})
}

const basePostContactMemberUnit = (route) => {
    return chai.request('http://localhost:4000/v2').post(`/${route}`).auth(token, {type : 'bearer'}).send(
        {
            "phone_number" : 6281213558898
        }
    )
}

const basePostTopUpUnit = (route) => {
    return chai.request('http://localhost:4000/v2').post(`/${route}`).auth(token, {type : 'bearer'}).send(
        {
            "amount" : 20000,
            "topUpMethod" : "transfer",
            "pin" : 123123
        }
    )
}

const basePostTransactionUnit = (route) => {
    return chai.request('http://localhost:4000/v2').post(`/${route}`).auth(token, {type : 'bearer'}).send(
        {
            "to_user_id" : "8f20e200-07fb-4202-b474-e05114b59e62",
            "amount" : 7000,
            "transaction_type" : "transfer",
            "notes" : "Thank for the money",
            "pin" : 123123
        }
    )
}

const basePutUserDetailUnit = (route) => {
    return chai.request('http://localhost:4000/v2').put(`/${route}`).auth(token, {type : 'bearer'}).send(
        {
            "first_name" : "Marin",
            "last_name" : "Kitagawa",
            "phone_number" : 6281213558898
        }
    )
}

const basePostUserProfilePicture = (route) => {
    return chai.request('http://localhost:4000/v2').post(`/${route}`).auth(token, {type : 'bearer'}).set('content-type', 'multipart/form-data')
        .attach('profile_picture', fs.readFileSync('../src/uploads/marin-kitagawa.png'), 'marin-kitagawa.png')
}

const baseDeleteContactMember = (route) => {
    return chai.request('http://localhost:4000/v2').delete(`/${route}`).auth(token, {type : 'bearer'}).send(
        {
            "id" : "65db7a6d-5e98-4bfe-9627-ee50c8a76fbc"
        }
    )
}


describe('Login Active User', () => {
    it('expect to have status code 200', (done) => {
        baseLoginUnit('/login').end((err, res)=> {
            expect(res.body).to.have.property('code').and.equal(200)
            done()
        })
    })
    it('expect to return object with expected keys', (done) => {
        baseLoginUnit('/login').end((err, res)=> {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            done()
        })
    })
    it('expect to have data and each data type', (done) => {
        baseLoginUnit('/login').end((err, res)=> {
            expect(res.body).to.have.keys(['status', 'code', 'data', 'message', 'error', 'pagination'])
            expect(res.body.data[0]).to.have.property('email').to.be.an('string')
            expect(res.body.data[0]).to.have.property('password').to.be.an('string')
            expect(res.body.data[0]).to.have.property('active').to.be.an('number')
            expect(res.body.data[0]).to.have.property('role').to.be.an('string')
            expect(res.body.data[0]).to.have.property('token').to.be.an('string')
            done()
        })
    })
});


describe('Get user detail', () => {
    it('expect to have status code', (done) => {
        baseGetUnit('/users/details').end((err, res) => {
            expect(res.body).to.have.property('code').and.equal(200)
            done()
        })
    })
    it('expect to return object with expected keys', (done) => {
        baseGetUnit('/users/details').end((err, res)=> {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            done()
        })
    })
    it('expect to have data and each data type', (done) => {
        baseGetUnit('/users/details').end((err, res) => {
            expect(res.body).to.have.keys(['status', 'code', 'data', 'message', 'error', 'pagination'])
            expect(res.body.data[0]).to.have.property('id').to.be.an('string')
            expect(res.body.data[0]).to.have.property('email').to.be.an('string')
            expect(res.body.data[0]).to.have.property('first_name').to.be.an('string')
            expect(res.body.data[0]).to.have.property('last_name').to.be.an('string')
            expect(res.body.data[0]).to.have.property('pin').to.be.an('number')
            expect(res.body.data[0]).to.have.property('phone_number').to.be.an('string')
            expect(res.body.data[0]).to.have.property('active').to.be.an('number')
            expect(res.body.data[0]).to.have.property('role').to.be.an('string')
            expect(res.body.data[0]).to.have.property('profile_picture').to.be.an('string')
            expect(res.body.data[0]).to.have.property('id_accounts').to.be.an('string')
            expect(res.body.data[0]).to.have.property('balance').to.be.an('number')
            expect(res.body.data[0]).to.have.property('income').to.be.an('number')
            expect(res.body.data[0]).to.have.property('outcome').to.be.an('number')
            done()
        })
    })
})

describe('Get Contact Group List', () => {
    it('expect data if not empty', (done) => {
        baseGetWithParamUnit('/contacts/contact-list').end((err, res) => {
            if (res.body.data === []) {
                expect(res.body).to.have.property('data').and.equal([])
                expect(res.body).to.have.property('code').and.equal(200)
                expect(res.body.data).to.be.equal(null)
                done()
            } else if (res.body.data !== []) {
                expect(res.body).to.be.an.instanceof(Object)
                expect(res.body).to.have.keys(['status', 'code', 'data', 'message', 'error', 'pagination'])
                expect(res.body).to.have.property('code').and.equal(200)
                expect(res.body.data[0]).to.have.property('id_user').to.be.an('string')
                expect(res.body.data[0]).to.have.property('id').to.be.an('string')
                expect(res.body.data[0]).to.have.property('user_holder_id').to.be.an('string')
                expect(res.body.data[0]).to.have.property('total_member').to.be.an('number')
                expect(res.body.data[0]).to.have.property('first_name').to.be.an('string')
                expect(res.body.data[0]).to.have.property('last_name').to.be.an('string')
                expect(res.body.data[0]).to.have.property('phone_number').to.be.an('string')
                expect(res.body.data[0]).to.have.property('profile_picture').to.be.an('string')
                expect(res.body.pagination).to.have.property('currentPage').to.be.an('number')
                expect(res.body.pagination).to.have.property('limit').to.be.an('number')
                expect(res.body.pagination).to.have.property('totalData').to.be.an('number')
                expect(res.body.pagination).to.have.property('totalPage').to.be.an('number')
                done()
            }
        })
    })
    it('expect to return object with expected keys', (done) => {
        baseGetUnit('/contacts/contact-list').end((err, res)=> {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            done()
        })
    })
})

const contactMemberId = '8f20e200-07fb-4202-b474-e05114b59e62'
describe('Get Contact Member Detail', () => {
    it('expect to check array result', (done) => {
        baseGetUnit(`/contacts/contact-list/member/${contactMemberId}`).end((err, res) => {
            if (res.body.data === []) {
                expect(res.body).to.have.property('data').and.equal([])
                expect(res.body).to.have.property('code').and.equal(200)
                expect(res.body.data).to.be.equal(null)
                done()
            } else if (res.body.data !== []) {
                expect(res.body).to.have.property('data')
                expect(res.body).to.have.property('code').and.equal(200)
                done()
            }
            
        })
    })
    it('expect to return object with expected keys', (done) => {
        baseGetUnit(`/contacts/contact-list/member/${contactMemberId}`).end((err, res) => {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            done()
        })
    })
    it('expect to have data and each data type', (done) => {
        baseGetUnit(`/contacts/contact-list/member/${contactMemberId}`).end((err, res) => {
            expect(res.body).to.have.keys(['status', 'code', 'data', 'message', 'error', 'pagination'])
            expect(res.body.data[0]).to.have.property('first_name').to.be.an('string')
            expect(res.body.data[0]).to.have.property('last_name').to.be.an('string')
            expect(res.body.data[0]).to.have.property('phone_number').to.be.an('string')
            expect(res.body.data[0]).to.have.property('profile_picture').to.be.an('string')
            expect(res.body.data[0]).to.have.property('active').to.be.an('number')
            expect(res.body.data[0]).to.have.property('id').to.be.an('string')
            done()
        })
    })
})

describe('Get Top Up History', () => {
    it('expect to check the data', (done) => {
        baseGetUnit('/transactions/topup/history').end((err, res) => {
            if (res.body.data === []) {
                expect(res.body).to.have.property('data').and.equal([])
                expect(res.body).to.have.property('code').and.equal(200)
                expect(res.body.data).to.be.equal(null)
                done()
            } else if (res.body.data !== []) {
                expect(res.body).to.be.an.instanceof(Object)
                expect(res.body).to.have.property('code').and.equal(200)
                expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
                done()
            }
        })
    })
    it('expect to have data and each data type', (done) => {
        baseGetUnit('/transactions/topup/history').end((err, res) => {
            expect(res.body).to.have.keys(['status', 'code', 'data', 'message', 'error', 'pagination'])
            expect(res.body.data[0]).to.have.property('id').to.be.an('string')
            expect(res.body.data[0]).to.have.property('id_user').to.be.an('string')
            expect(res.body.data[0]).to.have.property('amount').to.be.an('number')
            expect(res.body.data[0]).to.have.property('method').to.be.an('string')
            expect(res.body.data[0]).to.have.property('created_at').to.be.an('string')
            expect(res.body.data[0]).to.have.property('updated_at').to.be.equal(null)
            done()
        })
    })
})

describe('Get Transactioon History', () => {
    it('expect to check the data', (done) => {
        baseGetUnit('/transactions/transaction-history').end((err, res) => {
            if (res.body.data === []) {
                expect(res.body).to.have.property('data').and.equal([])
                expect(res.body).to.have.property('code').and.equal(200)
                expect(res.body.data).to.be.equal(null)
                done()
            } else if (res.body.data !== []) {
                expect(res.body).to.be.an.instanceof(Object)
                expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
                expect(res.body).to.have.property('code').and.equal(200)
                done()
            }
        })
    })
    it('expect to have data and each data type', (done) => {
        baseGetUnit('/transactions/transaction-history').end((err, res) => {
            expect(res.body).to.have.keys(['status', 'code', 'data', 'message', 'error', 'pagination'])
            expect(res.body.data[0]).to.have.property('id').to.be.an('string')
            expect(res.body.data[0]).to.have.property('from_user_id').to.be.an('string')
            expect(res.body.data[0]).to.have.property('to_user_id').to.be.an('string')
            expect(res.body.data[0]).to.have.property('first_name').to.be.an('string')
            expect(res.body.data[0]).to.have.property('profile_picture').to.be.an('string')
            expect(res.body.data[0]).to.have.property('transaction_type').to.be.an('string')
            expect(res.body.data[0]).to.have.property('amount').to.be.an('number')
            expect(res.body.data[0]).to.have.property('notes').to.be.an('string')
            done()
        })
    })
})

// describe('Post Sign Up User', () => {
//     it('expect to check the res data', (done) => {
//         baseSignUpUnit('/users/signup').end((err, res) => {
//             expect(res.body).to.be.an.instanceof(Object)
//             expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
//             expect(res.body).to.have.property('code').and.equal(200)
//             expect(res.body).to.have.property('message').and.equal('Please check your email, a verification email has been send to verfity your email')
//             done()
//         })
//     })
// })

// const tokenSignUp = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzendhbGxldCIsImVtYWlsIjoidXNlcjMuendhbGxldEBnbWFpbC5jb20iLCJpYXQiOjE2NDQ4MDUzNzUsImV4cCI6MTY0NDgwODk3NSwiaXNzIjoiendhbGxldCJ9.Ii-CxipnU0C9k0AONs2ahJBRM_VevXYJx1xhK1E1xow`
// describe('Post Sign Up Email Verification', () => {
//     it('expect to check email token', (done) => {
//         baseSignUpEmailVerificationUnit(`users/email-verification/${tokenSignUp}`).end((err, res) => {
//             expect(res.body).to.be.an.instanceof(Object)
//             expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
//             expect(res.body).to.have.property('code').and.equal(200)
//             expect(res.body.data.activateUser).to.have.property('affectedRows').and.equal(1)
//             done()
//         })
//     })
// })

describe('Post New Contact Member to List', () => {
    it('expect to check the data', (done) => {
        basePostContactMemberUnit('/contacts/add-contact-list').end((err, res) => {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            expect(res.body).to.have.property('code').and.equal(200)
            expect(res.body.data.addContactMember).to.have.property('affectedRows').and.equal(1)
            expect(res.body.data.updateContactGroup).to.have.property('affectedRows').and.equal(1)
            done()
        })
    })
})

describe('Post New Top Up Account', () => {
    it('expect to check the data', (done) => {
        basePostTopUpUnit('/transactions/topup').end((err, res) => {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            expect(res.body).to.have.property('code').and.equal(200)
            expect(res.body.data.topUpAccount).to.have.property('affectedRows').and.equal(1)
            expect(res.body.data.topUpHistory).to.have.property('affectedRows').and.equal(1)
            done()
        })
    })
})

describe('Post New Transaction', () => {
    it('expect to check the data', (done) => {
        basePostTransactionUnit('/transactions/create').end((err, res) => {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            expect(res.body).to.have.property('code').and.equal(200)
            expect(res.body.data.senderBalance).to.have.property('affectedRows').and.equal(1)
            expect(res.body.data.receiverBalance).to.have.property('affectedRows').and.equal(1)
            expect(res.body.data.transfer).to.have.property('affectedRows').and.equal(1)
            done()
        })
    })
})

// describe('Post User Profile Picture', () => {
//     it('expect to check the data', (done) => {
//         basePostUserProfilePicture('/users/profile-picture').end((err, res) => {

//         })
//     })
// })

describe('Put User Details', () => {
    it('expect to check the data', (done) => {
        basePutUserDetailUnit('/users/update').end((err, res) => {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            expect(res.body).to.have.property('code').and.equal(200)
            expect(res.body.data).to.have.property('affectedRows').and.equal(1)
            done()
        })
    })
})

describe('Delete Contact Member From List', () => {
    it('expect to check the res data', (done) => {
        baseDeleteContactMember('/contacts/delete-contact-member').end((err, res) => {
            expect(res.body).to.be.an.instanceof(Object)
            expect(res.body).to.have.all.keys('status', 'code', 'data', 'message', 'error', 'pagination')
            expect(res.body).to.have.property('code').and.equal(200)
            expect(res.body.data).to.have.property('affectedRows').and.equal(1)
            done()
        })
    })
})
