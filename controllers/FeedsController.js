const Post = require("../models/Post"); // Assuming Post is already created

// Fetch Public Listings with Filters and Sorting
const getPublicListings = async (req, res) => {
  try {
    const { sport, postType, last7Days, withinMiles, sort } = req.query;
    let filters = {};

    // Filter by sport (array of sports)
    if (sport) {
      filters.sport = { $in: sport.split(",") }; // sport query param can be comma-separated
    }

    // Filter by post type
    if (postType) {
      filters.postType = postType;
    }

    // Filter by last 7 days
    if (last7Days) {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      filters.createdAt = { $gte: date };
    }

    // Filter by distance (requires coordinates)
    if (withinMiles && req.body.coordinates) {
      const milesToMeters = withinMiles * 1609.34; // Convert miles to meters
      filters.location = {
        $geoWithin: {
          $centerSphere: [
            [req.body.coordinates.longitude, req.body.coordinates.latitude],
            milesToMeters / 6378100,
          ], // radius in radians
        },
      };
    }

    // Query to get posts with filters
    let query = Post.find(filters);

    // Sorting
    if (sort === "mostRecent") {
      query = query.sort({ createdAt: -1 });
    } else if (sort === "nearest" && req.body.coordinates) {
      query = query.sort({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [
                req.body.coordinates.longitude,
                req.body.coordinates.latitude,
              ],
            },
          },
        },
      });
    }

    const posts = await query.exec();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error });
  }
};

// Fetch User's Own Listings
const getMyListings = async (req, res) => {
  try {
    const userId = req.userId;
    const myPosts = await Post.find({ userId, isDeleted: false });
    res.status(200).json(myPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your listings", error });
  }
};
// Edit User's Listing
const editListing = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    console.log(userId, post.userId.toString());
    console.log(post.userId.toString() === userId.toString());
    // Check if post belongs to user
    if (!post || post.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error editing listing", error });
  }
};
const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error editing listing", error });
  }
};

// Delete User's Listing
const deleteListing = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);

    // Check if post belongs to user
    if (!post || post.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting listing", error });
  }
};

// Create New Listing
const createListing = async (req, res) => {
  try {
    const { subject, body, postType, sport, location } = req.body;
    const userId = req.userId;

    const newPost = new Post({
      subject,
      body,
      postType,
      sport,
      location: location,
      userId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating listing", error });
  }
};

module.exports = {
  createListing,
  deleteListing,
  getMyListings,
  editListing,
  getPublicListings,
  getPost,
};
