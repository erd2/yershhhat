require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database setup
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            bio TEXT,
            skills TEXT, -- JSON array
            phone TEXT,
            github TEXT,
            projects TEXT,
            experience TEXT,
            education TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Insert default profile if none exists
    db.get('SELECT COUNT(*) as count FROM profiles', (err, row) => {
        if (err) {
            console.error('Error checking profiles:', err);
            return;
        }
        
        if (row.count === 0) {
            const defaultProfile = {
                name: 'Toleubayev Yershat',
                bio: 'Разработчик с фокусом на адаптивные решения и инновационные технологии',
                skills: JSON.stringify(['Адаптивность']),
                phone: '+77780958898',
                github: 'https://github.com',
                projects: 'Работа с языковыми моделями (LM) - разработка и внедрение решений на основе современных технологий искусственного интеллекта',
                experience: 'В разработке и изучении современных технологий. Фокус на практическом применении знаний.',
                education: 'Самообразование и практический опыт в области разработки программного обеспечения.'
            };

            const insertQuery = `
                INSERT INTO profiles (name, bio, skills, phone, github, projects, experience, education)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.run(insertQuery, [
                defaultProfile.name,
                defaultProfile.bio,
                defaultProfile.skills,
                defaultProfile.phone,
                defaultProfile.github,
                defaultProfile.projects,
                defaultProfile.experience,
                defaultProfile.education
            ], function(err) {
                if (err) {
                    console.error('Error inserting default profile:', err);
                } else {
                    console.log('Default profile inserted with ID:', this.lastID);
                }
            });
        }
    });
});

// Validation middleware
const validateProfile = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Имя должно содержать от 2 до 100 символов'),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Описание не должно превышать 500 символов'),
    body('phone').optional().isMobilePhone('any').withMessage('Введите корректный номер телефона'),
    body('github').optional().isURL().withMessage('Введите корректную ссылку'),
    body('skills').optional().isArray().withMessage('Навыки должны быть массивом'),
    body('projects').optional().trim().isLength({ max: 1000 }).withMessage('Описание проектов не должно превышать 1000 символов'),
    body('experience').optional().trim().isLength({ max: 1000 }).withMessage('Описание опыта не должно превышать 1000 символов'),
    body('education').optional().trim().isLength({ max: 1000 }).withMessage('Описание образования не должно превышать 1000 символов')
];

const validateContact = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Имя должно содержать от 2 до 100 символов'),
    body('email').isEmail().withMessage('Введите корректный email'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Сообщение должно содержать от 10 до 1000 символов')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// ===================================
// API Routes
// ===================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Get profile
app.get('/api/profile', (req, res) => {
    db.get('SELECT * FROM profiles ORDER BY updated_at DESC LIMIT 1', (err, profile) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        try {
            // Parse skills JSON
            const skills = profile.skills ? JSON.parse(profile.skills) : [];
            
            res.json({
                success: true,
                data: {
                    ...profile,
                    skills
                }
            });
        } catch (parseError) {
            console.error('Error parsing skills:', parseError);
            res.status(500).json({
                success: false,
                message: 'Error processing profile data'
            });
        }
    });
});

// Create profile
app.post('/api/profile', validateProfile, handleValidationErrors, (req, res) => {
    const {
        name,
        bio = '',
        skills = [],
        phone = '',
        github = '',
        projects = '',
        experience = '',
        education = ''
    } = req.body;

    const insertQuery = `
        INSERT INTO profiles (name, bio, skills, phone, github, projects, experience, education)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [
        name,
        bio,
        JSON.stringify(skills),
        phone,
        github,
        projects,
        experience,
        education
    ], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        // Get the created profile
        db.get('SELECT * FROM profiles WHERE id = ?', [this.lastID], (err, profile) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            try {
                const skills = profile.skills ? JSON.parse(profile.skills) : [];
                
                res.status(201).json({
                    success: true,
                    message: 'Profile created successfully',
                    data: {
                        ...profile,
                        skills
                    }
                });
            } catch (parseError) {
                console.error('Error parsing skills:', parseError);
                res.status(500).json({
                    success: false,
                    message: 'Error processing profile data'
                });
            }
        });
    });
});

// Update profile
app.put('/api/profile', validateProfile, handleValidationErrors, (req, res) => {
    const {
        name,
        bio = '',
        skills = [],
        phone = '',
        github = '',
        projects = '',
        experience = '',
        education = ''
    } = req.body;

    const updateQuery = `
        UPDATE profiles 
        SET name = ?, bio = ?, skills = ?, phone = ?, github = ?, projects = ?, experience = ?, education = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = (SELECT id FROM profiles ORDER BY updated_at DESC LIMIT 1)
    `;

    db.run(updateQuery, [
        name,
        bio,
        JSON.stringify(skills),
        phone,
        github,
        projects,
        experience,
        education
    ], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Get the updated profile
        db.get('SELECT * FROM profiles WHERE id = (SELECT id FROM profiles ORDER BY updated_at DESC LIMIT 1)', (err, profile) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            try {
                const skills = profile.skills ? JSON.parse(profile.skills) : [];
                
                res.json({
                    success: true,
                    message: 'Profile updated successfully',
                    data: {
                        ...profile,
                        skills
                    }
                });
            } catch (parseError) {
                console.error('Error parsing skills:', parseError);
                res.status(500).json({
                    success: false,
                    message: 'Error processing profile data'
                });
            }
        });
    });
});

// Get all profiles (admin endpoint)
app.get('/api/profiles', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db.all('SELECT * FROM profiles ORDER BY updated_at DESC LIMIT ? OFFSET ?', [limit, offset], (err, profiles) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        db.get('SELECT COUNT(*) as total FROM profiles', (err, countResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            try {
                const processedProfiles = profiles.map(profile => ({
                    ...profile,
                    skills: profile.skills ? JSON.parse(profile.skills) : []
                }));

                res.json({
                    success: true,
                    data: processedProfiles,
                    pagination: {
                        page,
                        limit,
                        total: countResult.total,
                        pages: Math.ceil(countResult.total / limit)
                    }
                });
            } catch (parseError) {
                console.error('Error parsing skills:', parseError);
                res.status(500).json({
                    success: false,
                    message: 'Error processing profiles data'
                });
            }
        });
    });
});

// Contact form submission
app.post('/api/contact', validateContact, handleValidationErrors, (req, res) => {
    const { name, email, message } = req.body;

    const insertQuery = `
        INSERT INTO contact_messages (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.run(insertQuery, [name, email, message], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully'
        });
    });
});

// Get contact messages (admin endpoint)
app.get('/api/messages', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db.all('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset], (err, messages) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        db.get('SELECT COUNT(*) as total FROM contact_messages', (err, countResult) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            res.json({
                success: true,
                data: messages,
                pagination: {
                    page,
                    limit,
                    total: countResult.total,
                    pages: Math.ceil(countResult.total / limit)
                }
            });
        });
    });
});

// ===================================
// Error Handling
// ===================================

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ===================================
// Server Start
// ===================================

// Close database connection on process termination
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Portfolio API server running on port ${PORT}`);
    console.log(`📱 API documentation: http://localhost:${PORT}/api/health`);
    console.log(`🔗 CORS enabled for: ${process.env.FRONTEND_URL || 'Multiple ports'}`);
});

module.exports = app;