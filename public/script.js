let LOAD_NUM = 4;
let watcher;
setTimeout(() => {
    new Vue({
        el: "#app",
        data: {
            total: 1,
            products: [],
            cart: [],
            search: 'cat',
            lastSerach: '',
            loading: false,
            results: []
        },
        methods: {
            addToCart(item) {
                var found = false;
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart[i].qty++
                        found = true;
                    }
                }
                if (!found) {
                    this.cart.push({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        qty: 1
                    })
                }
                this.total += item.price
            },
            inc(item) {
                item.qty++;
                this.total += item.price
            },
            dec(item) {
                if (item.qty > 0) {
                    item.qty--
                    this.total -= item.price
                }
                else {
                    let removeItem = this.cart.indexOf(item)
                    this.cart.splice(removeItem, 1)
                }
            },
            onSubmit() {
                this.products = []
                this.results = []
                this.loading = true
                var path = `/search?q=${this.search}`
                this.$http.get(path).
                    then(function (response) {
                        setTimeout(function () {
                            this.results = response.body
                            this.lastSerach = this.search
                            this.appendResults();
                            this.loading = false
                        }.bind(this), 3000)

                    })
            },
            appendResults() {
                if (this.products.length < this.results.length) {
                    var toAppend = this.results.slice(this.products.length, LOAD_NUM + this.products.length)
                    this.products = this.products.concat(toAppend)
                }
            }
        },
        filters: {
            currency(price) {
                return `$${price.toFixed(2)}`
            }
        },
        created() {
            this.onSubmit()
        },
        updated() {
            var sensor = document.querySelector("#product-list-bottom")
            watcher = scrollMonitor.create(sensor)
            watcher.enterViewport(this.appendResults)
        },
        beforeUpdate() {
            if (watcher) {
                watcher.destroy();
                watcher = null
            }

        },
    })

}, 3000);
