new Vue({
    el: '#authApp',
    data: {
        email: '',
        password: '',
        loading: false
    },
    methods: {
        verifyAuth: async function() {
            try {
                if (this.email.trim().length === 0) throw {
                    code: 403,
                    message: 'Введите email'
                }
                if (this.password.trim().length === 0) throw {
                    code: 403,
                    message: 'Введите пароль'
                }
                this.loading = true
       
                let resp = await fetch('/admin/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                    body: JSON.stringify({
                        email: this.email, 
                        password: this.password
                    })
                })
                this.loading = false 

                if (resp.status === 200 && resp.redirected) {
                    window.location = resp.url
                    M.toast({html: 'Успешно', classes: 'rounded green white-text'}) 
                }
                if (resp.status === 404) throw {
                    code: 404,
                    message: 'Такой учетной записи не существует'
                }
                if (resp.status === 401) throw { 
                    code: 401,
                    message: 'Неверный пароль'
                } 
                throw {
                    code: resp.status,
                    message: resp.statusText
                }
            } catch (e) {
                console.log(e)
                M.toast({html: e.message, classes: 'rounded red white-text'}) 
            }
        }
    }
})