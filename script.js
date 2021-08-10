const app = new Vue({
	el: '#app',
	data: {
		produtos: [],
		produto: false,
		carrinho: [],
		alertaAtivo: false,
		mensagemAlerta: '',
		carrinhoAtivo: false,
	},
	created() {
		this.retrieveProducts();
		this.checaLocalStorage();
		this.acessaUrl();
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
				.then((data) => {
					this.produto = data;
					this.atualizaEstoque();
				});
		},
		fecharModal({ target, currentTarget }) {
			if (target == currentTarget) this.produto = false;
		},
		atualizaEstoque(qtd) {
			if (qtd) {
				this.produto.estoque -= qtd;
			} else {
				const index = this.carrinhoEditado.findIndex((item) => item.id === this.produto.id);
				console.log(index);
				if (index >= 0) this.produto.estoque -= this.carrinhoEditado[index].qtd;
			}
		},
		adicionarItem() {
			this.atualizaEstoque(1);
			let { id, nome, preco } = this.produto;
			this.carrinho.push({ id, nome, preco });
			this.alerta(`${nome} adicionado ao carrinho.`);
		},
		checaLocalStorage() {
			if (window.localStorage.carrinho) this.carrinho = JSON.parse(window.localStorage.carrinho);
		},
		alerta(mensagem) {
			this.mensagemAlerta = mensagem;
			this.alertaAtivo = true;
			setTimeout(() => {
				this.alertaAtivo = false;
			}, 2000);
		},
		acessaUrl() {
			let url = location.hash;
			if (url) this.retrieveProduct(url.replace('#', ''));
		},
		clickForaCarrinho({ target, currentTarget }) {
			if (target == currentTarget) this.carrinhoAtivo = false;
		},
		removerItem(index) {
			this.carrinho.splice(index, 1);
		},
	},
	computed: {
		carrinhoTotal() {
			return this.carrinho.reduce((acc, current) => {
				return acc + current.preco;
			}, 0);
		},
		carrinhoEditado() {
			const teste = this.carrinho.reduce((acc, item) => {
				const indexElement = acc.find((element, index) => {
					if (element.id == item.id) {
						acc[index].qtd++;
						return true;
					}
				});

				if (!indexElement) {
					acc.push({ ...item, qtd: 1 });
				}
				return acc;
			}, []);
			return teste;
		},
	},
	watch: {
		carrinho() {
			window.localStorage.carrinho = JSON.stringify(this.carrinho);
		},
		produto() {
			document.title = this.produto.nome || 'Techno';
			let hash = this.produto.id || '';
			history.pushState(null, null, `#${hash}`);
		},
	},
});
