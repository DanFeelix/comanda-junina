# 🎉 Comanda Junina Digital

Uma aplicação web responsiva para gerenciar comandas de festa junina, desenvolvida com React e Material-UI.

![Comanda Junina Preview](./src/img/360_F_499624311_uftK1Z2520YNj8woSkAi7CQ8CZavrSHh.jpg)

## 📱 Características

- Interface responsiva otimizada para celulares
- Categorias dinâmicas baseadas nos dados da planilha
- Layout moderno similar ao iFood com imagens dos produtos
- Controle de quantidades com botões + e -
- Total geral da comanda (sem subtotais)
- Resumo compacto dos itens selecionados
- Botões para limpar comanda e atualizar dados
- Design temático de festa junina
- Integração com planilha Google Sheets
- Suporte a imagens dos produtos via URL

## 🎨 Design

- Cores vibrantes e festivas
- Gradientes coloridos
- Elementos arredondados
- Feedback visual para itens selecionados
- Imagem de fundo temática
- Efeitos de hover e transições suaves

## 🛠️ Tecnologias

- React 18+
- TypeScript
- Material-UI 5
- Emotion (para estilos)
- Google Sheets como backend
- CSV para importação de dados

## 📦 Instalação

```bash
# Clone o repositório
git clone [URL_DO_SEU_REPOSITORIO]

# Entre no diretório
cd comanda-junina

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

## 🚀 Uso

1. Acesse a aplicação no navegador (http://localhost:3000)
2. Os dados são carregados automaticamente da planilha do Google Sheets
3. Navegue pelas categorias de produtos (geradas dinamicamente)
4. Use os botões + e - para ajustar as quantidades
5. Veja o total geral da comanda
6. Use o botão "Limpar Comanda" para zerar as quantidades
7. Use o botão "Atualizar" para recarregar os dados da planilha

## 📊 Estrutura da Planilha

A planilha deve ter as seguintes colunas:
1. Categorias - Categoria do item
2. Nomes - Nome do produto
3. Valores - Preço do produto
4. Imagens - URL da imagem do produto

## 📱 Acesso via Celular

Para acessar via celular durante o desenvolvimento:

1. Certifique-se que o computador e o celular estão na mesma rede Wi-Fi
2. Descubra o IP do seu computador
3. Acesse no celular usando o IP e a porta 3000 (exemplo: http://192.168.1.100:3000)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
