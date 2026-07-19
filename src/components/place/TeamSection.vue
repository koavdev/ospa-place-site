<script setup>
  import { onMounted, onUnmounted, ref, nextTick, watch } from "vue";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  typeof gsap.registerPlugin === "function"
    && gsap.registerPlugin(ScrollTrigger);

  const sectionRef = ref(null);
  const mapContainer = ref(null);
  const labelsOverlay = ref(null);
  const isMapHovered = ref(false);
  const isMobile = ref(false);
  let ctx = null;
  let resizeTimeout = null;

  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };

  // IDs dos estados que devem ser destacados no hover
  const highlightedStates = [
    "BRRS",
    "BRSC",
    "BRSP",
    "BRGO",
    "BRMG",
    "BRPE",
    "BRAL",
    "BRRJ",
    "BRES",
  ];

  // Nome das prefeituras-cliente exibido sobre o respectivo estado no hover
  const cityNames = {
    BRRS: "Xangri-Lá",
    BRSC: "Itajaí",
    BRGO: "Rio Verde",
    BRMG: "Belo Horizonte",
    BRPE: "Recife",
    BRAL: "Maceió",
    BRRJ: "Niterói",
    BRES: "Vitória",
  };

  const cityLabels = ref([]);

  const updateLabelPositions = () => {
    if (!mapContainer.value || !labelsOverlay.value) return;

    const overlayRect = labelsOverlay.value.getBoundingClientRect();
    if (overlayRect.width === 0 || overlayRect.height === 0) return;

    cityLabels.value = Object.entries(cityNames).reduce(
      (acc, [stateId, name]) => {
        const path = mapContainer.value.querySelector(`path#${stateId}`);
        if (!path) return acc;

        const pathRect = path.getBoundingClientRect();
        acc.push({
          id: stateId,
          name,
          x:
            ((pathRect.left + pathRect.width / 2 - overlayRect.left)
              / overlayRect.width)
            * 100,
          y:
            ((pathRect.top + pathRect.height / 2 - overlayRect.top)
              / overlayRect.height)
            * 100,
        });
        return acc;
      },
      []
    );
  };

  const testimonials = [
    {
      quote:
        '"A OSPA place traz um ambiente de negócios mais seguro e transparente para BH"',
      name: "João Baldo",
      role: "Diretor de Inovação - SMDE Prefeitura de Belo Horizonte",
    },
    {
      quote:
        '"Eles conseguiram consolidar informações em conhecimento estratégico do território"',
      name: "Tharcio Elizio",
      role: "Políticas Públicas CDL/BH",
    },
  ];

  const updateSvgColors = (hovered) => {
    if (!mapContainer.value) return;

    highlightedStates.forEach((stateId) => {
      const path = mapContainer.value.querySelector(`path#${stateId}`);
      if (path) {
        path.style.fill = hovered ? "#195E53" : "transparent";
      }
    });
  };

  watch(isMapHovered, (newVal) => {
    updateSvgColors(newVal);
    if (newVal) updateLabelPositions();
  });

  const handleResize = () => {
    checkMobile();
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateLabelPositions, 150);
  };

  onMounted(async () => {
    checkMobile();
    window.addEventListener("resize", handleResize);

    // Carregar SVG inline
    try {
      const response = await fetch("/images/place/br.svg");
      const svgText = await response.text();
      if (mapContainer.value) {
        mapContainer.value.innerHTML = svgText;

        // Definir todos os paths como transparentes por padrão com stroke cinza escuro
        const allPaths = mapContainer.value.querySelectorAll("path");
        allPaths.forEach((path) => {
          path.style.fill = "transparent";
          path.style.stroke = "#52525b"; // zinc-600
          path.style.strokeWidth = "1";
          path.style.transition = "fill 0.7s ease-in-out";
        });

        // Adicionar classe de transição aos paths destacados
        highlightedStates.forEach((stateId) => {
          const path = mapContainer.value.querySelector(`path#${stateId}`);
          if (path) {
            path.style.transition = "fill 0.7s ease-in-out";
          }
        });

        nextTick(() => requestAnimationFrame(updateLabelPositions));
      }
    } catch (error) {
      console.error("Erro ao carregar SVG:", error);
    }

    nextTick(() => {
      setTimeout(() => {
        if (!sectionRef.value) return;

        const elements = sectionRef.value.querySelectorAll(
          ".animate-testimonial"
        );
        if (elements.length === 0) return;

        ctx = gsap.context(() => {
          gsap.from(elements, {
            scrollTrigger: {
              trigger: sectionRef.value,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.15,
          });
        }, sectionRef.value);
      }, 100);
    });
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimeout);
    if (ctx) ctx.revert();
  });
</script>

<template>
  <section
    ref="sectionRef"
    id="know-place"
    data-header-style="default"
    class="min-h-screen w-full relative flex flex-col justify-between">
    <!-- Mobile Layout -->
    <div
      v-if="isMobile"
      class="flex-grow flex flex-col px-6 py-16">
      <h2
        class="text-zinc-900 text-2xl font-light font-['Manrope'] leading-tight mb-8">
        Desenvolvido por
        <span class="font-normal">urbanistas</span> especializados em
        <span class="font-normal">mercado, dados e tecnologia.</span>
      </h2>

      <div class="flex flex-col gap-4 flex-grow">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="animate-testimonial bg-white rounded-[20px] p-5 flex flex-col justify-between">
          <p
            class="text-zinc-900 text-base font-light font-['Manrope'] leading-6 mb-4">
            {{ testimonial.quote }}
          </p>
          <div>
            <div
              class="text-zinc-900 text-base font-medium font-['Manrope'] mb-1">
              {{ testimonial.name }}
            </div>
            <div class="text-zinc-400 text-sm font-medium font-['Manrope']">
              {{ testimonial.role }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div
      v-else
      class="container mx-auto px-6 py-20 relative flex-grow flex">
      <!-- Background: Map -->
      <div
        class="absolute inset-0 z-0 flex items-center justify-end overflow-visible">
        <div
          id="mapa"
          ref="mapContainer"
          class="w-[70%] h-full flex items-center justify-end cursor-pointer map-container overflow-visible"
          :class="{ 'map-hovered': isMapHovered }"
          @mouseenter="isMapHovered = true"
          @mouseleave="isMapHovered = false" />
        <div
          ref="labelsOverlay"
          class="absolute inset-0 pointer-events-none">
          <span
            v-for="label in cityLabels"
            :key="label.id"
            class="city-label absolute -translate-x-1/2 -translate-y-1/2 text-white text-[10px] md:text-xs font-medium font-['Manrope'] uppercase tracking-wide transition-opacity duration-700 whitespace-nowrap"
            :class="{ 'opacity-100': isMapHovered, 'opacity-0': !isMapHovered }"
            :style="{ left: label.x + '%', top: label.y + '%' }"
            >{{ label.name }}</span
          >
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-[60%] relative z-10 flex">
        <div class="flex flex-col flex-grow justify-between py-10">
          <h2
            class="text-zinc-900 text-3xl md:text-4xl font-light font-['Manrope'] leading-tight">
            Desenvolvido por <span class="font-normal">urbanistas</span
            ><br />especializados em
            <span class="font-normal">mercado,<br />dados e tecnologia.</span>
          </h2>

          <div class="grid grid-cols-2 gap-6 max-w-4xl">
            <div
              v-for="testimonial in testimonials"
              :key="testimonial.name"
              class="animate-testimonial bg-white rounded-[20px] p-6 min-h-[288px] flex flex-col justify-between">
              <p
                class="text-zinc-900 text-xl font-light font-['Manrope'] leading-8 mb-8">
                {{ testimonial.quote }}
              </p>
              <div>
                <div
                  class="text-zinc-900 text-lg font-medium font-['Manrope'] leading-6 mb-1">
                  {{ testimonial.name }}
                </div>
                <div
                  class="text-zinc-400 text-base font-medium font-['Manrope'] leading-6">
                  {{ testimonial.role }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .map-container :deep(svg) {
    width: auto;
    height: auto;
    max-height: 80vh;
    object-fit: contain;
    overflow: visible;
    opacity: 0.5;
    transition: opacity 0.7s ease-in-out;
  }

  #mapa.map-hovered :deep(svg) {
    opacity: 1;
  }

  .city-label {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  }
</style>
