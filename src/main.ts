import './style.css'
import { createIcons, CheckCircle, ShieldCheck, ArrowRight, ArrowLeft, Building, Home, MapPin, User, Phone, Mail, Check, CheckCircle2, Zap } from 'lucide';

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
      Zap
    }
  });
}

initIcons();

// --- Multi-Step Form Logic ---

let currentStep = 1;

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
      numberSpan.className = 'w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center transition-all shadow-[0_0_12px_rgba(20,184,166,0.5)]';
      textSpan.className = 'hidden sm:inline text-teal-300 transition-colors drop-shadow-md';
      if (line) line.className = 'flex-grow h-px bg-teal-500/30 mx-3 transition-colors';
    } else if (i === step) {
      // Current
      numberSpan.className = 'w-6 h-6 rounded-full bg-teal-400 text-[#0b1121] flex items-center justify-center transition-all shadow-[0_0_20px_rgba(45,212,191,0.6)] font-bold';
      textSpan.className = 'hidden sm:inline text-white font-bold transition-colors drop-shadow-md';
      if (line) line.className = 'flex-grow h-px bg-white/10 mx-3 transition-colors';
    } else {
      // Future
      numberSpan.className = 'w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white/40 flex items-center justify-center transition-all';
      textSpan.className = 'hidden sm:inline text-white/40 transition-colors';
      if (line) line.className = 'flex-grow h-px bg-white/10 mx-3 transition-colors';
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
    currentStep = targetStep as number;
    updateProgress(currentStep);
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

propertyBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const val = (e.currentTarget as HTMLElement).getAttribute('data-value');
    if (val) {
      inputPropertyType.value = val;
      if (val === 'Business') {
        businessNameGroup?.classList.remove('hidden');
        inputBusiness.required = true;
      } else {
        businessNameGroup?.classList.add('hidden');
        inputBusiness.required = false;
        inputBusiness.value = '';
      }
      goToStep(2);
    }
  });
});

// Step 2: Goal
const goalBtns = document.querySelectorAll('.goal-btn');
const inputGoal = document.getElementById('input-goal') as HTMLInputElement;

goalBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const val = (e.currentTarget as HTMLElement).getAttribute('data-value');
    if (val) {
      inputGoal.value = val;
      goToStep(3);
    }
  });
});

// Step 3: Spend
const spendBtns = document.querySelectorAll('.spend-btn');
const inputSpend = document.getElementById('input-spend') as HTMLInputElement;

spendBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const val = (e.currentTarget as HTMLElement).getAttribute('data-value');
    if (val) {
      inputSpend.value = val;
      goToStep(4);
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

form.addEventListener('submit', () => {
  (window as any).submitted = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>PROCESSING...</span>
  `;
  submitBtn.disabled = true;
});

(window as any).showSuccessStep = () => {
  goToStep('success');
};

// --- Social Proof Overlay Pill Logic ---
function initSocialProofPill() {
  const socialProofData = [
    { name: 'Tomas', savings: '85', location: 'Liverpool' },
    { name: 'Kairo Studio', savings: '120', location: 'London' },
    { name: 'Robert', savings: '480', location: 'Derby' },
    { name: 'Alex (Commercial)', savings: '5200', location: 'Glasgow' }
  ];

  let currentProofIndex = 0;
  const pillElement = document.getElementById('social-proof-pill');
  const textElement = document.getElementById('social-proof-text');

  if (!pillElement || !textElement) return;

  function cycleProof() {
    // 1. Hide current pill
    pillElement!.classList.remove('translate-y-0', 'opacity-100');
    pillElement!.classList.add('translate-y-10', 'opacity-0');

    // 2. Wait for fade out animation (500ms based on duration-500 class)
    setTimeout(() => {
      const data = socialProofData[currentProofIndex];
      currentProofIndex = (currentProofIndex + 1) % socialProofData.length;

      textElement!.innerHTML = `<span class="font-bold text-white">${data.name}</span> in ${data.location} saved <span class="text-teal-400 font-bold">£${data.savings}</span> a month.`;

      // 3. Show new pill
      pillElement!.classList.remove('translate-y-10', 'opacity-0');
      pillElement!.classList.add('translate-y-0', 'opacity-100');

      // 4. Schedule next swap in 5 seconds
      setTimeout(cycleProof, 5000);
    }, 500);
  }

  // Initial start
  const initialData = socialProofData[0];
  currentProofIndex = 1;
  textElement!.innerHTML = `<span class="font-bold text-white">${initialData.name}</span> in ${initialData.location} saved <span class="text-teal-400 font-bold">£${initialData.savings}</span> a month.`;
  
  setTimeout(() => {
    pillElement!.classList.remove('translate-y-10', 'opacity-0');
    pillElement!.classList.add('translate-y-0', 'opacity-100');
    
    // Start cycle after 5 seconds
    setTimeout(cycleProof, 5000);
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  initSocialProofPill();
});
