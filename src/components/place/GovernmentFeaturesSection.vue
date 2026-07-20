<script setup>
  import { onMounted, onUnmounted, ref, nextTick, computed } from "vue";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  typeof gsap.registerPlugin === "function"
    && gsap.registerPlugin(ScrollTrigger);

  const sectionRef = ref(null);
  const activeCard = ref(null);
  const isMobile = ref(false);
  const currentIndex = ref(0);
  let ctx = null;

  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };

  const cases = [
    {
      id: 1,
      title: "Mapa Consulta\nUrbana de Xangri-Lá (RS)",
      description: "Simplificar análises de potencial construtivo",
      longtext:
        "Após a revisão do Plano Diretor, as novas regras urbanísticas foram facilitadas, trazendo mais segurança regulatória e acesso ao potencial construtivo urbano.",
      tags: "ODS 11 | Cidades e Comunidades Sustentáveis",
      population: "+15 mil habitantes",
      client: "Prefeitura de Xangri-Lá - RS",
      image: "/images/place/government/1.png",
      video_url: "/videos/place/xangrila.mp4",
    },
    {
      id: 2,
      title: "Gêmeo Digital Urbano\nde Rio Verde (GO)",
      description: "Impulsionar a arrecadação através do mercado",
      longtext:
        "A necessidade de acelerar a aprovação de projetos levou o município a unir dados urbanos, Inteligência Artificial e viabilidade financeira de forma visual e integrada.",
      tags: "ODS 9 | Indústria, Inovação e Infraestrutura",
      population: "+220 mil habitantes",
      client: "Prefeitura de Rio Verde - GO",
      image: "/images/place/government/2.png",
      video_url: "/videos/place/rio_verde.mp4",
    },
    {
      id: 3,
      title: "Consulta íntegra de\nRecife (PE)",
      description: "Acelerar a aprovação de projetos",
      longtext:
        "Para fortalecer os negócios locais, dados territoriais, econômicos e IA orientam os empreendedores a decidir o melhor local para abertura de empreendimentos.",
      tags: "ODS 11 | Trabalho Decente e Crescimento Econômico",
      population: "+2.3 milhões habitantes",
      client: "Prefeitura de Recife - PE",
      image: "/images/place/government/3.png",
      video_url: "/videos/place/bh.mp4",
    },
  ];

  const logos = [
    "/images/place/government/partners/bh.png",
    "/images/place/government/partners/itajai.png",
    "/images/place/government/partners/rio_verde.png",
    "/images/place/government/partners/xangrila.png",
    "/images/place/government/partners/secovi.png",
  ];

  const handleCardClick = (cardId) => {
    activeCard.value = cardId;
  };

  const closeCard = () => {
    activeCard.value = null;
  };

  const currentCase = computed(() => cases[currentIndex.value]);

  const nextCard = () => {
    if (currentIndex.value < cases.length - 1) {
      currentIndex.value++;
    }
  };

  const prevCard = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };

  const touchStartX = ref(0);
  const handleTouchStart = (e) => {
    touchStartX.value = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.value - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextCard();
      else prevCard();
    }
  };

  const handleMobileCardClick = () => {
    activeCard.value = currentCase.value.id;
  };

  onMounted(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
    if (ctx) ctx.revert();
  });
</script>

<template>
  <section
    ref="sectionRef"
    id="features"
    class="min-h-screen w-full relative bg-stone-50 flex flex-col justify-between">
    <div class="container mx-auto mt-10 px-6 py-20 relative z-10 flex-grow">
      <div class="mb-8 md:mb-16">
        <h2
          class="text-zinc-900 text-lg md:text-2xl font-light font-['Manrope'] leading-7 md:leading-8">
          O Gêmeo Digital que atende a<br />
          todas as realidades urbanas
        </h2>
      </div>

      <!-- Mobile Carousel -->
      <div
        v-if="isMobile"
        class="mb-8">
        <div
          class="relative"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd">
          <!-- Card -->
          <div
            class="bg-white rounded-[20px] p-5 flex flex-col relative"
            :class="{ 'bg-teal-800': activeCard === currentCase.id }"
            @click="handleMobileCardClick">
            <div
              class="w-full h-40 mb-4 bg-neutral-100 overflow-hidden rounded-[20px]">
              <img
                v-if="activeCard !== currentCase.id"
                class="w-full h-full object-cover"
                :src="currentCase.image"
                :alt="currentCase.title" />
              <video
                v-else
                class="w-full h-full object-cover"
                autoplay
                muted
                loop
                playsinline>
                <source
                  :src="currentCase.video_url"
                  type="video/mp4" />
              </video>
            </div>

            <h3
              class="text-xl font-medium font-['Manrope'] leading-6 mb-3 whitespace-pre-line transition-colors duration-500"
              :class="
                activeCard === currentCase.id
                  ? 'text-stone-50'
                  : 'text-zinc-900'
              ">
              {{ currentCase.title }}
            </h3>
            <p
              class="text-base font-light font-['Manrope'] leading-6 mb-3 transition-colors duration-500"
              :class="
                activeCard === currentCase.id
                  ? 'text-stone-50'
                  : 'text-neutral-500'
              ">
              {{ currentCase.description }}
            </p>
            <p
              class="text-xs font-light font-['Manrope'] leading-5 mb-4 transition-colors duration-500"
              :class="
                activeCard === currentCase.id
                  ? 'text-stone-50'
                  : 'text-neutral-500'
              ">
              {{ currentCase.tags }}
            </p>
            <div class="space-y-1">
              <p
                class="text-sm font-normal font-['Manrope'] transition-colors duration-500"
                :class="
                  activeCard === currentCase.id
                    ? 'text-stone-50'
                    : 'text-zinc-900'
                ">
                {{ currentCase.population }}
              </p>
              <p
                class="text-sm font-light font-['Manrope'] transition-colors duration-500"
                :class="
                  activeCard === currentCase.id
                    ? 'text-stone-50'
                    : 'text-zinc-900'
                ">
                {{ currentCase.client }}
              </p>
            </div>

            <!-- Modal overlay on card -->
            <Transition name="fade">
              <div
                v-if="activeCard === currentCase.id"
                class="absolute inset-0 bg-white rounded-[20px] p-5 flex flex-col justify-center z-30">
                <button
                  class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                  @click.stop="closeCard">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <line
                      x1="18"
                      y1="6"
                      x2="6"
                      y2="18"></line>
                    <line
                      x1="6"
                      y1="6"
                      x2="18"
                      y2="18"></line>
                  </svg>
                </button>
                <p
                  class="text-zinc-900 text-base font-light font-['Manrope'] leading-relaxed">
                  {{ currentCase.longtext }}
                </p>
              </div>
            </Transition>
          </div>

          <!-- Navigation arrows -->
          <button
            v-if="currentIndex > 0"
            @click.stop="prevCard"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md z-20">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <button
            v-if="currentIndex < cases.length - 1"
            @click.stop="nextCard"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md z-20">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2">
              <polyline points="9,6 15,12 9,18"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- Desktop Grid -->
      <div
        v-else
        class="grid grid-cols-3 gap-6 mb-12">
        <!-- Card 1 -->
        <div
          class="animate-case bg-white rounded-[20px] p-5 flex flex-col cursor-pointer hover:bg-teal-800 transition-all duration-500 group"
          :class="{ 'bg-teal-800': activeCard === 1 }"
          :style="{
            opacity: activeCard !== null && activeCard !== 1 ? 0 : '',
            pointerEvents:
              activeCard !== null && activeCard !== 1 ? 'none' : '',
          }"
          @click="handleCardClick(1)">
          <div
            class="w-full h-auto mb-4 bg-neutral-100 overflow-hidden rounded-[20px]">
            <img
              v-if="activeCard !== 1"
              class="w-full h-full object-cover"
              :src="cases[0].image"
              :alt="cases[0].title" />
            <video
              v-else
              class="w-full h-full object-cover"
              autoplay
              muted
              loop
              playsinline>
              <source
                :src="cases[0].video_url"
                type="video/mp4" />
            </video>
          </div>

          <h3
            class="text-zinc-900 group-hover:text-stone-50 text-xl font-medium font-['Manrope'] leading-6 mb-4 whitespace-pre-line transition-colors duration-500"
            :class="{ 'text-stone-50': activeCard === 1 }">
            {{ cases[0].title }}
          </h3>
          <p
            class="text-neutral-500 group-hover:text-stone-50 text-lg font-light font-['Manrope'] leading-6 mb-4 flex-grow transition-colors duration-500"
            :class="{ 'text-stone-50': activeCard === 1 }">
            {{ cases[0].description }}
          </p>
          <p
            class="text-neutral-500 group-hover:text-stone-50 text-xs font-light font-['Manrope'] leading-5 mb-6 transition-colors duration-500"
            :class="{ 'text-stone-50': activeCard === 1 }">
            {{ cases[0].tags }}
          </p>
          <div class="space-y-2">
            <p
              class="text-zinc-900 group-hover:text-stone-50 text-base font-normal font-['Manrope'] leading-6 transition-colors duration-500"
              :class="{ 'text-stone-50': activeCard === 1 }">
              {{ cases[0].population }}
            </p>
            <p
              class="text-zinc-900 group-hover:text-stone-50 text-base font-light font-['Manrope'] leading-6 transition-colors duration-500"
              :class="{ 'text-stone-50': activeCard === 1 }">
              {{ cases[0].client }}
            </p>
          </div>
        </div>

        <!-- Column 2: Card 2 + Text overlays -->
        <div class="grid grid-cols-1 grid-rows-1 h-full relative">
          <div
            class="col-start-1 row-start-1 animate-case bg-white rounded-[20px] p-5 flex flex-col cursor-pointer hover:bg-teal-800 transition-all duration-500 z-10 group"
            :class="{ 'bg-teal-800': activeCard === 2 }"
            :style="{
              opacity: activeCard !== null ? 0 : '',
              pointerEvents: activeCard !== null ? 'none' : '',
            }"
            @click="handleCardClick(2)">
            <div
              class="w-full h-auto mb-4 bg-neutral-100 overflow-hidden rounded-[20px]">
              <img
                v-if="activeCard !== 2"
                class="w-full h-full object-cover"
                :src="cases[1].image"
                :alt="cases[1].title" />
              <video
                v-else
                class="w-full h-full object-cover"
                autoplay
                muted
                loop
                playsinline>
                <source
                  :src="cases[1].video_url"
                  type="video/mp4" />
              </video>
            </div>

            <h3
              class="text-zinc-900 group-hover:text-stone-50 text-xl font-medium font-['Manrope'] leading-6 mb-4 whitespace-pre-line transition-colors duration-500"
              :class="{ 'text-stone-50': activeCard === 2 }">
              {{ cases[1].title }}
            </h3>
            <p
              class="text-neutral-500 group-hover:text-stone-50 text-lg font-light font-['Manrope'] leading-6 mb-4 flex-grow transition-colors duration-500"
              :class="{ 'text-stone-50': activeCard === 2 }">
              {{ cases[1].description }}
            </p>
            <p
              class="text-neutral-500 group-hover:text-stone-50 text-xs font-light font-['Manrope'] leading-5 mb-6 transition-colors duration-500"
              :class="{ 'text-stone-50': activeCard === 2 }">
              {{ cases[1].tags }}
            </p>
            <div class="space-y-2">
              <p
                class="text-zinc-900 group-hover:text-stone-50 text-base font-normal font-['Manrope'] leading-6 transition-colors duration-500"
                :class="{ 'text-stone-50': activeCard === 2 }">
                {{ cases[1].population }}
              </p>
              <p
                class="text-zinc-900 group-hover:text-stone-50 text-base font-light font-['Manrope'] leading-6 transition-colors duration-500"
                :class="{ 'text-stone-50': activeCard === 2 }">
                {{ cases[1].client }}
              </p>
            </div>
          </div>

          <!-- Text Card 1 -->
          <div
            class="col-start-1 row-start-1 flex items-center justify-center p-6 z-20 transition-opacity duration-500 relative"
            :class="
              activeCard === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            ">
            <button
              class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              @click.stop="closeCard">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"></line>
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"></line>
              </svg>
            </button>
            <div class="w-full text-zinc-900 text-left">
              <p
                class="text-lg font-light font-['Manrope'] leading-relaxed mb-4">
                {{ cases[0].longtext }}
              </p>
            </div>
          </div>

          <!-- Text Card 3 -->
          <div
            class="col-start-1 row-start-1 flex items-center justify-center p-6 z-20 transition-opacity duration-500 relative"
            :class="
              activeCard === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            ">
            <button
              class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              @click.stop="closeCard">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"></line>
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"></line>
              </svg>
            </button>
            <div class="w-full text-zinc-900 text-right">
              <p
                class="text-lg font-light font-['Manrope'] leading-relaxed mb-4">
                {{ cases[2].longtext }}
              </p>
            </div>
          </div>
        </div>

        <!-- Column 3: Card 3 + Text overlay -->
        <div class="grid grid-cols-1 grid-rows-1 h-full relative">
          <div
            class="col-start-1 row-start-1 animate-case bg-white rounded-[20px] p-5 flex flex-col cursor-pointer hover:bg-teal-800 transition-all duration-500 z-10 group"
            :class="{ 'bg-teal-800': activeCard === 3 }"
            :style="{
              opacity: activeCard !== null ? 0 : '',
              pointerEvents: activeCard !== null ? 'none' : '',
            }"
            @click="handleCardClick(3)">
            <div
              class="w-full h-auto mb-4 bg-neutral-100 overflow-hidden rounded-[20px]">
              <img
                v-if="activeCard !== 3"
                class="w-full h-full object-cover"
                :src="cases[2].image"
                :alt="cases[2].title" />
              <video
                v-else
                class="w-full h-full object-cover"
                autoplay
                muted
                loop
                playsinline>
                <source
                  :src="cases[2].video_url"
                  type="video/mp4" />
              </video>
            </div>

            <h3
              class="text-zinc-900 group-hover:text-stone-50 text-xl font-medium font-['Manrope'] leading-6 mb-4 whitespace-pre-line transition-colors duration-500"
              :class="{ 'text-stone-50': activeCard === 3 }">
              {{ cases[2].title }}
            </h3>
            <p
              class="text-neutral-500 group-hover:text-stone-50 text-lg font-light font-['Manrope'] leading-6 mb-4 flex-grow transition-colors duration-500"
              :class="{ 'text-stone-50': activeCard === 3 }">
              {{ cases[2].description }}
            </p>
            <p
              class="text-neutral-500 group-hover:text-stone-50 text-xs font-light font-['Manrope'] leading-5 mb-6 transition-colors duration-500"
              :class="{ 'text-stone-50': activeCard === 3 }">
              {{ cases[2].tags }}
            </p>
            <div class="space-y-2">
              <p
                class="text-zinc-900 group-hover:text-stone-50 text-base font-normal font-['Manrope'] leading-6 transition-colors duration-500"
                :class="{ 'text-stone-50': activeCard === 3 }">
                {{ cases[2].population }}
              </p>
              <p
                class="text-zinc-900 group-hover:text-stone-50 text-base font-light font-['Manrope'] leading-6 transition-colors duration-500"
                :class="{ 'text-stone-50': activeCard === 3 }">
                {{ cases[2].client }}
              </p>
            </div>
          </div>

          <!-- Text Card 2 -->
          <div
            class="col-start-1 row-start-1 flex items-center justify-center p-6 z-20 transition-opacity duration-500 relative"
            :class="
              activeCard === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            ">
            <button
              class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              @click.stop="closeCard">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"></line>
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"></line>
              </svg>
            </button>
            <div class="w-full text-zinc-900 text-left">
              <p
                class="text-lg font-light font-['Manrope'] leading-relaxed mb-4">
                {{ cases[1].longtext }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8 md:mt-0">
        <a
          href="https://www.ospa.place/portfolio-governo"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full md:w-60 h-9 rounded-[20px] border-[0.50px] border-neutral-500 flex items-center justify-center hover:bg-neutral-500 hover:text-white transition-colors group cursor-pointer uppercase">
          <span
            class="text-neutral-500 text-base font-light font-['Manrope'] leading-8 group-hover:text-white transition-colors uppercase"
            >conhecer plataforma</span
          >
        </a>
      </div>
    </div>

    <!-- Logos Carousel -->
    <div class="w-full py-8 border-t border-gray-200/50 shrink-0">
      <div class="logos-scroll">
        <div class="logos-track">
          <img
            v-for="(logo, index) in [...logos, ...logos, ...logos]"
            :key="index"
            class="logo-item w-56 h-16 object-contain"
            :src="logo"
            alt="Logo" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .logos-scroll {
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .logos-track {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3.5rem;
    opacity: 0.2;
    animation: scroll-logos 30s linear infinite;
    width: fit-content;
  }

  .logo-item {
    flex-shrink: 0;
  }

  @keyframes scroll-logos {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .logos-scroll:hover .logos-track {
    animation-play-state: paused;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
