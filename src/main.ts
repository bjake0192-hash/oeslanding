import './style.css'
import { createIcons, CheckCircle, ShieldCheck, ArrowRight, ArrowLeft, Building, Home, MapPin, User, Phone, Mail, Check, CheckCircle2, Zap, Lock } from 'lucide';

function initIcons() {
  createIcons({
    icons: {
      CheckCircle,
      ShieldCheck,
      ArrowRight,
      ArrowLeft,
      Building,
      Home,
      MapPin,
      User,
      Phone,
      Mail,
      Check,
      CheckCircle2,
      Zap,
      Lock
    }
  });
}

initIcons();

// --- Multi-Step Form Logic ---

let currentStep = 1;

// --- Analytics & Tracking (Local IP Simulation) ---
interface TrackingData {
  ip: string;
  lastActive: string;
  dropoffStep: number;
  data: Record<string, string>;
  events: string[];
}

let userIp = 'unknown';

async function initTracking() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    userIp = data.ip || 'unknown';
    trackEvent('Landing page viewed');
    saveTrackingState();
  } catch (e) {
    console.error('Could not fetch IP for tracking');
  }
}

function trackEvent(eventName: string) {
  if (userIp === 'unknown') return;
  const stats: TrackingData[] = JSON.parse(localStorage.getItem('landing_stats') || '[]');
  let currentSession = stats.find(s => s.ip === userIp);
  
  if (currentSession) {
    if (!currentSession.events) currentSession.events = [];
    if (!currentSession.events.includes(eventName)) {
      currentSession.events.push(eventName);
      localStorage.setItem('landing_stats', JSON.stringify(stats));
    }
  }
}

function saveTrackingState(fieldUpdate?: { key: string, value: string }) {
  if (userIp === 'unknown') return;
  
  const stats: TrackingData[] = JSON.parse(localStorage.getItem('landing_stats') || '[]');
  let currentSession = stats.find(s => s.ip === userIp);
  
  if (!currentSession) {
    currentSession = {
      ip: userIp,
      lastActive: new Date().toISOString(),
      dropoffStep: currentStep,
      data: {},
      events: []
    };
    stats.push(currentSession);
  } else {
    currentSession.lastActive = new Date().toISOString();
    currentSession.dropoffStep = currentStep;
    if (!currentSession.events) currentSession.events = [];
  }

  if (fieldUpdate) {
    currentSession.data[fieldUpdate.key] = fieldUpdate.value;
  }

  // Also grab standard form fields if they have values
  const inputs = ['input-name', 'input-business', 'input-phone', 'input-email', 'input-house', 'input-postcode'];
  inputs.forEach(id => {
    const el = document.getElementById(id) as HTMLInputElement;
    if (el && el.value) {
      currentSession!.data[el.name] = el.value;
    }
  });

  localStorage.setItem('landing_stats', JSON.stringify(stats));
}

// Hook form inputs to save state
document.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  if (target && target.name && target.closest('form')) {
    saveTrackingState({ key: target.name, value: target.value });
  }
});

const steps = [
  document.getElementById('step-1'),
  document.getElementById('step-2'),
  document.getElementById('step-3'),
  document.getElementById('step-4'),
  document.getElementById('step-success')
];

function updateProgress(step: number | 'success') {
  if (step === 'success') return;
  
  for (let i = 1; i <= 4; i++) {
    const indicator = document.getElementById(`step-indicator-${i}`);
    const line = document.getElementById(`line-${i}`);
    
    if (!indicator) continue;
    
    const numberSpan = indicator.children[0] as HTMLElement;
    const textSpan = indicator.children[1] as HTMLElement;
    
    if (i < step) {
      // Completed
      numberSpan.className = 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 text-white flex items-center justify-center transition-all shadow-sm';
      textSpan.className = 'hidden sm:inline text-orange-600 transition-colors drop-shadow-sm';
      if (line) line.className = 'flex-grow h-px bg-orange-500 mx-2 sm:mx-3 transition-colors';
    } else if (i === step) {
      // Current
      numberSpan.className = 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 text-white flex items-center justify-center transition-all shadow-sm ring-4 ring-orange-100';
      textSpan.className = 'hidden sm:inline text-orange-600 font-bold transition-colors drop-shadow-sm';
      if (line) line.className = 'flex-grow h-px bg-gray-200 mx-2 sm:mx-3 transition-colors';
    } else {
      // Future
      numberSpan.className = 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-gray-300 text-gray-400 flex items-center justify-center transition-all';
      textSpan.className = 'hidden sm:inline text-gray-400 transition-colors';
      if (line) line.className = 'flex-grow h-px bg-gray-200 mx-2 sm:mx-3 transition-colors';
    }
  }
}

function goToStep(targetStep: number | 'success') {
  // Hide all
  steps.forEach(s => {
    if (s) {
      s.classList.remove('translate-x-0');
      s.classList.add('-translate-x-full');
      s.style.opacity = '0';
      s.style.pointerEvents = 'none';
    }
  });

  const targetEl = targetStep === 'success' ? steps[4] : steps[(targetStep as number) - 1];
  
  if (targetEl) {
    // Small delay to allow previous step to animate out
    setTimeout(() => {
      targetEl.classList.remove('-translate-x-full', 'translate-x-full');
      targetEl.classList.add('translate-x-0');
      targetEl.style.opacity = '1';
      targetEl.style.pointerEvents = 'auto';
    }, 50);
  }

  if (targetStep !== 'success') {
    if (targetStep > currentStep) {
      if (currentStep === 1) trackEvent('Assessment started');
      trackEvent(`Assessment step ${currentStep} completed`);
    }
    currentStep = targetStep as number;
    updateProgress(currentStep);
    saveTrackingState();
  } else {
    trackEvent(`Assessment step ${currentStep} completed`);
    trackEvent('Assessment submitted successfully');
    currentStep = 5;
    
    // Update savings estimate
    const spendVal = (document.getElementById('input-spend') as HTMLInputElement)?.value;
    const savingsEl = document.getElementById('savings-estimate');
    if (savingsEl) {
      if (!spendVal || spendVal === 'Not sure') {
        savingsEl.innerText = 'Up to 80%';
      } else {
        const matches = spendVal.replace(/£|,/g, '').match(/\d+/g);
        if (matches && matches.length > 0) {
          const maxVal = Math.max(...matches.map(Number));
          const savings = Math.round(maxVal * 0.8);
          savingsEl.innerText = `Up to £${savings.toLocaleString()}`;
        } else {
          savingsEl.innerText = 'Up to 80%';
        }
      }
    }
    
    saveTrackingState();
  }
}

// Initial setup: ensure only step 1 is visible
steps.forEach((s, i) => {
  if (s) {
    if (i === 0) {
      s.classList.add('translate-x-0');
      s.classList.remove('translate-x-full', '-translate-x-full');
      s.style.opacity = '1';
      s.style.pointerEvents = 'auto';
    } else {
      s.classList.add('translate-x-full');
      s.classList.remove('translate-x-0', '-translate-x-full');
      s.style.opacity = '0';
      s.style.pointerEvents = 'none';
    }
  }
});
updateProgress(1);

// Step 1: Property
const propertyBtns = document.querySelectorAll('.property-btn');
const inputPropertyType = document.getElementById('input-property-type') as HTMLInputElement;
const businessNameGroup = document.getElementById('business-name-group');
const inputBusiness = document.getElementById('input-business') as HTMLInputElement;

const step2Options = document.getElementById('step-2-options');
const step3Options = document.getElementById('step-3-options');

function renderOptions(container: HTMLElement | null, options: string[], inputEl: HTMLInputElement, nextStep: number) {
  if (!container) return;
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border-2 border-gray-100 bg-white hover:border-orange-400 hover:bg-orange-50/50 hover:shadow-sm transition-all flex items-center justify-between group';
    btn.innerHTML = `
      <span class="text-gray-700 font-semibold group-hover:text-orange-700 text-sm sm:text-base transition-colors">${opt}</span>
      <div class="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-orange-500 flex items-center justify-center transition-colors shrink-0 ml-4"><div class="w-2.5 h-2.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div></div>
    `;
    btn.addEventListener('click', () => {
      inputEl.value = opt;
      saveTrackingState({ key: inputEl.name, value: opt });
      goToStep(nextStep);
    });
    container.appendChild(btn);
  });
}

propertyBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const val = (e.currentTarget as HTMLElement).getAttribute('data-value');
    if (val) {
      inputPropertyType.value = val;
      saveTrackingState({ key: 'property_type', value: val });
      
      const inputGoal = document.getElementById('input-goal') as HTMLInputElement;
      const inputSpend = document.getElementById('input-spend') as HTMLInputElement;

      if (val === 'My Business') {
        businessNameGroup?.classList.remove('hidden');
        inputBusiness.required = true;
        
        renderOptions(step2Options, [
          "Reduce business energy costs",
          "Explore solar and battery storage",
          "Assess my property's solar potential",
          "I'm not sure yet"
        ], inputGoal, 3);

        renderOptions(step3Options, [
          "Under £500",
          "£500–£1,000",
          "£1,000–£2,500",
          "£2,500–£5,000",
          "£5,000+",
          "Not sure"
        ], inputSpend, 4);
        
      } else {
        businessNameGroup?.classList.add('hidden');
        inputBusiness.required = false;
        inputBusiness.value = '';
        
        renderOptions(step2Options, [
          "Reduce my electricity bills",
          "Explore solar and battery storage",
          "Find out if solar suits my property",
          "I'm not sure yet"
        ], inputGoal, 3);

        renderOptions(step3Options, [
          "Under £100",
          "£100–£150",
          "£150–£200",
          "£200–£300",
          "£300+",
          "Not sure"
        ], inputSpend, 4);
      }
      goToStep(2);
    }
  });
});

// Back Buttons
const backBtns = document.querySelectorAll('.btn-back');
backBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = (e.currentTarget as HTMLElement).getAttribute('data-target');
    if (target) {
      // For backward animation, we should technically slide the current one to the right
      // and the target one from the left.
      const currentEl = steps[currentStep - 1];
      if (currentEl) {
        currentEl.classList.remove('translate-x-0');
        currentEl.classList.add('translate-x-full');
        currentEl.style.opacity = '0';
        currentEl.style.pointerEvents = 'none';
      }

      currentStep = parseInt(target, 10);
      const targetEl = steps[currentStep - 1];
      
      if (targetEl) {
        setTimeout(() => {
          targetEl.classList.remove('-translate-x-full', 'translate-x-full');
          targetEl.classList.add('translate-x-0');
          targetEl.style.opacity = '1';
          targetEl.style.pointerEvents = 'auto';
        }, 50);
      }
      
      updateProgress(currentStep);
    }
  });
});

// Form Submission
const form = document.getElementById('assessment-form') as HTMLFormElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const originalBtnContent = submitBtn.innerHTML;
  
  submitBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>PROCESSING...</span>
  `;
  submitBtn.disabled = true;

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      goToStep('success');
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    alert('Sorry, there was an error submitting your request. Please try again.');
    submitBtn.innerHTML = originalBtnContent;
    submitBtn.disabled = false;
  }
});

// --- Social Proof Overlay Pill Logic ---
// Disabled per request
// function initSocialProofPill() { ... }

// --- Staff Dashboard Logic ---
function initStaffDashboard() {
  const staffBtn = document.getElementById('staff-btn');
  const staffModal = document.getElementById('staff-modal');
  const closeStaff = document.getElementById('close-staff');
  const staffContent = document.getElementById('staff-content');

  if (!staffBtn || !staffModal || !closeStaff || !staffContent) return;

  staffBtn.addEventListener('click', (e) => {
    e.preventDefault();
    staffModal.classList.remove('hidden');
    renderPasswordPrompt();
  });

  closeStaff.addEventListener('click', () => {
    staffModal.classList.add('hidden');
  });

  function renderPasswordPrompt() {
    staffContent!.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <i data-lucide="lock" class="w-8 h-8 text-gray-500"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Staff Access Restricted</h3>
        <p class="text-gray-500 mb-6 text-sm text-center">Please enter the admin password<br>to view visitor analytics.</p>
        <form id="password-form" class="w-full max-w-xs flex flex-col gap-3">
          <input type="password" id="staff-password" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-center tracking-widest font-mono bg-gray-50 focus:bg-white" placeholder="••••••••" required>
          <p id="password-error" class="text-red-500 text-xs font-medium text-center hidden">Incorrect password. Please try again.</p>
          <button type="submit" class="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
            <span>Unlock Dashboard</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </form>
      </div>
    `;
    initIcons();
    
    const passForm = document.getElementById('password-form');
    const passInput = document.getElementById('staff-password') as HTMLInputElement;
    const passError = document.getElementById('password-error');
    
    setTimeout(() => passInput?.focus(), 100);
    
    passForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (passInput.value === 'admin123') {
        renderStaffData();
      } else {
        passError?.classList.remove('hidden');
        passInput.value = '';
        passInput.focus();
        passInput.classList.add('border-red-300', 'focus:border-red-500', 'focus:ring-red-500/10');
        passInput.classList.remove('focus:border-orange-500', 'focus:ring-orange-500/10');
      }
    });
  }

  function renderStaffData() {
    const stats: TrackingData[] = JSON.parse(localStorage.getItem('landing_stats') || '[]');
    
    if (stats.length === 0) {
      staffContent!.innerHTML = '<p class="text-gray-500">No visitor data recorded yet.</p>';
      return;
    }

    // Sort by most recent
    stats.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

    let html = `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-700">
          <thead class="bg-gray-100 text-gray-900">
            <tr>
              <th class="px-4 py-2 rounded-tl-lg">IP / Date</th>
              <th class="px-4 py-2">Dropoff Step</th>
              <th class="px-4 py-2">Events</th>
              <th class="px-4 py-2 rounded-tr-lg">Captured Data</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
    `;

    stats.forEach(s => {
      const date = new Date(s.lastActive).toLocaleString();
      let dataHtml = '';
      for (const [k, v] of Object.entries(s.data)) {
        dataHtml += `<div class="mb-1"><span class="font-semibold text-orange-600">${k}:</span> ${v}</div>`;
      }
      
      let eventsHtml = '';
      if (s.events && s.events.length > 0) {
        s.events.forEach(e => {
          eventsHtml += `<div class="mb-1 text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded inline-block whitespace-nowrap">${e}</div><br>`;
        });
      }
      
      html += `
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-3 whitespace-nowrap">
            <div class="font-bold text-gray-900">${s.ip}</div>
            <div class="text-xs text-gray-500">${date}</div>
          </td>
          <td class="px-4 py-3">
            <span class="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">Step ${s.dropoffStep}</span>
          </td>
          <td class="px-4 py-3">
            ${eventsHtml || '-'}
          </td>
          <td class="px-4 py-3">
            ${dataHtml || '<span class="text-gray-400 italic">No fields filled</span>'}
          </td>
        </tr>
      `;
    });

    html += `</tbody></table></div>`;
    staffContent!.innerHTML = html;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTracking();
  initStaffDashboard();
  // initSocialProofPill();
});
