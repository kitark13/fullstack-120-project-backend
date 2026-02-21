import createHttpError from 'http-errors';
import { Story } from '../models/story.js';
import { Category } from '../models/category.js';
import { User } from '../models/user.js';

/**
 *  ПУБЛІЧНИЙ ендпоінт для
 * ОТРИМАННЯ історій + пагінація + фільтрація за категорією
 */

export const getStoriesController = async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};

  if (category) {
    filter.category = category;
  }

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .populate('category', 'name')
      .populate('ownerId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Story.countDocuments(filter),
  ]);

  res.status(200).json({
    stories,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

// Публічний ендпоінт для отримання конкретної історії

export const getStoryByIdController = async (req, res) => {
  const { storyId } = req.params;

  const story = await Story.findById(storyId)
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl');

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json({
    data: story,
  });
};

//PRIVATE

/**
 * ПРИВАТНИЙ ендпоінт для
 * ДОДАВАННЯ історії до збережених історій користувача
 */

export const addSavedStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const story = await Story.exists({ _id: storyId });
  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  // Додаємо до savedStories без дублікатів
  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      savedStories: { $ne: storyId }, // перевірка що ще не збережено
    },
    { $addToSet: { savedStories: storyId } },
    { returnDocument: 'after' },
  ).populate({
    path: 'savedStories',
    populate: [
      { path: 'ownerId', select: 'name avatarUrl' },
      { path: 'category', select: 'name' },
    ],
  });

  // якщо user !== null → реально додали
  if (user) {
    await Story.updateOne({ _id: storyId }, { $inc: { favoriteCount: 1 } });
    return res.status(200).json({ data: user.savedStories });
  }

  const updatedUser = await User.findById(userId).populate({
    path: 'savedStories',
    populate: [
      { path: 'ownerId', select: 'name avatarUrl' },
      { path: 'category', select: 'name' },
    ],
  });

  res.status(200).json({
    data: updatedUser.savedStories,
  });
};

/**
 * ПРИВАТНИЙ ендпоінт для
 * ВИДАЛЕННЯ історії зі збережених історій користувача
 */

export const removeSavedStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const story = await Story.exists({ _id: storyId });
  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      savedStories: storyId, // тільки якщо існує
    },
    { $pull: { savedStories: storyId } },
    { returnDocument: 'after' },
  ).populate({
    path: 'savedStories',
    populate: [
      { path: 'ownerId', select: 'name avatarUrl' },
      { path: 'category', select: 'name' },
    ],
  });

  if (user) {
    await Story.updateOne(
      { _id: storyId, favoriteCount: { $gt: 0 } },
      { $inc: { favoriteCount: -1 } },
    );
    return res.status(200).json({ data: user.savedStories });
  }

  const updatedUser = await User.findById(userId).populate({
    path: 'savedStories',
    populate: [
      { path: 'ownerId', select: 'name avatarUrl' },
      { path: 'category', select: 'name' },
    ],
  });

  res.status(200).json({
    data: updatedUser.savedStories,
  });
};

/**
 * ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ збережених історій + пагінація
 */

export const getSavedStoriesController = async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;

    const savedIds = req.user.savedStories ?? [];
    const total = savedIds.length;

    const skip = (page - 1) * limit;

    if (total === 0) {
      return res
        .status(200)
        .json({ data: [], pagination: { page, limit, total, totalPages: 0 } });
    }

    const stories = await Story.find({
      _id: { $in: savedIds },
    })
      .populate('ownerId', 'name avatarUrl')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: stories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    throw createHttpError(500, 'Помилка при отриманні збережених історій');
  }
};

/**
 * ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ власних історій користувача (автора) + пагінація
 */

export const getMyStoriesController = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const userId = req.user._id;

  const skip = (page - 1) * limit;

  const filter = { ownerId: userId };

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Story.countDocuments(filter),
  ]);

  res.status(200).json({
    data: stories,
    pagination: {
      page: page,
      limit: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

/**
 * ПРИВАТНИЙ ендпоінт для
 * СТВОРЕННЯ історії
 */

export const createStoryController = async (req, res) => {
  const { img, title, article, category, date } = req.body;
  const ownerId = req.user._id;

  const categoryExists = await Category.exists({ _id: category });
  if (!categoryExists) {
    throw createHttpError(404, 'Category not found');
  }

  const story = await Story.create({
    img,
    title,
    article,
    category,
    ownerId,
    date,
  });

  // Інкрементуємо кількість статей автора
  await User.findByIdAndUpdate(ownerId, {
    $inc: { articlesAmount: 1 },
  });

  const populatedStory = await Story.findById(story._id)
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl');

  res.status(201).json({
    data: populatedStory,
  });
};

/**
 * ПРИВАТНИЙ ендпоінт для
 * РЕДАГУВАННЯ історії
 */

export const updateStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;
  const updateData = req.body;

  const story = await Story.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  // Перевірка власника
  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'You are not allowed to edit this story');
  }

  // Якщо оновлюється категорія — перевірити її
  if (updateData.category) {
    const categoryExists = await Category.findById(updateData.category);
    if (!categoryExists) {
      throw createHttpError(404, 'Category not found');
    }
  }

  const updatedStory = await Story.findByIdAndUpdate(storyId, updateData, {
    new: true,
  })
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl');

  res.status(200).json({
    data: updatedStory,
  });
};

/**
 * ПРИВАТНИЙ ендпоінт для
 * ВИДАЛЕННЯ історії
 */

export const deleteStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const story = await Story.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  // Перевірка власника
  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'You are not allowed to delete this story');
  }

  // Видаляємо історію
  await Story.findByIdAndDelete(storyId);

  // Декремент кількості статей автора
  await User.findByIdAndUpdate(userId, {
    $inc: { articlesAmount: -1 },
  });

  // Видаляємо storyId зі savedStories всіх користувачів
  await User.updateMany(
    { savedStories: storyId },
    { $pull: { savedStories: storyId } },
  );

  res.status(204).send();
};
