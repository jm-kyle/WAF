import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Smooth scrolling
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// Intercept anchor links to use Lenis smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = anchor.getAttribute('href')
    if (target && target !== '#') {
      e.preventDefault()
      lenis.scrollTo(target)
    }
  })
})

// ===== Mobile nav toggle =====
const hamburger = document.querySelector('.nav__hamburger')
const navMenu = document.querySelector('.nav__menu')
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('nav__menu--open')
  hamburger.setAttribute('aria-expanded', isOpen)
})

// ===== Custom eases =====
// Smooth decel with an extended glide — the "unhurried luxury" feel
gsap.registerEase('reveal', (p) => {
  // Custom deceleration: fast initial movement, very long gentle tail
  return 1 - Math.pow(1 - p, 4)
})

// Soft overshoot then settle — confident entrance with a breath
gsap.registerEase('settle', (p) => {
  const c = 1.4 // overshoot amount (subtle)
  return p < 0.72
    ? 1 + (c + 1) * Math.pow(p / 0.72 - 1, 3) + c * Math.pow(p / 0.72 - 1, 2)
    : 1 + Math.sin(((p - 0.72) / 0.28) * Math.PI) * 0.018 * (1 - p)
})

// Exponential decel for count-up numbers — fast start, slow arrival
gsap.registerEase('countUp', (p) => {
  return 1 - Math.pow(2, -12 * p)
})

// Smooth ease-out with a slight cushion at the end — for lateral movements
gsap.registerEase('drift', (p) => {
  return p < 1 ? 1 - Math.pow(1 - p, 3.5) * (1 - 0.15 * Math.sin(p * Math.PI)) : 1
})

// ===== Animation defaults =====
const fadeUp = { opacity: 0, y: 30 }

// ===== 1. Nav — fade in on load =====
gsap.from('.nav', {
  opacity: 0,
  duration: 0.8,
  delay: 0.3,
  ease: 'reveal',
})

// ===== 2. Hero — staggered entrance on load =====
const heroTl = gsap.timeline({ delay: 0.1 })

heroTl
  .from('.hero__title', {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.15,
    ease: 'settle',
  })
  .from(
    '.hero__tagline',
    {
      opacity: 0,
      y: 24,
      duration: 0.9,
      ease: 'reveal',
    },
    '-=0.4'
  )
  .from(
    '.hero__buttons',
    {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'reveal',
    },
    '-=0.5'
  )
  .from(
    '.hero__description',
    {
      opacity: 0,
      y: 20,
      duration: 0.9,
      ease: 'reveal',
    },
    '-=0.4'
  )

// ===== 3. Challenge — scroll-triggered reveals =====
gsap.from('.challenge__heading > *', {
  ...fadeUp,
  duration: 0.8,
  stagger: 0.1,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.challenge__heading',
    start: 'top 85%',
  },
})

// Stat countUp
const statData = [
  { suffix: '%', value: 73 },
  { suffix: '%', value: 40 },
  { suffix: 'M', value: 1 },
]

document.querySelectorAll('.stat__number').forEach((el, i) => {
  const { value, suffix } = statData[i]
  const obj = { val: 0 }

  gsap.from(el.closest('.stat'), {
    ...fadeUp,
    duration: 0.7,
    ease: 'reveal',
    scrollTrigger: {
      trigger: el.closest('.stat'),
      start: 'top 85%',
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: 1.4,
          ease: 'countUp',
          snap: { val: suffix === 'M' ? 0.1 : 1 },
          onUpdate() {
            if (suffix === 'M') {
              el.textContent =
                obj.val >= 1 ? `${Math.round(obj.val)}M` : `${obj.val.toFixed(1)}M`
            } else {
              el.textContent = `${Math.round(obj.val)}${suffix}`
            }
          },
        })
      },
    },
  })
})

// Challenge body text
gsap.from('.challenge__text', {
  ...fadeUp,
  duration: 0.8,
  stagger: 0.15,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.challenge__body',
    start: 'top 85%',
  },
})

// ===== 4. Approach — header + staggered pillars =====
gsap.from('.approach__header', {
  ...fadeUp,
  duration: 0.9,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.approach__header',
    start: 'top 85%',
  },
})

gsap.from('.pillar', {
  ...fadeUp,
  duration: 0.8,
  stagger: 0.12,
  ease: 'settle',
  scrollTrigger: {
    trigger: '.pillar',
    start: 'top 85%',
  },
})

// ===== 5. Where We Work — layered reveal =====
gsap.from('.where__header', {
  ...fadeUp,
  duration: 0.9,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.where__header',
    start: 'top 85%',
  },
})

gsap.from('.map-placeholder', {
  opacity: 0,
  scale: 0.97,
  duration: 1,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.map-placeholder',
    start: 'top 85%',
  },
})

gsap.from('.gaviota__image', {
  opacity: 0,
  scale: 1.03,
  duration: 1,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.gaviota',
    start: 'top 80%',
  },
})

gsap.from('.gaviota__text > *', {
  ...fadeUp,
  duration: 0.8,
  stagger: 0.1,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.gaviota',
    start: 'top 80%',
  },
})

// ===== 6. Team — portrait + bio reveals =====
gsap.from('.team__header', {
  ...fadeUp,
  duration: 0.9,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.team__header',
    start: 'top 85%',
  },
})

document.querySelectorAll('.member').forEach((member, i) => {
  gsap.from(member, {
    ...fadeUp,
    duration: 0.9,
    delay: i * 0.15,
    ease: 'settle',
    scrollTrigger: {
      trigger: member,
      start: 'top 85%',
    },
  })

  gsap.from(member.querySelector('.member__portrait img'), {
    scale: 1.05,
    duration: 1.2,
    ease: 'reveal',
    scrollTrigger: {
      trigger: member,
      start: 'top 85%',
    },
  })
})

// ===== 7. Resources — row-by-row reveal =====
gsap.from('.resources__heading', {
  ...fadeUp,
  duration: 0.9,
  ease: 'reveal',
  scrollTrigger: {
    trigger: '.resources__inner',
    start: 'top 85%',
  },
})

gsap.from('.resource-row', {
  ...fadeUp,
  duration: 0.7,
  stagger: 0.1,
  ease: 'settle',
  scrollTrigger: {
    trigger: '.resources__list',
    start: 'top 85%',
  },
})

// ===== 8. Contact — split reveal =====
gsap.from('.contact__left', {
  opacity: 0,
  x: -40,
  duration: 1,
  ease: 'drift',
  scrollTrigger: {
    trigger: '.contact',
    start: 'top 80%',
  },
})

gsap.from('.contact__right', {
  opacity: 0,
  x: 40,
  duration: 1,
  ease: 'drift',
  scrollTrigger: {
    trigger: '.contact',
    start: 'top 80%',
  },
})
