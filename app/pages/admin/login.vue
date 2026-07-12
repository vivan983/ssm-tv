<template>
  <div class="login-page">
    <!-- Logo -->
    <div class="login-logo">
      <img src="/logo-ssm.png" alt="SSM TV" class="login-logo-img" />
    </div>

    <!-- Card -->
    <div class="login-card">
      <!-- Heading -->
      <h1 class="login-heading">
        {{ mode === 'login' ? 'Injira mu Kibaho' : 'Fungura Konti' }}
      </h1>
      <p class="login-subheading">
        {{ mode === 'login' ? 'Ikibaho cy\'itangazamakuru' : 'Saba konti yo kwandika' }}
      </p>

      <!-- Mode tabs -->
      <div class="login-tabs">
        <button
          class="login-tab"
          :class="{ 'login-tab--active': mode === 'login' }"
          @click="switchMode('login')"
        >
          Injira mu Konti
        </button>
        <button
          class="login-tab"
          :class="{ 'login-tab--active': mode === 'signup' }"
          @click="switchMode('signup')"
        >
          Fungura Konti
        </button>
      </div>

      <!-- LOGIN FORM -->
      <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="login-form">
        <BaseInput
          v-model="email"
          type="email"
          :label="'Imeyili'"
          :placeholder="'wandike imeyili yawe'"
          :required="true"
        />

        <BaseInput
          v-model="password"
          type="password"
          :label="'Ijambobanga'"
          :required="true"
        />

        <!-- Forgot password -->
        <p class="login-forgot">
          Wibagiwe ijambobanga?
        </p>

        <!-- Error -->
        <div v-if="error" class="login-alert login-alert--error">
          <p>{{ error }}</p>
          <button
            v-if="isEmailNotConfirmedError && !isRateLimitError"
            type="button"
            class="login-alert-action"
            @click="handleResendConfirmation"
            :disabled="resending"
          >
            {{ resending ? 'Twarongera kohereza...' : 'Ongera kohereza imeyili' }}
          </button>
          <p v-if="isRateLimitError" class="login-alert-hint">
              Wagerageje kenshi. Tegereza akanya wongere ugerageze.
          </p>
        </div>

        <!-- Resend success -->
        <div v-if="resendSuccess" class="login-alert login-alert--success">
          <p>Imeyili yo kwemeza yongeye koherezwa.</p>
        </div>

        <BaseButton type="submit" :loading="loading" full-width>
          {{ loading ? 'Injira...' : 'Injira' }}
        </BaseButton>
      </form>

      <!-- SIGN-UP FORM -->
      <form v-if="mode === 'signup'" @submit.prevent="handleSignUp" class="login-form">
        <BaseInput
          v-model="signupName"
          type="text"
          :label="'Izina ryawe'"
          :placeholder="'Andika izina'"
          :required="true"
        />

        <BaseInput
          v-model="signupEmail"
          type="email"
          :label="'Imeyili'"
          :placeholder="'wandike imeyili yawe'"
          :required="true"
        />

        <BaseInput
          v-model="signupPassword"
          type="password"
          :label="'Ijambobanga'"
          :required="true"
        />
        <p class="login-hint">Nibura inyuguti 6</p>

        <BaseInput
          v-model="signupConfirmPassword"
          type="password"
          :label="'Emeza ijambobanga'"
          :required="true"
        />

        <div v-if="error" class="login-alert login-alert--error">
          <p>{{ error }}</p>
        </div>

        <div v-if="signupSuccess" class="login-alert login-alert--success">
          <p>Konti yafunguwe. Noneho winjire.</p>
        </div>

        <BaseButton type="submit" :loading="loading" full-width>
          {{ loading ? 'Fungura...' : 'Fungura Konti' }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const signupName = ref('')
const signupEmail = ref('')
const signupPassword = ref('')
const signupConfirmPassword = ref('')
const signupSuccess = ref(false)
const error = ref('')
const resending = ref(false)
const resendSuccess = ref(false)
const loading = computed(() => authStore.loading)

const isEmailNotConfirmedError = computed(() =>
  error.value?.toLowerCase().includes('email not confirmed') || false
)
const isRateLimitError = computed(() =>
  error.value?.toLowerCase().includes('rate limit') || false
)

definePageMeta({ layout: 'minimal' })

onMounted(() => {
  if (authStore.isAuthenticated) router.push('/admin')
})

function switchMode(newMode: 'login' | 'signup') {
  mode.value = newMode
  error.value = ''
  signupSuccess.value = false
}

async function handleLogin() {
  error.value = ''
  resendSuccess.value = false
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/admin')
  } else {
    error.value = authStore.loginError || 'Imeyili cyangwa ijambobanga sibyo'
  }
}

async function handleResendConfirmation() {
  resending.value = true
  resendSuccess.value = false
  const success = await authStore.resendConfirmation(email.value)
  resending.value = false
  if (success) {
    resendSuccess.value = true
    error.value = ''
  } else {
    error.value = authStore.loginError || 'Ntibyashobotse kohereza imeyili. Ongera ugerageze.'
  }
}

async function handleSignUp() {
  error.value = ''
  signupSuccess.value = false

  if (!signupName.value.trim()) {
    error.value = 'Izina ni ngombwa'
    return
  }
  if (signupPassword.value.length < 6) {
    error.value = 'Ijambobanga rigomba kuba nyuguti nibura 6'
    return
  }
  if (signupPassword.value !== signupConfirmPassword.value) {
    error.value = 'Ijambobanga ntirisanzwe'
    return
  }

  const success = await authStore.register(signupEmail.value, signupPassword.value, signupName.value.trim())
  if (success) {
    signupSuccess.value = true
    signupName.value = ''
    signupEmail.value = ''
    signupPassword.value = ''
    signupConfirmPassword.value = ''
    setTimeout(() => {
      mode.value = 'login'
      signupSuccess.value = false
      email.value = signupEmail.value || ''
    }, 2000)
  } else {
    error.value = authStore.loginError || 'Ntibyashobotse. Ongera ugerageze.'
  }
}

useHead({ title: mode.value === 'login' ? 'Injira mu Kibaho' : 'Fungura Konti' })
</script>

<style scoped>
/* ---- Page background ---- */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: linear-gradient(180deg, #f9fafb 0%, #f0fdf4 100%);
}

/* ---- Logo ---- */
.login-logo {
  margin-bottom: 28px;
}

.login-logo-img {
  height: 48px;
  width: auto;
}

/* ---- Card ---- */
.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  padding: 28px 24px 24px;
}

/* ---- Heading ---- */
.login-heading {
  font-size: 1.25rem;
  font-weight: 800;
  color: #141414;
  margin: 0 0 4px 0;
  text-align: center;
}

.login-subheading {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 20px 0;
  text-align: center;
}

/* ---- Tabs ---- */
.login-tabs {
  display: flex;
  margin-bottom: 20px;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 3px;
}

.login-tab {
  flex: 1;
  padding: 8px 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.login-tab--active {
  background: #fff;
  color: #141414;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* ---- Form ---- */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ---- Forgot password ---- */
.login-forgot {
  font-size: 0.8125rem;
  color: #16a34a;
  text-align: right;
  margin: -6px 0 0 0;
  font-weight: 600;
}

/* ---- Password hint ---- */
.login-hint {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: -8px 0 0 0;
}

/* ---- Alerts ---- */
.login-alert {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.8125rem;
}

.login-alert--error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.login-alert--success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.login-alert-action {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #b91c1c;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
}

.login-alert-hint {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #b91c1c;
}
</style>
