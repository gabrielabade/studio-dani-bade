// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function () {

  // Inicialização do preloader
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  });

  // Menu mobile toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Fechar menu ao clicar em links
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navMenu.classList.remove('active');
      mobileNavToggle.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Mudança de estilo do navbar no scroll
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Mostrar/esconder botão "voltar ao topo"
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }
  });

  // Botão "voltar ao topo"
  const backToTopButton = document.getElementById('backToTop');
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
    sliderHandle.addEventListener('mousedown', () => {
      isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        updateSliderPosition(e.clientX);
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Eventos de toque
    sliderHandle.addEventListener('touchstart', () => {
      isDragging = true;
    });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) {
        updateSliderPosition(e.touches[0].clientX);
      }
    });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Clique direto no slider
    slider.addEventListener('click', (e) => {
      updateSliderPosition(e.clientX);
    });
  });

  // Contadores animados
  const startCounters = () => {
    const counters = document.querySelectorAll('.trust-item .count');

    counters.forEach(counter => {
      const target = parseFloat(counter.innerText.replace(/[^\d.]/g, ''));
      const increment = target / 50;
      let current = 0;

      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.innerText = Math.round(current).toString();
          setTimeout(updateCounter, 20);
        } else {
          counter.innerText = target;
        }
      };

      updateCounter();
    });
  };

  // Iniciar contadores quando a seção estiver visível
  const heroSection = document.querySelector('.hero');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (heroSection) {
    observer.observe(heroSection);
  }

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
      const dataFormatada = new Date(dataPreferida).toLocaleDateString('pt-BR');

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