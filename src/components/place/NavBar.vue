<script setup>
  import { ref } from "vue";

  const mobileMenuOpen = ref(false);
  const mobileVerticaisOpen = ref(false);
  const mobileConhecaOpen = ref(false);
  const conhecaDropdownOpen = ref(false);

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
    mobileVerticaisOpen.value = false;
    mobileConhecaOpen.value = false;
  };

  const toggleMobileVerticais = () => {
    mobileVerticaisOpen.value = !mobileVerticaisOpen.value;
  };

  const toggleMobileConheca = () => {
    mobileConhecaOpen.value = !mobileConhecaOpen.value;
  };

  const openConhecaDropdown = () => {
    conhecaDropdownOpen.value = true;
  };

  const closeConhecaDropdown = () => {
    conhecaDropdownOpen.value = false;
  };

  const emit = defineEmits(["openContactModal"]);

  const handleContactClick = () => {
    emit("openContactModal");
    closeMobileMenu();
  };

  const navLinks = [
    { href: "#text-pillars", label: "sobre", type: "link" },
    { href: "#government", label: "governos", type: "link" },
    { href: "#market", label: "mercado", type: "link" },
    { label: "conheça", type: "dropdown" },
    { href: "#contato", label: "contato", type: "button" },
  ];

  const conhecaLinks = [
    {
      href: "https://app.ospa.place/",
      label: "sistema de terrenos em SP",
      type: "external",
    },
    {
      href: "https://www.ospa.place/portfolio-governo",
      label: "plataforma de prefeituras",
      type: "external",
    },
  ];

  const verticalLinks = [
    { to: "/", label: "OSPA", type: "router" },
    { to: "/ospa-place", label: "OSPA place", type: "router" },
    { to: "/ospa-architecture", label: "OSPA architecture", type: "router" },
    { to: "/ospa-capital", label: "OSPA capital", type: "router" },
    {
      href: "https://www.responsivecities.com/",
      label: "Instituto Cidades Responsivas",
      type: "external",
    },
  ];
</script>

<template>
  <!-- Navigation -->
  <nav
    id="navbar"
    class="fixed w-full z-50 top-0 left-0 bg-gradient-to-b from-stone-50 from-50% to-stone-50/0 backdrop-blur-sm transition-all duration-300">
    <div class="container mx-auto px-6 h-20 flex justify-between items-center">
      <router-link
        to="/place"
        class="cursor-pointer hover:opacity-80 transition-opacity">
        <img
          src="/logos/place.svg"
          alt="OSPA place"
          class="h-14 pt-1 w-auto" />
      </router-link>

      <div
        class="hidden md:flex space-x-10 text-xs font-medium tracking-widest">
        <template
          v-for="link in navLinks"
          :key="link.label">
          <a
            v-if="link.type === 'link'"
            :href="link.href"
            class="hover:text-gray-500 text-center justify-center text-zinc-900 text-base font-light font-['Manrope'] leading-8 transition-colors">
            {{ link.label }}
          </a>
          <!-- Dropdown Conheça -->
          <div
            v-else-if="link.type === 'dropdown'"
            class="relative"
            @mouseenter="openConhecaDropdown"
            @mouseleave="closeConhecaDropdown">
            <button
              class="hover:text-gray-500 text-center justify-center text-zinc-900 text-base font-light font-['Manrope'] leading-8 transition-colors flex items-center gap-1">
              {{ link.label }}
              <svg
                :class="{ 'rotate-180': conhecaDropdownOpen }"
                class="w-4 h-4 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              v-show="conhecaDropdownOpen"
              class="absolute top-full left-1/2 -translate-x-1/2 pt-2">
              <div
                class="bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[240px]">
                <a
                  v-for="clink in conhecaLinks"
                  :key="clink.label"
                  :href="clink.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block px-4 py-2 text-zinc-900 text-sm font-light font-['Manrope'] hover:bg-gray-50 transition-colors">
                  {{ clink.label }}
                </a>
              </div>
            </div>
          </div>
          <button
            v-else
            @click="handleContactClick"
            class="hover:text-gray-500 text-center justify-center text-zinc-900 text-base font-light font-['Manrope'] leading-8 transition-colors">
            {{ link.label }}
          </button>
        </template>
      </div>

      <button
        @click="toggleMobileMenu"
        class="md:hidden z-50 space-y-1.5 group">
        <div
          class="w-6 h-0.5 bg-black transition-all duration-300"
          :class="{ 'rotate-45 translate-y-2': mobileMenuOpen }"></div>
        <div
          class="w-6 h-0.5 bg-black transition-all duration-300"
          :class="{ 'opacity-0': mobileMenuOpen }"></div>
        <div
          class="w-6 h-0.5 bg-black transition-all duration-300"
          :class="{ '-rotate-45 -translate-y-2': mobileMenuOpen }"></div>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu Overlay -->
  <div
    v-show="mobileMenuOpen"
    class="fixed inset-0 z-[55] bg-stone-50">
    <div class="h-full w-full flex flex-col">
      <div
        class="flex justify-between items-center p-6 border-b border-gray-200">
        <img
          src="/logos/ospa.svg"
          alt="OSPA"
          class="h-8 w-auto" />
        <button
          @click="closeMobileMenu"
          class="p-2">
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
      </div>
      <nav
        class="flex-1 flex flex-col justify-center px-6 py-12 overflow-y-auto">
        <template
          v-for="link in navLinks"
          :key="link.label">
          <a
            v-if="link.type === 'link'"
            :href="link.href"
            @click="closeMobileMenu"
            class="text-zinc-900 text-2xl font-light font-['Manrope'] py-4 border-b border-gray-200">
            {{ link.label }}
          </a>
          <!-- Dropdown Conheça Mobile -->
          <div
            v-else-if="link.type === 'dropdown'"
            class="border-b border-gray-200">
            <button
              @click="toggleMobileConheca"
              class="text-zinc-900 text-2xl font-light font-['Manrope'] py-4 w-full text-left flex justify-between items-center">
              {{ link.label }}
              <svg
                :class="{ 'rotate-180': mobileConhecaOpen }"
                class="w-5 h-5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              v-show="mobileConhecaOpen"
              class="pl-4 pb-4 space-y-3">
              <a
                v-for="clink in conhecaLinks"
                :key="clink.label"
                :href="clink.href"
                target="_blank"
                rel="noopener noreferrer"
                @click="closeMobileMenu"
                class="block text-zinc-800 text-base font-light font-['Manrope']">
                {{ clink.label }}
              </a>
            </div>
          </div>
          <button
            v-else
            @click="handleContactClick"
            class="text-zinc-900 text-2xl font-light font-['Manrope'] py-4 border-b border-gray-200 text-left">
            {{ link.label }}
          </button>
        </template>

        <!-- Negócios Section -->
        <div class="border-b border-gray-200">
          <button
            @click="toggleMobileVerticais"
            class="text-zinc-900 text-2xl font-light font-['Manrope'] py-4 w-full text-left flex justify-between items-center">
            negócios
            <svg
              :class="{ 'rotate-180': mobileVerticaisOpen }"
              class="w-5 h-5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div
            v-show="mobileVerticaisOpen"
            class="pl-4 pb-4 space-y-3">
            <template
              v-for="vlink in verticalLinks"
              :key="vlink.label">
              <router-link
                v-if="vlink.type === 'router'"
                :to="vlink.to"
                @click="closeMobileMenu"
                class="block text-zinc-800 text-base font-light font-['Manrope']">
                {{ vlink.label }}
              </router-link>
              <a
                v-else
                :href="vlink.href"
                target="_blank"
                rel="noopener noreferrer"
                @click="closeMobileMenu"
                class="block text-zinc-800 text-base font-light font-['Manrope']">
                {{ vlink.label }}
              </a>
            </template>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>
