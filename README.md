# Constantino's Hotel — Landing Page

Landing page estática e responsiva do Constantino's Hotel, construída com HTML, CSS e JavaScript puro. Não requer instalação, build, backend ou banco de dados.

## Estrutura

- `index.html` — conteúdo, SEO e estrutura semântica
- `style.css` — identidade visual e componentes
- `responsive.css` — ajustes para tablets e celulares
- `script.js` — menu, navegação, formulário do WhatsApp, animações, FAQ e galeria
- `assets/` — imagens e ícones locais

## Fotos do estacionamento

As fotos estão desativadas para a publicação atual e não são carregadas pelo navegador. No lugar delas, o site exibe um painel vetorial leve.

Para ativá-las novamente, altere apenas esta linha no início de `script.js`:

```js
const SITE_CONFIG = Object.freeze({ showParkingGallery: true });
```

O HTML das fotos permanece no `template` `parking-gallery-template`, em `index.html`, e a ampliação em tela cheia já está pronta.

## Publicação

Envie `index.html`, `style.css`, `responsive.css`, `script.js` e a pasta `assets` para a raiz do serviço de hospedagem. O site funciona tanto na raiz quanto em uma subpasta, pois usa caminhos relativos.

Antes de divulgar o endereço definitivo:

1. Confirme os telefones, endereço e número do WhatsApp.
2. Substitua o valor de `og:image` por uma URL absoluta quando o domínio estiver disponível.
3. Teste os botões de WhatsApp, ligação e rota no domínio publicado.

## Execução local

Abra `index.html` diretamente ou sirva a pasta com um servidor estático:

```bash
python3 -m http.server 4173
```
