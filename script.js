// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function () {
  // Elementos da navegação
  const navbar = document.querySelector('.navbar');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-menu a');
  const backToTopButton = document.getElementById('backToTop');

  // Função para corrigir scroll horizontal
  function fixHorizontalScroll() {
    const viewportWidth = window.innerWidth;
    const bodyWidth = document.body.offsetWidth;

    // Se o body for maior que a viewport, ajustar
    if (bodyWidth > viewportWidth) {
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.width = '100%';
    }

    // Verificar elementos que podem causar overflow
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const elementWidth = element.offsetWidth;
      if (elementWidth > viewportWidth) {
        element.style.maxWidth = '100%';
        // Se for uma imagem ou vídeo, manter a proporção
        if (element.tagName === 'IMG' || element.tagName === 'VIDEO') {
          element.style.height = 'auto';
        }
      }
    });
  }

  // Chamar a função quando a página carregar e quando redimensionar
  window.addEventListener('load', fixHorizontalScroll);
  window.addEventListener('resize', fixHorizontalScroll);

  // Inicialização do preloader
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  });

  // Menu mobile toggle
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');

      // Ajusta o atributo aria-expanded para acessibilidade
      const isExpanded = this.classList.contains('active');
      this.setAttribute('aria-expanded', isExpanded);

      // Evitar scroll quando o menu está aberto
      if (isExpanded) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function (event) {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnToggle = mobileNavToggle.contains(event.target);

      if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
        mobileNavToggle.click();
      }
    });

    // Fechar menu ao redimensionar a janela para desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
        mobileNavToggle.click();
      }
    });
  }

  // Fechar menu ao clicar em links
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 992 && navMenu.classList.contains('active')) {
        mobileNavToggle.click();
      }
    });
  });

  // Mudança de estilo do navbar no scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Mostrar/esconder botão "voltar ao topo"
    if (backToTopButton) {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }
  });

  // Botão "voltar ao topo"
  if (backToTopButton) {
    backToTopButton.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Tabs na seção de resultados
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Remover classe "active" de todos os botões
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });

      // Adicionar classe "active" ao botão clicado
      this.classList.add('active');

      // Mostrar o painel correspondente
      const tabId = this.getAttribute('data-tab');

      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });

      document.getElementById(`${tabId}-panel`).classList.add('active');
    });
  });

  // Before-After Slider
  const sliders = document.querySelectorAll('.before-after-container');

  sliders.forEach(slider => {
    const sliderHandle = slider.querySelector('.slider-handle');
    const beforeImg = slider.querySelector('.before-img');

    let isDragging = false;

    // Função para atualizar a posição do slider
    const updateSliderPosition = (clientX) => {
      const sliderRect = slider.getBoundingClientRect();
      const position = (clientX - sliderRect.left) / sliderRect.width;

      // Limitar posição entre 0 e 1
      const clampedPosition = Math.max(0, Math.min(1, position));

      // Atualizar posição do handle e do clip-path
      const percentage = clampedPosition * 100;
      sliderHandle.style.left = `${percentage}%`;
      beforeImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    // Eventos de mouse
    sliderHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        updateSliderPosition(e.clientX);
        e.preventDefault();
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Eventos de toque
    sliderHandle.addEventListener('touchstart', (e) => {
      isDragging = true;
      // Prevenir comportamento padrão de deslizamento
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) {
        updateSliderPosition(e.touches[0].clientX);
        // Prevenir comportamento padrão de deslizamento da página
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Clique direto no slider
    slider.addEventListener('click', (e) => {
      updateSliderPosition(e.clientX);
    });
  });

  // Animação dos contadores na seção hero
  const setupCounterAnimation = () => {
    const counters = document.querySelectorAll('.trust-item .count');

    // Função para iniciar os contadores com animação suave
    const animateCounters = () => {
      counters.forEach(counter => {
        // Obtém o valor alvo do texto ou do atributo data-count
        const target = parseFloat(counter.getAttribute('data-count') || counter.innerText.replace(/[^\d.]/g, ''));
        // Define a velocidade do contador
        const speed = 200;
        // Calcula o incremento para cada etapa da animação
        const increment = target / speed;
        // Valor inicial do contador
        let currentCount = 0;

        // Função para atualizar o contador
        const updateCounter = () => {
          if (currentCount < target) {
            // Incrementa o valor atual
            currentCount += increment;

            // Formata o número dependendo se é inteiro ou decimal
            if (Number.isInteger(target)) {
              counter.textContent = Math.floor(currentCount);
            } else {
              // Para números decimais, exibe com 1 casa decimal
              counter.textContent = currentCount.toFixed(1);
            }

            // Continua a animação
            requestAnimationFrame(updateCounter);
          } else {
            // Quando atingir o alvo, define o valor exato
            counter.textContent = target;

            // Adiciona o símbolo "+" para números inteiros grandes
            if (Number.isInteger(target) && target > 100) {
              counter.textContent += '+';
            }
          }
        };

        // Inicia a animação do contador
        updateCounter();
      });
    };

    // Inicia os contadores quando a seção estiver visível usando IntersectionObserver
    const heroSection = document.querySelector('.hero');

    if (heroSection && counters.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Inicia os contadores
            setTimeout(animateCounters, 500);
            // Para de observar após iniciar os contadores
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      observer.observe(heroSection);
    }
  };

  // Iniciar animação dos contadores
  setupCounterAnimation();

  // Envio do formulário via WhatsApp
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Coletar dados do formulário
      const nome = document.getElementById('nome').value;
      const telefone = document.getElementById('telefone').value;
      const email = document.getElementById('email').value;

      // Coletar serviços selecionados
      const servicosChecked = document.querySelectorAll('input[name="servicos"]:checked');
      const servicos = Array.from(servicosChecked).map(checkbox => checkbox.value).join(', ');

      const dataPreferida = document.getElementById('data-preferida').value;
      const horarioPreferido = document.getElementById('horario-preferido').value;
      const mensagem = document.getElementById('mensagem').value;

      // Formatar data
      const dataFormatada = dataPreferida ? new Date(dataPreferida).toLocaleDateString('pt-BR') : '';

      // Criar mensagem para WhatsApp
      let whatsappMessage = `Olá! Gostaria de agendar um horário no Studio Dani Bade.\n\n`;
      whatsappMessage += `Nome: ${nome}\n`;
      whatsappMessage += `Telefone: ${telefone}\n`;
      whatsappMessage += `Email: ${email}\n\n`;
      whatsappMessage += `Serviços de interesse: ${servicos || 'Nenhum selecionado'}\n`;
      whatsappMessage += `Data preferida: ${dataFormatada}\n`;
      whatsappMessage += `Horário preferido: ${horarioPreferido}\n\n`;

      if (mensagem) {
        whatsappMessage += `Mensagem adicional: ${mensagem}\n`;
      }

      // Codificar mensagem para URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // Abrir WhatsApp Web ou App
      window.open(`https://wa.me/5551995415520?text=${encodedMessage}`, '_blank');
    });
  }

  // Máscara para campo de telefone
  const telefoneInput = document.getElementById('telefone');

  if (telefoneInput) {
    telefoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length <= 11) {
        // Formatar como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (value.length > 2) {
          value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        }
        if (value.length > 10) {
          value = `${value.substring(0, 10)}-${value.substring(10)}`;
        }
      }

      e.target.value = value;
    });
  }

  // Sliding testimonials (quando houver múltiplos)
  const testimonialItems = document.querySelectorAll('.testimonial-item');
  let currentTestimonial = 0;

  if (testimonialItems.length > 2) {
    // Função para mostrar próximo depoimento em telas pequenas
    const showNextTestimonial = () => {
      if (window.innerWidth <= 768) {
        testimonialItems.forEach(item => {
          item.style.display = 'none';
        });

        testimonialItems[currentTestimonial].style.display = 'block';

        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
      } else {
        testimonialItems.forEach(item => {
          item.style.display = 'block';
        });
      }
    };

    // Verificar tamanho da tela e configurar depoimentos
    window.addEventListener('resize', showNextTestimonial);

    // Iniciar slideshow
    showNextTestimonial();
    setInterval(showNextTestimonial, 5000);
  }

  // Efeito Parallax
  const parallaxBackground = document.querySelector('.parallax-background');

  if (parallaxBackground) {
    window.addEventListener('scroll', function () {
      const scrollPosition = window.pageYOffset;
      parallaxBackground.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
  }

  // Animação de aparecimento ao scroll (para navegadores sem suporte ao AOS)
  if (typeof AOS === 'undefined') {
    const fadeElements = document.querySelectorAll('.service-card, .benefit-icon, .contact-card');

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
      element.classList.add('fade-element');
      fadeObserver.observe(element);
    });
  }

  // Adicionar classe para animação de carregamento da página
  document.body.classList.add('loaded');
});