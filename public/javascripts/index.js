new Vue({
    el: '#app',
    data: {
        ats: [],
        subscribers: [],
        telephones: [],
        calls: [],
        queues: [],
        admins: [],
        taxophones: [],
        newATS: {
            address: '',
            loading: false,
            suggestions: [],
            selectedSugg: {},
            atsType: '',
            name: ''
        },
        newTax: {
            phoneNumber: '',
            ats: '',
            loading: false,
            address: '',
            suggestions: [],
            selectedSugg: {},
        },
        newPhone: {
            _id: null,
            phoneNumber: '',
            ats: '',
            loading: false,
            address: '',
            suggestions: [],
            selectedSugg: {},
            phoneType: '',
            phoneOwner: null,
            isFree: true
        },
        newSubscriber: {
            _id: null,
            firstName: '',
            lastName: '',
            middleName: '',
            gander: false,
            age: 18,
            isBenefits: false,
            intercityAccess: false, 
            balance: 0,
            status: 'active',
            loading: false
        },
        newAdmin: {
            name: '',
            email: '',
            password: '',
            ats: '',
            loading: false
        }
    },
    updated() {
        M.FormSelect.init( document.querySelectorAll('select'));
    },
    async mounted() {
        setTimeout(() => {
            M.Modal.init(document.querySelectorAll('.modal'), {
                dismissible: false,
            })
        }, 1)
        // GET ATS
        let resp =  await fetch('/ats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        resp = await resp.json()
        if (resp) {
            this.ats = resp
        }
        // GET ADMINS
        resp =  await fetch('/admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        resp = await resp.json()
        if (resp) {
            this.admins = resp
        }
        // GET TAXES
        resp =  await fetch('/telephones?public=true', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        resp = await resp.json()
        if (resp) {
            this.taxophones = resp
        }
        // GET PHONES 
        resp =  await fetch('/telephones', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        resp = await resp.json()
        if (resp) {
            this.telephones = resp
        }
        // GET ABONENTS
        resp =  await fetch('/subscribers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        resp = await resp.json()
        if (resp) {
            this.subscribers = resp
        }
    },
    methods: {
        checkAddress: async function() {
            try {
                if (String(this.newATS.address).trim().length === 0) throw {
                    code: 403,
                    message: 'Введите нормальный адрес'
                }
                this.newATS.loading = true
       
                let resp = await fetch('https://data.pbprog.ru/api/address/full-address/parse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'a55595384d9a4649ae9b4cb0d28dcee81bdad369'
                    },
                    body: JSON.stringify({
                        query: this.newATS.address,
                        count: 5, 
                    })
                })
                this.newATS.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp.suggestions.length > 0) {
                        this.newATS.suggestions = resp.suggestions
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        checkTaxAddress: async function() {
            try {
                if (String(this.newTax.address).trim().length === 0) throw {
                    code: 403,
                    message: 'Введите нормальный адрес'
                }
                this.newTax.loading = true
       
                let resp = await fetch('https://data.pbprog.ru/api/address/full-address/parse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'a55595384d9a4649ae9b4cb0d28dcee81bdad369'
                    },
                    body: JSON.stringify({
                        query: this.newTax.address,
                        count: 5, 
                    })
                })
                this.newTax.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp.suggestions.length > 0) {
                        this.newTax.suggestions = resp.suggestions
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        selectATSAddress: async function(sugg) {
            this.newATS.selectedSugg = sugg.data
            this.newATS.address = sugg.unrestricted_value
            this.newATS.suggestions = []
        },
        selectTaxAddress: async function(sugg) {
            this.newTax.selectedSugg = sugg.data
            this.newTax.address = sugg.unrestricted_value
            this.newTax.suggestions = []
        },
        clearATS: function() {
            this.newATS.selectedSugg = {}
            this.newATS.address = ''
            this.newATS.suggestions = []
        },
        deleteATS: async function(id) {
            try {
                let resp = await fetch('/ats/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log(resp)
                if (resp.status === 200) {
                    M.toast({html: 'Удалено', classes: 'rounded green white-text'})
                    this.ats = this.ats.filter(el => el._id !== id)
                } else throw {
                    message: resp.statusText
                }
            } catch(err) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        createATS: async function() {
            try {
                this.newATS.loading = true
       
                let resp = await fetch('/ats', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        atsType: this.newATS.atsType,
                        addressIndex: this.newATS.selectedSugg.postal_code,
                        addressArea: this.newATS.selectedSugg.region_with_type,
                        addressCity: this.newATS.selectedSugg.city_with_type,
                        addressStreet: this.newATS.selectedSugg.street_with_type,
                        addressHouse: this.newATS.selectedSugg.house,
                        name: this.newATS.name,
                        author: "<%= auth.userid %>",
                    })
                })
                this.newATS.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp) {
                        this.ats.push(resp)
                        M.toast({html: 'Добавлено', classes: 'rounded green white-text'})
                        M.Modal.getInstance(document.getElementById('ats-modal')).close();
                        this.clearATS()
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        clearAdmin: function() {
            this.newAdmin = {
                name: '',
                email: '',
                password: '',
                ats: '',
                loading: false
            }
        },
        deleteAdmin: async function(id) {
            try {
                let resp = await fetch('/admin/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log(resp)
                if (resp.status === 200) {
                    M.toast({html: 'Удалено', classes: 'rounded green white-text'})
                    this.admins = this.admins.filter(el => el._id !== id)
                } else throw {
                    message: resp.statusText
                }
            } catch(err) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        createAdmin: async function() {
            try {
                this.newAdmin.loading = true
       
                let resp = await fetch('/admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.newAdmin.name,
                        email: this.newAdmin.email,
                        ats: this.newAdmin.ats,
                        password: this.newAdmin.password,
                    })
                })
                this.newAdmin.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp) {
                        this.admins.push(resp)
                        M.toast({html: 'Добавлено', classes: 'rounded green white-text'})
                        M.Modal.getInstance(document.getElementById('admins-modal')).close();
                        this.clearATS()
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        clearAdmin: function() {
            this.newAdmin = {
                name: '',
                email: '',
                password: '',
                ats: '',
                loading: false
            }
        },
        deleteAdmin: async function(id) {
            try {
                let resp = await fetch('/admin/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log(resp)
                if (resp.status === 200) {
                    M.  to
                     ast({html: 'Удалено', classes: 'rounded green white-text'})
                    this.admins = this.admins.filter(el => el._id !== id)
                } else throw {
                    message: resp.statusText
                }
            } catch(err) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        createTax: async function() {
            try {
                this.newTax.loading = true
       
                let resp = await fetch('/telephones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phoneNumber: this.newTax.phoneNumber,
                        ats: this.newTax.ats,
                        addressIndex: this.newTax.selectedSugg.postal_code,
                        addressArea: this.newTax.selectedSugg.region_with_type,
                        addressCity: this.newTax.selectedSugg.city_with_type,
                        addressStreet: this.newTax.selectedSugg.street_with_type,
                        addressHouse: this.newTax.selectedSugg.house,
                        isPayphone: true,
                        isPublic: true,
                    })
                })
                this.newTax.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp) {
                        this.taxophones.push(resp)
                        M.toast({html: 'Добавлено', classes: 'rounded green white-text'})
                        M.Modal.getInstance(document.getElementById('tax-modal')).close();
                        this.clearTax()
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        deleteTax: async function(id) {
            try {
                let resp = await fetch('/telephones/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log(resp)
                if (resp.status === 200) {
                    M.toast({html: 'Удалено', classes: 'rounded green white-text'})
                    this.taxophones = this.taxophones.filter(el => el._id !== id)
                } else throw {
                    message: resp.statusText
                }
            } catch(err) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        clearTax: function() {
            this.newTax.selectedSugg = {}
            this.newTax.address = ''
            this.newTax.suggestions = []
        },
        createPhone: async function() {
            try {
                this.newPhone.loading = true
       
                let resp = await fetch('/telephones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phoneNumber: this.newPhone.phoneNumber,
                        ats: this.newPhone.ats,
                        addressIndex: this.newPhone.selectedSugg.postal_code,
                        addressArea: this.newPhone.selectedSugg.region_with_type,
                        addressCity: this.newPhone.selectedSugg.city_with_type,
                        addressStreet: this.newPhone.selectedSugg.street_with_type,
                        addressHouse: this.newPhone.selectedSugg.house,
                        addressAppartament: this.newPhone.selectedSugg.flat,
                        phoneOwner: this.newPhone.phoneOwner,
                        phoneType: this.newPhone.phoneType,
                        isPayphone: false,
                        isPublic: false,
                        isFree: this.newPhone.phoneOwner ? false : true
                    })
                })
                this.newPhone.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp) {
                        this.telephones.push(resp)
                        M.toast({html: 'Добавлено', classes: 'rounded green white-text'})
                        M.Modal.getInstance(document.getElementById('telephone-modal')).close();
                        this.clearPhone()
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        savePhone: async function() {
            try {
                this.newPhone.loading = true
                let resp = await fetch('/telephones/' + this.newPhone._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phoneNumber: this.newPhone.phoneNumber,
                        ats: this.newPhone.ats._id ? this.newPhone.ats._id : this.newPhone.ats,
                        addressIndex: this.newPhone.selectedSugg ? this.newPhone.selectedSugg.postal_code : this.newPhone.addressIndex,
                        addressArea: this.newPhone.selectedSugg ? this.newPhone.selectedSugg.region_with_type : this.newPhone.addressArea,
                        addressCity: this.newPhone.selectedSugg ? this.newPhone.selectedSugg.city_with_type : this.newPhone.addressCity,
                        addressStreet: this.newPhone.selectedSugg ? this.newPhone.selectedSugg.street_with_type : this.newPhone.addressStreet,
                        addressHouse: this.newPhone.selectedSugg ? this.newPhone.selectedSugg.house : this.newPhone.addressHouse,
                        addressAppartament: this.newPhone.selectedSugg ? this.newPhone.selectedSugg.flat : this.newPhone.addressAppartament,
                        phoneOwner: this.newPhone.phoneOwner && this.newPhone.phoneOwner._id ? this.newPhone.phoneOwner._id : this.newPhone.phoneOwner,
                        phoneType: this.newPhone.phoneType,
                        isPayphone: false,
                        isPublic: false,
                        isFree: this.newPhone.phoneOwner ? false : true
                    })
                })
                this.newPhone.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp) {
                        console.log(resp)
                        // this.subscribers.push(resp)
                        M.toast({html: 'Обновлено', classes: 'rounded green white-text'})
                        M.Modal.getInstance(document.getElementById('telephone-modal')).close();
                        if (this.newPhone.ats && !this.newPhone.ats._id) {
                            this.newPhone.ats = this.ats.find(at => at._id === this.newPhone.ats)
                        }
                        if (this.newPhone.phoneOwner && !this.newPhone.phoneOwner._id) {
                            this.newPhone.phoneOwner = this.subscribers.find(at => at._id === this.newPhone.phoneOwner)
                        }
                        this.clearPhone()
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        deletePhone: async function(id) {
            try {
                let resp = await fetch('/telephones/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log(resp)
                if (resp.status === 200) {
                    M.toast({html: 'Удалено', classes: 'rounded green white-text'})
                    this.telephones = this.telephones.filter(el => el._id !== id)
                } else throw {
                    message: resp.statusText
                }
            } catch(err) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        clearPhone: function() {
            if (this.newPhone.oldVersion) {
                let telephones = []
                console.log('1')
                for (el of this.telephones) {
                    if (el._id === this.newPhone.oldVersion._id) {
                        el = this.newPhone.oldVersion
                    }
                    telephones.push(el)
                }
                this.telephones = telephones
            }
            this.newPhone = {
                _id: null,
                phoneNumber: '',
                ats: '',
                loading: false,
                address: '',
                suggestions: [],
                selectedSugg: {},
                phoneType: '',
                phoneOwner: null,
                isFree: true
            }
            this.newPhone.selectedSugg = {}
            this.newPhone.address = ''
            this.newPhone.suggestions = []
        },
        checkPhoneAddress: async function() {
            try {
                if (String(this.newPhone.address).trim().length === 0) throw {
                    code: 403,
                    message: 'Введите нормальный адрес'
                }
                this.newPhone.loading = true
       
                let resp = await fetch('https://data.pbprog.ru/api/address/full-address/parse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'a55595384d9a4649ae9b4cb0d28dcee81bdad369'
                    },
                    body: JSON.stringify({
                        query: this.newPhone.address,
                        count: 5, 
                    })
                })
                this.newPhone.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp.suggestions.length > 0) {
                        this.newPhone.suggestions = resp.suggestions
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        selectPhoneAddress: async function(sugg) {
            this.newPhone.selectedSugg = sugg.data
            this.newPhone.address = sugg.unrestricted_value
            this.newPhone.suggestions = []
        },

        // SUBSCRIBERS
        clearSubscriber: function() {
            if (this.newSubscriber.oldVersion) {
                let subscribers = []
                console.log('1')
                for (el of this.subscribers) {
                    if (el._id === this.newSubscriber.oldVersion._id) {
                        el = this.newSubscriber.oldVersion
                    }
                    subscribers.push(el)
                }
                this.subscribers = subscribers
            }
            this.newSubscriber = {
                _id: null,
                firstName: '',
                lastName: '',
                middleName: '',
                gander: false,
                age: 18,
                isBenefits: false,
                intercityAccess: false, 
                balance: 0,
                status: 'active',
                loading: false
            }
        },
        createSubscriber: async function() {
            try {
                this.newSubscriber.loading = true
       
                let resp = await fetch('/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: this.newSubscriber.firstName,
                        lastName: this.newSubscriber.lastName,
                        middleName: this.newSubscriber.middleName,
                        gander: this.newSubscriber.gander,
                        age: this.newSubscriber.age,
                        isBenefits: this.newSubscriber.isBenefits,
                        intercityAccess: this.newSubscriber.intercityAccess, 
                        balance: this.newSubscriber.balance,
                        status: 'active'
                    })
                })
                this.newSubscriber.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp) {
                        this.subscribers.push(resp)
                        M.toast({html: 'Добавлено', classes: 'rounded green white-text'})
                        M.Modal.getInstance(document.getElementById('subscriber-modal')).close();
                        this.clearSubscriber()
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        editSubscriber: async function(subscriber) {
            try {
                this.newSubscriber = subscriber
                this.newSubscriber.oldVersion = {
                    ...subscriber
                }
                this.newSubscriber.loading = false 
                M.Modal.getInstance(document.getElementById('subscriber-modal')).open();
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        editPhone: async function(tel) {
            try {
                this.newPhone = tel
                this.newPhone.oldVersion = {
                    ...tel
                }
                this.newPhone.loading = false 
                M.Modal.getInstance(document.getElementById('telephone-modal')).open();
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        saveSubscriber: async function() {
            try {
                this.newSubscriber.loading = true
                let resp = await fetch('/subscribers/' + this.newSubscriber._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: this.newSubscriber.firstName,
                        lastName: this.newSubscriber.lastName,
                        middleName: this.newSubscriber.middleName,
                        gander: this.newSubscriber.gander,
                        age: this.newSubscriber.age,
                        isBenefits: this.newSubscriber.isBenefits,
                        intercityAccess: this.newSubscriber.intercityAccess, 
                        balance: this.newSubscriber.balance,
                        status: this.newSubscriber.status
                    })
                })
                this.newSubscriber.loading = false 

                if (resp.status === 200) {
                    resp = await resp.json()
                    if (resp) {
                        console.log(resp)
                        // this.subscribers.push(resp)
                        M.toast({html: 'Обновлено', classes: 'rounded green white-text'})
                        M.Modal.getInstance(document.getElementById('subscriber-modal')).close();
                        this.clearSubscriber()
                    }
                } else throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
        deleteSubscriber: async function(id) {
            try {
                let resp = await fetch('/subscribers/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log(resp)
                if (resp.status === 200) {
                    M.toast({html: 'Удалено', classes: 'rounded green white-text'})
                    this.subscribers = this.subscribers.filter(el => el._id !== id)
                } else throw {
                    message: resp.statusText
                }
            } catch(err) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        },
    }
})