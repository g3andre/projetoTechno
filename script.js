const app = new Vue({
	el: '#app',
	data: {
		produtos: [],
		produto: false,
	},
	created() {
		this.retrieveProducts();
	},
	filters: {
		formatCurrency(value) {
			return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
		},
	},
	methods: {
		retrieveProducts() {
			fetch('./api/produtos.json')
				.then((response) => response.json())
				.then((data) => (this.produtos = data));
		},
		retrieveProduct(productId) {
			fetch(`./api/produtos/${productId}/dados.json`)
				.then((response) => response.json())
				.then((data) => (this.produto = data));
		},
	},
	computed: {
		formatCurrency(value) {
			return `R$ ${parseFloat(value).toFixed(2)}`;
		},
	},
});
