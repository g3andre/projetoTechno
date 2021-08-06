const app = new Vue({
	el: '#app',
	data: {
		produtos: [],
	},
	created() {
    this.retrieveProducts();
  },
	methods: {
		retrieveProducts() {
			fetch('./api/produtos.json')
				.then((response) => response.json())
				.then((data) => (this.produtos = data));
		},
	},
  computed: {
    formatCurrency(value) {
      return `R$ ${parseFloat(value).toFixed(2)}`
    }
  }
});
