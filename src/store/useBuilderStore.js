import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const createDefaultState = () => ({
  schemaVersion: "1.0",

  project: {
    id: "",
    name: "",
    status: "draft",
    createdAt: "",
    updatedAt: "",
  },

  category: "",
  templateId: "",
  templateProfile: "modern",
  homeSections: ["stats", "features", "testimonials", "faq", "cta"],

  business: {
    companyName: "",
    tagline: "",
    description: "",
    industry: "",
    email: "",
    phone: "",
    address: "",
    targetAudience: "",
    primaryGoal: "",
    services: "",
  },

  logo: {
    mode: "text",
    previewUrl: "",
    attachmentUrl: "",
    fileName: "",
    requested: false,
    text: "",
  },

  branding: {
    paletteId: "ocean",

    colors: {
      primary: "#2563eb",
      secondary: "#0f172a",
      accent: "#14b8a6",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
    },

    fontId: "modern",
    headingFont: "Inter",
    bodyFont: "Inter",

    radius: 18,
    containerWidth: 1200,

    headerStyle: "standard",
    footerStyle: "columns",
  },

  content: {
    hero: {
      enabled: true,
      eyebrow: "",
      heading: "",
      description: "",
      buttonText: "Get Started",
      buttonUrl: "/contact/",
      secondaryButtonText: "Learn More",
      secondaryButtonUrl: "/about/",
      imageUrl: "",
      imageAlt: "",
    },

    services: {
      enabled: true,
      eyebrow: "Our Services",
      heading: "What We Offer",
      description: "",
      items: [],
    },

    about: {
      enabled: true,
      eyebrow: "About Us",
      heading: "",
      description: "",
      imageUrl: "",
      imageAlt: "",
    },

    testimonials: {
      enabled: true,
      eyebrow: "Testimonials",
      heading: "What Our Clients Say",
      description: "",
      items: [],
    },

    cta: {
      enabled: true,
      eyebrow: "Get Started",
      heading: "",
      description: "",
      buttonText: "Contact Us",
      buttonUrl: "/contact/",
    },
  },

  pages: [
    {
      id: "home",
      title: "Home",
      slug: "home",
      type: "home",
      enabled: true,
    },
    {
      id: "about",
      title: "About",
      slug: "about",
      type: "page",
      enabled: true,
    },
    {
      id: "services",
      title: "Services",
      slug: "services",
      type: "page",
      enabled: true,
    },
    {
      id: "blog",
      title: "Blog",
      slug: "blog",
      type: "blog",
      enabled: true,
    },
    {
      id: "contact",
      title: "Contact",
      slug: "contact",
      type: "page",
      enabled: true,
    },
  ],

  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    twitter: "",
    tiktok: "",
  },

  seo: {
    siteTitle: "",
    metaDescription: "",
    keywords: "",
    faviconUrl: "",
    indexWebsite: true,
  },

  preview: {
    device: "desktop",
    activePage: "home",
    zoom: 100,
  },

  builder: {
    currentStep: 1,
    completedSteps: [],
    isGenerating: false,
    isPublishing: false,
    lastSavedAt: "",
    error: "",
  },

  generation: {
    status: "idle",
    generatedAt: "",
    responseId: "",
    generatedImages: 0,
    pages: 0,
    document: null,
    provision: null,
    error: "",
  },
});

export const useBuilderStore = create(
  persist(
    (set, get) => ({
      ...createDefaultState(),

      setCategory: (category) =>
        set({
          category,
          project: {
            ...get().project,
            updatedAt: new Date().toISOString(),
          },
        }),

      setTemplateId: (templateId) =>
        set({
          templateId,
          templateProfile: templateId,
          project: {
            ...get().project,
            updatedAt: new Date().toISOString(),
          },
        }),

      updateProject: (values) =>
        set((state) => ({
          project: {
            ...state.project,
            ...values,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateBusiness: (values) =>
        set((state) => ({
          business: {
            ...state.business,
            ...values,
          },
          project: {
            ...state.project,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateLogo: (values) =>
        set((state) => ({
          logo: {
            ...state.logo,
            ...values,
          },
          project: {
            ...state.project,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateBranding: (values) =>
        set((state) => ({
          branding: {
            ...state.branding,
            ...values,

            colors: values.colors
              ? {
                  ...state.branding.colors,
                  ...values.colors,
                }
              : state.branding.colors,
          },

          project: {
            ...state.project,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateBrandingColors: (colors) =>
        set((state) => ({
          branding: {
            ...state.branding,
            colors: {
              ...state.branding.colors,
              ...colors,
            },
          },

          project: {
            ...state.project,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateContentSection: (sectionName, values) =>
        set((state) => {
          if (!state.content[sectionName]) {
            console.error(
              `Content section "${sectionName}" does not exist.`,
            );

            return state;
          }

          return {
            content: {
              ...state.content,

              [sectionName]: {
                ...state.content[sectionName],
                ...values,
              },
            },

            project: {
              ...state.project,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      setServiceItems: (items) =>
        set((state) => ({
          content: {
            ...state.content,

            services: {
              ...state.content.services,
              items,
            },
          },
        })),

      addServiceItem: (item) =>
        set((state) => ({
          content: {
            ...state.content,

            services: {
              ...state.content.services,

              items: [
                ...state.content.services.items,
                {
                  id: crypto.randomUUID(),
                  title: "",
                  description: "",
                  icon: "",
                  imageUrl: "",
                  ...item,
                },
              ],
            },
          },
        })),

      updateServiceItem: (itemId, values) =>
        set((state) => ({
          content: {
            ...state.content,

            services: {
              ...state.content.services,

              items: state.content.services.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      ...values,
                    }
                  : item,
              ),
            },
          },
        })),

      removeServiceItem: (itemId) =>
        set((state) => ({
          content: {
            ...state.content,

            services: {
              ...state.content.services,

              items: state.content.services.items.filter(
                (item) => item.id !== itemId,
              ),
            },
          },
        })),

      addTestimonial: (testimonial) =>
        set((state) => ({
          content: {
            ...state.content,

            testimonials: {
              ...state.content.testimonials,

              items: [
                ...state.content.testimonials.items,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  role: "",
                  company: "",
                  quote: "",
                  avatarUrl: "",
                  rating: 5,
                  ...testimonial,
                },
              ],
            },
          },
        })),

      updateTestimonial: (testimonialId, values) =>
        set((state) => ({
          content: {
            ...state.content,

            testimonials: {
              ...state.content.testimonials,

              items: state.content.testimonials.items.map(
                (testimonial) =>
                  testimonial.id === testimonialId
                    ? {
                        ...testimonial,
                        ...values,
                      }
                    : testimonial,
              ),
            },
          },
        })),

      removeTestimonial: (testimonialId) =>
        set((state) => ({
          content: {
            ...state.content,

            testimonials: {
              ...state.content.testimonials,

              items: state.content.testimonials.items.filter(
                (testimonial) =>
                  testimonial.id !== testimonialId,
              ),
            },
          },
        })),

      setPages: (pages) => set({ pages }),

      setHomeSections: (homeSections) => set({ homeSections }),

      addPage: (page) =>
        set((state) => {
          const id =
            page.id ||
            `${page.slug || "page"}-${Date.now()}`;

          return {
            pages: [
              ...state.pages,
              {
                id,
                title: "New Page",
                slug: `page-${state.pages.length + 1}`,
                type: "page",
                enabled: true,
                ...page,
              },
            ],
          };
        }),

      updatePage: (pageId, values) =>
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  ...values,
                }
              : page,
          ),
        })),

      removePage: (pageId) =>
        set((state) => ({
          pages: state.pages.filter(
            (page) =>
              page.id !== pageId || page.type === "home",
          ),
        })),

      togglePage: (pageId) =>
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  enabled: !page.enabled,
                }
              : page,
          ),
        })),

      updateSocial: (values) =>
        set((state) => ({
          social: {
            ...state.social,
            ...values,
          },
        })),

      updateSeo: (values) =>
        set((state) => ({
          seo: {
            ...state.seo,
            ...values,
          },
        })),

      updatePreview: (values) =>
        set((state) => ({
          preview: {
            ...state.preview,
            ...values,
          },
        })),

      setCurrentStep: (currentStep) =>
        set((state) => ({
          builder: {
            ...state.builder,
            currentStep,
          },
        })),

      completeStep: (stepNumber) =>
        set((state) => {
          const completedSteps =
            state.builder.completedSteps.includes(stepNumber)
              ? state.builder.completedSteps
              : [
                  ...state.builder.completedSteps,
                  stepNumber,
                ];

          return {
            builder: {
              ...state.builder,
              currentStep: stepNumber + 1,
              completedSteps,
              error: "",
            },
          };
        }),

      setBuilderStatus: (values) =>
        set((state) => ({
          builder: {
            ...state.builder,
            ...values,
          },
        })),

      setGenerationResult: (values) =>
        set((state) => ({
          generation: {
            ...state.generation,
            ...values,
          },
        })),

      clearGenerationResult: () =>
        set({
          generation: createDefaultState().generation,
        }),

      initializeProject: () =>
        set((state) => ({
          project: {
            ...state.project,
            id:
              state.project.id || crypto.randomUUID(),
            name:
              state.project.name ||
              state.business.companyName ||
              "Untitled Website",
            status: "draft",
            createdAt:
              state.project.createdAt ||
              new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        })),

      populateContentFromBusiness: () =>
        set((state) => ({
          content: {
            ...state.content,

            hero: {
              ...state.content.hero,
              heading:
                state.content.hero.heading ||
                state.business.tagline ||
                `Welcome to ${
                  state.business.companyName ||
                  "Our Website"
                }`,
              description:
                state.content.hero.description ||
                state.business.description,
            },

            services: {
              ...state.content.services,
              description:
                state.content.services.description ||
                state.business.services,
            },

            about: {
              ...state.content.about,
              heading:
                state.content.about.heading ||
                `About ${
                  state.business.companyName ||
                  "Our Company"
                }`,
              description:
                state.content.about.description ||
                state.business.description,
            },

            cta: {
              ...state.content.cta,
              heading:
                state.content.cta.heading ||
                `Ready to work with ${
                  state.business.companyName ||
                  "us"
                }?`,
            },
          },

          seo: {
            ...state.seo,
            siteTitle:
              state.seo.siteTitle ||
              state.business.companyName,
            metaDescription:
              state.seo.metaDescription ||
              state.business.description,
          },
        })),

      getWordPressConfiguration: () => {
        const state = get();

        return {
          schemaVersion: state.schemaVersion,

          project: {
            id: state.project.id,
            name:
              state.project.name ||
              state.business.companyName,
          },

          template: {
            id: state.templateId,
            profile: state.templateProfile || state.templateId || "modern",
            category: state.category,
          },

          templateId: state.templateId,
          templateProfile: state.templateProfile || state.templateId || "modern",
          homeSections: state.homeSections,

          business: state.business,

          branding: {
            logoUrl:
              state.logo.attachmentUrl ||
              state.logo.previewUrl,

            primaryColor:
              state.branding.colors.primary,

            secondaryColor:
              state.branding.colors.secondary,

            accentColor:
              state.branding.colors.accent,

            backgroundColor:
              state.branding.colors.background,

            surfaceColor:
              state.branding.colors.surface,

            textColor:
              state.branding.colors.text,

            headingFont:
              state.branding.headingFont,

            bodyFont:
              state.branding.bodyFont,

            buttonRadius:
              state.branding.radius,

            containerWidth:
              state.branding.containerWidth,

            headerStyle:
              state.branding.headerStyle,

            footerStyle:
              state.branding.footerStyle,
          },

          content: {
            hero: {
              enabled: state.content.hero.enabled,
              eyebrow: state.content.hero.eyebrow,
              heading: state.content.hero.heading,
              description:
                state.content.hero.description,
              button_text:
                state.content.hero.buttonText,
              button_url:
                state.content.hero.buttonUrl,
              secondary_button_text:
                state.content.hero.secondaryButtonText,
              secondary_button_url:
                state.content.hero.secondaryButtonUrl,
              image: state.content.hero.imageUrl,
              image_alt:
                state.content.hero.imageAlt,
            },

            services: state.content.services,
            about: state.content.about,
            testimonials:
              state.content.testimonials,

            cta: {
              enabled: state.content.cta.enabled,
              eyebrow: state.content.cta.eyebrow,
              heading: state.content.cta.heading,
              description:
                state.content.cta.description,
              button_text:
                state.content.cta.buttonText,
              button_url:
                state.content.cta.buttonUrl,
            },
          },

          pages: state.pages
            .filter((page) => page.enabled)
            .map((page) => ({
              title: page.title,
              slug: page.slug,
              type: page.type,
              content: page.content || "",
            })),

          social: state.social,

          seo: state.seo,
        };
      },

      resetBuilder: () =>
        set({
          ...createDefaultState(),
        }),
    }),

    {
      name: "oneclick-builder-data",

      version: 1,

      storage: createJSONStorage(
        () => localStorage,
      ),

      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        project: state.project,
        category: state.category,
        templateId: state.templateId,
        templateProfile: state.templateProfile,
        homeSections: state.homeSections,
        business: state.business,
        logo: state.logo,
        branding: state.branding,
        content: state.content,
        pages: state.pages,
        social: state.social,
        seo: state.seo,
        preview: state.preview,
        builder: state.builder,
        generation: state.generation,
      }),

      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,

        templateProfile: persistedState?.templateProfile || currentState.templateProfile,
        homeSections: Array.isArray(persistedState?.homeSections) ? persistedState.homeSections : currentState.homeSections,

        project: {
          ...currentState.project,
          ...persistedState?.project,
        },

        business: {
          ...currentState.business,
          ...persistedState?.business,
        },

        logo: {
          ...currentState.logo,
          ...persistedState?.logo,
        },

        branding: {
          ...currentState.branding,
          ...persistedState?.branding,

          colors: {
            ...currentState.branding.colors,
            ...persistedState?.branding?.colors,
          },
        },

        content: {
          ...currentState.content,
          ...persistedState?.content,

          hero: {
            ...currentState.content.hero,
            ...persistedState?.content?.hero,
          },

          services: {
            ...currentState.content.services,
            ...persistedState?.content?.services,
          },

          about: {
            ...currentState.content.about,
            ...persistedState?.content?.about,
          },

          testimonials: {
            ...currentState.content.testimonials,
            ...persistedState?.content?.testimonials,
          },

          cta: {
            ...currentState.content.cta,
            ...persistedState?.content?.cta,
          },
        },

        social: {
          ...currentState.social,
          ...persistedState?.social,
        },

        seo: {
          ...currentState.seo,
          ...persistedState?.seo,
        },

        preview: {
          ...currentState.preview,
          ...persistedState?.preview,
        },

        builder: {
          ...currentState.builder,
          ...persistedState?.builder,
        },

        generation: {
          ...currentState.generation,
          ...persistedState?.generation,
        },
      }),
    },
  ),
);