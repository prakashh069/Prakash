/**
 * ============================================================================
 * SHREEYA'S BIRTHDAY WEBSITE — CLIENT APPLICATION
 * Interactive features, choreographed audio, and entrance animations
 * ============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------------------------
     1. Motion Preference
     -------------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --------------------------------------------------------------------------
     2. Hero Moon Orbit: Parametric Ticket Animation
     -------------------------------------------------------------------------- */
  const initMoonOrbit = () => {
    const art = document.querySelector('.hero-art');
    const ticket = document.getElementById('moonTicket');

    if (!art || !ticket) return;

    const tilt = (-27 * Math.PI) / 180;
    const period = 18000; // 18 seconds per full revolution
    let startTime = null;

    const renderOrbit = (now) => {
      if (startTime === null) startTime = now;

      // If user prefers reduced motion, hold a clean stationary angle
      const t = prefersReducedMotion.matches
        ? -0.65
        : ((now - startTime) / period) * Math.PI * 2 - 0.65;

      const a = art.clientWidth * 0.47;
      const b = art.clientWidth * 0.205;

      const x = a * Math.cos(t);
      const y = b * Math.sin(t);

      // Rotate ellipse by tilt angle
      const rx = x * Math.cos(tilt) - y * Math.sin(tilt);
      const ry = x * Math.sin(tilt) + y * Math.cos(tilt);

      ticket.style.left = `calc(50% + ${rx}px)`;
      ticket.style.top = `calc(51.5% + ${ry}px)`;

      // Depth sorting: behind the moon when on the far side of orbit
      ticket.classList.toggle('behind-moon', Math.sin(t) < 0);

      if (!prefersReducedMotion.matches) {
        requestAnimationFrame(renderOrbit);
      }
    };

    requestAnimationFrame(renderOrbit);
  };

  /* --------------------------------------------------------------------------
     3. Audio & Experience Controller
     -------------------------------------------------------------------------- */
  const initAudioAndExperience = () => {
    // DOM Elements
    const soundEntry = document.getElementById('soundEntry');
    const startBtn = document.getElementById('startExperience');
    const bgSong = document.getElementById('backgroundSong');
    const birthdaySong = document.getElementById('birthdaySong');
    const envelope = document.getElementById('envelope');
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('close');
    const bearScene = document.getElementById('bearScene');
    const finalSection = document.getElementById('surprise');

    // State Variables
    let audioUnlocked = false;
    let isInFinalSection = false;
    let modalTimer = null;
    let lastActiveElement = null;

    /**
     * Synchronize background music playback based on scroll position,
     * modal visibility, and browser tab active state.
     */
    const syncBackgroundMusic = () => {
      const isModalOpen = modal && modal.classList.contains('show');
      const isEnvelopeOpen = envelope && envelope.classList.contains('open');
      const shouldPlay =
        audioUnlocked &&
        !isInFinalSection &&
        !isModalOpen &&
        !isEnvelopeOpen &&
        !document.hidden;

      if (!bgSong) return;

      if (shouldPlay) {
        if (bgSong.paused) {
          bgSong.play().catch((err) => {
            console.warn('Background audio playback blocked:', err);
          });
        }
      } else if (!bgSong.paused) {
        bgSong.pause();
      }
    };

    // User gesture overlay to unlock audio permissions across mobile & desktop
    if (startBtn && soundEntry) {
      startBtn.addEventListener('click', () => {
        audioUnlocked = true;
        if (bgSong) {
          bgSong.volume = 0.32;
          bgSong.play().catch((err) => {
            console.warn('Tap-to-play audio blocked:', err);
          });
        }
        soundEntry.classList.add('dismissed');
        soundEntry.setAttribute('aria-hidden', 'true');
        startBtn.blur();
      });
    }

    // Pause background song when scrolling into the final surprise section
    if (finalSection) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          isInFinalSection = entries[0].isIntersecting;
          syncBackgroundMusic();
        },
        { threshold: 0, rootMargin: '0px 0px -15% 0px' }
      );
      sectionObserver.observe(finalSection);
    }

    // Visibility change handler (tab switch)
    document.addEventListener('visibilitychange', syncBackgroundMusic);

    /* ------------------------------------------------------------------------
       4. Bear Delivery Scene & Floating Hearts Trail
       ------------------------------------------------------------------------ */
    if (bearScene) {
      const bearObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            bearScene.classList.add('arrived');

            // Generate floating heart particle trail
            if (!prefersReducedMotion.matches && envelope) {
              let heartCount = 0;
              const trailInterval = setInterval(() => {
                heartCount++;
                if (heartCount > 16) {
                  clearInterval(trailInterval);
                  return;
                }

                const envRect = envelope.getBoundingClientRect();
                const sceneRect = bearScene.getBoundingClientRect();

                const heart = document.createElement('span');
                heart.className = 'scene-heart';
                heart.textContent = heartCount % 3 === 0 ? '♥' : '♡';

                const leftOffset =
                  envRect.left -
                  sceneRect.left +
                  Math.min(36, envRect.width * 0.2) +
                  (heartCount % 3) * 5;
                const topOffset =
                  envRect.top -
                  sceneRect.top +
                  envRect.height * (0.33 + (heartCount % 4) * 0.1);

                heart.style.left = `${leftOffset}px`;
                heart.style.top = `${topOffset}px`;
                heart.style.setProperty('--size', `${15 + (heartCount % 4) * 4}px`);

                bearScene.appendChild(heart);
                heart.addEventListener(
                  'animationend',
                  () => heart.remove(),
                  { once: true }
                );
              }, 175);
            }

            bearObserver.disconnect();
          }
        },
        { threshold: 0.28 }
      );

      bearObserver.observe(bearScene);
    }

    /* ------------------------------------------------------------------------
       5. Interactive Cards (Postcard & Wishes)
       ------------------------------------------------------------------------ */
    const interactiveCards = document.querySelectorAll('.postcard, .wish');
    interactiveCards.forEach((card) => {
      const toggleCardPeek = () => {
        const isPeeked = card.classList.toggle('is-peeked');
        card.setAttribute('aria-pressed', String(isPeeked));
      };

      card.addEventListener('click', toggleCardPeek);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleCardPeek();
        }
      });
    });

    /* ------------------------------------------------------------------------
       6. Secret Letter Modal & Birthday Song Synchronization
       ------------------------------------------------------------------------ */
    const syncDancingBear = () => {
      if (!birthdaySong || !modal) return;
      // Melody kicks in after ~1.95s intro
      const isMelodyAudible =
        !birthdaySong.paused &&
        !birthdaySong.ended &&
        birthdaySong.currentTime >= 1.95;
      modal.classList.toggle('music-on', isMelodyAudible);
    };

    if (birthdaySong) {
      const audioEvents = [
        'playing',
        'play',
        'pause',
        'ended',
        'timeupdate',
        'seeked',
        'waiting',
        'emptied',
      ];
      audioEvents.forEach((evt) =>
        birthdaySong.addEventListener(evt, syncDancingBear)
      );
    }

    const playBirthdayMelody = () => {
      if (!birthdaySong) return;
      birthdaySong.pause();
      try {
        birthdaySong.currentTime = 0;
      } catch (err) {
        /* noop */
      }
      birthdaySong.volume = 0.65;
      const playPromise = birthdaySong.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          console.warn('Birthday audio blocked:', err);
        });
      }
    };

    const openSecretModal = () => {
      if (bgSong) bgSong.pause();
      lastActiveElement = document.activeElement;
      playBirthdayMelody();

      if (envelope) envelope.classList.add('open');

      const transitionDelay = prefersReducedMotion.matches ? 0 : 650;
      modalTimer = setTimeout(() => {
        if (modal) {
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
        }
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
        modalTimer = null;
      }, transitionDelay);
    };

    const closeSecretModal = () => {
      if (birthdaySong) {
        birthdaySong.pause();
        try {
          birthdaySong.currentTime = 0;
        } catch (err) {
          /* noop */
        }
      }

      if (modal) {
        modal.classList.remove('music-on');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }

      if (modalTimer) {
        clearTimeout(modalTimer);
        modalTimer = null;
      }

      if (envelope) envelope.classList.remove('open');
      document.body.style.overflow = '';

      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }

      syncBackgroundMusic();
    };

    // Modal Event Bindings
    if (envelope) envelope.addEventListener('click', openSecretModal);
    if (closeBtn) closeBtn.addEventListener('click', closeSecretModal);

    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeSecretModal();
      });
    }

    document.addEventListener('keydown', (event) => {
      if (!modal || !modal.classList.contains('show')) return;

      if (event.key === 'Escape') {
        closeSecretModal();
      }

      // Trap focus to close button inside modal
      if (event.key === 'Tab') {
        event.preventDefault();
        if (closeBtn) closeBtn.focus();
      }
    });
  };

  /* --------------------------------------------------------------------------
     Initialize All Modules
     -------------------------------------------------------------------------- */
  initMoonOrbit();
  initAudioAndExperience();
});

