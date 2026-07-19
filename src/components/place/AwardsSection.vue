<script setup>
  import { onMounted, onUnmounted, ref, nextTick } from "vue";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  typeof gsap.registerPlugin === "function"
    && gsap.registerPlugin(ScrollTrigger);

  const sectionRef = ref(null);
  const scrollRef = ref(null);
  let ctx = null;
  let resizeObserver = null;

  let isDragging = false;
  let dragMoved = false;
  let startX = 0;
  let startScrollLeft = 0;

  const onDragStart = (event) => {
    if (!scrollRef.value) return;
    isDragging = true;
    dragMoved = false;
    startX = event.pageX;
    startScrollLeft = scrollRef.value.scrollLeft;
  };

  const onDragMove = (event) => {
    if (!isDragging || !scrollRef.value) return;
    event.preventDefault();
    const delta = event.pageX - startX;
    if (Math.abs(delta) > 3) dragMoved = true;
    scrollRef.value.scrollLeft = startScrollLeft - delta;
  };

  const onDragEnd = () => {
    isDragging = false;
  };

  const onClickCapture = (event) => {
    if (dragMoved) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const canScrollPrev = ref(false);
  const canScrollNext = ref(false);

  const updateScrollState = () => {
    if (!scrollRef.value) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.value;
    canScrollPrev.value = scrollLeft > 0;
    canScrollNext.value = scrollLeft + clientWidth < scrollWidth - 1;
  };

  const scrollByCard = (direction) => {
    if (!scrollRef.value) return;
    const card = scrollRef.value.querySelector(".animate-award");
    const step = card
      ? card.offsetWidth + 24
      : scrollRef.value.clientWidth * 0.8;
    scrollRef.value.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const awards = [
    {
      logo: "/images/place/awards/connected.png",
      name: "Prêmio Connected Smart Cities 2025",
      place: "1º Lugar",
      category: "Categoria Negócios em Operação",
      project: "",
    },
    {
      logo: "/images/place/awards/impulso.png",
      name: "Programa Impulso Regional 2025",
      place: "1º lugar",
      category: "ENAP e MIDR",
      project: "",
    },
    {
      logo: "/images/place/awards/finep.jpg",
      name: "Programa Mulheres Inovadoras 2024",
      place: "TOP 5 Região Sul",
      category: "FINEP e MCTI",
      project: "",
    },
    {
      logo: "/images/place/awards/open100.png",
      name: "Top 100 Open Startups 2024",
      place: "3º Lugar",
      category: "Categoria Startups GovTechs",
      project: "",
    },
    {
      logo: "/images/place/awards/connected.png",
      name: "Prêmio Connected Smart Cities 2024",
      place: "3º Lugar",
      category: "Categoria Negócios em Operação",
      project: "",
    },
    {
      logo: "/images/place/awards/brazillab.png",
      name: "Aceleração GovTech BrazilLAB 2023",
      place: "1º Lugar",
      category: "",
      project: "",
    },
  ];

  onMounted(() => {
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);

    nextTick(() => {
      setTimeout(() => {
        if (!sectionRef.value) return;

        if (scrollRef.value) {
          scrollRef.value.addEventListener("scroll", updateScrollState, {
            passive: true,
          });
          resizeObserver = new ResizeObserver(updateScrollState);
          resizeObserver.observe(scrollRef.value);
          updateScrollState();
        }

        const elements = sectionRef.value.querySelectorAll(".animate-award");
        if (elements.length === 0) return;

        ctx = gsap.context(() => {
          gsap.from(elements, {
            scrollTrigger: {
              trigger: sectionRef.value,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            x: 40,
            duration: 0.6,
            stagger: 0.1,
          });
        }, sectionRef.value);
      }, 100);
    });
  });

  onUnmounted(() => {
    if (ctx) ctx.revert();
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
    if (scrollRef.value) {
      scrollRef.value.removeEventListener("scroll", updateScrollState);
    }
    if (resizeObserver) resizeObserver.disconnect();
  });
</script>

<template>
  <section
    ref="sectionRef"
    id="awards"
    data-header-style="default"
    class="min-h-screen w-full relative flex items-center overflow-hidden">
    <div class="container mx-auto px-6 py-20 relative z-10">
      <!-- Header -->
      <div class="mb-12">
        <h2
          class="text-neutral-500 text-3xl font-light font-['Manrope'] leading-10">
          Prêmios
        </h2>
      </div>

      <!-- Awards Horizontal Scroll -->
      <div class="relative">
        <button
          type="button"
          aria-label="Prêmio anterior"
          :disabled="!canScrollPrev"
          class="hidden cursor-pointer sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md text-zinc-900 disabled:opacity-0 disabled:pointer-events-none transition-opacity"
          @click="scrollByCard(-1)">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Próximo prêmio"
          :disabled="!canScrollNext"
          class="hidden cursor-pointer sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md text-zinc-900 disabled:opacity-0 disabled:pointer-events-none transition-opacity"
          @click="scrollByCard(1)">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div
          ref="scrollRef"
          class="relative -mx-6 px-6 overflow-x-auto scrollbar-hide pb-8 cursor-grab active:cursor-grabbing select-none"
          @mousedown="onDragStart"
          @click.capture="onClickCapture">
          <div class="flex gap-4 sm:gap-6 md:gap-8 w-max">
            <div
              v-for="(award, index) in awards"
              :key="index"
              class="animate-award w-52 sm:w-56 md:w-62 h-72 sm:h-76 md:h-80 relative flex-shrink-0">
              <!-- Card Background -->
              <div
                class="w-full h-full absolute inset-0 bg-white rounded-[20px]"></div>

              <!-- Logo -->
              <div
                class="absolute left-1/2 -translate-x-1/2 top-12 sm:top-14 w-24 sm:w-28 h-10 sm:h-14 flex items-center justify-center">
                <img
                  class="max-w-full max-h-full object-contain"
                  :src="award.logo"
                  :alt="award.name" />
              </div>

              <!-- Award Name -->
              <div
                class="absolute left-1/2 -translate-x-1/2 top-36 sm:top-40 text-center w-[85%] text-zinc-900 text-xs sm:text-sm font-medium font-['Manrope'] leading-tight px-2">
                {{ award.name }}
              </div>

              <!-- Place -->
              <div
                class="absolute left-1/2 -translate-x-1/2 mt-1 top-44 sm:top-48 text-zinc-900 text-sm sm:text-base font-light font-['Manrope'] leading-tight">
                {{ award.place }}
              </div>

              <!-- Category -->
              <div
                v-if="award.category"
                class="absolute left-1/2 -translate-x-1/2 top-52 sm:top-56 text-center w-[85%] text-zinc-900 text-xs font-light font-['Manrope'] leading-tight px-2">
                {{ award.category }}
              </div>

              <!-- Project (if exists) -->
              <div
                v-if="award.project"
                class="absolute left-1/2 -translate-x-1/2 top-60 sm:top-64 text-center w-[85%] text-neutral-500 text-xs font-light font-['Manrope'] leading-tight px-2">
                {{ award.project }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
