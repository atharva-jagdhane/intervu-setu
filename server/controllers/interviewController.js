import InterviewConfig from '../models/InterviewConfig.js';

// Pre-defined domain and role taxonomy
export const TAXONOMY = {
  'Software Engineering': [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Software Engineer'
  ],
  'Data Science & AI': [
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Engineer',
    'AI Engineer'
  ],
  'Data Engineering': [
    'Data Engineer'
  ],
  'Cloud & DevOps': [
    'DevOps Engineer'
  ],
  'HR & Behavioral': [
    'General HR & Culture Fit',
    'Leadership & Situational'
  ]
};

export const VALID_EXPERIENCE = ['Internship', 'Fresher / Entry-level', 'Junior Engineer'];
export const VALID_CATEGORIES = ['Technical', 'HR', 'Behavioral', 'Mixed'];
export const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

/**
 * @desc    Save new interview configuration
 * @route   POST /api/interview/config
 * @access  Private (Student only)
 */
export const createConfig = async (req, res) => {
  try {
    const { domain, role, experienceLevel, category, difficulty } = req.body;

    // 1. Validate required fields
    if (!domain || !role || !experienceLevel || !category || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'All configuration fields (domain, role, experienceLevel, category, difficulty) are required.'
      });
    }

    // 2. Validate domain & role against taxonomy
    if (!TAXONOMY[domain]) {
      return res.status(400).json({
        success: false,
        message: `Invalid domain '${domain}'. Allowed domains: ${Object.keys(TAXONOMY).join(', ')}`
      });
    }

    if (!TAXONOMY[domain].includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role '${role}' is not valid for domain '${domain}'.`
      });
    }

    // 3. Validate enum constraints
    if (!VALID_EXPERIENCE.includes(experienceLevel)) {
      return res.status(400).json({
        success: false,
        message: `Invalid experience level. Allowed: ${VALID_EXPERIENCE.join(', ')}`
      });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed: ${VALID_CATEGORIES.join(', ')}`
      });
    }

    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: `Invalid difficulty. Allowed: ${VALID_DIFFICULTIES.join(', ')}`
      });
    }

    // 4. Create record associated with authenticated student
    const config = await InterviewConfig.create({
      studentId: req.user._id,
      domain,
      role,
      experienceLevel,
      category,
      difficulty,
      status: 'configured'
    });

    res.status(201).json({
      success: true,
      message: 'Interview configuration created successfully.',
      config
    });
  } catch (error) {
    console.error('Create interview config error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving interview configuration.'
    });
  }
};

/**
 * @desc    Retrieve all interview configurations for authenticated student
 * @route   GET /api/interview/config
 * @access  Private (Student only)
 */
export const getMyConfigs = async (req, res) => {
  try {
    const configs = await InterviewConfig.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: configs.length,
      configs
    });
  } catch (error) {
    console.error('Get student configs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving configurations.'
    });
  }
};

/**
 * @desc    Retrieve single interview configuration with strict ownership check
 * @route   GET /api/interview/config/:id
 * @access  Private (Student only)
 */
export const getConfigById = async (req, res) => {
  try {
    const config = await InterviewConfig.findById(req.params.id);

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Interview configuration not found.'
      });
    }

    // Strict ownership verification: One student cannot read another student's config
    if (!config.studentId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this configuration.'
      });
    }

    res.status(200).json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Get single config error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving configuration details.'
    });
  }
};

/**
 * @desc    Get taxonomy metadata (domains, roles, difficulties, categories)
 * @route   GET /api/interview/taxonomy
 * @access  Public
 */
export const getTaxonomy = (req, res) => {
  res.status(200).json({
    success: true,
    taxonomy: TAXONOMY,
    experienceLevels: VALID_EXPERIENCE,
    categories: VALID_CATEGORIES,
    difficulties: VALID_DIFFICULTIES
  });
};
