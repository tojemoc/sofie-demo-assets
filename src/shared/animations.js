import { gsap } from 'gsap'

export function tweenPromise (target, vars) {
  return new Promise(resolve => {
    gsap.to(target, { ...vars, onComplete: resolve })
  })
}

export function fromPromise (target, vars) {
  return new Promise(resolve => {
    gsap.from(target, { ...vars, onComplete: resolve })
  })
}

export function slideBarIn (selector, duration = 0.5, delay = 0) {
  return fromPromise(selector, {
    x: -window.innerWidth,
    duration,
    delay,
    ease: 'power2.out'
  })
}

export function slideBarOut (selector, duration = 0.4) {
  return tweenPromise(selector, {
    x: -window.innerWidth,
    duration,
    ease: 'power2.in'
  })
}

export function slideElementIn (selector, distance, duration = 0.5, delay = 0) {
  return fromPromise(selector, {
    x: distance,
    duration,
    delay,
    ease: 'power2.out'
  })
}

export function slideElementOut (selector, distance, duration = 0.4) {
  return tweenPromise(selector, {
    x: distance,
    duration,
    ease: 'power2.in'
  })
}

export function fadeIn (selector, duration = 0.3, delay = 0) {
  return fromPromise(selector, {
    opacity: 0,
    duration,
    delay,
    ease: 'power2.out'
  })
}

export function fadeOut (selector, duration = 0.3) {
  return tweenPromise(selector, {
    opacity: 0,
    duration,
    ease: 'power2.in'
  })
}

export function killAnimations (selector) {
  gsap.killTweensOf(selector)
}
