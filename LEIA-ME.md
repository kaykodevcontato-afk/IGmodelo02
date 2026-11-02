# Site Paróquia do Livramento — Guia rápido

## Trocar fotos: um único local

Abra **`index.html`**. Perto do início do arquivo, procure:

**`📸 FOTOS DO SITE — ALTERE OS NOMES DOS ARQUIVOS SOMENTE AQUI`**

Você encontrará uma lista como esta:

```json
"padroeira": "FotoPadroeira.webp",
"festa": "FestaPadroeiraFoto01.jpg",
"paroco": "FotoPadreAdeildoSebastiaoFerreira.jpeg"
```

Para trocar a foto da festa, basta substituir `FestaPadroeiraFoto01.jpg` pelo nome da sua imagem. Salve o novo arquivo na **mesma pasta de `index.html`**. Não precisa mudar `data-foto`, `data-lightbox-foto` nem procurar o nome antigo em outras partes do HTML.

Se guardar suas imagens numa pasta `fotos/`, use por exemplo `"festa": "fotos/minha-festa.jpg"`. Letras maiúsculas e minúsculas importam no GitHub Pages.

## Índice de todas as fotos e onde aparecem

| Identificador no catálogo | Onde aparece | Nome original |
|---|---|---|
| `brasao` | Brasão / logo — aparece no topo e no carregamento | `LogoBrasaoDaParoquia.png` |
| `entrada_igreja` | Foto grande do início — fachada da igreja | `Foto1EntradaIgreja.jpg` |
| `altar_1_original` | História — primeiro altar (foto original) | `FotoPrimeiraAltarCelebracaomissas.png` |
| `altar_1_restaurado` | História — primeiro altar (restauração por IA) | `FotoPrimeiroAltarrestauradocomIA.png` |
| `altar_2` | História — segundo altar | `FotoSegundoAltar.png` |
| `altar_3` | História — terceiro altar (atual) | `FotoTerceiroAltarAtual.jpeg` |
| `padroeira` | Seção Nossa Padroeira — foto com moldura dourada | `FotoPadroeira.webp` |
| `paroco` | Seção Nosso Pároco | `FotoPadreAdeildoSebastiaoFerreira.jpeg` |
| `festa` | Avisos e Eventos — Festa do Livramento (com moldura dourada) | `FestaPadroeiraFoto01.jpg` |
| `quinta_eucaristica` | Avisos e Eventos — Quinta Eucarística | `EucaristiaSantissimoFoto01.jpg` |
| `catequese` | Avisos e Eventos — Catequese | `CatequeseFoto01.jpg` |
| `batismo` | Avisos e Eventos — Batismos | `BatismoFoto02.jpg` |
| `qr_pix` | Doações — QR Code do PIX (não é foto decorativa) | `QRCodePixParoquia.png` |

O brasão também está escrito nos metadados `og:image` e `application/ld+json` como valor inicial para compartilhamento/buscadores. Se substituir o brasão definitivamente, atualize essas duas menções manualmente para manter a prévia de compartilhamento correta; o JavaScript atualiza a aparência do site automaticamente.

## Moldura dourada da Festa

A foto da Festa agora usa a **mesma classe `.moldura-dourada` da foto de Nossa Padroeira**, inclusive com os detalhes ✦ e bordas arredondadas. A foto continua inteira, centralizada e clicável para ampliar.

Para mudar a altura do cartão, abra `css/estilos.css` e altere estas variáveis no início do arquivo:

```css
--foto-festa-altura: 350px;         /* computador */
--foto-festa-altura-celular: 255px; /* celular */
```

## Adicionar um evento com foto

1. Abra `MODELO-NOVO-AVISO.html`.
2. Abra `index.html` e, no catálogo de fotos, adicione uma nova chave, por exemplo `"novo_evento": "MinhaFoto.jpg"` (se necessário, inclua vírgula após a entrada anterior).
3. Cole o artigo do modelo dentro de `<div class="avisos-grid">` no `index.html`.
4. Preencha data, nome e descrição do evento. O nome `novo_evento` do modelo deve ser o mesmo nome da chave adicionada ao catálogo.

## Estrutura e publicação

- `index.html`: conteúdo, horários, eventos, dados e **catálogo central de fotos**.
- `css/estilos.css`: cores e aparência, moldura dourada e dimensões.
- `js/script.js`: carregamento das imagens, zoom, menu, botões, sino etc.
- `MODELO-NOVO-AVISO.html`: cartão reutilizável.
- `LEIA-ME.md`: este guia.

O ZIP contém o código, mas **não as fotos, o arquivo `Peristiwa.otf` nem `Somsinohorafundo.mp3`**, porque não foram enviados junto com o HTML. Copie esses recursos do projeto antigo para junto de `index.html` antes de publicar. Envie todos os arquivos e as duas pastas (`css`, `js`) ao GitHub Pages.

**Atenção:** o código usa JavaScript para carregar as fotos da lista; não exclua `js/script.js` da versão em pastas. A versão de um HTML único já inclui o CSS e o JavaScript dentro dela. Dados de PIX, contatos e horários foram mantidos como recebidos; confirme-os com a paróquia antes de publicar.
