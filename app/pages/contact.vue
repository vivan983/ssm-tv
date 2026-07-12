<!-- =====================================================================
     TWANDIKIRE — Official SSM TV Contact Page
     Sections: Hero → Info Cards → Form + Sidebar → Advertise CTA
              → Social → FAQ
     ===================================================================== -->
<template>
  <div class="contact-page">
    <!-- ================================================================ -->
    <!-- 1. HERO                                                            -->
    <!-- ================================================================ -->
    <section class="contact-hero">
      <h1 class="contact-hero-title">Twandikire</h1>
      <p class="contact-hero-sub">
        SSM TV irahora yiteguye kwakira ibitekerezo, amakuru, ibibazo, ndetse n'ubufatanye
        bwawe. Waba uri umusomyi, umuyobozi w'ikigo, cyangwa urimo gushaka kwamamaza —
        twandikire. Turakwakira neza.
      </p>
    </section>

    <!-- ================================================================ -->
    <!-- 2. CONTACT INFO CARDS                                              -->
    <!-- ================================================================ -->
    <section class="contact-section">
      <div class="contact-info-grid">
        <!-- Email -->
        <div class="contact-info-card">
          <div class="contact-info-icon contact-info-icon--green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="contact-info-title">Imeyili Rusange</h3>
          <a href="mailto:Umubyeyidenise555@gmail.com" class="contact-info-link">Umubyeyidenise555@gmail.com</a>
        </div>

        <!-- Phone -->
        <div class="contact-info-card">
          <div class="contact-info-icon contact-info-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </div>
          <h3 class="contact-info-title">Terefone</h3>
          <a href="tel:0781909250" class="contact-info-link">0781909250</a>
        </div>

        <!-- Location -->
        <div class="contact-info-card">
          <div class="contact-info-icon contact-info-icon--red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <h3 class="contact-info-title">Aho Turi</h3>
          <p class="contact-info-text">Kigali, Rwanda</p>
        </div>

        <!-- Hours -->
        <div class="contact-info-card">
          <div class="contact-info-icon contact-info-icon--amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="contact-info-title">Amasaha y'Akazi</h3>
          <p class="contact-info-text">Kuwa mbere - Kuwa gatanu</p>
          <p class="contact-info-sub">08:00 – 18:00</p>
        </div>
      </div>
    </section>

    <!-- ================================================================ -->
    <!-- 3. FORM + SIDEBAR                                                 -->
    <!-- ================================================================ -->
    <section class="contact-section">
      <div class="contact-main-grid">
        <!-- FORM -->
        <div class="contact-form-wrap">
          <h2 class="contact-section-title">Ohereza Ubutumwa</h2>

          <!-- Success -->
          <div v-if="success" class="contact-success">
            <div class="contact-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="contact-success-title">Ubutumwa bwawe bwakiriwe!</h3>
            <p class="contact-success-text">Turakumenyesha binyuze kuri email yawe mu gihe gito. Urakoze kutwandikira.</p>
            <BaseButton variant="outline" size="sm" class="mt-4" @click="resetForm">
              Andika Ubundi Butumwa
            </BaseButton>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="handleSubmit" class="contact-form">
            <div class="contact-form-grid">
              <BaseInput
                v-model="form.name"
                :label="$t('contact.name')"
                :placeholder="$t('contact.namePlaceholder')"
                :required="true"
                :error="errors.name"
              />
              <BaseInput
                v-model="form.email"
                type="email"
                :label="$t('contact.email')"
                :placeholder="$t('contact.emailPlaceholder')"
                :required="true"
                :error="errors.email"
              />
            </div>
            <BaseInput
              v-model="form.phone"
              type="tel"
              label="Telefoni (Ubushake)"
              placeholder="+250 7XX XXX XXX"
            />
            <BaseInput
              v-model="form.subject"
              :label="$t('contact.subject')"
              :placeholder="$t('contact.subjectPlaceholder')"
            />
            <BaseTextarea
              v-model="form.message"
              :label="$t('contact.message')"
              :placeholder="$t('contact.messagePlaceholder')"
              :required="true"
              :rows="6"
              :error="errors.message"
            />

            <div v-if="submitError" class="contact-form-error">
              <p>{{ submitError }}</p>
            </div>

            <BaseButton type="submit" :loading="submitting" size="lg">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              {{ submitting ? 'Biroherezwa...' : 'Ohereza Ubutumwa' }}
            </BaseButton>
          </form>
        </div>

        <!-- SIDEBAR -->
        <aside class="contact-sidebar">
          <!-- Newsroom Contact -->
          <div class="contact-sidebar-card">
            <h3 class="contact-sidebar-title">Ibiro by\'Itangazamakuru</h3>
            <p class="contact-sidebar-text">
              Niba ufite inkuru, amakuru ashobora gutanganzwa, cyangwa ushaka ko
              itangazamakuru ryacu rikurikirana ikintu runaka — twandikire kuri:
            </p>
            <a href="mailto:Umubyeyidenise555@gmail.com" class="contact-sidebar-link">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Umubyeyidenise555@gmail.com
            </a>
          </div>

          <!-- Advertising Contact -->
          <div class="contact-sidebar-card contact-sidebar-card--accent">
            <h3 class="contact-sidebar-title">Kwamamaza</h3>
            <p class="contact-sidebar-text">
              Shyira ubucuruzi bwawe imbere y\'abakurikira amakuru ya SSM TV.
              Twandikire tukumenyereze uko wamamaza nifite.
            </p>
            <a href="mailto:Umubyeyidenise555@gmail.com" class="contact-sidebar-link">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Umubyeyidenise555@gmail.com
            </a>
          </div>

          <!-- Follow Us -->
          <div class="contact-sidebar-card">
            <h3 class="contact-sidebar-title">Dukurikire</h3>
            <div class="contact-social-row">
              <a v-for="s in socialLinks" :key="s.name" :href="s.url" target="_blank" rel="noopener"
                 class="contact-social-btn" :class="s.bg" :aria-label="s.name" :title="s.name">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="s.icon"/>
                </svg>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- ================================================================ -->
    <!-- 4. ADVERTISING CTA                                                -->
    <!-- ================================================================ -->
    <section class="contact-section">
      <div class="contact-advertise">
        <div class="contact-advertise-content">
          <h2 class="contact-advertise-title">Kwamamaza kuri SSM TV</h2>
          <p class="contact-advertise-text">
            Kwinjiza ubucuruzi bwawe mu itangazamakuru. Menyekanisha ibicuruzwa
            cyangwa serivisi zawe ku rubuga rwacu no ku muyoboro wa YouTube.
            Uzagerayo ku basomyi benshi bo mu Rwanda no hanze yarwo.
          </p>
          <div class="contact-advertise-actions">
            <a href="mailto:Umubyeyidenise555@gmail.com" class="contact-advertise-btn">
              Twandikire ku Bijyanye no Kwamamaza
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================ -->
    <!-- 5. FAQ                                                             -->
    <!-- ================================================================ -->
    <section class="contact-section">
      <h2 class="contact-section-title contact-section-title--center">Ibibazo Bikunze Kubazwa</h2>
      <div class="contact-faq">
        <div v-for="(faq, i) in faqs" :key="i" class="contact-faq-item">
          <button class="contact-faq-q" @click="openFaq = openFaq === i ? -1 : i">
            <span>{{ faq.q }}</span>
            <svg class="contact-faq-chevron" :class="{ 'rotate-180': openFaq === i }"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-if="openFaq === i" class="contact-faq-a">
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useContactStore } from '~/stores/contact'

const { t } = useI18n()
const contactStore = useContactStore()

const form = reactive({ name: '', email: '', phone: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const submitError = ref('')
const openFaq = ref(-1)

const submitting = computed(() => contactStore.submitting)
const success = computed(() => contactStore.success)

const socialLinks = [
  { name: 'YouTube', url: 'https://www.youtube.com/@THESTRUGGLESOFSINGLESMOTHERS', bg: 'hover:bg-red-600 hover:text-white', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { name: 'Twitter', url: 'https://twitter.com/ssmtv', bg: 'hover:bg-blue-500 hover:text-white', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { name: 'Instagram', url: 'https://www.instagram.com/nolinda_belle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', bg: 'hover:bg-pink-600 hover:text-white', icon: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m.2 2A3.6 3.6 0 004.4 8v8a3.6 3.6 0 003.6 3.6h8a3.6 3.6 0 003.6-3.6V8A3.6 3.6 0 0016 4.4H8m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z' },
]

const faqs = [
  { q: 'Nsohoza nte inkuru cyangwa itangazo?', a: 'Ohereza ubutumwa ukoresheje iyi form, cyangwa wandikire kuri Umubyeyidenise555@gmail.com. Ishyirahamwe ry\'itangazamakuru ryacu rizasuzuma ubusabe bwawe.' },
  { q: 'Nshobora gute kwamamaza kuri SSM TV?', a: 'Twandikire kuri Umubyeyidenise555@gmail.com. Tuzakumenyeshereza amahitamo yose yo kwamamaza — kurubuga, kuri YouTube, cyangwa byombi.' },
  { q: 'Nzakosora nte ikosa riri mu nkuru?', a: 'Niba ubonye ikosa, twandikire kuri Umubyeyidenise555@gmail.com ukoresheje ingingo "Ikosora". Tuzasuzuma kandi dukosore vuba.' },
  { q: 'Mwashobora gufasha mu bushakashatsi cyangwa ikiganiro?', a: 'Yego. Abanyamakuru bacu barakora ubushakashatsi no gukora ibiganiro. Twandikire kuri Umubyeyidenise555@gmail.com.' },
  { q: 'Ni ndehe wandikira niba nshaka kuba umukorerabushake?', a: 'Ohereza ubutumwa bwawe ukoresheje iyi form, tugaragaze ubushobozi bwawe n\'ubushake. Tuzakumenyesha iyo hagarutse amahirwe.' },
]

function validate() {
  errors.name = ''; errors.email = ''; errors.message = ''
  let valid = true
  if (form.name.length < 2) { errors.name = t('contact.nameTooShort'); valid = false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = t('contact.invalidEmail'); valid = false }
  if (form.message.length < 10) { errors.message = t('contact.messageTooShort'); valid = false }
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  submitError.value = ''
  const result = await contactStore.submit({
    name: form.name, email: form.email,
    subject: form.subject || undefined, message: form.message,
  })
  if (!result) submitError.value = contactStore.error || t('contact.error')
}

function resetForm() {
  contactStore.reset()
  form.name = ''; form.email = ''; form.phone = ''; form.subject = ''; form.message = ''
}

useHead({ title: t('seo.contact.title'), meta: [{ name: 'description', content: t('seo.contact.description') }] })
definePageMeta({ layout: 'default' })
</script>

<style scoped>
/* ===================================================================
   CONTACT PAGE
   =================================================================== */
.contact-page { max-width: 1280px; margin: 0 auto; padding: 0 16px 64px 16px; }
@media (min-width: 768px) { .contact-page { padding: 0 24px 72px 24px; } }
@media (min-width: 1024px) { .contact-page { padding: 0 32px 80px 32px; } }

/* ---- Hero ---- */
.contact-hero { padding: 48px 0 36px 0; text-align: center; max-width: 640px; margin: 0 auto; }
.contact-hero-title { font-size: 2rem; font-weight: 800; color: #141414; margin: 0 0 12px 0; letter-spacing: -0.02em; }
@media (min-width: 768px) { .contact-hero-title { font-size: 2.5rem; } }
.contact-hero-sub { font-size: 1rem; line-height: 1.65; color: #545658; margin: 0; }

/* ---- Section ---- */
.contact-section { margin-bottom: 56px; }
.contact-section-title { font-size: 1.25rem; font-weight: 800; color: #141414; margin: 0 0 24px 0; }
.contact-section-title--center { text-align: center; }

/* ---- Info Cards Grid ---- */
.contact-info-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 600px) { .contact-info-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 900px) { .contact-info-grid { grid-template-columns: repeat(4, 1fr); } }

.contact-info-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; transition: box-shadow 0.2s ease; }
.contact-info-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

.contact-info-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; }
.contact-info-icon svg { width: 20px; height: 20px; }
.contact-info-icon--green { background: #f0fdf4; color: #16a34a; }
.contact-info-icon--blue  { background: #eff6ff; color: #2563eb; }
.contact-info-icon--red   { background: #fef2f2; color: #dc2626; }
.contact-info-icon--amber { background: #fffbeb; color: #d97706; }

.contact-info-title { font-size: 0.8125rem; font-weight: 700; color: #141414; margin: 0 0 4px 0; }
.contact-info-link { font-size: 0.875rem; font-weight: 600; color: #16a34a; text-decoration: none; }
.contact-info-link:hover { text-decoration: underline; }
.contact-info-text { font-size: 0.875rem; color: #545658; margin: 0; }
.contact-info-sub { font-size: 0.8125rem; color: #9ca3af; margin: 2px 0 0 0; }

/* ---- Main Grid (Form + Sidebar) ---- */
.contact-main-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
@media (min-width: 900px) { .contact-main-grid { grid-template-columns: 1fr 320px; } }

/* ---- Form ---- */
.contact-form-wrap { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 28px; }
.contact-form { display: flex; flex-direction: column; gap: 18px; }
.contact-form-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
@media (min-width: 640px) { .contact-form-grid { grid-template-columns: 1fr 1fr; } }
.contact-form-error { padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; }
.contact-form-error p { font-size: 0.8125rem; color: #b91c1c; margin: 0; }

/* ---- Success ---- */
.contact-success { text-align: center; padding: 32px 16px; }
.contact-success-icon { width: 56px; height: 56px; border-radius: 50%; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; }
.contact-success-icon svg { width: 28px; height: 28px; }
.contact-success-title { font-size: 1.125rem; font-weight: 800; color: #141414; margin: 0 0 6px 0; }
.contact-success-text { font-size: 0.875rem; color: #545658; margin: 0; max-width: 320px; margin: 0 auto; }

/* ---- Sidebar ---- */
.contact-sidebar { display: flex; flex-direction: column; gap: 16px; }

.contact-sidebar-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
.contact-sidebar-card--accent { border-color: #bbf7d0; background: #f9fefb; }
.contact-sidebar-title { font-size: 0.9375rem; font-weight: 700; color: #141414; margin: 0 0 8px 0; }
.contact-sidebar-text { font-size: 0.8125rem; line-height: 1.5; color: #545658; margin: 0 0 12px 0; }
.contact-sidebar-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; font-weight: 600; color: #16a34a; text-decoration: none; }
.contact-sidebar-link:hover { text-decoration: underline; }

.contact-social-row { display: flex; gap: 8px; }
.contact-social-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; color: #6b7280; transition: all 0.15s ease; }
.contact-social-btn:hover { border-color: transparent; }

/* ---- Advertising CTA ---- */
.contact-advertise { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1px solid #bbf7d0; border-radius: 12px; padding: 36px 28px; text-align: center; }
.contact-advertise-content { max-width: 560px; margin: 0 auto; }
.contact-advertise-title { font-size: 1.375rem; font-weight: 800; color: #141414; margin: 0 0 10px 0; }
.contact-advertise-text { font-size: 0.9375rem; line-height: 1.6; color: #545658; margin: 0 0 20px 0; }
.contact-advertise-actions { display: flex; justify-content: center; }
.contact-advertise-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #16a34a; color: #fff; font-size: 0.9375rem; font-weight: 700; border-radius: 8px; text-decoration: none; transition: all 0.2s ease; }
.contact-advertise-btn:hover { background: #15803d; box-shadow: 0 2px 12px rgba(22,163,74,0.3); transform: translateY(-1px); }
.contact-advertise-btn svg { transition: transform 0.2s ease; }
.contact-advertise-btn:hover svg { transform: translateX(3px); }

/* ---- FAQ ---- */
.contact-faq { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 2px; }
.contact-faq-item { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.contact-faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; font-size: 0.875rem; font-weight: 600; color: #141414; background: #fff; border: none; cursor: pointer; text-align: left; transition: background 0.15s ease; }
.contact-faq-q:hover { background: #f9fafb; }
.contact-faq-chevron { width: 16px; height: 16px; flex-shrink: 0; color: #9ca3af; transition: transform 0.2s ease; }
.contact-faq-a { padding: 0 20px 18px 20px; }
.contact-faq-a p { font-size: 0.8125rem; line-height: 1.6; color: #545658; margin: 0; }
</style>
