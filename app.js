
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

function fmt(n){ return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA'; }
const rates = {
  CI:{employee:.15, employer:.16},
  SN:{employee:.17, employer:.18},
  CM:{employee:.14, employer:.17}
};
document.getElementById('calcBtn')?.addEventListener('click', () => {
  const gross = Number(document.getElementById('gross').value || 0);
  const country = document.getElementById('country').value;
  const r = rates[country];
  const net = gross * (1-r.employee);
  const employer = gross * r.employer;
  const cost = gross + employer;
  document.getElementById('net').textContent = fmt(net);
  document.getElementById('employer').textContent = fmt(employer);
  document.getElementById('cost').textContent = fmt(cost);
});

document.getElementById('demoForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  const estimate = document.getElementById('demoPricingEstimate')?.value || '';
  const plan = document.getElementById('demoPricingProfile')?.value || '';
  const volume = document.getElementById('demoPricingVolume')?.value || '';
  msg.textContent = `Merci. Votre demande est prête à être envoyée avec votre estimation PAYOHADA : ${plan}, ${volume} bulletins/mois, ${estimate}.`;
});


document.querySelectorAll('.billing-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.billing-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.billing;
    document.querySelectorAll('[data-monthly][data-annual]').forEach(el => {
      el.textContent = el.dataset[mode];
    });
    document.querySelectorAll('.billing-label').forEach(el => {
      el.textContent = mode === 'annual' ? '/an' : '/mois';
    });
  });
});


const pricingConfig = {
  starter: {label:"Entreprise — Starter", base:15000, perBullet:500},
  business:{label:"Entreprise — Business", base:30000, perBullet:400},
  premium:{label:"Entreprise — Premium", base:60000, perBullet:300},
  cabinet:{label:"Cabinet comptable", base:25000, perBullet:null}
};

function cabinetRate(volume){
  if(volume <= 100) return 400;
  if(volume <= 500) return 300;
  if(volume <= 1500) return 250;
  if(volume <= 5000) return 200;
  return null;
}

function safeVolume(v){
  const n = Math.round(Number(v || 1));
  return Math.min(100000, Math.max(1, n));
}

function updatePricingCalculator(){
  const profile = document.getElementById('pricingProfile')?.value;
  const billing = document.getElementById('pricingBilling')?.value || 'monthly';
  const volumeInput = document.getElementById('pricingVolume');
  const slider = document.getElementById('pricingSlider');
  if(!profile || !volumeInput) return;

  const volume = safeVolume(volumeInput.value);
  volumeInput.value = volume;
  if(slider) slider.value = Math.min(volume, 5000);

  const cfg = pricingConfig[profile];
  let perBullet = cfg.perBullet;
  let customQuote = false;

  if(profile === 'cabinet'){
    perBullet = cabinetRate(volume);
    if(perBullet === null) customQuote = true;
  }

  const monthlyBase = cfg.base;
  const monthlyVariable = customQuote ? 0 : volume * perBullet;
  const monthlyTotal = customQuote ? null : monthlyBase + monthlyVariable;

  let shownTotal, shownBase, shownVariable, periodLabel;
  if(billing === 'annual'){
    shownBase = monthlyBase * 10;
    shownVariable = customQuote ? null : monthlyVariable * 10;
    shownTotal = customQuote ? null : monthlyTotal * 10;
    periodLabel = '/an';
  } else {
    shownBase = monthlyBase;
    shownVariable = monthlyVariable;
    shownTotal = monthlyTotal;
    periodLabel = '/mois';
  }

  const fmtMoney = n => new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';

  document.getElementById('pricingPlanLabel').textContent = cfg.label;
  document.getElementById('pricingBillingLabel').textContent = billing === 'annual' ? 'Annuel' : 'Mensuel';
  document.getElementById('pricingPeriod').textContent = periodLabel;
  document.getElementById('pricingBase').textContent = fmtMoney(shownBase);
  document.getElementById('pricingVolumeLabel').textContent = new Intl.NumberFormat('fr-FR').format(volume) + ' bulletins';

  if(customQuote){
    document.getElementById('pricingTotal').textContent = 'Sur devis';
    document.getElementById('pricingPerBullet').textContent = 'Tarif personnalisé';
    document.getElementById('pricingVariable').textContent = 'Selon volume';
    document.getElementById('pricingNote').textContent = 'Au-delà de 5 000 bulletins/mois, une proposition personnalisée est recommandée.';
  } else {
    document.getElementById('pricingTotal').textContent = fmtMoney(shownTotal);
    document.getElementById('pricingPerBullet').textContent = fmtMoney(perBullet);
    document.getElementById('pricingVariable').textContent = fmtMoney(shownVariable);
    document.getElementById('pricingNote').textContent = 'Estimation indicative hors taxes, hors frais éventuels de migration et de paramétrage.';
  }

  const savingBox = document.getElementById('pricingSavingBox');
  if(billing === 'annual' && !customQuote){
    const normalAnnual = monthlyTotal * 12;
    const discountedAnnual = monthlyTotal * 10;
    document.getElementById('pricingSaving').textContent = fmtMoney(normalAnnual - discountedAnnual);
    savingBox.hidden = false;
  } else {
    savingBox.hidden = true;
  }
}

const profileEl = document.getElementById('pricingProfile');
const volumeEl = document.getElementById('pricingVolume');
const billingEl = document.getElementById('pricingBilling');
const sliderEl = document.getElementById('pricingSlider');
const calcEl = document.getElementById('pricingCalcBtn');

profileEl?.addEventListener('change', updatePricingCalculator);
billingEl?.addEventListener('change', updatePricingCalculator);
volumeEl?.addEventListener('input', () => {
  if(sliderEl) sliderEl.value = Math.min(safeVolume(volumeEl.value), 5000);
  updatePricingCalculator();
});
sliderEl?.addEventListener('input', () => {
  if(volumeEl) volumeEl.value = sliderEl.value;
  updatePricingCalculator();
});
calcEl?.addEventListener('click', updatePricingCalculator);
updatePricingCalculator();


function syncPricingToDemo(){
  const profile = document.getElementById('pricingProfile')?.value || '';
  const volume = safeVolume(document.getElementById('pricingVolume')?.value || 1);
  const billing = document.getElementById('pricingBilling')?.value || 'monthly';
  const estimate = document.getElementById('pricingTotal')?.textContent || '';
  const perBullet = document.getElementById('pricingPerBullet')?.textContent || '';
  const planLabel = document.getElementById('pricingPlanLabel')?.textContent || '';

  const p = document.getElementById('demoPricingProfile');
  const v = document.getElementById('demoPricingVolume');
  const b = document.getElementById('demoPricingBilling');
  const e = document.getElementById('demoPricingEstimate');
  const pb = document.getElementById('demoPricingPerBullet');

  if(p) p.value = planLabel;
  if(v) v.value = volume;
  if(b) b.value = billing === 'annual' ? 'Annuel' : 'Mensuel';
  if(e) e.value = estimate;
  if(pb) pb.value = perBullet;

  const summary = document.getElementById('demoPricingSummary');
  const summaryTitle = document.getElementById('demoPricingSummaryTitle');
  const summaryAmount = document.getElementById('demoPricingSummaryAmount');

  if(summary && summaryTitle && summaryAmount){
    summary.hidden = false;
    summaryTitle.textContent = `${planLabel} • ${new Intl.NumberFormat('fr-FR').format(volume)} bulletins/mois • ${billing === 'annual' ? 'Annuel' : 'Mensuel'}`;
    summaryAmount.textContent = estimate;
  }

  const profileSelect = document.querySelector('#demoForm select[name="profile"]');
  const volumeSelect = document.querySelector('#demoForm select[name="volume"]');

  if(profileSelect){
    if(profile === 'cabinet') profileSelect.value = 'Cabinet comptable';
    else profileSelect.value = 'Entreprise';
  }

  if(volumeSelect){
    let band = '1–25';
    if(volume <= 25) band = '1–25';
    else if(volume <= 100) band = '26–100';
    else if(volume <= 500) band = '101–500';
    else if(volume <= 2000) band = '501–2 000';
    else band = '2 000+';
    volumeSelect.value = band;
  }
}

function updatePricingAndDemo(){
  updatePricingCalculator();
  syncPricingToDemo();
}

profileEl?.addEventListener('change', syncPricingToDemo);
billingEl?.addEventListener('change', syncPricingToDemo);
volumeEl?.addEventListener('input', syncPricingToDemo);
sliderEl?.addEventListener('input', syncPricingToDemo);
calcEl?.addEventListener('click', syncPricingToDemo);

document.querySelectorAll('a[href="#demo"]').forEach(link => {
  link.addEventListener('click', () => {
    syncPricingToDemo();
  });
});

syncPricingToDemo();

const originalDemoForm = document.getElementById('demoForm');
originalDemoForm?.addEventListener('submit', () => {
  syncPricingToDemo();
}, {capture:true});


const countryPricingConfig = {
  CI:{
    name:"Côte d'Ivoire", currency:"FCFA",
    note:"Tarif de lancement recommandé : entrée agressive pour accélérer l'adoption des PME et cabinets.",
    plans:{
      starter:{base:9900, bullet:400}, business:{base:24900, bullet:350},
      premium:{base:49900, bullet:250}, cabinet:{base:29900}
    },
    cabinetRates:[300,225,175,150]
  },
  SN:{
    name:"Sénégal", currency:"FCFA",
    note:"Positionnement SaaS professionnel : le marché accepte bien une logique par salarié, ce qui permet de valoriser support et déclaratif.",
    plans:{
      starter:{base:12500, bullet:450}, business:{base:29900, bullet:400},
      premium:{base:54900, bullet:275}, cabinet:{base:34900}
    },
    cabinetRates:[325,250,190,160]
  },
  CM:{
    name:"Cameroun", currency:"XAF",
    note:"Positionnement premium accessible en XAF, cohérent avec un marché où les offres locales sont déjà structurées.",
    plans:{
      starter:{base:19900, bullet:450}, business:{base:39900, bullet:350},
      premium:{base:69900, bullet:250}, cabinet:{base:39900}
    },
    cabinetRates:[300,225,175,150]
  },
  BJ:{
    name:"Bénin", currency:"FCFA",
    note:"Marché sensible au prix : maintenir une entrée basse et différencier PAYOHADA par le cloud, le multi-pays et l'offre cabinet.",
    plans:{
      starter:{base:9900, bullet:350}, business:{base:22900, bullet:300},
      premium:{base:44900, bullet:225}, cabinet:{base:24900}
    },
    cabinetRates:[275,200,160,140]
  },
  TG:{
    name:"Togo", currency:"FCFA",
    note:"Mettre en avant les mises à jour continues, la collaboration cloud et le multi-dossiers face aux solutions à licence unique.",
    plans:{
      starter:{base:9900, bullet:350}, business:{base:22900, bullet:300},
      premium:{base:44900, bullet:225}, cabinet:{base:24900}
    },
    cabinetRates:[275,200,160,140]
  }
};

function moneyCountry(n, currency){
  return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' ' + currency;
}

function annualBase(base){ return base * 10; }

function countryCabinetRate(countryCode, volume){
  const r = countryPricingConfig[countryCode].cabinetRates;
  if(volume <= 100) return r[0];
  if(volume <= 500) return r[1];
  if(volume <= 1500) return r[2];
  if(volume <= 5000) return r[3];
  return null;
}

function updateCountryPricingCards(){
  const countryEl = document.getElementById('pricingCountry');
  if(!countryEl) return;
  const code = countryEl.value;
  const cfg = countryPricingConfig[code];
  const annualActive = document.querySelector('.billing-btn[data-billing="annual"]')?.classList.contains('active');

  const cardMap = [
    ['starterBasePrice','starterBulletPrice','starter'],
    ['businessBasePrice','businessBulletPrice','business'],
    ['premiumBasePrice','premiumBulletPrice','premium']
  ];

  cardMap.forEach(([baseId, bulletId, key])=>{
    const baseEl = document.getElementById(baseId);
    const bulletEl = document.getElementById(bulletId);
    if(baseEl){
      baseEl.dataset.monthly = moneyCountry(cfg.plans[key].base, cfg.currency);
      baseEl.dataset.annual = moneyCountry(annualBase(cfg.plans[key].base), cfg.currency);
      baseEl.textContent = annualActive ? baseEl.dataset.annual : baseEl.dataset.monthly;
    }
    if(bulletEl) bulletEl.textContent = moneyCountry(cfg.plans[key].bullet, cfg.currency);
  });

  const cab = document.getElementById('cabinetBasePrice');
  if(cab){
    cab.dataset.monthly = 'Dès ' + moneyCountry(cfg.plans.cabinet.base, cfg.currency);
    cab.dataset.annual = 'Dès ' + moneyCountry(annualBase(cfg.plans.cabinet.base), cfg.currency);
    cab.textContent = annualActive ? cab.dataset.annual : cab.dataset.monthly;
  }

  cfg.cabinetRates.forEach((rate, i)=>{
    const el = document.getElementById('cabRate' + (i+1));
    if(el) el.textContent = moneyCountry(rate, cfg.currency);
  });

  const note = document.getElementById('countryPricingNote');
  if(note){
    const flags = {CI:'🇨🇮',SN:'🇸🇳',CM:'🇨🇲',BJ:'🇧🇯',TG:'🇹🇬'};
    note.innerHTML = `<strong>${flags[code]} ${cfg.name}</strong><span>${cfg.note}</span>`;
  }

  const calcCountry = document.getElementById('pricingCalcCountry');
  if(calcCountry && calcCountry.value !== code){
    calcCountry.value = code;
  }
  updateCountryAwareCalculator();
}

function updateCountryAwareCalculator(){
  const countryEl = document.getElementById('pricingCalcCountry');
  const profileEl2 = document.getElementById('pricingProfile');
  const billingEl2 = document.getElementById('pricingBilling');
  const volumeInput2 = document.getElementById('pricingVolume');
  if(!countryEl || !profileEl2 || !billingEl2 || !volumeInput2) return;

  const code = countryEl.value;
  const cfg = countryPricingConfig[code];
  const profile = profileEl2.value;
  const billing = billingEl2.value;
  const volume = safeVolume(volumeInput2.value);
  volumeInput2.value = volume;

  const slider = document.getElementById('pricingSlider');
  if(slider) slider.value = Math.min(volume,5000);

  let base = cfg.plans[profile].base;
  let perBullet = profile === 'cabinet' ? countryCabinetRate(code, volume) : cfg.plans[profile].bullet;
  const custom = perBullet === null;

  const monthlyVariable = custom ? 0 : volume * perBullet;
  const monthlyTotal = custom ? null : base + monthlyVariable;
  const factor = billing === 'annual' ? 10 : 1;
  const shownBase = base * factor;
  const shownVariable = custom ? null : monthlyVariable * factor;
  const shownTotal = custom ? null : monthlyTotal * factor;

  const labels = {
    starter:"Entreprise — Starter", business:"Entreprise — Business",
    premium:"Entreprise — Premium", cabinet:"Cabinet comptable"
  };

  document.getElementById('pricingPlanLabel').textContent = `${labels[profile]} • ${cfg.name}`;
  document.getElementById('pricingBillingLabel').textContent = billing === 'annual' ? 'Annuel' : 'Mensuel';
  document.getElementById('pricingPeriod').textContent = billing === 'annual' ? '/an' : '/mois';
  document.getElementById('pricingBase').textContent = moneyCountry(shownBase,cfg.currency);
  document.getElementById('pricingVolumeLabel').textContent = new Intl.NumberFormat('fr-FR').format(volume) + ' bulletins';

  if(custom){
    document.getElementById('pricingTotal').textContent = 'Sur devis';
    document.getElementById('pricingPerBullet').textContent = 'Tarif personnalisé';
    document.getElementById('pricingVariable').textContent = 'Selon volume';
    document.getElementById('pricingNote').textContent = `Au-delà de 5 000 bulletins/mois au ${cfg.name}, une proposition personnalisée est recommandée.`;
  }else{
    document.getElementById('pricingTotal').textContent = moneyCountry(shownTotal,cfg.currency);
    document.getElementById('pricingPerBullet').textContent = moneyCountry(perBullet,cfg.currency);
    document.getElementById('pricingVariable').textContent = moneyCountry(shownVariable,cfg.currency);
    document.getElementById('pricingNote').textContent = `Estimation indicative ${cfg.name}, hors taxes et hors frais éventuels de migration/paramétrage.`;
  }

  const savingBox = document.getElementById('pricingSavingBox');
  if(billing === 'annual' && !custom){
    document.getElementById('pricingSaving').textContent = moneyCountry(monthlyTotal*2,cfg.currency);
    savingBox.hidden = false;
  } else {
    savingBox.hidden = true;
  }

  syncCountryPricingToDemo(code, profile, volume, billing, custom ? 'Sur devis' : moneyCountry(shownTotal,cfg.currency), custom ? 'Sur devis' : moneyCountry(perBullet,cfg.currency));
}

function syncCountryPricingToDemo(code, profile, volume, billing, estimate, perBullet){
  const cfg = countryPricingConfig[code];
  const labels = {starter:"Entreprise — Starter",business:"Entreprise — Business",premium:"Entreprise — Premium",cabinet:"Cabinet comptable"};
  const fields = {
    demoPricingCountry: cfg.name,
    demoPricingProfile: labels[profile],
    demoPricingVolume: volume,
    demoPricingBilling: billing === 'annual' ? 'Annuel' : 'Mensuel',
    demoPricingEstimate: estimate,
    demoPricingPerBullet: perBullet
  };
  Object.entries(fields).forEach(([id,val])=>{ const el=document.getElementById(id); if(el) el.value=val; });

  const summary = document.getElementById('demoPricingSummary');
  const title = document.getElementById('demoPricingSummaryTitle');
  const amount = document.getElementById('demoPricingSummaryAmount');
  if(summary && title && amount){
    summary.hidden = false;
    title.textContent = `${cfg.name} • ${labels[profile]} • ${new Intl.NumberFormat('fr-FR').format(volume)} bulletins/mois`;
    amount.textContent = estimate;
  }

  const demoCountry = document.querySelector('#demoForm select[name="country"]');
  if(demoCountry){
    const countryNames = {CI:"Côte d'Ivoire",SN:"Sénégal",CM:"Cameroun",BJ:"Bénin",TG:"Togo"};
    demoCountry.value = countryNames[code];
  }

  const demoProfile = document.querySelector('#demoForm select[name="profile"]');
  if(demoProfile) demoProfile.value = profile === 'cabinet' ? 'Cabinet comptable' : 'Entreprise';

  const demoVolume = document.querySelector('#demoForm select[name="volume"]');
  if(demoVolume){
    demoVolume.value = volume <=25 ? '1–25' : volume<=100 ? '26–100' : volume<=500 ? '101–500' : volume<=2000 ? '501–2 000' : '2 000+';
  }
}

document.getElementById('pricingCountry')?.addEventListener('change', updateCountryPricingCards);
document.getElementById('pricingCalcCountry')?.addEventListener('change', ()=>{
  const v = document.getElementById('pricingCalcCountry').value;
  const top = document.getElementById('pricingCountry');
  if(top) top.value = v;
  updateCountryPricingCards();
});
document.getElementById('pricingProfile')?.addEventListener('change', updateCountryAwareCalculator);
document.getElementById('pricingBilling')?.addEventListener('change', updateCountryAwareCalculator);
document.getElementById('pricingVolume')?.addEventListener('input', updateCountryAwareCalculator);
document.getElementById('pricingSlider')?.addEventListener('input', ()=>{
  const slider = document.getElementById('pricingSlider');
  const volume = document.getElementById('pricingVolume');
  if(slider && volume) volume.value = slider.value;
  updateCountryAwareCalculator();
});
document.getElementById('pricingCalcBtn')?.addEventListener('click', updateCountryAwareCalculator);

document.querySelectorAll('.billing-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    setTimeout(updateCountryPricingCards,0);
  });
});

updateCountryPricingCards();
