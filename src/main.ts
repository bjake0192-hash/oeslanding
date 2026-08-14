import './style.css'
import { createIcons, CheckCircle, Zap, Shield, Leaf, Wrench, ThumbsUp, MessageSquare, ClipboardCheck, FileText, Sun, Clock, Lock, User, Building, Phone, Mail, MapPin, ChevronDown, ArrowRight, Home } from 'lucide';

function initIcons() {
  createIcons({
    icons: {
      CheckCircle,
      Zap,
      Shield,
      Leaf,
      Wrench,
      ThumbsUp,
      MessageSquare,
      ClipboardCheck,
      FileText,
      Sun,
      Clock,
      Lock,
      User,
      Building,
      Phone,
      Mail,
      MapPin,
      ChevronDown,
      ArrowRight,
      Home
    }
  });
}

initIcons();

// --- Segment State Management ---

type Mode = 'commercial' | 'residential';
let currentMode: Mode = 'commercial';

const content = {
  commercial: {
    bg: '/hero-bg.jpg',
    title: 'Slash Your Business Energy Bills with <span class="text-green-500">Solar.</span>',
    subtitle: 'At Open Energy Services, we help UK businesses cut energy costs with bespoke solar solutions and end-to-end project management.',
    businessPlaceholder: 'Business Name',
    businessIcon: 'building',
    spendOptions: `
      <option value="" disabled selected>Estimated Monthly Electricity Spend</option>
      <option value="under_500">Under £500</option>
      <option value="500_1000">£500 - £1,000</option>
      <option value="1000_5000">£1,000 - £5,000</option>
      <option value="over_5000">Over £5,000</option>
    `,
    whyTitle: 'Why Businesses Choose OES',
    step1Desc: 'We learn about your business and energy goals.',
  },
  residential: {
    bg: '/hero-bg-residential.jpg',
    title: 'Slash Your Home Energy Bills with <span class="text-green-500">Solar.</span>',
    subtitle: 'At Open Energy Services, we help UK homeowners cut energy costs with bespoke solar solutions and seamless installation.',
    businessPlaceholder: 'Property Type (e.g. Detached, Semi)',
    businessIcon: 'home',
    spendOptions: `
      <option value="" disabled selected>Estimated Monthly Electricity Spend</option>
      <option value="under_100">Under £100</option>
      <option value="100_200">£100 - £200</option>
      <option value="200_300">£200 - £300</option>
      <option value="over_300">Over £300</option>
    `,
    whyTitle: 'Why Homeowners Choose OES',
    step1Desc: 'We learn about your home and energy goals.',
  }
};

const btnCommercial = document.getElementById('btn-commercial');
const btnResidential = document.getElementById('btn-residential');

function setMode(mode: Mode) {
  if (currentMode === mode) return;
  currentMode = mode;
  
  // Update buttons
  if (mode === 'commercial') {
    btnCommercial?.classList.replace('bg-transparent', 'bg-green-500');
    btnCommercial?.classList.replace('text-slate-300', 'text-slate-900');
    btnCommercial?.classList.add('shadow-sm');
    
    btnResidential?.classList.replace('bg-green-500', 'bg-transparent');
    btnResidential?.classList.replace('text-slate-900', 'text-slate-300');
    btnResidential?.classList.remove('shadow-sm');
  } else {
    btnResidential?.classList.replace('bg-transparent', 'bg-green-500');
    btnResidential?.classList.replace('text-slate-300', 'text-slate-900');
    btnResidential?.classList.add('shadow-sm');
    
    btnCommercial?.classList.replace('bg-green-500', 'bg-transparent');
    btnCommercial?.classList.replace('text-slate-900', 'text-slate-300');
    btnCommercial?.classList.remove('shadow-sm');
  }

  // Update content
  const data = content[mode];
  
  const heroBg = document.getElementById('hero-bg') as HTMLImageElement;
  if (heroBg) heroBg.src = data.bg;
  
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) heroTitle.innerHTML = data.title;
  
  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroSubtitle) heroSubtitle.innerText = data.subtitle;
  
  const businessInput = document.getElementById('business-input') as HTMLInputElement;
  if (businessInput) businessInput.placeholder = data.businessPlaceholder;
  
  const iconContainer = document.getElementById('business-icon-container');
  if (iconContainer) {
    iconContainer.innerHTML = `<i data-lucide="${data.businessIcon}" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>`;
    initIcons(); // re-initialize to convert the new <i> tag into an SVG
  }

  const spendSelect = document.getElementById('spend-select') as HTMLSelectElement;
  if (spendSelect) spendSelect.innerHTML = data.spendOptions;
  
  const whyTitle = document.getElementById('why-choose-title');
  if (whyTitle) whyTitle.innerText = data.whyTitle;
  
  const step1Desc = document.getElementById('step-1-desc');
  if (step1Desc) step1Desc.innerText = data.step1Desc;
}

btnCommercial?.addEventListener('click', () => setMode('commercial'));
btnResidential?.addEventListener('click', () => setMode('residential'));
