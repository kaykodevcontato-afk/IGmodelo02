# Paróquia Nossa Senhora do Livramento — versão organizada

Esta versão foi organizada a partir do HTML enviado. Mantive o conteúdo e o layout principal, melhorei a apresentação da foto da Festa da Padroeira, removi os cards de Instagram e YouTube que se repetiam em **Contato** e separei HTML, CSS e JavaScript.

## 1. Arquivos do projeto

- `index.html` — todos os textos, horários de missa, fotos, avisos, conteúdo, links e doações.
- `css/estilos.css` — cores, tamanhos, menus, efeitos e aparência em celular/computador.
- `js/script.js` — funcionamento das abas de doação, cópia do PIX, sino, comparador de fotos, zoom e menu.
- `MODELO-NOVO-AVISO.html` — exemplo pronto para copiar/colar e criar novos avisos.
- `LEIA-ME.md` — este manual.

Há também um arquivo **Paroquia_Livramento_Arquivo_Unico.html**, fornecido separadamente, caso você prefira manter tudo dentro de um só HTML.

## 2. Muito importante: fotos, fonte e som

O arquivo original enviado continha apenas o código, não as fotos/fontes/som. Assim, estes recursos **não foram incluídos no ZIP**. Copie os arquivos a seguir da pasta do site antigo e coloque-os **na mesma pasta do `index.html`** (sem mudar a grafia):

- `BatismoFoto02.jpg`
- `CatequeseFoto01.jpg`
- `EucaristiaSantissimoFoto01.jpg`
- `FestaPadroeiraFoto01.jpg`
- `Foto1EntradaIgreja.jpg`
- `FotoPadreAdeildoSebastiaoFerreira.jpeg`
- `FotoPadroeira.webp`
- `FotoPrimeiraAltarCelebracaomissas.png`
- `FotoPrimeiroAltarrestauradocomIA.png`
- `FotoSegundoAltar.png`
- `FotoTerceiroAltarAtual.jpeg`
- `LogoBrasaoDaParoquia.png`
- `Peristiwa.otf`
- `QRCodePixParoquia.png`
- `Somsinohorafundo.mp3`

Sem esses arquivos, as imagens não aparecerão no navegador. A imagem da festa já está referenciada como `FestaPadroeiraFoto01.jpg` e não precisa ser redimensionada manualmente para caber na página.

## 3. Foto da Festa de Nossa Senhora do Livramento

Abra `css/estilos.css`. Logo no início, dentro de `:root`, altere:

```css
--foto-festa-altura: 350px;           /* computadores */
--foto-festa-altura-celular: 255px;   /* celulares */
```

A foto será exibida inteira, com `object-fit: contain` (sem corte), dentro de uma moldura discreta. Ao clicar, ela abre maior na galeria, com zoom.

Para substituir a foto, no `index.html` procure `FestaPadroeiraFoto01.jpg` e altere o nome em `src` e `data-lightbox` para o arquivo novo. Coloque a imagem nova ao lado do HTML.

## 4. Como atualizar ou adicionar eventos

1. Abra `index.html` e procure `<!-- AVISOS & EVENTOS` ou `id="avisos"`.
2. Edite o evento principal dentro de `<article class="aviso-destaque">`.
3. Para adicionar um cartão simples: abra `MODELO-NOVO-AVISO.html`, copie o `<article class="aviso-card">` completo e cole **dentro** de `<div class="avisos-grid">` no `index.html`, ao lado dos demais cards.
4. Atualize a data, o título, o texto e o nome da foto (`src` e `data-lightbox`).

Para esconder um evento antigo, remova apenas o `<article class="aviso-card">` correspondente ou mova-o para um arquivo de arquivo histórico.

## 5. Como editar outras informações

| Informação | Onde editar |
|---|---|
| Nome e texto do site | `index.html`, cabeçalho e seção desejada |
| Missas e horários | `index.html`, procure `<!-- HORÁRIOS` e `agenda-item` |
| Contato, endereço e WhatsApp | `index.html`, seção `id="contato"` |
| Instagram, Facebook, YouTube e canal de WhatsApp | `index.html`, seção `id="redes"` |
| Logo e fotos | `index.html`, atributos `src` das imagens |
| PIX e dados bancários | `index.html`, seção `id="doacao"` (confira antes de publicar) |
| Azul, dourado e cores | `css/estilos.css`, seção `:root` |
| Foto da Festa | `css/estilos.css`, variáveis `--foto-festa-altura*` |
| Funcionalidades | `js/script.js`, seções comentadas |

O telefone de contato da secretaria e o canal de avisos do WhatsApp foram mantidos separadamente porque têm finalidades diferentes. Os canais sociais aparecem apenas na seção de redes, e não novamente como cartões em contato.

## 6. Publicar no GitHub Pages

Envie **a pasta `css` inteira, a pasta `js` inteira, o `index.html` e os arquivos de imagem/fontes/som** para a raiz do repositório (ou para a pasta que você já usa como site). Não troque nomes de arquivos sem atualizar as referências no HTML/CSS.

Para verificar no computador, abra `index.html` no navegador. Para testar de forma mais fiel a um site publicado, rode um servidor local simples, como `python -m http.server 8000` dentro da pasta e acesse `http://localhost:8000`.

## 7. Observações

- O site é estático; não há feed automático do Instagram nem identificação automática de transmissões ao vivo.
- Não alterei valores de PIX, conta bancária, horários ou dados históricos fornecidos no código. Confirme-os com a paróquia antes da publicação.
- A comparação dos altares, o zoom nas fotos e a cópia do PIX foram preservados.
