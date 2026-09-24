const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env');
const ServiceCategory = require('../models/ServiceCategory');
const Skill = require('../models/Skill');

const keywordMap = [
  { keyword: 'ac', problemType: 'Air Conditioner Servicing & Gas Top-up', urgency: 'HIGH' },
  { keyword: 'refrigerator', problemType: 'Refrigerator Cooling & Gasket Repair', urgency: 'HIGH' },
  { keyword: 'mixer', problemType: 'Mixer Grinder Motor Repair or Blade Replacement', urgency: 'NORMAL' },
  { keyword: 'grinder', problemType: 'Wet Grinder Service & Repair', urgency: 'NORMAL' },
  { keyword: 'geyser', problemType: 'Water Geyser Heating Element or Thermostat Repair', urgency: 'HIGH' },
  { keyword: 'water purifier', problemType: 'RO Water Purifier Filter Change or Service', urgency: 'HIGH' },
  { keyword: 'chimney', problemType: 'Kitchen Chimney Motor Cleaning or Repair', urgency: 'NORMAL' },
  { keyword: 'inverter', problemType: 'Home Inverter Battery Charging Issue', urgency: 'HIGH' },
  { keyword: 'fan', problemType: 'Ceiling Fan Motor or Capacitor Repair', urgency: 'NORMAL' },
  { keyword: 'switch', problemType: 'Electrical Switchboard or Wiring Repair', urgency: 'HIGH' },
  { keyword: 'tap', problemType: 'Water Tap Leakage or Replacement', urgency: 'HIGH' },
  { keyword: 'sink', problemType: 'Kitchen Sink Drain Blockage or Leak Repair', urgency: 'NORMAL' },
  { keyword: 'door', problemType: 'Door Hinge, Lock or Handle Repair', urgency: 'NORMAL' },
  { keyword: 'window', problemType: 'Window Glass or Frame Repair', urgency: 'NORMAL' },
  { keyword: 'paint', problemType: 'Wall Painting or Touch-up Work', urgency: 'NORMAL' },
  { keyword: 'carpenter', problemType: 'Furniture Assembly or Repair', urgency: 'NORMAL' },
  { keyword: 'plumber', problemType: 'General Plumbing Repair or Installation', urgency: 'HIGH' },
  { keyword: 'electrician', problemType: 'General Electrical Repair or Installation', urgency: 'HIGH' },
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

  // Skills Identification (0-0.2)
  if (matchedSkillIds && matchedSkillIds.length > 0) score += 0.2;

  // Location Specificity (0-0.1)
  if (serviceRequest.location && serviceRequest.location.addressLine1) score += 0.1;

  // Urgency Clarity (0-0.1)
  if (serviceRequest.urgency && serviceRequest.urgency !== 'NORMAL') score += 0.1;
  else if (parsed.urgency && parsed.urgency !== 'NORMAL') score += 0.1;

  return Math.min(Math.max(score, 0), 1);
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

  const matchedCategory = categories.find((c) => includes(text, c.name));
  const matchedSkills = skills.filter((s) => includes(text, s.name)).slice(0, 5);
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

    const categoryNames = categories.map((c) => c.name);
    const skillNames = skills.map((s) => s.name);

    const promptText = `You are CareConnect AI. Analyze this home service request and generate a structured JSON diagnosis for the customer and service providers.

Categories available: ${JSON.stringify(categoryNames)}
Skills available: ${JSON.stringify(skillNames)}

User Request Title: ${serviceRequest.title}
User Description: ${serviceRequest.description}
Attached Images Count: ${serviceRequest.attachments?.length || 0}

Output strictly valid JSON with this exact schema:
{
  "categoryName": "<One matching category from available list>",
  "matchedSkills": ["<Array of matching skill names>"],
  "problemType": "<Specific technical problem title, e.g. 'Refrigerator Cooling Loss & Door Gasket Seal Failure'>",
  "diagnosticNotes": "<Detailed explanation for the user of why this problem occurs and what needs attention>",
  "suggestedTasks": [
    "<Specific action item 1>",
    "<Specific action item 2>",
    "<Specific action item 3>"
  ],
  "urgency": "<LOW|NORMAL|HIGH|EMERGENCY>",
  "missingInformation": ["<Details user should clarify if any>"]
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
    const matchedCategory = categories.find((c) => c.name.toLowerCase() === String(parsed.categoryName).toLowerCase());

    const matchedSkillIds = skills
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

    const categoryNames = categories.map((c) => c.name);
    const skillNames = skills.map((s) => s.name);

    const promptText = `You are CareConnect AI. You previously analyzed a home service request. The customer has provided corrections/additional information.
Re-analyze and generate a structured JSON diagnosis.

Categories available: ${JSON.stringify(categoryNames)}
Skills available: ${JSON.stringify(skillNames)}

Original Request Title: ${serviceRequest?.title || 'Unknown'}
Original Description: ${serviceRequest?.description || 'Unknown'}
CUSTOMER CORRECTIONS / ADDITIONAL INFO: ${customerCorrection}

Output strictly valid JSON with this exact schema:
{
  "categoryName": "<One matching category from available list>",
  "matchedSkills": ["<Array of matching skill names>"],
  "problemType": "<Specific technical problem title, e.g. 'Refrigerator Cooling Loss & Door Gasket Seal Failure'>",
  "diagnosticNotes": "<Detailed explanation for the user of why this problem occurs and what needs attention>",
  "suggestedTasks": [
    "<Specific action item 1>",
    "<Specific action item 2>",
    "<Specific action item 3>"
  ],
  "urgency": "<LOW|NORMAL|HIGH|EMERGENCY>",
  "missingInformation": ["<Details user should clarify if any>"]
}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ text: promptText }],
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const matchedCategory = categories.find((c) => c.name.toLowerCase() === String(parsed.categoryName).toLowerCase());
    const matchedSkillIds = skills
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

module.exports = { analyzeServiceRequest, reanalyzeAfterCorrection, summarizeDispute: () => ({}) };