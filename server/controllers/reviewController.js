import Review from '../models/Review.js';
import Room from '../models/Room.js';

// @desc    Get verified reviews for a room
// @route   GET /api/reviews/room/:roomId
// @access  Public
export const getRoomReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update verified review
// @route   POST /api/reviews/room/:roomId
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const roomId = req.params.roomId;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating and review comment.',
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room listing not found.',
      });
    }

    let review = await Review.findOne({ user: req.user._id, room: roomId });

    if (review) {
      review.rating = Number(rating);
      review.comment = comment.trim();
      await review.save();
    } else {
      review = await Review.create({
        user: req.user._id,
        room: roomId,
        rating: Number(rating),
        comment: comment.trim(),
      });
    }

    // Recompute room rating
    const allReviews = await Review.find({ room: roomId });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    room.rating = Number(avgRating.toFixed(1));
    room.reviewsCount = allReviews.length;
    await room.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Verified review posted successfully!',
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};
