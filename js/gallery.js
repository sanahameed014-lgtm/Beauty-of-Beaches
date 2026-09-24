 (function() {
            'use strict';

            // ==========================================
            // GALLERY DATA — 20 Luxury Ocean Images
            // ==========================================
            const galleryImages = [
                { src: 'images/image-1.jpg', title: 'Tropical Escape', desc: 'Discover the beauty of the ocean.', size: 'large' },
                { src: 'images/image-2.jpg', title: 'Crystal Waters', desc: 'Where the sea meets the sky.', size: 'normal' },
                { src: 'images/image3.png', title: 'Azure Dreams', desc: 'Endless horizons await.', size: 'tall' },
                { src: 'images/image4.png', title: 'Palm Paradise', desc: 'Shade under tropical palms.', size: 'normal' },
                { src: 'images/image6.png', title: 'Wave Whisper', desc: 'Listen to the calming tides.', size: 'wide' },
                { src: 'images/image17.png', title: 'Coastal Breeze', desc: 'Feel the ocean wind.', size: 'normal' },
                { src: 'images/image9.png', title: 'Sunset Shore', desc: 'Golden hours by the beach.', size: 'tall' },
                { src: 'images/image10.png', title: 'Hidden Cove', desc: 'Secret spots of serenity.', size: 'normal' },
                { src: 'images/image11.png', title: 'Deep Blue', desc: 'The mystery of the ocean.', size: 'wide' },
                { src: 'images/image7.png', title: 'Island Life', desc: 'Escape to paradise.', size: 'normal' },
                { src: 'images/image18.png', title: 'Ocean Drift', desc: 'Let the current guide you.', size: 'large' },
                { src: 'images/image19.png', title: 'Lagoon Glow', desc: 'Turquoise waters shimmer.', size: 'normal' },
                { src: 'images/image20.png', title: 'Seaside Calm', desc: 'Peace found in waves.', size: 'tall' },
                { src: 'images/img.png', title: 'Marine Magic', desc: 'Underwater wonders above.', size: 'normal' },
                { src: 'images/image1.png', title: 'Beach Bliss', desc: 'Soft sand, warm sun.', size: 'wide' },
                { src: 'images/image5.png', title: 'Tide Pool', desc: 'Nature\'s tiny aquariums.', size: 'normal' },
                { src: 'images/image-2.jpg', title: 'Horizon Line', desc: 'Where earth meets water.', size: 'tall' },
                { src: 'images/image7.png', title: 'Coral Coast', desc: 'Vibrant life beneath waves.', size: 'normal' },
                { src: 'images/image13.png', title: 'Sandy Toes', desc: 'Walk where the water kisses land.', size: 'large' },
                { src: 'images/image14.png', title: 'Seafoam', desc: 'Gentle waves on white sand.', size: 'normal' }
            ];

            // Reveal directions for alternating animation
            const revealDirections = ['up', 'right', 'up', 'left', 'scale', 'up', 'right', 'down', 'up', 'left', 'scale', 'up', 'right', 'up', 'left', 'down', 'up', 'right', 'scale', 'up'];

            // Floating animation classes
            const floatClasses = ['gallery-card--float-1', 'gallery-card--float-2', 'gallery-card--float-3', 'gallery-card--float-4'];

          
            // STATE
            let currentLightboxIndex = 0;
            let lightboxOpen = false;

           // DOM ELEMENTS
            const grid = document.getElementById('galleryGrid');
            const lightbox = document.getElementById('galleryLightbox');
            const lightboxImage = document.getElementById('galleryLightboxImage');
            const lightboxCounter = document.getElementById('galleryLightboxCounter');
            const lightboxClose = lightbox.querySelector('.gallery-lightbox__close');
            const lightboxPrev = lightbox.querySelector('.gallery-lightbox__prev');
            const lightboxNext = lightbox.querySelector('.gallery-lightbox__next');

             // CREATE CARD HTML
           
            function createCard(image, index) {
                const sizeClass = image.size !== 'normal' ? `gallery-card--${image.size}` : '';
                const revealClass = `gallery-reveal--${revealDirections[index % revealDirections.length]}`;
                const floatClass = index % 3 === 0 ? floatClasses[Math.floor(Math.random() * floatClasses.length)] : '';
                const delay = (index % 4) * 0.1;
              return `
                  <article class="gallery-card ${sizeClass} ${revealClass} ${floatClass}" 
                           data-index="${index}" 
                           style="transition-delay: ${delay}s"
                           role="button" 
                           tabindex="0"
                           aria-label="View ${image.title}">
                      <div class="gallery-card__image-wrapper">
                          <img class="gallery-card__image" 
                               src="${image.src}" 
                               alt="${image.title}" 
                               loading="lazy">
                          <div class="gallery-ripple"></div>
                          <div class="gallery-card__overlay">
                              <h3 class="gallery-card__title">${image.title}</h3>
                              <p class="gallery-card__desc">${image.desc}</p>
                              <button class="gallery-card__btn">View Image</button>
                          </div>
                      </div>
                  </article>
              `;
          }

         // RENDER IMAGES
         
          function renderImages() {
              const fragment = document.createDocumentFragment();
              const wrapper = document.createElement('div');
              
              for (let i = 0; i < galleryImages.length; i++) {
                  wrapper.innerHTML += createCard(galleryImages[i], i);
              }
              
              // Convert HTML string to DOM nodes
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = wrapper.innerHTML;
              
              while (tempDiv.firstChild) {
                  fragment.appendChild(tempDiv.firstChild);
              }
              
              grid.innerHTML = '';
              grid.appendChild(fragment);

              observeCards();
          }

         // INTERSECTION OBSERVER — SCROLL REVEAL
      
          let cardObserver;

          function observeCards() {
              if (cardObserver) cardObserver.disconnect();

              const options = {
                  root: null,
                  rootMargin: '0px 0px 15% 0px', /* arm before the tile is on screen */
                  threshold: 0.1
              };

              cardObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                      if (entry.isIntersecting) {
                          // Staggered reveal
                          const card = entry.target;
                          const index = parseInt(card.dataset.index);
                          const delay = (index % 4) * 100;
                          
                          setTimeout(() => {
                              card.classList.add('gallery-card--revealed');
                          }, delay);
                          
                          cardObserver.unobserve(card);
                      }
                  });
              }, options);

              document.querySelectorAll('.gallery-card').forEach(card => {
                  cardObserver.observe(card);
              });
          }
          // RIPPLE EFFECT
       
          function createRipple(e, card) {
              const ripple = card.querySelector('.gallery-ripple');
              const rect = card.getBoundingClientRect();
              const size = Math.max(rect.width, rect.height) * 0.5;
              const x = e.clientX - rect.left - size / 2;
              const y = e.clientY - rect.top - size / 2;

              ripple.style.width = ripple.style.height = size + 'px';
              ripple.style.left = x + 'px';
              ripple.style.top = y + 'px';
              ripple.classList.remove('gallery-ripple--active');
              
              // Force reflow
              void ripple.offsetWidth;
              ripple.classList.add('gallery-ripple--active');

              // Clean up
              setTimeout(() => {
                  ripple.classList.remove('gallery-ripple--active');
              }, 800);
          }
          // LIGHTBOX
     
          function openLightbox(index) {
              currentLightboxIndex = index;
              lightboxImage.src = galleryImages[index].src;
              lightboxImage.alt = galleryImages[index].title;
              updateLightboxCounter();
              lightbox.classList.add('gallery-lightbox--active');
              lightboxOpen = true;
              document.body.style.overflow = 'hidden';
          }

          function closeLightbox() {
              lightbox.classList.remove('gallery-lightbox--active');
              lightboxOpen = false;
              document.body.style.overflow = '';
          }

          function nextImage() {
              currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
              updateLightbox();
          }

          function prevImage() {
              currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
              updateLightbox();
          }

          function updateLightbox() {
              lightboxImage.style.opacity = '0';
              setTimeout(() => {
                  lightboxImage.src = galleryImages[currentLightboxIndex].src;
                  lightboxImage.alt = galleryImages[currentLightboxIndex].title;
                  lightboxImage.style.opacity = '1';
                  updateLightboxCounter();
              }, 200);
          }

          function updateLightboxCounter() {
              lightboxCounter.textContent = `${String(currentLightboxIndex + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
          }
           // EVENT LISTENERS
              grid.addEventListener('click', (e) => {
              const card = e.target.closest('.gallery-card');
              if (!card) return;
              
              const index = parseInt(card.dataset.index);
              createRipple(e, card);
              setTimeout(() => openLightbox(index), 300);
          });

          // Keyboard accessibility for cards
          grid.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                  const card = e.target.closest('.gallery-card');
                  if (card) {
                      e.preventDefault();
                      const index = parseInt(card.dataset.index);
                      openLightbox(index);
                  }
              }
          });

          // Lightbox Controls
          lightboxClose.addEventListener('click', closeLightbox);
          lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
          lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
          
          lightbox.addEventListener('click', (e) => {
              if (e.target === lightbox) closeLightbox();
          });

          // Keyboard Navigation
          document.addEventListener('keydown', (e) => {
              if (!lightboxOpen) return;
              
              switch(e.key) {
                  case 'Escape':
                      closeLightbox();
                      break;
                  case 'ArrowRight':
                      nextImage();
                      break;
                  case 'ArrowLeft':
                      prevImage();
                      break;
              }
          });

          // Swipe Support for Mobile
          let touchStartX = 0;
          let touchEndX = 0;

          lightbox.addEventListener('touchstart', (e) => {
              touchStartX = e.changedTouches[0].screenX;
          }, { passive: true });

          lightbox.addEventListener('touchend', (e) => {
              touchEndX = e.changedTouches[0].screenX;
              handleSwipe();
          }, { passive: true });

          function handleSwipe() {
              const swipeThreshold = 50;
              const diff = touchStartX - touchEndX;
              
              if (Math.abs(diff) > swipeThreshold) {
                  if (diff > 0) {
                      nextImage(); // Swipe left → next
                  } else {
                      prevImage(); // Swipe right → previous
                  }
              }
          }
            // INITIALIZE
        
          renderImages();

        })();
  