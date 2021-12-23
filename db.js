const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const bcrypt  = require('bcrypt')
const Mixed = mongoose.Schema.Types.Mixed

async function connect() {
  console.log('connect')
  let status = await mongoose.connect('mongodb://localhost:27017/gts');

  let user = await Admins.findOne()
  if (!user) {
    user = new Admins({
      name: 'Супер администратор',
      password: bcrypt.hashSync(process.env.ADMIN_PASS, 10),
      email: process.env.ADMIN_EMAIL,
    })
    user.save()
    console.log('User saved')
  }
}

const ATS = mongoose.model('ATS', {
  atsType: {
    type: String,
    enum: ['city', 'departmental', 'institutional']
  }, 
  name: String,
  addressIndex: Number,
  addressArea: String,
  addressCity: String,
  addressStreet: String,
  addressHouse: String,
  author: {
    type: ObjectId,
    ref: 'Admins'
  },
  attrs: Mixed
});

const Subscribers = mongoose.model('Subscribers', {
  firstName: String,
  lastName: String,
  middleName: String,
  gander: Boolean,
  age: Number,
  isBenefits: Boolean,
  intercityAccess: Boolean,
  balance: Number,
  status: {
    type: String,
    enum: [
      'active', 'blocked', 'disabled'
    ]
  }
});

const Telephones = mongoose.model('Telephones', {
  phoneNumber: Number,
  addressIndex: Number,
  addressArea: String,
  addressCity: String,
  addressStreet: String,
  addressHouse: String,
  addressAppartament: String,
  phoneType: {
    type: String,
    enum: ['basic', 'parrallel', 'paired']
  },
  ats: {
    type: ObjectId,
    ref: 'ATS'
  },
  phoneOwner: {
    type: ObjectId,
    ref: 'Subscribers'
  },
  isPayphone: Boolean,
  isPublic: Boolean,
  isFree: Boolean
});

// const Calls = mongoose.model('Calls', {
//   from: Mixed,
//   to: Mixed,
//   subscriber: {
//     type: ObjectId,
//     ref: 'Subscribers'
//   },
//   phoneNumber: Number,
//   isIntercity: Boolean,
//   duration: Number,
//   status: {
//     type: String,
//     enum: ['waiting', 'processing', 'done', 'blocked']
//   }
// });

// const Queues = mongoose.model('Queues', {
//   addressIndex: Number,
//   addressArea: String,
//   addressCity: String,
//   addressStreet: String,
//   addressHouse: String,
//   addressAppartament: String,
//   status: {
//     type: String,
//     enum: ['waiting', 'processing', 'toConnect', 'toCancel', 'connected', 'canceled']
//   },
//   phoneType: {
//     type: String,
//     enum: ['basic', 'parrallel', 'paired']
//   },
//   firstName: String,
//   lastName: String,
//   middleName: String,
//   gander: Boolean,
//   age: Number
// });

const Admins = mongoose.model('Admins', {
  name: String,
  password: String,
  email: String,
  ats: {
    type: ObjectId,
    ref: 'ATS'
  }
});

module.exports = {
  ATS, Subscribers, Telephones,  Admins,
  connect
}