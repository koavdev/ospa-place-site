<script setup>
  import { onMounted, onUnmounted, ref, nextTick } from "vue";
  import { useRoute } from "vue-router";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import ScrollSmoother from "gsap/ScrollSmoother";
  import { usePageHead, breadcrumb, service } from "../composables/usePageHead";

  typeof gsap.registerPlugin === "function"
    && gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  usePageHead({
    title: "OSPA place | Simplificar a gestão urbana e imobiliária",
    description:
      "Gêmeo digital urbano para governos e mercado imobiliário — inteligência territorial em dados, usuários e terrenos.",
    canonicalPath: "/ospa-place",
    jsonLd: [
      service({
        name: "OSPA place",
        description:
          "Gêmeo digital urbano e inteligência territorial para governos e mercado imobiliário.",
        serviceType: "Inteligência territorial",
        url: "/ospa-place",
      }),
      breadcrumb([
        { name: "OSPA", url: "/" },
        { name: "OSPA place", url: "/ospa-place" },
      ]),
    ],
  });

  import BackgroundPattern from "../components/shared/BackgroundPattern.vue";
  import FooterSection from "../components/shared/FooterSection.vue";
  import ContactModal from "../components/shared/ContactModal.vue";

  import NavBar from "../components/place/NavBar.vue";
  import HeroSection from "../components/place/HeroSection.vue";
  import AboutSection from "../components/place/AboutSection.vue";
  import GovernmentSection from "../components/place/GovernmentSection.vue";
  import GovernmentFeaturesSection from "../components/place/GovernmentFeaturesSection.vue";
  import MarketSection from "../components/place/MarketSection.vue";
  import MarketFeaturesSection from "../components/place/MarketFeaturesSection.vue";
  import MarketSolutionsSection from "../components/place/MarketSolutionsSection.vue";
  import SocialProofSection from "../components/place/SocialProofSection.vue";
  import TeamSection from "../components/place/TeamSection.vue";
  import AwardsSection from "../components/place/AwardsSection.vue";
  import CtaSection from "../components/place/CtaSection.vue";
  import UserTypeModal from "../components/place/UserTypeModal.vue";
  import FormModal from "../components/place/FormModal.vue";

  const route = useRoute();
  const contactModalOpen = ref(false);
  const userTypeModalOpen = ref(false);
  const formModalOpen = ref(false);
  const selectedUserType = ref(""); // 'governo' or 'mercado'

  const openContactModal = () => {
    contactModalOpen.value = true;
  };

  const closeContactModal = () => {
    contactModalOpen.value = false;
  };

  const openUserTypeModal = () => {
    userTypeModalOpen.value = true;
  };

  const closeUserTypeModal = () => {
    userTypeModalOpen.value = false;
  };

  const openFormDirectly = (userType) => {
    selectedUserType.value = userType;
    formModalOpen.value = true;
  };

  const handleUserTypeSelection = (userType) => {
    selectedUserType.value = userType;
    userTypeModalOpen.value = false;
    formModalOpen.value = true;
  };

  const closeFormModal = () => {
    formModalOpen.value = false;
    selectedUserType.value = "";
  };

  const backToUserTypeModal = () => {
    formModalOpen.value = false;
    userTypeModalOpen.value = true;
  };

  let smoother = null;

  // Intercepta cliques em âncoras internas (#secao) para rolar através do
  // ScrollSmoother em vez do salto nativo do navegador, que fica dessincronizado
  // do transform aplicado pelo smoother.
  const handleAnchorClick = (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;

    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    if (smoother) {
      smoother.scrollTo(target, true, "top top");
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  onMounted(() => {
    // Run intro animation
    const intro = document.getElementById("intro");
    const siteRoot = document.getElementById("site-root");

    if (intro && siteRoot) {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete() {
          document.body.classList.remove("intro-active");
          gsap.set(intro, { display: "none" });
          setupVideoAnimation();

          const modal = route.query.modal;
          if (modal === "gov") openFormDirectly("governo");
          else if (modal === "mercado") openFormDirectly("mercado");
          else if (modal === "contato") openContactModal();

          // #faleconosco abre o formulário de contato; demais hashes rolam até a seção (ex.: #contato → rodapé)
          if (route.hash === "#faleconosco") {
            openContactModal();
          } else if (route.hash) {
            const element = document.querySelector(route.hash);
            if (element) {
              if (smoother) smoother.scrollTo(element, true, "top top");
              else element.scrollIntoView({ behavior: "smooth" });
            }
          }
        },
      });

      tl.from("#logo-main", { opacity: 0, y: 40, duration: 0.8 })
        .to({}, { duration: 0.5 })
        .addLabel("slideUp")
        .to(
          "#intro",
          { yPercent: -100, duration: 0.9, ease: "power3.inOut" },
          "slideUp"
        )
        .to(
          siteRoot,
          { opacity: 1, duration: 0.7, ease: "power2.out" },
          "slideUp+=0.3"
        );
    }

    // Navbar visibility
    window.addEventListener("scroll", evaluateNavbarVisibility, {
      passive: true,
    });

    // Rolagem suave da página inteira via ScrollSmoother
    nextTick(() => {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        normalizeScroll: true,
      });
      ScrollTrigger.refresh();
    });

    document.addEventListener("click", handleAnchorClick);
  });

  // Estado final canônico do vídeo: ele volta ao FLUXO NATURAL dentro do wrapper.
  // O wrapper tem altura fixa (Tailwind h-32..xl:h-64) e o vídeo é seu único filho;
  // as classes do template (w-full h-full rounded-[20px] object-cover) já o encaixam
  // exatamente. Limpamos todos os estilos inline que o reveal aplicou e só garantimos
  // opacity: 1 — o destino seguro, independente de medição ou timing.
  //
  // IMPORTANTE: NÃO usar position:absolute + height:100% aqui. <video> é elemento
  // substituído; em absolute, o height:100% do Chrome resolvia contra a coluna inteira
  // (~800px) em vez do wrapper (256px), e o vídeo estourava para fora (o wrapper não
  // tem overflow:hidden). Voltar ao fluxo elimina essa dependência por completo.
  const settleHeroVideo = () => {
    const heroVideo = document.getElementById("hero-video");
    const heroVideoWrapper = document.getElementById("hero-video-wrapper");
    if (!heroVideo) return;
    gsap.set(heroVideo, { clearProps: "all" });
    gsap.set(heroVideo, { opacity: 1 });
    // Devolve o vídeo ao fluxo do wrapper: durante o reveal ele foi
    // teleportado para o body (ver setupVideoAnimation) para escapar do
    // transform que o ScrollSmoother aplica em #smooth-content — dentro dele,
    // position:fixed passaria a ser relativo ao ancestral transformado em vez
    // do viewport, e o reveal em tela cheia nunca apareceria certo.
    if (heroVideoWrapper && heroVideo.parentElement !== heroVideoWrapper) {
      heroVideoWrapper.appendChild(heroVideo);
    }
  };

  const setupVideoAnimation = () => {
    const heroVideo = document.getElementById("hero-video");
    const heroVideoWrapper = document.getElementById("hero-video-wrapper");

    if (!heroVideo || !heroVideoWrapper) return;

    // Teleporta o vídeo para o body antes de fixá-lo em tela cheia: dentro de
    // #smooth-content (transformado pelo ScrollSmoother), position:fixed não
    // seria relativo ao viewport.
    document.body.appendChild(heroVideo);

    // Garante que o vídeo SEMPRE termine assentado no wrapper, aconteça o que
    // acontecer com a cadeia de tweens (erro, interrupção, layout que mexeu).
    let settled = false;
    let tl = null;
    const settle = () => {
      if (settled) return;
      settled = true;
      clearTimeout(failsafe);
      // Mata o timeline ANTES de assentar. Em load pesado o lagSmoothing do gsap
      // atrasa o avanço em tempo real: o failsafe assentava o vídeo no tamanho
      // certo, mas o timeline atrasado seguia rodando e re-inflava o vídeo depois.
      // Quem assenta primeiro encerra a animação de vez.
      if (tl) tl.kill();
      gsap.killTweensOf(heroVideo);
      settleHeroVideo();
    };
    // Failsafe independente do gsap: passou o tempo total previsto da animação
    // (1s delay + 1s + 0.3s + 0.8s ≈ 3.1s), o vídeo assenta de qualquer jeito.
    const failsafe = setTimeout(settle, 4000);

    // Reveal: começa em tela cheia, encolhe e desloca até o wrapper.
    gsap.set(heroVideo, {
      position: "fixed",
      width: "100vw",
      height: "100vh",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      zIndex: 1,
      opacity: 1,
      borderRadius: 0,
    });

    tl = gsap.timeline({ delay: 1, onComplete: settle, onInterrupt: settle });

    // Passo 1: encolhe para o tamanho do wrapper (medido na hora, não antes).
    tl.to(heroVideo, {
      width: () => heroVideoWrapper.getBoundingClientRect().width,
      height: () => heroVideoWrapper.getBoundingClientRect().height,
      borderRadius: "20px",
      duration: 1,
      ease: "power3.out",
    })
      // Passo 2: move até o centro do wrapper (re-medido na hora).
      .to(heroVideo, {
        top: () => {
          const r = heroVideoWrapper.getBoundingClientRect();
          return r.top + r.height / 2;
        },
        left: () => {
          const r = heroVideoWrapper.getBoundingClientRect();
          return r.left + r.width / 2;
        },
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      });
  };

  onUnmounted(() => {
    window.removeEventListener("scroll", evaluateNavbarVisibility);
    document.removeEventListener("click", handleAnchorClick);
    if (smoother) smoother.kill();
  });

  const evaluateNavbarVisibility = () => {
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("[data-header-style]");

    if (!navbar) return;

    let currentSection = null;
    let minDistance = Infinity;
    let footerSection = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const style = section.getAttribute("data-header-style");

      if (style === "hidden") {
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
          footerSection = section;
        }
      }

      if (rect.top <= 200 && rect.bottom > 0) {
        const distance = Math.abs(rect.top);
        if (distance < minDistance) {
          minDistance = distance;
          currentSection = section;
        }
      }
    });

    if (footerSection) {
      currentSection = footerSection;
    }

    if (currentSection) {
      const style = currentSection.getAttribute("data-header-style");
      if (style === "hidden") {
        navbar.style.display = "none";
      } else {
        navbar.style.display = "block";
        navbar.classList.remove("dark");
        if (style === "dark") {
          navbar.classList.add("dark");
        }
      }
    } else {
      navbar.style.display = "block";
      navbar.classList.remove("dark");
    }
  };
</script>

<template>
  <!-- Intro Overlay -->
  <div
    id="intro"
    class="fixed inset-0 z-[100] bg-zinc-900 text-stone-50 flex items-center justify-center">
    <div
      class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 px-8">
      <img
        src="/logos/place-white.svg"
        alt="OSPA place"
        class="h-28 w-auto"
        id="logo-main" />
    </div>
  </div>

  <div
    id="site-root"
    class="opacity-0 transition-opacity duration-700">
    <BackgroundPattern />
    <NavBar @openContactModal="openContactModal" />

    <div id="smooth-wrapper">
      <main id="smooth-content" class="w-full">
        <HeroSection />
        <AboutSection />
        <!-- Government -->
        <GovernmentSection />
        <GovernmentFeaturesSection />
        <!-- End Government -->
        <!-- Market -->
        <MarketSection @openDemo="() => openFormDirectly('mercado')" />
        <MarketSolutionsSection @openDemo="() => openFormDirectly('mercado')" />
        <!-- End Market -->
        <TeamSection />
        <AwardsSection />
        <CtaSection @openDemo="openUserTypeModal" />
        <FooterSection />
      </main>
    </div>

    <ContactModal
      :isOpen="contactModalOpen"
      @close="closeContactModal" />
    <UserTypeModal
      :isOpen="userTypeModalOpen"
      @close="closeUserTypeModal"
      @selectUserType="handleUserTypeSelection" />
    <FormModal
      :isOpen="formModalOpen"
      :userType="selectedUserType"
      @close="closeFormModal"
      @back="backToUserTypeModal" />
  </div>
</template>
