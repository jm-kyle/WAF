import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
	ignoreMobileResize: true,
});
ScrollTrigger.defaults({
	once: true,
	toggleActions: "play none none none",
});

// Re-measure trigger positions after late-loading fonts and images so
// adaptive `start` calculations don't fire at stale offsets.
if (document.fonts && document.fonts.ready) {
	document.fonts.ready.then(() => ScrollTrigger.refresh());
}
window.addEventListener("load", () => ScrollTrigger.refresh());

const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

// Smooth scrolling (skip if reduced motion preferred)
let lenis;
if (!prefersReducedMotion) {
	lenis = new Lenis({
		lerp: 0.12,
		duration: 0.9,
	});
	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000);
	});
	gsap.ticker.lagSmoothing(0);
}

// Intercept anchor links for smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", (e) => {
		const target = anchor.getAttribute("href");
		if (target && target !== "#") {
			e.preventDefault();
			if (lenis) {
				lenis.scrollTo(target);
			} else {
				document.querySelector(target)?.scrollIntoView();
			}
		}
	});
});

// ===== Mobile nav toggle =====
const hamburger = document.querySelector(".nav__hamburger");
const navMenu = document.querySelector(".nav__menu");

function closeMenu() {
	navMenu.classList.remove("nav__menu--open");
	hamburger.setAttribute("aria-expanded", "false");
	hamburger.focus();
}

hamburger.addEventListener("click", () => {
	const isOpen = navMenu.classList.toggle("nav__menu--open");
	hamburger.setAttribute("aria-expanded", isOpen);
	if (isOpen) {
		const firstLink = navMenu.querySelector("a, button");
		if (firstLink) firstLink.focus();
	}
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && navMenu.classList.contains("nav__menu--open")) {
		closeMenu();
	}
});

// Close menu when a nav link is clicked
navMenu.querySelectorAll(".nav__link, .nav__btn").forEach((link) => {
	link.addEventListener("click", () => {
		if (navMenu.classList.contains("nav__menu--open")) {
			closeMenu();
		}
	});
});

// ===== Animations (skip entirely if reduced motion preferred) =====
if (!prefersReducedMotion) {
	// ===== Golden ratio =====
	const φ = 1.6180339887;
	const φInv = 1 / φ; // 0.618…

	// ===== Custom eases — curves shaped by φ =====
	// Smooth decel — exponent is φ² ≈ 2.618 for an unhurried glide
	gsap.registerEase("reveal", (p) => {
		return 1 - Math.pow(1 - p, φ * φ);
	});

	// Soft overshoot then settle — overshoot amount is φ−1, transition at 1/φ
	gsap.registerEase("settle", (p) => {
		const c = φ - 1; // 0.618 overshoot
		return p < φInv
			? 1 + (c + 1) * Math.pow(p / φInv - 1, 3) + c * Math.pow(p / φInv - 1, 2)
			: 1 + Math.sin(((p - φInv) / (1 - φInv)) * Math.PI) * 0.018 * (1 - p);
	});

	// Exponential decel for count-up — decay rate is φ⁵ ≈ 11.09
	gsap.registerEase("countUp", (p) => {
		return 1 - Math.pow(2, -Math.pow(φ, 5) * p);
	});

	// Lateral ease-out — exponent φ², cushion scaled by 1/φ
	gsap.registerEase("drift", (p) => {
		return p < 1
			? 1 - Math.pow(1 - p, φ * φ) * (1 - φInv * 0.236 * Math.sin(p * Math.PI))
			: 1;
	});

	// ===== 1. Nav — fade in on load =====
	gsap.from(".nav", {
		opacity: 0,
		duration: φInv, // 0.618s
		delay: φInv * φInv, // 0.382s
		ease: "reveal",
	});

	// ===== 2. Hero — staggered entrance on load =====
	const heroTl = gsap.timeline({ delay: φInv * 0.16 }); // ≈ 0.1

	heroTl
		.from(".hero__title", {
			opacity: 0,
			y: φ * 30, // ≈ 48.5
			duration: φ, // 1.618s
			stagger: φInv * 0.2, // ≈ 0.124
			ease: "settle",
		})
		.from(
			".hero__tagline, .hero__card-eyebrow, .hero__context",
			{
				opacity: 0,
				y: φ * 15, // ≈ 24.3
				duration: φInv + φInv * φInv, // ≈ 1.0
				ease: "reveal",
			},
			`-=${φInv * φInv}`, // -=0.382
		)
		.from(
			".hero__buttons",
			{
				opacity: 0,
				y: φ * 12, // ≈ 19.4
				duration: φInv, // 0.618s
				ease: "reveal",
			},
			`-=${φInv * φInv}`, // -=0.382
		);

	// ===== Hero parallax — slides shift on scroll =====
	gsap.to(".hero__slide", {
		backgroundPositionY: "55%",
		ease: "none",
		scrollTrigger: {
			trigger: ".hero",
			start: "top top",
			end: "bottom top",
			scrub: true,
			once: false,
		},
	});

	// Fade out hero content as user scrolls
	gsap.to(".hero__content", {
		opacity: 0,
		y: -40,
		ease: "none",
		scrollTrigger: {
			trigger: ".hero",
			start: "60% top",
			end: "bottom top",
			scrub: true,
			once: false,
		},
	});

	// ===== Scroll reveals via IntersectionObserver =====
	// Replaces the gsap.from() + ScrollTrigger pattern. That pattern set
	// targets to opacity 0 immediately and relied on scroll triggers to
	// fire; if positions were mis-measured (e.g. before fonts/images
	// settled) or Lenis smooth-scrolling caused a trigger to be missed,
	// the target stayed invisible forever. IO is browser-native, does
	// not care about layout shifts, and pairs with a safety net.

	const revealGroups = [
		".biodiversity__heading",
		".biodiversity__body",
		".biodiversity__sections",
		".pillar-grid__header",
		".pillar-grid__cards",
		".proof__header",
		".proof__intro",
		".case-study__content",
		".team__heading",
	];

	const revealItems = [
		".where__header",
		".case-study__image",
		".team__desc",
		".member",
		".pillar",
		".footer__sponsor",
		".footer__logo",
	];

	revealGroups.forEach((sel) => {
		document
			.querySelectorAll(sel)
			.forEach((el) => el.classList.add("reveal-group"));
	});
	revealItems.forEach((sel) => {
		document
			.querySelectorAll(sel)
			.forEach((el) => el.classList.add("reveal"));
	});
	document
		.querySelectorAll(".contact__left")
		.forEach((el) => el.classList.add("reveal", "reveal--from-left"));
	document
		.querySelectorAll(".contact__form")
		.forEach((el) => el.classList.add("reveal", "reveal--from-right"));

	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0, rootMargin: "0px 0px -8% 0px" },
	);

	document
		.querySelectorAll(".reveal, .reveal-group")
		.forEach((el) => revealObserver.observe(el));

	// Safety net: after window.load + 1.8s, force any still-hidden
	// reveals to their visible state. Catches any IO edge case.
	window.addEventListener("load", () => {
		setTimeout(() => {
			document
				.querySelectorAll(
					".reveal:not(.is-visible), .reveal-group:not(.is-visible)",
				)
				.forEach((el) => el.classList.add("is-visible"));
		}, 1800);
	});

	// ===== Maps — IO-triggered GSAP timelines =====
	const scienceMap = document.querySelector(".science-map");
	if (scienceMap) {
		const scienceMapImage = scienceMap.querySelector(".science-map__image");
		const scienceMapLabels = Array.from(
			scienceMap.querySelectorAll(".science-map__overlay .g-aiAbs"),
		);

		if (scienceMapImage) {
			gsap.set(scienceMapImage, {
				opacity: 0,
				scale: 1.012,
				transformOrigin: "center center",
			});
		}
		if (scienceMapLabels.length) {
			gsap.set(scienceMapLabels, { opacity: 0, y: 4 });
		}

		let playedScienceMap = false;
		const playScienceMap = () => {
			if (playedScienceMap) return;
			playedScienceMap = true;
			const tl = gsap.timeline();
			if (scienceMapImage) {
				tl.to(scienceMapImage, {
					opacity: 1,
					scale: 1,
					duration: φInv + φInv * φInv,
					ease: "reveal",
				});
			}
			if (scienceMapLabels.length) {
				tl.to(
					scienceMapLabels,
					{
						opacity: 1,
						y: 0,
						duration: φInv * 0.55,
						stagger: 0.012,
						ease: "reveal",
					},
					"-=0.45",
				);
			}
		};

		const scienceMapObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						scienceMapObserver.disconnect();
						playScienceMap();
					}
				});
			},
			{ threshold: 0, rootMargin: "0px 0px -8% 0px" },
		);
		scienceMapObserver.observe(scienceMap);

		window.addEventListener("load", () => {
			setTimeout(() => {
				scienceMapObserver.disconnect();
				playScienceMap();
			}, 2200);
		});
	}

	// WAF map — fetch SVG inline, then animate states + stagger pins on IO.
	const mapContainer = document.querySelector(".map-placeholder[data-svg-src]");
	if (mapContainer) {
		fetch(mapContainer.dataset.svgSrc, { cache: "no-cache" })
			.then((r) => r.text())
			.then((svgText) => {
				mapContainer.innerHTML = svgText;
				const svg = mapContainer.querySelector("svg");
				const states = svg.querySelector("#states");
				const borders = svg.querySelector("#borders");
				const markers = svg.querySelectorAll(".marker, circle");
				const mapLayers = [states, borders].filter(Boolean);

				if (mapLayers.length) gsap.set(mapLayers, { opacity: 0 });
				if (markers.length) {
					gsap.set(markers, {
						opacity: 0,
						scale: 0,
						transformOrigin: "center center",
					});
				}

				let playedWafMap = false;
				const playWafMap = () => {
					if (playedWafMap) return;
					playedWafMap = true;
					const tl = gsap.timeline();
					if (mapLayers.length) {
						tl.to(mapLayers, {
							opacity: 1,
							duration: φInv,
							ease: "reveal",
						});
					}
					if (markers.length) {
						tl.to(
							markers,
							{
								opacity: 1,
								scale: 1,
								duration: φInv * 0.6,
								stagger: φInv * 0.08,
								ease: "settle",
							},
							`-=${φInv * 0.5}`,
						);
					}
				};

				const wafMapObserver = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								wafMapObserver.disconnect();
								playWafMap();
							}
						});
					},
					{ threshold: 0, rootMargin: "0px 0px -8% 0px" },
				);
				wafMapObserver.observe(mapContainer);

				setTimeout(() => {
					wafMapObserver.disconnect();
					playWafMap();
				}, 3000);
			});
	}

	// Resource row hover — black bg scales in, colors invert.
	// (No-op if no .resource-row exists; kept for if the resources
	// section returns.)
	const creamColor = getComputedStyle(document.documentElement)
		.getPropertyValue("--cream")
		.trim();
	const cream55Color = getComputedStyle(document.documentElement)
		.getPropertyValue("--cream-55")
		.trim();
	document.querySelectorAll(".resource-row").forEach((row) => {
		const bg = row.querySelector(".resource-row__bg");
		const title = row.querySelector(".resource-row__title");
		const tag = row.querySelector(".resource-row__tag");
		const icon = row.querySelector(".resource-row__icon");

		const enterTl = gsap.timeline({ paused: true });
		enterTl
			.to(bg, { scaleY: 1, duration: φInv * φInv, ease: "reveal" })
			.to(
				title,
				{ color: creamColor, duration: φInv * φInv, ease: "reveal" },
				φInv * 0.062,
			)
			.to(
				tag,
				{ color: cream55Color, duration: φInv * φInv, ease: "reveal" },
				φInv * 0.16,
			)
			.to(
				icon,
				{ color: creamColor, y: -2, duration: φInv * φInv, ease: "reveal" },
				φInv * 0.1,
			);

		row.addEventListener("mouseenter", () => enterTl.timeScale(1).play());
		row.addEventListener("mouseleave", () => enterTl.timeScale(φ).reverse());
	});

} // end reduced-motion guard

// ===== Need / response map comparison =====
document.querySelectorAll("[data-map-comparison]").forEach((comparison) => {
	const range = comparison.querySelector(".map-comparison__range");
	if (!range) return;

	const updateReveal = () => {
		const reveal = `${range.value}%`;
		comparison.style.setProperty("--reveal", reveal);
		range.setAttribute(
			"aria-valuetext",
			`${range.value}% of the WAF priority-region map revealed`,
		);
	};
	const setRevealFromPointer = (event) => {
		const bounds = comparison.getBoundingClientRect();
		const value = ((event.clientX - bounds.left) / bounds.width) * 100;
		range.value = String(Math.round(Math.max(0, Math.min(100, value))));
		updateReveal();
	};

	range.addEventListener("input", updateReveal);
	range.addEventListener("pointerdown", (event) => {
		range.setPointerCapture?.(event.pointerId);
		setRevealFromPointer(event);
	});
	range.addEventListener("pointermove", (event) => {
		if (event.buttons === 1) setRevealFromPointer(event);
	});
	range.addEventListener("keydown", (event) => {
		const keys = {
			ArrowLeft: -1,
			ArrowDown: -1,
			ArrowRight: 1,
			ArrowUp: 1,
		};

		if (event.key in keys) {
			event.preventDefault();
			range.value = String(Number(range.value) + keys[event.key]);
			updateReveal();
		} else if (event.key === "Home" || event.key === "End") {
			event.preventDefault();
			range.value = event.key === "Home" ? range.min : range.max;
			updateReveal();
		}
	});
	updateReveal();
});

// The animated map loader lives inside the motion guard above. Keep the
// comparison fully functional when a visitor prefers reduced motion.
if (prefersReducedMotion) {
	document
		.querySelectorAll(".map-placeholder[data-svg-src]")
		.forEach((mapContainer) => {
			fetch(mapContainer.dataset.svgSrc, { cache: "no-cache" })
				.then((response) => {
					if (!response.ok) throw new Error("Map failed to load");
					return response.text();
				})
				.then((svgText) => {
					mapContainer.innerHTML = svgText;
				})
				.catch(() => {
					// Preserve the readable fallback already in the markup.
				});
		});
}

// ===== Hero carousel =====
{
	const slides = Array.from(document.querySelectorAll(".hero__slide"));
	const prevBtn = document.querySelector(".hero__control--prev");
	const nextBtn = document.querySelector(".hero__control--next");
	const hero = document.querySelector(".hero");
	const position = document.querySelector("[data-hero-carousel-position]");
	const status = document.querySelector("[data-hero-carousel-status]");

	if (slides.length > 1 && prevBtn && nextBtn && hero) {
		const TRANSITION_MS = prefersReducedMotion ? 0 : 1200;
		const AUTO_INTERVAL_MS = 6000;
		let currentIdx = slides.findIndex((s) =>
			s.classList.contains("is-current"),
		);
		if (currentIdx < 0) {
			currentIdx = 0;
			slides[0].classList.add("is-current");
		}
		let isTransitioning = false;
		let autoTimer = null;

		function goTo(newIdx, announce = false) {
			if (isTransitioning) return;
			const total = slides.length;
			const target = ((newIdx % total) + total) % total;
			if (target === currentIdx) return;

			isTransitioning = true;
			const outgoing = slides[currentIdx];
			const incoming = slides[target];

			incoming.classList.add("is-entering");

			window.setTimeout(() => {
				outgoing.classList.remove("is-current");
				incoming.classList.remove("is-entering");
				incoming.classList.add("is-current");
				currentIdx = target;
				isTransitioning = false;
				const message = `Background image ${currentIdx + 1} of ${total}.`;
				if (position) position.textContent = message;
				if (status && announce) {
					status.textContent = message;
				}
			}, TRANSITION_MS);
		}

		function next(announce = false) {
			goTo(currentIdx + 1, announce);
		}
		function prev(announce = false) {
			goTo(currentIdx - 1, announce);
		}

		function startAuto() {
			if (prefersReducedMotion) return;
			stopAuto();
			autoTimer = window.setInterval(next, AUTO_INTERVAL_MS);
		}
		function stopAuto() {
			if (autoTimer !== null) {
				window.clearInterval(autoTimer);
				autoTimer = null;
			}
		}
		function resetAuto() {
			if (autoTimer !== null) startAuto();
		}

		nextBtn.addEventListener("click", () => {
			next(true);
			resetAuto();
		});
		prevBtn.addEventListener("click", () => {
			prev(true);
			resetAuto();
		});

		hero.addEventListener("keydown", (event) => {
			if (event.altKey || event.ctrlKey || event.metaKey) return;

			if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
				event.preventDefault();
				if (event.key === "ArrowLeft") prev(true);
				else next(true);
			}
		});

		hero.addEventListener("mouseenter", stopAuto);
		hero.addEventListener("mouseleave", () => {
			if (!hero.contains(document.activeElement)) startAuto();
		});
		hero.addEventListener("focusin", stopAuto);
		hero.addEventListener("focusout", (event) => {
			if (!hero.contains(event.relatedTarget) && !hero.matches(":hover")) {
				startAuto();
			}
		});

		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				stopAuto();
			} else if (
				!hero.contains(document.activeElement) &&
				!hero.matches(":hover")
			) {
				startAuto();
			}
		});

		startAuto();
	}
}

// ===== Bio Modal =====
const bioModal = document.querySelector(".bio-modal");
const bioBackdrop = bioModal.querySelector(".bio-modal__backdrop");
const bioCard = bioModal.querySelector(".bio-modal__card");
const bioRole = bioModal.querySelector(".bio-modal__role");
const bioName = bioModal.querySelector(".bio-modal__name");
const bioBio = bioModal.querySelector(".bio-modal__bio");
const bioClose = bioModal.querySelector(".bio-modal__close");

let bioTriggerEl = null;

function getFocusableElements() {
	return bioCard.querySelectorAll(
		'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
	);
}

function handleFocusTrap(e) {
	if (e.key !== "Tab") return;
	const focusable = getFocusableElements();
	if (focusable.length === 0) return;
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	if (e.shiftKey) {
		if (document.activeElement === first) {
			e.preventDefault();
			last.focus();
		}
	} else {
		if (document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}
}

function openBioModal(member) {
	const role = member.querySelector(".member__role").textContent;
	const name = member.querySelector(".member__name").textContent;

	bioRole.textContent = role;
	bioName.textContent = name;
	const sourceBio = member.querySelector(".member__bio");
	bioBio.replaceChildren();
	for (const child of sourceBio.childNodes) {
		bioBio.appendChild(child.cloneNode(true));
	}

	bioModal.classList.add("bio-modal--open");
	bioModal.setAttribute("aria-hidden", "false");
	if (lenis) lenis.stop();

	bioClose.focus();
	bioCard.addEventListener("keydown", handleFocusTrap);

	const tl = gsap.timeline();
	tl.fromTo(
		bioBackdrop,
		{ opacity: 0 },
		{ opacity: 1, duration: 0.3, ease: "power2.out" },
	);
	tl.fromTo(
		bioCard,
		{ opacity: 0, y: 40, scale: 0.95 },
		{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.4)" },
		"-=0.15",
	);
}

function closeBioModal() {
	bioCard.removeEventListener("keydown", handleFocusTrap);
	const tl = gsap.timeline({
		onComplete: () => {
			bioModal.classList.remove("bio-modal--open");
			bioModal.setAttribute("aria-hidden", "true");
			if (lenis) lenis.start();
			if (bioTriggerEl) {
				bioTriggerEl.focus();
				bioTriggerEl = null;
			}
		},
	});
	tl.to(bioCard, {
		opacity: 0,
		y: 20,
		scale: 0.97,
		duration: 0.25,
		ease: "power2.in",
	});
	tl.to(bioBackdrop, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.1");
}

document.querySelectorAll(".member__more").forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		bioTriggerEl = link;
		const member = link.closest(".member");
		openBioModal(member);
	});
});

bioClose.addEventListener("click", closeBioModal);
bioBackdrop.addEventListener("click", closeBioModal);
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && bioModal.classList.contains("bio-modal--open")) {
		closeBioModal();
	}
});
