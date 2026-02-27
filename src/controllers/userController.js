import { User } from '../models/user.js';
import { Story } from '../models/story.js';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// GET /api/users - публічний ендпоінт з пагінацією
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    throw createHttpError(500, 'Помилка при отриманні користувачів');
  }
};

// GET /api/users/:id - публічний ендпоінт дані користувача + список статей
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, perPage = 6 } = req.query;

    const pageNumber = page;
    const perPageNumber = perPage;
    const skip = (pageNumber - 1) * perPageNumber;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    const totalStories = await Story.countDocuments({
      ownerId: user._id,
    });

    const totalPages = Math.ceil(totalStories / perPageNumber);

    const stories = await Story.find({
      ownerId: user._id,
    })
      .select('title article img category date favoriteCount createdAt')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPageNumber)
      .lean();

    res.status(200).json({
      user,
      stories,
      pagination: {
        total: totalStories,
        page,
        perPage,
        totalPages,
      },
    });
  } catch {
    throw createHttpError(500, 'Помилка при отриманні користувачів');
  }
};

// GET /api/users/me - приватний ендпоінт інформація про поточного користувача
export const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};

// PATCH /api/users/avatar - приватний ендпоінт оновлення аватару
export const updateUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    const result = await saveFileToCloudinary(req.file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: result.secure_url },
      { new: true, runValidators: true },
    );

    res.status(200).json({ url: updatedUser.avatarUrl });
  } catch {
    throw createHttpError(500, 'Помилка при оновленні аватару');
  }
};

// PATCH /api/users - приватний ендпоінт оновлення даних користувача
export const updateUser = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Жодних даних для оновлення' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });

    res.status(200).json({
      message: 'Дані користувача оновлено',
      user,
    });
  } catch {
    throw createHttpError(500, 'Помилка при оновленні даних');
  }
};
