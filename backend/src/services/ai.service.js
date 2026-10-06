const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env');
const ServiceCategory = require('../models/ServiceCategory');
const Skill = require('../models/Skill');

const keywordMap = [
  { keyword: 'ac', problemType: 'Air Conditioner Servicing & Gas Top-up', urgency: 'HIGH' },
  { keyword: 'refrigerator', problemType: 'Refrigerator Cooling & Gasket Repair', urgency: 'HIGH' },
  { keyword: 'fridge', problemType: 'Refrigerator Cooling & Gasket Repair', urgency: 'HIGH' },
  { keyword: 'mixer', problemType: 'Mixer Grinder Motor Repair or Blade Replacement', urgency: 'NORMAL' },
  { keyword: 'mixie', problemType: 'Mixer Grinder Repair', urgency: 'NORMAL' },
  { keyword: 'grinder', problemType: 'Wet Grinder Service & Repair', urgency: 'NORMAL' },
  { keyword: 'geyser', problemType: 'Water Geyser Heating Element or Thermostat Repair', urgency: 'HIGH' },
  { keyword: 'water heater', problemType: 'Water Geyser Repair', urgency: 'HIGH' },
  { keyword: 'water purifier', problemType: 'RO Water Purifier Filter Change or Service', urgency: 'HIGH' },
  { keyword: 'ro', problemType: 'RO Water Purifier Service', urgency: 'HIGH' },
  { keyword: 'aquaguard', problemType: 'Water Purifier Repair', urgency: 'HIGH' },
  { keyword: 'chimney', problemType: 'Kitchen Chimney Motor Cleaning or Repair', urgency: 'NORMAL' },
  { keyword: 'inverter', problemType: 'Home Inverter Battery Charging Issue', urgency: 'HIGH' },
  { keyword: 'ups', problemType: 'Inverter/UPS Repair', urgency: 'HIGH' },
  { keyword: 'fan', problemType: 'Ceiling Fan Motor or Capacitor Repair', urgency: 'NORMAL' },
  { keyword: 'switch', problemType: 'Electrical Switchboard or Wiring Repair', urgency: 'HIGH' },
  { keyword: 'mcb', problemType: 'MCB Tripping or Electrical Fault', urgency: 'EMERGENCY' },
  { keyword: 'tap', problemType: 'Water Tap Leakage or Replacement', urgency: 'HIGH' },
  { keyword: 'leak', problemType: 'Water Leakage or Pipe Repair', urgency: 'HIGH' },
  { keyword: 'sink', problemType: 'Kitchen Sink Drain Blockage or Leak Repair', urgency: 'NORMAL' },
  { keyword: 'flush', problemType: 'Toilet Flush Tank Repair', urgency: 'HIGH' },
  { keyword: 'door', problemType: 'Door Hinge, Lock or Handle Repair', urgency: 'NORMAL' },
  { keyword: 'window', problemType: 'Window Glass or Frame Repair', urgency: 'NORMAL' },
  { keyword: 'mesh', problemType: 'Mosquito Mesh Installation or Repair', urgency: 'NORMAL' },
  { keyword: 'paint', problemType: 'Wall Painting or Touch-up Work', urgency: 'NORMAL' },
  { keyword: 'painting', problemType: 'Wall Painting or Touch-up Work', urgency: 'NORMAL' },
  { keyword: 'wall paint', problemType: 'Wall Painting or Touch-up Work', urgency: 'NORMAL' },
  { keyword: 'interior paint', problemType: 'Interior Wall Painting', urgency: 'NORMAL' },
  { keyword: 'exterior paint', problemType: 'Exterior Wall Painting', urgency: 'NORMAL' },
  { keyword: 'touch-up', problemType: 'Wall Touch-up Work', urgency: 'NORMAL' },
  { keyword: 'color', problemType: 'Wall Painting or Color Change', urgency: 'NORMAL' },
  { keyword: 'finish', problemType: 'Surface Finishing', urgency: 'NORMAL' },
  { keyword: 'carpenter', problemType: 'Furniture Assembly or Repair', urgency: 'NORMAL' },
  { keyword: 'plumber', problemType: 'General Plumbing Repair or Installation', urgency: 'HIGH' },
  { keyword: 'electrician', problemType: 'General Electrical Repair or Installation', urgency: 'HIGH' },
  { keyword: 'wire', problemType: 'Electrical Wiring Issue', urgency: 'HIGH' },
  { keyword: 'socket', problemType: 'Electrical Socket Repair', urgency: 'NORMAL' },
  { keyword: 'light', problemType: 'Lighting Repair or Installation', urgency: 'NORMAL' },
  { keyword: 'fuse', problemType: 'Electrical Fuse Replacement', urgency: 'HIGH' },
  { keyword: 'circuit', problemType: 'Circuit Breaker Repair', urgency: 'EMERGENCY' },
  { keyword: 'drain', problemType: 'Drain Unblocking', urgency: 'HIGH' },
  { keyword: 'toilet', problemType: 'Toilet Repair', urgency: 'HIGH' },
  { keyword: 'compressor', problemType: 'AC Compressor Repair', urgency: 'HIGH' },
  { keyword: 'thermostat', problemType: 'Thermostat Repair', urgency: 'NORMAL' },
  { keyword: 'washing machine', problemType: 'Washing Machine Repair', urgency: 'NORMAL' },
  { keyword: 'deep', problemType: 'Deep Cleaning Service', urgency: 'NORMAL' },
  { keyword: 'carpet', problemType: 'Carpet Cleaning', urgency: 'NORMAL' },
  { keyword: 'cleaning', problemType: 'Deep House Cleaning or Bathroom Cleaning', urgency: 'NORMAL' },
  { keyword: 'sofa', problemType: 'Sofa Cleaning or Shampooing', urgency: 'NORMAL' },
  { keyword: 'pest', problemType: 'Pest Control Service', urgency: 'HIGH' },
  { keyword: 'termite', problemType: 'Anti-Termite Treatment', urgency: 'NORMAL' }
];

const includes = (value, query) => String(value || '').toLowerCase().includes(query);

const calculateConfidenceScore = (serviceRequest, parsed, matchedCategory, matchedSkillIds) => {
  let score = 0;

  // Description Quality (0-0.3)
  const descLength = (serviceRequest.description || '').length;
  if (descLength > 100) score += 0.3;
  else if (descLength > 40) score += 0.2;
  else if (descLength > 10) score += 0.1;

  // Category Match (0-0.3)
  if (matchedCategory) score += 0.3;

  // Category Selection Bonus (0.2)
  if (serviceRequest.category && matchedCategory && 
      serviceRequest.category.toString() === matchedCategory._id.toString()) {
    score += 0.2;
  }

  // Skills Identification (0-0.2)
  if (matchedSkillIds && matchedSkillIds.length > 0) score += 0.2;

  // Location Specificity (0-0.1)
  if (serviceRequest.location && serviceRequest.location.addressLine1) score += 0.1;

  // Urgency Clarity (0-0.1)
  if (serviceRequest.urgency && serviceRequest.urgency !== 'NORMAL') score += 0.1;
  else if (parsed.urgency && parsed.urgency !== 'NORMAL') score += 0.1;

  // Visual Context Bonus (0-0.15)
  if (serviceRequest.attachments && serviceRequest.attachments.length > 0) {
    score += 0.15;
  }

  // Cap at 0.98 unless customer explicitly confirms
  return Math.min(score, 0.98);
};

const detectMissingInformation = (serviceRequest, parsed) => {
  const missing = [];
  
  if (!serviceRequest.location || !serviceRequest.location.addressLine1) {
    missing.push("Service location/address");
  }
  if (!serviceRequest.category && !parsed.categoryName) {
    missing.push("Category or service type");
  }
  if ((serviceRequest.description || '').length < 15) {
    missing.push("Basic problem description (please elaborate)");
  }
  if (!serviceRequest.attachments || serviceRequest.attachments.length === 0) {
    missing.push("Photos or attachments of the issue");
  }
  if (!serviceRequest.preferredSchedule || !serviceRequest.preferredSchedule.startAt) {
    missing.push("Preferred timing for the service");
  }

  if (parsed.missingInformation && Array.isArray(parsed.missingInformation)) {
    parsed.missingInformation.forEach(info => {
      if (!missing.includes(info)) missing.push(info);
    });
  }

  return missing;
};

const runFallbackAnalysis = async (serviceRequest, categories, skills) => {
  const text = `${serviceRequest.title} ${serviceRequest.description}`.toLowerCase();

  // PRIORITIZE USER'S SELECTED CATEGORY
  const selectedCategory = categories.find(c => c._id.toString() === serviceRequest.category?.toString());
  const matchedCategory = selectedCategory || categories.find((c) => includes(text, c.name));
  
  // Only match skills within the selected category
  const categorySkills = skills.filter(s => 
    !selectedCategory || s.category?.toString() === selectedCategory._id.toString()
  );
  const matchedSkills = categorySkills.filter((s) => includes(text, s.name)).slice(0, 5);
  const keyword = keywordMap.find((entry) => includes(text, entry.keyword));

  let specificDiagnostic = '';
  if (keyword) {
    specificDiagnostic = `Based on your description mentioning "${keyword.keyword}", this appears to be a ${keyword.problemType}. Common causes include wear and tear, lack of maintenance, or component failure. A verified technician can diagnose the exact issue and provide an accurate quote.`;
  } else {
    specificDiagnostic = `Your request has been analyzed. A qualified technician will inspect the issue, identify the root cause, and provide an accurate estimate for repair or replacement.`;
  }

  const missingInformation = [];
  if (!serviceRequest.preferredSchedule?.startAt) {
    missingInformation.push('Preferred schedule date & time');
  }

  return {
    source: 'FALLBACK_RULES',
    category: matchedCategory?._id || serviceRequest.category,
    subcategory: serviceRequest.service || null,
    requiredSkills: matchedSkills.map((s) => s._id),
    problemType: keyword?.problemType || 'Home Service Repair',
    urgency: keyword?.urgency || serviceRequest.urgency || 'NORMAL',
    diagnosticNotes: specificDiagnostic,
    suggestedTasks: [
      `Inspect the ${keyword?.keyword || 'appliance/area'} thoroughly`,
      `Identify broken or failing components`,
      `Provide cost estimate for replacement parts if needed`,
      `Complete repair with proper testing`
    ],
    missingInformation,
    confidence: 0.75,
    manualReviewRecommended: false,
    generatedAt: new Date(),
  };
};

const analyzeServiceRequest = async (serviceRequest) => {
  const [categories, skills] = await Promise.all([
    ServiceCategory.find({ isActive: true }).lean(),
    Skill.find({ isActive: true }).lean(),
  ]);

  if (!env.gemini?.apiKey || env.gemini.apiKey === 'your_gemini_api_key_here') {
    return runFallbackAnalysis(serviceRequest, categories, skills);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: env.gemini.apiKey });
    const modelName = env.gemini.model || 'gemini-2.5-flash';

    const selectedCategory = categories.find(c => c._id.toString() === serviceRequest.category?.toString());
    const selectedCategoryName = selectedCategory?.name || '';

    const categoryNames = categories.map((c) => c.name);
    const skillNames = skills.map((s) => s.name);

    const promptText = `You are CareConnect AI. Analyze this home service request and generate a structured JSON diagnosis for the customer and service providers.

IMPORTANT: The user has explicitly selected the category: "${selectedCategoryName}". You MUST analyze within this category context. DO NOT change the category.

Categories available: ${JSON.stringify(categoryNames)}
Skills available: ${JSON.stringify(skillNames)}

User Request Title: ${serviceRequest.title}
User Description: ${serviceRequest.description}
User Selected Category: ${selectedCategoryName}
Attached Images Count: ${serviceRequest.attachments?.length || 0}

Output strictly valid JSON with this exact schema:
{
  "categoryName": "<One matching category from available list>",
  "matchedSkills": ["<Array of matching skill names>"],
  "problemType": "<Specific technical problem title, e.g. 'Refrigerator Cooling Loss & Door Gasket Seal Failure'>",
  "diagnosticNotes": "<Detailed explanation for the user of why this problem occurs, potential root causes based on symptoms, what needs attention, and any immediate safety precautions. Keep it professional and empathetic.>",
  "suggestedTasks": [
    "<Specific actionable repair/service step 1>",
    "<Specific actionable repair/service step 2>",
    "<Specific actionable repair/service step 3>"
  ],
  "urgency": "<LOW|NORMAL|HIGH|EMERGENCY>",
  "missingInformation": ["<Details user should clarify if any, e.g., brand/model, exact error codes, or age of appliance>"]
}`;

    const contents = [];

    // If base64 image attached, send inline data part for multimodal analysis
    if (serviceRequest.attachments?.length > 0) {
      for (const attachment of serviceRequest.attachments) {
        if (attachment.url && attachment.url.startsWith('data:image')) {
          const base64Data = attachment.url.split(',')[1];
          const mimeType = attachment.url.split(';')[0].split(':')[1] || 'image/jpeg';
          contents.push({
            inlineData: {
              data: base64Data,
              mimeType,
            },
          });
        }
      }
    }

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    
    let matchedCategory = categories.find((c) => c.name.toLowerCase() === String(parsed.categoryName).toLowerCase());
    const categoryMismatch = serviceRequest.category && matchedCategory && 
      serviceRequest.category.toString() !== matchedCategory._id.toString();

    if (categoryMismatch) {
      console.warn('AI returned different category than user selected');
      // Force use user's selected category
      matchedCategory = categories.find(c => c._id.toString() === serviceRequest.category.toString());
    }

    const categorySkills = skills.filter(s => 
      !matchedCategory || s.category?.toString() === matchedCategory._id.toString()
    );
    const matchedSkillIds = categorySkills
      .filter((s) => (parsed.matchedSkills || []).some((ms) => ms.toLowerCase() === s.name.toLowerCase()))
      .map((s) => s._id);

    const confidenceScore = calculateConfidenceScore(serviceRequest, parsed, matchedCategory, matchedSkillIds);
    const missingInfo = detectMissingInformation(serviceRequest, parsed);

    return {
      source: 'GEMINI',
      category: matchedCategory?._id || serviceRequest.category,
      subcategory: serviceRequest.service || null,
      requiredSkills: matchedSkillIds,
      problemType: parsed.problemType || 'Home Service Request',
      diagnosticNotes: parsed.diagnosticNotes || 'AI processed request and derived scope requirements.',
      suggestedTasks: Array.isArray(parsed.suggestedTasks) && parsed.suggestedTasks.length > 0 
        ? parsed.suggestedTasks 
        : ['Inspect issue area', 'Diagnose root cause'],
      urgency: parsed.urgency || 'NORMAL',
      missingInformation: missingInfo,
      confidence: confidenceScore,
      manualReviewRecommended: confidenceScore < 0.7,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.warn('Gemini multimodal analysis error, falling back to deterministic rules:', error.message);
    return runFallbackAnalysis(serviceRequest, categories, skills);
  }
};

const reanalyzeAfterCorrection = async (originalUnderstanding, customerCorrection, serviceRequest) => {
  const [categories, skills] = await Promise.all([
    ServiceCategory.find({ isActive: true }).lean(),
    Skill.find({ isActive: true }).lean(),
  ]);

  if (!env.gemini?.apiKey || env.gemini.apiKey === 'your_gemini_api_key_here') {
    return {
      ...originalUnderstanding,
      diagnosticNotes: originalUnderstanding.diagnosticNotes + `\nCustomer added: ${customerCorrection}`,
      confidence: Math.min((originalUnderstanding.confidence || 0.65) + 0.2, 0.95),
      missingInformation: [],
      manualReviewRecommended: false,
      generatedAt: new Date()
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: env.gemini.apiKey });
    const modelName = env.gemini.model || 'gemini-2.5-flash';

    const selectedCategory = categories.find(c => c._id.toString() === serviceRequest.category?.toString());
    const selectedCategoryName = selectedCategory?.name || '';

    const categoryNames = categories.map((c) => c.name);
    const skillNames = skills.map((s) => s.name);

    const promptText = `You are CareConnect AI. You previously analyzed a home service request. The customer has provided corrections/additional information.
Re-analyze and generate a structured JSON diagnosis.

IMPORTANT: The user's selected category is: "${selectedCategoryName}". You MUST analyze within this category context. DO NOT change the category.

Categories available: ${JSON.stringify(categoryNames)}
Skills available: ${JSON.stringify(skillNames)}

Original Request Title: ${serviceRequest?.title || 'Unknown'}
Original Description: ${serviceRequest?.description || 'Unknown'}
User Selected Category: ${selectedCategoryName}
CUSTOMER CORRECTIONS / ADDITIONAL INFO: ${customerCorrection}

Output strictly valid JSON with this exact schema:
{
  "categoryName": "<One matching category from available list>",
  "matchedSkills": ["<Array of matching skill names>"],
  "problemType": "<Specific technical problem title, e.g. 'Refrigerator Cooling Loss & Door Gasket Seal Failure'>",
  "diagnosticNotes": "<Detailed explanation for the user of why this problem occurs, potential root causes based on symptoms, what needs attention, and any immediate safety precautions. Keep it professional and empathetic.>",
  "suggestedTasks": [
    "<Specific actionable repair/service step 1>",
    "<Specific actionable repair/service step 2>",
    "<Specific actionable repair/service step 3>"
  ],
  "urgency": "<LOW|NORMAL|HIGH|EMERGENCY>",
  "missingInformation": ["<Details user should clarify if any, e.g., brand/model, exact error codes, or age of appliance>"]
}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ text: promptText }],
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    let matchedCategory = categories.find((c) => c.name.toLowerCase() === String(parsed.categoryName).toLowerCase());
    const categoryMismatch = serviceRequest.category && matchedCategory && 
      serviceRequest.category.toString() !== matchedCategory._id.toString();

    if (categoryMismatch) {
      console.warn('AI returned different category than user selected');
      matchedCategory = categories.find(c => c._id.toString() === serviceRequest.category.toString());
    }

    const categorySkills = skills.filter(s => 
      !matchedCategory || s.category?.toString() === matchedCategory._id.toString()
    );
    const matchedSkillIds = categorySkills
      .filter((s) => (parsed.matchedSkills || []).some((ms) => ms.toLowerCase() === s.name.toLowerCase()))
      .map((s) => s._id);

    const enrichedRequest = { ...serviceRequest, description: (serviceRequest?.description || '') + ' ' + customerCorrection };
    const newConfidence = calculateConfidenceScore(enrichedRequest, parsed, matchedCategory, matchedSkillIds);
    const missingInfo = detectMissingInformation(enrichedRequest, parsed);

    return {
      source: 'GEMINI_REANALYZED',
      category: matchedCategory?._id || originalUnderstanding.category,
      subcategory: serviceRequest?.service || null,
      requiredSkills: matchedSkillIds.length > 0 ? matchedSkillIds : originalUnderstanding.requiredSkills,
      problemType: parsed.problemType || originalUnderstanding.problemType,
      diagnosticNotes: parsed.diagnosticNotes || originalUnderstanding.diagnosticNotes,
      suggestedTasks: Array.isArray(parsed.suggestedTasks) && parsed.suggestedTasks.length > 0 
        ? parsed.suggestedTasks 
        : originalUnderstanding.suggestedTasks,
      urgency: parsed.urgency || originalUnderstanding.urgency,
      missingInformation: missingInfo,
      confidence: newConfidence,
      manualReviewRecommended: newConfidence < 0.7,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.warn('Gemini re-analysis error:', error.message);
    return {
      ...originalUnderstanding,
      confidence: Math.min((originalUnderstanding.confidence || 0.7) + 0.1, 0.95),
      generatedAt: new Date()
    };
  }
};

const aiConcierge = async (conversationHistory) => {
  const [categories] = await Promise.all([
    ServiceCategory.find({ isActive: true }).lean()
  ]);

  const categoryNames = categories.map((c) => c.name);
  
  if (!env.gemini?.apiKey || env.gemini.apiKey === 'your_gemini_api_key_here') {
    return {
      needsClarification: false,
      title: "Service Request",
      categoryName: categoryNames[0] || "General",
      categoryId: categories[0]?._id,
      problemType: "General Repair",
      estimatedPriceMin: 400,
      estimatedPriceMax: 1500,
      technicalBrief: "Customer needs help with a home service issue. Please diagnose and fix.",
      urgency: "NORMAL"
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: env.gemini.apiKey });
    const modelName = env.gemini.model || 'gemini-2.5-flash';

    const systemPrompt = `You are CareConnect AI, an intelligent service concierge. 
The user wants to book a home service (like appliance repair, plumbing, electrical).
You need to analyze their request.
IMPORTANT: If the user indicates a specific category context, you MUST prioritize that category. DO NOT suggest AC repair for a painting request.
If their request is too vague to know the exact appliance or the general issue, you must ask a quick clarifying question.
If their request has enough detail to form a technical brief and estimate, you should output the details.

Available Categories: ${JSON.stringify(categoryNames)}

Output strictly valid JSON with this exact schema:
{
  "needsClarification": boolean, // true if you need to ask a question, false if you have enough detail
  "question": "The question to ask the user (if needsClarification is true)",
  "title": "Short title of the service request (if needsClarification is false)",
  "categoryName": "One matching category from available list (if needsClarification is false)",
  "problemType": "Specific technical problem title (if needsClarification is false)",
  "estimatedPriceMin": number (e.g. 500, if needsClarification is false),
  "estimatedPriceMax": number (e.g. 1200, if needsClarification is false),
  "technicalBrief": "Highly technical brief for the provider explaining what needs to be checked or replaced (if needsClarification is false)",
  "urgency": "LOW|NORMAL|HIGH|EMERGENCY (if needsClarification is false)"
}

Do not ask more than 2 questions overall in a flow. Make your questions very simple, like a multiple-choice hint.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I will respond with strictly valid JSON.' }] }
    ];

    // Format conversation history for Gemini (roles: 'user' and 'model')
    conversationHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      });
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    if (!parsed.needsClarification && parsed.categoryName) {
      const category = categories.find(c => c.name.toLowerCase() === parsed.categoryName.toLowerCase());
      if (category) {
        parsed.categoryId = category._id;
      } else {
        parsed.categoryId = categories[0]?._id; // fallback
      }
    }
    return parsed;
  } catch (error) {
    console.error('AI Concierge error:', error.message);
    return {
      needsClarification: false,
      title: "Service Request",
      categoryName: categoryNames[0] || "General",
      categoryId: categories[0]?._id,
      problemType: "General Repair",
      estimatedPriceMin: 200,
      estimatedPriceMax: 800,
      technicalBrief: "Fallback technical brief due to AI error.",
      urgency: "NORMAL"
    };
  }
};

module.exports = { analyzeServiceRequest, reanalyzeAfterCorrection, summarizeDispute: () => ({}), aiConcierge };