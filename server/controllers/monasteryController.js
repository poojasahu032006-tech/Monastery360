const Monastery = require('../models/Monastery');

/**
 * @route   GET /api/monasteries
 * @desc    Get all monasteries with optional search, district, tag filtering
 * @access  Public
 */
const getMonasteries = async (req, res, next) => {
    try {
        const { search, district, tag, category } = req.query;
        const query = { isPublished: true };

        if (district && district !== 'all') {
            query.district = { $regex: new RegExp(district, 'i') };
        }

        const tagFilter = tag || category;
        if (tagFilter && tagFilter !== 'all') {
            query.tags = { $in: [new RegExp(`^${tagFilter}$`, 'i')] };
        }

        if (search && search.trim() !== '') {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { name: regex },
                { district: regex },
                { tags: regex },
                { shortDescription: regex },
                { address: regex },
            ];
        }

        const monasteries = await Monastery.find(query).sort({ popularity: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: monasteries.length,
            data: monasteries,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/monasteries/:id
 * @desc    Get single monastery details by ID
 * @access  Public
 */
const getMonasteryById = async (req, res, next) => {
    try {
        const monastery = await Monastery.findById(req.params.id);

        if (!monastery) {
            return res.status(404).json({
                success: false,
                message: 'Monastery not found',
            });
        }

        res.status(200).json({
            success: true,
            data: monastery,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Monastery not found',
            });
        }
        next(error);
    }
};

module.exports = {
    getMonasteries,
    getMonasteryById,
};
