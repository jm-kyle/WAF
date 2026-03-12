import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

	// ===== Animation defaults =====
	const fadeUp = { opacity: 0, y: φ * 18.5 }; // ≈ 30

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
			".hero__rule",
			{
				opacity: 0,
				scaleX: 0,
				transformOrigin: "left center",
				duration: φInv, // 0.618s
				ease: "reveal",
			},
			`-=${φInv * φInv}`, // -=0.382
		)
		.from(
			".hero__tagline",
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
		)
		.from(
			".hero__description",
			{
				opacity: 0,
				y: φ * 12,
				duration: φInv + φInv * φInv, // ≈ 1.0
				ease: "reveal",
			},
			`-=${φInv * φInv}`,
		)
		.from(
			".hero__banner",
			{
				opacity: 0,
				y: φ * 15,
				duration: φInv + φInv * φInv, // ≈ 1.0
				ease: "reveal",
			},
			`-=${φInv * φInv}`,
		);

	// ===== Hero parallax — background shifts on scroll =====
	gsap.to(".hero", {
		backgroundPositionY: "55%",
		ease: "none",
		scrollTrigger: {
			trigger: ".hero",
			start: "top top",
			end: "bottom top",
			scrub: true,
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
		},
	});

	// ===== 3. Challenge — scroll-triggered reveals =====
	gsap.from(".challenge__heading > *", {
		...fadeUp,
		duration: φInv,
		stagger: φInv * 0.2,
		ease: "reveal",
		scrollTrigger: {
			trigger: ".challenge__heading",
			start: "top 85%",
		},
	});

	// Stat countUp
	const statData = [
		{ suffix: "%", value: 73 },
		{ suffix: "%", value: 40 },
		{ suffix: "M", value: 1 },
	];

	document.querySelectorAll(".stat__number").forEach((el, i) => {
		const { value, suffix } = statData[i];
		const obj = { val: 0 };

		gsap.from(el.closest(".stat"), {
			...fadeUp,
			duration: φInv,
			ease: "reveal",
			scrollTrigger: {
				trigger: el.closest(".stat"),
				start: "top 85%",
				onEnter: () => {
					gsap.to(obj, {
						val: value,
						duration: φ, // 1.618s count-up
						ease: "countUp",
						snap: { val: suffix === "M" ? 0.1 : 1 },
						onUpdate() {
							if (suffix === "M") {
								el.textContent =
									obj.val >= 1
										? `${Math.round(obj.val)}M`
										: `${obj.val.toFixed(1)}M`;
							} else {
								el.textContent = `${Math.round(obj.val)}${suffix}`;
							}
						},
					});
				},
			},
		});
	});

	// Challenge body text
	gsap.from(".challenge__text", {
		...fadeUp,
		duration: φInv,
		stagger: φInv * 0.25, // ≈ 0.155
		ease: "reveal",
		scrollTrigger: {
			trigger: ".challenge__body",
			start: "top 85%",
		},
	});

	// ===== 4. Approach — header + staggered pillars =====
	gsap.from(".approach__header", {
		...fadeUp,
		duration: φInv + φInv * φInv, // ≈ 1.0
		ease: "reveal",
		scrollTrigger: {
			trigger: ".approach__header",
			start: "top 85%",
		},
	});

	gsap.from(".pillar", {
		...fadeUp,
		duration: φInv,
		stagger: φInv * 0.2,
		ease: "settle",
		scrollTrigger: {
			trigger: ".pillar",
			start: "top 85%",
		},
	});

	// ===== 5. Where We Work — layered reveal =====
	gsap.from(".where__header", {
		...fadeUp,
		duration: φInv + φInv * φInv,
		ease: "reveal",
		scrollTrigger: {
			trigger: ".where__header",
			start: "top 85%",
		},
	});

	gsap.from(".map-placeholder", {
		opacity: 0,
		scale: 0.97,
		duration: φ, // 1.618s
		ease: "reveal",
		scrollTrigger: {
			trigger: ".map-placeholder",
			start: "top 85%",
		},
	});

	gsap.from(".gaviota__image", {
		opacity: 0,
		scale: 1.03,
		duration: φ,
		ease: "reveal",
		scrollTrigger: {
			trigger: ".gaviota",
			start: "top 80%",
		},
	});

	gsap.from(".gaviota__text > *", {
		...fadeUp,
		duration: φInv,
		stagger: φInv * 0.2,
		ease: "reveal",
		scrollTrigger: {
			trigger: ".gaviota",
			start: "top 80%",
		},
	});

	// ===== 6. Team — portrait + bio reveals =====
	gsap.from(".team__header", {
		...fadeUp,
		duration: φInv + φInv * φInv,
		ease: "reveal",
		scrollTrigger: {
			trigger: ".team__header",
			start: "top 85%",
		},
	});

	gsap.from(".team__lead", {
		...fadeUp,
		duration: φInv + φInv * φInv,
		ease: "reveal",
		scrollTrigger: {
			trigger: ".team__lead",
			start: "top 85%",
		},
	});

	document.querySelectorAll(".member").forEach((member, i) => {
		gsap.from(member, {
			...fadeUp,
			duration: φInv + φInv * φInv,
			delay: i * φInv * 0.25, // ≈ 0.155
			ease: "settle",
			scrollTrigger: {
				trigger: member,
				start: "top 85%",
			},
		});

	});

	// ===== 7. Resources — row-by-row reveal =====
	gsap.from(".resources__heading", {
		...fadeUp,
		duration: φInv + φInv * φInv,
		ease: "reveal",
		scrollTrigger: {
			trigger: ".resources__inner",
			start: "top 85%",
		},
	});

	gsap.from(".resource-row", {
		...fadeUp,
		duration: φInv,
		stagger: φInv * 0.2,
		ease: "settle",
		scrollTrigger: {
			trigger: ".resources__list",
			start: "top 85%",
		},
	});

	// Resource row hover — black bg scales in, colors invert
	document.querySelectorAll(".resource-row").forEach((row) => {
		const bg = row.querySelector(".resource-row__bg");
		const title = row.querySelector(".resource-row__title");
		const tag = row.querySelector(".resource-row__tag");
		const icon = row.querySelector(".resource-row__icon");

		const enterTl = gsap.timeline({ paused: true });
		enterTl
			.to(bg, {
				scaleY: 1,
				duration: φInv * φInv, // 0.382s
				ease: "reveal",
			})
			.to(
				title,
				{ color: "#f8f6f1", duration: φInv * φInv, ease: "reveal" },
				φInv * 0.062, // ≈ 0.038
			)
			.to(
				tag,
				{
					color: "rgba(248,246,241,0.55)",
					duration: φInv * φInv,
					ease: "reveal",
				},
				φInv * 0.16, // ≈ 0.1
			)
			.to(
				icon,
				{ color: "#f8f6f1", y: -2, duration: φInv * φInv, ease: "reveal" },
				φInv * 0.1, // ≈ 0.062
			);

		row.addEventListener("mouseenter", () => enterTl.timeScale(1).play());
		row.addEventListener("mouseleave", () => enterTl.timeScale(φ).reverse());
	});

	// ===== 8. Contact — split reveal =====
	gsap.from(".contact__left", {
		opacity: 0,
		x: -φ * 24, // ≈ -38.8
		duration: φ, // 1.618s
		ease: "drift",
		scrollTrigger: {
			trigger: ".contact",
			start: "top 80%",
		},
	});

	gsap.from(".contact__right", {
		opacity: 0,
		x: φ * 24,
		duration: φ,
		ease: "drift",
		scrollTrigger: {
			trigger: ".contact",
			start: "top 80%",
		},
	});
} // end reduced-motion guard

// ===== Bio Modal =====
const bioModal = document.querySelector(".bio-modal");
const bioBackdrop = bioModal.querySelector(".bio-modal__backdrop");
const bioCard = bioModal.querySelector(".bio-modal__card");
const bioRole = bioModal.querySelector(".bio-modal__role");
const bioName = bioModal.querySelector(".bio-modal__name");
const bioBio = bioModal.querySelector(".bio-modal__bio");
const bioClose = bioModal.querySelector(".bio-modal__close");

function openBioModal(member) {
	const role = member.querySelector(".member__role").textContent;
	const name = member.querySelector(".member__name").textContent;
	const bio = member.querySelector(".member__bio").textContent.trim();

	bioRole.textContent = role;
	bioName.textContent = name;
	bioBio.textContent = bio;

	bioModal.classList.add("bio-modal--open");
	bioModal.setAttribute("aria-hidden", "false");
	if (lenis) lenis.stop();

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
	const tl = gsap.timeline({
		onComplete: () => {
			bioModal.classList.remove("bio-modal--open");
			bioModal.setAttribute("aria-hidden", "true");
			if (lenis) lenis.start();
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
