<script setup>
  import { onMounted, onUnmounted, ref, nextTick } from "vue";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  typeof gsap.registerPlugin === "function"
    && gsap.registerPlugin(ScrollTrigger);

  const emit = defineEmits(["openDemo"]);

  const sectionRef = ref(null);
  let ctx = null;

  const hoveredCard = ref(null);

  const exclusiveSolutions = [
    {
      id: 1,
      image: "/images/place/habitasul.png",
      title: "Gêmeo digital para bairros planejados",
      description:
        "Simular cenários e unificar todos os setores em uma única interface.",
      client: "Habitasul | Biotic",
      video_url: "/videos/place/gemeo.mp4",
    },
    {
      id: 2,
      image: "/images/place/cbre.png",
      title: "Inteligência territorial para negócios imobiliários",
      description:
        "Transformar desafios de negócio ao mapear, organizar e integrar dados para orientar decisões",
      client: "CBRE | Construtora Tenda",
      video_url: "/videos/place/negocios.mp4",
    },
  ];

  const standardSolution = {
    id: 3,
    image: "/images/place/padrao.png",
    title: "Sistema de Consulta de Terrenos em SP",
    description:
      "Desenvolver estudos de viabilidade financeira e volumétrica em um clique",
    video_url: "/videos/place/mercado_cidades.mp4",
  };

  const logos = [
    "/images/place/market/partners/biotic.png",
    "/images/place/market/partners/cau_rj.jpg",
    "/images/place/market/partners/cbre.svg",
    "/images/place/market/partners/cdl_bh.jpg",
    "/images/place/market/partners/ey.png",
    "/images/place/market/partners/habitasul.png",
    "/images/place/market/partners/mota_machado.png",
    "/images/place/market/partners/tenda.png",
  ];

  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        if (!sectionRef.value) return;

        const elements = sectionRef.value.querySelectorAll(".animate-solution");
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
    if (ctx) ctx.revert();
  });
</script>

<template>
  <section
    ref="sectionRef"
    id="market-solutions"
    data-header-style="default"
    class="min-h-screen w-full relative flex flex-col">
    <div
      class="container mx-auto px-6 py-20 relative z-10 flex-grow flex flex-col">
      <!-- Header -->
      <h2
        class="text-zinc-900 text-3xl md:text-4xl font-medium font-['Manrope'] leading-tight max-w-3xl mb-6">
        Inteligência territorial adaptável a todas as complexidades imobiliárias
      </h2>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-grow">
        <!-- Left: Exclusive Solutions (2 cols) -->
        <div class="lg:col-span-2 bg-white rounded-[20px] p-5 flex flex-col">
          <p
            class="text-zinc-400 text-lg font-light font-['Manrope'] leading-6 h-[60px] text-center">
            Soluções exclusivas paraas necessidades de cada <br />
            cliente
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 flex-grow">
            <div
              v-for="solution in exclusiveSolutions"
              :key="solution.title"
              class="animate-solution flex flex-col"
              @mouseenter="hoveredCard = solution.id"
              @mouseleave="hoveredCard = null">
              <div
                class="w-full h-44 bg-stone-50 rounded-[10px] overflow-hidden mb-6 relative">
                <img
                  v-if="hoveredCard !== solution.id"
                  :src="solution.image"
                  :alt="solution.title"
                  class="w-full h-full object-cover" />
                <video
                  v-else
                  class="w-full h-full object-cover"
                  autoplay
                  muted
                  loop
                  playsinline>
                  <source
                    :src="solution.video_url"
                    type="video/mp4" />
                </video>
              </div>
              <h3
                class="text-zinc-900 text-xl font-medium font-['Manrope'] leading-6 mb-4 min-h-[48px]">
                {{ solution.title }}
              </h3>
              <p
                class="text-neutral-500 text-base font-light font-['Manrope'] leading-6 mb-4">
                {{ solution.description }}
              </p>
              <p
                class="text-zinc-900 text-base font-normal font-['Manrope'] leading-6 mt-auto">
                {{ solution.client }}
              </p>
            </div>
          </div>

          <!-- CTA -->
          <div class="flex justify-center mt-6">
            <button
              @click="emit('openDemo')"
              class="w-60 h-9 mt-10 rounded-[20px] border border-neutral-500 hover:bg-neutral-500 hover:text-white transition-colors group cursor-pointer uppercase">
              <span
                class="text-neutral-500 text-base font-light font-['Manrope'] group-hover:text-white transition-colors uppercase"
                >agendar</span
              >
            </button>
          </div>
        </div>

        <!-- Right: Standard Solution (1 col) -->
        <div class="bg-white rounded-[20px] p-5 flex flex-col">
          <p
            class="text-zinc-400 text-lg font-light font-['Manrope'] leading-6 h-[60px] text-center">
            Solução padronizada, disponível imediatamente via assinatura
          </p>

          <div
            class="animate-solution flex flex-col flex-grow"
            @mouseenter="hoveredCard = standardSolution.id"
            @mouseleave="hoveredCard = null">
            <div
              class="w-full h-44 bg-stone-50 rounded-[10px] overflow-hidden mb-6 relative">
              <img
                v-if="hoveredCard !== standardSolution.id"
                :src="standardSolution.image"
                :alt="standardSolution.title"
                class="w-full h-full object-cover" />
              <video
                v-else
                class="w-full h-full object-cover"
                autoplay
                muted
                loop
                playsinline>
                <source
                  :src="standardSolution.video_url"
                  type="video/mp4" />
              </video>
            </div>
            <h3
              class="text-zinc-900 text-xl font-medium font-['Manrope'] leading-6 mb-4 min-h-[48px]">
              {{ standardSolution.title }}
            </h3>
            <p
              class="text-neutral-500 text-base font-light font-['Manrope'] leading-6 mb-4">
              {{ standardSolution.description }}
            </p>
            <a
              href="https://app.ospa.place/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-zinc-900 text-base font-light font-['Manrope'] underline leading-6 hover:text-zinc-600 transition-colors mt-auto">
              Acessar o sistema
            </a>
          </div>

          <!-- CTA -->
          <div class="flex justify-center mt-6">
            <a
              href="https://www.ospa.place/demo-sistema-sp"
              target="_blank"
              rel="noopener noreferrer"
              class="w-60 h-9 mt-10 rounded-[20px] border border-neutral-500 hover:bg-neutral-500 hover:text-white transition-colors flex items-center justify-center group cursor-pointer uppercase">
              <span
                class="text-neutral-500 text-base font-light font-['Manrope'] group-hover:text-white transition-colors uppercase">
                Assistir
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Logos Carousel -->
    <div class="w-full py-8 border-t border-gray-200/50 shrink-0">
      <div class="logos-scroll">
        <div class="logos-track">
          <img
            v-for="(logo, index) in [...logos, ...logos]"
            :key="index"
            class="logo-item w-48 h-14 object-contain"
            :src="logo"
            alt="Logo" />
        </div>
      </div>
    </div>
  </section>
</template>
