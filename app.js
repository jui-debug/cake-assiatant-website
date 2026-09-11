/**
 * VELVET & WHISK - ARTISAN CAKE DESIGN ASSISTANT
 * Core Application Engine & Interactive Visualizer
 */

const CakeApp = (() => {
  // --- APPLICATION STATE ---
  const state = {
    currentStage: 1,
    orderId: 'VW-2026-' + Math.floor(1000 + Math.random() * 9000),
    
    // Questionnaire selections
    occasion: 'wedding',
    guestCount: 65,
    tiers: 2,
    aesthetic: 'botanical',
    flavor: 'vanilla-berry',
    dietary: ['nut-free'],
    budgetTier: 'classic',
    
    // Customizer visuals
    icingColor: '#FFFDF7',
    icingColorName: 'Warm Vanilla Ivory',
    surfaceFinish: 'smooth',
    toppers: {
      flowers: true,
      goldleaf: true,
      pearls: false,
      customTopper: false,
      topperText: 'Forever & Always'
    },
    cutViewMode: false,
    cuttingMode: 'wedding',
    
    // Computed specs
    tierSizes: ['8" Round', '6" Round'],
    estimatedServings: 65,
    priceEstimate: {
      tiersCost: 360,
      decorCost: 75,
      dowelCost: 25,
      total: 460
    }
  };

  // Preset Configurations
  const presets = {
    'royal-wedding': {
      occasion: 'wedding',
      guestCount: 110,
      tiers: 3,
      aesthetic: 'botanical',
      flavor: 'vanilla-berry',
      dietary: ['nut-free'],
      budgetTier: 'artisan',
      icingColor: '#FFFDF7',
      icingColorName: 'Warm Vanilla Ivory',
      surfaceFinish: 'smooth',
      toppers: { flowers: true, goldleaf: true, pearls: true, customTopper: false, topperText: 'Forever & Always' }
    },
    'vintage-lambeth': {
      occasion: 'birthday',
      guestCount: 50,
      tiers: 2,
      aesthetic: 'lambeth',
      flavor: 'earl-grey-lemon',
      dietary: [],
      budgetTier: 'classic',
      icingColor: '#FCEEE9',
      icingColorName: 'Blush Champagne Rose',
      surfaceFinish: 'lambeth',
      toppers: { flowers: false, goldleaf: false, pearls: true, customTopper: true, topperText: 'Sweet Thirty' }
    },
    'modern-noir': {
      occasion: 'gala',
      guestCount: 90,
      tiers: 3,
      aesthetic: 'geometric',
      flavor: 'chocolate-caramel',
      dietary: ['halal'],
      budgetTier: 'masterpiece',
      icingColor: '#1F2A38',
      icingColorName: 'Midnight Royal Navy',
      surfaceFinish: 'smooth',
      toppers: { flowers: false, goldleaf: true, pearls: false, customTopper: false, topperText: 'Luxe Gala' }
    }
  };

  // Flavor metadata
  const flavorCatalog = {
    'vanilla-berry': {
      name: 'Tahitian Vanilla Bean & Wild Berry Champagne',
      desc: 'Velvety Madagascar vanilla sponge, house-reduced strawberry-prosecco compote, whipped Swiss meringue buttercream.',
      spongeColor: '#F5DEB3',
      fillColor: '#C2185B'
    },
    'chocolate-caramel': {
      name: 'Belgian Dark Chocolate Ganache & Salted Caramel',
      desc: '70% Callebaut dark chocolate mud cake, Fleur de Sel smoked caramel, espresso-infused silky ganache.',
      spongeColor: '#4A2E2B',
      fillColor: '#C68B59'
    },
    'earl-grey-lemon': {
      name: 'Earl Grey Lavender & Meyer Lemon Curd',
      desc: 'Bergamot tea-steeped sponge, tart Meyer lemon curd core, lavender French buttercream layer.',
      spongeColor: '#D8C3A5',
      fillColor: '#FBC02D'
    },
    'pistachio-rose': {
      name: 'Roasted Pistachio Cardamom & Rosewater Velvet',
      desc: 'Crushed Sicilian pistachio sponge scented with green cardamom, raspberry rose coulis, mascarpone mousse.',
      spongeColor: '#A8C3A0',
      fillColor: '#D81B60'
    }
  };

  // DOM Elements cache
  let dom = {};

  // --- INITIALIZATION ---
  function init() {
    cacheDom();
    bindEvents();
    parseUrlState();
    recalculateFromGuestCount(state.guestCount);
    renderAll();
    updateShareUrlDisplay();
    handleIntroSequence();
  }

  function cacheDom() {
    dom = {
      guestSlider: document.getElementById('guest-slider'),
      guestCountDisplay: document.getElementById('guest-count-display'),
      recommendedTiersDisplay: document.getElementById('recommended-tiers-display'),
      portionsCountDisplay: document.getElementById('portions-count-display'),
      generateBtn: document.getElementById('generate-recommendations-btn'),
      
      // Stage sections
      stage1: document.getElementById('stage-1'),
      stage2: document.getElementById('stage-2'),
      stage3: document.getElementById('stage-3'),
      stage4: document.getElementById('stage-4'),
      stage5: document.getElementById('stage-5'),
      
      // Header and Share
      quickPresetBtn: document.getElementById('quick-preset-btn'),
      shareDesignBtn: document.getElementById('share-design-btn'),
      shareableUrlInput: document.getElementById('shareable-url-input'),
      toastMsg: document.getElementById('toast-msg'),
      toastText: document.getElementById('toast-text'),
      
      // Stage 2 Visualizer
      recTitle: document.getElementById('rec-cake-title'),
      recSubhead: document.getElementById('rec-cake-subhead'),
      matchPercent: document.getElementById('match-percent'),
      dynamicPriceEstimate: document.getElementById('dynamic-price-estimate'),
      cakeSvgContainer: document.getElementById('cake-svg-container'),
      specTiersVal: document.getElementById('spec-tiers-val'),
      specBaseVal: document.getElementById('spec-base-val'),
      specTopVal: document.getElementById('spec-top-val'),
      specPortionsVal: document.getElementById('spec-portions-val'),
      rulerHeightLabel: document.getElementById('ruler-height-label'),
      colorNameLabel: document.getElementById('color-name-label'),
      toggleCutViewBtn: document.getElementById('toggle-cut-view-btn'),
      resetViewBtn: document.getElementById('reset-view-btn'),
      topperInputContainer: document.getElementById('topper-input-container'),
      topperText: document.getElementById('topper-text'),
      miniRecsList: document.getElementById('mini-recs-list'),
      
      // Stage 3 Baker's Notes
      blueprintSvg: document.getElementById('blueprint-svg'),
      bakerTierCount: document.getElementById('baker-tier-count'),
      bakerCentralRodNote: document.getElementById('baker-central-rod-note'),
      bakerDowelsNote: document.getElementById('baker-dowels-note'),
      cuttingGuideSvg: document.getElementById('cutting-guide-svg'),
      cutDiagramCaption: document.getElementById('cut-diagram-caption'),
      btnWeddingCut: document.getElementById('btn-wedding-cut'),
      btnPartyCut: document.getElementById('btn-party-cut'),
      
      // Stage 4 Considerations
      checklistCounter: document.getElementById('checklist-counter'),
      
      // Stage 5 Blueprint
      blueprintOrderId: document.getElementById('blueprint-order-id'),
      blueprintDate: document.getElementById('blueprint-date'),
      summaryOccasionVal: document.getElementById('summary-occasion-val'),
      summaryAestheticVal: document.getElementById('summary-aesthetic-val'),
      summaryAestheticDesc: document.getElementById('summary-aesthetic-desc'),
      summaryTiersTable: document.getElementById('summary-tiers-table'),
      summaryFlavorVal: document.getElementById('summary-flavor-val'),
      summaryDietaryTags: document.getElementById('summary-dietary-tags'),
      blueprintMiniVisual: document.getElementById('blueprint-mini-visual'),
      palDotColor: document.getElementById('pal-dot-color'),
      palAccentNotes: document.getElementById('pal-accent-notes'),
      priceTierDesc: document.getElementById('price-tier-desc'),
      priceTierAmt: document.getElementById('price-tier-amt'),
      priceDecorDesc: document.getElementById('price-decor-desc'),
      priceDecorAmt: document.getElementById('price-decor-amt'),
      priceTotalAmt: document.getElementById('price-total-amt'),
      modalOrderId: document.getElementById('modal-order-id'),
      successRefCode: document.getElementById('success-ref-code')
    };
  }

  function bindEvents() {
    // Slider listener
    if (dom.guestSlider) {
      dom.guestSlider.addEventListener('input', (e) => {
        const count = parseInt(e.target.value, 10);
        state.guestCount = count;
        recalculateFromGuestCount(count);
        renderVisualizer();
        renderBakersNotes();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    }

    // Occasion Radios
    document.querySelectorAll('input[name="occasion"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.occasion = e.target.value;
        updateRecommendationsText();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    });

    // Aesthetic Radios
    document.querySelectorAll('input[name="aesthetic"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.aesthetic = e.target.value;
        adaptStyleFromAesthetic(state.aesthetic);
        renderVisualizer();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    });

    // Flavor Radios
    document.querySelectorAll('input[name="flavor"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.flavor = e.target.value;
        renderVisualizer();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    });

    // Dietary Checkboxes
    document.querySelectorAll('input[name="dietary"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = [];
        document.querySelectorAll('input[name="dietary"]:checked').forEach(c => selected.push(c.value));
        state.dietary = selected;
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    });

    // Budget Radios
    document.querySelectorAll('input[name="budget"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.budgetTier = e.target.value;
        recalculatePricing();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    });

    // Generate Button in Stage 1
    if (dom.generateBtn) {
      dom.generateBtn.addEventListener('click', () => {
        goToStage(2);
      });
    }

    // Nav Stepper Items
    document.querySelectorAll('.step-item').forEach(item => {
      item.addEventListener('click', () => {
        const step = parseInt(item.dataset.step, 10);
        goToStage(step);
      });
    });

    // Tier Selector Buttons in Customizer
    document.querySelectorAll('.tier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.tiers = parseInt(btn.dataset.tiers, 10);
        recalculateTierSizes();
        renderVisualizer();
        renderBakersNotes();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    });

    // Color Swatches
    document.querySelectorAll('.swatch-btn').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.swatch-btn').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        state.icingColor = swatch.dataset.color;
        state.icingColorName = swatch.dataset.name;
        if (dom.colorNameLabel) dom.colorNameLabel.textContent = state.icingColorName;
        renderVisualizer();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    });

    // Texture Chips
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.surfaceFinish = chip.dataset.finish;
        renderVisualizer();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    });

    // Decoration Toggles
    const flowersToggle = document.getElementById('toggle-flowers');
    if (flowersToggle) {
      flowersToggle.addEventListener('change', (e) => {
        state.toppers.flowers = e.target.checked;
        recalculatePricing();
        renderVisualizer();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    }

    const goldleafToggle = document.getElementById('toggle-goldleaf');
    if (goldleafToggle) {
      goldleafToggle.addEventListener('change', (e) => {
        state.toppers.goldleaf = e.target.checked;
        recalculatePricing();
        renderVisualizer();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    }

    const pearlsToggle = document.getElementById('toggle-pearls');
    if (pearlsToggle) {
      pearlsToggle.addEventListener('change', (e) => {
        state.toppers.pearls = e.target.checked;
        recalculatePricing();
        renderVisualizer();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    }

    const customTopperToggle = document.getElementById('toggle-custom-topper');
    if (customTopperToggle) {
      customTopperToggle.addEventListener('change', (e) => {
        state.toppers.customTopper = e.target.checked;
        if (dom.topperInputContainer) {
          dom.topperInputContainer.style.display = e.target.checked ? 'block' : 'none';
        }
        recalculatePricing();
        renderVisualizer();
        renderBlueprintSummary();
        updateShareUrlDisplay();
      });
    }

    if (dom.topperText) {
      dom.topperText.addEventListener('input', (e) => {
        state.toppers.topperText = e.target.value;
        renderVisualizer();
        updateShareUrlDisplay();
      });
    }

    // Cut View Inspection Toggle
    if (dom.toggleCutViewBtn) {
      dom.toggleCutViewBtn.addEventListener('click', () => {
        state.cutViewMode = !state.cutViewMode;
        dom.toggleCutViewBtn.classList.toggle('active', state.cutViewMode);
        dom.toggleCutViewBtn.innerHTML = state.cutViewMode ?
          '<i class="fa-solid fa-cake-candles"></i> Exterior Icing View' :
          '<i class="fa-solid fa-layer-group"></i> Interior Sponge View';
        renderVisualizer();
      });
    }

    // Reset View Button
    if (dom.resetViewBtn) {
      dom.resetViewBtn.addEventListener('click', () => {
        state.cutViewMode = false;
        if (dom.toggleCutViewBtn) {
          dom.toggleCutViewBtn.classList.remove('active');
          dom.toggleCutViewBtn.innerHTML = '<i class="fa-solid fa-layer-group"></i> Interior Sponge View';
        }
        adaptStyleFromAesthetic(state.aesthetic);
        renderVisualizer();
      });
    }

    // Preset button header
    if (dom.quickPresetBtn) {
      dom.quickPresetBtn.addEventListener('click', () => {
        openModal('presets-modal');
      });
    }

    // Share design header button
    if (dom.shareDesignBtn) {
      dom.shareDesignBtn.addEventListener('click', () => {
        goToStage(5);
        copyShareLink();
      });
    }
  }

  // --- RECALCULATION & RECOMMENDATION LOGIC ---
  function recalculateFromGuestCount(guests) {
    if (dom.guestCountDisplay) {
      dom.guestCountDisplay.textContent = `${guests} Guests`;
    }

    let recommendedTiers = 2;
    let tierText = '2 Tiers (8" + 6")';
    let portions = `~${guests} - ${guests + 10} Servings`;

    if (guests <= 25) {
      recommendedTiers = 1;
      tierText = '1 Tier (8" Boutique)';
    } else if (guests <= 75) {
      recommendedTiers = 2;
      tierText = '2 Tiers (8" + 6")';
    } else if (guests <= 135) {
      recommendedTiers = 3;
      tierText = '3 Tiers (10" + 8" + 6")';
    } else {
      recommendedTiers = 4;
      tierText = '4 Tiers (12" + 10" + 8" + 6")';
    }

    state.tiers = recommendedTiers;
    state.estimatedServings = guests;

    if (dom.recommendedTiersDisplay) dom.recommendedTiersDisplay.textContent = tierText;
    if (dom.portionsCountDisplay) dom.portionsCountDisplay.textContent = portions;

    // Update active tier button in customizer
    document.querySelectorAll('.tier-btn').forEach(btn => {
      const t = parseInt(btn.dataset.tiers, 10);
      btn.classList.toggle('active', t === recommendedTiers);
    });

    recalculateTierSizes();
    recalculatePricing();
    updateRecommendationsText();
  }

  function recalculateTierSizes() {
    switch (state.tiers) {
      case 1:
        state.tierSizes = ['8" Round (4-Layer)'];
        break;
      case 2:
        state.tierSizes = ['8" Round (4-Layer)', '6" Round (4-Layer)'];
        break;
      case 3:
        state.tierSizes = ['10" Round (4-Layer)', '8" Round (4-Layer)', '6" Round (4-Layer)'];
        break;
      case 4:
        state.tierSizes = ['12" Round (4-Layer)', '10" Round (4-Layer)', '8" Round (4-Layer)', '6" Round (4-Layer)'];
        break;
      default:
        state.tierSizes = ['8" Round', '6" Round'];
    }

    if (dom.specTiersVal) dom.specTiersVal.textContent = `${state.tiers} ${state.tiers === 1 ? 'Tier' : 'Tiers'}`;
    if (dom.specBaseVal) dom.specBaseVal.textContent = state.tierSizes[0];
    if (dom.specTopVal) dom.specTopVal.textContent = state.tierSizes[state.tierSizes.length - 1];
    if (dom.specPortionsVal) dom.specPortionsVal.textContent = `${state.estimatedServings} Servings`;
    if (dom.rulerHeightLabel) dom.rulerHeightLabel.textContent = `Total Height: ~${state.tiers * 5 + 4} inches`;
  }

  function recalculatePricing() {
    let base = state.tiers * 175;
    if (state.tiers === 1) base = 195;
    if (state.tiers === 4) base = 680;

    let decor = 0;
    if (state.toppers.flowers) decor += 55;
    if (state.toppers.goldleaf) decor += 35;
    if (state.toppers.pearls) decor += 25;
    if (state.toppers.customTopper) decor += 40;

    let dowels = state.tiers * 12;
    let total = base + decor + dowels;

    if (state.budgetTier === 'artisan') {
      total = Math.round(total * 1.15);
    } else if (state.budgetTier === 'masterpiece') {
      total = Math.round(total * 1.35);
    }

    state.priceEstimate = {
      tiersCost: base,
      decorCost: decor,
      dowelCost: dowels,
      total: total
    };

    if (dom.dynamicPriceEstimate) {
      dom.dynamicPriceEstimate.textContent = `$${total - 30} - $${total + 40}`;
    }
    if (dom.priceTierAmt) dom.priceTierAmt.textContent = `$${base}.00`;
    if (dom.priceDecorAmt) dom.priceDecorAmt.textContent = `$${decor}.00`;
    if (dom.priceTotalAmt) dom.priceTotalAmt.textContent = `$${total}.00`;
  }

  function updateRecommendationsText() {
    const occasionTitles = {
      'wedding': 'The Royal Botanical Monogram',
      'birthday': 'The Luminary Milestone Centerpiece',
      'shower': 'The Whimsical Meadow Petal',
      'anniversary': 'The Golden Jubilee Romance',
      'gala': 'The Architectural Marble Gala',
      'intimate': 'The Artisanal Atelier Petite'
    };

    const title = occasionTitles[state.occasion] || 'The Couture Artisan Centerpiece';
    if (dom.recTitle) dom.recTitle.textContent = title;

    const sub = `A majestic ${state.tiers}-tier architectural showpiece tailored for ${state.estimatedServings} guests, finished with ${state.aesthetic} styling and paired with ${flavorCatalog[state.flavor].name}.`;
    if (dom.recSubhead) dom.recSubhead.textContent = sub;

    // Match percentage calculation
    let match = 96;
    if (state.guestCount > 100) match = 98;
    if (dom.matchPercent) dom.matchPercent.textContent = `${match}% Match`;

    renderMiniRecs();
  }

  function adaptStyleFromAesthetic(aesthetic) {
    if (aesthetic === 'botanical') {
      state.toppers.flowers = true;
      state.surfaceFinish = 'smooth';
      state.icingColor = '#FFFDF7';
      state.icingColorName = 'Warm Vanilla Ivory';
    } else if (aesthetic === 'lambeth') {
      state.surfaceFinish = 'lambeth';
      state.toppers.flowers = false;
      state.toppers.pearls = true;
      state.icingColor = '#FCEEE9';
      state.icingColorName = 'Blush Champagne Rose';
    } else if (aesthetic === 'geometric') {
      state.surfaceFinish = 'smooth';
      state.toppers.flowers = false;
      state.toppers.goldleaf = true;
      state.icingColor = '#1F2A38';
      state.icingColorName = 'Midnight Royal Navy';
    } else if (aesthetic === 'textured') {
      state.surfaceFinish = 'ribbed';
      state.toppers.flowers = true;
      state.icingColor = '#E8EFE9';
      state.icingColorName = 'Earthy Sage Cream';
    } else if (aesthetic === 'metallic') {
      state.surfaceFinish = 'smooth';
      state.toppers.goldleaf = true;
      state.icingColor = '#F4ECE1';
      state.icingColorName = 'Tuscan Alabaster';
    } else if (aesthetic === 'rustic') {
      state.surfaceFinish = 'semi-naked';
      state.toppers.flowers = true;
      state.toppers.goldleaf = false;
      state.icingColor = '#FFFDF7';
      state.icingColorName = 'Warm Vanilla Ivory';
    }

    // Update UI chips & swatches
    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.finish === state.surfaceFinish);
    });

    document.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color.toLowerCase() === state.icingColor.toLowerCase());
    });

    const fToggle = document.getElementById('toggle-flowers');
    if (fToggle) fToggle.checked = state.toppers.flowers;
    const gToggle = document.getElementById('toggle-goldleaf');
    if (gToggle) gToggle.checked = state.toppers.goldleaf;
    const pToggle = document.getElementById('toggle-pearls');
    if (pToggle) pToggle.checked = state.toppers.pearls;

    if (dom.colorNameLabel) dom.colorNameLabel.textContent = state.icingColorName;
  }

  function renderMiniRecs() {
    if (!dom.miniRecsList) return;
    const altOptions = [
      { name: 'Heritage English Lambeth', style: 'lambeth', color: '#FCEEE9', tiers: state.tiers, score: '95%' },
      { name: 'Minimalist Wafer Sail & Marble', style: 'geometric', color: '#1F2A38', tiers: state.tiers, score: '93%' },
      { name: 'Rustic Wildflower & Deckled Edge', style: 'rustic', color: '#FFFDF7', tiers: state.tiers, score: '91%' }
    ];

    dom.miniRecsList.innerHTML = altOptions.map(opt => `
      <div class="mini-rec-card" onclick="CakeApp.applyAltStyle('${opt.style}', '${opt.color}')">
        <div>
          <span class="mini-rec-title">${opt.name}</span>
          <span class="mini-rec-meta">${opt.tiers} Tiers &bull; ${opt.style}</span>
        </div>
        <span class="mini-rec-score">${opt.score} Match</span>
      </div>
    `).join('');
  }

  function applyAltStyle(style, color) {
    state.aesthetic = style;
    adaptStyleFromAesthetic(style);
    state.icingColor = color;
    renderVisualizer();
    renderBlueprintSummary();
    updateShareUrlDisplay();
  }

  // --- DYNAMIC SVG CAKE VISUALIZER ---
  function renderVisualizer() {
    if (!dom.cakeSvgContainer) return;
    const svgCode = generateCakeSvg(360, 310, state);
    dom.cakeSvgContainer.innerHTML = svgCode;

    // Also update mini preview in blueprint
    if (dom.blueprintMiniVisual) {
      dom.blueprintMiniVisual.innerHTML = generateCakeSvg(260, 160, state, true);
    }
  }

  function generateCakeSvg(width, height, s, isMini = false) {
    const tierCount = s.tiers;
    const color = s.icingColor;
    const finish = s.surfaceFinish;
    const flavorData = flavorCatalog[s.flavor] || flavorCatalog['vanilla-berry'];
    const spongeColor = flavorData.spongeColor;
    const fillColor = flavorData.fillColor;
    const isCutView = s.cutViewMode && !isMini;

    // Dimensions setup
    // Center X
    const cx = width / 2;
    // Base Y
    const baseY = height - (isMini ? 12 : 22);

    // Tier definitions based on count
    let tierDefs = [];
    if (tierCount === 1) {
      tierDefs = [{ w: width * 0.58, h: height * 0.42 }];
    } else if (tierCount === 2) {
      tierDefs = [
        { w: width * 0.64, h: height * 0.28 },
        { w: width * 0.46, h: height * 0.26 }
      ];
    } else if (tierCount === 3) {
      tierDefs = [
        { w: width * 0.70, h: height * 0.22 },
        { w: width * 0.52, h: height * 0.21 },
        { w: width * 0.36, h: height * 0.20 }
      ];
    } else {
      tierDefs = [
        { w: width * 0.75, h: height * 0.18 },
        { w: width * 0.58, h: height * 0.17 },
        { w: width * 0.44, h: height * 0.16 },
        { w: width * 0.32, h: height * 0.15 }
      ];
    }

    let elementsSvg = '';
    let currentY = baseY;

    // Render tiers from bottom to top
    tierDefs.forEach((tier, i) => {
      const rx = 10;
      const x = cx - tier.w / 2;
      const y = currentY - tier.h;

      // Tier container
      elementsSvg += `<g class="cake-tier-group tier-${i + 1}">`;

      // Shadow under tier
      elementsSvg += `<ellipse cx="${cx}" cy="${currentY}" rx="${tier.w / 2 + 2}" ry="6" fill="rgba(0,0,0,0.12)" />`;

      if (isCutView) {
        // Cutaway interior inspection view
        // Back exterior
        elementsSvg += `
          <rect x="${x}" y="${y}" width="${tier.w}" height="${tier.h}" rx="${rx}" fill="${color}" stroke="#C5A059" stroke-width="1.2" />
        `;
        // Cut interior wedge
        const cutW = tier.w * 0.45;
        const layerH = tier.h / 5;
        // Layers
        elementsSvg += `<g transform="translate(${cx - cutW / 2}, ${y})">`;
        elementsSvg += `<rect x="0" y="0" width="${cutW}" height="${tier.h}" fill="#332421" opacity="0.1" />`;
        for (let l = 0; l < 4; l++) {
          // Sponge layer
          elementsSvg += `<rect x="2" y="${l * layerH * 1.25 + 2}" width="${cutW - 4}" height="${layerH * 0.75}" rx="2" fill="${spongeColor}" />`;
          // Filling layer
          if (l < 3) {
            elementsSvg += `<rect x="2" y="${(l + 1) * layerH * 1.25 - 3}" width="${cutW - 4}" height="4" rx="1" fill="${fillColor}" />`;
          }
        }
        elementsSvg += `</g>`;
      } else {
        // Exterior regular view
        // Tier body
        elementsSvg += `
          <rect x="${x}" y="${y}" width="${tier.w}" height="${tier.h}" rx="${rx}" fill="${color}" stroke="rgba(0,0,0,0.08)" stroke-width="1" />
        `;

        // 3D Lighting highlight
        elementsSvg += `
          <rect x="${x + 6}" y="${y + 2}" width="${tier.w * 0.22}" height="${tier.h - 4}" rx="4" fill="rgba(255,255,255,0.4)" />
          <rect x="${x + tier.w * 0.82}" y="${y + 2}" width="${tier.w * 0.14}" height="${tier.h - 4}" rx="4" fill="rgba(0,0,0,0.08)" />
        `;

        // Surface Finish Overlays
        if (finish === 'ribbed') {
          // Horizontal lines
          const numRibs = 5;
          for (let r = 1; r < numRibs; r++) {
            const ribY = y + (tier.h / numRibs) * r;
            elementsSvg += `<line x1="${x + 4}" y1="${ribY}" x2="${x + tier.w - 4}" y2="${ribY}" stroke="rgba(0,0,0,0.12)" stroke-width="2" stroke-linecap="round" />`;
          }
        } else if (finish === 'lambeth') {
          // Scallop ruffles on top rim and bottom rim
          const scallops = Math.floor(tier.w / 18);
          for (let sc = 0; sc < scallops; sc++) {
            const scX = x + sc * 18 + 9;
            elementsSvg += `<path d="M ${scX - 8} ${y + 3} Q ${scX} ${y + 12} ${scX + 8} ${y + 3}" fill="none" stroke="#E57373" stroke-width="2" stroke-linecap="round" />`;
            elementsSvg += `<circle cx="${scX}" cy="${y + 12}" r="1.5" fill="#D32F2F" />`;
          }
          // Garland scallops in middle
          for (let sc = 0; sc < scallops - 1; sc++) {
            const scX = x + (sc + 0.5) * 18 + 9;
            elementsSvg += `<path d="M ${scX - 8} ${y + tier.h * 0.5} Q ${scX} ${y + tier.h * 0.65} ${scX + 8} ${y + tier.h * 0.5}" fill="none" stroke="#E57373" stroke-width="1.6" />`;
          }
        } else if (finish === 'semi-naked') {
          // Visible sponge streaks
          elementsSvg += `
            <rect x="${x + tier.w * 0.15}" y="${y + tier.h * 0.3}" width="${tier.w * 0.7}" height="${tier.h * 0.35}" rx="3" fill="${spongeColor}" opacity="0.45" />
            <rect x="${x + tier.w * 0.25}" y="${y + tier.h * 0.68}" width="${tier.w * 0.5}" height="${tier.h * 0.2}" rx="2" fill="${spongeColor}" opacity="0.38" />
          `;
        }

        // Pearls toggle
        if (s.toppers.pearls) {
          const numPearls = Math.floor(tier.w / 10);
          for (let p = 0; p < numPearls; p++) {
            const px = x + p * 10 + 5;
            elementsSvg += `<circle cx="${px}" cy="${currentY - 2}" r="3" fill="#FFFFFF" stroke="#D7CCC8" stroke-width="0.8" />`;
            elementsSvg += `<circle cx="${px - 1}" cy="${currentY - 3}" r="1" fill="#FFFFFF" />`;
          }
        }

        // Gold Leaf Accents
        if (s.toppers.goldleaf) {
          const flakesCount = i === 0 ? 5 : 3;
          for (let g = 0; g < flakesCount; g++) {
            const gx = x + 12 + (g * (tier.w / flakesCount)) * 0.85;
            const gy = y + 8 + (g * 7) % (tier.h - 16);
            elementsSvg += `
              <polygon points="${gx},${gy} ${gx + 8},${gy + 3} ${gx + 5},${gy + 10} ${gx - 2},${gy + 6}" fill="#D4AF37" stroke="#FFF3B0" stroke-width="0.5" opacity="0.9" />
            `;
          }
        }
      }

      // Sugar Flowers Cascade
      if (s.toppers.flowers && !isCutView) {
        // Place a flower cluster on the right corner of each tier
        const flowerX = x + tier.w - 14;
        const flowerY = y + 4;
        elementsSvg += `
          <g class="flower-cluster" transform="translate(${flowerX}, ${flowerY}) scale(${isMini ? 0.65 : 1})">
            <!-- Leaf -->
            <path d="M 0,0 C 10,-15 25,-8 18,8 C 12,18 2,12 0,0 Z" fill="#689F38" opacity="0.85" />
            <path d="M 0,0 C -12,-12 -20,2 -10,12 Z" fill="#7CB342" opacity="0.75" />
            <!-- Peony Petals -->
            <circle cx="2" cy="0" r="9" fill="#F8BBD0" />
            <circle cx="-3" cy="-3" r="7" fill="#F48FB1" />
            <circle cx="4" cy="3" r="6" fill="#F06292" />
            <circle cx="1" cy="0" r="3.5" fill="#FFFDE7" />
          </g>
        `;
      }

      elementsSvg += `</g>`;
      currentY = y;
    });

    // Custom Monogram Topper on the top tier
    if (s.toppers.customTopper && !isCutView) {
      const topY = currentY;
      const topperStr = s.toppers.topperText || 'Forever';
      elementsSvg += `
        <g class="custom-cake-topper" transform="translate(${cx}, ${topY - 8})">
          <!-- Stick -->
          <line x1="0" y1="0" x2="0" y2="16" stroke="#D4AF37" stroke-width="2" />
          <!-- Acrylic Text/Ring -->
          <circle cx="0" cy="-22" r="24" fill="none" stroke="#D4AF37" stroke-width="2" />
          <text x="0" y="-18" text-anchor="middle" font-family="'Playfair Display', serif" font-size="${isMini ? '9' : '11'}" font-weight="bold" fill="#B8860B" font-style="italic">
            ${escapeHtml(topperStr)}
          </text>
        </g>
      `;
    }

    return `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#C5A059" />
            <stop offset="50%" stop-color="#FFF3B0" />
            <stop offset="100%" stop-color="#9B782E" />
          </linearGradient>
        </defs>
        ${elementsSvg}
      </svg>
    `;
  }

  // --- STAGE 3: BAKER'S STRUCTURAL NOTES & CUTTING GUIDE ---
  function renderBakersNotes() {
    if (!dom.blueprintSvg) return;

    if (dom.bakerTierCount) {
      dom.bakerTierCount.textContent = `${state.tiers} ${state.tiers === 1 ? 'Tier' : 'Tiers'}`;
    }

    // Dowels specs calculation
    const dowelCounts = { 1: 0, 2: 5, 3: 11, 4: 18 };
    const dowels = dowelCounts[state.tiers] || 5;

    if (dom.bakerCentralRodNote) {
      dom.bakerCentralRodNote.textContent = state.tiers === 1 ?
        'Single-tier construction: No central rod required. Base tier rests on 1/2" reinforced masonite board.' :
        `One 1/2" food-safe dowel rod driven through all ${state.tiers} tiers directly anchored into the 1/2" thick masonite bottom cake drum.`;
    }

    if (dom.bakerDowelsNote) {
      dom.bakerDowelsNote.textContent = state.tiers === 1 ?
        'No vertical perimeter doweling necessary for single tier.' :
        `${dowels} food-safe polypropylene perimeter dowels arranged in equidistant circles across underlying tiers, cut flush with buttercream surface.`;
    }

    // Draw Blueprint SVG
    dom.blueprintSvg.innerHTML = generateBlueprintSvg(state.tiers);

    // Draw Portion Cutting Guide SVG
    renderCuttingGuide();
  }

  function generateBlueprintSvg(tiers) {
    const w = 400;
    const h = 240;
    let svg = `
      <defs>
        <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#263544" stroke-width="0.8" />
        </pattern>
      </defs>
      <rect width="${w}" height="${h}" fill="#161F28" />
      <rect width="${w}" height="${h}" fill="url(#blueprintGrid)" />
    `;

    // Base Drum
    svg += `
      <!-- Base Drum -->
      <rect x="50" y="210" width="300" height="12" fill="#37474F" stroke="#00E5FF" stroke-width="1.5" />
      <text x="200" y="219" font-family="monospace" font-size="9" fill="#00E5FF" text-anchor="middle">1/2" REINFORCED MASONITE BASE DRUM</text>
    `;

    // Tiers and Dowels
    let startY = 210;
    const tierWidths = [220, 160, 110, 70];
    const tierH = 42;

    for (let t = 0; t < tiers; t++) {
      const tw = tierWidths[t];
      const tx = 200 - tw / 2;
      const ty = startY - tierH;

      // Tier outline
      svg += `
        <rect x="${tx}" y="${ty}" width="${tw}" height="${tierH}" fill="none" stroke="#00E5FF" stroke-width="1.5" stroke-dasharray="4,2" />
        <text x="${tx + 6}" y="${ty + 14}" font-family="monospace" font-size="9" fill="#80DEEA">TIER ${t + 1}: ${tw / 22}" DIAMETER</text>
      `;

      // Cake Board beneath tier (for upper tiers)
      if (t > 0) {
        svg += `
          <line x1="${tx}" y1="${ty + tierH}" x2="${tx + tw}" y2="${ty + tierH}" stroke="#FFD54F" stroke-width="2.5" />
        `;
      }

      // Perimeter Dowels in tier below
      if (t < tiers - 1) {
        const nextTw = tierWidths[t + 1];
        const d1 = 200 - nextTw / 2 + 10;
        const d2 = 200 + nextTw / 2 - 10;
        svg += `
          <!-- Dowels -->
          <line x1="${d1}" y1="${ty + 2}" x2="${d1}" y2="${ty + tierH}" stroke="#FF5252" stroke-width="3" />
          <line x1="${d2}" y1="${ty + 2}" x2="${d2}" y2="${ty + tierH}" stroke="#FF5252" stroke-width="3" />
          <line x1="200" y1="${ty + 2}" x2="200" y2="${ty + tierH}" stroke="#FF5252" stroke-width="3" />
        `;
      }

      startY = ty;
    }

    // Central Timber Rod through all
    if (tiers > 1) {
      svg += `
        <!-- Central Rod -->
        <line x1="200" y1="${startY - 6}" x2="200" y2="210" stroke="#FFD600" stroke-width="3" stroke-dasharray="6,3" />
        <circle cx="200" cy="${startY - 6}" r="4" fill="#FFD600" />
        <text x="210" y="${startY + 16}" font-family="monospace" font-size="8" fill="#FFD600">CENTRAL TIMBER SPIKE</text>
      `;
    }

    return svg;
  }

  function setCuttingMode(mode) {
    state.cuttingMode = mode;
    if (dom.btnWeddingCut) dom.btnWeddingCut.classList.toggle('active', mode === 'wedding');
    if (dom.btnPartyCut) dom.btnPartyCut.classList.toggle('active', mode === 'party');

    if (dom.cutDiagramCaption) {
      dom.cutDiagramCaption.innerHTML = mode === 'wedding' ?
        '<strong>Concentric Catering Cut (1" &times; 2" wedding slices):</strong> Cut an inner concentric ring 2 inches from the edge. Slice ring into 1-inch fingers. Slices center cylinder cleanly.' :
        '<strong>Party Wedge / Square Cut (1.5" &times; 2" generous portions):</strong> Traditional wedge cuts or cross-hatch squares for informal birthdays and celebrations.';
    }
    renderCuttingGuide();
  }

  function renderCuttingGuide() {
    if (!dom.cuttingGuideSvg) return;
    const isWedding = state.cuttingMode === 'wedding';
    const cx = 160;
    const cy = 110;
    const r = 85;

    let svg = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FAF5ED" stroke="#C5A059" stroke-width="2" />
    `;

    if (isWedding) {
      // Concentric inner circle
      svg += `
        <circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="#FFF8EE" stroke="#C5A059" stroke-width="1.8" stroke-dasharray="4,3" />
        <!-- Perimeter tick slices -->
      `;
      for (let a = 0; a < 360; a += 22.5) {
        const rad = (a * Math.PI) / 180;
        const x1 = cx + (r * 0.5) * Math.cos(rad);
        const y1 = cy + (r * 0.5) * Math.sin(rad);
        const x2 = cx + r * Math.cos(rad);
        const y2 = cy + r * Math.sin(rad);
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#D4AF37" stroke-width="1.2" />`;
      }
      // Inner circle slices
      svg += `
        <line x1="${cx - r * 0.5}" y1="${cy}" x2="${cx + r * 0.5}" y2="${cy}" stroke="#D4AF37" stroke-width="1.2" />
        <line x1="${cx}" y1="${cy - r * 0.5}" x2="${cx}" y2="${cy + r * 0.5}" stroke="#D4AF37" stroke-width="1.2" />
        <text x="${cx}" y="${cy + 4}" font-family="sans-serif" font-size="9" font-weight="bold" fill="#8C6A1E" text-anchor="middle">Center Core</text>
      `;
    } else {
      // Grid party cut
      const step = 28;
      for (let x = cx - r + step; x < cx + r; x += step) {
        svg += `<line x1="${x}" y1="${cy - r}" x2="${x}" y2="${cy + r}" stroke="#D4AF37" stroke-width="1.2" stroke-dasharray="3,2" />`;
      }
      for (let y = cy - r + step; y < cy + r; y += step) {
        svg += `<line x1="${cx - r}" y1="${y}" x2="${cx + r}" y2="${y}" stroke="#D4AF37" stroke-width="1.2" stroke-dasharray="3,2" />`;
      }
    }

    dom.cuttingGuideSvg.innerHTML = svg;
  }

  // --- STAGE 4: IMPORTANT CONSIDERATIONS CHECKLIST ---
  function updateChecklist() {
    const total = document.querySelectorAll('.interactive-check').length;
    const checked = document.querySelectorAll('.interactive-check:checked').length;
    if (dom.checklistCounter) {
      dom.checklistCounter.textContent = `${checked} of ${total} Verified`;
      dom.checklistCounter.style.background = checked === total ? '#E8F5E9' : '#F9F4EB';
      dom.checklistCounter.style.color = checked === total ? '#2E7D32' : '#C5A059';
    }
  }

  // --- STAGE 5: BLUEPRINT SPECIFICATION SHEET ---
  function renderBlueprintSummary() {
    if (dom.blueprintOrderId) dom.blueprintOrderId.textContent = `#${state.orderId}`;
    if (dom.modalOrderId) dom.modalOrderId.textContent = state.orderId;
    if (dom.successRefCode) dom.successRefCode.textContent = `#${state.orderId}`;

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (dom.blueprintDate) dom.blueprintDate.textContent = `Generated ${dateStr}`;

    // Occasion & Guest Count
    const occMap = {
      'wedding': 'Wedding & Elopement',
      'birthday': 'Milestone Birthday',
      'shower': 'Baby / Bridal Shower',
      'anniversary': 'Anniversary Celebration',
      'gala': 'Corporate Gala & Launch',
      'intimate': 'Intimate Gathering'
    };
    if (dom.summaryOccasionVal) {
      dom.summaryOccasionVal.textContent = `${occMap[state.occasion] || 'Celebration'} &bull; ${state.estimatedServings} Guests`;
    }

    // Aesthetic
    const aesMap = {
      'botanical': 'Botanical & Fresh Flora',
      'lambeth': 'Vintage Victorian Lambeth Piping',
      'geometric': 'Modern Marble & Geometric',
      'textured': 'Textured Palette Knife Buttercream',
      'metallic': '24K Gold Leaf & Metallic Luxe',
      'rustic': 'Semi-Naked & Rustic Woods'
    };
    if (dom.summaryAestheticVal) {
      dom.summaryAestheticVal.textContent = aesMap[state.aesthetic] || 'Artisan Custom';
    }

    // Tier table
    if (dom.summaryTiersTable) {
      dom.summaryTiersTable.innerHTML = state.tierSizes.map((tier, idx) => `
        <div class="tier-row">
          <span>Tier ${idx + 1} (${idx === 0 ? 'Base Tier' : 'Upper Tier'})</span>
          <strong>${tier}</strong>
        </div>
      `).join('');
    }

    // Flavor
    const flv = flavorCatalog[state.flavor];
    if (dom.summaryFlavorVal && flv) {
      dom.summaryFlavorVal.textContent = flv.name;
    }

    // Dietary
    if (dom.summaryDietaryTags) {
      if (state.dietary.length === 0) {
        dom.summaryDietaryTags.innerHTML = '<span class="diet-tag" style="background: #F5F5F5; color: #666; border-color: #DDD;">Standard Formulation (Zero Dietary Exclusions)</span>';
      } else {
        dom.summaryDietaryTags.innerHTML = state.dietary.map(d => `
          <span class="diet-tag">${capitalize(d.replace('-', ' '))} Protocol</span>
        `).join('');
      }
    }

    // Palette Dot & Notes
    if (dom.palDotColor) dom.palDotColor.style.background = state.icingColor;
    if (dom.palAccentNotes) {
      const accents = [];
      if (state.toppers.goldleaf) accents.push('24K Gold Leaf');
      if (state.toppers.flowers) accents.push('Botanical Blooms');
      if (state.toppers.pearls) accents.push('Sugar Pearls');
      if (state.toppers.customTopper) accents.push('Monogram Topper');
      dom.palAccentNotes.textContent = `${state.icingColorName} • ${accents.join(' • ') || 'Clean Silk'}`;
    }

    // Pricing items
    if (dom.priceTierDesc) {
      dom.priceTierDesc.textContent = `${state.tiers}-Tier Handcrafted Sponge & Swiss Buttercream`;
    }
    if (dom.priceDecorDesc) {
      dom.priceDecorDesc.textContent = `Artisan Accents (${state.surfaceFinish} finish & toppers)`;
    }
  }

  // --- STAGE NAVIGATION ---
  function goToStage(stageNum) {
    if (stageNum < 1 || stageNum > 5) return;
    state.currentStage = stageNum;

    // Toggle Stage visibility
    for (let i = 1; i <= 5; i++) {
      const stageEl = document.getElementById(`stage-${i}`);
      const navEl = document.getElementById(`step-nav-${i}`);
      if (stageEl) stageEl.classList.toggle('active', i === stageNum);

      if (navEl) {
        navEl.classList.toggle('active', i === stageNum);
        navEl.classList.toggle('completed', i < stageNum);
      }
    }

    // Render corresponding visuals
    if (stageNum === 2) {
      renderVisualizer();
      updateRecommendationsText();
    } else if (stageNum === 3) {
      renderBakersNotes();
    } else if (stageNum === 5) {
      renderBlueprintSummary();
      updateShareUrlDisplay();
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // --- SHAREABLE URL & STATE SERIALIZATION ---
  function updateShareUrlDisplay() {
    const encoded = encodeState();
    // Use the workspace file path or current location
    let basePath = window.location.href.split('#')[0];
    if (basePath.startsWith('http') || basePath.startsWith('file')) {
      // retain path
    } else {
      basePath = 'file:///c:/Users/hp/Desktop/HTML/cake-studio/index.html';
    }
    const fullUrl = `${basePath}#design=${encoded}`;
    if (dom.shareableUrlInput) {
      dom.shareableUrlInput.value = fullUrl;
    }
  }

  function encodeState() {
    const minState = {
      id: state.orderId,
      o: state.occasion,
      g: state.guestCount,
      t: state.tiers,
      a: state.aesthetic,
      f: state.flavor,
      d: state.dietary,
      c: state.icingColor,
      cn: state.icingColorName,
      s: state.surfaceFinish,
      top: state.toppers
    };
    return encodeURIComponent(btoa(JSON.stringify(minState)));
  }

  function parseUrlState() {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('design=')) {
        const payload = hash.split('design=')[1];
        const jsonStr = atob(decodeURIComponent(payload));
        const s = JSON.parse(jsonStr);

        if (s.id) state.orderId = s.id;
        if (s.o) state.occasion = s.o;
        if (s.g) state.guestCount = s.g;
        if (s.t) state.tiers = s.t;
        if (s.a) state.aesthetic = s.a;
        if (s.f) state.flavor = s.f;
        if (s.d) state.dietary = s.d;
        if (s.c) state.icingColor = s.c;
        if (s.cn) state.icingColorName = s.cn;
        if (s.s) state.surfaceFinish = s.s;
        if (s.top) state.toppers = s.top;

        // Sync inputs
        syncInputsWithState();
      }
    } catch (err) {
      console.warn('Could not parse shared URL design parameters', err);
    }
  }

  function syncInputsWithState() {
    if (dom.guestSlider) dom.guestSlider.value = state.guestCount;
    
    // Check radio
    const occRadio = document.querySelector(`input[name="occasion"][value="${state.occasion}"]`);
    if (occRadio) occRadio.checked = true;

    const aesRadio = document.querySelector(`input[name="aesthetic"][value="${state.aesthetic}"]`);
    if (aesRadio) aesRadio.checked = true;

    const flvRadio = document.querySelector(`input[name="flavor"][value="${state.flavor}"]`);
    if (flvRadio) flvRadio.checked = true;

    document.querySelectorAll('input[name="dietary"]').forEach(cb => {
      cb.checked = state.dietary.includes(cb.value);
    });
  }

  function copyShareLink() {
    updateShareUrlDisplay();
    const input = dom.shareableUrlInput;
    if (input) {
      input.select();
      input.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(input.value).then(() => {
        showToast('Link copied to clipboard! Share or save your design.');
      }).catch(() => {
        showToast('Design link selected! Press Ctrl+C to copy.');
      });
    }
  }

  function showToast(msg) {
    if (!dom.toastMsg) return;
    if (dom.toastText) dom.toastText.textContent = msg;
    dom.toastMsg.classList.add('show');
    setTimeout(() => {
      dom.toastMsg.classList.remove('show');
    }, 3200);
  }

  // --- MODALS & PRESETS ---
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'flex';
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'none';
  }

  function applyPreset(presetKey) {
    const p = presets[presetKey];
    if (!p) return;

    state.occasion = p.occasion;
    state.guestCount = p.guestCount;
    state.tiers = p.tiers;
    state.aesthetic = p.aesthetic;
    state.flavor = p.flavor;
    state.dietary = p.dietary;
    state.budgetTier = p.budgetTier;
    state.icingColor = p.icingColor;
    state.icingColorName = p.icingColorName;
    state.surfaceFinish = p.surfaceFinish;
    state.toppers = { ...p.toppers };

    syncInputsWithState();
    recalculateFromGuestCount(state.guestCount);
    adaptStyleFromAesthetic(state.aesthetic);
    closeModal('presets-modal');
    goToStage(2);
    showToast(`Loaded Preset: "${capitalize(presetKey.replace('-', ' '))}"`);
  }

  function openInquiryModal() {
    const inquiryWrap = document.getElementById('inquiry-form-wrap');
    const successWrap = document.getElementById('inquiry-success-wrap');
    if (inquiryWrap) inquiryWrap.style.display = 'block';
    if (successWrap) successWrap.style.display = 'none';
    openModal('inquiry-modal');
  }

  function submitInquiry() {
    const inquiryWrap = document.getElementById('inquiry-form-wrap');
    const successWrap = document.getElementById('inquiry-success-wrap');
    if (inquiryWrap) inquiryWrap.style.display = 'none';
    if (successWrap) successWrap.style.display = 'block';
  }

  function renderAll() {
    recalculateTierSizes();
    recalculatePricing();
    renderVisualizer();
    renderBakersNotes();
    renderCuttingGuide();
    renderBlueprintSummary();
  }

  // Utility helpers
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  let introTimer = null;

  function handleIntroSequence() {
    introTimer = setTimeout(() => {
      dismissIntro();
    }, 2800);
  }

  function dismissIntro() {
    if (introTimer) clearTimeout(introTimer);
    const curtain = document.getElementById('studio-intro-curtain');
    if (curtain) {
      curtain.classList.add('opened');
    }
    const hero = document.getElementById('hero-welcome');
    if (hero) {
      hero.classList.add('hero-animated');
    }
  }

  function replayIntro() {
    const curtain = document.getElementById('studio-intro-curtain');
    if (curtain) {
      curtain.classList.remove('opened');
      const fill = document.getElementById('intro-progress-fill');
      if (fill) {
        fill.style.animation = 'none';
        void fill.offsetHeight; // force reflow
        fill.style.animation = 'fillProgress 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
      }
      handleIntroSequence();
    }
  }

  function startDesign() {
    goToStage(1);
    const stageEl = document.getElementById('stage-1');
    if (stageEl) {
      stageEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Public API
  return {
    init,
    startDesign,
    dismissIntro,
    replayIntro,
    goToStage,
    setCuttingMode,
    updateChecklist,
    applyPreset,
    applyAltStyle,
    openModal,
    closeModal,
    openInquiryModal,
    submitInquiry,
    copyShareLink
  };
})();

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  CakeApp.init();
});
