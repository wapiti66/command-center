// ─── Base de Connaissance Agent Trader XAUUSD ─────────────────────────────────
// Source : 11 PDFs de formation — SMC / ICT / OlinVest / TradingSociety

// ─── 1. CORRÉLATIONS XAUUSD ───────────────────────────────────────────────────

export const CORRELATIONS = {
  negative: [
    { pair: 'DXY',    description: 'Dollar Index — corrélation inverse forte. DXY monte → Or baisse. Surveiller NFP, CPI, FOMC.' },
    { pair: 'EURUSD', description: 'EUR/USD monte quand DXY baisse → souvent haussier pour Or.' },
    { pair: 'US10Y',  description: 'Rendements obligataires US : hausse des taux = pression baissière sur Or.' },
  ],
  positive: [
    { pair: 'AUD/USD', description: 'Corrélation positive. AUD = devise matière première. AUD/USD haussier → Or souvent haussier.' },
    { pair: 'NZD/USD', description: 'Corrélation positive similaire à AUD.' },
    { pair: 'XAG/USD', description: 'Argent : même direction que Or en général.' },
  ],
  notes: [
    "Or = actif refuge (safe haven) — monte en période de risque géopolitique ou incertitude",
    "Surveiller sessions : London + NY AM pour volatilité maximale sur XAUUSD",
    "Heures de forte liquidité Or : 08h00-17h00 Paris (Londres + New York overlap)",
  ],
}

// ─── 2. KILL ZONES (Heures de Trading Optimales) ──────────────────────────────

export const KILL_ZONES = {
  asian: {
    label:   'Kill Zone Asiatique',
    start:   '02:00',
    end:     '06:00',
    tz:      'Paris (CET/CEST)',
    role:    'Formation de liquidité — faible volume — range étroit',
    action:  'Identifier les extrêmes du range asiatique (High / Low). Ces niveaux seront sweepés par Londres.',
    color:   '#9b59ff',
  },
  london: {
    label:   'Kill Zone Londres',
    start:   '08:00',
    end:     '11:00',
    tz:      'Paris (CET/CEST)',
    role:    'Manipulation + initiation tendance — fort volume',
    action:  'Attendre le sweep de la liquidité asiatique (BSL ou SSL), puis chercher entrée en sens opposé du sweep.',
    color:   '#0066ff',
  },
  newYorkAM: {
    label:   'Kill Zone New York AM',
    start:   '13:00',
    end:     '16:00',
    tz:      'Paris (CET/CEST)',
    role:    'Continuation de tendance — fort volume — nouvelles macro',
    action:  'Confirmer la direction établie par Londres. Chercher entrées sur retracements FVG / OTE / Order Blocks.',
    color:   '#00d68f',
  },
  newYorkPM: {
    label:   'Kill Zone New York PM',
    start:   '18:00',
    end:     '20:00',
    tz:      'Paris (CET/CEST)',
    role:    'Faible volume — éviter nouveaux trades',
    action:  'Gérer positions ouvertes uniquement. Ne pas initier de nouvelles entrées.',
    color:   '#ff6b6b',
  },
}

// ─── 3. STRUCTURE DE MARCHÉ (SMC) ─────────────────────────────────────────────

export const MARKET_STRUCTURE = {
  concepts: {
    BMS: {
      label:   'Break of Market Structure (BMS / BOS)',
      definition: 'Cassure d\'un swing high (haussier) ou swing low (baissier) précédent. Confirme un changement ou continuation de tendance.',
      bullish: 'Prix casse au-dessus du dernier Higher High → structure haussière confirmée.',
      bearish: 'Prix casse en-dessous du dernier Lower Low → structure baissière confirmée.',
    },
    expansion: {
      label:   'Phase d\'Expansion',
      definition: 'Mouvement impulsif directionnel fort après un BMS. Le prix avance rapidement avec peu de correction.',
    },
    retracement: {
      label:   'Phase de Retracement / Mitigation',
      definition: 'Après l\'expansion, le prix revient corriger vers un niveau clé (FVG, OTE, Order Block, zone S/D) avant de repartir.',
    },
    cycle: 'BMS → Expansion → Retracement (vers OTE/FVG/OB) → Nouvelle Expansion',
  },

  liquidity: {
    BSL: {
      label:   'Buy Side Liquidity (BSL)',
      definition: 'Stop-loss clusters AU-DESSUS des hauts — stop des vendeurs à découvert.',
      levels:  ['PMH — Previous Month High', 'PWH — Previous Week High', 'PDH — Previous Day High', 'HOD — High of Day', 'Égaux Hauts (EQH)'],
      action:  'Le prix monte pour sweeper la BSL → anticiper retournement baissier après sweep.',
    },
    SSL: {
      label:   'Sell Side Liquidity (SSL)',
      definition: 'Stop-loss clusters EN-DESSOUS des bas — stop des acheteurs.',
      levels:  ['PML — Previous Month Low', 'PWL — Previous Week Low', 'PDL — Previous Day Low', 'LOD — Low of Day', 'Égaux Bas (EQL)'],
      action:  'Le prix descend pour sweeper la SSL → anticiper retournement haussier après sweep.',
    },
    EQH: {
      label:   'Equal Highs (EQH)',
      definition: 'Deux hauts ou plus au même niveau = pool de liquidité majeur au-dessus.',
    },
    EQL: {
      label:   'Equal Lows (EQL)',
      definition: 'Deux bas ou plus au même niveau = pool de liquidité majeur en-dessous.',
    },
    stopHunt: {
      label:   'Stop Hunt / Liquidity Sweep',
      definition: 'Mouvement bref au-delà d\'un niveau de liquidité pour déclencher les stops, suivi d\'un retournement rapide.',
      confirmation: 'Mèche de bougie qui perce le niveau + clôture en sens opposé = confirmation du sweep.',
    },
  },
}

// ─── 4. OPR — OPEN PRICE RANGE ────────────────────────────────────────────────

export const OPR = {
  label:       'Open Price Range',
  definition:  'Range formé par les 15 premières minutes de la session (High et Low). Signal directionnel pour la journée.',
  timeframes:  ['M15 — pour délimiter l\'OPR', 'H1 — pour confirmer la direction'],
  rules: [
    'Cassure au-dessus de l\'OPR High → biais haussier pour la session',
    'Cassure en-dessous de l\'OPR Low → biais baissier pour la session',
    'OPR High et Low = niveaux de support/résistance intrajournaliers',
    'Utiliser OPR London (08:00-08:15 Paris) pour la session européenne',
    'Utiliser OPR NY (13:30-13:45 Paris) pour la session américaine',
  ],
  entry:       'Attendre la cassure + retest de l\'OPR High/Low avant entrée',
  sl:          'Au-delà de l\'extrême opposé de l\'OPR',
  tp:          '1:2 minimum; cibler le prochain niveau de liquidité (EQH/EQL, PDH/PDL)',
}

// ─── 5. OTE — OPTIMAL TRADE ENTRY ─────────────────────────────────────────────

export const OTE = {
  label:       'Optimal Trade Entry',
  definition:  'Zone de retracement optimale sur le mouvement impulsif précédent — Fibonacci 0.62 à 0.79.',
  fibLevels: {
    0.62:  'Limite basse de la zone OTE',
    0.705: 'Niveau idéal OTE — ratio 1:2 ou mieux assuré',
    0.79:  'Limite haute de la zone OTE',
  },
  howTo: [
    '1. Identifier le swing Low → swing High (ou High → Low) du dernier mouvement impulsif',
    '2. Tracer Fibonacci de Low à High (long) ou High à Low (short)',
    '3. Zone OTE = entre 0.62 et 0.79',
    '4. Chercher confluences dans la zone : FVG + OTE, Order Block + OTE',
    '5. Entrée en limite ou au break de structure sur M5/M15 dans la zone',
  ],
  sl:          'Au-dessous du swing Low (long) ou au-dessus du swing High (short)',
  tp:          'Au sommet du swing précédent, puis prochain niveau de liquidité',
  confluence:  ['FVG dans la zone OTE', 'Order Block dans la zone OTE', 'Volume POC dans la zone OTE'],
}

// ─── 6. FAIR VALUE GAP (FVG) ──────────────────────────────────────────────────

export const FVG = {
  label:       'Fair Value Gap',
  definition:  'Déséquilibre de prix créé par un mouvement fort en 3 bougies. Zone entre le haut de la bougie 1 et le bas de la bougie 3.',
  formation: [
    'Bougie 1 : mèche haute définit le bas du gap',
    'Bougie 2 : forte bougie impulsive (corps large)',
    'Bougie 3 : mèche basse définit le haut du gap',
    'FVG = espace entre [High bougie 1] et [Low bougie 3]',
  ],
  bullishFVG:  'FVG haussier : le prix revient dans la zone → entrée Long',
  bearishFVG:  'FVG baissier : le prix revient dans la zone → entrée Short',
  rules: [
    'Toujours trader dans le sens de la tendance principale',
    'FVG sur H1/H4 > FVG sur M15 (plus fiable)',
    'Le prix tend à remplir le FVG avant de continuer (50% de remplissage = signal)',
    'FVG + Zone S/D = confluence forte',
    'FVG non rempli au-dessus = résistance; FVG non rempli en-dessous = support',
  ],
  entry:       'Ordre limite au milieu ou au début du FVG',
  sl:          'Au-delà du FVG (invalidation)',
  tp:          'Prochain FVG opposé, niveau de liquidité, ou dernier high/low',
}

// ─── 7. ORDER BLOCKS ──────────────────────────────────────────────────────────

export const ORDER_BLOCKS = {
  label:       'Order Blocks',
  definition:  'Dernière bougie baissière avant un mouvement haussier fort (OB haussier), ou dernière bougie haussière avant un mouvement baissier fort (OB baissier). Représente les ordres institutionnels.',
  bullishOB: {
    definition: 'Dernière bougie rouge (baissière) avant expansion haussière',
    entry:      'Entrée Long quand le prix revient tester l\'OB haussier',
    sl:         'En-dessous du bas de l\'OB',
    tp:         'Prochain niveau de résistance / BSL',
  },
  bearishOB: {
    definition: 'Dernière bougie verte (haussière) avant expansion baissière',
    entry:      'Entrée Short quand le prix revient tester l\'OB baissier',
    sl:         'Au-dessus du haut de l\'OB',
    tp:         'Prochain niveau de support / SSL',
  },
  rules: [
    'OB sur H4/Daily = plus fiable que M15',
    'OB + FVG dans la même zone = confluence majeure',
    'OB + OTE = setup haute probabilité',
    'Invalider OB si prix clôture au-delà sans rebond',
  ],
}

// ─── 8. STRATÉGIE AIMC ────────────────────────────────────────────────────────

export const AIMC = {
  label:       'AIMC — Range → Initiation → Mitigation → Continuation',
  steps: {
    A: {
      label:       'A — Accumulation (Range)',
      description: 'Phase de consolidation. Le prix oscille dans un range défini. Identifier High et Low du range.',
      action:      'Marquer le High et Low du range. Attendre la cassure.',
    },
    I: {
      label:       'I — Initiation (Break of Structure)',
      description: 'Le prix casse au-delà du range (BOS). Mouvement impulsif hors de l\'accumulation.',
      action:      'Confirmer la cassure avec une clôture de bougie au-delà du range.',
    },
    M: {
      label:       'M — Mitigation (Retracement)',
      description: 'Le prix revient retester le range cassé (ex-résistance devient support). Zone optimale d\'entrée.',
      action:      'Placer ordre limite au niveau du haut/bas du range precedent. Confirmation M5/M15 requise.',
    },
    C: {
      label:       'C — Continuation',
      description: 'Le prix repart dans la direction de l\'initiation. Mouvement vers le prochain objectif.',
      action:      'Laisser courir la position vers le TP. Ajuster SL en break-even après 1:1.',
    },
  },
  entry:       'Ordre limite sur le niveau du range à l\'étape M',
  sl:          '10-15 pips au-delà du bas du range (long) ou haut du range (short)',
  tp:          'Extension 1:2 ou 1:3 depuis l\'entrée',
  notes:       'Stratégie valide sur M15, H1, H4. Plus fiable avec kill zones (London, NY AM).',
}

// ─── 9. SUPPLY & DEMAND ZONES ─────────────────────────────────────────────────

export const SUPPLY_DEMAND = {
  demandZone: {
    label:       'Zone de Demande (Demand Zone)',
    definition:  'Zone de consolidation avant un mouvement haussier fort. Institutions achètent dans cette zone.',
    formation:   'Consolidation (plusieurs bougies) → bougie d\'expansion haussière → départ rapide',
    entry:       'Long quand le prix revient dans la zone de demande',
    sl:          'En-dessous du bas de la zone de demande',
    tp:          'Prochain niveau de résistance / Supply Zone',
    invalidation:'Clôture de bougie en-dessous de la zone → invalider',
  },
  supplyZone: {
    label:       'Zone d\'Offre (Supply Zone)',
    definition:  'Zone de consolidation avant un mouvement baissier fort. Institutions vendent dans cette zone.',
    formation:   'Consolidation (plusieurs bougies) → bougie d\'expansion baissière → départ rapide',
    entry:       'Short quand le prix revient dans la zone d\'offre',
    sl:          'Au-dessus du haut de la zone d\'offre',
    tp:          'Prochain niveau de support / Demand Zone',
    invalidation:'Clôture de bougie au-dessus de la zone → invalider',
  },
  rules: [
    'Zone D/S sur H4/Daily > zone D/S sur M15 (timeframe supérieur prime)',
    'Zone touchée 1x = plus forte que zone touchée 3x (qui s\'affaiblit)',
    'Distance depuis la zone : plus le prix revient vite, plus la zone est forte',
    'FVG dans la zone S/D = double confluence',
    'Volume Profile POC dans la zone = triple confluence',
  ],
}

// ─── 10. VOLUME PROFILE ───────────────────────────────────────────────────────

export const VOLUME_PROFILE = {
  POC: {
    label:       'Point of Control (POC)',
    definition:  'Prix où le plus grand volume a été échangé sur la période. Fort niveau de support/résistance.',
    usage:       'Le prix revient souvent tester le POC. POC = niveau d\'équilibre institutionnel.',
  },
  valueArea: {
    label:       'Value Area (VA)',
    definition:  '70% du volume total échangé entre VAH et VAL.',
    VAH:         'Value Area High — résistance supérieure',
    VAL:         'Value Area Low — support inférieur',
    rule:        'Prix en dehors de la Value Area → probabilité de retour dans la VA (mean reversion)',
  },
  HVN: {
    label:       'High Volume Node (HVN)',
    definition:  'Zone de fort volume = attraction forte. Prix ralentit ou se retourne dans les HVN.',
  },
  LVN: {
    label:       'Low Volume Node (LVN)',
    definition:  'Zone de faible volume = le prix traverse rapidement. Peu de résistance dans ces zones.',
  },
  usage: [
    'POC Daily = niveau de référence pour la journée',
    'Prix au-dessus POC + BOS haussier → biais long',
    'Prix en-dessous POC + BOS baissier → biais short',
    'POC + FVG dans la même zone = confluence forte pour entrée',
    'POC + OTE = setup haute probabilité',
  ],
}

// ─── 11. CHECKLIST D'ENTRÉE ───────────────────────────────────────────────────

export const ENTRY_CHECKLIST = {
  label:       'Checklist de Trading XAUUSD',
  pre_session: [
    '✓ Vérifier le biais macro : DXY direction, nouvelles macro du jour',
    '✓ Identifier les niveaux clés Daily/Weekly : PDH, PDL, PWH, PWL, PMH, PML',
    '✓ Marquer les zones S/D actives sur H4/Daily',
    '✓ Marquer les FVG non remplis sur H4/H1',
    '✓ Marquer le POC Daily du Volume Profile',
    '✓ Déterminer le biais directionnel (haussier/baissier)',
  ],
  kill_zone: [
    '✓ Attendre la Kill Zone (London 08h00 ou NY 13h30)',
    '✓ Observer le sweep de liquidité (BSL ou SSL sweeped)',
    '✓ Confirmer BMS sur M15 après le sweep',
    '✓ Identifier la zone POI (FVG / OB / S/D / OTE)',
  ],
  entry: [
    '✓ Prix entre 0.62-0.79 Fibonacci du dernier mouvement (OTE)',
    '✓ Au moins une confluence : FVG + OTE, OB + OTE, ou S/D + OTE',
    '✓ Signal M5/M15 : bougie englobante, pin bar, ou BMS M5',
    '✓ Volume confirm (si disponible) : hausse du volume sur le signal',
    '✓ SL défini (en-dessous du swing low pour long)',
    '✓ TP défini avec ratio minimum 1:2',
  ],
  management: [
    '✓ Déplacer SL en break-even après 1:1 de profit',
    '✓ Fermer 50% position au premier TP',
    '✓ Laisser courir 50% vers TP final',
    '✓ Ne pas trader pendant NY PM (après 17h00 Paris)',
    '✓ Respecter le risque maximum : 1-2% du capital par trade',
  ],
}

// ─── 12. GESTION DES RISQUES ──────────────────────────────────────────────────

export const RISK_MANAGEMENT = {
  maxRiskPerTrade:  '1-2% du capital',
  minRiskReward:    '1:2',
  idealRiskReward:  '1:3 ou plus',
  maxDailyLoss:     '5% du capital (arrêt de trading)',
  maxOpenPositions: 2,
  slPlacement: [
    'Long : SL 5-10 pips en-dessous du swing Low de référence',
    'Short : SL 5-10 pips au-dessus du swing High de référence',
    'Jamais SL inférieur à 15 pips pour XAUUSD (volatilité)',
  ],
  tpStrategy: [
    'TP1 (50% position) : ratio 1:1.5 → déplacer SL en BE',
    'TP2 (50% restant) : ratio 1:3 ou prochain niveau de liquidité',
    'Alternative : fermeture totale au premier TP avec ratio 1:2+',
  ],
  rules: [
    'Ne jamais ajouter à une position perdante',
    'Un trade manqué = opportunité préservée, pas une perte',
    'Qualité > Quantité : 2-3 trades haute probabilité par semaine',
    'Session asiatique : pas de nouvelles entrées (sauf rare setup)',
  ],
}

// ─── 13. SETUPS PRIORITAIRES XAUUSD ──────────────────────────────────────────

export const SETUPS = [
  {
    id:       'OTE_FVG_London',
    label:    'OTE + FVG London Sweep',
    priority: 1,
    steps: [
      'Asian range identifié (High/Low)',
      'London sweeps BSL ou SSL du range asiatique',
      'BMS M15 confirmé post-sweep',
      'Retracement vers OTE (0.62-0.79) + FVG H1',
      'Signal M5 : bougie englobante dans la zone',
      'Entrée, SL sous swing low, TP au liquidity level suivant',
    ],
    conditions: ['Kill Zone Londres 08h00-11h00', 'Ratio 1:2 minimum', 'Biais Daily aligné'],
  },
  {
    id:       'AIMC_NY',
    label:    'AIMC New York Continuation',
    priority: 2,
    steps: [
      'Range pré-London identifié',
      'Initiation : BOS London dans la direction du biais Daily',
      'Mitigation NY : retest du range London cassé',
      'Entrée ordre limite au niveau range cassé + FVG',
      'TP : extension 1.5x ou 2x du range',
    ],
    conditions: ['Kill Zone NY 13h30-16h00', 'Direction alignée avec London', 'Ratio 1:2 minimum'],
  },
  {
    id:       'OB_SD_Confluence',
    label:    'Order Block + Supply/Demand H4',
    priority: 3,
    steps: [
      'Zone S/D H4 active identifiée',
      'Order Block à l\'intérieur de la zone S/D',
      'FVG non rempli dans la zone',
      'Prix arrive dans la zone pendant Kill Zone',
      'Signal M15 : pin bar ou bougie englobante',
      'Entrée, SL sous zone S/D, TP prochain niveau',
    ],
    conditions: ['H4/Daily alignment', 'Volume POC proche de la zone', 'Ratio 1:3 minimum'],
  },
  {
    id:       'Liquidity_Sweep_Reversal',
    label:    'Liquidity Sweep Reversal',
    priority: 4,
    steps: [
      'Identifier EQH ou EQL sur H1',
      'Prix sweeps le niveau (mèche au-delà)',
      'Clôture de bougie en sens opposé (confirmation)',
      'BMS M15 en sens opposé du sweep',
      'Entrée sur retracement vers OTE / FVG',
      'TP au niveau de liquidité opposé',
    ],
    conditions: ['Mèche claire au-delà du niveau', 'Clôture au-delà = invalide setup', 'Ratio 1:2 minimum'],
  },
]

// ─── EXPORT GROUPÉ ────────────────────────────────────────────────────────────

export const TRADER_KNOWLEDGE_BASE = {
  version:         '1.0.0',
  instrument:      'XAUUSD (Gold / US Dollar)',
  methodology:     'SMC — Smart Money Concepts + ICT Concepts',
  sources:         ['OlinVest', 'TradingSociety', 'ICT Inner Circle Trader'],
  correlations:    CORRELATIONS,
  killZones:       KILL_ZONES,
  marketStructure: MARKET_STRUCTURE,
  opr:             OPR,
  ote:             OTE,
  fvg:             FVG,
  orderBlocks:     ORDER_BLOCKS,
  aimc:            AIMC,
  supplyDemand:    SUPPLY_DEMAND,
  volumeProfile:   VOLUME_PROFILE,
  entryChecklist:  ENTRY_CHECKLIST,
  riskManagement:  RISK_MANAGEMENT,
  setups:          SETUPS,
}

export default TRADER_KNOWLEDGE_BASE
