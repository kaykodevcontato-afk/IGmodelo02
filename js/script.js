/* ================================================================
   FOTOS DO SITE — NÃO EDITE O NOME DAS FOTOS NESTE JAVASCRIPT.
   Todas as imagens são configuradas no CATÁLOGO DE FOTOS,
   bem no início do arquivo index.html.
   ================================================================ */
(function aplicarCatalogoDeFotos() {
    const bloco = document.getElementById('catalogo-de-fotos');
    if (!bloco) return;

    let fotos;
    try {
        fotos = JSON.parse(bloco.textContent);
    } catch (erro) {
        console.error('Catálogo de fotos inválido em index.html:', erro);
        return;
    }

    function buscarFoto(chave) {
        const nome = fotos[chave];
        if (typeof nome !== 'string' || !nome.trim()) {
            console.warn('Foto não encontrada no catálogo:', chave);
            return null;
        }
        return nome.trim();
    }

    document.querySelectorAll('img[data-foto]').forEach(function(img) {
        const nome = buscarFoto(img.dataset.foto);
        if (nome) img.setAttribute('src', nome);
    });

    document.querySelectorAll('[data-foto-fundo]').forEach(function(elemento) {
        const nome = buscarFoto(elemento.dataset.fotoFundo);
        if (nome) elemento.style.backgroundImage = 'url(' + JSON.stringify(nome) + ')';
    });

    document.querySelectorAll('[data-lightbox-foto]').forEach(function(elemento) {
        const nome = buscarFoto(elemento.dataset.lightboxFoto);
        if (nome) elemento.setAttribute('data-lightbox', nome);
    });

    // Ícone do navegador e imagem de compartilhamento acompanham a logo.
    const brasao = buscarFoto('brasao');
    if (brasao) {
        const icone = document.querySelector('link[rel="icon"]');
        const imagemSocial = document.querySelector('meta[property="og:image"]');
        if (icone) icone.setAttribute('href', brasao);
        if (imagemSocial) imagemSocial.setAttribute('content', brasao);
    }
})();

/* ================================================================
   PARÓQUIA NOSSA SENHORA DO LIVRAMENTO — FUNCIONALIDADES
   ================================================================
   As informações do site (fotos, textos, eventos e horários) ficam
   no index.html. O visual fica em css/estilos.css.

   Conteúdo deste arquivo:
     1. Missas, doações, ano, sino e comparação dos altares
     2. Galeria de fotos (zoom e ampliação)
     3. Menu horizontal
     4. Tela de carregamento
   ================================================================ */

(function () {
        'use strict';

        if (new URLSearchParams(location.search).has('debug')) {
            document.body.classList.add('debug');
        }

        const ano = document.getElementById('ano-atual');
        if (ano) ano.textContent = new Date().getFullYear();

        const tabs = document.querySelectorAll('.doacao-tab');
        const paineis = document.querySelectorAll('.doacao-painel');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const alvo = tab.dataset.tab;
                tabs.forEach(t => {
                    const ativa = t === tab;
                    t.classList.toggle('ativa', ativa);
                    t.setAttribute('aria-selected', ativa ? 'true' : 'false');
                });
                paineis.forEach(p => p.classList.toggle('ativo', p.dataset.painel === alvo));
            });
        });

        const btnPix = document.getElementById('btn-pix');
        if (btnPix) {
            btnPix.addEventListener('click', async function () {
                const chave = document.getElementById('chave-pix').textContent.trim();
                const aviso = btnPix.querySelector('.pix-aviso');
                const original = aviso.innerHTML;
                try {
                    await navigator.clipboard.writeText(chave);
                    aviso.innerHTML = '✅ CHAVE COPIADA!';
                    setTimeout(() => { aviso.innerHTML = original; }, 2000);
                } catch (e) {
                    alert('Chave PIX: ' + chave);
                }
            });
        }

        let tocandoAgora = false;
        function tocarSino(vezes) {
            if (tocandoAgora) return;
            tocandoAgora = true;
            const somSino = document.getElementById('som-sino');
            let contador = 0;
            (function tocarBatida() {
                if (contador < vezes) {
                    somSino.currentTime = 0;
                    somSino.play().catch(() => {});
                    contador++;
                    setTimeout(tocarBatida, 3000);
                } else {
                    tocandoAgora = false;
                }
            })();
        }

        const btnTeste = document.getElementById('btn-teste-sino');
        if (btnTeste) btnTeste.addEventListener('click', () => tocarSino(4));

        setInterval(() => {
            const agora = new Date();
            if (agora.getMinutes() === 0 && agora.getSeconds() === 0) {
                let batidas = agora.getHours() % 12;
                if (batidas === 0) batidas = 12;
                tocarSino(batidas);
            }
        }, 1000);

        const hoje = new Date();
        const diaSemana = hoje.getDay();
        const ehPrimeiraSemana = hoje.getDate() <= 7;
        document.querySelectorAll('.agenda-item').forEach(card => {
            const dia = parseInt(card.dataset.dia, 10);
            const apenasPrimeira = card.dataset.primeiraDoMes === 'true';
            if (dia === diaSemana) {
                if (apenasPrimeira && !ehPrimeiraSemana) return;
                card.classList.add('hoje');
            }
        });

        const slider = document.getElementById('slider');
        const restaurada = document.getElementById('restaurada');
        const imgInterna = restaurada ? restaurada.querySelector('img') : null;
        if (slider && restaurada && imgInterna) {
            const ajustarTamanho = () => { imgInterna.style.width = slider.offsetWidth + 'px'; };
            const moverDivisor = (e) => {
                const rect = slider.getBoundingClientRect();
                const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                const x = clientX - rect.left;
                const percentual = Math.min(Math.max((x / rect.width) * 100, 0), 100);
                restaurada.style.width = percentual + '%';
            };
            ajustarTamanho();
            window.addEventListener('load', ajustarTamanho);
            window.addEventListener('resize', ajustarTamanho);
            slider.addEventListener('mousemove', moverDivisor);
            slider.addEventListener('touchmove', moverDivisor, { passive: true });
        }
    })();

/* ============== LIGHTBOX COM PINCH-TO-ZOOM ============== */
    (function() {
        const overlay = document.getElementById('lightbox-overlay');
        const lbImg = document.getElementById('lightbox-img');
        const btnFechar = document.getElementById('lightbox-fechar');
        const dica = document.getElementById('lightbox-dica');
        if (!overlay || !lbImg) return;

        let scale = 1, posX = 0, posY = 0;
        let startScale = 1, startDist = 0;
        let startX = 0, startY = 0, startPosX = 0, startPosY = 0;
        let isDragging = false;
        let ultimoAcionador = null;
        let dicaTimer;

        function aplicarTransform() {
            lbImg.style.transform = 'translate(' + posX + 'px, ' + posY + 'px) scale(' + scale + ')';
        }

        function resetar() {
            scale = 1; posX = 0; posY = 0;
            aplicarTransform();
        }

        function abrir(src, alt, acionador) {
            ultimoAcionador = acionador || null;
            lbImg.src = src;
            lbImg.alt = alt || '';
            resetar();
            overlay.classList.add('ativo');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            btnFechar.focus();
            // Mostrar dica e esconder depois de 3s
            if (dica) {
                dica.style.opacity = '1';
                clearTimeout(dicaTimer);
                dicaTimer = setTimeout(function() { dica.style.opacity = '0'; }, 3000);
            }
        }

        function fechar() {
            overlay.classList.remove('ativo');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            lbImg.src = '';
            if (ultimoAcionador) ultimoAcionador.focus();
        }

        // Abrir ao clicar nas imagens com data-lightbox
        document.querySelectorAll('[data-lightbox]').forEach(function(el) {
            function ampliar(e) {
                e.preventDefault();
                e.stopPropagation();
                abrir(el.getAttribute('data-lightbox'), el.getAttribute('data-alt'), el);
            }
            el.addEventListener('click', ampliar);
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') ampliar(e);
            });
        });

        // Fechar
        btnFechar.addEventListener('click', fechar);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) fechar();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('ativo')) fechar();
        });

        // Distância entre dois toques
        function getDist(touches) {
            var dx = touches[0].clientX - touches[1].clientX;
            var dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }

        // Centro entre dois toques
        function getCenter(touches) {
            return {
                x: (touches[0].clientX + touches[1].clientX) / 2,
                y: (touches[0].clientY + touches[1].clientY) / 2
            };
        }

        // TOUCH — Pinch-to-zoom + drag com um dedo
        lbImg.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (e.touches.length === 2) {
                startDist = getDist(e.touches);
                startScale = scale;
            } else if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startPosX = posX;
                startPosY = posY;
            }
        }, { passive: false });

        lbImg.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (e.touches.length === 2) {
                var dist = getDist(e.touches);
                scale = Math.min(Math.max(startScale * (dist / startDist), 1), 6);
                aplicarTransform();
                if (dica) dica.style.opacity = '0';
            } else if (e.touches.length === 1 && isDragging && scale > 1) {
                posX = startPosX + (e.touches[0].clientX - startX);
                posY = startPosY + (e.touches[0].clientY - startY);
                aplicarTransform();
            }
        }, { passive: false });

        lbImg.addEventListener('touchend', function(e) {
            if (e.touches.length < 2) {
                startDist = 0;
            }
            if (e.touches.length === 0) {
                isDragging = false;
                // Se o zoom voltou a 1, centralizar
                if (scale <= 1.05) {
                    scale = 1; posX = 0; posY = 0;
                    aplicarTransform();
                }
            }
        });

        // MOUSE — scroll para zoom + drag
        var mouseDown = false, mStartX = 0, mStartY = 0, mStartPosX = 0, mStartPosY = 0;

        overlay.addEventListener('wheel', function(e) {
            if (!overlay.classList.contains('ativo')) return;
            e.preventDefault();
            var delta = e.deltaY > 0 ? 0.9 : 1.1;
            scale = Math.min(Math.max(scale * delta, 1), 6);
            if (scale <= 1.05) { scale = 1; posX = 0; posY = 0; }
            aplicarTransform();
        }, { passive: false });

        lbImg.addEventListener('mousedown', function(e) {
            if (scale > 1) {
                mouseDown = true;
                mStartX = e.clientX;
                mStartY = e.clientY;
                mStartPosX = posX;
                mStartPosY = posY;
                e.preventDefault();
            }
        });

        window.addEventListener('mousemove', function(e) {
            if (mouseDown) {
                posX = mStartPosX + (e.clientX - mStartX);
                posY = mStartPosY + (e.clientY - mStartY);
                aplicarTransform();
            }
        });

        window.addEventListener('mouseup', function() { mouseDown = false; });

        // Duplo toque para resetar zoom
        var lastTap = 0;
        lbImg.addEventListener('touchend', function(e) {
            var now = Date.now();
            if (now - lastTap < 300 && e.touches.length === 0) {
                if (scale > 1.1) {
                    resetar();
                } else {
                    scale = 2.5; posX = 0; posY = 0;
                    aplicarTransform();
                }
            }
            lastTap = now;
        });

        // Duplo clique mouse
        lbImg.addEventListener('dblclick', function() {
            if (scale > 1.1) { resetar(); } else { scale = 2.5; posX = 0; posY = 0; aplicarTransform(); }
        });
    })();

/* Menu: rolagem suave automática perto da borda esquerda/direita no desktop. */
    (function () {
        var menu = document.querySelector('.menu');
        if (!menu) return;

        var animacao = 0;
        var velocidade = 0;
        var borda = 105; // Distância em pixels para começar a revelar os próximos itens.
        var reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
        var mouseFino = window.matchMedia('(hover: hover) and (pointer: fine)');

        function parar() {
            velocidade = 0;
            if (animacao) cancelAnimationFrame(animacao);
            animacao = 0;
        }

        function mover() {
            if (!velocidade || !mouseFino.matches) { parar(); return; }
            var antes = menu.scrollLeft;
            menu.scrollLeft += velocidade;
            if (Math.abs(menu.scrollLeft - antes) < 0.01) { parar(); return; }
            animacao = requestAnimationFrame(mover);
        }

        function aoMoverMouse(evento) {
            if (!mouseFino.matches || menu.scrollWidth <= menu.clientWidth + 1) {
                parar(); return;
            }
            var area = menu.getBoundingClientRect();
            var distanciaEsquerda = evento.clientX - area.left;
            var distanciaDireita = area.right - evento.clientX;
            var zona = Math.min(borda, area.width / 3);
            var proporcao = 0;
            var direcao = 0;

            if (distanciaDireita < zona) {
                direcao = 1;
                proporcao = (zona - distanciaDireita) / zona;
            } else if (distanciaEsquerda < zona) {
                direcao = -1;
                proporcao = (zona - distanciaEsquerda) / zona;
            }

            if (!direcao) { parar(); return; }
            // Movimento progressivo, mais rápido ao se aproximar da borda.
            velocidade = direcao * (1 + proporcao * (reduzirMovimento.matches ? 4 : 11));
            if (!animacao) animacao = requestAnimationFrame(mover);
        }

        menu.addEventListener('pointermove', function (evento) {
            if (evento.pointerType === 'mouse') aoMoverMouse(evento);
        });
        menu.addEventListener('pointerleave', parar);
        menu.addEventListener('pointerdown', parar);
        window.addEventListener('blur', parar);
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) parar();
        });

        // Navegação por Tab: exibe o link focado mesmo que esteja fora da tela.
        menu.addEventListener('focusin', function (evento) {
            parar();
            if (evento.target.matches('a')) {
                evento.target.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: 'auto'});
            }
        });
    })();

/* ============== PRELOADER CONTROLLER ============== */
    (function() {
        var pre = document.getElementById('preloader');
        if (!pre) return;

        var iniciandoSaida = false;
        function concluir() {
            if (iniciandoSaida) return;
            iniciandoSaida = true;
            // 1. Brilho forte
            pre.classList.add('brilhar');
            // 2. Após o brilho, esconde
            setTimeout(function() {
                pre.classList.add('esconder');
                // 3. Remove do DOM após a transição
                setTimeout(function() {
                    pre.remove();
                }, 700);
            }, 800);
        }

        // Esperar tudo carregar (imagens, fontes, etc)
        window.addEventListener('load', function() {
            // Garante um mínimo de 1.2s de exibição para não piscar
            var tempoMin = 1200;
            var inicio = performance.timing ? performance.timing.navigationStart : (Date.now() - 1000);
            var passado = Date.now() - inicio;
            var restante = Math.max(tempoMin - passado, 0);
            setTimeout(concluir, restante);
        });

        // Fallback: se por algum motivo o load não dispara em 6s
        setTimeout(function() {
            if (pre.parentNode) concluir();
        }, 6000);
    })();

