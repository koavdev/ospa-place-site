<script setup>
  import { onMounted, onUnmounted, ref, nextTick } from "vue";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  typeof gsap.registerPlugin === "function"
    && gsap.registerPlugin(ScrollTrigger);

  const sectionRef = ref(null);
  let ctx = null;

  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        if (!sectionRef.value) return;

        const elements = sectionRef.value.querySelectorAll(".animate-in");
        if (elements.length === 0) return;

        ctx = gsap.context(() => {
          gsap.from(elements, {
            scrollTrigger: {
              trigger: sectionRef.value,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.2,
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
    id="text-pillars"
    data-header-style="default"
    class="min-h-screen w-full flex flex-col justify-center py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
    <div
      class="container mx-auto px-4 sm:px-6 flex-grow flex flex-col justify-center">
      <div
        class="w-full lg:max-w-[615px] xl:max-w-[700px] lg:ml-auto lg:mr-16 xl:mr-32 flex flex-col gap-6 sm:gap-8">
        <div
          class="animate-in w-full text-zinc-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light font-['Manrope'] leading-tight sm:leading-snug md:leading-[50px]">
          A OSPA place é uma plataforma integrada de inteligência territorial
          que organiza, qualifica e conecta dados.
        </div>
        <div
          class="animate-in w-full text-zinc-400 text-base sm:text-lg md:text-xl lg:text-2xl font-light font-['Manrope'] leading-relaxed sm:leading-loose md:leading-10">
          Para governos, um Gêmeo Digital Urbano que integra bases públicas,
          rotinas urbanísticas e processos decisórios em uma estrutura
          interoperável multiescalar. Para o mercado, soluções exclusivas que
          combinam análise territorial, cenários, riscos e oportunidades,
          simplificando desde estudos de viabilidade até a gestão completa do
          portfólio de ativos imobiliários.
        </div>
      </div>
    </div>
  </section>
</template>
